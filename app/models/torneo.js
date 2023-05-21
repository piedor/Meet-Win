var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Crea modello mongoose
module.exports = mongoose.model('Torneo', new Schema({ 
    id_Torneo: int
}));