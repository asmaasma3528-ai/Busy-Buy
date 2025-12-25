import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    updateProfile,
    signOut
} from "firebase/auth";

//  initial State

const initialState = {
    user : null,
    loading : false,
    error : null,
    message : ""
}

const auth = getAuth();

//Thunk functions

export const login = createAsyncThunk("user/signin", 
  async ({email, password}, {rejectWithValue}) => {
    try{
     const res = await signInWithEmailAndPassword(auth, email, password);

     return res.user

    }catch(err){
        return rejectWithValue(err.message);
    }
  }
)

export const signup = createAsyncThunk("user/signup", 
    async ({name, email, password}, {rejectWithValue}) => {
        try{
         const res = await createUserWithEmailAndPassword(auth, email, password);

         await updateProfile(auth.currentUser, {
            displayName:name
          });

          return res.user;

        }catch(err){
            return rejectWithValue(err.message);
        }
    }
)

export const logout = createAsyncThunk("user/logout", 
   async(_, {rejectWithValue}) => {
        try{
         
        await signOut(auth);

        }catch(err){
            return rejectWithValue(err.message);
        }
    }
)

//create slice function

const authSlice = createSlice({
    name:'auth',
    initialState,
    reducers:{
        setAuth(state, action) {
            state.user = action.payload;
        },

        clearError(state) {
            state.loading = false;
            state.error = null;
            state.message = "";
        }
    },

    extraReducers:(builder) => {
        builder
        //login
        .addCase(login.pending, (state) => {
            state.loading = true;
        })
        .addCase(login.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
        })
        .addCase(login.rejected, (state, action) => {
            state.loading = false;
            state.error = true;
            state.message = action.payload;
        })

        //signin
        .addCase(signup.pending, (state) => {
            state.loading = true;
        })
        .addCase(signup.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
        })
        .addCase(signup.rejected, (state, action) => {
            state.loading = false;
            state.message = action.payload;
            state.error = true;
        })
        //signout
        .addCase(logout.fulfilled, (state) => {
            state.user = null;
        })
        .addCase(logout.rejected, (state, action) => {
            state.loading = false;
            state.message = action.payload;
        })
    }
});

//selectors
export const getUser = (state) => state.auth.user;
export const getLoadingStatus = (state) => state.auth.loading;
export const geterrorMsg = (state) => state.auth.error;
export const getMessage = (state) => state.auth.message;

//actions
export const { setAuth, clearError } = authSlice.actions;
export const authReducer = authSlice.reducer;