import request from '@/common/js/request';

export const getDetail = function (uid) {
    const url = `/api/user/detail`;
    return request.get(url, {
        params: {
            uid
        }
    }).then((res) => {
        return Promise.resolve(res.data)
    })
};

export const getUserLevel = function (uid) {
    const url = `/api/user/level`;
    return request.get(url, {
        params: {
            uid
        }
    }).then((res) => {
        return Promise.resolve(res.data)
    })
};
