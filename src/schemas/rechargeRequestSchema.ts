import joi from "joi";

const rechargeRequestSchema = joi.object({
    cardId: joi.number().required(),
    value: joi.number().greater(10)
});

export default rechargeRequestSchema;