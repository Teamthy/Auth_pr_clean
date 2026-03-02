import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { getProfile } from "../services/auth.service.js";

const router = Router();

router.get("/", authenticate, async (req, res, next) => {
  try {
    const user = await getProfile(req.user.sub);
    res.json(user);
  } catch (err) {
    next(err);
  }
});

export default router;
