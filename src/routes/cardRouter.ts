import {Router} from "express";

import { createCard } from "../controllers/cardController.js";
import { validateApiKey } from "../middlewares/apiKeyValidator.js";
import validateSchema from "../middlewares/validateSchema.js";
import cardRequestSchema from "../schemas/cardRequestSchema.js";

const cardsRouter = Router();

cardsRouter.post('/cards', validateSchema(cardRequestSchema), validateApiKey, createCard);

export default cardsRouter;