import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { doc,  getDoc, updateDoc, setDoc, arrayUnion } from "firebase/firestore"
import { toast } from "react-toastify";

import { getProductsUsingProductIds, getUserCartProducts } from "../../utils/utils";
import { db } from "../../config/firebase";

const defaultState = {
    cartProducts : [],
    cartProductsMap : {},
    loading:false,
    error : null,
    message : "",
    purchasing : false,
}

export const fetchProducts = createAsyncThunk("cart/fetch", 
    async ({userId}, {rejectWithValue}) => {
        try{
        
        const { data } = await getUserCartProducts(userId);
        const { myCart } = data;

        if(!myCart || Object.keys(myCart).length === 0){
            toast.error("No products in the cart!!");
            return rejectWithValue("Empty cart");
        }

        const productsData = await getProductsUsingProductIds(myCart);

        return { cart:myCart, productsData }

        }catch(err){
           return rejectWithValue(err.message);
        }
    }
)

export const deleteProducts = createAsyncThunk("cart/delete", 
    async ({userId, productId}, {rejectWithValue}) => {
        try{
        
        const { docRef, data } = await getUserCartProducts(userId);
        const { myCart } = data;

        if(!myCart[productId]){
           toast.error("Product with id not found!!");
        }

        delete myCart[productId];

        await updateDoc(docRef, {myCart});

        return {productId};

        }catch(err){
            rejectWithValue(err.message);
        }
    }
)

export const purchaseProducts = createAsyncThunk("cart/purchase", 
    async ({userId}, {getState, rejectWithValue}) => {
        try{
        
        const state = getState();

        const snapShot = state.cart.cartProductsMap;

        const docRef = doc(db, "usersOrders", userId);

        const docSnap = await getDoc(docRef);

        if(docSnap.exists()){
          await updateDoc(docRef, {
            orders : arrayUnion({
                ...snapShot,
            date:Date.now(),
            })
          }
          )
        }else{
            await setDoc(docRef, {
                oreders:[{...snapShot, date:Date.now()}]
            })
        }

        }catch(err){
            return rejectWithValue(err.message);
        }
    }
);

export const clearCart = createAsyncThunk("clear/cart", 
    async ({userId}, {rejectWithValue}) => {
        try{
           
         const cartItems = doc(db, "usersCart", userId);
         await updateDoc(cartItems, {myCart:{}})

        }catch(err){
            return rejectWithValue(err.message);
        }
    }
)

//Helper function
export const deleteCartItemsLocally = ( state, productId ) => {

    delete state.cartProductsMap[productId];
    
    state.cartProducts = state.cartProducts.filter((item) => item.id !== productId);
   }

   //create slice function
   const cartSlice = createSlice({
    name:"cart",
    initialState:defaultState,
    reducers:{
        updateProductQuantity:(state, action) => {
            const { id, type } = action.payload;

            const currentQuantity = state.cartProductsMap[id];
            let newQuantity = currentQuantity;

            if(type === "add"){
                newQuantity += 1;
            };

            if(type === "remove" && currentQuantity > 1){
                newQuantity -= 1;
            }

            state.cartProductsMap[id] = newQuantity;

            const product = state.cartProducts.find((p) => p.id === id);

            if(product){
            product.quantity = newQuantity;
            }
        },

        clearErrorMsg : (state) => {
            state.error = null;
            state.message = "";
        }
    },

    extraReducers:(builder) => {
        builder
        //fetch products
        .addCase(fetchProducts.pending, (state) => {
            state.loading = true;
        })
        .addCase(fetchProducts.fulfilled, (state, action) => {
            state.loading = false;
            state.cartProducts = action.payload.cart;
            state.cartProductsMap = action.payload.productsData;
        })
        .addCase(fetchProducts.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })

        //delete
        .addCase(deleteProducts.pending, (state, action) => {
            state.loading = true;
            state.error = null
        })
        .addCase(deleteProducts.fulfilled, (state, action) => {
            deleteCartItemsLocally(state, action.payload.productId);
            toast.success("Item removed successfully from the cart.");
        })
        .addCase(deleteProducts.rejected, (state) => {
             state.pending = false;
             state.error = null;
           })

           //purchasing products
           .addCase(purchaseProducts.pending, (state) => {
            state.loading = true;
            state.error = null;
           })
           .addCase(purchaseProducts.fulfilled, (state, action) => {
            state.pending = false;
            state.cartProducts = {};
            state.cartProductsMap = [];
           })
           .addCase(purchaseProducts.pending, (state, action) => {
            state.pending = false;
            state.error = action.payload;
           })

           //clear
           .addCase(clearCart.fulfilled, (state) => {
            state.cartProducts = {};
            state.cartProductsMap = [];
           })
           .addCase(clearCart.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
           })
    }
   });

   //selectors
   export const getCartProducts = (state) => state.cart.cartProducts;
   export const getCartProductsMap = (state) => state.cart.cartProductsMap;
   export const getLoading = (state) => state.cart.loading;
   export const getError = (state) => state.cart.error;
   export const getMessage = (state) => state.cart.message;
   export const getPurchasing = (state) => state.cart.purchasing;

   //actions
   export const { updateProductQuantity,  clearErrorMsg} = cartSlice.actions;

   //reducer 
  export const cartReducer = cartSlice.reducer;
