import { Sequelize } from 'sequelize';

const sequelize = new Sequelize("job_portal", "root", "", {
  host: 'localhost',
  dialect: 'mysql',
});

export default sequelize;