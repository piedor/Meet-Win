var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Crea modello mongoose
module.exports = mongoose.model('NotificaInterna', new Schema({ 
    idMittente: String,
    idDestinatario: String,
    categoria: String,
    accettato: Boolean,
    data: String
}));