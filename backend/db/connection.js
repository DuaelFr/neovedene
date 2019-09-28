const monk = require('monk');
const connectionString = process.env.MONGODB_URI || 'mongo:27017/neovedene';
const db = monk(connectionString, {authSource:'admin', useUnifiedTopology: true});

db.then(() => {
  console.log('Connected correctly to server')
});

module.exports = db;
