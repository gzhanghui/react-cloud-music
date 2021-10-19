import request from '@/common/js/request';

export const login = function (name, password, type = 'phone') {
    const t = type === 'phone' ? 'cellphone' : type
    const url = `/api/login/${t}`;
    return request.post(url, {
        [type]:name,
        password
    }).then((res) => {

        return Promise.resolve(res.data)
    })
};

export const loginState = function () {
    const url = `/api/login/status`;
    return request.post(url, {

    }).then((res) => {
        return Promise.resolve(res.data)
    })
};
export const logout = function () {
    const url = `/api/logout`;
    return request.post(url, {

    }).then((res) => {
        return Promise.resolve(res.data)
    })
};
