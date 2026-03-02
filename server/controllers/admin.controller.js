import { validationResult } from "express-validator";
import {
  listUsers,
  updateUserFlags,
  updateUserRole,
} from "../services/auth.service.js";

export async function listUsersController(req, res, next) {
  try {
    const users = await listUsers();
    return res.json({ users });
  } catch (err) {
    next(err);
  }
}

export async function updateUserRoleController(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await updateUserRole(req.params.userId, req.body.role);
    return res.json({ user });
  } catch (err) {
    next(err);
  }
}

export async function updateUserFlagsController(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await updateUserFlags(req.params.userId, {
      isActive: req.body.isActive,
      isVerified: req.body.isVerified,
    });
    return res.json({ user });
  } catch (err) {
    next(err);
  }
}
