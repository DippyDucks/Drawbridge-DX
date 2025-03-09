import { DataTypes } from 'sequelize';
import orm from './orm';

const Users = orm.define('Users', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    unique: true,
    allowNull: false
  },
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
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

export default Users;
