---
layout: post
title: Notifica automatica se un dispositivo va offline
background: '/assets/images/smart-home-3096219_1920-768x512.jpg'
author: RedBlue
categories: 
- guide
- domotica
- raspberrypi
---

Come fare a sapere se un dispositivo va **offline**? Può essere un server domestico, ad esempio per la domotica, oppure può essere usato come "alert" del fatto che manca la corrente in casa, in generale può essere utile ricevere una notifica se un dispositi va offline.

Sto per partire per le vacanze, e recentemente mi sta succedendo che, a causa di una situazione un po' "instabile" nella mia zona, il salvavita in casa scatta più del dovuto. Chiaramente, in caso questo succeda mentre siamo via, può diventare un problema, quindi mi serve qualcosa che mi avvisi, in modo che io possa a mia volta avvisare qualcuno di andare a controllare.

Ho pensato quindi di ricevere una notifica se il mio piccolo server domotico (un Raspberry Pi sul quale gira Home Assistant) va offline e ci resta per almeno 15 minuti.

Per realizzare questo piccolissimo progetto, si può usare un servizio esterno, come ad esempio [healthchecks.io](https://healthchecks.io/){:target="_blank"}.

Usarlo è semplicissimo, basta registrarsi e si avrà accesso al piano gratuito (hobbyist), più che sufficiente per i miei scopi:

![healthcheck.io pricing](/assets/images/healthchecks_pricing.png){:style="display:block; width: 100%; margin-left:auto; margin-right:auto"}

A questo punto, basta creare un **check** e configurarlo a seconda delle nostre necessità, il **period** rappresenta ogni quanto il servizio si aspetta un ping, il **grace** è il limite oltre il quale avremo la notifica del **DOWN**. Una volta configurato avremo un link, il servizio usa quel link come check appunto. Quindi basterà che il nostro dispositivo esegua periodicamente una richiesta a quel link, e se tale richiesta fallisce, dopo il periodo di grace avremo la notifica.

La notifica di default è via mail, io ho attivato anche l'integrazione con Telegram, ma di integrazioni ce ne sono davvero un'infinita, con praticamente qualsiasi applicazione.

A questo punto, come dicevo sopra, il mio dispositivo è un Raspberry con installato Home Assistant, quindi basta configurare un **restful_service** che fa il ping sul link del mio check.

Un restful_service va aggiunto direttamente sul **configurations.yaml**, in questo modo:
{% highlight python %}
rest_command:
  raspberry_pi_online:
    url: *link_healthchecks*
    method: GET
{% endhighlight %}

Poi basta creare un'**automazione** che chiama quel servizio ad esempio ogni 5 minuti, e il gioco è fatto!

Una piccola nota a margine, mi rendo conto che questo "sistema" non è certo una soluzione al problema di casa mia (in teoria, potrebbe andare offline il Raspberry senza che la corrente sia andata via tra l'altro), ho già chiamato l'elettricista per quanto rientro (adesso davvero non c'è tempo), così come un salvavita con riarmo automatico potrebbe essere più utile, visto che riattiverebbe tutto automaticamente, ma anche per questo ci vuole l'elettricista e, ripeto, non c'è il tempo adesso.

Alla prossima..