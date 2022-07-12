import * as rechargeRepository from "../repositories/rechargeRepository.js";
import { ensureCardExistsAndGetCardData, ensureCardIsntExpired } from "./cardService.js";

export async function rechargeCard(cardId: number, amount: number) {
    const card = await ensureCardExistsAndGetCardData(cardId);

    ensureCardIsActivated(card.password);
    ensureCardIsntExpired(card.expirationDate);

    await rechargeRepository.insert({cardId, amount});
}


// auxiliary functions
export function ensureCardIsActivated(password: any) {
    if(!password) throw { type: "error_card_unactive", message: "Card is not activated." };
}