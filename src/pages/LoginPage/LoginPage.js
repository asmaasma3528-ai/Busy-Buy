import React, { useRef, useEffect } from "react";
import { toast } from "react-toastify";
import styles from "./LoginPage.module.css";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { authStart, authSuccess, authFailure, logout, authSelector } from "../../redux/reducers/authReducer";


const LoginPage = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user, isLoading, isAuthenticated, error } = useSelector(authSelector);

  const emailRef = useRef();
  const passwordRef = useRef();

    // If user is authenticated redirect him to home page
    useEffect(() => {
      if(isAuthenticated){
        navigate("/")
      }
    }, [isAuthenticated, navigate]);
    // If some error occurs display the error
     useEffect(() => {
      if(error){
        alert(error)
      }
     }, [error]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const emailVal = emailRef.current.value;
    const passwordVal = passwordRef.current.value;

    // Form validation
    if (emailVal === "" || passwordVal === "" || passwordVal.length < 6) {
      return toast.error("Please enter valid data!");
    }
    // write function here to login the user using redux
  };

  return (
    <div className={styles.formContainer}>
      <form className={styles.form} onSubmit={onSubmitHandler}>
        <h2 className={styles.loginTitle}>Sign In</h2>
        <input
          type="email"
          name="email"
          ref={emailRef}
          className={styles.loginInput}
          placeholder="Enter Email"
        />
        <input
          type="password"
          name="password"
          ref={passwordRef}
          className={styles.loginInput}
          placeholder="Enter Password"
        />
        <button className={styles.loginBtn}>
          {loading ? "..." : "Sign In"}
        </button>
        <NavLink
          to="/signup"
          style={{
            textDecoration: "none",
            color: "#224957",
            fontFamily: "Quicksand",
          }}
        >
          <p style={{ fontWeight: "600", margin: 0 }}>Or SignUp instead</p>
        </NavLink>
      </form>
    </div>
  );
};

export default LoginPage;
