import axios from 'axios';

export const login = function (name, password, type = 'phone') {
    const t = type === 'phone' ? 'cellphone' : type
    debugger
    const url = `/api/login/${t}`;
    return axios.post(url, {
        [type]:name,
        password
    }).then((res) => {
        return Promise.resolve(res.data)
    })
};

export const loginState = function () {
    const url = `/api/login/status`;
    return axios.post(url, {

    }).then((res) => {
        return Promise.resolve(res.data)
    })
};
