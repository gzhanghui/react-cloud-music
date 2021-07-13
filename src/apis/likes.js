import axios from 'axios';

export const getLikelist = function (uid = `1422259951`) {
    const url = '/api/likelist';
    return axios.get(url, {
        params: {
            uid
        }
    }).then((res) => {
        return res.data
    }).then(res => {
        const ids = res.ids.join(',')
        return axios.get(`/api/song/detail`, {
            params: {
                ids,
            }
        }).then((res) => {
            return Promise.resolve(res.data)
        })
    })
};


