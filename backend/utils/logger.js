const { format, createLogger, transports } = require("winston");
require("winston-daily-rotate-file");
require("winston-mongodb");
require("dotenv").config({ quiet: true });

const { combine, timestamp, label, prettyPrint, json } = format;

const CATEGORY = "eShop Logger";

const fileRotateTransport = new transports.DailyRotateFile({
  filename: "logs/rotate-%DATE%.log",
  datePattern: "DD-MM-YYYY",
  maxFiles: "14d",
});

const logger = createLogger({
  level: "debug",
  format: combine(
    label({ label: CATEGORY }),
    timestamp({ format: "DD-MM-YYYY HH:mm:ss" }),
    prettyPrint()
  ),
  transports: [
    fileRotateTransport,

    new transports.File({
      filename: "logs/example.log",
    }),

    new transports.File({
      level: "error",
      filename: "logs/error.log",
    }),

    new transports.Console(),

    new transports.MongoDB({
      level: "error",
      db: process.env.MONGODB_URI,
      collection: "server-logs",
      format: combine(timestamp(), json()),
    }),
  ],
});

module.exports = logger;
