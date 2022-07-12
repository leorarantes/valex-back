import {Router} from "express";

import { activateCard, createCard } from "../controllers/cardController.js";
import { validateApiKey } from "../middlewares/apiKeyValidator.js";
import validateSchema from "../middlewares/validateSchema.js";
import activateRequestSchema from "../schemas/activateRequestSchema.js";
import cardRequestSchema from "../schemas/cardRequestSchema.js";

const cardRouter = Router();

cardRouter.post('/card', validateSchema(cardRequestSchema), validateApiKey, createCard);
cardRouter.post('/card/activate', validateSchema(activateRequestSchema), activateCard);

export default cardRouter;