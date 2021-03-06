import joi from "joi";

const activateRequestSchema = joi.object({
    cardId: joi.number().required(),
    CVV: joi.string().length(3),
    password: joi.string().pattern(/[0-9]{4}/)
});

export default activateRequestSchema;