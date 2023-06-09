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
  104: "PC",
  105: "Switch",
  0: "Torneo fisico"
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
  101: "logoT1",
  102: "logoT2",
  103: "logoT3",
  104: "logoT4",
  105: "logoT5",
  106: "logoT6",
  107: "logoT7",
  108: "logoT8"
};

const MAPPA_FORMATOT = {
  "gironi": "Gironi+eliminazione diretta",
  "campionato": "Campionato",
  "eliminazione": "Eliminazione diretta",
};
const MAPPA_FORMATOP = {
  "bo1": "Best of 1",
  "bo2": "Best of 2",
  "bo3": "Best of 3",
};

// Memorizza l'utente loggato
var loggedUser = {};
// Memorizza l'utente loggato
var registeredUser = {};

//memorizza il nickname dell'utente
var globalNickname;

// Memorizza la lista utenti (usata da cercaUtenti e filtraggio)
var listaUtenti;

// Memorizza la lista preferenze e piattaforme degli utenti (usata da cercaUtenti e filtraggio) {nickname, preferenze[], piattaforme[]}
var tagUtenti = [];

function login(){
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

if(document.getElementById("regEmail")!=null){
  document.getElementById("regEmail").onkeyup = function() {
  if (isValidEmail(document.getElementById("regEmail").value)) {
       document.getElementById("cmail").removeAttribute("disabled");
        // Rendere bordo input mail verde
        document.getElementById("regEmail").setAttribute("style","background: rgb(76, 249, 73);");
    }
    else {
       document.getElementById("cmail").setAttribute("disabled", true);
        // Rendere bordo input mail rosso
        document.getElementById("regEmail").setAttribute("style","background: rgb(253, 116, 116);");
    }        
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
  }
}

function clearAll(){

  document.getElementById("regNickname").value="";
  document.getElementById("regEmail").value="";
  document.getElementById("regPassword").value="";
  document.getElementById("regC_Password").value="";
  document.getElementById("zona").value="";
  document.getElementById("bio").value="";
  document.getElementById("privato").checked="";
  document.getElementsByName('pref').checked="";  
  document.getElementsByName('piatt').values="";
  document.getElementById("confcode").value="";

  document.getElementById("regEmail").disabled = false;
  document.getElementById("confermaR").disabled = true;
  document.getElementById("cmail").disabled = false;
  document.getElementById("confcode").removeAttribute("style");
  document.getElementById("confcode").disabled=false;
}

function register()
{
  document.getElementById("confermaR").setAttribute("disabled", true);
  // Questa funzione è chiamata durante la fase di registrazione
  var nickname = document.getElementById("regNickname").value;
  var email = document.getElementById("regEmail").value;
  var password = document.getElementById("regPassword").value;
  var cpassword = document.getElementById("regC_Password").value;
  var avatar = document.querySelector('input[type = radio]:checked').value;
  var zona = document.getElementById("zona").value;
  var bio = document.getElementById("bio").value;
  var privato = document.getElementById("privato").checked; 
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
      alert(errors);
      document.getElementById("confermaR").removeAttribute("disabled");
      return;
  }

  // Richiama l'API utenti/post
  fetch('../api/v1/utenti', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify( { 
        nickname: nickname, 
        email: email, 
        password: password,
        bio: bio,
        preferenze: preferenze,
        piattaforme: piattaforme,
        avatar: avatar,
        zona: zona,
        privato: privato
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
        location.href = "/";
      }
      return;
  })  .catch( function (error) {
          alert(error.message);
          console.error(error);
          document.getElementById("confermaR").setAttribute("disabled", false);
          return;
      } );
        
};

function creationTorneo(){
  // Questa funzione è chiamata durante la fase di creazione torneo
  var organizzatore = globalNickname;
  if(document.getElementById("nomeTorneo").value!="")
  var nomeTorneo = document.getElementById("nomeTorneo").value;
  var logoT = document.querySelector('input[type = radio]:checked').value;
  if(document.getElementById("argomento").value!="")
    var argomento = document.getElementById("argomento").value;
  if(document.getElementById("zona").value!="")
    var zona = document.getElementById("zona").value;  
  if(document.getElementById("bio").value!="")  
    var bio = document.getElementById("bio").value;
  if(document.getElementById("regolamento").value!="")
    var regolamento = document.getElementById("regolamento").value;
  var tags = [];
  var markedCheckbox = document.getElementsByName('tags');  
  for (var checkbox of markedCheckbox) {  
    if (checkbox.checked) 
    tags.push(checkbox.value);
  }
  var piattaforma = document.querySelector('input[id = "piattaforma"]:checked').value;
  if(document.getElementById("nsquadre").value!="")
    var numeroSquadre = document.getElementById('nsquadre').value;
  if(document.getElementById("ngiocatori").value!="")
    var numeroGiocatori = document.getElementById('ngiocatori').value;
  if(document.getElementById("dataInizio").value!="")
    var dataInizio = document.getElementById('dataInizio').value;
  var formatoT = document.getElementById('formatoT').value;
  if(document.getElementById("ngironi").value!="")
    var numeroGironi = document.getElementById('ngironi').value;
  var formatoP = document.getElementById('formatoP').value;
  var fasi=1;
  if(formatoT=="gironi"){
    fasi=2;
  }
  //check se sta creando un nuovo torneo o modificando uno già esistente
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  var torneo = urlParams.get("idTorneo");
  if(torneo == null){
  //sta creando un nuovo torneo, nessun dato di default 
  // Richiama l'API per la creazione torneo
  fetch('../api/v1/tornei', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify( { 
        organizzatore: organizzatore, 
        nomeTorneo: nomeTorneo,
        bio: bio,
        regolamento: regolamento,
        tags: tags,
        piattaforma: piattaforma,
        logoT: logoT,
        argomento: argomento,
        zona: zona,
        numeroSquadre: numeroSquadre,
        numeroGiocatori: numeroGiocatori,
        dataInizio: dataInizio,
        formatoT: formatoT,
        numeroGironi: numeroGironi,
        formatoP: formatoP,
        fasi: fasi,
      } ),
  })
  .then((resp) => resp.json()) // Trasforma i dati in JSON
  .then(function(data) { // Risposta
      // Popup messaggio API
      alert(data.message);
      if(data.success){
        // creazione ok
      document.getElementById("salvaModifiche").setAttribute("disabled", true);
      document.getElementById("pubblica").removeAttribute("disabled");  
      location.href = "/creaTorneo.html?idTorneo="+data._id;
      }
      return;
  }).catch( function (error) {
          alert(error.message);
          console.error(error);
          return;
      } );
  alert("creazione torneo");
  return;
  }
  else{
    // aggiorna le info del torneo
  const update = {
    _id:torneo,
    nomeTorneo: nomeTorneo,
    bio: bio,
    regolamento: regolamento,
    tags: tags,
    piattaforma: piattaforma,
    logoT: logoT,
    argomento: argomento,
    zona: zona,
    numeroSquadre: numeroSquadre,
    numeroGiocatori: numeroGiocatori,
    dataInizio: dataInizio,
    formatoT: formatoT,
    numeroGironi: numeroGironi,
    formatoP: formatoP,
    fasi: fasi,
  };
  fetch('../api/v1/tornei', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(update)
  })
  .then((resp) => resp.json()) // Trasforma i dati in json
  .then(function(data) { // Risposta
    // Popup messaggio API
    alert(data.message);
    if(data.success){
      // salvataggio ok
    document.getElementById("salvaModifiche").setAttribute("disabled", true);
    document.getElementById("pubblica").removeAttribute("disabled");  
    }
    return;
  }).catch( function (error) {
    alert(error.message);
    console.error(error);
    return;
  });
  }
};

//funzione usata da creaTorneo.html
function pubblicaTorneo(){
  //funzione richiamata dalla schermata creaTorneo per pubblicare il torneo
  //controlla la completezza e correttezza delle info
  var nomeTorneo = document.getElementById("nomeTorneo").value;
  var argomento = document.getElementById("argomento").value;
  var bio = document.getElementById("bio").value;
  var regolamento = document.getElementById("regolamento").value;
  var tags = [];
  var markedCheckbox = document.getElementsByName('tags');  
  for (var checkbox of markedCheckbox) {  
    if (checkbox.checked) 
    tags.push(checkbox.value);
  }
  var numeroSquadre = document.getElementById('nsquadre').value;
  var numeroGiocatori = document.getElementById('ngiocatori').value;
  var dataInizio = document.getElementById('dataInizio').value;
  var formatoT = document.getElementById('formatoT').value;
  var numeroGironi = document.getElementById('ngironi').value;

  var errors = "";
    
  if(nomeTorneo == "") errors += "nome torneo mancante; ";
  if(argomento == "") errors += "attivit&agrave; mancante; ";
  if(numeroSquadre == "") errors += "numero di squadre è mancante; ";
  if(numeroGiocatori == "") errors += "numero di giocatori mancante; ";     
  
  if(dataInizio == "") errors += "data inizio mancante; ";
  if(bio == "") errors += "bio mancante; ";
  if(regolamento == "") errors += "regolamento mancante; ";
  if(numeroGironi == "" && formatoT=="gironi"){ errors += "numero gironi mancante; ";}
    else if((numeroSquadre%numeroGiocatori)!=0) errors+= "il numero squadre deve essere divisibile per il numero gironi, esempio 9 squadre, 3 gironi; ";
  if(formatoT=="eliminazione" && numeroSquadre!="4" && numeroSquadre!="8" && numeroSquadre!="16") errors+="hai selezionato eliminazione diretta, puoi inserire 4/8/16 squadre; "
  if(errors != ""){
      errors = "errori presenti: " + errors;
      errors = String(errors);
      alert(errors);
      return;
  }  

  //controllo per vedere se l'utente è l'organizzatore
  if(document.getElementById("nicknameUser2").textContent==globalNickname){
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    var torneo = urlParams.get("idTorneo");  
    fetch('../api/v1/tornei/'+torneo+'/pubblica', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
      })
    })
    .then((resp) => resp.json()) // Trasforma i dati in json
    .then(function(data) {
      if(data.success){
        alert("Torneo pubblicato correttamente!");
        return;
      }else{        
        alert("Errore, torneo non pubblicato!");
        return;
      }
    }).catch( error => console.error(error) );
  }
}

function changes() {
  // Questa funzione viene chiamata dalla schermata torneo a seguito della modifica di un campo
  document.getElementById("pubblica").setAttribute("disabled", true);
  document.getElementById("salvaModifiche").removeAttribute("disabled");
}

function sendMails(toMail, oggetto, txt){
  // Questa funzione richiama l'API mails per inviare una mail
  fetch('../api/v1/mails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ "reciever": toMail, "subject": oggetto, "text": txt}),
    });
}

function loadInfoUser(){
  // Viene usata dalle schermate per mostrare definire se l'utente è loggato o meno
  return fetch('../api/v1/utenti/me')
  .then((resp) => resp.json()) // Trasforma i dati in JSON
  .then(function(data) { // Risposta
    if(data.success == false){
      if(document.getElementById("loginform")!=null){
        //la schermata è visualizzabile anche da utenti non loggati
      }else{
      // Non è autenticato ritorna su home non autenticato
        alert("Errore, non sei autenticato!");
        location.href = "/";
      }
    }else{
      // Autenticato mostra info
      globalNickname = data.nickname;
      document.getElementById("nicknameUser").textContent = globalNickname;
      if(document.getElementById("nicknameUser2")){
        document.getElementById("nicknameUser2").innerHTML = ""+ globalNickname;    //used for some pages where its needed 2 times 
      }
      if(document.getElementById("loggedInfo")){      
      document.getElementById("loggedInfo").removeAttribute("hidden");
      document.getElementById("loginform").setAttribute("hidden", true);
    }
    }
    return(data);
  })
  .catch( error => console.error(error) );
}

function onlyUnique(value, index, array) {
  // Funzione usata per prendere dati univoci da un array (Lista amici)
  return array.indexOf(value) === index;
}

function loadHome(){
  // Esegui loadInfoUser
  loadInfoUser()
  .then(function(data){
    // Aggiungi lista amici al modal
    if(data.amici.length > 0){
      let boxAmici = document.getElementById("box4");
      // Cancella contenuto boxAmici
      boxAmici.innerHTML = "";
      data.amici.filter(onlyUnique).map(function(amico) {  
        let button = document.createElement('button');
        let br = document.createElement('br');
        button.type = 'button';
        button.setAttribute("onclick", "location.href='visualizzaSchedaUtente.html?nickname=" + amico + "'")
        button.setAttribute("style", "background-color:#30b5fc; width:300px; height: 30px; font-size:16px");
        button.textContent = amico;
        boxAmici.appendChild(br);
        boxAmici.appendChild(button);
      });
    }
  })
  .then(function(){
    // Prendi lista notifiche
    fetch('../api/v1/notifiche/list/me')
    .then((resp) => resp.json()) // Trasforma i dati in JSON
    .then(function(data) { // Risposta
        if(data.success){
          if(data.listaNotifiche.length > 0){
            let box = document.getElementById("box2");
            data.listaNotifiche.map(function(notifica) {  
              let button = document.createElement('button');
              let br = document.createElement('br');
              let buttonOk = document.createElement('button');
              buttonOk.type = 'button';
              buttonOk.setAttribute("id", notifica.id);
              buttonOk.setAttribute("class", "adder");
              buttonOk.setAttribute("onclick", "accettaAmicizia(id);");
              buttonOk.textContent= "+";
              let buttonX = document.createElement('button');
              buttonX.type = 'button';
              buttonX.setAttribute("id", notifica.id);
              buttonX.setAttribute("class", "remover");
              buttonX.setAttribute("onclick", "rifiutaAmicizia(id)");
              buttonX.textContent= "X";
              button.type = 'button';
              button.setAttribute("style", "background-color:#30b5fc; width:300px; height: 30px; font-size:16px");
              if(notifica.categoria == "amicizia"){
                button.textContent = "Richiesta d'amicizia da " + notifica.nickMittente;
              }
              let span=document.createElement('span');
              span.setAttribute("id", notifica.id);
              span.appendChild(button);
              span.appendChild(buttonOk);
              span.appendChild(buttonX);
              box.appendChild(br);
              box.appendChild(span);
            });
          }
          else{
            let box = document.getElementById("box2");
            let h2 = document.createElement("h2");
            h2.innerHTML = "Nessuna notifica presente!";
            box.appendChild(h2);
          }
        }
    })    
  }).then(function(){
    //mostra tutte le partite dell'utente
    fetch('../api/v1/squadre/nickname/'+globalNickname)
    .then((resp) => resp.json()) // Trasforma i dati in JSON
    .then(function(data1) { // Risposta     
      data1.squadre.map(function(idSquadra){
        fetch('../api/v1/partite/squadra/'+idSquadra)
        .then((resp) => resp.json()) // Trasforma i dati in JSON
        .then(function(data2) { // Risposta
          if(data2.success){
          data2.partite.map(function(idPartita){
            fetch('../api/v1/partite/'+idPartita)
            .then((resp) => resp.json()) // Trasforma i dati in JSON
            .then(function(data3) { // Risposta   
              const nomeTorneo=data3.nomeTorneo;
              const idTorneo=data3.idTorneo;
              const argomento=data3.argomento;
              const squadra1=data3.nomeSquadra1;
              const squadra2=data3.nomeSquadra2;
              const risultato1=data3.risultato1;
              const risultato2=data3.risultato2;
              const giorno= data3.data;
              const ora= data3.ora;
              var listPartite=document.getElementById("partiteUtente");
              let partita = document.createElement('p');
              partita.setAttribute("class", "partita");
              partita.setAttribute("id", idPartita);
              partita.setAttribute("onclick", "location.href='andamentoTorneo.html?idTorneo="+idTorneo+"'");              
              let nomeTorneoText=document.createElement('p');
              nomeTorneoText.setAttribute("class", "nomeTorneo");
              nomeTorneoText.textContent="Torneo: "+nomeTorneo+" | attività: "+argomento;
              partita.appendChild(nomeTorneoText);
              if(giorno!=undefined && ora!=undefined){
                //show the day of the game
                let dataBox = document.createElement('p');
                dataBox.setAttribute("class", "data");
                dataBox.textContent=giorno+" ora: "+ora;
                partita.appendChild(dataBox);
              }else{
                let dataBox = document.createElement('p');
                dataBox.setAttribute("class", "data");
                dataBox.setAttribute("title", "l'organizzatore deve ancora inserire la data della partita");
                dataBox.textContent="data da definire";
                partita.appendChild(dataBox);
              }
              let squadra1Box = document.createElement('p');
              squadra1Box.setAttribute("class", "squadra");          
              squadra1Box.textContent=squadra1+" | score: ";
              let risultato1Box;
              var up=false; //significa che è una partita nuova
              if(risultato1!=undefined) {
                risultato1Box=document.createElement('span');
                risultato1Box.textContent=risultato1;
              }else{up=true;}
              if(risultato1Box){
                risultato1Box.setAttribute("class", "risultato");
                squadra1Box.appendChild(risultato1Box);}
              partita.appendChild(squadra1Box);
              let squadra2Box = document.createElement('p');
              squadra2Box.setAttribute("class", "squadra");
              squadra2Box.textContent=squadra2+" | score: ";
              let risultato2Box;
              if(risultato2!=undefined) {
                risultato2Box=document.createElement('span');
                risultato2Box.textContent=risultato2;
              }else{up=true;}
              if(risultato2Box){
                risultato2Box.setAttribute("class", "risultato");
                squadra2Box.appendChild(risultato2Box);}
              partita.appendChild(squadra2Box);              
              if(up){//means that it's a new game so it has to be added up
                listPartite.prepend(partita);
              }else{
                listPartite.appendChild(partita);              
              }
            });
          });
        }else{
          var listPartite=document.getElementById("partiteUtente");
          let testo = document.createElement('p');
          testo.setAttribute("class","nomeTorneo")
          testo.textContent="Non hai ancora nessuna partita";
          listPartite.appendChild(testo);
        }
        });
      });
    });
  }).catch( error => console.error(error));
}

function accettaAmicizia(idNotifica){
  // Rimuovi notifica
  fetch('../api/v1/notifiche/' + idNotifica, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify( { accetta: true } ),
  })
  .then((resp) => resp.json()) // Trasforma i dati in json
  .then(function(data) { // Ricevi la risposta
    if (data.success){
    }
  }).then(function(){
    let box = document.getElementById("box2").innerHTML = "";
    location.reload();
  });
}

function rifiutaAmicizia(idNotifica){
  // Rimuovi notifica
  fetch('../api/v1/notifiche/' + idNotifica, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify( { accetta: false } )
  })
  .then((resp) => resp.json()) // Trasforma i dati in json
  .then(function(data) { // Ricevi la risposta
    if (data.success){
    }
  }).then(function(){
    let box = document.getElementById("box2").innerHTML = "";
    location.reload();
  });
}

function isUtenteLogged(){
  // Viene usata dalle schermate registrazione e index per definire se l'utente è loggato
  fetch('../api/v1/utenti/me')
  .then((resp) => resp.json()) // Trasforma i dati in JSON
  .then(function(data) { // Risposta
      if(data.success == false){
        //do nothing, l'utente non è loggato quindi non serve 
      }else{
        //redirect to home_aut
        location.href = "/home_aut.html";
      }
  })
  .catch( error => console.error(error) );
}

function loadInfoTorneo(){
  // Viene usata dalla schermata creaTorneo per inserire i dati preesistenti
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  var torneo = urlParams.get("idTorneo");
  if(torneo == null){
    //sta creando un nuovo torneo, nessun dato di default
    return;
  }
  fetch('../api/v1/tornei/'+torneo)
  .then((resp) => resp.json()) // Trasforma i dati in JSON
  .then(function(data) { // Risposta
    if(!data.success){
      alert(data.message);
      location.href = "cercaTornei.html";
      return;
    }else{      
      if(data.pubblicato){
        //non può essere modificato
        location.href = "cercaTornei.html";
        return;
      }
      //check se l'user è l'organizzatore del torneo
      //if(data.organizzatore==)
      // Carica campi
    if(data.nomeTorneo!=undefined){
      document.getElementById("nomeTorneo").value = data.nomeTorneo;
    } 
    if(data.argomento!=undefined){
      document.getElementById("argomento").value = data.argomento;
    }
    if(data.bio!=undefined){
      document.getElementById("bio").innerHTML = data.bio;
    }
    if(data.regolamento!=undefined){
      document.getElementById("regolamento").innerHTML = data.regolamento;
    }
    if(data.numeroSquadre!=undefined){     
      document.getElementById('nsquadre').value = data.numeroSquadre.toString();
    }
    if(data.numeroGiocatori!=undefined){
      document.getElementById('ngiocatori').value = data.numeroGiocatori;
    }
    if(data.dataInizio!=undefined){
      document.getElementById('dataInizio').value = data.dataInizio;
    }
    if(data.zona!=undefined){
      document.getElementById("zona").value = data.zona;
    }
    if(data.formatoT=="gironi" && data.numeroGironi!=undefined){      
    document.getElementById('ngironi').value = data.numeroGironi;
    }

    // Checka i tag
    var checkboxes = document.getElementsByName('tags'); 
    for (var checkbox of checkboxes) {  
      if(data.tags.includes(checkbox.value)){
        checkbox.checked = "true";
      }
    }  
    //checka la piattaforma
    var checkboxes = document.getElementsByName('piattaforma'); 
    for (var checkbox of checkboxes) {  
      if(data.piattaforma.includes(checkbox.value)){
        checkbox.checked = "true";
      }
    }  
    // Checkbox logo
    var logoTs = document.getElementsByName('logoT');
    for (var logoT of logoTs) {  
      if(logoT.value == data.id_img){
        logoT.checked = "true";
      }
    }  
    // select formatoT
    var formatoTs = document.getElementById('formatoT').options;
    for (var formatoT of formatoTs) {  
      if(formatoT.value == data.formatoT){
        formatoT.selected = "true";
      }
    }  
    // Se gironi allora apri div
    gironiDiv();
    // select formatop
    var formatoPs = document.getElementById('formatoP').options;
    for (var formatoP of formatoPs) {  
      if(formatoP.value == data.formatoP){
        formatoP.selected = "true";
      }
    }  
    }
  })
  .catch( error => console.error(error) );
}

function isUtenteLogged(){
  // Viene usata dalle schermate registrazione e index per definire se l'utente è loggato
  fetch('../api/v1/utenti/me')
  .then((resp) => resp.json()) // Trasforma i dati in JSON
  .then(function(data) { // Risposta
      if(data.success == false){
        //do nothing, l'utente non è loggato quindi non serve 
      }else{
        //redirect to home_aut
        location.href = "/home_aut.html";
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

// Funzione per controllare la correttezza della password durante l'azione di modifica password
function controllaPassword(pass){
  let nickname = document.getElementById("nickname").innerHTML;
  // Se la vecchia password è corretta allora abilita l'inserimento della nuova password
  // Richiama API auth e vedi se risposta positiva
  fetch('../api/v1/authentications', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify( { nickname: nickname, password: pass.value } ),
  })
  .then((resp) => resp.json()) // Trasforma i dati in json
  .then(function(data) { // Ricevi la risposta
    if (data.success){
      document.getElementById("vecPass").setAttribute("style","background: rgb(76, 249, 73);");
      document.getElementById("newPass").removeAttribute("disabled");
      document.getElementById("c_newPass").removeAttribute("disabled");
    }else{
      document.getElementById("vecPass").setAttribute("style","background: rgb(253, 116, 116);");
    }
  });
}

//funzione per salvare le modifiche fatte ad un account
function saveChanges(){
  // Usa il metodo PUT di API utenti
  // Questa funzione è chiamata durante la fase di modifica profilo
  var email = document.getElementById("email").innerHTML;
  var password = document.getElementById("newPass").value;
  var cpassword = document.getElementById("c_newPass").value;
  var avatar = document.querySelector('input[type = radio]:checked').value;
  var zona = document.getElementById("zona").value;
  var bio = document.getElementById("bio").value;
  var privato = document.getElementById("privato").checked; 
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
  // Se utente ha inserito la password vecchia corretta
  if(!document.getElementById("newPass").disabled){
    if(password == "") errors += "la password nuova è mancante; ";
        else{
        if(password != cpassword) errors += "nuova password e conferma nuova password devono essere uguali; ";
        if(password.length < 8) errors += "la nuova password deve essere di almeno 8 caratteri; ";
        if(!containsUppercase(password)) errors += "la nuova password deve contenere almeno un carattere maiuscolo; ";
        if(!containsLowercase(password)) errors += "la nuova password deve contenere almeno un carattere minuscolo; ";
        if(!containsNumbers(password)) errors += "la nuova password deve contenere almeno un numero; ";
    }
  }
  if(preferenze.length == 0) errors += "devi selezionare almeno una preferenza; ";

  if(errors != ""){
      errors = "errori presenti: " + errors;
      errors = String(errors);
      document.getElementById("errors").innerHTML = errors;
      return;
  }

  // Invia richiesta PUT a utenti
  const update = { 
    email: email,
    bio: bio,
    preferenze: preferenze,
    piattaforme: piattaforme,
    avatar: avatar,
    zona: zona,
    privato: privato
  };
  if(!document.getElementById("newPass").disabled){
    // L'utente vuole modificare la password
    update.password = password;
  }
  fetch('../api/v1/utenti', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(update)
  })
  .then((resp) => resp.json()) // Trasforma i dati in json
  .then(function(data) { // Risposta
    // Popup messaggio API
    alert(data.message);
    if(data.success){
      location.href = "home_aut.html";
    }
    return;
  }).catch( function (error) {
    alert(error.message);
    console.error(error);
    return;
  });
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
      // Variabile globale listaUtenti
      listaUtenti = data.users;
      data.users.map(function(nickname) { 
        let box = document.getElementById("boxUtenti");
        let button = document.createElement('button');
        button.type = 'button';
        button.setAttribute("onclick", "location.href='visualizzaSchedaUtente.html?nickname=" + nickname + "'");
        button.setAttribute("style", "background-color:#30b5fc; width:150px; height: 40px; font-size:16px");
        button.textContent = nickname;
        box.appendChild(button);
        // Prendi piattaforme e preferenze e memorizzale nella variabile tagUtenti
        fetch('../api/v1/utenti/'+nickname)
        .then((resp) => resp.json()) // Trasforma i dati in JSON
        .then(function(data) { // Risposta
          if(!data.success){
            alert(data.message);
            return;
          }
          else{
            // Inserisci piattaforme e preferenze in tagUtenti
            tagUtenti.push({nickname: nickname, piattaforme: data.piattaforme, preferenze: data.preferenze});
          }
        })
        .catch( error => console.error(error) );
      });
    }
  })
  .catch( error => console.error(error) );
}

// Funzione usata da cercaTornei
function listTornei(){
  // Elenca tutti i tornei sulla piattaforma
  fetch('../api/v1/tornei/list')
  .then((resp) => resp.json()) // Trasforma i dati in JSON
  .then(function(data) { // Risposta
    if(!data.success){
      // Nessun torneo presente sulla piattaforma
      alert(data.message);
      return;
    }
    else{
      data.tornei.map(function(idTorneo, index) { 
        let box = document.getElementById("boxTornei");
        let button = document.createElement('button');
        button.type = 'button';
        if(!data.avviati[index]) 
          button.setAttribute("onclick", "location.href='visualizzaSchedaTorneo.html?idTorneo=" + idTorneo + "'");
        else{button.setAttribute("onclick", "location.href='andamentoTorneo.html?idTorneo=" + idTorneo + "'");}
        button.setAttribute("style", "background-color:#30b5fc; width:600px; height: 30px; font-size:16px");
        var contenutoButton;           
        
        fetch('../api/v1/tornei/'+idTorneo)
        .then((resp) => resp.json()) // Trasforma i dati in JSON
        .then(function(data) { // Risposta
        if(!data.success){
          return;
        }else{
        // crea il contenuto del button
        contenutoButton=data.nomeTorneo+" --> org: "+data.organizzatore+"; attività: "+data.argomento;
        }
        button.textContent = contenutoButton;
        box.appendChild(button);
      });    
  })
  }})
  .catch( error => console.error(error) );  
}

function listTorneiUtente(){
  if(globalNickname!=undefined ){
    if(!document.getElementById("boxTorneiUser").checkVisibility()){
      //non è visibile-> rendi visibile e carica i tornei
    document.getElementById("boxTornei").setAttribute("style","margin-right:10%; float: right;");
    document.getElementById("boxTorneiUser").removeAttribute("hidden");
      //call get tornei/nickname/:nickname
      fetch('../api/v1/tornei/nickname/'+globalNickname)
      .then((resp) => resp.json()) // Trasforma i dati in JSON
      .then(function(data) { // Risposta
    
      if(data.tornei==""){
        // Nessun torneo dell'utente presente sulla piattaforma
        let box = document.getElementById("boxTorneiUser");
        let button = document.createElement('button');
        button.type = 'button';
        button.setAttribute("onclick", "location.href='creaTorneo.html'");
        button.setAttribute("style", "background-color:#30b5fc; width:300px; height: 30px; font-size:14px");
        button.textContent = "Non hai creato nessun torneo, crealo ora!";
        box.appendChild(button);      
        return;
      }
      else{
        data.tornei.map(function(idTorneo) { 
          let box = document.getElementById("boxTorneiUser");
          let button = document.createElement('button');
          button.type = 'button';
          button.setAttribute("style", "background-color:#30b5fc; width:300px; height: 30px; font-size:16px");
          var contenutoButton;                
          fetch('../api/v1/tornei/'+idTorneo)
          .then((resp) => resp.json()) // Trasforma i dati in JSON
          .then(function(data) { // Risposta
          if(!data.success){            
            return;
          }else{
            // crea il contenuto del button
            contenutoButton=data.nomeTorneo+"; attività: "+data.argomento;
            if(data.pubblicato){              
            button.setAttribute("onclick", "location.href='visualizzaSchedaTorneo.html?idTorneo=" + idTorneo + "'");            
            }else{              
            button.setAttribute("onclick", "location.href='creaTorneo.html?idTorneo=" + idTorneo + "'");            
            }
            var span=document.createElement('span');
            button.textContent = contenutoButton;
            span.appendChild(button);
            if(!data.avviato){
              let buttonX = document.createElement('button');
              buttonX.type = 'button';
              buttonX.setAttribute("id", idTorneo);
              buttonX.setAttribute("class", "remover");
              buttonX.setAttribute("onclick", "removeTorneo(id)");
              buttonX.textContent= "X";
              span.appendChild(buttonX);
            }else{
              button.setAttribute("onclick", "location.href='andamentoTorneo.html?idTorneo=" + idTorneo + "'");            
            }
            box.appendChild(span);
          }
        });    
      })
      }})
      .catch( error => console.error(error) );  

    }else{
      let box = document.getElementById("boxTorneiUser");        
      while (box.firstChild.nextSibling.nextSibling.nextSibling) {
        box.removeChild(box.lastChild);
      }
      //è visibile-> rendi invisibile      
      document.getElementById("boxTorneiUser").setAttribute("hidden","true");
      document.getElementById("boxTornei").removeAttribute("style");  
    }
  }else{
    alert("Per visualizzare i tuoi tornei devi autenticarti");
  }
}

//funzione usate da cercaTornei per eliminare un proprio torneo non avviato
function removeTorneo(x){
  //controllo autenticato
  if(globalNickname){
    //cerca le info della squadra-> se l'utente non ne fa parte e non è l'organizzatore allora non può rimuovere la squadra
    var conf=prompt("Sei sicuro di voler eliminare questo torneo? Scrivi 'conferma' per confermare",);
    if(conf!="conferma") return;
    //call the delete
    fetch('../api/v1/tornei/' + x, {
    method: 'DELETE',
    })
    .then((resp) => resp.json()) // Trasforma i dati in JSON
    .then(function(data) { // Risposta      
    if(!data.success){
      alert("Errore nell'operazione, torneo non rimosso.")
    return;
    }else{        
      alert("Torneo rimosso con successo.")      
      location.href = "cercaTorneo.html";
    }
    }).catch( error => console.error(error) ); 
  }
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
        span.innerHTML += " | " + MAPPA_PREFERENZE[preferenze]; 
      });
      // Inserisci ogni piattaforma in span
      data.piattaforme.map(function(piattaforme) {
        let span = document.getElementById('piatt');
        span.innerHTML += " | " + MAPPA_PIATTAFORME[piattaforme]; 
      });
      // Carica foto avatar
      document.getElementById("avatar").setAttribute("alt", MAPPA_AVATAR[data.avatar]);
      document.getElementById("avatar").setAttribute("src", "images/" + MAPPA_AVATAR[data.avatar] + ".png");
      document.getElementById("torneiVinti").innerHTML = data.torneiVinti.toString();  
    }
  })
  .catch( error => console.error(error) );
}

// Funzione usata da visualizzaSchedaTorneo
function getTorneo(){
  var idTorneo;
  loadInfoUser().then(
    function(){
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    idTorneo = urlParams.get("idTorneo");
    if(idTorneo == null){
      alert("IdTorneo non specificato!");
      location.href = "cercaUtenti.html";
      return;
    }
  }).then(function(){
    fetch('../api/v1/tornei/'+idTorneo)
    .then((resp) => resp.json()) // Trasforma i dati in JSON
    .then(function(data) { // Risposta
      if(!data.success){
        location.href = "cercaTorneo.html";
        return;
      }
      else{
        if(data.avviato){
          alert("Il torneo è già avviato, verrai reindirizzato alla pagina relativa all'andamento del torneo");        
          location.href = "andamentoTorneo.html?idTorneo="+idTorneo;          
        }
        // Carica nickname e bio
        document.getElementById("organizzatore").innerHTML = data.organizzatore;
        document.getElementById("nomeTorneo").innerHTML = data.nomeTorneo;
        document.getElementById("argomento").innerHTML = data.argomento;
        if(document.getElementById("bio"))
        document.getElementById("bio").innerHTML = data.bio;
        if(document.getElementById("regolamento"))  
        document.getElementById("regolamento").innerHTML = data.regolamento;
        if(document.getElementById("dataInizio"))  
        document.getElementById("dataInizio").innerHTML = data.dataInizio;
        if(data.piattaforma!="0"){        
          document.getElementById("piattaforma").innerHTML = MAPPA_PIATTAFORME[data.piattaforma];
          document.getElementById("piattaformaHolder").removeAttribute("hidden");
        }
        // Carica foto logoT
        if(document.getElementById("logoT")){
          document.getElementById("logoT").setAttribute("alt", MAPPA_IMG_TORNEI[data.id_img]);
          document.getElementById("logoT").setAttribute("src", "images/" + MAPPA_IMG_TORNEI[data.id_img] + ".png");
        } 
        document.getElementById("numeroGiocatori").innerHTML = data.numeroGiocatori;  
        document.getElementById("numeroSquadre").innerHTML = data.numeroSquadre;
        document.getElementById("formatoP").innerHTML = MAPPA_FORMATOP[data.formatoP];  
        document.getElementById("formatoT").innerHTML = MAPPA_FORMATOT[data.formatoT]; 
        if(data.formatoT=="gironi"){
          document.getElementById("gironiHolder").removeAttribute("hidden");
          document.getElementById("gironi").innerHTML = data.numeroGironi;
        } 
        if(data.zona!=undefined){        
          document.getElementById("zonaHolder").removeAttribute("hidden");
          document.getElementById("zona").innerHTML = data.zona;
        }
        if(data.organizzatore==globalNickname){
          document.getElementById("avviaTorneo").removeAttribute("hidden");        
      }
      }
    })
    .catch( error => console.error(error) );
  }).then(function(){
    fetch('../api/v1/squadre/list/'+idTorneo)
    .then((resp) => resp.json()) // Trasforma i dati in JSON
    .then(function(data) { // Risposta
      if(data.nomiSquadre==null){
        const div=document.createElement('span');
        div.textContent="Nessuna squadra iscritta"; //dont work ??????
        var listSquadre=document.getElementById("boxSquadre"); 
        listSquadre.appendChild(div);
        document.getElementById("nsquadreIscritte").textContent="0";
        return;
      }
      else{
        // Carica squadre
        document.getElementById("nsquadreIscritte").textContent=data.idSquadre.length;
        data.nomiSquadre.map(function(squadra,index) {  
          const idS=data.idSquadre[index];
          const giocatori=data.giocatori[index];
          const capitano= data.capitani[index];
          var listSquadre=document.getElementById("boxSquadre");
          let button = document.createElement('button');
          button.type = 'button';
          button.setAttribute("id", idS); 
          button.setAttribute("value", squadra);
          button.setAttribute("style", "background-color:#30b5fc; width:350px; height: 30px; font-size:16px");
          button.setAttribute("onclick", "showMore(id)");        
          button.textContent=squadra+" | capitano: "+capitano;
          let buttonX = document.createElement('button');
          buttonX.type = 'button';
          buttonX.setAttribute("id", idS);
          buttonX.setAttribute("class", "removeSquadra");
          buttonX.setAttribute("onclick", "removerSquadra(id)");
          buttonX.textContent= "X";
          let boxGiocatori = document.createElement('div');
          boxGiocatori.setAttribute("id", idS+"G");
          boxGiocatori.setAttribute("class", "elencoGiocatori");
          boxGiocatori.setAttribute("hidden", "true");
          giocatori.forEach(function (giocatore){         
            let paragrafo = document.createElement('p');
            paragrafo.innerHTML=giocatore;
            boxGiocatori.appendChild(paragrafo);
          })

          let span=document.createElement('span');
          span.setAttribute("id", idS);
          span.appendChild(button);
          span.appendChild(buttonX);
          listSquadre.appendChild(span);
          listSquadre.appendChild(boxGiocatori);      
        });
      }
    })
    .catch( error => console.error(error) );
  });
}

// Funzione usata da andamentoTorneo
function getAndamentoTorneo(){
  var idTorneo;
  loadInfoUser().then(
    function(){
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    idTorneo = urlParams.get("idTorneo");
    if(idTorneo == null){
      alert("IdTorneo non specificato!");
      location.href = "cercaUtenti.html";
      return;
    }
  }).then(function(){
    fetch('../api/v1/tornei/'+idTorneo)
    .then((resp) => resp.json()) // Trasforma i dati in JSON
    .then(function(data) { // Risposta
      if(!data.success){
        location.href = "cercaTorneo.html";
        return;
      }
      else{        
        // Carica nickname e bio
        document.getElementById("organizzatore").innerHTML = data.organizzatore;
        document.getElementById("nomeTorneo").innerHTML = data.nomeTorneo;
        document.getElementById("argomento").innerHTML = data.argomento;
        if(document.getElementById("bio"))
        document.getElementById("bio").innerHTML = data.bio;
        if(document.getElementById("regolamento"))  
        document.getElementById("regolamento").innerHTML = data.regolamento;
        if(document.getElementById("dataInizio"))  
        document.getElementById("dataInizio").innerHTML = data.dataInizio;
        if(data.piattaforma!="0"){        
          document.getElementById("piattaforma").innerHTML = MAPPA_PIATTAFORME[data.piattaforma];
          document.getElementById("piattaformaHolder").removeAttribute("hidden");
        }
        // Carica foto logoT
        if(document.getElementById("logoT")){
          document.getElementById("logoT").setAttribute("alt", MAPPA_IMG_TORNEI[data.id_img]);
          document.getElementById("logoT").setAttribute("src", "images/" + MAPPA_IMG_TORNEI[data.id_img] + ".png");
        } 
        document.getElementById("numeroGiocatori").innerHTML = data.numeroGiocatori;  
        document.getElementById("numeroSquadre").innerHTML = data.numeroSquadre;
        document.getElementById("formatoP").innerHTML = MAPPA_FORMATOP[data.formatoP];  
        document.getElementById("formatoT").innerHTML = MAPPA_FORMATOT[data.formatoT]; 
        if(data.formatoT=="gironi"){
          document.getElementById("gironiHolder").removeAttribute("hidden");
          document.getElementById("gironi").innerHTML = data.numeroGironi;
        } 
        if(data.zona!=undefined){        
          document.getElementById("zonaHolder").removeAttribute("hidden");
          document.getElementById("zona").innerHTML = data.zona;
        }
        if(data.organizzatore==globalNickname){
          //mostra le interazioni che può avere l'organizzatore   
      }
      }
    })
    .catch( error => console.error(error) );
  }).then(function(){
    fetch('../api/v1/partite/list/'+idTorneo)
    .then((resp) => resp.json()) // Trasforma i dati in JSON
    .then(function(data) {// Risposta
      if(!data.success){  //nessuna partita trovata
        alert("errore, nessuna partita trovata")
        return;
      }
      else{
        // Carica partite
        data.idPartite.map(function(idPartita) { 
          fetch('../api/v1/partite/'+idPartita)
          .then((resp) => resp.json()) // Trasforma i dati in JSON
          .then(function(data) {// Risposta
            if(!data.success){  //nessuna partita trovata
              alert("errore, nessuna partita trovata")
              return;
            }
            else{              
            const squadra1=data.nomeSquadra1;
            const squadra2=data.nomeSquadra2;
            const risultato1=data.risultato1;
            const risultato2=data.risultato2;
            const giorno= data.data;
            const ora= data.ora;
            const fase= data.fase;
            var listPartite=document.getElementById("tabellone");
            let partita = document.createElement('p');
            partita.setAttribute("class", "partita");
            partita.setAttribute("id", idPartita);
            let faseText=document.createElement('span');
            faseText.setAttribute("style", "float:left; margin-left:5px;");
            faseText.textContent="fase: "+fase;
            partita.appendChild(faseText);
            if(giorno!=undefined && ora!=undefined){
              //show the day of the game
              let dataBox = document.createElement('p');
              dataBox.setAttribute("class", "data");
              dataBox.textContent=giorno+" ora: "+ora;
              partita.appendChild(dataBox);
            }else if(globalNickname==document.getElementById("organizzatore").textContent){
              //show the form to add the day to the game  
              document.getElementById("inserisciRisultati").setAttribute("disabled",true);                
              let dataBox = document.createElement('span');        
              let dataInput = document.createElement('input');
              dataInput.setAttribute("class", "dataInput");    
              dataInput.setAttribute("id", idPartita+"data");
              dataInput.placeholder="data";      
              let oraInput = document.createElement('input');
              oraInput.setAttribute("class", "dataInput");
              oraInput.setAttribute("id", idPartita+"ora");
              oraInput.placeholder="ora";
              dataBox.appendChild(dataInput); 
              dataBox.appendChild(oraInput);                  
              let button = document.createElement('button');
              button.type='button';
              button.setAttribute("id",idPartita);
              button.setAttribute("onclick", "setDataPartita(id)");
              button.setAttribute("style", "background-color:#30b5fc; height: 25px; font-size:10px;");
              button.textContent="SET";
              dataBox.appendChild(button);
              partita.appendChild(dataBox);     
            }else{
              let dataBox = document.createElement('p');
              dataBox.setAttribute("class", "data");
              dataBox.setAttribute("title", "l'organizzatore deve ancora inserire la data della partita");
              dataBox.textContent="data da definire";
              partita.appendChild(dataBox);
            }
            let squadra1Box = document.createElement('p');
            squadra1Box.setAttribute("class", "squadra");          
            squadra1Box.textContent=squadra1+" | score: ";
            let risultato1Box;
            var up=false; //usato per definire se è una partita nuova o vecchia, se è nuova viene aggiunta in cima alle altre
            if(risultato1==undefined) {
              if(globalNickname==document.getElementById("organizzatore").textContent){
                risultato1Box=document.createElement('input');
                risultato1Box.setAttribute("id", idPartita+"r1");
                document.getElementById("generaPartite").setAttribute("disabled",true);            
              }
              up=true;
            }else{
              risultato1Box=document.createElement('span');
              risultato1Box.textContent=risultato1;
            }
            if(risultato1Box){
              risultato1Box.setAttribute("class", "risultato");
              squadra1Box.appendChild(risultato1Box);}
            partita.appendChild(squadra1Box);
            let squadra2Box = document.createElement('p');
            squadra2Box.setAttribute("class", "squadra");
            squadra2Box.textContent=squadra2+" | score: ";
            let risultato2Box;
            if(risultato2==undefined) {
              if(globalNickname==document.getElementById("organizzatore").textContent){
                risultato2Box=document.createElement('input');
                risultato2Box.setAttribute("id", idPartita+"r2");
                document.getElementById("generaPartite").setAttribute("disabled",true); 
              }
            }else{
              risultato2Box=document.createElement('span');
              risultato2Box.textContent=risultato2;
            }
            if(risultato2Box){
            risultato2Box.setAttribute("class", "risultato");
            squadra2Box.appendChild(risultato2Box);}
            partita.appendChild(squadra2Box);            
            
            if(document.getElementById(fase)){  //non c'è bisogno di controllare se è una partita nuova perché se ha trovato il paragrafo significa che è già in alto
              let div=document.getElementById(fase);
              div.appendChild(partita);
            }else{
              if(up){//means that it's a new game so it has to be added up
                let giornata=document.createElement('div');
                giornata.setAttribute("id", fase);
                giornata.appendChild(partita);
                listPartite.prepend(giornata);
              }else{
                let giornata=document.createElement('div');
                giornata.setAttribute("id", fase);
                giornata.appendChild(partita);
                listPartite.appendChild(giornata);
              }            
            }
            if(document.getElementById("generaPartite").getAttribute("disabled")){//vuol dire che uno o più risultati sono mancanti
              document.getElementById("inserisciRisultati").removeAttribute("disabled");
            }else{  document.getElementById("inserisciRisultati").setAttribute("disabled", true);}
            }
          })   
        });
        
      }
    })      
  }).then(function(){
    fetch('../api/v1/squadre/list/'+idTorneo)
    .then((resp) => resp.json()) // Trasforma i dati in JSON
    .then(function(data) { // Risposta
      if(data.nomiSquadre==null){
        return;
      }
      else{
        // Carica squadre
        document.getElementById("nsquadreIscritte").textContent=data.idSquadre.length;
        data.nomiSquadre.map(function(squadra,index) {  
          const idS=data.idSquadre[index];
          const giocatori=data.giocatori[index];
          const capitano= data.capitani[index];
          var listSquadre=document.getElementById("boxSquadre");
          let button = document.createElement('button');
          button.type = 'button';
          button.setAttribute("id", idS); 
          button.setAttribute("value", squadra);
          button.setAttribute("style", "background-color:#30b5fc; width:350px; height: 30px; font-size:16px");
          button.setAttribute("onclick", "showMore(id)");        
          button.textContent=squadra+" | capitano: "+capitano;
          let boxGiocatori = document.createElement('div');
          boxGiocatori.setAttribute("id", idS+"G");
          boxGiocatori.setAttribute("class", "elencoGiocatori");
          boxGiocatori.setAttribute("hidden", "true");
          giocatori.forEach(function (giocatore){         
            let paragrafo = document.createElement('p');
            paragrafo.innerHTML=giocatore;
            boxGiocatori.appendChild(paragrafo);
          })

          let span=document.createElement('span');
          span.setAttribute("id", idS);
          span.appendChild(button);
          listSquadre.appendChild(span);
          listSquadre.appendChild(boxGiocatori);      
        });
      }
    })
    .catch( error => console.error(error) );
  });
}

//chiamata da visualizza scheda torneo
function removerSquadra(x){
  //controllo autenticato
  if(globalNickname){
    //cerca le info della squadra-> se l'utente non ne fa parte e non è l'organizzatore allora non può rimuovere la squadra
    if(globalNickname!=document.getElementById("organizzatore").textContent){
      fetch('../api/v1/squadre/'+x)
      .then((resp) => resp.json()) // Trasforma i dati in JSON
      .then(function(data) { // Risposta      
      if(!data.success){
      return;
      }else{
        if(!data.giocatori.includes(globalNickname)&& data.capitano!=globalNickname){
          alert("non fai parte della squadra, non puoi rimuovere un'altra squadra dal torneo!")
          return;
        }else{
          var conf=prompt("Sei sicuro di voler rimuovere la squadra dal torneo? Scrivi 'conferma' per confermare",);
          if(conf!="conferma") return;
          var listgiocatori=document.getElementById("boxSquadre");
          while(document.getElementById(x))
          listgiocatori.removeChild(document.getElementById(x));
          //call the delete
          fetch('../api/v1/squadre/' + x, {
          method: 'DELETE',
          })
          .then((resp) => resp.json()) // Trasforma i dati in JSON
          .then(function(data) { // Risposta      
          if(!data.success){
            alert("Errore nell'operazione, squadra non rimossa.")
          return;
          }else{        
            alert("Squadra rimossa con successo.")
          }
          }).catch( error => console.error(error) ); 
        }
    }
    }).catch( error => console.error(error) ); 
    }else{
      //è l'organizzatore      
      var conf=prompt("Sei sicuro di voler rimuovere la squadra dal torneo? Scrivi 'conferma' per confermare",);
      if(conf!="conferma") return;
      var listgiocatori=document.getElementById("boxSquadre");
      while(document.getElementById(x))
      listgiocatori.removeChild(document.getElementById(x));
      //call the delete
      fetch('../api/v1/squadre/' + x, {
      method: 'DELETE',
      })
      .then((resp) => resp.json()) // Trasforma i dati in JSON
      .then(function(data) { // Risposta      
      if(!data.success){
        alert("Errore nell'operazione, squadra non rimossa.")
      return;
      }else{        
        alert("Squadra rimossa con successo.")
      }
      }).catch( error => console.error(error) ); 
    }    
  }else{
    alert("Per interagire con l'elenco delle squadre devi essere autenticato");
    return;
  }
}

function showMore(x){
  //change to-> lo creai prima hidden-> change status
  if(globalNickname){
    let boxG=document.getElementById(x+"G");
    if(boxG.checkVisibility()){
      boxG.setAttribute("hidden", true);
      }else{
      boxG.removeAttribute("hidden");
    }
  }else{
    alert("Per visualizzare i giocatori della squadra devi essere autenticato");
  }
}

//chiamata da visualizza scheda torneo per rimuovere una squadra iscritta ad un torneo
//per farlo bisogna essere l'organizzatore del torneo o un membro della squadra
function removerSquadra(x){
  //controllo autenticato
  if(globalNickname){
    //cerca le info della squadra-> se l'utente non ne fa parte e non è l'organizzatore allora non può rimuovere la squadra
    if(globalNickname!=document.getElementById("organizzatore").textContent){
      //call get squadre/:idSquadra per vedere se l'utente ne è parte
      fetch('../api/v1/squadre/'+x)
      .then((resp) => resp.json()) // Trasforma i dati in JSON
      .then(function(data) { // Risposta      
      if(!data.success){
      return;
      }else{
        if(!data.giocatori.includes(globalNickname)){
          alert("non fai parte della squadra, non puoi rimuovere un'altra squadra dal torneo!")
          return;
        }else{
          var conf=prompt("Sei sicuro di voler rimuovere la squadra dal torneo? Scrivi 'conferma' per confermare",);
          if(conf!="conferma") return;
          var listgiocatori=document.getElementById("boxSquadre");
          while(document.getElementById(x))
          listgiocatori.removeChild(document.getElementById(x));
          //call the delete
          fetch('../api/v1/squadre/' + x, {
          method: 'DELETE',
          })
          .then((resp) => resp.json()) // Trasforma i dati in JSON
          .then(function(data) { // Risposta      
          if(!data.success){
            alert("Errore nell'operazione, squadra non rimossa.")
          return;
          }else{        
            alert("Squadra rimossa con successo.")
          }
          }).catch( error => console.error(error) ); 
        }
    }
    }).catch( error => console.error(error) ); 
    }else{
      //è l'organizzatore      
      var conf=prompt("Sei sicuro di voler rimuovere la squadra dal torneo? Scrivi 'conferma' per confermare",);
      if(conf!="conferma") return;
      var listgiocatori=document.getElementById("boxSquadre");
      while(document.getElementById(x))
      listgiocatori.removeChild(document.getElementById(x));
      //call the delete
      fetch('../api/v1/squadre/' + x, {
      method: 'DELETE',
      })
      .then((resp) => resp.json()) // Trasforma i dati in JSON
      .then(function(data) { // Risposta      
      if(!data.success){
        alert("Errore nell'operazione, squadra non rimossa.")
      return;
      }else{        
        alert("Squadra rimossa con successo.")
      }
      }).catch( error => console.error(error) ); 
    }    
  }else{
    alert("Per interagire con l'elenco delle squadre devi essere autenticato");
    return;
  }
}

//funzione usata da visualizzaSchedaTorneo.html
function avviaTorneo(){
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    var torneo = urlParams.get("idTorneo"); 
  //controllo per vedere se l'utente è l'organizzatore
  fetch('../api/v1/tornei/'+torneo)
  .then((resp) => resp.json()) // Trasforma i dati in JSON
  .then(function(data) { // Risposta
    if(!data.success){
      //torneo non trovato
      return;
    }else{
      var nsquadreIscritte;
        if(data.numeroSquadre==nsquadreIscritte) return false;
        return data.avviato;
    }
  })
  .then(function(data){ 
    if(data){
      alert("Error, prova a ricaricare la pagina, se il torneo non è avviato vuol dire che non ci sono abbastanza squadre iscritte!"); return;
    }
    if(document.getElementById("organizzatore").textContent==globalNickname){     
      // crea partite 
      avviaMatchmakingTorneo(torneo);
      fetch('../api/v1/tornei/'+torneo+'/avvia', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pubblica: true
        })
      })
      .then((resp) => resp.json()) // Trasforma i dati in json
      .then(function(data) {
        if(data.success){
          alert("Torneo avviato correttamente! Verrai reindirizzato alla pagina relativa all'andamento del torneo");        
          location.href = "andamentoTorneo.html?idTorneo="+torneo;
          return;
        }else{        
          alert("Errore, torneo non avviato!");
          return;
        }
      });
    }else{
      alert("no");
    }
  }).catch( function (error) {
  alert(error.message);
  console.error(error);
  return;
  });
}

// Funzione usata da modificaProfilo
function getPersonalProfile(){
  fetch('../api/v1/utenti/me')
  .then((resp) => resp.json()) // Trasforma i dati in JSON
  .then(function(data) { // Risposta
    // Carica nickname e bio e email
    document.getElementById("nickname").innerHTML = data.nickname;
    document.getElementById("bio").innerHTML = data.bio;  
    document.getElementById("email").innerHTML = data.email;  
    if (data.zona){
      document.getElementById("zona").value = data.zona;  
    }
    // Checka le checkbox
    var checkboxes = document.getElementsByName('pref'); 
    for (var checkbox of checkboxes) {  
      if(data.preferenze.includes(checkbox.value)){
        checkbox.checked = "true";
      }
    }  
    var checkboxes = document.getElementsByName('piatt'); 
    for (var checkbox of checkboxes) {  
      if(data.piattaforme.includes(checkbox.value)){
        checkbox.checked = "true";
      }
    }  
    // Checkbox avatar
    var avatars = document.getElementsByName('avatar');
    for (var avatar of avatars) {  
      if(avatar.value == data.avatar){
        avatar.checked = "true";
      }
    }  
    // Toggle switch privato
    if(data.privato){
      document.getElementById("privato").setAttribute("checked", true);
    }
    else{
      document.getElementById("privato").removeAttribute("checked");
    }
  })
}

// Funzione usata da index // Vedere se va aggiunta ad altri login form in giro
function reimpostaPassword(){
  // Controlla che il campo nickname sia una email valida
  var email = document.getElementById("loginNickname").value;

  if(!isValidEmail(email)){
    alert("Inserisci una mail valida!");
    return;
  }
  var conferma = confirm("Verrà reimpostata la password per l'account di " + email + ". Confermi?");
  if(conferma){
    // Crea stringa alfanumerica casuale di 10 caratteri
    var randomstring = Math.random().toString(36).slice(-10);
    // Converti maiuscolo un carattere casuale
    for (let i = 0; i < randomstring.length; i++) { 
      if(containsLowercase(randomstring[i])){
        randomstring = randomstring.substring(0, i) + randomstring[i].toUpperCase() + randomstring.substring(i + 1);
        break;
      }
    }
    // Aggiungi numero 
    randomstring += parseInt(Math.random()*10).toString();
    var passwordCasuale = randomstring;
    // Invia richiesta PUT a utenti con password generata 
    fetch('../api/v1/utenti', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email,
        password: passwordCasuale
      })
    })
    .then((resp) => resp.json()) // Trasforma i dati in json
    .then(function(data) { // Risposta
      if(data.success){
        // Invia nuova password via email all'utente
        sendMails(email,"resetPasswd", passwordCasuale);
        alert("Controlla la tua password temporanea inviata per email");
      }
      else{
        // Popup messaggio API errore
        alert(data.message);
      }
      return;
    }).catch( function (error) {
      alert(error.message);
      console.error(error);
      return;
    });
  }
}

function adder(nickname){
  var listutenti=document.getElementById("utenti");
  while(document.getElementById(nickname))
    listutenti.removeChild(document.getElementById(nickname));
  var listgiocatori=document.getElementById("giocatori");
  let button = document.createElement('button');
  button.type = 'button';
  button.setAttribute("id", nickname);
  button.setAttribute("value", nickname);
  button.setAttribute("style", "background-color:#30b5fc; width:300px; height: 30px; font-size:16px");
  button.textContent=nickname;  
  let buttonX = document.createElement('button');
  buttonX.type = 'button';
  buttonX.setAttribute("id", nickname);
  buttonX.setAttribute("class", "remover");
  buttonX.setAttribute("onclick", "remover(id)");
  buttonX.textContent= "X";
  let span=document.createElement('span');
  span.setAttribute("id", nickname);
  span.appendChild(button);
  span.appendChild(buttonX);
  listgiocatori.appendChild(span);
}

function remover(x){
  var nickname=x;
  var listutenti=document.getElementById("utenti");
  let button = document.createElement('button');
  button.type = 'button';
  button.setAttribute("id", nickname);
  button.setAttribute("value", nickname);
  button.setAttribute("style", "background-color:#30b5fc; width:300px; height: 30px; font-size:16px");
  button.textContent=nickname;
  let buttonX = document.createElement('button');
  buttonX.type = 'button';
  buttonX.setAttribute("id", nickname);
  buttonX.setAttribute("class", "adder");
  buttonX.setAttribute("onclick", "adder(id)");
  buttonX.textContent= "+";
  let span=document.createElement('span');
  span.setAttribute("id", nickname);
  span.appendChild(button);
  span.appendChild(buttonX);
  listutenti.appendChild(span);

  var listgiocatori=document.getElementById("giocatori");
  while(document.getElementById(nickname))
    listgiocatori.removeChild(document.getElementById(nickname));
}

function utentiPossibili(){
  // Elenca tutti gli utenti iscritti => diventerà lista amici
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
        var listutenti=document.getElementById("utenti");
        let button = document.createElement('button');
        button.type = 'button';
        button.setAttribute("id", nickname);
        button.setAttribute("value", nickname);
        button.setAttribute("style", "background-color:#30b5fc; width:300px; height: 30px; font-size:16px");
        button.textContent=nickname;
        let buttonX = document.createElement('button');
        buttonX.type = 'button';
        buttonX.setAttribute("id", nickname);
        buttonX.setAttribute("class", "adder");
        buttonX.setAttribute("onclick", "adder(id)");
        buttonX.textContent= "+";
        let span=document.createElement('span');
        span.setAttribute("id", nickname);
        span.appendChild(button);
        if(nickname!=globalNickname) span.appendChild(buttonX); // se è il proprio profilo non bisogna mettere il pulsante
        if(nickname==globalNickname){
          listgiocatori=document.getElementById("giocatori");
          listgiocatori.appendChild(span)
        }else{
        listutenti.appendChild(span);}
      });
    }
  })
  .catch( error => console.error(error) );
}

function iscriviSquadra(){
  // Questa funzione è chiamata durante la fase di iscrizione squadra
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  var torneo = urlParams.get("idTorneo");
  if(torneo == null){
    return;
  }
  var numeroSquadre = document.getElementById("numeroSquadre").textContent;
  var capitano = document.getElementById("nicknameUser2").textContent;
  var nomeSquadra = document.getElementById("nomeSquadra").value;
  var numeroGiocatori = document.getElementById("numeroGiocatori").textContent;
  var nomeTorneo = document.getElementById("nomeTorneo").textContent;
  var giocatori=[];
  var listaGiocatori=document.getElementById("giocatori");
  const childern = listaGiocatori.childNodes; 
  childern.forEach(li => {
    giocatori.push(li.firstChild.value);
  });
  var errors = "";
  if(nomeSquadra == "") errors += "nome squadra mancante; ";
  if(giocatori.length>numeroGiocatori) errors +="hai inserito troppi giocatori; "
  if(giocatori.length<numeroGiocatori) errors +="non hai inserito abbastanza giocatori; "

  if(errors != ""){
      errors = "errori presenti: " + errors;
      errors = String(errors);
      alert(errors);
      return;
  }
  // Richiama l'API squadre
  fetch('../api/v1/squadre', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify( { 
        nomeSquadra: nomeSquadra,
        capitano: capitano,
        idTorneo: torneo,
        giocatori: giocatori,
        numeroSquadre: numeroSquadre //used by the system to check the slot disponibility
      } ),
  })
  .then((resp) => resp.json()) // Trasforma i dati in JSON
  .then(function(data) { // Risposta
      // Popup messaggio API
      alert(data.message);
      if(data.success){
        //coming soon
        // iscrizione ok
        //a tutti i giocatori manda         
        //sendMails("mail utente","iscrizioneTorneo", nomeTorneo);
      }
      return;
  })  .catch( function (error) {
          alert(error.message);
          console.error(error);
          return;
      } );
};

function richiestaAmicizia(){
  // Funzione utilizzata da visualizzaSchedaUtente
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  var nickDestinatario = urlParams.get("nickname");
  // Data di adesso in millisecondi
  const data = Date.now();
  // Richiama l'API notifiche
  // Nuova notifica amicizia
  fetch('../api/v1/notifiche', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify( { 
      nickMittente: globalNickname,
      nickDestinatario: nickDestinatario,
      categoria: "amicizia",
      data: data
    } ),
  })
  .then((resp) => resp.json()) // Trasforma i dati in JSON
  .then(function(data) { // Risposta
    // Popup messaggio API
    if(data.success){
      alert("Richiesta amicizia inviata");
    }
    else{
      alert(data.message);
    }
    return;
  }).catch( function (error) {
    alert(error.message);
    console.error(error);
    return;
  } );
}

function arrContains(arr, arr2){
  return arr.every(i => arr2.includes(i));
}   

function filtraUtenti(){
  // Funzione usata da cercaUtenti per filtrare secondo gli input dell'utente gli utenti
  let inputNick = document.getElementById("cercaUtenti").value;
  // Lista utenti in base all'input nickname
  let nicknames = [];
  listaUtenti.map(function(nickname) { 
    if(nickname.toLowerCase().startsWith(inputNick.toLowerCase())){
      // Nickname che vanno bene secondo l'input di testo
      nicknames.push(nickname);
    }
  });

  // Perfeziona in base ai filtri
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

  // Pulisci boxUtenti
  let box = document.getElementById("boxUtenti");
  box.innerHTML = "";
  // Filtra nicknames secondo i tag
  nicknames.map(function(nickname) { 
     tagUtenti.map(function(tagUtente){
      if(nickname == tagUtente.nickname){
        if(arrContains(preferenze, tagUtente.preferenze) && arrContains(piattaforme, tagUtente.piattaforme)){
          let button = document.createElement('button');
          button.type = 'button';
          button.setAttribute("name", "btnUtente");
          button.setAttribute("nickname", nickname);
          button.setAttribute("onclick", "location.href='visualizzaSchedaUtente.html?nickname=" + nickname + "'");
          button.setAttribute("style", "background-color:#30b5fc; width:150px; height: 40px; font-size:16px");
          button.textContent = nickname;
          box.appendChild(button);
          return;
        }
        return;
      }
     });
  });
}

//funzione per creare le partite del torneo
function avviaMatchmakingTorneo(id){
  //prendo le info del torneo
  var numeroSquadre;
  var gironi; //need for formatoT: gironi
  var formatoT;
  var formatoP;
  var faseAttuale;
  let idSquadre=[];
  fetch('../api/v1/tornei/'+id)
  .then((resp) => resp.json()) // Trasforma i dati in JSON
  .then(function(data) { // Risposta
    if(!data.success){
      //torneo non trovato
      return;
    }else{   
      numeroSquadre= data.numeroSquadre.toString();
    if(data.formatoT=="gironi"){      
    gironi = data.numeroGironi;
    }
    formatoT= data.formatoT;
    formatoP = data.formatoP;
    giorniPartite=data.giorniPartite;
    faseAttuale=data.faseAttuale;
    }
  })
  .then(function(){
  //prendo gli id delle squadre
    fetch('../api/v1/squadre/list/'+id)
  .then((resp) => resp.json()) // Trasforma i dati in JSON
  .then(function(data) { // Risposta
    if(data.nomiSquadre==null){
      alert("errore nessuna squadra trovata");
      return;
      }
      // Carica squadre
      data.idSquadre.map(function(squadra,index){
        if(formatoT=="eliminazione" && data.punteggi[index]!=faseAttuale) return;
        idSquadre.push(squadra);});        
        }).then(function(){
        var tipoRisultato=[];
        switch(formatoP){
          //coming soon
          /*case "bo3": tipoRisultato.push(0);tipoRisultato.push(0);tipoRisultato.push(0);
          break;

          case "bo5": tipoRisultato.push(0);tipoRisultato.push(0);tipoRisultato.push(0);tipoRisultato.push(0);tipoRisultato.push(0);
          break;*/

        default:
          tipoRisultato=0;
        }
        var numeroPartiteTotali;
        switch(formatoT) {
        case "campionato":
          //coming soon
            /*for(var n=numeroSquadre-1; n>0; n--)
              numeroPartiteTotali+=n;
              while(numeroPartiteTotali>0){
                var idSquadra1 = idSquadre[(Math.random() * idSquadre.length) | 0];
                var idSquadra2 = idSquadre[(Math.random() * idSquadre.length) | 0];
                idSquadre.remove(idSquadre.findIndex(idSquadra1));
                idSquadre.remove(idSquadre.findIndex(idSquadra2));
                numeroPartiteTotali--;
              }*/
        break;
        case "eliminazione":
          var idSquadra1=[];    
          var idSquadra2=[];  
          numeroPartiteTotali=idSquadre.length/2;
          while(numeroPartiteTotali>0){
              idSquadra1.push(idSquadre[getRandomInt(idSquadre.length)]);
              var index1 = idSquadre.indexOf(idSquadra1[idSquadra1.length-1]);
              if(index1 > -1) {
                idSquadre.splice(index1, 1); 
              }
              idSquadra2.push(idSquadre[getRandomInt(idSquadre.length)]);
              var index2 = idSquadre.indexOf(idSquadra2[idSquadra2.length-1]);
              if(index2 > -1) { // only splice array when item is found
                idSquadre.splice(index2, 1); // 2nd parameter means remove one item only
              }
              numeroPartiteTotali--;
            }                                         
            idSquadra1.map(function(squadra1,index){
              var squadra2=idSquadra2[index];
              fetch('../api/v1/partite', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify( {                
                  idTorneo: id,
                  //data: req.body.data,
                  //ora: req.body.ora,
                  idSquadra1: squadra1,
                  idSquadra2: squadra2,
                  risultato1: tipoRisultato,
                  risultato2: tipoRisultato,
                  fase: faseAttuale
                }),
                })
                .then((resp) => resp.json()) // Trasforma i dati in json
                .then(function(data) { // Ricevi la risposta
                  if (data.success){           
                  }else{                    
                  }
                  return;
                })
                .catch( function (error) {
                  alert(error.message);
                  return;
                } );
            });
        break;
        case "gironi":
          //to be defined
        break;
        default:
          //
        }

        })
  }).then(function(){
    if(document.getElementById("generaPartite"))   getAndamentoTorneo(); //ricarica le informazioni della pagina
    fetch('../api/v1/tornei/avanzamento/'+id, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
    })
  })
  .then((resp) => resp.json()) // Trasforma i dati in JSON
  .then(function(data) {// Risposta
      if(!data.success)  //nessun torneo trovato
      return;
    }).catch( function (error) {
        console.log(error.message);
        return;
    });
  })
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function setDataPartita(idPartita){
//call partite/put per aggiungere data e ora alle partite
//call partite/put per aggiungere i risultati alle partite
  var giorno=document.getElementById(idPartita+"data").value;
  var ora=document.getElementById(idPartita+"ora").value;
  if(giorno=="" || ora=="") {alert("Devi inserire sia la data che l'ora!"); return;}
  fetch('../api/v1/partite/addData/'+idPartita, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      data: giorno,
      ora: ora,
    })
  })
  .then((resp) => resp.json()) // Trasforma i dati in JSON
  .then(function(data) {// Risposta
    if(!data.success){  //nessuna partita trovata
      alert("errore, nessuna partita trovata")
    return;
    }else{ 
      location.reload();
    }
  })
}


function inserisciRisultati(){
  //call partite/put per aggiungere i risultati alle partite
  let partite=document.getElementsByClassName('partita');
  for(var i=0; i<partite.length; i++){
    var idPartita=partite[i].id;
    if(document.getElementById(idPartita+"r1")!="[object HTMLInputElement]") //debug; significa che i risultati sono già inseriti
      continue;
    var r1=document.getElementById(idPartita+"r1").value;
    var r2=document.getElementById(idPartita+"r2").value;
    if(r1==undefined || r2==undefined) {alert("Devi inserire entrambi i risultati!"); return};   
    fetch('../api/v1/partite/addScore/'+idPartita, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        risultato1: r1,
        risultato2: r2,
      })
    })
    .then((resp) => resp.json()) // Trasforma i dati in JSON
    .then(function(data) {// Risposta
      if(!data.success){  //nessuna partita trovata
        alert("errore, nessuna partita trovata")
      return;
      }else{        
      location.reload();
      fetch('../api/v1/squadre/avanzamento/'+data.winner, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
        })
      })
      .then((resp) => resp.json()) // Trasforma i dati in JSON
      .then(function(data) {// Risposta
          if(!data.success)  //nessuna squadra trovata
          return;
        }).catch( function (error) {
            console.log(error.message);
            return;
        });
      }
    })
  }
}
