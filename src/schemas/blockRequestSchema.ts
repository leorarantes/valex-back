import joi from "joi";

const blockRequestSchema = joi.object({
    cardId: joi.number().required(),
    password: joi.string().pattern(/[0-9]{4}/)
});

export default blockRequestSchema;