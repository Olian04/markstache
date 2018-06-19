module.exports = class {
    ____
    constructor(generatorCtx) {
        this.generatorCtx = generatorCtx;
    }
    setMaxLogLevel(logLevel) {
        this.maxLogLevel = logLevel;
    }
    maxLogLevel = 0;
    generatorCtx;
    Log(logLevel, msg, ctx) {
        if (logLevel <= this.maxLogLevel) {
            this.generatorCtx.log(msg, ctx);
        }
    }
    Debug = (msg, ctx = {}) => this.Log(4, msg, ctx);
    Info = (msg, ctx = {}) => this.Log(3, msg, ctx);
    Warning = (msg, ctx = {}) => this.Log(2, msg, ctx);
    Error = (msg, ctx = {}) => this.Log(1, msg, ctx);
}