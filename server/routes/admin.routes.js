import { Router } from "express";
import { body, param } from "express-validator";
import {
  listUsersController,
  updateUserFlagsController,
  updateUserRoleController,
} from "../controllers/admin.controller.js";
import { authenticate, authorizeRoles } from "../middleware/auth.middleware.js";

const router = Router();

router.use(authenticate, authorizeRoles("admin"));

router.get("/users", listUsersController);
router.patch(
  "/users/:userId/role",
  [
    param("userId").isUUID().withMessage("Valid user id required"),
    body("role").isIn(["user", "admin"]).withMessage("Role must be either user or admin"),
  ],
  updateUserRoleController
);
router.patch(
  "/users/:userId/flags",
  [
    param("userId").isUUID().withMessage("Valid user id required"),
    body("isActive").optional().isBoolean().withMessage("isActive must be boolean"),
    body("isVerified").optional().isBoolean().withMessage("isVerified must be boolean"),
  ],
  updateUserFlagsController
);

export default router;
