const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
// Modello di mongoose (stabilisce quali dati l'oggetto contiene)
const utente = require('./models/utente');

// Se app.js capta un POST verso /api/v1/utenti allora procedi alla registrazione dell'utente
router.post('', async function(req, res) {
    // Vedi se email o nickname sono già utilizzati
    let userByEmail = await utente.findOne({
		email: req.body.email
	}).exec();

    // Email esiste già
	if (userByEmail) {
		res.json({ success: false, message: 'Email già utilizzata!' });
		return;
	}

    let userByNickname = await utente.findOne({
		nickname: req.body.nickname
	}).exec();

    // Nickname esiste già
	if (userByNickname) {
		res.json({ success: false, message: 'Nickname già utilizzato!' });
		return;
	}
   
    // Crea nuovo utente
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const nuovoUtente = new utente({
        nickname: req.body.nickname,
        email: req.body.email,
        password: hashedPassword,
        cellulare: 0,
        verificato: false,
        bloccato: false,
        limitato: false,
        bio: req.body.bio,
        preferenze: req.body.preferenze,
        piattaforme: req.body.piattaforme
    });
    
    nuovoUtente.save()
    .then(() => {
        console.log('Nuovo utente salvato con successo');
    })
    .catch((errore) => {
        console.error('Errore durante il salvataggio dell\'utente:', errore);
        res.json({ success: false, message: 'Errore durante il salvataggio dell\'utente' });
    });


    res.json({
		success: true,
		message: 'Utente registrato correttamente!',
		email: req.body.email,
		nickname: req.body.nickname
	});
});

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

//va spostata fuori
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
            piattaforme: user.piattaforme
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
