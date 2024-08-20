---
layout: post
title: Annunci da Alexa tramite Home Assistant
author: RedBlue
categories: 
- guide
- domotica
- alexa
---

Sapete che è possibile usare un dispositivo Alexa come se fosse un riproduttore musicale tramite Home Assistant? Vediamo come fare..

Basta installare un custom component di Home Assistant chiamato Alexa Media Player.

Consiglio vivamente di installarlo tramite **HACS**, il Community Store di Home Assistant, installabile da **Impostazioni -> Dispositivi e servizi -> Aggiungi integrazione**. Quindi entrate in HACS e cercate "Alexa Media Player", in alternativa clic sui **tre puntini in alto a destra -> Archivi digitali personalizzati** ed inserite **https://github.com/custom-components/alexa_media_player**, poi cercate nuovamente ed installate. Al termine Home Assistant va riavviato.

Poi collegatevi [qui](https://www.amazon.it/ap/signin?openid.pape.preferred_auth_policies=SinglefactorWithPossessionChallenge&openid.pape.max_auth_age=900&openid.return_to=https%3A%2F%2Fwww.amazon.it%2Fa%2Fsettings%2Fapproval&openid.assoc_handle=itflex&openid.mode=checkid_setup&intercept=false&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0){:target="_blank">} ed accedete con le vostre credenziali Amazon (se usate Alexa, avete un account Amazon) e portate a termine la procedura per l'autenticazione a due passaggi, **obbligatoria** per usare questa integrazione.

Occorre cliccare su **Aggiungi nuovo telefono o un'app di autenticazione** e successivamente sul link **Non riesci ad acquisire il codice a barre?**; solo a questo punto avremo una schermata con un codice alfanumerico che dovremo appuntare da qualche parte (PS. Non chiudere questa finestra altrimenti bisogna ricominciare daccapo).

Andiamo su Home Assistant, in **Impostazioni -> Dispositivi** e servizi e selezioniamo Alexa Media Player, poi vanno inseriti i dati di configurazione, ovvero il nostro account Amazon, il dominio **amazon.it** (MI RACCOMANDO!!), l'URL di Home Assistant (deve essere raggiungibile da Internet ovviamente), e il codice copiato in precedenza, che garantirà l'autenticazione corretta. Clicchiamo su "Invia" e avremo un'OTP da inserire nella pagina precedente (vi avevo detto di non chiuderla!).

Al termine della configurazione, saranno comparsi tutti i dispositivi alexa che avete in casa, e le relative entità, e saranno del tipo media_player.*nome_dispositivo*:

![alexa_media_player_image](/assets/images/alexa_media_player.png){:style="display:block; width: 100%; margin-left:auto; margin-right:auto"}

Poi, tali entità saranno richiamabili a piacimento tramite Home Assistant, ad esempio in un'automazione.

Per utilizzare gli annunci si può usare il **servizio "notify.alexa_media"**, ad esempio in un'automazione va inserito il seguente codice:

{% highlight bash %}
service: notify.alexa_media
data:
  message: Questo è il testo dell'annuncio che sarà riprodotto
  target: media_player.nome_dispositvo_alexa
  data:
    type: announce
{% endhighlight %}

Stay tuned..