const nodemailer = require ('nodemailer');
const {google} = require ('googleapis');
const express = require('express');
const router = express.Router();

const CLIENT_ID='253714505280-d9rc86qu6capleh40qjks77q12iv67o0.apps.googleusercontent.com'
const CLIENT_SECRET='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'
const REDIRECT_URI= 'https://developers.google.com/oauthplayground'
const REFRESH_TOKEN= '1//04hRQ8fsY_tmICgYIARAAGAQSNwF-L9IrjK6JrbfBYhpDV5giVu-0LyrMXavuzHHtFeBOMF3PAo4rg_Iw8cQyyMlFROfM7qkpjP4'

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID,CLIENT_SECRET, REDIRECT_URI)
oAuth2Client.setCredentials({refresh_token: REFRESH_TOKEN})

router.post('', async function sendMail(req){
    console.log(req.body);
    console.log("qui");
    var reciever=req.body.reciever;
    console.log(reciever);
    var tema=req.body.subject;
    var txt=req.body.text;
    console.log(txt);
    console.log("sono qui");
    try{
        const accessToken= await oAuth2Client.getAccessToken()
        const transport= nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 'meatandwinetrentino@gmail.com',
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken:accessToken,
            }

        })
        console.log("ciao banana");
        var subject;
        var testo;
        switch(tema) {
  
            case "codicec":
              console.log("invio codice di conferma");
              subject="codice di conferma registrazione";
              testo="Il codice per confermare la tua mail è il seguente: "+txt;
            break;
            
            case "registrazionec":
                console.log("invio codice di conferma");
                subject="codice di conferma registrazione";
                testo="Congratulazioni "+ txt+" hai completato la registrazione. Benvenuto nella community di Meat&Wine, siamo sicuri riuscirai a divertirti con noi!!";
            break;

            case "ban":
                subject="Il tuo account è stato sospeso";
                testo="Siamo spiacenti, a seguito di una revisione delle segnalazioni ricevute dai nostri amministratori sui tuoi comportamenti, abbiamo deciso di bloccare il tuo account sulla nostra piattaforma. La limitazione durerà: "+txt;
            break; //si ferma qui
          
            default:
              //istruzioni
          }

        const mailOptions={
            from:'meatandwinetrentino@gmail.com',
            to: reciever,
            subject: subject,
            text: testo,
        }

        const result=await transport.sendMail(mailOptions)
        return result;
    }catch(error){
        return error;
    }
});

module.exports = router;