import { Router } from "express";

import userController from "../controllers/User";

const router = Router();

router.post("/", userController.postUser);
router.post("/forgot_password", userController.forgottenPassword);

export default router;
