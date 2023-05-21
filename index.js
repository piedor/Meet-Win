// Richiama gestore applicazione
const app = require('./app/app.js');
// Libreria per connettersi a mongodb
const mongoose = require('mongoose');
// Carica le variabili d'ambiente dal file .env
const dotenv = require('dotenv');
dotenv.config();

// Il server sarà in ascolto sulla porta definita in .env oppure 8080
const port = process.env.PORT || 8080;

// Connetti a db con le credenziali in .env
app.locals.db = mongoose.connect(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true})
.then ( () => {
    
    console.log("Connected to Database");
    
    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });
    
});