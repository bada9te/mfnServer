import express from "express";

const errorHandler = (err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    const eStatus = err.status || 500;
    const eMsg = err.message || 'Sth went wrong';

    console.log(eMsg);
    
    res.status(eStatus).json({
        done: false,
        error: eMsg,
        stack: process.env.NODE_ENV_TYPE === 'development' ? err.stack : null,
    });

    next();
}

export default errorHandler;