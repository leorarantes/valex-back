import {Router} from "express";
import { rechargeCard } from "../controllers/rechargeController.js";
import { validateApiKey } from "../middlewares/apiKeyValidator.js";
import validateSchema from "../middlewares/validateSchema.js";
import rechargeRequestSchema from "../schemas/rechargeRequestSchema.js";

const rechargeRouter = Router();

rechargeRouter.post('/recharge', validateApiKey, validateSchema(rechargeRequestSchema), rechargeCard);

export default rechargeRouter;