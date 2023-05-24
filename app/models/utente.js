var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Crea modello mongoose
module.exports = mongoose.model('Utente', new Schema({ 
    nickname: String,
    email: String,
    password: String,
    cellulare: Number,
    verificato: Boolean,
    bloccato: Boolean,
    limitato: Boolean,
    bio: String,
    preferenze: [String],
    id_img: Number,
    piattaforme: [String],
    zona: String
    
    //work in progress
    //feedback: Tipo_feedback, 
    // tornei_vinti: Number, // 0
    // feedback_org: Tipo_feedback,
    // amici: [{type: Schema.Types.ObjectId, ref:'Utente'}], !!!     
    // utenti_bloccati: [{type: Schema.Types.ObjectId, ref:'Utente'}],
    // lista_notifiche_interne: [{type: Schema.Types.ObjectId, ref:'NotificaInterna'}], !!!
    // tornei_iscritto: [{type: Schema.Types.ObjectId, ref:'Torneo'}], 
    // storico_tornei: [{type: Schema.Types.ObjectId, ref:'Torneo'}], !!!!
    // tornei_organizzati: [{type: Schema.Types.ObjectId, ref:'Torneo'}], !!!
    // prossime_partite: [{type: Schema.Types.ObjectId, ref:'Torneo'}], !!!
    // communities_iscritto: [{type: Schema.Types.ObjectId, ref:'Community'}],
    // sondaggi: [{type: Schema.Types.ObjectId, ref:'Sondaggio'}], 

}));