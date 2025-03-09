import { Sequelize } from 'sequelize';
import config from 'config';
const dbConfig = config.get('Database');

const orm = new Sequelize({
  dialect: dbConfig.dialect,
  host: dbConfig.host, 
  database: dbConfig.name, 
  port: dbConfig.port,
  username: dbConfig.username,
  password: dbConfig.password
});

export default orm;
