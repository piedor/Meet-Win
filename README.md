# Meet&Win
![Logo](/static/images/LOGO.png)
## Sommario
- [Descrizione](#descrizione)
- [Struttura del progetto](#struttura-del-progetto)
- [Apiary](#apiary)
- [Membri](#membri)
## Descrizione
Questo progetto è stato creato per mettere in campo tutte le nozioni acquisite durante il corso di ingegneria del software attraverso una metodologia Agile.
Il progetto ha come obiettivo lo sviluppo di una WebApp che dia la possibilità agli utenti di organizzare e partecipare a tornei riguardanti diversi sport, e-sports e giochi da tavolo. L’applicazione poi permetterà agli utenti di ricercarne altri, di formare communities e di avere una lista amici per agevolare la formazione di squadre, suggerendo per primi i risultati più rilevanti in base alle preferenze inserite e alla classifica dei feedback.
Al termine di ogni partita e torneo ogni utente potrà valutare attraverso un “form di feedback” i singoli giocatori e la qualità dei tornei a cui ha partecipato, così da creare un classifica delle utenze in base alla media dei voti.
## Struttura del progetto
La repository è organizzata secondo questo albero:
.
├── **app**
│   ├── app.js
│   ├── authentication.js
│   ├── communities.js
│   ├── mailInterface.js
│   ├── **models**
│   ├── modifyProfile.js
│   ├── registration.js
│   ├── tokenChecker.js
│   ├── tornei.js
│   ├── utenti.js
│   └── visualizzaInfoUtente.js
├── .env
├── **.git**
├── .gitignore
├── index.js
├── **node_modules**
├── .node-version
├── package.json
├── package-lock.json
├── README.md
└── **static**
	├── cercaTorneo.html
	├── cercaUtenti.html
	├── creaTorneo.html
	├── home_aut.html
	├── **images**
	├── index.html
	├── modificaProfilo.html
	├── registrazione.html
	├── script.js
	├── visualizzaProfilo.html
	├── visualizzaSchedaTorneo.html
	└── visualizzaSchedaUtente.html
Nella cartella principale si trova il file “index.js” il quale si occupa di inizializzare l’app connettendosi a mongodb e avviando il gestore del servizio “app.js”. Inoltre è presente un file nascosto .env che contiene password e dati non condivisi pubblicamente.
Successivamente abbiamo suddiviso in 2 macro cartelle le repository: app, per gestire separatamente il codice necessario alla comunicazione con database e eventuali API, e static, per gestire le schermate Web. Nella cartella app è presente il file “app.js”, sopra citato, la cartella models, contenente gli schemi del database e tutti i file .js divisi per funzionalità. Nella cartella static ci sono invece tutti i file html e il file “script.js” necessario per interagire con le API.
## Apiary 
[meetwin.docs.apiary.io](https://meetwin.docs.apiary.io)
## Membri
- [Nicholas Menin](https://github.com/NicholasMenin)
- [Tommaso Guidolin](https://github.com/tmaog)
- [Pietro Dorighi](https://github.com/piedor)
