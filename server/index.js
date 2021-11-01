const express = require("express");
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");
const formidableMiddleware = require('express-formidable');
// const connectDB = require('./config/db.js')

// configs
require("colors");
require("dotenv").config();

//connection to database
// connectDB()

// Routers

const zephyr = require("./routers/zephyr.js");

const PORT = process.env.PORT || 7000;

const app = express();

app.use(cors());
app.use(express.static("vault"));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);

app.use(morgan("dev"));
app.use(formidableMiddleware({
  encoding: 'utf-8',
  uploadDir: (__dirname + '/vault/'),
  multiples: true,
}));

// use Routers

app.use("/api/catalog", zephyr);

app.use(function (err, req, res, next) {
  res.status(500).send({
    success: false,
    error: err.message,
    data: null,
  });
});

app.listen(PORT, () => {
  console.log(
    "Сервер запущен в окружении ".cyan +
    process.env.NODE_ENV.magenta +
    " на порту ".cyan +
    PORT.magenta +
    " ...".cyan
  );
});