const express = require('express');
const router = express.Router();
// Modello di mongoose (stabilisce quali dati l'oggetto contiene)
const partita = require('./models/partita'); 
const torneo = require('./models/torneo'); 

// Se app.js capta un POST verso /api/v1/partite allora procedi alla creazione della partita
router.post('', async function(req, res) {   
    // Crea nuovo partita
    const nuovopartita = new partita({
        id_Torneo: Number,
        data: Number,
        ora: Number,
        luogo: String,
        nome_squadra1: String,
        nome_squadra2: String,
        risultato1: Number,
        risultato2: Number,
        vincitrice: Number,
    });
    
    nuovopartita.save()
    .then(() => {
        console.log('Nuova partita creata con successo');
    })
    .catch((errore) => {
        console.error('Errore durante la creazione della partita:', errore);
        res.json({ success: false, message: 'Errore durante la creazione della partita' });
    });


    res.json({
		success: true,
		message: 'Partita creata correttamente!',
		email: req.body.email,
		nickname: req.body.nickname
	});
});

// Se app.js capta una GET verso /api/v1/tornei/:idpartita allora ritorna i dati del partita
router.get('/:idPartita', async (req, res) => {
    // Ritorna profilo utente da ricerca utenti
    // Ricerca utente via nickname
    // Attenzione a non mandare dati sensibili (es. mail, password)
	let part = await idPartita.findOne({
		idPartita: req.params.idPartita
	}).exec();

    if(part){
        let torneo = await id_Torneo.findOne({id_Torneo: part.id_Torneo}).exec();
        res.json({ 
            success: true,
            nomeTorneo: torneo.nomeTorneo,
            argomento: torneo.argomento,
            organizzatore: torneo.organizzatore,
            luogo: torneo.zona,
            id_partita: part.id_partita,
            data: part.data,
            ora: part.ora,
            luogo: part.luogo,
            nomesquadra1: part.nome_squadra1,
            nomesquadra2: part.nome_squadra2,
            risultato1: part.risultato1,
            risultato2: part.risultato2,
            vincitrice: part.vincitrice,
        });
    }
    else{
        res.json({ 
            success: false, 
            message: "Partita non trovata!"
        });
    }
});

// Se app.js capta una GET verso /api/v1/partite/list:idTorneo allora ritorna tutte le partite del torneo
router.get('/list', async (req, res) => {
    /*esempio di lista utenti, da completare
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
    }*/
});

module.exports = router;