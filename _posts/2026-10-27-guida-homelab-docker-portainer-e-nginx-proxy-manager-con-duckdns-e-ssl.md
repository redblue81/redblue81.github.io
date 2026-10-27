---
layout: post
title: "Guida Homelab: Docker, Portainer e Nginx Proxy Manager con DuckDNS e SSL"
slug: "guida-homelab-docker-portainer-e-nginx-proxy-manager-con-duckdns-e-ssl"
date: "2026-10-27 22:53:17 +0100"
categories: ["Homelab"]
tags: ["Docker", "Portainer", "Nginx Proxy Manager", "DuckDNS", "Reverse Proxy"]
---

In un precedente [post](https://red-blue.it/virtualizzazione/2026/05/08/installazione-di-docker-e-mginx-proxy-manager-su-proxmox.html) eravamo arrivati all'installazione di Nginx Proxy Manager sulla nostra Proxmox.

In questo articolo voglio accompagnarvi passo dopo passo nella configurazione di **Nginx Proxy Manager**, il tutto affiancato ai certificati SSL gratuiti di **Let's Encrypt**. 

Abbiamo i nostri container attivi, ma come li esponiamo all'esterno senza aprire una porta diversa sul router per ogni servizio? La risposta è semplice: usiamo un **Reverse Proxy**.

Un reverse proxy si posiziona tra i client esterni (il nostro smartphone o il portatile fuori casa) e i servizi interni del server. Invece di collegarsi direttamente ad esempio a Nextcloud o ad altre dashboard, tutte le richieste in ingresso colpiscono prima il reverse proxy. Sarà lui a verificare il nome a dominio richiesto, negoziare la cifratura HTTPS e inoltrare il traffico al container corretto nella rete locale.

Tra tutte le soluzioni disponibili, **Nginx Proxy Manager (NPM)** è senza dubbio la più comoda e intuitiva grazie alla sua interfaccia web pulita.

### Superare l'ostacolo dell'IP dinamico con DuckDNS

La maggior parte delle connessioni internet residenziali non dispone di un indirizzo IP pubblico statico: il nostro provider internet (ISP) rinnova e modifica periodicamente l'indirizzo assegnato al modem/router. Se il nostro IP cambia mentre siamo fuori casa, perdiamo immediatamente l'accesso al server.

Per ovviare a questo problema ci affidiamo a un servizio di **Dynamic DNS (DDNS)**. **DuckDNS** è una soluzione gratuita, leggera e affidabile. Registrandoci sul [sito di DuckDNS](https://www.duckdns.org/), possiamo creare un sottodominio gratuito (del tipo `miodominio.duckdns.org`) e collegarlo al nostro attuale indirizzo IP pubblico.

Possiamo mantenere aggiornato l'indirizzo IP configurando uno script automatico o installando un piccolo container dedicato su Docker: ogni volta che l'operatore telefonico cambierà il nostro IP pubblico, DuckDNS punterà in tempo reale alle nuove coordinate.

### Port Forwarding e Certificati SSL con Let's Encrypt

Ora tutti i tasselli del puzzle iniziano a combaciare. Per permettere al traffico internet di raggiungere Nginx Proxy Manager, dobbiamo configurare il nostro router di casa eseguendo l'operazione di **Port Forwarding** (inoltro delle porte):

* **Porta 80 (HTTP)**: va indirizzata verso la porta 80 dell'IP del nostro server.
* **Porta 443 (HTTPS)**: va indirizzata verso la porta 443 dell'IP del nostro server.

Tutto il traffico web cifrato e non cifrato convergerà unicamente sul nostro proxy. Non dovrete aprire altre porte verso i singoli servizi interni!

### Generazione del certificato SSL su Nginx Proxy Manager

Con le porte 80 e 443 aperte e il dominio DuckDNS che punta al nostro IP, possiamo finalmente blindare la connessione con un certificato SSL emesso gratuitamente da **Let's Encrypt**:

1. Accedete all'interfaccia di Nginx Proxy Manager.
2. Spostatevi su **Hosts** > **Proxy Hosts** e cliccate su **Add Proxy Host**.
3. Inserite il vostro dominio DuckDNS (es. `miodominio.duckdns.org`).
4. Selezionate il protocollo di destinazione (`http` o `https`), inserite l'indirizzo IP locale del servizio che volete raggiungere (come il vostro server Nextcloud) e la rispettiva porta interna.
5. Spostatevi nella scheda **SSL**, selezionate **Request a new SSL Certificate**, abilitate l'opzione **Block Common Exploits** e **Force SSL**, accettate i termini del servizio Let's Encrypt e salvate.

Nginx Proxy Manager effettuerà la verifica con Let's Encrypt e configurerà automaticamente la cifratura HTTPS. Da questo momento in poi, digitando il vostro dominio DuckDNS nel browser, vedrete comparire il rassicurante lucchetto verde: la connessione sarà sicura, cifrata da capo a fondo e raggiungibile da qualsiasi parte del mondo.

### Conclusioni

Mettere in piedi questa architettura richiede un po' di pazienza iniziale, ma una volta terminata la configurazione avrete un'infrastruttura modulare, scalabile e soprattutto sicura. Ogni volta che vorrete aggiungere un nuovo servizio al vostro homelab, vi basterà avviarlo in Docker, creare un record su DuckDNS e collegarlo in trenta secondi all'interno di Nginx Proxy Manager.

Stay tuned..
