import axios from 'axios';


export const getHotDetail = function () {
    const url = '/api/search/hot/detail';
    return axios.get(url).then((res) => {
        return Promise.resolve(res.data)
    })
}


export const getSuggest = function (keyword="") {
    const url = `/api/search/suggest?keywords=${keyword}`;
    return axios.get(url).then((res) => {
        return Promise.resolve(res.data)
    })
}

