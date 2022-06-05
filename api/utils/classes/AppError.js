module.exports = class AppError extends Error {
    constructor(status, msg = null, methodName, code = null, isOperational = true) {
        super();
        this.statusCode = status;
        this.code = code;
        this.status = this.getStatus(status);
        this.methodName = methodName;
        this.message = msg;
        this.isOperational = isOperational;
        this.stack = Error.captureStackTrace(this);
    }

    getStatus(status){
        const statusMsg = [["Unauthorized", 401], ["Internal Error", 500], ["Bad request", 400], ["Success", 200], ["Not Found", 404], ["Conflicting", 409]]
        const [msg] = statusMsg.find(([m, s]) => s === status);
        return msg;
    }
}