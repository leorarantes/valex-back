import { faker } from '@faker-js/faker';
import Cryptr from 'cryptr';

import "../setup.js";
import { TransactionTypes } from '../repositories/cardRepository.js';
import * as cardRepository from "../repositories/cardRepository.js";
import * as employeeRepository from "../repositories/employeeRepository.js";

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
    const cryptr: Cryptr = new Cryptr(process.env.CVVKEY);
    const encryptedCVV: string = cryptr.encrypt(CVV);
    return encryptedCVV;
}