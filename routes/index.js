import { Router } from "express";
import { body, query } from "express-validator";

import {
  createUser,
  getUsers,
  createExercise,
  getLogs,
} from "../controllers/index.js";
import User from "../models/user.js";

import { checkDateFormat } from '../utils/index.js';

const router = Router();

router.post(
  "/users",
  [
    body("username")
      .trim()
      .not()
      .isEmpty()
      .custom(async (value, { req }) => {
        const isExist = await User.findOne({ where: { username: value } });
        if (isExist) return Promise.reject("User is already exist");
      }),
  ],
  createUser
);

router.get("/users", getUsers);

router.post(
  "/users/:_id/exercises",
  [
    body("duration")
      .isDecimal()
      .isInt({ min: 0 })
      .withMessage("Duration is not correct"),
    body("description").notEmpty(),
    body("date")
      .optional({ checkFalsy: true })
      .custom(checkDateFormat)
      .withMessage("Provided date is invalid"),
  ],
  createExercise
);

router.get("/users/:_id/logs",
[
  query('limit')
    .optional({ checkFalsy: true })
    .isDecimal(),
  query('to')
    .optional({ checkFalsy: true })
    .custom(checkDateFormat)
    .withMessage("Provided date is invalid"),
  query('from')
    .optional({ checkFalsy: true })
    .custom(checkDateFormat)
    .withMessage("Provided date is invalid"),
],
getLogs
);

export default router;
