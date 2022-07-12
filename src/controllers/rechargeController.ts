import { Request, Response } from "express";
import * as rechargeService from "../services/rechargeService.js";

export async function rechargeCard(req: Request, res: Response) {
    const { cardId, value }: {cardId: number, value: number} = req.body;
    await rechargeService.rechargeCard(cardId, value);
    res.sendStatus(201);
};