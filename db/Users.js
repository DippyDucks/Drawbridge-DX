import { DataTypes } from 'sequelize';
import orm from './orm.js';

const Users = orm.define('users', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  user_id: {
    type: DataTypes.INTEGER,
    unique: true,
    allowNull: true
  },
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  clearance: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'unverified'
  },
}, {
  tableName: 'users',
  timestamps: false
});

Users.sync();

export default Users;
