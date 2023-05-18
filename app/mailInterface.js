const nodemailer = require ('nodemailer')
const {google} = require ('googleapis')

const CLIENT_ID='253714505280-d9rc86qu6capleh40qjks77q12iv67o0.apps.googleusercontent.com'
const CLIENT_SECRET='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'
const REDIRECT_URI= 'https://developers.google.com/oauthplayground'
const REFRESH_TOKEN= '1//04hRQ8fsY_tmICgYIARAAGAQSNwF-L9IrjK6JrbfBYhpDV5giVu-0LyrMXavuzHHtFeBOMF3PAo4rg_Iw8cQyyMlFROfM7qkpjP4'

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID,CLIENT_SECRET, REDIRECT_URI)
oAuth2Client.setCredentials({refresh_token: REFRESH_TOKEN})

async function sendMail(reciever, subject, text){
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
        const mailOptions={
            from:'meatandwinetrentino@gmail.com',
            to: reciever,
            subject: subject,
            text: text,
        }

        const result=await transport.sendMail(mailOptions)
        return result;
    }catch(error){
        return error;
    }
}


sendMail('tommasoguidolin01@gmail.com','oggetto','testo della mail')
    .then(result=>console.log('email sent...', result))
    .catch(error=>console.log(error.message));

//module.exports = ;    