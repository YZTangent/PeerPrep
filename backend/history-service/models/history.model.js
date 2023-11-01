const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
    questionId: String,
    language: String,
    solution: String,
    userId: String,
    authors: [
        {
            user_id: String,
        },
    ],
});

const History = mongoose.model('History', historySchema);
module.exports = History;