const path = require('path');

function mid_Auth(req, res, next) {
	// console.log(req.headers.origin);

	const { origin } = req.headers;
	if (!origin) {
		return (
			// if don't will send the header twice resulting "ERR_HTTP_HEADERS_SENT"
			res
				.status(401)
				.render(path.join(__dirname, '../', 'views', 'Unauthorised.pug'))
		);
	}
	console.log(origin);
	next();
}

module.exports = mid_Auth;
