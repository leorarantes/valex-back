import {Router} from "express";

import { activateCard, blockCard, createCard, getCardBalance } from "../controllers/cardController.js";
import { validateApiKey } from "../middlewares/apiKeyValidator.js";
import validateSchema from "../middlewares/validateSchema.js";
import activateRequestSchema from "../schemas/activateRequestSchema.js";
import blockRequestSchema from "../schemas/blockRequestSchema.js";
import cardRequestSchema from "../schemas/cardRequestSchema.js";

const cardRouter = Router();

cardRouter.post('/card', validateSchema(cardRequestSchema), validateApiKey, createCard);
cardRouter.post('/card/activate', validateSchema(activateRequestSchema), activateCard);
cardRouter.get('card/balance/:id', getCardBalance);
cardRouter.get('card/block', validateSchema(blockRequestSchema), blockCard);

export default cardRouter;