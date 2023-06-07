var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Crea modello mongoose
module.exports = mongoose.model('Squadra', new Schema({ 
    nomeSquadra: String,
    idTorneo: String,
    giocatori: [String], //nickname giocatori squadra
    partite: [String] //id partite associate alla squadra
}));