import dotenv from "dotenv";
dotenv.config({
  path: "/Users/almiratolstova/Documents/Projects/ICH/node_hw/hw_9/.env",
});

const db_config = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: "127.0.0.1",
    dialect: "mysql",
  },
  test: {
    username: "",
    password: "",
    database: "",
    host: "",
    dialect: "mysql",
  },
  production: {
    username: "",
    password: "",
    database: "",
    host: "",
    dialect: "mysql",
  },
};

export default db_config;
