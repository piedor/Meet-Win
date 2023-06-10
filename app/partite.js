const express = require('express');
const router = express.Router();
// Modello di mongoose (stabilisce quali dati l'oggetto contiene)
const partita = require('./models/partita');
const torneo = require('./models/torneo');
const squadra = require('./models/squadra');

// Se app.js capta un POST verso /api/v1/partite allora procedi alla creazione della partita
router.post('', async function(req, res) {   
    // Crea nuovo partita
    const nuovaPartita = new partita({
        idTorneo: req.body.idTorneo,
        data: null,
        ora: null,
        idSquadra1: req.body.idSquadra1,
        idSquadra2: req.body.idSquadra2,
        risultato1: req.body.tipoRisultato,
        risultato2: req.body.tipoRisultato,
        fase: req.body.fase,
    });
    
    nuovaPartita.save()
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
		_id: nuovaPartita._id.toString(),
	});
});

// Se app.js capta una GET verso /api/v1/partite/:idPartita allora ritorna le info della partita
router.get('/:idPartita', async (req, res) => {
	let part = await partita.findOne({
		_id: req.params.idPartita
	}).exec();

   if(part){
        let torn = await torneo.findOne({_id: part.idTorneo}).exec();
        if(torn){
            let squadra1 = await squadra.findOne({_id: part.idSquadra1}).exec();
            let squadra2 = await squadra.findOne({_id: part.idSquadra2}).exec();
            if(squadra1 && squadra2){               
            res.json({ 
                success: true,
                nomeSquadra1: squadra1.nomeSquadra,
                capitano1: squadra1.capitano,
                nomeSquadra2: squadra2.nomeSquadra,
                capitano2: squadra2.capitano,
                nomeTorneo: torn.nomeTorneo,
                organizzatore: torn.organizzatore,
                argomento: torn.argomento,
                zona: torn.zona,
                risultato1: part.risultato1,
                risultato2: part.risultato2,
                data: part.data,
                ora: part.ora,
                fase: part.fase
        }); 
            }
        }else{
            res.json({ 
                success: false, 
                message: "Torneo non trovato!"
            });
        }
    }
    else{
        res.json({ 
            success: false, 
            message: "Squadra non trovata!"
        });
    }
});

// Se app.js capta una GET verso /api/v1/squadre/list/:idTorneo allora ritorna tutte le partite associate ad un torneo
router.get('/list/:idTorneo', async (req, res) => {
    //ritorna tutte le partite associate al torneo
    let partite = await partita.find({idTorneo: req.params.idTorneo}).exec();
    var idPartite = [];

    if(partite){
        partite.forEach(function(partita) {
            idPartite.push(partita._id.toString());
        });
        res.json({ 
            success: true,
            idPartite: idPartite,
        });
    }
    else{
        res.json({ 
            success: false, 
            message: "Non sono state generate partite per il torneo"
        });
    }
});

// Se app.js capta una GET verso /api/v1/partite/nickname/:nickname allora ritorna tutte le partite associate ad un utente
router.get('/nickname/:nickname', async (req, res) => {
    //ritorna tutte le partite associate all'utente
    let partite = await partita.find({idTorneo: req.params.nickname}).exec();
    var idPartite = [];

    if(partite){
        partite.forEach(function(partita) {
            idPartite.push(partita._id);
        });
        res.json({ 
            success: true,
            tornei: idPartite
        });
    }
    else{
        res.json({ 
            success: false, 
            message: "Non hai partite"
        });
    }
});

// Se app.js capta una PUT verso /api/v1/partite/addData/:idPartita allora aggiunge la data della partita
router.put('/addData/:idPartita', async function(req, res) {
    // Trova torneo via id
    let part = await partita.findOne({
		_id: req.params.idPartita
	}).exec();
    // Torneo non trovato
	if(!part) {
		res.json({ success: false, message: 'Partita non trovata!' });
		return;
	}
    part.data=req.body.data;
    part.ora=req.body.ora;
    
    // Salva
    part.save();
    
    res.json({
        success: true,
        message: 'Data inserita correttamente!',
    });
});


// Se app.js capta una PUT verso /api/v1/partite/partite/addScore/:idPartita allora aggiunge i risultati
router.put('/addScore/:idPartita', async function(req, res) {
    // Trova torneo via id
    let part = await partita.findOne({
		_id: req.params.idPartita
	}).exec();
    // Torneo non trovato
	if(!part) {
		res.json({ success: false, message: 'Partita non trovato!' });
		return;
	}
    part.risultato1=req.body.risultato1;
    part.risultato2=req.body.risultato2;
    var idWinner;    
    if(part.risultato1>part.risultato2){
        idWinner=part.idSquadra1;
    }else{
        idWinner=part.idSquadra2;
    }
    // Salva
    part.save();
    
    res.json({
        success: true,
        winner: idWinner,
        message: 'Risultato inserito correttamente!',
    });
});

module.exports = router;