const express = require('express');    
const router = express.Router();
const bcrypt = require('bcryptjs');
const saltRounds = 10;
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
	// Compara hash con password inserita
	if (!req.body.password) req.body.password = "";
	const result = await bcrypt.compare(req.body.password, user.password);
	if (!result) {
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
	res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "Strict"}) // No Cookie via JS, solo su HTTPS, solo sul sito

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