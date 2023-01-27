import Sequelize from "sequelize";

import sequelize from '../database.js';

const User = sequelize.define('user', {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  username: Sequelize.STRING,
}, {
  timestamps: false
});

export default User;
