const {Sequelize} = require('sequelize');

module.exports = new Sequelize(
    'db',
    'postgres',
    'Sa123',
    {
        dialect: 'postgres',
        host: process.env.DB_HOST,
        port: process.env.DB_PORT

    }
)