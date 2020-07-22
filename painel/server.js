const express = require("express")
const ejs = require("ejs");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const config = require("./config.json")

const app = express();
const server = require("http").createServer(app);

app.use(flash());
app.use(session({ secret: 'keyboard cat', cookie: { }, resave: true,saveUninitialized: true,}))
app.use(express.static("views"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use("/", require("./routes/routes").router);

app.listen(config.PAINEL_PORT, () =>
  console.log("Painel rodando na porta " + config.PAINEL_PORT)
);

app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());