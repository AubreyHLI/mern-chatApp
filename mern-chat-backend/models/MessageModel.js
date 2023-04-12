const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    content: {
        type: String,
        default: null
    },
    image: {
        public_id: {
            type: String
        },
        url: {
            type: String
        },
        default: {}
    },
    socketid: String,
    from: Object,
    to: Object,
    time: String,
    date: String
});

const Message = mongoose.model('Message', MessageSchema);
module.exports = Message;