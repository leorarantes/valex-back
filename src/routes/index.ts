import { Router } from "express";

import cardsRouter from "./cardRouter.js";
import paymentRouter from "./paymentRoute.js";
import rechargeRouter from "./rechargeRouter.js";

const router = Router();

router.use(cardsRouter);
router.use(rechargeRouter);
router.use(paymentRouter);

export default router;