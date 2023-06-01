const nodemailer = require ('nodemailer');
const {google} = require ('googleapis');
const express = require('express');
const router = express.Router();
// Carica le variabili d'ambiente dal file .env
const dotenv = require('dotenv');
dotenv.config();

const REDIRECT_URI = 'https://developers.google.com/oauthplayground'

const oAuth2Client = new google.auth.OAuth2(process.env.CLIENT_ID,process.env.CLIENT_SECRET, REDIRECT_URI)
oAuth2Client.setCredentials({refresh_token: process.env.REFRESH_TOKEN})

// Se app.js capta un POST verso /api/v1/sendMails allora procedi all'invio dell'email
router.post('', async function (req){
    // Campi richiesti: email destinatario, tipologia di email, testo
    var reciever = req.body.reciever;
    var tema = req.body.subject;
    var txt = req.body.text;
    try{
        const accessToken = await oAuth2Client.getAccessToken();
        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 'meatandwinetrentino@gmail.com',
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: process.env.REFRESH_TOKEN,
                accessToken:accessToken,
            }
        });
        var subject;
            var testo;
            switch(tema) {
  
            case "codicec":
              console.log("invio codice di conferma");
              subject = "codice di conferma registrazione";
              testo = "Il codice per confermare la tua mail è il seguente: "+txt;
            break;
            
            case "registrazionec":
                console.log("invio termine registrazione");
                subject = "registrazione terminata";
                testo = "Congratulazioni "+ txt+" hai completato la registrazione. Benvenuto nella community di Meet&Win, siamo sicuri riuscirai a divertirti con noi!!";
            break;

            case "ban":
                subject = "Il tuo account è stato sospeso";
                testo = "Siamo spiacenti, a seguito di una revisione delle segnalazioni ricevute dai nostri amministratori sui tuoi comportamenti, abbiamo deciso di bloccare il tuo account sulla nostra piattaforma. La limitazione durerà: "+txt;
            break;
          
            default:
              //
          }

        const mailOptions={
            from:'"Meet&Win" meatandwinetrentino@gmail.com',
            to: reciever,
            subject: subject,
            text: testo,
        }

        const result = await transport.sendMail(mailOptions)
        return result;
    }catch(error){
        return error;
    }
});

module.exports = router;