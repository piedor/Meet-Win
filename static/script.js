/**
 * This variable stores the logged in user
 */
var loggedUser = {};
var registeredUser = {};

/**
 * This function is called when login button is pressed.
 * Note that this does not perform an actual authentication of the user.
 * A student is loaded given the specified email,
 * if it exists, the studentId is used in future calls.
 */
function login()
{
    //get the form object
    var nickname = document.getElementById("loginNickname").value;
    var password = document.getElementById("loginPassword").value;
    // console.log(email);

    fetch('../api/v1/authentications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( { nickname: nickname, password: password } ),
    })
    .then((resp) => resp.json()) // Transform the data into json
    .then(function(data) { // Here you get the data to modify as you please
        //console.log(data);
        loggedUser.token = data.token;
        loggedUser.email = data.email;
        loggedUser.id = data.id;
        loggedUser.self = data.self;
        // loggedUser.id = loggedUser.self.substring(loggedUser.self.lastIndexOf('/') + 1);
        //document.getElementById("loggedUser").textContent = loggedUser.email;
        alert(data.message);
        if (data.success){
          location.href = "home_aut.html";
        }
        return;
    })
    .catch( function (error) {
        alert(error.message);
        return;
      } ); // If there is any error you will catch them here

};

function containsNumbers(str) {
    return /[0-9]/.test(str);
  };
function containsUppercase(str) {
    return /[A-Z]/.test(str);
  };
function containsLowercase(str) {
    return /[a-z]/.test(str);
  };
function isValidEmail(mail) 
{
  var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return(mail.value.match(mailformat));
}

function manageMail(mail) {
    var btMail = document.getElementById('cmail');
    // Controllo campo mail che non sia vuoto e valido
    if (isValidEmail(mail)) {
        btMail.disabled = false;
        document.getElementById("regEmail").setAttribute("style","background: rgb(76, 249, 73);");
    }
    else {
        btMail.disabled = true;
        document.getElementById("regEmail").setAttribute("style","background: rgb(253, 116, 116);");
        //rendere bordo input mail rosso
    }
  }
//function to generate and send the code to confirm the mail address
{
var vcode;
function generaCodiceConfermaMail()
{
  vcode=Math.floor(Math.random() * (99999999 - 10000000 + 1)) + 10000000;
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
  var code=document.getElementById("confcode").value;
  if(code==vcode){
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
    //get the form object
    var nickname = document.getElementById("regNickname").value;
    var email = document.getElementById("regEmail").value;
    var password = document.getElementById("regPassword").value;
    var cpassword = document.getElementById("regC_Password").value;
    var avatar = document.querySelector('input[type = radio]:checked').value;
    var zona = document.getElementById("zona").value;
    var privato = document.getElementById("switch").value; 
    var preferenze=[];
    var markedCheckbox = document.getElementsByName('pref');  
    for (var checkbox of markedCheckbox) {  
      if (checkbox.checked) 
      preferenze.push(checkbox.value);
    }  
    var piattaforme=[];
    var markedCheckbox = document.getElementsByName('piatt');  
    for (var checkbox of markedCheckbox) {  
      if (checkbox.checked) 
      preferenze.push(checkbox.value);
    }  
    
    document.getElementById("errors").innerHTML = "";
    var errors="";
    // console.log(email);
    if(nickname=="") errors+="nickname mancante; ";
    if(email=="") errors+="email mancante; ";
    if(password == "") errors+="la password è mancante; ";
        else{
        if(password!=cpassword) errors+="password e conferma password devono essere uguali; ";
        if(password.length<8) errors+="la password deve essere di almeno 8 caratteri; ";
        if(!containsUppercase(password)) errors+="la password deve contenere almeno un carattere maiuscolo; ";
        if(!containsLowercase(password)) errors+="la password deve contenere almeno un carattere minuscolo; ";
        if(!containsNumbers(password)) errors+="la password deve contenere almeno un numero; ";
    }
    if(preferenze.length == 0) errors+="devi selezionare almeno una preferenza; ";
    

    if(errors!=""){
        errors="errori presenti: "+errors;
        errors=String(errors);
        document.getElementById("errors").innerHTML = errors;
        return;
    }

    fetch('../api/v1/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( { nickname: nickname, email: email, password: password } ),
    })
    .then((resp) => resp.json()) // Transform the data into json
    .then(function(data) { // Here you get the data to modify as you please
        //console.log(data);
        registeredUser.email = data.email;
        registeredUser.id = data.id;
        registeredUser.self = data.self;
        // loggedUser.id = loggedUser.self.substring(loggedUser.self.lastIndexOf('/') + 1);
        alert(data.message);
        if(data.success){
          sendMails(email,"registrazionec", nickname);
        }
        return;
    })
    .catch( function (error) {
            alert(error.message);
            console.error(error);
            return;
        } ); // If there is any error you will catch them here
        
};


function sendMails(toMail, oggetto, txt)
{
  fetch('../api/v1/sendMails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ "reciever": toMail, "subject": oggetto, "text": txt}),
    })
}

function loadInfoUser(){
  // Viene usata in home_aut per mostrare le info dell'utente
  fetch('/api/v1/utenti/me')
  .then((resp) => resp.json()) // Transform the data into json
  .then(function(data) { // Here you get the data to modify as you please
      if(data.success == false){
          alert("Errore non sei autenticato!");
          location.href = "/";
      }
      else{
          var nickname = data.nickname;
          document.getElementById("nickname").textContent = nickname;
          document.body.removeAttribute("hidden");
      }
  })
  .catch( error => console.error(error) );
}

function logout(){
  // Funzione per eseguire il logout dell'utente (in pratica rimuove il token dai cookie)
  fetch('/api/v1/utenti/logout')
  .then((resp) => resp.json()) // Transform the data into json
  .then(function(data) { // Here you get the data to modify as you please
    alert(data.message);
    location.href = "/";
  })
  .catch( error => console.error(error) );
}
