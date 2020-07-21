const router = require("express").Router();
const Discord = require("discord.js");
const client = new Discord.Client();

const config = require("../../config.json")

client.login(config.BOT_TOKEN)

const session = require("express-session"),
  passport = require("passport"),
  Strategy = require("../lib").Strategy;

passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
}) 

const scopes = [
  "identify",
  "guilds"
];

var prompt = "consent";
passport.use(
  new Strategy(
    {
      clientID: config.BOT_ID,
      clientSecret: config.BOT_SECRET,
      callbackURL: config.BOT_CALLBACK,
      scope: scopes,
      prompt: prompt
    },
    function(accessToken, refreshToken, profile, done) {
      process.nextTick(function() {
        return done(null, profile);
      });
    }
  )
);
router.use(
  session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true
  })
);
router.use(passport.initialize());
router.use(passport.session());

router.get(
"/login",passport.authenticate("discord", { scope: scopes, prompt: prompt }),async (req, res)  =>{
})

module.exports = router;