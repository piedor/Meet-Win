const express = require('express');
const router = express.Router();
// Modello di mongoose (stabilisce quali dati l'oggetto contiene)
const utente = require('./models/utente');

// Se app.js capta una GET verso /api/v1/utenti/me allora ritorna i dati del profilo
router.get('/me', async (req, res) => {
    // Ritorna il mio profilo -> devo essere autenticato
    if(!req.loggedUser) {
        return;
    }
    // Trova l'utente via email
	let user = await utente.findOne({
		email: req.loggedUser.email
	}).exec();

    res.status(200).json({
        email: user.email,
        nickname: user.nickname
    });
});

// Se app.js capta una GET verso /api/v1/utenti/logout allora procedi con il logout
router.get('/logout', async (req, res) => {
    // Controlla se c'è il token
    if(req.cookies.token){
        // rimuovi il token
        res.clearCookie("token");
        res.json({ success: true, message: 'Logout effettuato con successo!' });
        return;
    }
    else{
        res.json({ success: false, message: 'Non sei loggato!' });
        return;
    }
});

// Se app.js capta una GET verso /api/v1/utenti/:nickname allora ritorna i dati del profilo
router.get('/:nickname', async (req, res) => {
    // Ritorna profilo utente da ricerca utenti
    // Ricerca utente via nickname
    // Attenzione a non mandare dati sensibili (es. mail, password)
	let user = await utente.findOne({
		nickname: req.params.nickname
	}).exec();

    if(user){
        res.json({ 
            success: true, 
            nickname: user.nickname,
            bio: user.bio,
            preferenze: user.preferenze,
            piattaforme: user.piattaforme,
            avatar: user.id_img
        });
    }
    else{
        res.json({ 
            success: false, 
            message: "Utente non trovato!"
        });
    }
});

module.exports = router;
