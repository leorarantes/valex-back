import { Request, Response, NextFunction } from "express";

export default function errorHandler(error, req: Request, res: Response, next: NextFunction) {
    console.error(error);

    if (error.type === "error_no_employees_found") {
        return res.sendStatus(404).status(error.message);
    }
    if (error.type === "error_card_already_exists") {
        return res.sendStatus(409).status(error.message);
    }
    if (error.type === "error_card_not_found") {
        return res.sendStatus(404).status(error.message);
    }
    if (error.type === "error_card_expired") {
        return res.sendStatus(409).status(error.message);
    }
    if (error.type === "error_card_blocked") {
        return res.sendStatus(409).status(error.message);
    }
    if (error.type === "error_card_already_unblocked") {
        return res.sendStatus(409).status(error.message);
    }
    if (error.type === "error_card_already_active") {
        return res.sendStatus(409).status(error.message);
    }
    if (error.type === "error_invalid_password") {
        return res.sendStatus(409).status(error.message);
    }
    if (error.type === "error_invalid_CVV") {
        return res.sendStatus(409).status(error.message);
    }
    if (error.type === "error_business_not_found") {
        return res.sendStatus(404).status(error.message);
    }
    if (error.type === "error_invalid_business_type") {
        return res.sendStatus(409).status(error.message);
    }
    if (error.type === "error_insufficient_funds") {
        return res.sendStatus(409).status(error.message);
    }
    if (error.type === "error_card_unactive") {
        return res.sendStatus(409).status(error.message);
    }

    return res.status(500).send("Internal Server Error");
}