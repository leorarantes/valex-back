import joi from "joi";

const cardRequestSchema = joi.object({
    employeeId: joi.number().required(),
    type: joi.string().valid('groceries', 'restaurant', 'transport', 'education', 'health')
});

export default cardRequestSchema;