import joi from "joi";

const paymentRequestSchema = joi.object({
    cardId: joi.number().required(),
    password: joi.string().pattern(/[0-9]{4}/),
    businessId: joi.number().required(),
    amount: joi.number().greater(0)
});

export default paymentRequestSchema;