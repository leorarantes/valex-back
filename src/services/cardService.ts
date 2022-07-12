import { faker } from '@faker-js/faker';
import Cryptr from 'cryptr';

import "../setup.js";
import { TransactionTypes } from '../repositories/cardRepository.js';
import * as cardRepository from "../repositories/cardRepository.js";
import * as employeeRepository from "../repositories/employeeRepository.js";

// main functions 
export async function createCard(company: any, employeeId: number, type: TransactionTypes) {
    await ensureEmployeeIsRegistered(employeeId);
    await ensureCardDoesntAlreadyExists(employeeId, type);

    const number = faker.finance.creditCardNumber();
    const cardholderName = await generateCardholderName(employeeId);
    const securityCode = generateEncryptedCVV();
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
}

export async function activateCard(cardId: number, CVV: string, password: string) {
    await ensureCardCanBeActivatedAndCVVisValid(cardId, CVV);

    const encryptedPassword: string = generateEncryptedPassword(password);

    await cardRepository.update(cardId, {password: encryptedPassword});
}



// auxiliary functions
async function ensureEmployeeIsRegistered(employeeId: number) {
    const employee = employeeRepository.findById(employeeId);
    if(!employee) throw { type: "error_no_employees_found", message: "No employees found." };
}

async function ensureCardDoesntAlreadyExists(employeeId: number, type: TransactionTypes) {
    const card = cardRepository.findByTypeAndEmployeeId(type, employeeId);
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

function generateEncryptedCVV() {
    const CVV: string = faker.finance.creditCardCVV();
    const cryptr: Cryptr = new Cryptr(process.env.CVV_KEY);
    const encryptedCVV: string = cryptr.encrypt(CVV);
    return encryptedCVV;
}

async function ensureCardCanBeActivatedAndCVVisValid(cardId: number, CVV: string) {
    const card = await cardRepository.findById(cardId);
    if(card) throw { type: "error_card_not_found", message: "Card not found." };

    const date: Date = new Date;
    let currentYear: number = date.getFullYear();
    let currentMonth: number = date.getMonth();
    
    const expDateSplitted: string[] = card.expirationDate.split("/");

    if(!((parseInt(expDateSplitted[1]) > currentYear) || (parseInt(expDateSplitted[1]) === currentYear && parseInt(expDateSplitted[0]) >= currentMonth))) {
        throw { type: "error_card_expired", message: "The card has expired." };
    }

    const cryptr: Cryptr = new Cryptr(process.env.CVV_KEY);
    const desencryptedCVV: string = cryptr.decrypt(card.securityCode);
    if(CVV !== desencryptedCVV) {
        throw { type: "error_invalid_CVV", message: "Invalid security code." };
    }
}

function generateEncryptedPassword(password: string) {
    const cryptr: Cryptr = new Cryptr(process.env.PASSWORD_KEY);
    const encryptedPassword: string = cryptr.encrypt(password);
    return encryptedPassword;
}
