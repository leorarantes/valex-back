import {Router} from "express";

import { payment } from "../controllers/paymentController.js";
import validateSchema from "../middlewares/validateSchema.js";
import paymentRequestSchema from "../schemas/paymentRequestSchema.js";

const paymentRouter = Router();

paymentRouter.post('/payment', validateSchema(paymentRequestSchema), payment);

export default paymentRouter;