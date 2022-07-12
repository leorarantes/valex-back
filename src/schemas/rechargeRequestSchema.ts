import joi from "joi";

const rechargeRequestSchema = joi.object({
    cardId: joi.number().required(),
    amount: joi.number().greater(0)
});

export default rechargeRequestSchema;