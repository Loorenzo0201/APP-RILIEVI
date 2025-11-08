# APP Rilievi Serramenti

Questa repository contiene il progetto della web app dedicata ai rilievi di serramenti. L’obiettivo è permettere a un tecnico di:

* scattare o caricare una foto del serramento;
* aggiungere misurazioni direttamente sull’immagine con linee e testi ordinati;
* scrivere note (e in futuro allegare note vocali registrate);
* esportare il rilievo in un file `.json` da archiviare o condividere.

La guida seguente è stata pensata per un Chromebook con supporto Linux (container *Penguin*), GitHub e Visual Studio Code.

---

## 1. Preparazione dell’ambiente su Chromebook

1. **Aggiorna il container Linux**  
   ```bash
   sudo apt update && sudo apt upgrade
   ```
   Aggiorni l’elenco dei pacchetti e installi le versioni più recenti del software di base.

2. **Installa Git**  
   ```bash
   sudo apt install git
   ```
   Git è lo strumento che userai per scaricare e caricare il codice su GitHub.

3. **Installa Node.js e npm** (servono per eseguire la web app).  
   Opzione rapida:
   ```bash
   sudo apt install nodejs npm
   ```
   Oppure, per una versione più aggiornata, usa **nvm** (Node Version Manager):
   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
   source ~/.bashrc
   nvm install --lts
   ```
   In questo modo installi l’ultima versione stabile di Node.js.

4. **Installa Visual Studio Code**  
   Scarica il pacchetto `.deb` da <https://code.visualstudio.com> e installalo così:
   ```bash
   sudo apt install ./code_*.deb
   ```
   VS Code sarà l’editor grafico dove puoi modificare i file con l’aiuto di GitHub Copilot.

---

## 2. Collegamento Git ↔ GitHub ↔ VS Code ↔ Copilot

1. **Configura Git con le tue credenziali**  
   ```bash
   git config --global user.name "Il tuo nome"
   git config --global user.email "la_tua_email@esempio.com"
   ```
   Definisci l’identità che apparirà nella cronologia dei commit.

2. **Genera una chiave SSH e collegala a GitHub**  
   ```bash
   ssh-keygen -t ed25519 -C "la_tua_email@esempio.com"
   cat ~/.ssh/id_ed25519.pub
   ```
   Copia il contenuto del file e incollalo nella pagina GitHub → *Settings* → *SSH and GPG keys*. In questo modo potrai collegarti a GitHub senza inserire la password ogni volta.

3. **Clona il repository**  
   Nel terminale Penguin scegli una cartella di lavoro e scarica il progetto:
   ```bash
   git clone git@github.com:<TUO-ACCOUNT>/APP-RILIEVI.git
   cd APP-RILIEVI
   ```
   Ora hai una copia locale del codice.

4. **Apri la cartella in VS Code**  
   ```bash
   code .
   ```
   Il comando apre il progetto nell’editor.

5. **Attiva GitHub Copilot (Codex) in VS Code**  
   * Installa l’estensione “GitHub Copilot” dallo *store* di VS Code.
   * Effettua il login con il tuo account GitHub.
   * Apri un file `.jsx` e verifica che Copilot suggerisca codice mentre scrivi.

6. **Verifica la sezione *Source Control* di VS Code**  
   Qui potrai vedere i file modificati, creare commit e sincronizzare con GitHub premendo su “Sync Changes”.

---

## 3. Avvio del progetto frontend

Il codice della web app si trova nella cartella `frontend/`. È stato creato seguendo la struttura di Vite + React.

1. Installa le dipendenze (serve la connessione a Internet):
   ```bash
   cd frontend
   npm install
   ```
   Questo comando legge `package.json` e scarica i pacchetti necessari (React, Vite, plugin, …).

2. Avvia l’ambiente di sviluppo:
   ```bash
   npm run dev
   ```
   Viene avviato un server locale (porta predefinita 5173). Apri il browser del Chromebook all’indirizzo suggerito (es. `http://localhost:5173`) per provare l’applicazione.

3. Blocca il terminale con `Ctrl+C` quando vuoi fermare il server di sviluppo.

---

## 4. Funzionalità disponibili nell’interfaccia

La pagina principale è strutturata in tre pannelli:

1. **Acquisizione foto**  
   * Pulsante “Avvia fotocamera”: chiede al browser l’accesso alla webcam e avvia l’anteprima video.
   * Pulsante “Scatta foto”: cattura un fotogramma e lo mostra nella pagina.

2. **Misurazioni sulla foto**  
   * Clicca due volte sulla foto per tracciare una linea di misura (primo click = punto di partenza, secondo click = punto di arrivo).
   * Dopo il secondo click vengono richiesti nome e valore della misura: il testo viene mostrato vicino alla linea.
   * Il pulsante “Svuota misurazioni” elimina tutte le linee disegnate.

3. **Note vocali e testuali**  
   * Un’area di testo per annotare dettagli del rilievo.
   * Pulsante “Esporta rilievo (.json)” per scaricare un file JSON con l’immagine, le misure e le note. Puoi conservare questo file o inviarlo via e-mail.

> **Nota:** la gestione delle note vocali è prevista come miglioramento successivo. Attualmente puoi scrivere manualmente il testo o allegare file audio esterni.

---

## 5. Suggerimenti per lo sviluppo futuro

* **Note vocali integrate:** sfruttare le API `MediaRecorder` per catturare audio e salvarlo accanto al rilievo.
* **Trascrizione automatica:** inviare l’audio a un servizio di speech-to-text (es. Whisper API di OpenAI) e salvare il testo ottenuto.
* **Gestione multi-utente:** generare link univoci con token per consentire l’accesso solo alle persone autorizzate.
* **Esportazione avanzata:** creare un PDF con l’immagine annotata e la tabella delle misure.
* **Sincronizzazione cloud:** salvare rilievi e allegati su un database (es. Firebase, Supabase, MongoDB Atlas).

---

## 6. Flusso di lavoro con Git

1. Controlla sempre lo stato dei file:
   ```bash
   git status
   ```

2. Quando hai modifiche pronte, aggiungile al prossimo commit:
   ```bash
   git add <file>
   ```

3. Crea un commit con un messaggio chiaro:
   ```bash
   git commit -m "Descrizione breve e chiara"
   ```

4. Invia le modifiche su GitHub:
   ```bash
   git push
   ```

5. Se lavori su nuove funzionalità crea un branch dedicato:
   ```bash
   git checkout -b feature/nome-funzionalita
   ```
   Questo ti permette di lavorare separatamente e aprire una Pull Request quando sei pronto.

---

## 7. Struttura della cartella `frontend`

```
frontend/
├── index.html          # Punto di ingresso HTML
├── package.json        # Elenco dipendenze e script npm
├── src/
│   ├── App.jsx         # Interfaccia principale della web app
│   ├── main.jsx        # Inizializzazione di React
│   └── styles.css      # Stili dell’interfaccia
└── vite.config.js      # Configurazione Vite (porta, plugin React, ecc.)
```

Ogni file contiene commenti chiari e codice pulito per facilitare evoluzioni future.

---

## 8. FAQ rapide

* **Il comando `npm install` fallisce?**  
  Controlla la connessione a Internet e assicurati di non avere proxy bloccanti. In ambienti aziendali potrebbe essere necessario configurare `npm config set proxy`.

* **La fotocamera non parte?**  
  Verifica che il browser abbia i permessi per accedere alla webcam. Su Chromebook, controlla le impostazioni di Chrome alla voce “Privacy e sicurezza → Impostazioni sito → Fotocamera”.

* **Come condivido il link della web app?**  
  Quando distribuisci l’app, puoi ospitarla su un servizio (es. Vercel, Netlify) e proteggere l’URL con token o password. Nel frattempo, durante lo sviluppo, il link locale è visibile solo sul tuo dispositivo.

---

Prendi il tempo necessario per seguire gli step uno alla volta. Se vuoi implementare nuove funzioni, crea prima un branch dedicato, lavora con calma e aggiorna questa guida quando aggiungi novità importanti.
