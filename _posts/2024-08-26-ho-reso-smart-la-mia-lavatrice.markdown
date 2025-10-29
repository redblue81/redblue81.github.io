---
layout: post
title: Ho reso smart la mia lavatrice!
background: '/assets/images/smart-home-3096219_1920-768x512.jpg'
author: RedBlue
categories: 
- guide
- domotica
- sonoff
---

Qualche tempo fa mia moglie mi ha chiesto un modo per sapere quando la lavatrice termina il lavaggio. Viviamo in una casa a più piani, e spesso non siamo nei pressi della lavatrice quando termina il lavaggio, ed ecco che dimenticarsi del tutto del bucato da stendere era diventato una problema.

Escludendo la possibilità di acquistare una modernissima lavatrice nuova, ho cercato in rete qualche progetto che fosse utile al mio scopo, ma non mi andava (e non so nemmeno se sarei stato capace) di saldare/modificare nulla sulla scheda madre, perciò ho cercato una soluzione software.

L'accoppiata **Sonoff POW Origin + Home Assistant** ha risolto tutto.

Il [Sonoff POW Origin](https://amzn.to/49q2ORk){:target="_blank"} è una classico switch domotico, un dispositivo capace cioè di funzionare come un interruttore, ma pilotabile da smartphone (mediante app), integrabile con gli assistenti vocali, ma soprattutto capace di misurare i **consumi** del carico elettrico a cui è collegato.

Ed ecco l'idea.. Se posso monitorare i consumi della mia lavatrice, posso capire quando è **attiva** (cioè quando il lavaggio è in corso), e di conseguenza anche quando il lavaggio **termina** (se prima ha un certo consumo e poi va a zero, vuol dire che ha terminato).

Detto fatto, ho acquistato un **POW Origin**, l'ho collegato a due spezzoni di cavo elettrico della giusta sezione per un carico come una lavatrice (il classico 3x2,5mm va benissimo). Il collegamento del dispositivo è assolutamente semplice, di fatto vanno collegati il *neutro* (di solito un cavo di colore blu) e la *fase* (un cavo di colore solitamente nero o marrone) provenienti dalla linea di casa, rispettivamente su uno dei due morsetti contrassegnati con N (sono in parallelo, quindi è indifferente su quali dei due lo collegate) e su Lin (fase in ingresso); nel mio caso, ho collegato uno spezzone di cavo come indicato e poi all'altro estremo ho messo una spina che andrà in una comune presa elettrica (ho usato una cosiddetta Schuko), mentre l'altro spezzone di cavo, quello che andrà al carico (la lavatrice), va collegato allo stesso modo, ma con la fase su Lout (fase in uscita), ovviamente poi ho completato il mio cavo con una spina femmina (da collegare nel mio caso alla lavatrice).

A questo punto, basta configurare il dispositivo nell'app **eWelink** e siamo già in grado di dare/togliere corrente alla lavatrice, e soprattutto misurarne il consumo.

Benissimo.. Ma la notifica di fine lavaggio? La logica è chiara e non è nulla di speciale, per realizzarla ho utilizzato il [mini server domotico](https://red-blue.it/guide/linux/in%20evidenza/raspberry%20pi/domotica/2021/05/26/realizzare-il-proprio-sistema-domotico-introduzione.html){:target="_blank"} che ho in casa (utilizzato molto meno di quanto avessi previsto in origine, devo ammetterlo), il quale può tranquillamente interfacciarsi tanto con i dispositivi di casa Sonoff, quanto con i più comuni assistenti vocali (nel mio caso Amazon Alexa). Avevo iniziato a buttar giù qualcosa, quando mi sono imbattutto in [questo post](https://www.vincenzocaputo.com/guide/la-lavatrice-ha-finito-con-home-assistant-te-lo-facciamo-notificare-174){:target="_blank"} sul blog di Vincenzo Caputo che praticamente mi ha risolto il problema al volo! Davvero **fantastico**, non posso fare altro che ringraziarli! 

Quindi, esattamente come suggerito, cominciamo con l'indicare al sistema che deve considerare i **packages** all'interno dell'apposita directory (se non esiste, createla nello stesso percorso del file configuration.yaml):

{% highlight bash %}
homeassistant:
  packages: !include_dir_named packages
{% endhighlight %}

E all'interno della suddetta directory, va inserito il seguente script, che personalmente ho battezzato *washingmachineintegration.yaml*:

{% highlight bash %}
######################################################
####################AUTOMATION########################
######################################################
automation:
- id: lavatrice_on
  alias: lavatrice on
  trigger:
  -  entity_id: sensor.lavatrice_power
     platform: numeric_state
     above: '50.0'
     for:
       minutes: 1
  action:
  - service: input_boolean.turn_on
    entity_id: input_boolean.lavatrice_switch 

- id: lavatrice_fine_switch_state
  alias: Lavatrice fine switch state
  trigger: 
  - entity_id: sensor.lavatrice_power
    platform: numeric_state
    below: '5.0'
    for:
      minutes: 1
  condition:
  - condition: state
    entity_id: 'input_boolean.lavatrice_switch'
    state: 'on'
  action:
  - service: input_boolean.turn_off
    entity_id: input_boolean.lavatrice_switch

- id: lavatrice_done
  alias: Lavatrice Finito
  trigger:
  - entity_id: input_boolean.lavatrice_switch
    platform: state
    to: 'off'
  action:
  - service: notify.alexa_media
    data:
      message: La lavatrice ha terminato il lavaggio. Ricordati di stendere il bucato
      target: media_player.nome_primo_dispositivo_alexa
      data:
        type: announce  
  - service: notify.alexa_media
    data:
      message: La lavatrice ha terminato il lavaggio. Ricordati di stendere il bucato
      target: media_player.nome_secondo_dispositivo_alexa
      data:
        type: announce
########################################################
################INPUT_BOOLEAN############################
########################################################
input_boolean:
  lavatrice_switch:
    name: stato del lavaggio
    initial: off
    icon: mdi:washing-machine
{% endhighlight %}

Si tratta dello script presente al post di cui sopra, che ho adattato alle mie esigenze, ovvero al fatto che volevo che Alexa mi annunciasse la fine del lavaggio. Inoltre, l'ho anche adattato ai consumi della mia lavatrice.

Il cuore è in pratica l'**INPUT_BOOLEAN** che si trova alla fine, che switchando tra off e on "fa capire" ad Home Assistant se deve partire o meno l'automazione che chiama l'annuncio di fine bucato: nel mio caso, se rileva un consumo di almeno 50 watt per almeno 1 minuto, switcha ad on (lavatrice in funzione), al contrario se rileva un consumo di meno di 5 watt per almeno 1 minuto, switcha ad off (la lavatrice ha terminato). In quest'ultimo caso, cioè se si verifica **lo switch da on ad off**, parte il "Lavatrice finito", che fa scattare a sua volta l'annuncio.

Ovviamente quel *sensor.lavatrice_power* altro non è che il "sensore" relativo al Sonoff POW Origin che ho rinominato in questo modo.

Per gestire dispositivi Sonoff in Home Assistant, basta installare l'integrazione **Sonoff LAN** da HACS, la quale riconoscera in maniera pressochè istantanea qualsiasi dispositivo di casa Sonoff presente nella vostra rete. Per usare Alexa come media player e riprodurre gli annunci, potete seguire [questo post](https://red-blue.it/guide/domotica/alexa/2024/08/20/annunci-da-alexa-tramite-home-assistant.html){:target="_blank"}.

Semplice e geniale!

Stay tuned..

Credits: [Vincenzo Caputo](https://www.vincenzocaputo.com/guide/la-lavatrice-ha-finito-con-home-assistant-te-lo-facciamo-notificare-174){:target="_blank"}