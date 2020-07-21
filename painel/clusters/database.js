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

var dados = new Schema({
  user_id: {type: String},
  user_name: {type: String},
  guilds: {type: String},
})

var users = mongoose.model("Usuarios", dados);
exports.Usuarios = users;