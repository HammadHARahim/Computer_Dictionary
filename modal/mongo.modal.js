const mongoose = require('mongoose');

const dicTermsModal = new mongoose.Schema({
	term: {
		type: String,
		required: [true, 'Document is not available'],
	},
	defination: {
		type: String,
		required: true,
	},
	termNote: {
		type: String,
		required: true,
	},
	lang: {
		type: String,
		required: true,
	},
});

module.exports = mongoose.model('Terms', dicTermsModal);
