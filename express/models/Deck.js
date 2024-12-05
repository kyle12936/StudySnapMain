const mongoose = require('mongoose');

// Define Card Schema
const cardSchema = new mongoose.Schema({
    front: { type: String, required: true }, // The front side of the card
    back: { type: String, required: true },  // The back side of the card
});

// Define Deck Schema
const deckSchema = new mongoose.Schema({
    username: { type: String, required: true }, // User's username
    name: { type: String, required: true },    // Deck name
    cards: { type: [cardSchema], default: [] }, // Array of cards
}, {
    timestamps: true, // Automatically include createdAt and updatedAt fields
});

// Export Deck Model
module.exports = mongoose.model('Deck', deckSchema);
