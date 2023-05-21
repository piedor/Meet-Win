const express = require('express');
const router = express.Router();
const utente = require('./models/utente'); // get our mongoose model


router.get('/me', async (req, res) => {
    // Ritorna il mio profilo -> devo essere autenticato
    if(!req.loggedUser) {
        return;
    }
    // find the user by email
	let user = await utente.findOne({
		email: req.loggedUser.email
	}).exec();

    res.status(200).json({
        self: '/api/v1/utenti/' + user.id,
        email: user.email,
        nickname: user.nickname
    });
});

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

router.delete('/:id', async (req, res) => {
    let utente = await utente.findById(req.params.id).exec();
    if (!utente) {
        res.status(404).send()
        console.log('utente not found')
        return;
    }
    await utente.deleteOne()
    console.log('utente removed')
    res.status(204).send()
});

router.post('', async (req, res) => {

	let utente = new utente({
        nickname: req.body.nickname
    });
    
	utente = await utente.save();
    
    let listaUtenti = utenti.nickname; 

    console.log('Book saved successfully');

    /**
     * Link to the newly created resource is returned in the Location header
     * https://www.restapitutorial.com/lessons/httpmethods.html
     */
    res.location("/api/v1/books/" + listaUtenti).status(201).send();
});


module.exports = router;
