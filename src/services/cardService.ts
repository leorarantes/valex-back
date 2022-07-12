import { faker } from '@faker-js/faker';
import Cryptr from 'cryptr';

import "../setup.js";
import { TransactionTypes } from '../repositories/cardRepository.js';
import * as cardRepository from "../repositories/cardRepository.js";
import * as employeeRepository from "../repositories/employeeRepository.js";
import * as paymentRepository from "../repositories/paymentRepository.js";
import * as rechargeRepository from "../repositories/rechargeRepository.js";

// main functions 
export async function createCard(company: any, employeeId: number, type: TransactionTypes) {
    await ensureEmployeeIsRegistered(employeeId);
    await ensureCardDoesntAlreadyExists(employeeId, type);

    const number = faker.finance.creditCardNumber();
    const cardholderName = await generateCardholderName(employeeId);
    const CVV = faker.finance.creditCardCVV();
    const securityCode = generateEncryptedCVV(CVV);
    const expirationDate: string = generateExpirationDate();

    await cardRepository.insert(
        {
            employeeId,
            number,
            cardholderName,
            securityCode,
            expirationDate,
            isVirtual: false,
            isBlocked: false,
            type
        }
    );
    
    return (
        {
            number,
            cardholderName,
            CVV,
            expirationDate,
            type
        }
    );
}

export async function activateCard(cardId: number, CVV: string, password: string) {
    const card = await ensureCardExistsAndGetCardData(cardId);
    ensureCardIsntExpired(card.expirationDate);
    await ensureCVVisValid(CVV, card.securityCode);
    ensureCardIsntActive(card.password);

    const encryptedPassword: string = generateEncryptedPassword(password);

    await cardRepository.update(cardId, {password: encryptedPassword});
}

export async function getCardBalance(cardId: number) {
    await ensureCardExists(cardId);
    const transactions = await paymentRepository.findByCardId(cardId);
    const recharges = await rechargeRepository.findByCardId(cardId);

    const balance = generateCardBalance(transactions, recharges);

    const response = {
        balance,
        transactions,
        recharges
    };
    return response;
}

export async function blockCard(cardId: number, password: string) {
    const card = await ensureCardExistsAndGetCardData(cardId);
    ensureCardIsntExpired(card.expirationDate);
    ensureCardIsntBlocked(card.isBlocked);
    ensurePasswordIsValid(password, card.password);

    await cardRepository.update(cardId, {isBlocked: true});
}

export async function unblockCard(cardId: number, password: string) {
    const card = await ensureCardExistsAndGetCardData(cardId);
    ensureCardIsntExpired(card.expirationDate);
    ensureCardIsBlocked(card.isBlocked);
    ensurePasswordIsValid(password, card.password);

    await cardRepository.update(cardId, {isBlocked: false});
}

// auxiliary functions
async function ensureEmployeeIsRegistered(employeeId: number) {
    const employee = await employeeRepository.findById(employeeId);
    if(!employee) throw { type: "error_no_employees_found", message: "No employees found." };
}

async function ensureCardDoesntAlreadyExists(employeeId: number, type: TransactionTypes) {
    const card = await cardRepository.findByTypeAndEmployeeId(type, employeeId);
    if(card) throw { type: "error_card_already_exists", message: "The employee already has this type of card." };
}

async function generateCardholderName(employeeId: number) {
    const employee = await employeeRepository.findById(employeeId);

    const fullNameArray: string[] = employee.fullName.split(' ');
    const cardholderNameArray: string[] = fullNameArray.map((element, index) => {
        if(index === 0 || index === fullNameArray.length-1) return (element.toUpperCase());
        return (element[0].toUpperCase());
    });

    const cardholderName: string = cardholderNameArray.join(" ");
    return cardholderName;
}

function generateExpirationDate() {
    const date: Date = new Date;
    let year: number = date.getFullYear();
    year += 5;
    const strYear: string = "" + year;
    let month: number = date.getMonth();
    const strMonth = month >= 10 ? "" + month : "0" + month;
    const expDate: string = strMonth + "/" + strYear;
    return expDate;
}

function generateEncryptedCVV(CVV: string) {
    const cryptr: Cryptr = new Cryptr(process.env.CVV_KEY);
    const encryptedCVV: string = cryptr.encrypt(CVV);
    return encryptedCVV;
}

async function ensureCardExists(cardId: number) {
    const card = await cardRepository.findById(cardId);
    if(!card) throw { type: "error_card_not_found", message: "Card not found." };
}

export async function ensureCardExistsAndGetCardData(cardId: number) {
    const card = await cardRepository.findById(cardId);
    if(!card) throw { type: "error_card_not_found", message: "Card not found." };
    return card;
}

export function ensureCardIsntExpired(expirationDate: string) {
    const date: Date = new Date;
    let currentYear: number = date.getFullYear();
    let currentMonth: number = date.getMonth();
    
    const expDateSplitted: string[] = expirationDate.split("/");

    if(!((parseInt(expDateSplitted[1]) > currentYear) || (parseInt(expDateSplitted[1]) === currentYear && parseInt(expDateSplitted[0]) >= currentMonth))) {
        throw { type: "error_card_expired", message: "The card has expired." };
    }
}

export function ensureCardIsntBlocked(blocked: boolean) {
    if(blocked === true) {
        throw { type: "error_card_blocked", message: "This card is blocked." };
    }
}

function ensureCardIsBlocked(blocked: boolean) {
    if(blocked === false) {
        throw { type: "error_card_already_unblocked", message: "This card is already unblocked." };
    }
}

function ensureCardIsntActive(password: any) {
    if(password) throw { type: "error_card_already_active", message: "Card is already activated." };
}

export function ensurePasswordIsValid(password: string, encryptedPassword: string) {
    const cryptr: Cryptr = new Cryptr(process.env.PASSWORD_KEY);
    const desencryptedPassword: string = cryptr.decrypt(encryptedPassword);
    if(password !== desencryptedPassword) {
        throw { type: "error_invalid_password", message: "Invalid password." };
    }
}

async function ensureCVVisValid(CVV: string, encryptedCVV: string) {
    const cryptr: Cryptr = new Cryptr(process.env.CVV_KEY);
    const desencryptedCVV: string = cryptr.decrypt(encryptedCVV);
    if(CVV !== desencryptedCVV) {
        throw { type: "error_invalid_CVV", message: "Invalid security code." };
    }
}

function generateEncryptedPassword(password: string) {
    const cryptr: Cryptr = new Cryptr(process.env.PASSWORD_KEY);
    const encryptedPassword: string = cryptr.encrypt(password);
    return encryptedPassword;
}

export function generateCardBalance(transactions: any, recharges: any) {
    let cardBalance = 0;
    recharges.forEach(element => {
        cardBalance += element.amount;
    });
    transactions.forEach(element => {
        cardBalance -= element.amount;
    });

    return cardBalance;
}
