const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
    solution: String,
    language: String,
    question_id: String,
    authors: [
        {
            user_id: String,
        },
    ],
});

const History = mongoose.model('History', historySchema);
module.exports = History;