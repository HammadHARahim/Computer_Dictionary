require('dotenv').config();
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const express = require('express');
const connectDb = require('./db/connect');
const router = require('./routes/terms.routes');
const mid_Auth = require('./middleware/auth');

const app = express();

//middleware
app.use(morgan('combined'));
app.use(
	cors({
		origin: 'http://127.0.0.1:5501',
	})
);
app.use('/api/v1', mid_Auth, router);

//templete engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
// starting the server with database access
async function start() {
	await connectDb(process.env.MONGO_URL);

	app.listen(1000, () => {
		console.log('listening on 1000');
	});
}

start();
