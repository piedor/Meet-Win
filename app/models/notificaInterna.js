var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Crea modello mongoose
module.exports = mongoose.model('NotificaInterna', new Schema({ 
    id_notificann: int
}));