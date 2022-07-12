import { Request, Response } from "express";
import * as rechargeService from "../services/rechargeService.js";

export async function rechargeCard(req: Request, res: Response) {
    const { cardId, amount }: {cardId: number, amount: number} = req.body;
    await rechargeService.rechargeCard(cardId, amount);
    res.sendStatus(201);
};