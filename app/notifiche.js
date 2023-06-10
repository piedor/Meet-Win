const express = require('express');
const router = express.Router();
// Modello di mongoose (stabilisce quali dati l'oggetto contiene)
const notifica = require('./models/notifica');
const utente = require('./models/utente');

// Se app.js capta un POST verso /api/v1/notifiche allora procedi alla creazione della notifica
router.post('', async function(req, res) {   
    // Vedi se l'utente ha già creato la stessa notifica (stessa categoria)
    let notificaByUser = await notifica.findOne({
		nickMittente: req.body.nickMittente,
        nickDestinatario: req.body.nickDestinatario,
        categoria: req.body.categoria
	}).exec();

    // Se esiste già la stessa notifica esci
    if(notificaByUser){
        if(notificaByUser.categoria == "amicizia"){
            res.json({ success: false, message: "Hai già richiesto l'amicizia attendi la risposta!" });
        }
        return;
    }

    // Crea nuova notifica
    const nuovaNotifica = new notifica({
        nickMittente: req.body.nickMittente,
        nickDestinatario: req.body.nickDestinatario,
        categoria: req.body.categoria,
        visualizzato: false,
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

// Se app.js capta una GET verso /api/v1/notifiche/list/me allora ritorna tutte le notifiche associate all'utente 
router.get('/list/me', async (req, res) => {
    if(!res.app.get('user')){
        return;
    }

    //ritorna tutte le notifiche associate all'utente
    let notifiche = await notifica.find({nickDestinatario: res.app.get('user').id}).exec();
    var listaNotifiche = [];

    if(notifiche){
        notifiche.forEach(function(notifica) {
            listaNotifiche.push({
                "categoria": notifica.categoria,
                "nickMittente": notifica.nickMittente,
                "id": notifica._id
            })
        });
        res.json({ 
            success: true,
            listaNotifiche: listaNotifiche
        });
    }
    else{
        res.json({ 
            success: false, 
            message: "Nessuna notifica presente!"
        });
    }
});

// Se app.js capta una DELETE verso /api/v1/notifiche/:idNotifica allora elimina la notifica
router.delete('/:idNotifica', async (req, res) => {
    // Trova la notifica via id
    let notificaById = await notifica.findOne({
		_id: req.params.idNotifica
	}).exec();

    if (!notificaById) {
        res.status(404).send();
        console.log('Nessuna notifica trovata!');
        return;
    }

    if(notificaById.categoria == "amicizia" && req.body.accetta){
        // Aggiungi a lista amici
        // Utente mittente
        let userMittente = await utente.findOne({
            nickname: notificaById.nickMittente
        }).exec();

        // Utente destinatario
        let userDestinatario = await utente.findOne({
            nickname: notificaById.nickDestinatario
        }).exec();
    
        if (userMittente && userDestinatario) {
            // Aggiungi i 2 utenti alla lista amici rispettiva
            userMittente.amici.push(userDestinatario.nickname);
            userDestinatario.amici.push(userMittente.nickname);
            userMittente.save();
            userDestinatario.save();
        }
        else{
            res.json({ success: false });
            return;
        }
    }

    await notificaById.deleteOne();
    
    res.json({
        success: true,
        message: 'Notifica eliminata!',
    });
});

module.exports = router;