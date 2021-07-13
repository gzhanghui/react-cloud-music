import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { login as LoginApi } from 'apis/login'
const initialState = {
    password: `hui822520`,
    name: `13029678009`,
    type: `phone`,
    loginBox: false,
    loading: false,
    userInfo: {}
};
export const loginThunk = createAsyncThunk(
    'login/login',
    async ({name, password, type}) => {
        const res = await LoginApi(name, password, type);
        return res;
    }
);
export const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {
        setPassWord: (state, action) => {
            state.password = action.payload
        },
        setName: (state, action) => {
            state.name = action.payload
        },
        setType: (state, action) => {
            state.type = action.payload
        },
        setLoginBox: (state, action) => {
            state.loginBox = action.payload
        },
        setLoading: (state, action) => {
            state.loading = action.payload
        },
    },
    extraReducers: {

        [loginThunk.fulfilled]: (state, action) => {
            state.userInfo = action.payload
        },

    }

});

export const {
    setPassWord,
    setName,
    setType,
    setLoading,
    setLoginBox
} = loginSlice.actions;


export const getPassWord = (state) => state.login.password;
export const getName = (state) => state.login.name;
export const getType = (state) => state.login.type;
export const getUserInfo = (state) => state.login.userInfo;
export const getloginBox = (state) => state.login.loginBox;
export const getLoading = (state) => state.login.loading;

export const login = () => (dispatch, getState) => {
    const name = getName(getState());
    const password = getPassWord(getState());
    const type = getType(getState());
    dispatch(loginThunk({name, password, type}));
};

export default loginSlice.reducer;
