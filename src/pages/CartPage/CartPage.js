import React, { useEffect, useState } from "react";
import Loader from "../../components/UI/Loader/Loader";
import ProductList from "../../components/Product/ProductList/ProductList";
import styles from "./CartPage.module.css";
import { fetchProducts, getCartProducts, getLoading, purchaseProducts, clearCart } from "../../redux/reducers/cartReducer";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CartPage = () => {

   const [ purchasing, setPurchasing ] = useState(false);

   const cartProducts = useSelector(getCartProducts);
   const loading = useSelector(getLoading);

   const dispatch = useDispatch();
   const navigate = useNavigate();

  // Fetch all cart products for the user
    useEffect(() => {
      dispatch(fetchProducts());
    }, [dispatch]);

  const purchaseProductsHandler = async () => {
    // Write code to purchase the item present in the cart
    // Redirect the user to orders page after successful purchase
    // Clear the item present in the cart after successful purchase
   try{
  
         setPurchasing(true);

          await dispatch(purchaseProducts());

          await dispatch(clearCart());

         navigate("/myorders");

   }catch(err){
    toast.error(err.message);
   }finally{
    setPurchasing(false);
   }
  };

 const totalPrice = cartProducts.reduce((total, item) => {
 return total + item.price * item.quantity
}, 0);

  if (loading) return <Loader />;

  return (
    <div className={styles.cartPageContainer}>
      {/*cartProduct here is the array of item present in the cart for the user you can change this as per your need */}
      {!!cartProducts?.length && (
        <aside className={styles.totalPrice}>
          <p>TotalPrice:- ₹{totalPrice}/-</p>
          <button
            className={styles.purchaseBtn}
            onClick={purchaseProductsHandler}
          >
            {purchasing ? "Purchasing" : "Purchase"}
          </button>
        </aside>
      )}
      {!!cartProducts?.length ? (
        <ProductList />
      ) : (
        <h1>Cart is Empty!</h1>
      )}
    </div>
  );
};

export default CartPage;
