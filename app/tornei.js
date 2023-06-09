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
        avviato: false,
        formatoT: req.body.formatoT,
        numeroGironi: req.body.numeroGironi,
        fasi: req.body.fasi,
        faseAttuale: 0,
        formatoP: req.body.formatoP,
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
        
    torneoById.argomento = req.body.argomento;
    torneoById.nomeTorneo = req.body.nomeTorneo;
    torneoById.bio = req.body.bio;
    torneoById.regolamento = req.body.regolamento;
    torneoById.tags = req.body.tags;
    torneoById.piattaforma = req.body.piattaforma;
    torneoById.id_img = req.body.logoT;
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

// Se app.js capta una GET verso /api/v1/tornei/list allora ritorna gli id di tutti i tornei pubblici non terminati sulla piattaforma
router.get('/list', async (req, res) => {
    // Ritorna l'id di tutti i tornei
	let tornei = await torneo.find({pubblicato: true, terminato: false}).exec();
    var idTornei = [];
    var avviati=[]; //used to redirect to the correct page when interacting with the torneo
    if(tornei){
        tornei.forEach(function(torneo) {
            idTornei.push(torneo._id);
            avviati.push(torneo.avviato);
        });
        res.json({ 
            success: true,
            tornei: idTornei,
            avviati: avviati
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
            zona: torn.zona,
            bio: torn.bio,
            regolamento: torn.regolamento,
            numeroSquadre: torn.numeroSquadre,
            numeroGiocatori: torn.numeroGiocatori,
            formatoT: torn.formatoT,
            numeroGironi: torn.numeroGironi,
            formatoP: torn.formatoP,
            pubblicato: torn.pubblicato,
            avviato: torn.avviato,
            tags: torn.tags,
            piattaforma: torn.piattaforma,
            dataInizio: torn.dataInizio,
            terminato: torn.terminato,
            fasi: torn.fasi,
            faseAttuale: torn.faseAttuale,
            zona:torn.zona,
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

// Se app.js capta una PUT verso /api/v1/tornei/:idTorneo/pubblica allora pubblicazione del torneo
router.put('/:idTorneo/pubblica', async function(req, res) {
    // Trova torneo via id
    let torneoById = await torneo.findOne({
		_id: req.params.idTorneo
	}).exec();
    // Torneo non trovato
	if(!torneoById) {
		res.json({ success: false, message: 'Torneo non trovato!' });
		return;
	}
    torneoById.pubblicato=true;
    // Salva
    torneoById.save();
    
    res.json({
        success: true,
        message: 'Torneo pubblicato correttamente!',
    });
});

router.put('/:idTorneo/avvia', async function(req, res) {
    // Trova torneo via id
    let torneoById = await torneo.findOne({
		_id: req.params.idTorneo
	}).exec();
    // Torneo non trovato
	if(!torneoById) {
		res.json({ success: false, message: 'Torneo non trovato!' });
		return;
	}
    torneoById.avviato=true;
    // Salva
    torneoById.save();
    
    res.json({
        success: true,
        message: 'Torneo pubblicato correttamente!',
    });
});

// Se app.js capta una PUT verso /api/v1/tornei/:idTorneo/termina allora termina il torneo e aggiorna i risultati sugli utenti
router.put('/:idTorneo/termina', async function(req, res) {
    // Trova torneo via id
    let torneoById = await torneo.findOne({
		_id: req.params.idTorneo
	}).exec();
    // Torneo non trovato
	if(!torneoById) {
		res.json({ success: false, message: 'Torneo non trovato!' });
		return;
	}
    torneoById.terminato=req.body.terminato;
    //inserisci vincitore

    // Salva
    torneoById.save();
    
    res.json({
        success: true,
        message: 'Torneo terminato correttamente!',
    });
});

//Se app.js capta una DELETE verso /api/v1/tornei/:id
router.delete('/:idTorneo', async (req, res) => {
    let torn = await torneo.findOne({_id: req.params.idTorneo}).exec();
    if (!torn) {
        res.status(404).json({ 
            success: false, 
            message: "Torneo non trovato"
        });
        return;
    }
    await torn.deleteOne()
    console.log('Torneo rimosso')
    res.json({ 
        success: true, 
        message: "Torneo rimosso con successo"
    });
});

// Se app.js capta una PUT verso /api/v1/tornei/avanzamento/:idTorneo allora avanza la fase del torneo
router.put('/avanzamento/:idTorneo', async function(req, res) {
    // Trova torneo via id
    let torn = await torneo.findOne({_id: req.params.idTorneo}).exec();
    // Torneo non trovato
	if(!torn) {
		res.json({ success: false, message: 'Torneo non trovato!' });
		return;
	}
    torn.faseAttuale++;
    
    // Salva
    torn.save();
    
    res.json({
        success: true,
        message: 'avanzamento inserito correttamente!',
    });
});

module.exports = router;