module.exports = class AppError extends Error {
    constructor(status, msg) {
        super();
        this.status = status;
        this.msg = msg;
        this.error = this.generateError();
    }

    getStatus(status){
        const statusMsg = [["Unauthorized", 204], ["Internal Error", 500], ["Bad request", 400], ["Success", 200], ["Not Found", 404]]
        const [msg] = statusMsg.find(([m, s]) => s === status);
        return msg;
    }

    generateError(){
        return {
            statusCode: this.status,
            status: this.getStatus(this.status),
            message: this.message,
            isOperational: true,
            stack: Error.captureStackTrace(this, this.constructor)
        }
    }
}