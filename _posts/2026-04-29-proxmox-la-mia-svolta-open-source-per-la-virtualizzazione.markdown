---
layout: post
title: "Proxmox: La mia svolta Open Source per la virtualizzazione"
date: 2026-04-29 07:49:47 +0200
categories: [Domotica]
tags: [Proxmox, Virtualizzazione, Open Source, Server]
---

Quante volte mi sono trovato a corto di risorse sul mio serverino casalingo? Troppe! Avevo bisogno di far girare più servizi, testare nuove configurazioni, ma senza rischiare di mandare all'aria tutto il sistema. La virtualizzazione è stata la risposta, e Proxmox, beh, Proxmox è stata la svolta. Non avevo alcuna intenzione di acquistare soluzioni commerciali, quindi cercavo un'alternativa solida e, soprattutto, open source. E devo dire, non mi sono pentito della scelta.

## Proxmox: Un Mondo di Virtualizzazione Open Source

Proxmox Virtual Environment (VE) è una piattaforma di virtualizzazione open source basata su Debian. In parole povere, ti permette di creare e gestire macchine virtuali (VM) e container LXC su un singolo server fisico. Immagina di avere più computer, ognuno con il suo sistema operativo e le sue applicazioni, che girano tutti su un'unica macchina! Fantastico, no?

L'interfaccia web è intuitiva, anche per uno come me che non si definirebbe un guru dei server. Certo, all'inizio ho avuto qualche difficoltà, ma la community è super disponibile e la documentazione è ben fatta. E poi, diciamocelo, smanettare è parte del divertimento!

## Installazione di Proxmox: La Mia Avventura (con qualche intoppo)

L'installazione di Proxmox è abbastanza semplice, ma ci sono alcuni passaggi cruciali che, se sbagliati, possono farti perdere un sacco di tempo. Ci sono passato anch'io, fidati!

Ecco i passaggi che ho seguito:

1.  **Download dell'immagine ISO:** basta andare sul sito ufficiale di Proxmox e scaricare l'immagine ISO.
2.  **Creazione della chiavetta USB avviabile:** ho usato Rufus (un programmino gratuito) per creare una chiavetta USB avviabile con l'immagine ISO scaricata. 
3.  **Configurazione del BIOS:** prima di avviare l'installazione, sono entrato nel BIOS del mio server e ho attivato la virtualizzazione (VT-x/AMD-V). Senza questo, Proxmox non può funzionare correttamente.
4.  **Installazione vera e propria:** ho avviato il server dalla chiavetta USB e ho seguito le istruzioni a schermo. Semplice no?

Dopo aver impostato la password di root e l'indirizzo email (utile per le notifiche), sono passato alla configurazione della rete. Ho impostato un indirizzo IP statico per il mio server Proxmox, in modo da poterlo raggiungere sempre allo stesso indirizzo. Ho anche modificato il nome host in `pve-server01.miodominio.interno`.

L'installazione è andata a buon fine e, dopo il riavvio, ho potuto accedere all'interfaccia web di Proxmox tramite browser all'indirizzo `https://indirizzo_ip:8006`.

## Repository di Proxmox: Aggiornamenti Senza (Troppi) Compromessi

Una volta entrato nell'interfaccia web, la prima cosa che ho notato è stato un avviso riguardante la sottoscrizione Enterprise. Proxmox offre una versione gratuita e una a pagamento. La versione gratuita ha tutte le funzionalità di base, ma non ha accesso ai repository di aggiornamenti Enterprise, che contengono gli aggiornamenti più recenti e stabili.

Questo significa che, senza una sottoscrizione, potresti non essere in grado di scaricare gli ultimi aggiornamenti di sicurezza. 

Per fortuna, esiste una soluzione alternativa: utilizzare il repository "no-subscription". Questo repository contiene gli aggiornamenti di sicurezza e alcuni aggiornamenti minori. Non è l'ideale, ma è meglio di niente.

Per abilitare il repository "no-subscription", devi modificare il file `/etc/apt/sources.list.d/proxmox.list` e commentare (aggiungendo un `#` all'inizio della riga) i repository Enterprise e decommentare quelli no-subscription.

```
#deb https://enterprise.proxmox.com/debian/pve bookworm enterprise
deb http://download.proxmox.com/debian/pve bookworm pve-no-subscription

#deb https://enterprise.proxmox.com/debian/ceph-quincy bookworm enterprise
deb http://download.proxmox.com/debian/ceph-quincy bookworm no-subscription
```

Dopo aver modificato il file, devi aggiornare la lista dei pacchetti con il comando `apt update` e poi aggiornare il sistema con `apt upgrade`.

## Proxmox vs VMware: La Scelta Giusta per Me

Proxmox offre le stesse funzionalità di base di VMware, come la creazione e la gestione di macchine virtuali e container, la migrazione live, lo storage condiviso e il clustering. E, cosa ancora più importante, è open source! Questo significa che posso personalizzarlo, modificarlo e utilizzarlo come voglio, senza dovermi preoccupare di licenze o costi nascosti.

## Prossimi Passi: Virtualizzazione di Home Assistant e Container con Docker

Il mio prossimo obiettivo è quello di creare una macchina virtuale con Home Assistant e un paio di container con Docker per NextCloud e qualche progettino personale, e uno per Nginx Proxy Manager. Stay tuned per i prossimi articoli!

Alla prossima!
