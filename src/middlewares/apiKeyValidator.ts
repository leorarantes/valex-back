import { Request, Response, NextFunction } from "express";

import * as companyRepository from "../repositories/companyRepository.js";
import "../setup.js";

export async function validateApiKey(req: Request, res: Response, next: NextFunction) {
    const xApiKey: string = (req.headers["x-api-key"] || "") as string;
    const key = xApiKey.replace("Bearer ", "");

    if (!key) {
        return res.sendStatus(401);
    }

    try {
        const company = companyRepository.findByApiKey(key);
        res.locals = company;
        next();
    } catch (e) {
        console.log(e);
        return res.sendStatus(401);
    }
}