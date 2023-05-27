var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Crea modello mongoose
module.exports = mongoose.model('Squadra', new Schema({ 
    nomeSquadra: String,
    id_Torneo: int,
    giocatori: [String], //nickname giocatori squadra
}));