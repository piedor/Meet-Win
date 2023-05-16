var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('Torneo', new Schema({ 
    id_Torneo: int
}));