const express = require('express');
const router = express.Router();
// Modello di mongoose (stabilisce quali dati l'oggetto contiene)
const notifica = require('./models/notifiche');

// Se app.js capta un POST verso /api/v1/notifiche allora procedi alla creazione della notifica
router.post('', async function(req, res) {   
    // Crea nuovo partita
    const nuovaNotifica = new notifica({
        idMittente: req.body.idMittente,
        idDestinatario: req.body.idDestinatario,
        categoria: req.body.categoria,
        accettato: req.body.accettato,
        data: req.body.data
    });
    
    nuovaNotifica.save()
    .then(() => {
        console.log('Nuova notifica creata con successo');
    })
    .catch((errore) => {
        console.error('Errore durante la creazione della notifica:', errore);
        res.json({ success: false, message: 'Errore durante la creazione della notifica' });
    });


    res.json({
		success: true,
		message: 'Notifica creata correttamente!'
	});
});

// Se app.js capta una GET verso /api/v1/notifiche/list/:idDestinatario allora ritorna tutte le notifiche associate all'utente 
router.get('/list/:idDestinatario', async (req, res) => {
    //ritorna tutte le partite associate al torneo
    let notifiche = await notifica.find({idDestinatario: req.params.idDestinatario}).exec();
    var categorie = [];

    if(notifiche){
        notifica.forEach(function(notifica) {
            categorie.push(notifica.categoria);
        });
        res.json({ 
            success: true,
            categorie: categorie
        });
    }
    else{
        res.json({ 
            success: false, 
            message: "Nessuna notifica presente!"
        });
    }
});