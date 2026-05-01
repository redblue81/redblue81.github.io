---
layout: post
title: "Installare Home Assistant OS su Proxmox"
date: 2026-05-02 09:19:27 +0200
categories: [Domotica]
tags: [Proxmox, Virtualizzazione, Open Source, Server, Home Assistant, tutorial]
---

Installare Home Assistant OS su Proxmox è davvero semplice. Questo breve tutorial è il seguito diretto del precedente post sull'[installazione di Proxmox](https://red-blue.it/domotica/2026/04/29/proxmox-la-mia-svolta-open-source-per-la-virtualizzazione.html){:target="_blank"}, vedremo come creare una VM con Home Assistant OS.

Per prima cosa, scarichiamo, direttamente all'interno della nostra Proxmox, l'immagine giusta da qui: [https://www.home-assistant.io/installation/alternative/](https://www.home-assistant.io/installation/alternative/){:target="_blank"}, scegliendo l'opzione **KVM/Proxmox**. In realtà, dal terminale di Proxmox, basta lanciare un:

```
wget https://github.com/home-assistant/operating-system/releases/download/17.2/haos_ova-17.2.qcow2.xz
```

E poi, dopo che il file è stato scaricato:

```
unxz haos_ova-17.2.qcow2.xz
```

Ovviamente, il nome del file è quello attualmente scaricabile (al momento della scrittura di questo tutorial), adattatelo al vostro caso.

Colleghiamoci alla Proxmox (normalmente `https://indirizzo:8006`), click destro, `Create VM`, inseriamo **nome** e **id** (va bene quello proposto di default), poi nella scheda `OS` selezioniamo `Do not use any media`.

Nella scheda `System`, invece:

```
Machine: q35
BIOS: OVMF
EFI Storege: local-lvm
Pre-Enroll Keys NO (togliere il check)
```

Eliminiamo il disco proposto nella scheda `Disks`, mentre nella scheda `CPU` scegliamo 2 cores, e nella scheda `Memory` indichiamo 4 GB di RAM (valore **4096**). Nella scheda `Network` lasciamo infine tutto com'è. Andiamo infine su `Confirm` e clicchiamo **Finish**, abbiamo la nostra VM!!

Ora viene il bello, in realtà il file che abbiamo scaricato prima non è altro che il **disco** che abbiamo eliminato in fase di creazione della VM, già pronto all'uso!

Quindi apriamo la **shell** della Proxmox (tasto dedicato in alto destra) e digitiamo:

```
qm importdisk <ID VM> <NOME FILE> <EFI>
```

Dove **ID VM** è l'id della VM appena creata, **NOME FILE** il nome del file scaricato, **EFI** è `local-lvm` nell'esempio fatto.

Abbiamo quasi terminato tranquilli!

Andiamo sulle impostazioni della VM (selezioniamo a sinistra), clicchiamo sulla scheda `Hardware`, andiamo su **Unused Disk 0** (il file importato con qm al passo precedente), clicchiamo **Edit** in alto, nella scheda che si apre selezioniamo **Discard** se abbiamo un disco fisico SSD, e clicchiamo `Add`, poi, nella scheda `Options` della VM, in **Boot order**, selezioniamo solo il disco appena aggiunto (di solito vanno deselezionati l'avvio da CD/DVD e da rete, e abilitato quello di Scsi0).

Finito! **Start** in alto a destra, e nella console della VM apparirà l'indirizzo a cui connettersi ad Home Assistant!!

Il prossimo passo sarà installare Docker su Proxmox!

Stay tuned!