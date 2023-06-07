var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Crea modello mongoose
module.exports = mongoose.model('Partita', new Schema({ 
    idTorneo: String,
    data: String,
    ora: Number,
    idSquadra1: String,
    idSquadra2: String,
    risultato1: Number,
    risultato2: Number,
    vincitrice: String,
}));