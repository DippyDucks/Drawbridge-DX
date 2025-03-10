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

orm.authenticate().then(() => {
  console.log('App is successfully connected to the database.');
}).catch((error) => {
 console.error('OOPS! Failed to connect', error);
});

export default orm;
