import request from '@/common/js/request';
/**
 * 获取歌曲url
 * @param {Array} id 
 * @returns 
 */
export const getSongUrl = function (id) {
    const url = '/api/song/url';
    return request.get(url, {
        params: {
            id,
        }
    }).then((res) => {
        return Promise.resolve(res.data)
    })
}

/**
 * 获取音乐详情
 * @param {id Array} ids 
 * @returns 
 */
export const songDetail=function(ids){
    const url = '/api/song/detail';
    return request.get(url, {
        params: {
            ids,
        }
    }).then((res) => {
        return Promise.resolve(res.data)
    })
}

/**
 * 获取歌曲id
 * @param {id} id 
 * @returns 
 */
export const getLyric=function(id){
    const url = '/api/lyric';
    return request.get(url, {
        params: {
            id,
        }
    }).then((res) => {
        return Promise.resolve(res.data)
    })
}
