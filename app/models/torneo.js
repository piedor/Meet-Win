var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Crea modello mongoose
module.exports = mongoose.model('Torneo', new Schema({ 
    nomeTorneo: String,
    organizzatore: String,
    //password: String, //per i tornei privati si potrà mettere una password di ingresso
    numeroSquadre: Number,
    numeroGiocatori: Number,
    argomento: String,
    tags: [String],
    giorniPartite: [String],
    id_img: Number,
    piattaforma: String,
    bio: String,
    regolamento: String,
    zona: String,
    dataInizio: String,
    pubblicato: Boolean,
    terminato: Boolean,
    avviato: Boolean,
    formatoT: String,
    numeroGironi: Number,
    fasi: Number,
    faseAttuale: Number,
    formatoP: String,
    vincitrice: String, //id squadra vincitrice
    //password: String 
}));