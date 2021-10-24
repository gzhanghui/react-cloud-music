import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { get } from "lodash";
import { login as LoginApi, loginState, logout } from 'apis/login'
import utils from 'common/js/util'
const ACCESS_TOKEN = '__music_assess_token__'
const USER_INFO = '__music_userinfo__'
const initialState = {
    password: `hui822520`,
    name: `13029678009`,
    type: `phone`,
    loginBox: false,
    loading: false,
    userInfo: {},
    loginStatus: false,
};
export const loginThunk = createAsyncThunk(
    'login/login',
    async ({ name, password, type }) => {
        const res = await LoginApi(name, password, type);
        utils.storage.set(ACCESS_TOKEN, get(res, 'data.token'))
        utils.storage.set(USER_INFO, res.data)
        return res;
    }
);
export const statusThunk = createAsyncThunk(
    'login/status',
    async () => {
        const res = await loginState();
        return res.data;
    }
);
export const logoutThunk = createAsyncThunk(
    'login/logout',
    async () => {
        const res = await logout();
        return res.data;
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
            state.loginBox = false
            state.loginStatus = true
        },
        [statusThunk.fulfilled]: (state, action) => {
            state.loginStatus = action.payload
            state.userInfo = action.payload
        },
        [logoutThunk.fulfilled]: (state, action) => {
            state.loginStatus = action.payload
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
export const getLoginBox = (state) => state.login.loginBox;
export const getLoading = (state) => state.login.loading;
export const getStatus = (state) => state.login.loginStatus;

export const login = () => (dispatch, getState) => {
    const name = getName(getState());
    const password = getPassWord(getState());
    const type = getType(getState());
    dispatch(loginThunk({ name, password, type }));
};
export const loginStatus = () => (dispatch) => {
    dispatch(statusThunk());
};
export default loginSlice.reducer;
