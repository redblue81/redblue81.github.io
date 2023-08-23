---
layout: post
title: Jekyll, generatore di siti statici
background: '/assets/images/jekyll_logo.png'
author: RedBlue
categories: 
- guide
- blog
---

Piccolo post introduttivo su [Jekyll](https://jekyllrb.com/), il generatore di siti web statici.

Per tantissimi anni ho usato per questo blog un CMS (Content Management System), con il quale gestivo un cosidetto sito web **dinamico**, ovvero esisteva un database in cui tutti i dati del sito erano memorizzati, ed era poi il CMS stesso che provvedeva a recuperare tali dati all'occorrenza e a creare _"on demand"_ le pagine web da visualizzare.

All'opposto di un sistema del genere ci sono i siti web **statici**, nei quali invece le pagine web sono direttamente presenti sul server, senza dover ricorrere ad un database. In, pratica, si ha a che fare con semplici file HTML.

Jekyll è un software che aiuta a generare siti web statici, usando templates per costruire le pagine web per le quali scriviamo i contenuti. Jekyll non usa databases, né è in grado di _"hostare"_ il sito creato, il quale va uploadato su un servizio online per la pubblicazione (ad esempio [GitHub Pages](https://pages.github.com/)).

Ovviamente il ricorso ad un software come Jekyll va valutato attentamente, esistono tipologie di siti che hanno necessariamente bisogno di database e CMS, ma nel caso di siti come il mio, i vantaggi possono essere diversi:

* manutenzione pari quasi a zero (non ci sono aggiornamenti da applicare se non in rare occasioni);
* semplicità di backup (basta un semplice copia e incolla);
* la possibilità di usare un sistema di versionamento del codice, ad esempio **Git**;
* spesso il sito risultante è estremamente veloce (a patto di non generare pagine particolarmente pesanti).

Aggiungo che, tempo permettendo, ci si può divertire a personalizzare l'aspetto del sito a piacimento in maniera piuttosto rapida, non essendo necessaria praticamente alcuna conoscenza avanzata di programmazione.

Nei prossimi post, vedremo l'installazione, la gestione offline/online e la creazione di post con Jekyll.

Stay tuned..