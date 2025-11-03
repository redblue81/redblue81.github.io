---
layout: post
title: Domotizzare le luci di casa con Sonoff Mini R4 Extreme e Dual R3
#background: '/assets/images/smart-home-3096219_1920-768x512.jpg'
author: RedBlue
categories: 
- guide
- ruby
- jekyll
- blog
- github
---

Riprendo l'argomento relativo alla [pubblicazione automatica su Github Pages](https://red-blue.it/guide/blog/ruby/jekyll/2024/08/24/schedulare-la-pubblicazione-dei-post-su-github-pages-con-jekyll.html){:target="_blank"}, visto in precedenza, in quanto recentemente il processo era andato in crash e non riuscivo in alcun modo a ripristinarlo.

Cercando in rete, pare che il problema fosse la **action** che usavo, che presenta delle incompatibilità con la gestione dei certificati SSL delle versioni più recenti delle librerie relative appunto ad SSL.

Fortunatamente, **Github** fornisce una propria action (che ne mio caso è anche più veloce a deployare il sito), quindi è bastato riscrivere il file relativo al workflow:

{% highlight ruby %}
name: Deploy Jekyll to gh-pages

on:
  schedule:
    - cron: '0 12 * * *'  # ogni giorno a mezzogiorno UTC
  push:
    branches: ["main"]
  workflow_dispatch:

permissions:
  contents: write   # serve per poter fare push su gh-pages
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Ruby
        uses: ruby/setup-ruby@v1
        with:
          ruby-version: '3.2'
          bundler-cache: true

      - name: Install dependencies
        run: bundle install

      - name: Build site with Jekyll
        run: bundle exec jekyll build

      - name: Add CNAME file
        run: echo "nomedominio.ext" > ./_site/CNAME # necessario se avete un custom domain!!

      - name: Deploy to gh-pages branch
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_branch: gh-pages
          publish_dir: ./_site
          commit_message: "Deploy site via GitHub Actions"
{% endhighlight %}

Facile no? Lo script è estremamente simile al precedente, ed inoltre ho aggiunto qualche commento qua e là..

Stay tuned..