const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'chat.sqlite'
});

const Message = sequelize.define('Message', {
  content: {
    type: DataTypes.STRING,
    allowNull: false
  },
  sent: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  }
});

sequelize.sync();

module.exports = { sequelize, Message };
