const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const randomstring = require('randomstring');
const bcrypt = require('bcrypt');

var RoomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false,
        default: 'New Room'
    },
    guests: [{type: ObjectId, ref:'User'}],
    alive: {
        type: Boolean,
        default: true
    },
    public: {
        type: Boolean,
        default: false
    },
    passcode: {
        type: String,
        default: () => {
            var fourLetterCode = randomstring.generate(4);
            //return bcrypt.hash(fourLetterCode, 10, (_, hash) => { return hash; });
            return fourLetterCode;
        }
    }
});

RoomSchema.statics.compare = (room, pass, cb) => {
    return bcrypt.compare(pass, room.passcode, cb);
};


var Room = mongoose.model('Room', RoomSchema);
module.exports = Room;
