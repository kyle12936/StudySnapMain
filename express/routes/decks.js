const express = require('express');
const Deck = require('../models/Deck');
const User = require('../models/User');


const router = express.Router();

// Create a new deck and associate it with a user
router.post('/create', async (req, res) => {
    const { username, name, cards } = req.body;

    if (!username || !name) {
        return res.status(400).json({ message: 'Username and deck name are required' });
    }

    try {
        // Find the user
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Create a new deck
        const newDeck = new Deck({ username, name, cards });
        await newDeck.save();

        // Associate the deck with the user
        user.decks.push(newDeck._id);
        await user.save();

        res.status(201).json({ message: 'Deck created successfully', deck: newDeck });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error creating deck', error: err.message });
    }
});

// Get all decks for a user
router.get('/user/:username', async (req, res) => {
    console.log('Fetching decks for:', req.params.username);
    const { username } = req.params;
    
    try {
        const user = await User.findOne({ username }).populate('decks'); // Populate decks
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ decks: user.decks });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error retrieving user decks', error: err.message });
    }
});

// Add a card to a deck
router.post('/:deckId/add-cards', async (req, res) => {
    const { deckId } = req.params; // Get deck ID from URL
    const { cards } = req.body; // Get cards from request body

    // Validate input
    if (!cards || !Array.isArray(cards)) {
        return res.status(400).json({ message: 'Cards must be an array' });
    }

    try {
        // Find the deck by ID
        const deck = await Deck.findById(deckId);
        if (!deck) {
            return res.status(404).json({ message: 'Deck not found' });
        }

        // Add new cards to the deck
        deck.cards = cards; 
        await deck.save();

        res.status(200).json({ message: 'Cards added successfully', deck });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error adding cards', error: err.message });
    }
});


router.get('/:deckId', async (req, res) => {
    console.log('Fetching deck for:', req.params);
    const { deckId } = req.params;
    
    try {
        const deck = await Deck.findById(deckId); // Populate decks
        if (!deck) {
            return res.status(404).json({ message: 'Deck not found' });
        }

        res.status(200).json({deck});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error retrieving user decks', error: err.message });
    }
});

module.exports = router;
