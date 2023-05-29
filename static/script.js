const MAPPA_PREFERENZE = {
  100: "sport di squadra",
  101: "calcio",
  102: "calcetto",
  103: "basket",
  104: "freccette",
  105: "hockey",
  106: "tennis",
  107: "ping pong",
  108: "paddel",
  109: "pallavolo",
  110: "beach volley",
  201: "Fifa",
  202: "League of Legends",
  203: "Valorant",
  204: "CS:GO",
  205: "Rainbow Six Siege",
  206: "Fortnite",
  207: "Super Smash Bros",
  208: "Rocket League",
  301: "Scacchi",
  302: "Catan",
  303: "Ticket To Ride",
  304: "Dominion",
  305: "giochi di carte",
  306: "Yu-Gi-Oh!",
  307: "Magic"
};

const MAPPA_PIATTAFORME = {
  100: "Cross Platform",
  101: "Playstation 4",
  102: "Playstation 5",
  103: "Xbox ONE",
  104: "Switch",
  105: "PC"
};

const MAPPA_AVATAR = {
  101: "avatar1",
  102: "avatar2",
  103: "avatar3",
  104: "avatar4",
  105: "avatar5",
  106: "avatar6",
  107: "avatar7",
  108: "avatar8"
};

const MAPPA_IMG_TORNEI = {
  101: "img1",
  102: "img2",
  103: "img3",
  104: "img4",
  105: "img5",
  106: "img6",
  107: "img7",
  108: "img8"
};

// Memorizza l'utente loggato
var loggedUser = {};
// Memorizza l'utente registrato
var registeredUser = {};

function login()
{
  // Questa funzione è chiamata quando si preme il pulsante login
  // Prendi i valori del form html
  var nickname = document.getElementById("loginNickname").value;
  var password = document.getElementById("loginPassword").value;

  // Richiama l'API authentication
  fetch('../api/v1/authentications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify( { nickname: nickname, password: password } ),
  })
  .then((resp) => resp.json()) // Trasforma i dati in json
  .then(function(data) { // Ricevi la risposta
      loggedUser.token = data.token;
      loggedUser.email = data.email;
      loggedUser.id = data.id;
      loggedUser.self = data.self;
      // Popup con messaggio API
      alert(data.message);
      if (data.success){
        // Autenticato correttamente passa a home autenticato
        location.href = "home_aut.html";
      }
      return;
  })
  .catch( function (error) {
      alert(error.message);
      return;
    } );

};

function containsNumbers(str) {
  // Ritorna se str contiene numeri
  return /[0-9]/.test(str);
};

function containsUppercase(str) {
  // Ritorna se str contiene lettere maiuscole
  return /[A-Z]/.test(str);
};

function containsLowercase(str) {
  // Ritorna se str contiene lettere minuscole
  return /[a-z]/.test(str);
};

function isValidEmail(mail) 
{
  // Ritorna se mail è una mail valida
  var mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return(mail.match(mailFormat));
}

document.getElementById("regEmail").onkeyup = function() {
  if (isValidEmail(document.getElementById("regEmail").value)) {
       document.getElementById("cmail").setAttribute("disabled", false);
        // Rendere bordo input mail verde
        document.getElementById("regEmail").setAttribute("style","background: rgb(76, 249, 73);");
    }
    else {
       document.getElementById("cmail").setAttribute("disabled", true);
        // Rendere bordo input mail rosso
        document.getElementById("regEmail").setAttribute("style","background: rgb(253, 116, 116);");
    }        
  }
// Funzione per generare e inviare il codice per confermare la mail
{
  var vcode;
  function generaCodiceConfermaMail()
  {
    vcode = Math.floor(Math.random() * (99999999 - 10000000 + 1)) + 10000000;
    var mail=document.getElementById("regEmail").value;
    sendMails(mail,"codicec", vcode);
    alert("Ti abbiamo inviato un codice di conferma nell'indirizzo mail indicato, inserisci quel codice qui sotto e premi ok per confermare la mail. ATTENZIONE: una volta confermata la mail non si potrà più modificare.");
    document.getElementById("regEmail").disabled = true;
    document.getElementById("confcode").removeAttribute("hidden");
    document.getElementById("confebtn").removeAttribute("hidden");
    document.getElementById("confebtn").removeAttribute("disabled");
  };

  function confermaCodiceConfermaMail()
  {
    var code = document.getElementById("confcode").value;
    if(code == vcode){
      alert("mail confermata"); 
      document.getElementById("confermaR").disabled = false;
      document.getElementById("cmail").disabled = true;
      document.getElementById("confcode").setAttribute("disabled","true");
      document.getElementById("confebtn").setAttribute("disabled","true");
    }
  };
}

function clearAll(){
  document.getElementById("regEmail").disabled = false;
  document.getElementById("confermaR").disabled = true;
  document.getElementById("cmail").disabled = true;
  document.getElementById("cmail").removeAttribute("style");
  document.getElementById("confcode").disabled=false;
}

function register()
{
  // Questa funzione è chiamata durante la fase di registrazione
  var nickname = document.getElementById("regNickname").value;
  var email = document.getElementById("regEmail").value;
  var password = document.getElementById("regPassword").value;
  var cpassword = document.getElementById("regC_Password").value;
  var avatar = document.querySelector('input[type = radio]:checked').value;
  var zona = document.getElementById("zona").value;
  var bio = document.getElementById("bio").value;
  var privato = document.getElementById("switch").value; 
  var preferenze = [];
  var markedCheckbox = document.getElementsByName('pref');  
  for (var checkbox of markedCheckbox) {  
    if (checkbox.checked) 
    preferenze.push(checkbox.value);
  }  
  var piattaforme = [];
  var markedCheckbox = document.getElementsByName('piatt');  
  for (var checkbox of markedCheckbox) {  
    if (checkbox.checked) 
    piattaforme.push(checkbox.value);
  }  
  
  document.getElementById("errors").innerHTML = "";
  var errors = "";
  if(nickname == "") errors += "nickname mancante; ";
  if(email == "") errors += "email mancante; ";
  if(password == "") errors += "la password è mancante; ";
      else{
      if(password != cpassword) errors += "password e conferma password devono essere uguali; ";
      if(password.length < 8) errors += "la password deve essere di almeno 8 caratteri; ";
      if(!containsUppercase(password)) errors += "la password deve contenere almeno un carattere maiuscolo; ";
      if(!containsLowercase(password)) errors += "la password deve contenere almeno un carattere minuscolo; ";
      if(!containsNumbers(password)) errors += "la password deve contenere almeno un numero; ";
  }
  if(preferenze.length == 0) errors += "devi selezionare almeno una preferenza; ";
  

  if(errors != ""){
      errors = "errori presenti: " + errors;
      errors = String(errors);
      document.getElementById("errors").innerHTML = errors;
      return;
  }

  // Richiama l'API registration
  fetch('../api/v1/registrations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify( { 
        nickname: nickname, 
        email: email, 
        password: password,
        bio: bio,
        preferenze: preferenze,
        piattaforme: piattaforme,
        avatar: avatar
      } ),
  })
  .then((resp) => resp.json()) // Trasforma i dati in JSON
  .then(function(data) { // Risposta
      registeredUser.email = data.email;
      registeredUser.id = data.id;
      registeredUser.self = data.self;
      // Popup messaggio API
      alert(data.message);
      if(data.success){
        // Registrazione ok
        // Invia mail 
        sendMails(email,"registrazionec", nickname);
      }
      return;
  })
  .catch( function (error) {
          alert(error.message);
          console.error(error);
          return;
      } );
        
};

function sendMails(toMail, oggetto, txt)
{
  // Questa funzione richiama l'API sendMails per inviare una mail
  fetch('../api/v1/sendMails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ "reciever": toMail, "subject": oggetto, "text": txt}),
    })
}

function loadInfoUser(){
  // Viene usata in home_aut per mostrare le info dell'utente
  fetch('../api/v1/utenti/me')
  .then((resp) => resp.json()) // Trasforma i dati in JSON
  .then(function(data) { // Risposta
      if(data.success == false){
        // Non è autenticato ritorna su home non autenticato
        alert("Errore non sei autenticato!");
        location.href = "/";
      }
      else{
        // Autenticato mostra info
        var nickname = data.nickname;
        document.getElementById("nickname").textContent = nickname;
        document.body.removeAttribute("hidden");
      }
  })
  .catch( error => console.error(error) );
}

function logout(){
  // Funzione per eseguire il logout dell'utente (in pratica rimuove il token dai cookie)
  fetch('../api/v1/utenti/logout')
  .then((resp) => resp.json()) // Trasforma i dati in JSON
  .then(function(data) { // Risposta
    // Ritorna su home non autenticato
    alert(data.message);
    location.href = "/";
  })
  .catch( error => console.error(error) );
}

var password;

//funzione per controllare la correttezza della password durante l'azione di modifica password
function controllaPassword(pass){
  var userPass="ciao";
  if(password==null) //richiedi password al database
  //userPass=getvalue from database()
  if (pass.value==userPass){
    document.getElementById("vecPass").setAttribute("style","background: rgb(76, 249, 73);");
    document.getElementById("newPass").removeAttribute("disabled");
    document.getElementById("c_newPass").removeAttribute("disabled");
  }else{
    document.getElementById("vecPass").setAttribute("style","background: rgb(253, 116, 116);");}
}

//funzione per salvare le modifiche fatte ad un account
function saveChanges(){
  //?? forse conviene mettere un boolean su registrazione per dire se viene attivato da modificaProfilo allora salva i cambiamenti sennò crea un nuovo profilo??
}

// Funzione usata da cercaUtenti
function listUtenti(){
  // Elenca tutti gli utenti iscritti
  fetch('../api/v1/utenti/list')
  .then((resp) => resp.json()) // Trasforma i dati in JSON
  .then(function(data) { // Risposta
    if(!data.success){
      // Nessun utente iscritto alla piattaforma!
      alert(data.message);
      return;
    }
    else{
      data.users.map(function(nickname) { 
        let box = document.getElementById("boxUtenti");
        let button = document.createElement('button');
        button.type = 'button';
        button.setAttribute("onclick", "location.href='visualizzaSchedaUtente.html?nickname=" + nickname + "'");
        button.textContent = nickname;
        box.appendChild(button);
      });
    }
  })
  .catch( error => console.error(error) );
}

// Funzione usata da visualizzaSchedaUtente
function getProfile(){
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  var nickname = urlParams.get("nickname");
  if(nickname == null){
    alert("Nickname non specificato!");
    location.href = "cercaUtenti.html";
    return;
  }
  fetch('../api/v1/utenti/'+nickname)
  .then((resp) => resp.json()) // Trasforma i dati in JSON
  .then(function(data) { // Risposta
    if(!data.success){
      // Utente non trovato!
      alert(data.message);
      location.href = "cercaUtenti.html";
      return;
    }
    else{
      // Carica nickname e bio
      document.getElementById("nickname").innerHTML = data.nickname;
      document.getElementById("bio").innerHTML = data.bio;  
      // Inserisci ogni preferenza in span
      data.preferenze.map(function(preferenze) { 
        let span = document.getElementById('preferenze');
        span.innerHTML += " " + MAPPA_PREFERENZE[preferenze]; 
      });
      // Inserisci ogni piattaforma in span
      data.piattaforme.map(function(piattaforme) {
        let span = document.getElementById('piatt');
        span.innerHTML += " " + MAPPA_PIATTAFORME[piattaforme]; 
      });
      // Carica foto avatar
      document.getElementById("avatar").setAttribute("alt", MAPPA_AVATAR[data.avatar]);
      document.getElementById("avatar").setAttribute("src", "images/" + MAPPA_AVATAR[data.avatar] + ".png");
    }
  })
  .catch( error => console.error(error) );
}
