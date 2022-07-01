const mongoose = require('mongoose');

const host = process.env.MONGO_HOST;
const port = process.env.MONGO_PORT;
const db_name = process.env.MONGO_DB;

mongoose.connect(`mongodb://${host}:${port}/${db_name}`, (err) => {
    if (err) throw err;

    console.log('Successfully connected');
});

