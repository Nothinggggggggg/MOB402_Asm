require('dotenv').config();
const express = require("express");
const expressHbs = require("express-handlebars");
const mongoose = require("mongoose");
const createError = require('http-errors');

// #App
const app = express();
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`The Web server on port ${port}`);
});

app.get("/", (req, res) => {
  res.redirect("/access/login");
});

// #View Engine
app.engine(
  "hbs",
  expressHbs.engine({
    extname: "hbs",
    helpers: {
      increase: (value, options) => {
        return parseInt(value) + 1;
      },
      decrease: (value, options) => {
        return parseInt(value) - 1;
      },
      shortText: (value, maximum, options) => {
        if (value?.length > maximum) {
          return value.substring(0, maximum) + "...";
        } else {
          return value;
        }
      },
      equal:(value,myValue,options)=>{
        return value == myValue;
      }
    },
  })
);
app.set("view engine", "hbs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// #Database
const username = "thailmph27046";
const password = "leemanhthai";
const cluster = "mycluster";
const dbName = "asm";
const uri = `mongodb+srv://${username}:${password}@${cluster}.myjppwj.mongodb.net/${dbName}`;

mongoose.connect(uri);
const db = mongoose.connection;

db.on("error", console.error.bind(console, "Fail: Connect error"));
db.once("open", () => {
  console.log("Connected successfully");
});

// #Routes
const UserRouter = require("./routes/user.router");
app.use("/users", UserRouter);
const AccessRouter = require('./routes/access.router')
app.use('/access',AccessRouter);
const ProductRouter = require('./routes/product.router');
app.use('/products',ProductRouter);

// #Middleware
app.use((req, res, next) => {
  next(createError.NotFound("Not Found"));
});
app.use((err, req, res, next) => {
  res.json({
    status: err.status,
    message: err.message,
  });
});
