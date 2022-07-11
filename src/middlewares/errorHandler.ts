import { Request, Response, NextFunction } from "express";

export default function errorHandler(error, req: Request, res: Response, next: NextFunction) {
    if(error.response) return res.sendStatus(error.response.status);
    console.error(error);
    return res.status(500).send("Internal Server Error");
}