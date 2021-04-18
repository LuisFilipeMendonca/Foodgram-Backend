import { Router } from "express";
import multer from "multer";

import recipieController from "../controllers/Recipie";
import authRequired from "../middlewares/authRequired";
import multerConfig from "../config/multer";

const router = Router();
const upload = multer(multerConfig);

router.post(
  "/",
  authRequired,
  upload.single("photo"),
  recipieController.postRecipie
);
router.get("/by_name/:recipieName", recipieController.getRecipieByName);
router.get("/:page/:limit/:userId?", recipieController.getRecipies);
router.get("/:id", recipieController.getRecipie);
router.put("/:id", recipieController.updateRecipie);
router.delete("/:id", recipieController.deleteRecipie);

export default router;
