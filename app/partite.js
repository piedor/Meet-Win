const express = require('express');
const router = express.Router();
// Modello di mongoose (stabilisce quali dati l'oggetto contiene)
const partita = require('./models/partita');

// Se app.js capta un POST verso /api/v1/partite allora procedi alla creazione della partita
router.post('', async function(req, res) {   
    // Crea nuovo partita
    const nuovaPartita = new partita({
        idTorneo: req.body.idTorneo,
        data: req.body.data,
        ora: req.body.ora,
        idSquadra1: req.body.idSquadra1,
        idSquadra2: req.body.idSquadra2,
        risultato1: 0,
        risultato2: 0,
        vincitrice: NULL,
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
		_id: nuovaPartita._id.toString(),
	});
});

// Se app.js capta una GET verso /api/v1/partite/:idPartita allora ritorna le info della partita
router.get('/:idPartita', async (req, res) => {
    // Ritorna i nickname dei membri della squadra
	let partita = await idPartita.findOne({
		_id: req.params.partita
	}).exec();

   if(partita){
        let torneo = await idTorneo.findOne({_id: partita.idTorneo}).exec();
        if(torneo){
            let squadra1 = await idSquadra1.findOne({_id: partita.idSquadra1}).exec();
            let squadra2 = await idSquadra2.findOne({_id: partita.idSquadra2}).exec();
            if(squadra1 && squadra2){               
            res.json({ 
                success: true,
                nomeSquadra1: squadra1.nomeSquadra,
                capitano1: squadra1.capitano,
                nomeSquadra2: squadra2.nomeSquadra,
                capitano2: squadra2.capitano,
                nomeTorneo: torneo.nomeTorneo,
                organizzatore: torneo.organizzatore,
                argomento: torneo.argomento,
                zona: torneo.zona,
                risultato1: partita.risultato1,
                risultato2: partita.risultato2,
                data: partita.data,
                ora: partita.ora,
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


module.exports = router;