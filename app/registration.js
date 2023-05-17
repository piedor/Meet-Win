const express = require('express');
const router = express.Router();
const utente = require('./models/utente'); 


// ---------------------------------------------------------
// route to authenticate and get a new token
// ---------------------------------------------------------
router.post('', async function(req, res) {
    // Vedi se email o nickname sono già utilizzati
    let userByEmail = await utente.findOne({
		email: req.body.email
	}).exec();

    // Email esiste già
	if (userByEmail) {
		res.json({ success: false, message: 'Email già utilizzata!' });
		return;
	}

    let userByNickname = await utente.findOne({
		nickname: req.body.nickname
	}).exec();

    // Nickname esiste già
	if (userByNickname) {
		res.json({ success: false, message: 'Nickname già utilizzato!' });
		return;
	}

    const nuovoUtente = new utente({
        nickname: req.body.nickname,
        email: req.body.email,
        password: req.body.password
    });
    
    nuovoUtente.save()
    .then(() => {
        console.log('Nuovo utente salvato con successo');
    })
    .catch((errore) => {
        console.error('Errore durante il salvataggio dell\'utente:', errore);
        res.json({ success: false, message: 'Errore durante il salvataggio dell\'utente' });
    });


    res.json({
		success: true,
		message: 'Utente registrato correttamente!',
		email: req.body.email,
		nickname: req.body.nickname,
		self: "api/v1/" + req.body.nickname
	});
});



module.exports = router;