const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

var UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        default: 0,
        min: 0
    },
    owner: {
        type: Boolean,
        default: false
    },
    room_id: {
        type: ObjectId, ref:'Room'
    }
});

var User = mongoose.model('User', UserSchema);
module.exports = User;
