const express = require('express');
const router = express.Router();
// Modello di mongoose (stabilisce quali dati l'oggetto contiene)
const torneo = require('./models/torneo'); 

// Se app.js capta un POST verso /api/v1/tornei allora procedi alla creazione del torneo
router.post('', async function(req, res) {
    //vedi se l'organizzatore ha già 10 tornei non terminati
    let torneiByOrg = await torneo.find({
        organizzatore: req.body.organizzatore,
        terminato: false
	}).exec();
    // if org ha più di 10 tornei
	if (torneiByOrg.length>10) {
		res.json({ success: false, message: 'Non puoi avere più di 10 tornei non terminati!' });        
		return;
	}

    // Vedi se l'organizzatore ha già un torneo con quel nome

    let torneoByOrg = await torneo.findOne({
        organizzatore: req.body.organizzatore,
        nomeTorneo: req.body.nomeTorneo
	}).exec();
    // torneo esiste già
	if (torneoByOrg) {
		res.json({ success: false, message: 'Non puoi avere 2 tornei con lo stesso nome!' });        
		return;
	}

    // Crea nuovo torneo
    const nuovoTorneo = new torneo({
        nomeTorneo: req.body.nomeTorneo,
        organizzatore: req.body.organizzatore,
        argomento: req.body.argomento,
        bio: req.body.bio,
        regolamento: req.body.regolamento,
        tags: req.body.tags,
        piattaforma: req.body.piattaforma,
        numeroSquadre: req.body.numeroSquadre,
        numeroGiocatori: req.body.numeroGiocatori,
        dataInizio: req.body.dataInizio,
        id_img: req.body.logoT,
        zona: req.body.zona,
        pubblicato: false,
        terminato: false,
        formatoT: req.body.formatoT,
        numeroGironi: req.body.numeroGironi,
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
		_id: nuovoTorneo._id.toString(),
	});
});

// Se app.js capta una PUT verso /api/v1/tornei allora procedi alla modifica dei dati del torneo
router.put('', async function(req, res) {
    // Trova torneo via id
    let torneoById = await torneo.findOne({
		_id: req.body._id
	}).exec();
    // Torneo non trovato
	if(!torneoById) {
		res.json({ success: false, message: 'Torneo non trovato!' });
		return;
	}
    // Aggiorna le variabili
        torneoById.organizzatore=torneoById.organizzatore;
        torneoById.nomeTorneo = req.body.nomeTorneo;
        torneoById.bio = req.body.bio;
        torneoById.regolamento = req.body.regolamento;
        torneoById.tags = req.body.tags;
        torneoById.piattaforma = req.body.piattaforma;
        torneoById.logoT = req.body.logoT;
        torneoById.zona = req.body.zona;
        torneoById.numeroSquadre = req.body.numeroSquadre;
        torneoById.numeroGiocatori = req.body.numeroGiocatori;
        torneoById.dataInizio = req.body.dataInizio;
        torneoById.formatoT = req.body.formatoT;
        torneoById.numeroGironi = req.body.numeroGironi;
        torneoById.formatoP = req.body.formatoP;
        torneoById.fasi = req.body.fasi;

    // Salva
    torneoById.save();
    
    res.json({
        success: true,
        message: 'Torneo modificato correttamente!',
    });
});

// Se app.js capta una GET verso /api/v1/tornei/list allora ritorna gli id di tutti i tornei creati sulla piattaforma
router.get('/list', async (req, res) => {
    // Ritorna l'id di tutti i tornei
	let tornei = await torneo.find({}).exec();
    var idTornei = [];

    if(tornei){
        tornei.forEach(function(torneo) {
            idTornei.push(torneo._id);
        });
        res.json({ 
            success: true,
            tornei: idTornei
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
            organizzatore:torn.organizzatore,
            nomeTorneo: torn.nomeTorneo,
            argomento: torn.argomento,
            id_img: torn.id_img,
            bio: torn.bio,
            regolamento: torn.regolamento,
            numeroSquadre: torn.numeroSquadre,
            numeroGiocatori: torn.numeroGiocatori,
            formatoT: torn.formatoT,
            numeroGironi: torn.numeroGironi,
            formatoP: torn.formatoP,
            pubblicato: torn.pubblicato,
            //tags: [String],
            piattaforma: torn.piattaforma,
            dataInizio: torn.dataInizio,
            terminato: torn.terminato,
            fasi: torn.fasi,
            faseAttuale: torn.faseAttuale,

        });
    }
    else{
        res.json({ 
            success: false, 
            message: "Torneo non trovato!"
        });
    }
});

// Se app.js capta una GET verso /api/v1/tornei/:nickname allora ritorna gli id di tutti i tornei creati da quell'utente
router.get('/nickname/:nickname', async (req, res) => {
    // Ritorna gli id dei tornei di un utente
	let tornei = await torneo.find({organizzatore: req.params.nickname}).exec();
    var idTornei = [];

    if(tornei){
        tornei.forEach(function(torneo) {
            idTornei.push(torneo._id);
        });
        res.json({ 
            success: true,
            tornei: idTornei
        });
    }
    else{
        res.json({ 
            success: false, 
            message: "Non hai ancora creato nessun torneo, creane uno ora!"
        });
    }
});


module.exports = router;