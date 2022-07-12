import { Request, Response } from "express";
import * as cardService from "../services/cardService.js";

export async function createCard(req: Request, res: Response) {
    const { employeeId, type }: {employeeId: number, type: string} = req.body;
    const company = res.locals;
    await cardService.createCard(company, employeeId, type);
    res.sendStatus(201);
};
