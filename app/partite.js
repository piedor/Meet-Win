const express = require('express');
const router = express.Router();
// Modello di mongoose (stabilisce quali dati l'oggetto contiene)
const partita = require('./models/partita'); 

// Se app.js capta un POST verso /api/v1/registrations allora procedi alla registrazione dell'utente
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
        res.json({ 
            success: true,
            argomento: part.argomento,
            id_img: torn.id_img,
            bio: torn.bio,
            regolamento: torn.regolamento,
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

module.exports = router;