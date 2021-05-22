const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
    name: String,
    price: String,
    url: String,
    description: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }]
});

module.exports = mongoose.model("product", productSchema);