const express = require('express');
const router = express.Router();
const utente = require('./models/utente'); // get our mongoose model



/**
 * Resource representation based on the following the pattern: 
 * https://cloud.google.com/blog/products/application-development/api-design-why-you-should-use-links-not-keys-to-represent-relationships-in-apis
 */
router.get('', async (req, res) => {
    // https://mongoosejs.com/docs/api.html#model_Model.find
    let utenti = await utente.find({});
    utenti = utenti.map( (utente) => {
        return {
            self: '/api/v1/utenti/' + utente.nickname,
            title: utente.nickname
        };
    });
    res.status(200).json(utenti);
});

router.get('/:id', async (req, res) => {
    // https://mongoosejs.com/docs/api.html#model_Model.findById
    let utente = await utente.findById(req.params.id);
    res.status(200).json({
        self: '/api/v1/utenti/' + utente.id,    
        title: utente.title
    });
});

router.delete('/:id', async (req, res) => {
    let utente = await utente.findById(req.params.id).exec();
    if (!utente) {
        res.status(404).send()
        console.log('utente not found')
        return;
    }
    await utente.deleteOne()
    console.log('utente removed')
    res.status(204).send()
});

router.post('', async (req, res) => {

	let utente = new utente({
        nickname: req.body.nickname
    });
    
	utente = await utente.save();
    
    let listaUtenti = utenti.nickname; 

    console.log('Book saved successfully');

    /**
     * Link to the newly created resource is returned in the Location header
     * https://www.restapitutorial.com/lessons/httpmethods.html
     */
    res.location("/api/v1/books/" + listaUtenti).status(201).send();
});


module.exports = router;
