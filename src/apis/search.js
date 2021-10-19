import request from '@/common/js/request';
export const getHotDetail = function () {
    const url = '/api/search/hot/detail';
    return request.get(url).then((res) => {
        return Promise.resolve(res.data)
    })
}


export const getSuggest = function (keyword="") {
    const url = `/api/search/suggest?keywords=${keyword}`;
    return request.get(url).then((res) => {
        return Promise.resolve(res.data)
    })
}

