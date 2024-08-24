---
layout: post
title: Schedulare la pubblicazione dei post su Github Pages con Jekyll
#background: '/assets/images/smart-home-3096219_1920-768x512.jpg'
author: RedBlue
categories: 
- guide
- blog
- ruby
- jekyll
---

Capita spesso di scrivere un post per poi pubblicarlo in un secondo momento. Con Jekyll basta semplicemente "datare" un post con una data **futura** per fare in modo che non si veda immediatamente dopo il deploy. Il problema è che poi, alla data prevista, sarà necessario **forzare il deploy**, ad esempio apportando una modifica anche minina ad un file, affinchè Github Pages ricompili l'intero sito e renda visibile il nuovo post.

Questo processo si può **automatizzare**, usando una **Action** che compila un branch periodicamente, a prescindere da quello che pubblichiamo, in modo da avere il sito sempre aggiornato. Vediamo come fare:

Per prima cosa, va inserito nel *_config.yml* la seguente riga:

{% highlight ruby %}
future: false
{% endhighlight %}

Che serve ad indicare a Jekyll di non pubblicare post con data futura.

Creiamo poi un *token di sicurezza*: **Icona del profilo -> Settings -> Developer Settings -> Personal Access tokens -> Fine grained tokens -> Generate new token**. Diamo un nome al nuovo token, gli diamo accesso a tutti oppure ad uno specifico repository, e sopratutto concediamo tutti i permessi (sono tanti lo so). Al termine copiamo il nuovo token.

A questo punto, aggiungiamo il token appena creato al repository del sito, quindi selezioniamo il relativo repository, poi andiamo in **Settings -> Secrets and variables -> Actions -> New repository secret**. Diamo un nome ed incolliamo il token precedente, per poi salvare il tutto.

Adesso viene il bello, occorre creare un **workflow** per Github, quindi creiamo il file jekyll.yml all'interno di */.github/workflows* (persorso che sarà quasi certamente da creare). In questo file indichiamo di usare la action [jeffreytse/jekyll-deploy-action](https://github.com/jeffreytse/jekyll-deploy-action){:target="_blank"}. Leggendo la documentazione, io ho scritto quanto segue:

{% highlight ruby %}
name: Build and deploy site

on:
  schedule:
    - cron: "30 17 * * *"
  workflow_dispatch:

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      # Use GitHub Actions' cache to cache dependencies on servers
      - uses: actions/cache@v4
        with:
          path: vendor/bundle
          key: ${{ runner.os }}-gems-${{ hashFiles('**/Gemfile.lock') }}
          restore-keys: |
            ${{ runner.os }}-gems-

      # Use GitHub Deploy Action to build and deploy to Github
      - uses: jeffreytse/jekyll-deploy-action@v0.6.0
        with:
          provider: 'github'
          token: ${{ secrets.NOME_ACTION_CREATA }} 
          branch: 'gh-pages'
          cname: 'url_custom_domain'
{% endhighlight %}

Vediamo di commentare un attimo il frammento di codice:
- Nella sezione **schedule**, indichiamo che la compilazione avverrà ogni giorno alle 17.30 (prima si indicano i minuti, poi le ore, potete verificare con [questo utile strumento online](https://crontab.guru/){:target="_blank"} come usare quella sintassi).
- Nel **token**, dobbiamo indicare il nome scelto in precedenza.
- Se abbiamo un **custom domain** configurato, dobbiamo indicarlo in **cname**.

Possiamo testare il nostro workflow, dal repository scegliamo **Actions**, nella colonna a sinistra scegliamo la action appena creata, e a destra clicchiamo su **Run Workflow**, se tutto va bene dopo qualche minuto la compilazione del sito terminerà correttamente.

A questo punto, sarà stato creato un nuovo branch chiamato gh-pages (ma il nome potete sceglierlo a vostro piacimento), l'ultimo step è quello di indicare a Github di visualizzare il sito da questo nuono branch e non dal main (nel mio caso, usavo la compilazione diretta dal main infatti); per farlo, dal repository andiamo in **Settings -> Pages** e selezioniamo, sotto **Build and deployment**, l'opzione **Deploy from a branch** (dovrebbe essere già selezionata) e come branch indichiamo gh-pages (o qualsiasi altro nome abbiate scelto).

A questo punto, scrivete un post con data futura e godetevi la pubblicazione **schedulata**.

Stay tuned..