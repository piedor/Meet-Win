var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Crea modello mongoose
module.exports = mongoose.model('Partita', new Schema({ 
    id_Torneo: Number,
    data: Number,
    ora: Number,
    nome_squadra1: String,
    nome_squadra2: String,
    risultato1: Number,
    risultato2: Number,
    vincitrice: Number,

}));