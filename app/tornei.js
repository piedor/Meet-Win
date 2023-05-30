const express = require('express');
const router = express.Router();
// Modello di mongoose (stabilisce quali dati l'oggetto contiene)
const torneo = require('./models/torneo'); 


// Se app.js capta un POST verso /api/v1/registrations allora procedi alla registrazione dell'utente
router.post('', async function(req, res) {   
    // Crea nuovo torneo
    const nuovoTorneo = new torneo({
        nome: req.body.torneo,
        organizzatore: req.body.organizzatore,
        argomento: req.body.argomento,
        //work in progress
        
        /*password: req.body.password,
        bio: req.body.bio,
        regolamento: req.body.bio,
        tags: req.body.tags,
        piattaforma: req.body.piattaforma,
        numeroSquadre: req.body.nsquadre,
        numeroGiocatori: req.body.ngiocatori,
        id_img: req.body.id_img,
        zona: req.body.zona,
        dataInizio: req.body.data,
        publicato: false,
        terminato: false,
        formatoT: req.body.formatoT,
        numeroGironi: req.body.ngironi,
        fasi: req.body.fasi,
        faseAttuale: 0,
        formatoP: req.body.formatoP,
        partite: null, //id delle partite associate al torneo
        storicoPartite: null,
        squadreIscritte: null, //id delle squadre iscritte
        vincitrice: null, //id squdra vincitrice*/
    });
    
    nuovoTorneo.save()
    .then(() => {
        console.log('Nuovo torneo salvato con successo');
    })
    .catch((errore) => {
        console.error('Errore durante il salvataggio del torneo:', errore);
        res.json({ success: false, message: 'Errore durante il salvataggio del torneo' });
    });


    res.json({
		success: true,
		message: 'Torneo salvato correttamente!',
		email: req.body.email,
		nickname: req.body.nickname
	});
});

// Se app.js capta una GET verso /api/v1/tornei/:idTorneo allora ritorna i dati del torneo
router.get('/:idTorneo', async (req, res) => {
    // Ritorna profilo utente da ricerca utenti
    // Ricerca utente via nickname
    // Attenzione a non mandare dati sensibili (es. mail, password)
	let torn = await torneo.findOne({
		idTorneo: req.params.idTorneo
	}).exec();

    if(torn){
        res.json({ 
            success: true, 
            nome: torn.nomeTorneo,
            argomento: torn.argomento,
            id_img: torn.id_img,
            bio: torn.bio,
            regolamento: torn.regolamento
        });
    }
    else{
        res.json({ 
            success: false, 
            message: "Torneo non trovato!"
        });
    }
});

module.exports = router;