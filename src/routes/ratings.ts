import { Router } from "express";

import ratingController from "../controllers/Rating";
import authRequired from "../middlewares/authRequired";

const router = Router();

router.post("/", authRequired, ratingController.postRating);
router.delete("/:id", ratingController.deleteRating);

export default router;
