---
layout: post
title: Soluzione errore RPC failed; curl 92 HTTP/2 stream 0 was not closed cleanly CANCEL (err 8)
background: '/assets/images/smart-home-3096219_1920-768x512.jpg'
author: RedBlue
categories: 
- guide
- domotica
- sonoff
---

Per quanto riguarda la schedulazione della pubblicazione di post su Github Pages (vedi questo [precedente articolo](https://red-blue.it/guide/blog/ruby/jekyll/2024/08/24/schedulare-la-pubblicazione-dei-post-su-github-pages-con-jekyll.html{:target="_blank"})), mi sono imbattuto in un errore che di fatto bloccava la pubblicazione automatica.

La soluzione è semplicissima, in fondo al file jekyll.yml, basta aggiungere:
{% highlight bash %}
pre_build_commands: git config --global http.postBuffer 157286400
{% endhighlight %}

E la action torna a funzionare.

Alla prossima..