const express = require('express');
const router = express.Router();

// Sample GET route
router.get('/', (req, res) => {
    console.log("hello")
    res.send('Sample API is working!');
});

module.exports = router;
