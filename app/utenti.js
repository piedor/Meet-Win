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
        piattaforme: req.body.piattaforme,
        id_img: req.body.avatar,
        zona: req.body.zona,
        privato: req.body.privato
    });
    
    nuovoUtente.save()
    .then(() => {
        console.log('Nuovo utente salvato con successo');
    })
    .catch((errore) => {
        console.error('Errore durante il salvataggio dell\'utente:', errore);
        res.json({ success: false, message: 'Errore durante il salvataggio dell\'utente' });
        return;
    });

    res.json({
		success: true,
		message: 'Utente registrato correttamente!',
		email: req.body.email,
		nickname: req.body.nickname
	});
});

// Se app.js capta una PUT verso /api/v1/utenti allora procedi alla modifica dei dati dell'utente
router.put('', async function(req, res) {
    // Trova utente via email
    let userByEmail = await utente.findOne({
		email: req.body.email
	}).exec();
    // Utente non trovato
	if(!userByEmail) {
		res.json({ success: false, message: 'Utente non trovato!' });
		return;
	}
    // Aggiorna le variabili
    // Se preferenze non è definito allora si tratta di una reimpostazione della password (preferenze è obbligatorio vedi registrazione o modificaProfilo)
    if(req.body.preferenze){
        userByEmail.bio = req.body.bio;
        userByEmail.preferenze = req.body.preferenze;
        userByEmail.piattaforme = req.body.piattaforme;
        userByEmail.id_img = req.body.avatar;
        userByEmail.zona = req.body.zona;
        userByEmail.privato = req.body.privato;
    }
    // Controlla che password sia stata modificata
    if(req.body.password){
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        // Aggiorna password
        userByEmail.password = hashedPassword;
    }
    // Salva
    userByEmail.save();
    
    res.json({
        success: true,
        message: 'Utente modificato correttamente!',
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
        nickname: user.nickname, // Rimossa ritorno di password, non serve
        bio: user.bio,
        preferenze: user.preferenze,
        piattaforme: user.piattaforme,
        zona: user.zona,
        avatar: user.id_img,
        privato: user.privato
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

// Se app.js capta una GET verso /api/v1/utenti/list allora ritorna i nickname di tutti gli utenti registrati alla piattaforma
router.get('/list', async (req, res) => {
    // Ritorna nickname di tutti gli utenti
	let users = await utente.find({}).exec();
    var nickUsers = [];

    if(users){
        users.forEach(function(user) {
            nickUsers.push(user.nickname);
        });
        res.json({ 
            success: true,
            users: nickUsers
        });
    }
    else{
        res.json({ 
            success: false, 
            message: "Nessun utente registrato alla piattaforma!"
        });
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
