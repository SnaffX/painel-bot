const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const config = require("../config.json")
mongoose
  .connect(
    `${config.MONGO_URL}`,{
      useNewUrlParser: true,
      useUnifiedTopology:true
    }
  )
  .then(function() {
    console.log(
        "\x1b[32m[ BANCO DE DADOS ] \x1b[0mBanco de dados foi ligado"
    );
  })
  .catch(function() {
    console.log(
      "\x1b[31m[ BANCO DE DADOS ] \x1b[0mBanco de dados desligado por erro"
    );
  });

const dados = new Schema({
  user_id: {type: String},
  user_name: {type: String},
  guilds: {type: String},
})

var users = mongoose.model("Logins", dados);
exports.Usuarios = users;

var dados1 = new Schema({
  server_id: {type: String},
  server_name: {type: String},
  owner_id: {type: String},
  owner_name: {type: String},
  prefixo: {type: String},
  premium: {type: Boolean},
})

var servers = mongoose.model("Guildas", dados1);
exports.Servidores = servers;