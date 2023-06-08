const express = require('express');
const router = express.Router();
// Modello di mongoose (stabilisce quali dati l'oggetto contiene)
const squadra = require('./models/squadra');

// Se app.js capta un POST verso /api/v1/squadre allora procedi alla creazione della squadra
router.post('', async function(req, res) {  
    
    //controlla se ci sono ancora posti nel torneo
    let squadreIscritte = await squadra.find({
        idTorneo: req.body.idTorneo
	}).exec();
    if(squadreIscritte.length>=req.body.numeroSquadre){        
		res.json({ success: false, message: 'Numero squadre massimo per questo torneo già raggiunto' });        
		return;
    };  

    //cerca se l'utente ha già iscritto una squadra
    let squadraBycap = await squadra.findOne({
        capitano: req.body.capitano,
        idTorneo: req.body.idTorneo
	}).exec();
    // torneo esiste già
	if (squadraBycap) {
		res.json({ success: false, message: 'Hai già iscritto una squadra a questo torneo!' });        
		return;
	}
    
    //cerca se c'è già una squadra con quel nome
    let squadraByName = await squadra.findOne({
        nomeSquadra: req.body.nomeSquadra,
        idTorneo: req.body.idTorneo
	}).exec();
    // torneo esiste già
	if (squadraByName) {
		res.json({ success: false, message: 'Al torneo è già iscritta una squadra con questo nome!' });        
		return;
	}
    
    //controlla se uno o più giocatori sono già iscritti al torneo
    let squadre = await squadra.find({idTorneo: req.body.idTorneo}).exec();
    var giocatoriIscritti=[];
    var giocatoriDaIscrivere=req.body.giocatori;
    if(squadre){
        squadre.forEach(function(squadra) {
            squadra.giocatori.forEach(function(giocatore){giocatoriIscritti.push(giocatore)});
        });
        giocatoriDaIscrivere.forEach(function(giocatore){
            if(giocatoriIscritti.includes(giocatore)){
                res.json({ success: false, message: 'Uno o più giocatori che hai selezionato sono iscritti già al torneo, ricontrolla dalla scheda torneo prima di riprovare.' });        
		        return;
            }
        })
    }
    
    // Crea nuova squadra
    const nuovaSquadra = new squadra({
        nomeSquadra: req.body.nomeSquadra,
        capitano: req.body.capitano,
        idTorneo: req.body.idTorneo,
        giocatori: req.body.giocatori,
        partite: null, //no partite di default        
    });
    
    nuovaSquadra.save()
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

//da errori

// Se app.js capta una GET verso /api/v1/squadra/:idsquadra allora ritorna le info della squadra i membri della squadra
router.get('/:idSquadra', async (req, res) => {
    // Ritorna i nickname dei membri della squadra

	let squad = await squadra.findOne({
		_id: req.params.idSquadra
	}).exec();
   if(squad){      
        res.json({ 
            success: true,
            nomeSquadra: squad.nomeSquadra,
            capitano: squad.capitano,
            nomeTorneo: squad.idTorneo,
            giocatori: squad.giocatori,
        });
    }
    else{
        res.json({ 
            success: false, 
            message: "Squadra non trovata!"
        });
    }
});


// Se app.js capta una GET verso /api/v1/squadre/list/:idTorneo allora ritorna tutte le squadre associate ad un torneo e una lista di giocatori
router.get('/list/:idTorneo', async (req, res) => {
    //ritorna tutte le squadre associate al torneo
    let squadre = await squadra.find({idTorneo: req.params.idTorneo}).exec();
    var idSquadre = [];
    var nomiSquadre = [];
    var giocatoriIscritti=[];

    if(squadre!=undefined){
        squadre.forEach(function(squadra) {
            let temp= [];
            squadra.giocatori.forEach(function(giocatore){temp.push(giocatore)});
            giocatoriIscritti.push(temp);
            idSquadre.push(squadra._id);
            nomiSquadre.push(squadra.nomeSquadra);
        });
        res.json({ 
            success: true,
            idSquadre: idSquadre,
            nomiSquadre: nomiSquadre,
            giocatori: giocatoriIscritti
        });
    }
    else{
        res.json({ 
            success: false, 
            message: "Non ci sono ancora squadre iscritte"
        });
    }
});
/*
// Se app.js capta una GET verso /api/v1/squadre/check allora ritorna false se l'utente non è iscritto al torneo
router.post('/check', async (req, res) => {
    //ritorna tutte le squadre associate al torneo
    let squadre = await squadra.find({idTorneo: req.body.idTorneo, giocatori: req.body.nickname}).exec();

    if(squadre){
        //esiste una squadra con quel utente    
        res.json({ 
            success: true,
            message: "utente già iscritto"
        });
        return;
    }
    else{
        res.json({ 
            success: false, 
            message: "utente non iscritto"
        });
    }
});*/

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

//Se app.js capta una DELETE verso /api/v1/squadre/:id
router.delete('/:idSquadra', async (req, res) => {
    let squad = await squadra.findOne({_id: req.params.idSquadra}).exec();
    if (!squad) {
        res.status(404).json({ 
            success: false, 
            message: "Squadra non trovata"
        });
        return;
    }
    await squad.deleteOne()
    console.log('Squadra rimossa')
    res.status(204).json({ 
        success: true, 
        message: "Squadra rimossa con successo"
    });
});

module.exports = router;