var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('NotificaInterna', new Schema({ 
    id_notificann: int
}));