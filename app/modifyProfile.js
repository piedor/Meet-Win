const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
//put 
router.get('', async function(req, res) {
    
    app.use('', tokenChecker);
    // request with no valid token stop here
    // requests that goes through the tokenChecker have the field `req.loggedUser` set to the decoded token

    res.json({
        nickname: req.body.nickname,
        mail: req.body.mail,
        /*password: req.body.password,
        avatar: req.body.id_img,
        bio: req.body.bio,
        preferenze: req.body.preferenze,
        piattaforme: token,
        zona: req.body.zona,*/
        //cellulare: req.body.cellulare,
        //trofeiVinti: req.body.trofei_vinti,
        //communityIscr: req.body.communities_iscritto,
        //feedback: req.body.feedback,
    });
    /*chiedi a pietro se questo comando fa chiudere tutto o come funzia
    ->devo restituire un json con i dati dell'utente (però se ha il token ) 
    devo dirgli qualcosa per attivare i pulsanti tipo blocca e richiedi amicizia*/
    
    
});
// ---------------------------------------------------------
// route to authenticate and get a new token
// ---------------------------------------------------------
router.post('', async function(req, res) {


app.use('', tokenChecker);
// request with no valid token stop here
// requests that goes through the tokenChecker have the field `req.loggedUser` set to the decoded token

// Vedi se email o nickname sono già utilizzati
let userByEmail = await utente.findOne({
    email: req.body.email
}).exec();

let userByNickname = await utente.findOne({
    nickname: req.body.nickname
}).exec();


const modificaUtente = new utente({
    nickname: req.body.nickname,
    email: req.body.email,
    password: req.body.password
});

modificaUtente.save()
.then(() => {
    console.log('Utente salvato con successo');
})
.catch((errore) => {
    console.error('Errore durante il salvataggio dell\'utente:', errore);
    res.json({ success: false, message: 'Errore durante il salvataggio dell\'utente' });
});


res.json({
    success: true,
    message: 'Modifiche utente salvato correttamente!',
    email: req.body.email,
    nickname: req.body.nickname,
    self: "api/v1/" + req.body.nickname
});
});



module.exports = router;
