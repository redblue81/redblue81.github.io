---
layout: post
title: "Installazione di Docker e Nginx Proxy Manager su Proxmox"
date: 2026-05-08 10:55:19 +0200
categories: [Virtualizzazione]
tags: [Proxmox, Docker, Portainer, Nginx Proxy Manager, LXC, Virtualizzazione Server, tutorial]
---

Oggi parliamo di installazione di **Docker** su Proxmox, ma non solo, vedremo anche come usare **Portainer** e **Nginx Proxy Manager**! Let's go!

Nel [precedente post](https://red-blue.it/domotica/2026/05/02/installare-home-assistant-os-su-proxmox.html){:target="_blank"} abbiamo visto la creazione di una VM per HA OS. La differenza tra una Virtual Machine e un Container è sostanziale: le VM emulano un intero sistema operativo, mentre i container condividono il kernel del sistema operativo host. Questo significa che i container sono molto più leggeri e efficienti in termini di risorse.

### Installazione di Docker e Portainer

Per semplificare l'installazione di Docker e Portainer, ho utilizzato uno script che ho trovato in giro per il web, da [Proxmox VE Scripts](https://community-scripts.org/scripts/docker){:target="_blank"}.

Basta copiare il comando e incollarlo nella shell del nostro server Proxmox. Lo script farà tutto il lavoro sporco per noi!

```
bash -c "$(curl -fsSL https://raw.githubusercontent.com/community-scripts/ProxmoxVE/main/ct/docker.sh)"
```

Una volta terminata l'installazione, possiamo accedere a Portainer tramite browser, digitando l'indirizzo IP del nostro server Proxmox seguito dalla porta 9443 (es. `https://indirizzo:9443`).

### Installazione di Nginx Proxy Manager

Nginx Proxy Manager è uno strumento fantastico per gestire i reverse proxy. Ci permette di esporre i nostri servizi in modo semplice e sicuro, gestendo certificati SSL e configurazioni complesse tramite un'interfaccia web intuitiva.

Anche in questo caso, ho utilizzato un altro script da [Proxmox VE Scripts](https://community-scripts.org/scripts/nginxproxymanager){:target="_blank"} per semplificare l'installazione.

Dopo aver incollato il comando nella shell:

```
bash -c "$(curl -fsSL https://raw.githubusercontent.com/community-scripts/ProxmoxVE/main/ct/nginxproxymanager.sh)"
```

Seguiamo le istruzioni a schermo. Una volta terminata l'installazione, possiamo accedere a Nginx Proxy Manager tramite browser, digitando l'indirizzo IP del nostro server Proxmox seguito dalla porta 81 (es. `http://indirizzo:81`).

Le credenziali di default sono `admin@example.com` e `changeme`. Ovviamente, vanno cambiate quanto prima!

Per la configurazione di Nginx Proxy Manager, la vedremo più avanti, dopo aver installato qualche altro servizio e avendo la necessità di esporre tutto su internet.

Stay tuned!