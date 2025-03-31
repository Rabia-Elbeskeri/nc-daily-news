// const { Pool } = require("pg");
//
// const ENV = process.env.NODE_ENV || 'development'
//
// require('dotenv').config({path: `${__dirname}/../.env.${ENV}`})
//
// const db = new Pool();
//
// if (!process.env.PGDATABASE) {
//     throw new Error("No PGDATABASE configured")
// } else {
//     console.log(`Connected to ${process.env.PGDATABASE}`)
// }
//
//
// module.exports = db;
//





const { Pool } = require("pg");

const ENV = process.env.NODE_ENV || "development";

// Load environment variables
require("dotenv").config({
    path: `${__dirname}/../.env.${ENV}`,
});

// Validate env vars
if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
    throw new Error("PGDATABASE or DATABASE_URL not set");
}

// Create config
let config;

if (ENV === "production") {
    config = {
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false,
        },
        max: 2, // optional: limits pool size in production
    };
} else {
    config = {};
}

const db = new Pool(config);

if (process.env.PGDATABASE) {
    console.log(`Connected to ${process.env.PGDATABASE}`);
} else {
    console.log("Connected to production DB");
}

module.exports = db;






//
// const { Pool } = require("pg");
//
// const ENV = process.env.NODE_ENV || "development";
//
// // Load environment variables from correct .env file
// require("dotenv").config({
//     path: `${__dirname}/../.env.${ENV}`,
// });
//
// // Ensure required env variable exists
// if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
//     throw new Error("PGDATABASE or DATABASE_URL not set");
// }
//
//
// const config = {};
//
// if (ENV === "production") {
//     config.connectionString = process.env.DATABASE_URL;
//     config.ssl = { rejectUnauthorized: false };
//     config.max = 2;
// }
//
// const pool = new Pool(config);
//
// console.log("Environment:", ENV);
// console.log("PGDATABASE:", process.env.PGDATABASE);
// console.log("Loaded .env path:", `${__dirname}/../.env.${ENV}`);
// console.log("Connected to database:", process.env.PGDATABASE);
// console.log(ENV);
// console.log(process.env.PGDATABASE);
//
// module.exports = pool;
//
//








//
//
// const { Pool } = require("pg");
// const ENV = process.env.NODE_ENV || "development";
// const pathToCorrectEnvFile = `${__dirname}/../.env.${ENV}`;
//
// require("dotenv").config({
//     path: pathToCorrectEnvFile,
// });
// const db = new Pool();
// if (!process.env.PGDATABASE) {
//     throw new Error("No PGDATABASE configured");
// } else {
//     console.log("Connected to:", process.env.PGDATABASE)
// }
// console.log("Connected to database:", process.env.PGDATABASE);
// console.log(ENV);
// console.log(process.env.PGDATABASE);
// console.log(path);
// module.exports = db;




//
// const { Pool } = require("pg");
//
// const ENV = process.env.NODE_ENV || "development";
//
// // Load environment variables from correct .env file
// require("dotenv").config({
//     path: `${__dirname}/../.env.${ENV}`,
// });
//
// // Ensure required env variable exists
// if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
//     throw new Error("PGDATABASE or DATABASE_URL not set");
// }
//
// // Create DB config
// const config = {};
//
// if (ENV === "production") {
//     config.connectionString = process.env.DATABASE_URL;
//     config.ssl = { rejectUnauthorized: false };
//     config.max = 2;
// }
//
// const pool = new Pool(config);
//
// console.log("Environment:", ENV);
// console.log("PGDATABASE:", process.env.PGDATABASE);
// console.log("Loaded .env path:", `${__dirname}/../.env.${ENV}`);
//
// module.exports = pool;




// require("dotenv").config({
//     path: `.env.${process.env.NODE_ENV || "development"}`,
// });
//
//
// const { Pool } = require("pg");
// const ENV = process.env.NODE_ENV || "development";
//
// if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
//     throw new Error("PGDATABASE or DATABASE_URL not set");
// }
//
// const config = {};
//
// if (ENV === "production") {
//     config.connectionString = process.env.DATABASE_URL;
//     config.ssl = {
//         rejectUnauthorized: false,
//     };
//     config.max = 2;
// }
//
//
// const pool = new Pool(config);
//
// module.exports = pool;







// const { Pool } = require("pg");
//
// const ENV = process.env.NODE_ENV || 'development'
//
// require('dotenv').config({path: `${__dirname}/../.env.${ENV}`});
//
// const db = new Pool();
//
// if (!process.env.PGDATABASE) {
//     throw new Error("No PGDATABASE configured")
// } else {
//     console.log(`Connected to ${process.env.PGDATABASE}`)
// }
//
//
// module.exports = db;
