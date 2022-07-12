import {Router} from "express";
import { rechargeCard } from "../controllers/rechargeController";
import { validateApiKey } from "../middlewares/apiKeyValidator";
import validateSchema from "../middlewares/validateSchema";
import rechargeRequestSchema from "../schemas/rechargeRequestSchema";

const rechargeRouter = Router();

rechargeRouter.post('/recharge', validateApiKey, validateSchema(rechargeRequestSchema),rechargeCard);

export default rechargeRouter;