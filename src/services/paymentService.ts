import * as paymentRepository from "../repositories/paymentRepository.js";
import * as rechargeRepository from "../repositories/rechargeRepository.js";
import * as businessRepository from "../repositories/businessRepository.js";
import { ensureCardExistsAndGetCardData, ensureCardIsntBlocked, ensureCardIsntExpired, ensurePasswordIsValid, generateCardBalance } from "./cardService.js";
import { ensureCardIsActivated } from "./rechargeService.js";

// main functions
export async function payment(cardId: number, password: string, businessId: number, amount: number) {
    const card = await ensureCardExistsAndGetCardData(cardId);

    ensureCardIsActivated(card.password);
    ensureCardIsntExpired(card.expirationDate);
    ensureCardIsntBlocked(card.isBlocked);
    ensurePasswordIsValid(password, card.password);

    const business = await ensureBusinessExistsAndGetBusinessData(businessId);
    
    ensureBusinessTypeIsValid(card.type, business.type);
    await ensureEmployeeCanAfford(card.id, amount);

    await paymentRepository.insert({cardId, businessId, amount});
}


//auxiliary functions
async function ensureBusinessExistsAndGetBusinessData(businessId: number) {
    const business = await businessRepository.findById(businessId);
    if(!business) throw { type: "error_business_not_found", message: "Business not found." };
    return business;
}

function ensureBusinessTypeIsValid(cardType: string, businessType: string) {
    if(cardType !== businessType) throw { type: "error_invalid_business_type", message: "Invalid business type." };
}

async function ensureEmployeeCanAfford(cardId: number, amount: number) {
    const transactions = await paymentRepository.findByCardId(cardId);
    const recharges = await rechargeRepository.findByCardId(cardId);

    const balance = generateCardBalance(transactions, recharges);
    if(amount > balance) throw { type: "error_insufficient_funds", message: "Insufficient funds." };
}