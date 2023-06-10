var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Crea modello mongoose
module.exports = mongoose.model('Notifica', new Schema({ 
    nickMittente: String,
    nickDestinatario: String,
    categoria: String,
    accettato: Boolean,
    visualizzato: Boolean,
    data: String
}));