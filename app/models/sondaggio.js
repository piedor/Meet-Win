var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Crea modello mongoose
module.exports = mongoose.model('Sondaggio', new Schema({ 
    id_Torneo: Number
}));