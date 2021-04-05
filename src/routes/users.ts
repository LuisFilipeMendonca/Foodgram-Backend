import { Router } from "express";

import userController from "../controllers/User";

const router = Router();

router.post("/", userController.postUser);

export default router;
