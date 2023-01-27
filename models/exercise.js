import Sequelize from "sequelize";
import moment from "moment";

import sequelize from '../database.js';

const Exercise = sequelize.define('exercise', {
  exerciseId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  duration: Sequelize.INTEGER,
  description: Sequelize.STRING,
  date: {
    type: Sequelize.DATE,
    get() {
      return moment(this.getDataValue('date'))
        .format('YYYY-MM-DD')
    }
  },
}, {
  timestamps: false
});

export default Exercise;
