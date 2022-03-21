const dotenv = require('dotenv');
const mongoose = require('mongoose');

process.on('uncaughtException', (err) => {
    console.log('UNCAUGHT EXCEPTION! Shutting down...', err);
    process.exit(1);
});

process.on('unhandledRejection', (err) => {
    console.log('UNHANDLED REJECTION! Shutting down...', err);
    server.close(() => {
        process.exit(1);
    });
});

dotenv.config({path: './config.env'});
const PORT = process.env.PORT || 5000;

const DB_PASS = process.env.DB_PASSWORD;
const DB_URL = process.env.DB_URL.replace('<password>', DB_PASS);

mongoose
  .connect(DB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => console.log('Database sucessfully connected'));

 exports.sessionUrl = DB_URL; 

const server = require('./app');

server.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
