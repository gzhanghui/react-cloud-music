import request from '@/common/js/request';

export const getMvUrl=function(id){
    const url = '/api/mv/url';
    return request.get(url, {
        params: {
            id,
        }
    }).then((res) => {
        return Promise.resolve(res.data)
    })
}
