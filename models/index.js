import User from "./user.js";
import Exercise from "./exercise.js";

Exercise.belongsTo(User);
User.hasMany(Exercise)

export { User, Exercise };