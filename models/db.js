// Get database configs
const dbConfig = require('../config/db.config.js');

// Call sequelize
const {
    Sequelize,
    DataTypes
} = require('sequelize');

// Get database
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect
    // ,
    // pool: {
    //     max: dbConfig.pool.max,
    //     min: dbConfig.pool.min,
    //     acquire: dbConfig.pool.acquire,
    //     idle: dbConfig.pool.idle
    // }
});

// Connect to database
sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

// Initiate database
const db = {};
db.sequelize = sequelize;

// Get all tables
db.users = require('./users.model')(sequelize, DataTypes);
db.subjects = require('./subjects.model')(sequelize, DataTypes);
db.tools = require('./tools.model')(sequelize, DataTypes);
db.tool_subject = require('./tool_subjects.model')(sequelize, DataTypes);
db.user_tool_like = require('./user_tool_like.model')(sequelize, DataTypes);

// Create connection between subejcts and tools
// db.subjects.belongsToMany(db.tools, {
//     through: db.tool_subject
// });
// db.tools.belongsToMany(db.subjects, {
//     through: db.tool_subject
// });

// Create connection between users and tools, this table is used to keep the tools that the user gave a like or a dislike
// db.users.belongsToMany(db.tools, {
//     through: db.user_tool_like
// });
// db.tools.belongsToMany(db.users, {
//     through: db.user_tool_like
// });

// Syncronize database, only used when there's changes to it
// db.sequelize.sync()
//     .then(() => {
//         console.log('DB is successfully synchronized')
//     })
//     .catch(e => {
//         console.log(e)
//     });

// Export database to be used by other files
module.exports = db;