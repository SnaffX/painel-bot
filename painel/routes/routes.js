const router = require("express").Router();
const Discord = require("discord.js");
const client = new Discord.Client();
const Database = require("../clusters/database")
const config = require("../config.json")
client.login(config.BOT_TOKEN)

router.get("/",function(req, res, next) {
    let user = req.session.user;  
    req.session.rota = 1;
    res.render("teste.ejs",{
      user
    });
  });
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

router.get(
    "/callback",
    passport.authenticate("discord", { failureRedirect: "/" }),
    function(req, res) {  
      Database.Usuarios.findOne(
        {user_id: req.user.id},
        async (erro, dadosx) =>{
          if (!dadosx) {
            new Database.Usuarios({
              user_id: req.user.id,
              user_name: req.user.username,
              guilds: req.user.guilds.length         
            }).save();        
          }else{
            dadosx.user_name = client.users.cache.get(req.user.id).username;
            dadosx.save();
          }
        }
      );
  
      req.session.login = true;
      req.session.user = req.user;

      console.log(`${req.user.username} Logou no Painel`)
      let canal = client.channels.cache.get(config.CHANNEL_LOGIN)
      if(canal){
      canal.send(`${req.user.username} **Logou no Painel de Controle**`)
      }
      res.redirect("/")
  } 
);

module.exports = router;