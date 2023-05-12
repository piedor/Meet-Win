const app = require('./app/app.js');
const mongoose = require('mongoose');
// Carica le variabili d'ambiente dal file .env
const dotenv = require('dotenv');
dotenv.config();

const port = process.env.PORT || 8080;

app.locals.db = mongoose.connect(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true})
.then ( () => {
    
    console.log("Connected to Database");
    
    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });
    
});