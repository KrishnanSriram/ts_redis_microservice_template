import express from 'express';

class Logger {
    private static getTimeStamp(): string {
        return new Date().toISOString();
    }

    public static log(namespace: string, message: string, object?: any) {
        if (object)
            console.log(`[${this.getTimeStamp()}] [LOG] [${namespace}] ${message}`, object);
        else
            console.log(`[${this.getTimeStamp()}] [LOG] [${namespace}] ${message}`);
    }

    public static info(namespace: string, message: string, object?: any) {
        if (object)
            console.info(`[${this.getTimeStamp()}] [INFO] [${namespace}] ${message}`, object);
        else
            console.info(`[${this.getTimeStamp()}] [INFO] [${namespace}] ${message}`);
    }



    public static warn(namespace: string, message: string, object?: any) {
        if (object)
            console.warn(`[${this.getTimeStamp()}] [WRN] [${namespace}] ${message}`, object);
        else
            console.warn(`[${this.getTimeStamp()}] [WRN] [${namespace}] ${message}`);
    }

    public static error(namespace: string, message: string, object?: any) {
        if (object)
            console.error(`[${this.getTimeStamp()}] [ERR] [${namespace}] ${message}`, object);
        else
            console.error(`[${this.getTimeStamp()}] [ERR] [${namespace}] ${message}`);
    }

    public static debug(namespace: string, message: string, object?: any) {
        if (object)
            console.debug(`[${this.getTimeStamp()}] [DBG] [${namespace}] ${message}`, object);
        else
            console.debug(`[${this.getTimeStamp()}] [DBG] [${namespace}] ${message}`);
    }
}

export default Logger;