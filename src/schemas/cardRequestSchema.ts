import joi from "joi";

const cardRequestSchema = joi.object({
    employeeId: joi.number().required(),
    type: joi.string().valid('groceries', 'restaurants', 'transport', 'education', 'health')
});

export default cardRequestSchema;