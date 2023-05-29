const express = require('express');    
const router = express.Router();
// Modello di mongoose (stabilisce quali dati l'oggetto contiene)
const utente = require('./models/utente');
// jwt usato per creare, firmare e verificare i token
const jwt = require('jsonwebtoken'); 


// Se app.js capta un POST verso /api/v1/authentications allora procedi all'autenticazione e crea un token
router.post('', async function(req, res) {
	
	// Trova l'utente via email
	let user = await utente.findOne({
		email: req.body.nickname
	}).exec();

	if (!user) {
		// Prova a trovare l'utente via nickname
		user = await utente.findOne({
			nickname: req.body.nickname
		}).exec();
	}
	
	// L'utente non è stato trovato
	if (!user) {
		res.json({ success: false, message: 'Nessun utente trovato!' });
		return;
	}
	
	// Se la password non coincide con quella in db esci
	// Prossimamente implementazione hash
	if (user.password != req.body.password) {
		res.json({ success: false, message: 'Password errata!' });
		return;
	}
	
	// Se le credenziali sono corrette genera il token
	// Dati nel token
	var payload = {
		email: user.email,
		id: user.nickname
	}
	// Tempo di vita: 24 ore (millisecondi)
	var options = {
		expiresIn: 86400 
	}
	var token = jwt.sign(payload, process.env.SUPER_SECRET, options);
	// Inserisci il token nei cookie
	res.cookie("token", token, { maxAge: 86400})

	res.json({
		success: true,
		message: 'Login avvenuto con successo!',
		token: token,
		email: user.email,
		id: user.id,
		nickname: user.nickname
	});

});



module.exports = router;