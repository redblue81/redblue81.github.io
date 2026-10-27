# RedBlue's Blog

Blog personale di Angelo "RedBlue" Pascadopoli, pubblicato su [red-blue.it](https://red-blue.it) con Jekyll e GitHub Pages.

## Stack

- **Jekyll 3.9** (gem `github-pages`), tema remoto [Clean Blog](https://github.com/StartBootstrap/startbootstrap-clean-blog-jekyll) pinnato a un commit.
- **GitHub Actions**: build e `html-proofer` su PR e push; deploy sul branch `gh-pages` solo da `main`/schedule.
- **Cloudflare** per DNS, TLS e cache.
- **FormSubmit** per il form contatti (POST nativo, senza backend).

## Struttura

- `_posts/` — 483 post (469 HTML legacy da WordPress + 14 Markdown).
- `_layouts/`, `_includes/` — override del tema.
- `assets/` — immagini, CSS/JS del tema e asset vari.
- `_config.yml` — configurazione del sito.
- `.github/workflows/jekyll.yml` — CI e deploy.

## Sviluppo locale

Requisiti: Ruby 3.2 e Bundler.

```bash
bundle install
bundle exec jekyll serve
```

Oppure con Docker:

```bash
docker run --rm -it -p 4000:4000 \
  -v "$PWD":/srv/jekyll -w /srv/jekyll ruby:3.2 \
  bash -lc "bundle install && bundle exec jekyll serve --host 0.0.0.0"
```

Build e controllo link/immagini:

```bash
bundle exec jekyll build
bundle exec htmlproofer ./_site \
  --disable-external \
  --assume-extension \
  --ignore-empty-alt \
  --ignore-missing-alt \
  --no-enforce-https \
  --ignore-urls "/assets/images/xc3028-v27.fw,/assets/images/k10temp.tar.gz,/assets/images/em28xx-new.tar.gz"
```

`_site/` e `.jekyll-cache/` sono generati e ignorati da git.

## Nuovo post

Creare un file in `_posts/` con nome `YYYY-MM-DD-slug.md` (o `.markdown`) e front matter minimo:

```yaml
---
layout: post
title: "Titolo del post"
date: 2026-01-01 10:00:00 +0100
categories: [domotica]
tags: [home-assistant, tutorial]
---
```

Note:

- Le **categorie vanno in minuscolo**: contribuiscono all'URL e ai nomi delle pagine categoria.
- Con `future: false`, i post con data futura non vengono pubblicati fino al primo build successivo alla data (il workflow gira ogni giorno a mezzogiorno UTC).
- Le immagini vanno in `assets/images/` e referenziate con `/assets/images/...`.

## Deploy

Ogni push su `main` esegue build, `html-proofer` e deploy su `gh-pages`. Le pull request eseguono build e controlli ma **non** il deploy. Il merge resta manuale.
