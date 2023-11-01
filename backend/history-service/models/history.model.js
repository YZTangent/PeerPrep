const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
    question_id: String,
    language: String,
    solution: String,
    authors: [
        {
            user_id: String,
        },
    ],
});

const History = mongoose.model('History', historySchema);
module.exports = History;