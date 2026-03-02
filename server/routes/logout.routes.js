import { Router } from "express";
import { logoutController } from "../controllers/logout.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();
router.post("/logout", authenticate, logoutController);

export default router;
