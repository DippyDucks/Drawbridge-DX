import { Sequelize } from 'sequelize';
import config from 'config';
const dbConfig = config.get('Database');
const appName = config.get('AppName');

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
  console.log(`${appName} has successfully connected to the database.`);
}).catch((error) => {
 console.error('OOPS! Failed to connect to the database.', error);
});

export default orm;
