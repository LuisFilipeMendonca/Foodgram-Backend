import { Router } from "express";

import recipieController from "../controllers/Recipie";

const router = Router();

router.post("/", recipieController.postRecipie);
router.get("/", recipieController.getRecipies);
router.get("/:id", recipieController.getRecipie);

export default router;
