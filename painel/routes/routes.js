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

  router.get("/guilds",function(req, res, next) {
    let user = req.session.user;  
    req.session.rota = 2;
    if(!user) return res.redirect("/login")
    let guilds = [],icones = [],icon
    client.guilds.cache.map(x =>{
      if(x.members.cache.get(user.id)){
        if(x.members.cache.get(user.id).hasPermission("ADMINISTRATOR")){
          guilds.push(x)
          icon = x.iconURL()  == null? "https://external-preview.redd.it/GOkP8onbuyjGmN9Rc8Que5mw21CdSw6OuXpAKUuE6-4.jpg?auto=webp&s=2bc0e522d1f2fa887333286d557466b2be00fa5e" : `${x.iconURL()}?size=2048`
          icones.push(icon)
          Database.Servidores.findOne({server_id: x.id}, async (erro, dados)  =>{
            if (!dados) {
              new Database.Servidores({
                server_id: x.id,
                server_name: x.name,
                owner_id: x.ownerID,
                owner_name: client.users.cache.get(x.ownerID).username,
                prefixo: config.PREFIXO,
                premium: false,
              }).save()
            }
          })
        }
      }
    })
    setTimeout(() =>{
    res.render("guilds.ejs",{
      user,
      guilds,
      client,
      icones
    });
    },1000)
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
      let rota = req.session.rota

      if(rota == '1'){
        res.redirect("/")
      }else if(rota == '2'){
        res.redirect("/guilds")
      }

      console.log(`${req.user.username} Logou no Painel`)
      let canal = client.channels.cache.get(config.CHANNEL_LOGIN)
      if(canal){
      canal.send(`${req.user.username} **Logou no Painel de Controle**`)
      }
  } 
);

router.get("/config/:id/:rota", async (req, res) => {
  let user = req.session.user;  
  let id = req.params.id;
  let rota = req.params.rota;  

  req.session.guild = {
    id,
    rota
  }
  if (!req.session.login){
    req.session.rota = 3;
    res.redirect("/login")
  }else{  
  let guilda = client.guilds.cache.get(id);   
  if(!guilda) return res.redirect("/guilds")
  if(!guilda.members.cache.get(user.id).hasPermission("ADMINISTRATOR")) return res.redirect("/guilds")

  Database.Servidores.findOne({server_id: id}, async function(erro, dados) {
    if (dados) {
      res.render("dashboard.ejs",{
        user,
        client,
        dados,
        guilda
      })
    }
  })
  }
})

module.exports = router;