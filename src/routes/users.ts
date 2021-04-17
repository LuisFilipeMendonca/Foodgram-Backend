import { Router } from "express";

import userController from "../controllers/User";

const router = Router();

router.post("/", userController.postUser);
router.post("/forgot_password", userController.forgottenPassword);
router.put("/reset_password/:token", userController.resetPassword);

export default router;
