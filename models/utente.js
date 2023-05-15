var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('Utente', new Schema({ 
    nickname: String,
    email: String,
    password: String,
    cellulare: int,
    verificato: Boolean,
    bloccato: Boolean,
    elimitato: Boolean,
    bio: String,
    preferenze: [String],
    id_img: int,
    piattaforme: [String],
    feedback: Tipo_feedback,
    tornei_vinti: int,
    feedback_org: Tipo_feedback,
    amici: [{type: Schema.Types.ObjectId, ref:'Utente'}],      
    utenti_bloccati: [{type: Schema.Types.ObjectId, ref:'Utente'}],
    lista_notifiche_interne: [{type: Schema.Types.ObjectId, ref:'NotificaInterna'}],
    tornei_iscritto: [{type: Schema.Types.ObjectId, ref:'Torneo'}],
    storico_tornei: [{type: Schema.Types.ObjectId, ref:'Torneo'}],
    tornei_organizzati: [{type: Schema.Types.ObjectId, ref:'Torneo'}],
    prossime_partite: [{type: Schema.Types.ObjectId, ref:'Torneo'}],
    communities_iscritto: [{type: Schema.Types.ObjectId, ref:'Community'}],
    sondaggi: [{type: Schema.Types.ObjectId, ref:'Sondaggio'}],

}));