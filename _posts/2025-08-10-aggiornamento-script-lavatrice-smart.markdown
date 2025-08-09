---
layout: post
title: Aggiornamento dello script relativo alla lavatrice smart
background: '/assets/images/smart-home-3096219_1920-768x512.jpg'
author: RedBlue
categories: 
- guide
- domotica
- sonoff
- updated
---

In merito all'automazione di **Home Assistant** per ricevere una notifica tramite Alexa quando la lavatrice termina il lavaggio ([qui la guida completa](https://red-blue.it/guide/domotica/sonoff/2024/08/26/ho-reso-smart-la-mia-lavatrice.html){:target="_blank"}), c'è da fare un piccolo **aggiornamento** dello script, in quanto vari aggiornamenti di HA hanno leggermente modificato la situazione, e il vecchio script di fatto non funziona.

Adesso le automazione vanno tutte in *automations.yaml*, quindi il file all'interno della directory *packages* conterrà di fatto solo l'input_boolean:

{% highlight bash %}
########################################################
################INPUT_BOOLEAN############################
########################################################
input_boolean:
  lavatrice_switch:
    name: stato del lavaggio
    initial: off
    icon: mdi:washing-machine
{% endhighlight %}

Mentre in automations.yaml (potete anche scegliere di aggiungerle da interfaccia grafica di HA, cosa che ad esempio ho fatto io, per poi modificare quello che mi serviva):

{% highlight bash %}
id: '1731346166999'
  alias: Lavatrice fine switch state
  description: ''
  trigger:
  - entity_id: sensor.lavatrice_power
    platform: numeric_state
    below: '5.0'
    for:
      minutes: 1
  condition:
  - condition: state
    entity_id: input_boolean.lavatrice_switch
    state: 'on'
  action:
  - entity_id: input_boolean.lavatrice_switch
    action: input_boolean.turn_off
  mode: single
- id: '1731346431244'
  alias: Lavatrice Finito
  description: ''
  triggers:
  - entity_id: input_boolean.lavatrice_switch
    to: 'off'
    trigger: state
  conditions: []
  actions:
  - action: notify.alexa_media
    metadata: {}
    data:
      message: La lavatrice ha terminato il lavaggio. Ricordati di stendere il bucato
      target: media_player.nome_disposivo_alexa
      data:
        type: announce
  mode: single
- id: '1731346443168'
  alias: lavatrice on
  description: ''
  trigger:
  - entity_id: sensor.lavatrice_power
    platform: numeric_state
    above: '50.0'
    for:
      minutes: 1
  condition: []
  action:
  - entity_id: input_boolean.lavatrice_switch
    action: input_boolean.turn_on
  mode: single
  {% endhighlight %}

  L'automazione tornerà a funzionare regolarmente.

  Stay tuned..