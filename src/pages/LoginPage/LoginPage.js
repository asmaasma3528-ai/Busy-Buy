import React, { useRef, useEffect } from "react";
import { toast } from "react-toastify";
import styles from "./LoginPage.module.css";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { login, getUser, getLoadingStatus, getErrorMsg } from "../../redux/reducers/authReducer";
import Home from "../HomePage/HomePage.js";

const LoginPage = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector(getUser);
    const error = useSelector(getErrorMsg);
    const loading = useSelector(getLoadingStatus);

  const emailRef = useRef();
  const passwordRef = useRef();

    // If user is authenticated redirect him to home page
      useEffect(() => {
        if(user){
          return navigate("/");
        }
        if(error){
          return toast.error(error);
        }
      }, [user, error, navigate]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const emailVal = emailRef.current.value;
    const passwordVal = passwordRef.current.value;

    // Form validation
    if (emailVal === "" || passwordVal === "" || passwordVal.length < 6) {
      return toast.error("Please enter valid data!");
    }
    // write function here to login the user using redux
    dispatch(login({ email:emailVal, password:passwordVal }))
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
