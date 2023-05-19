const express = require('express');
const router = express.Router();
const utente = require('./models/utente'); // get our mongoose model
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens


// ---------------------------------------------------------
// route to authenticate and get a new token
// ---------------------------------------------------------
router.get('', async function(req, res) {


res.json({
    nickname: req.body.nickname,
    /*avatar: req.body.avatar,
    bio: req.body.bio,
    preferenze: req.body.preferenze,
    piattaforme: req.body.preferenze,
    zona: req.body.zona,*/
    //trofeiVinti: req.body.trofei_vinti,
    //communityIscr: req.body.communities_iscritto,
    //feedback: req.body.feedback,
});
/*chiedi a pietro se questo comando fa chiudere tutto o come funzia
->devo restituire un json con i dati dell'utente (però se ha il token ) 
devo dirgli qualcosa per attivare i pulsanti tipo blocca e richiedi amicizia*/
if(req.body.privato!=1){
    app.use('', tokenChecker);
}


});



module.exports = router;
