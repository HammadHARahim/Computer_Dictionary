const mongoose = require('mongoose');

const connectDb = async (url) => {
	mongoose
		.connect(url)
		.then(() => console.log('connected to database'))
		.catch((err) => console.error(err));
};

module.exports = connectDb;
