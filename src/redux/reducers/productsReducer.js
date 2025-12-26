import { db } from "../../config/firebase";
import { collection, getDocs } from "firebase/firestore";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

//Initial state
const initialState = {
    items : [],
    visibleItems : [],
    loading : false,
    error : null
}

//create async thunk functions
export const fetchProducts = createAsyncThunk("fetch/products", 
    async (_, {rejectWithValue}) => {
        try{
       
        const snapShot = await getDocs(collection(db, "products"));
        const productList = snapShot.docs.map((doc) =>({
            id : doc.id,
            ...doc.data(),
        })
        )

        return productList;

        }catch(err){
            return rejectWithValue(err.message);
        }
    }
)

//create slice function
const productSlice = createSlice({
    name:"products",
    initialState,
    reducers:{
        getFilters:(state, action) => {
            const { searchText, maxPrice, selectedCategory } = action.payload;

            let updatedCategory = [...state.items];
            //search by title
            if(searchText?.trim()){
                updatedCategory = updatedCategory.filter((item) => 
                item.title.toLowerCase().includes(searchText.toLowerCase())
            )
            }

            //category filters 
            const activeCategories  = Object.keys(selectedCategory).filter((item) => selectedCategory[item]);

            if(activeCategories.length){
                updatedCategory = updatedCategory.filter((item) => 
                activeCategories.includes(item.category)
            )
            }

            //price filter
            if(maxPrice){
                updatedCategory = updatedCategory.filter((item) => 
                item.price <= maxPrice
                )
            }

            state.visibleItems = updatedCategory
        },

        resetFilter : (state) => {
            state.visibleItems = state.items;
        }
    },
    extraReducers: (builder) => {
        builder
          .addCase(fetchProducts.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(fetchProducts.fulfilled, (state, action) => {
            state.loading = false;
            state.items = action.payload;
            state.visibleItems = action.payload;
          })
          .addCase(fetchProducts.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
          })
    } 
});

//selectors
export const getAllItems = (state) => state.products.items;
export const getVisibleItems = (state) => state.products.visibleItems;
export const getLoading = (state) => state.products.loading;
export const getError = (state) => state.products.error;

//actions 
export const { getFilters, resetFilter } = productSlice.actions;

//reducer
export const productReducer = productSlice.reducer;