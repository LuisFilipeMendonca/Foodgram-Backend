import { Router } from "express";

import userController from "../controllers/User";
import authRequired from "../middlewares/authRequired";

const router = Router();

router.post("/", userController.postUser);
router.post("/forgot_password", userController.forgottenPassword);
router.put("/reset_password/:token", userController.resetPassword);
router.get("/", authRequired, userController.getUser);

export default router;
