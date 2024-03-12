var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var QuestionsSchema = new Schema({
    text: {type:String, required:true},
    answer: {type:String},
    // video: {type:video/webm},
    emotion_freq: {type:Object}
})

module.exports = mongoose.model('Questions', QuestionsSchema);