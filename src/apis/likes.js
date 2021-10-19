import request from '@/common/js/request';
export const getLikelist = function (uid = `1422259951`) {
    const url = '/api/likelist';
    return request.get(url, {
        params: {
            uid
        }
    }).then((res) => {
        return res.data
    }).then(res => {
        const ids = res.ids.join(',')
        return request.get(`/api/song/detail`, {
            params: {
                ids,
            }
        }).then((res) => {
            return Promise.resolve(res.data)
        })
    })
};



export const getPlaylist = function (uid = `1422259951`) {
    const url = '/api/user/playlist';
    return request.get(url, {
        params: {
            uid
        }
    }).then((res) => {
        return res.data
    })
};

