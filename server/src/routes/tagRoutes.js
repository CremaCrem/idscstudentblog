const express = require('express');
const { getSuggestions, getPopularTags } = require('../controllers/tagController');

const router = express.Router();

router.get('/suggestions', getSuggestions);
router.get('/popular', getPopularTags);

module.exports = router;
