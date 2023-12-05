var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserDetails = new Schema({
	username:{
        type: String
    },
    email:{
        type: String
    },
    password:{
        type: String
    },
    
	dateTime  : {
        type: Date, 
        default: Date.now
    },
});
module.exports = mongoose.model('UserDetails', UserDetails, 'UserDetails');