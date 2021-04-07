import { Router } from "express";

import recipieController from "../controllers/Recipie";
import authRequired from "../middlewares/authRequired";

const router = Router();

router.post("/", recipieController.postRecipie);
router.get("/:page/:limit", authRequired, recipieController.getRecipies);
router.get("/:id", recipieController.getRecipie);
router.put("/:id", recipieController.updateRecipie);
router.delete("/:id", recipieController.deleteRecipie);

export default router;
