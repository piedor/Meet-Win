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
    var email = document.getElementById("loginEmail").value;
    var password = document.getElementById("loginPassword").value;
    // console.log(email);

    fetch('../api/v1/authentications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( { email: email, password: password } ),
    })
    .then((resp) => resp.json()) // Transform the data into json
    .then(function(data) { // Here you get the data to modify as you please
        //console.log(data);
        loggedUser.token = data.token;
        loggedUser.email = data.email;
        loggedUser.id = data.id;
        loggedUser.self = data.self;
        // loggedUser.id = loggedUser.self.substring(loggedUser.self.lastIndexOf('/') + 1);
        document.getElementById("loggedUser").textContent = loggedUser.email;
        return;
    })
    .catch( error => console.error(error) ); // If there is any error you will catch them here

};

function containsNumbers(str) {
    return /[0-9]/.test(str);
  }
function containsUppercase(str) {
    return /[A-Z]/.test(str);
  }
function containsLowercase(str) {
    return /[a-z]/.test(str);
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
    var errors=null;
    // console.log(email);
    if(nickname=="") error+="nickname mancante; ";
    if(email=="") error+="email mancante; ";
    if(password == "") error+="la password è mancante; ";
        else{
        if(password!=cpassword) error+="password e conferma password devono essere uguali; ";
        if(password.length<8) error+="la password deve essere di almeno 8 caratteri; ";
        if(!containsUppercase(password)) error+="la password deve contenere almeno un carattere maiuscolo; ";
        if(!containsLowercase(password)) error+="la password deve contenere almeno un carattere minuscolo; ";
        if(!containsNumber(password)) error+="la password deve contenere almeno un numero; ";
    }
    if(preferenze==NULL) error+="devi selezionare almeno una preferenza; ";
    

    if(errors!=null){
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
        return;
    })
    .catch( function (error) {
            alert(error.message);
            console.error(error);
            return;
        } ); // If there is any error you will catch them here

};