const express = require('express');
const router = express.Router();
const utente = require('./models/utente'); // get our mongoose model
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens


// ---------------------------------------------------------
// route to authenticate and get a new token
// ---------------------------------------------------------
router.post('', async function(req, res) {
	
	// find the user
	let user = await utente.findOne({
		email: req.body.email
	}).exec();
	
	// user not found
	if (!user) {
		res.json({ success: false, message: 'Nessun utente trovato!' });
		return;
	}
	
	// check if password matches
	if (user.password != req.body.password) {
		res.json({ success: false, message: 'Password errata!' });
	}
	
	// if user is found and password is right create a token
	var payload = {
		email: user.email,
		id: user.nickname
		// other data encrypted in the token	
	}
	var options = {
		expiresIn: 86400 // expires in 24 hours
	}
	var token = jwt.sign(payload, process.env.SUPER_SECRET, options);

	res.json({
		success: true,
		message: 'Login avvenuto con successo!',
		token: token,
		email: user.email,
		id: user.id,
		nickname: user.nickname,
		self: "api/v1/" + user.nickname
	});

});



module.exports = router;