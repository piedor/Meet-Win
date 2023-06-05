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
    id_img: Number,
    piattaforma: String,
    bio: String,
    regolamento: String,
    zona: String,
    dataInizio: String,
    pubblicato: Boolean,
    terminato: Boolean,
    formatoT: String,
    numeroGironi: Number,
    fasi: Number,
    faseAttuale: Number,
    formatoP: String,
    partite: [Number], //id delle partite associate al torneo
    storicoPartite: [Number],
    squadreIscritte: [Number], //id delle squadre iscritte
    vincitrice: Number, //id squdra vincitrice
    //password: String 
}));