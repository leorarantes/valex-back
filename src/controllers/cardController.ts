import { Request, Response } from "express";
import { TransactionTypes } from "../repositories/cardRepository.js";
import * as cardService from "../services/cardService.js";

export async function createCard(req: Request, res: Response) {
    const { employeeId, type }: {employeeId: number, type: TransactionTypes} = req.body;
    const company = res.locals;
    await cardService.createCard(company, employeeId, type);
    res.sendStatus(201);
};

export async function activateCard(req: Request, res: Response) {
    const { cardId, CVV, password }: {cardId: number, CVV: string, password: string} = req.body;
    await cardService.activateCard(cardId, CVV, password);
    res.sendStatus(201);
};

export async function getCardBalance(req: Request, res: Response) {
    const cardId: string = req.params.id;
    const cardBalance: {balance: number, transactions: any, recharges: any} = await cardService.getCardBalance(parseInt(cardId));
    res.status(200).send(cardBalance);
};