const { Sequelize } = require('sequelize');
const { db } = require("../config")

//connection to postgres

const sequelize = new Sequelize(db.name, db.user, db.password, {
    dialect: 'postgres',
    define: {
        underscored: true
    }
});

//describe postgres models

const modelDefiners = [
    require('./message'),
];

for (const modelDefiner of modelDefiners) {
	modelDefiner(sequelize);
}

// We export the sequelize connection instance to be used around our app.

module.exports = sequelize;