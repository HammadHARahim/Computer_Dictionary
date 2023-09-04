const express = require('express');
const router = express.Router();

const {
	getAlldata,
	getDataOnly,
} = require('../controller/dicterms.controller');

router.get('/terms', getAlldata);
router.get('/terms/:id', getDataOnly);

module.exports = router;
