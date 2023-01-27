import { validationResult } from "express-validator";
import moment from "moment";
import { Op } from "sequelize";

import sequelize from "../database.js";
import { User, Exercise } from "../models/index.js";
import { DATE_FORMAT } from "../utils/index.js";

export const createUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const err = new Error("Invalid data provided");
      err.statusCode = 422;
      err.data = errors.array();
      throw err;
    }

    const { username } = req.body;

    const user = await User.create({ username });

    res.status(201).json(user);
    return user;
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.findAll();

    res.status(200).json(users);
    return users;
  } catch (error) {
    next(error);
  }
};

export const createExercise = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const err = new Error("Invalid data provided");
      err.statusCode = 422;
      err.data = errors.array();
      throw err;
    }

    const { duration, description, date } = req.body;
    const { _id } = req.params;
    const user = await User.findByPk(_id);

    if (!user) {
      const err = new Error("User was not found");
      err.statusCode = 404;
      throw err;
    }

    const exercise = await user.createExercise({
      description,
      duration: +duration,
      date: date ? moment(date).format() : moment().format(),
    });

    res.status(201).json(exercise);
    return exercise;
  } catch (error) {
    next(error);
  }
};

export const getLogs = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const err = new Error("Invalid data provided");
      err.statusCode = 400;
      err.data = errors.array();
      throw err;
    }

    const { _id } = req.params;
    const user = await User.findByPk(_id);

    if (!user) {
      const err = new Error("User was not found");
      err.statusCode = 404;
      throw err;
    }

    const { limit, to, from } = req.query;
    const [{ minDate, maxDate }] = await Exercise.findAll({
      attributes: [
        [sequelize.fn("min", sequelize.col("date")), "minDate"],
        [sequelize.fn("max", sequelize.col("date")), "maxDate"],
      ],
      raw: true,
    });
    const { count, rows } = await Exercise.findAndCountAll({
      where: {
        userId: _id,
        ...((from || to) && {
          date: {
            [Op.between]: [
              from ? moment(from).format(DATE_FORMAT) : minDate,
              to ? moment(to).format(DATE_FORMAT) : maxDate,
            ],
          },
        }),
      },
      order: [["date", "ASC"]],
      ...(limit && { limit }),
    });
    const logsObj = {
      logs: rows,
      count,
    };

    res.status(200).json(logsObj);
    return logsObj;
  } catch (error) {
    next(error);
  }
};
