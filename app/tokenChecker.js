// jwt usato per creare, firmare e verificare i token
const jwt = require('jsonwebtoken');

const tokenChecker = function(req, res, next) {
	
	// Cerca il token nell'header, nei parametri url, nei parametri post o nei cookie
	var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.cookies.token;

	// Se non trova il token
	if (!token) {
		return res.status(401).send({ 
			success: false,
			message: 'No token provided.'
		});
	}

	// Decodifica token e verificade
	jwt.verify(token, process.env.SUPER_SECRET, function(err, decoded) {			
		if (err) {
			return res.status(403).send({
				success: false,
				message: 'Failed to authenticate token.'
			});		
		} else {
			// Memorizza lo stato autenticato per altre route
			res.app.set('user', decoded);
			req.loggedUser = decoded;
			next();
		}
	});
	
};

module.exports = tokenChecker