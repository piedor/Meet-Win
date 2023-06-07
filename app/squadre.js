const express = require('express');
const router = express.Router();
// Modello di mongoose (stabilisce quali dati l'oggetto contiene)
const squadra = require('./models/partita'); 
const squadra = require('./models/torneo'); 

// Se app.js capta un POST verso /api/v1/partite allora procedi alla creazione della partita
router.post('', async function(req, res) {   
    // Crea nuovo partita
    const nuovaSquadra = new squadra({
        nomeSquadra: req.body.nomeSquadra,
        capitano: req.body.capitano,
        idTorneo: req.body.idTorneo,
        giocatori: req.body.giocatori,
        partite: null, //no partite di default        
    });
    
    nuovopartita.save()
    .then(() => {
        console.log('Nuova Squadra creata con successo');
    })
    .catch((errore) => {
        console.error('Errore durante la creazione della squadra:', errore);
        res.json({ success: false, message: 'Errore durante la creazione della squadra' });
    });

    res.json({
		success: true,
		message: 'Squadra creata correttamente!',
		_id: nuovaSquadra._id.toString(),
	});
});

// Se app.js capta una GET verso /api/v1/squadra/:idsquadra allora ritorna le info della squadra i membri della squadra
router.get('/:idSquadra', async (req, res) => {
    // Ritorna i nickname dei membri della squadra
	let squadra = await idSquadra.findOne({
		_id: req.params.idSquadra
	}).exec();

   if(squadra){
        let torneo = await idTorneo.findOne({idTorneo: squadra.idTorneo}).exec();
        if(torneo){
        res.json({ 
            success: true,
            nomeSquadra: squadra.nomeSquadra,
            capitano: squadra.capitano,
            nomeTorneo: torneo.nomeTorneo,
            argomento: torneo.argomento,
            organizzatore: torneo.organizzatore,
            partite: squadra.partite,
            giocatori: squadra.giocatori,
        });
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

// Se app.js capta una GET verso /api/v1/squadre/list/:idTorneo allora ritorna tutte le squadre associate ad un torneo
router.get('/list/:idTorneo', async (req, res) => {
    //ritorna tutte le squadre associate al torneo
    let squadre = await squadra.find({idTorneo: req.params.idTorneo}).exec();
    var idSquadre = [];

    if(squadre){
        squadre.forEach(function(squadra) {
            idSquadre.push(squadra._id);
        });
        res.json({ 
            success: true,
            tornei: idSquadre
        });
    }
    else{
        res.json({ 
            success: false, 
            message: "Non ci sono ancora squadre iscritte"
        });
    }
});
//idea-> cerca in giocatori il nickname -> se c'è passa gli id delle partite associate
// Se app.js capta una GET verso /api/v1/squadre/nickname/:nickname
router.get('/nickname/:idSquadra', async (req, res) => {
    //
    let squadra = await squadra.findOne({idTorneo: req.params.idTorneo}).exec();
    var idSquadre = [];

    if(squadre){
        squadre.forEach(function(squadra) {
            idSquadre.push(squadra._id);
        });
        res.json({ 
            success: true,
            tornei: idSquadre
        });
    }
    else{
        res.json({ 
            success: false, 
            message: "Non ci sono ancora squadre iscritte"
        });
    }
});
module.exports = router;