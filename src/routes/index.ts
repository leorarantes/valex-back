import { Router } from "express";

import cardsRouter from "./cardRouter";

const router = Router();

router.use(cardsRouter);

export default router;