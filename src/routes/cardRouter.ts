import {Router} from "express";

import { activateCard, blockCard, createCard, getCardBalance, unblockCard } from "../controllers/cardController.js";
import { validateApiKey } from "../middlewares/apiKeyValidator.js";
import validateSchema from "../middlewares/validateSchema.js";
import activateRequestSchema from "../schemas/activateRequestSchema.js";
import blockRequestSchema from "../schemas/blockRequestSchema.js";
import cardRequestSchema from "../schemas/cardRequestSchema.js";

const cardRouter = Router();

cardRouter.post('/card', validateSchema(cardRequestSchema), validateApiKey, createCard);
cardRouter.put('/card/activate', validateSchema(activateRequestSchema), activateCard);
cardRouter.get('card/balance/:id', getCardBalance);
cardRouter.put('card/block', validateSchema(blockRequestSchema), blockCard);
cardRouter.put('card/unblock', validateSchema(blockRequestSchema), unblockCard);

export default cardRouter;