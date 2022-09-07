
class HttpException extends Error {
    constructor(message = '服务器异常', code = 10000, state = 400) {
        super()
        this.code = code
        this.state = state
        this.message = message
    }
}

class ParameterException extends HttpException {
    constructor(message, code) {
        super()
        this.state = 400
        this.message = `参数错误:${message}` || `参数错误`
        this.code = code || 10000
    }
}

class Success extends HttpException {
    constructor(message, code) {
        super()
        this.state = 201
        this.message = message || 'ok'
        this.code = code || 0
    }
}

class NotFound extends HttpException {
    constructor(message, code) {
        super()
        this.message = message || '资源未找到'
        this.code = code || 10000
        this.state = 404
    }
}

class AuthFailed extends HttpException {
    constructor(message, code) {
        super()
        this.message = message || '授权失败'
        this.code = code || 10004
        this.state = 401
    }
}

class Forbidden extends HttpException {
    constructor(message, code) {
        super()
        this.message = message || '禁止访问'
        this.code = code || 10006
        this.state = 403
    }
}

class LikeError extends HttpException {
    constructor(message, error_code) {
        super()
        this.state = 400
        this.message = "你已经点赞过"
        this.error_code = 60001
    }
}

class DislikeError extends HttpException {
    constructor(message, error_code) {
        super()
        this.state = 400
        this.message = "你已取消点赞"
        this.error_code = 60002
    }
}


module.exports = {
    HttpException,
    ParameterException,
    Success,
    NotFound,
    AuthFailed,
    Forbidden,
    LikeError,
    DislikeError
}