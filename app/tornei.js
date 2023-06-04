const express = require('express');
const router = express.Router();
// Modello di mongoose (stabilisce quali dati l'oggetto contiene)
const torneo = require('./models/torneo'); 

// Se app.js capta un POST verso /api/v1/tornei allora procedi alla creazione del torneo
router.post('', async function(req, res) {   
    // Crea nuovo torneo
    const nuovoTorneo = new torneo({
        nomeTorneo: req.body.nomeTorneo,
        organizzatore: req.body.organizzatore,
        argomento: req.body.argomento,
        bio: req.body.bio,
        regolamento: req.body.regolamento,
        tags: req.body.tags,
        piattaforma: req.body.piattaforma,
        numeroSquadre: req.body.nsquadre,
        numeroGiocatori: req.body.ngiocatori,
        id_img: req.body.logoT,
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
        //password
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

// Se app.js capta una GET verso /api/v1/tornei/list allora ritorna i nomi di tutti i tornei creati sulla piattaforma
router.get('/list', async (req, res) => {
    // Ritorna nickname di tutti gli utenti
	let tornei = await torneo.find({}).exec();
    var nomiTornei = [];

    if(tornei){
        tornei.forEach(function(user) {
            nomiTornei.push(user._id);
        });
        res.json({ 
            success: true,
            tornei: nomiTornei
        });
    }
    else{
        res.json({ 
            success: false, 
            message: "Nessun torneo presente sulla piattaforma!"
        });
    }
});

// Se app.js capta una GET verso /api/v1/tornei/:idTorneo allora ritorna i dati del torneo
router.get('/:idTorneo', async (req, res) => {
    // Ritorna le info del torneo
    // Ricerca torneo via idTorneo
	let torn = await torneo.findOne({
		_id: req.params.idTorneo
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