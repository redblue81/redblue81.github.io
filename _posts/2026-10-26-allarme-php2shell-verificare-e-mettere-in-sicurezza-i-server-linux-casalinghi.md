---
layout: post
title: "Allarme php2shell: verificare e mettere in sicurezza i server Linux casalinghi"
slug: "allarme-php2shell-verificare-e-mettere-in-sicurezza-i-server-linux-casalinghi"
date: "2026-10-26 09:22:32 +0100"
categories: ["Linux"]
tags: ["ubuntu", "php", "sicurezza", "homelab", "sysadmin"]
---

Se gestite anche solo un piccolo mini-PC in salotto, una VPS o un container Linux su cui gira uno stack web classico (LAMP, LEMP o ambienti con PHP-FPM e Apache), ci sono momenti in cui bisogna fermare qualsiasi cosa si stia facendo e aprire un terminale SSH al volo. Questo è esattamente uno di quei momenti.

Nelle scorse ore è scattato un allarme di sicurezza globale per via di due vulnerabilità ([link](https://cert-agid.gov.it/news/due-vulnerabilita-critiche-in-php-consentono-lesecuzione-di-codice-da-remoto-rilasciati-aggiornamenti-di-sicurezza/)) critiche scoperte nel motore PHP, ribattezzate pubblicamente con il nome piuttosto eloquente di **php2shell**. Parliamo di falle che permettono a chiunque si trovi su una rete raggiungibile di eseguire codice da remoto (RCE) senza alcuna autenticazione. Come se non bastasse, nello stesso giro di aggiornamenti Canonical e il mondo Linux hanno dovuto metter mano ai certificati radice per via di una compromissione delle chiavi dell'autorità eMudhra.

Devo ammettere che quando leggo un punteggio di gravità CVSS 4.0 pari a **9.2 su 10**, un brivido lungo la schiena lo sento sempre. Vediamo con calma cosa sta succedendo sotto il cofano, perché il problema non riguarda i singoli applicativi ma l'interprete stesso, e soprattutto come verificare ed eseguire le patch sui nostri server Ubuntu senza rischiare di rompere mezzo homelab.

---

### Cos'è php2shell e perché fa tanta paura

Il nome collettivo *php2shell* raggruppa due distinte vulnerabilità scoperte nel core di PHP: **CVE-2026-109618** e **CVE-2026-109619**. 

Spesso siamo abituati a leggere di falle nei plugin di WordPress, in componenti di terze parti o in temi poco curati. In questo caso, però, la faccenda è molto più seria: il bug risiede direttamente nella gestione della memoria interna e nella gestione degli errori di runtime del linguaggio.
- La prima vulnerabilità (**CVE-2026-109618**) riguarda il modo in cui PHP gestisce le condizioni di esaurimento della memoria (Out Of Memory - OOM). Quando il processo tocca il limite di allocazione, l'interruzione imprevista può causare una corruzione della memoria sfruttabile per ottenere l'esecuzione di codice.
- La seconda (**CVE-2026-109619**) è legata a uno stato globale orfano ("stale state"), ovvero a riferimenti interni che rimangono attivi anche dopo che la memoria associata è stata liberata, venendo poi riutilizzati pericolosamente nella richiesta successiva.

Cosa significa questo in soldoni per chi gestisce un server? Significa che un malintenzionato che riesce a raggiungere via rete una qualsiasi applicazione PHP (da WordPress a Drupal, da Joomla a un semplice script custom) può inviare richieste studiate per innescare queste condizioni di corruzione ed eseguire comandi arbitrari con i permessi dell'utente del web server (solitamente `www-data`), senza possedere alcun account o credenziale di accesso.

Il rischio è particolarmente accentuato su installazioni che usano **Apache con mod_php**, dove l'attacco può attivarsi persino prima che il codice della nostra applicazione venga completamente interpretato, ma colpisce in generale tutti i runtime principali: PHP-FPM, php-cgi, LiteSpeed e persino FrankenPHP.

Un dettaglio tecnico davvero affascinante emerso dai bollettini è che nella scoperta e nella validazione di queste falle hanno giocato un ruolo chiave modelli di intelligenza artificiale avanzata (come GPT-5.6 Sol e Gemini 4 Argon) guidati dai ricercatori di sicurezza di Calif, OpenAI e Wiz. Gli strumenti di analisi assistita hanno consentito di concatenare errori di memoria complessi e realizzare Proof of Concept funzionanti in una frazione del tempo che avrebbe richiesto un'analisi manuale. Una conferma del fatto che la sicurezza difensiva deve muoversi a una velocità sempre più serrata.

---

### E il problema dei certificati eMudhra?

Nel medesimo bollettino di aggiornamento per Ubuntu è stata inclusa anche una correzione per il pacchetto `ca-certificates`. È successo che le chiavi di sicurezza dell'autorità di certificazione eMudhra hanno subito una compromissione, aprendo la strada al rischio teorico che malintenzionati possano forgiare certificati digitali contraffatti spacciandosi per server legittimi.

Mentre i browser web moderni (come Firefox, Chrome o Safari) gestiscono i propri elenchi di revoca interni, a livello di sistema operativo strumenti a riga di comando che usiamo quotidianamente come `curl` e `wget` dipendono strettamente dal trust store fornito dal pacchetto `ca-certificates`. Aggiornandolo, Ubuntu rimuove i due certificati radice revocati, proteggendo gli script e i download da attacchi di impersonificazione.

---

### Passo 1: Come verificare se il nostro server è a rischio

Passiamo alla parte pratica. La prima domanda da farsi è: *il mio server sta usando PHP, e se sì, quale versione?*

Se utilizzate Ubuntu Desktop e non avete installato uno stack di sviluppo locale, probabilmente PHP non è presente (anche se `ca-certificates` è quasi certamente installato e va aggiornato). Se invece operate su Ubuntu Server o su un container, apriamo una sessione SSH.

Per interrogare APT e scoprire rapidamente quali pacchetti dell'interprete PHP risultano effettivamente installati sul sistema, Canonical suggerisce questo comando preciso basato sui pattern di ricerca di APT:

```bash
apt list '?installed?name(^php[0-9.]+$)'
```

Se il comando restituisce output (come ad esempio `php8.2` o `php8.3`), significa che il server ha installato il runtime di PHP.

A livello ufficiale del progetto PHP upstream, le versioni corrette prive della vulnerabilità sono:
- **PHP 8.5.12**
- **PHP 8.4.27**
- **PHP 8.3.36**
- **PHP 8.2.35**

Tuttavia, c'è un punto fondamentale da tenere a mente per chi usa distribuzioni come Ubuntu o Debian: Canonical applica il principio del **backporting**. Questo significa che la versione del pacchetto indicata dal sistema potrebbe non coincidere con la numerazione upstream, ma includere comunque le patch di sicurezza rilasciate per quella specifica release di Ubuntu (dalla recentissima 26.10 a ritroso fino alle LTS storiche, per cui le versioni 14.04, 16.04 e 18.04 ricevono le patch tramite i repository ESM di Ubuntu Pro).

---

### Passo 2: Applicare gli aggiornamenti di sicurezza

La strada maestra consigliata su qualsiasi macchina è quella di sincronizzare i repository ed eseguire un aggiornamento globale di tutti i pacchetti pendenti:

```bash
sudo apt update && sudo apt upgrade
```

Ci sono però situazioni, e ci sono passato anch'io parecchie volte nell'homelab, in cui lanciare un `apt upgrade` completo a metà giornata può mettere un po' d'ansia per paura che si aggiornino librerie collaterali non testate. 

Se volete mirare con precisione chirurgica **esclusivamente** ai pacchetti PHP senza toccare il resto del sistema, potete sfruttare la direttiva `--only-upgrade` associata al pattern di APT:

```bash
sudo apt update && sudo apt install --only-upgrade '?name(^php[0-9.]+$)'
```

Subito dopo, assicuriamoci di aggiornare anche il pacchetto dei certificati per risolvere il fronte eMudhra:

```bash
sudo apt install --only-upgrade ca-certificates
```

---

### Passo 3: Il passaggio cruciale che non bisogna dimenticare

C'è un tranello comune in cui cadono molti appassionati: pensare che una volta completato il comando `apt upgrade` il server sia automaticamente al sicuro. Purtroppo non è così.

I processi PHP caricati in memoria (come il pool di PHP-FPM o i worker di Apache) continuano a eseguire il vecchio binario presente nella RAM finché il servizio non viene esplicitamente riavviato. Perfino se sul vostro server è attivo il servizio automatico `unattended-upgrades`, la patch potrebbe essere stata scaricata e installata in background, ma i demoni web continueranno a essere vulnerabili finché non ricaricano i file aggiornati.

A seconda del vostro setup, dovete riavviare manualmente il server web o il demone PHP.

Se utilizzate Apache con `mod_php`:
```bash
sudo systemctl restart apache2
```

Se utilizzate Nginx con PHP-FPM (sostituendo la versione con quella in uso, ad esempio 8.2 o 8.3):
```bash
sudo systemctl restart php8.2-fpm
```
*(oppure `sudo systemctl restart php8.3-fpm` a seconda del pacchetto presente).*

Se avete la possibilità di sopportare un minuto di indisponibilità dei servizi sul vostro server domestico, la scelta più pulita e sicura per togliersi ogni dubbio ed essere certi che nessun processo residuo rimanga in memoria è un riavvio completo:

```bash
sudo reboot
```

---

### Due riflessioni sull'homelab

La comparsa di vulnerabilità RCE non autenticate con score 9.2 come php2shell è un promemoria prezioso per tutti noi che amiamo ospitare servizi in casa. Cloudflare ha già segnalato i primi tentativi di scansione ed exploit automatici su vasta scala: i bot che scandagliano gli IP pubblici non aspettano che finiamo la nostra pausa caffè.

Stay tuned..
