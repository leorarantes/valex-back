import joi from "joi";

const activateRequestSchema = joi.object({
    cardId: joi.string().pattern(/[0-9]{4}/),
    CVV: joi.string().length(3)
});

export default activateRequestSchema;