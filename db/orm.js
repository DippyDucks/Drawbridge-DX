import { Sequelize } from 'sequelize';
import { getConfig } from '../src/authentication/AuthenticationManager';

const dbConfig = getConfig().Database;
const appName = getConfig().AppName;

const orm = new Sequelize({
  dialect: dbConfig.dialect,
  host: dbConfig.host, 
  database: dbConfig.name, 
  port: dbConfig.port,
  username: dbConfig.username,
  password: dbConfig.password,
  dialectOptions: {
    charset: 'utf8mb4' 
  }
});

orm.authenticate().then(() => {
  console.log(`${appName || "Default App"} has successfully connected to the database.`);
}).catch((error) => {
 console.error('OOPS! Failed to connect to the database.', error);
});

export default orm;