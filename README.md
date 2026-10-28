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
  --no-enforce-https
```

`_site/` e `.jekyll-cache/` sono generati e ignorati da git.

### Controllo identico alla CI (consigliato)

Prima di ogni push:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/check-clean.ps1
```

Lo script estrae `git archive HEAD` in un container Linux (ext4), quindi vede esattamente i file che vedrà la CI: case-sensitive e senza file ignorati/non committati. Se fallisce, non pushare.

Hook opzionale:

```bash
git config core.hooksPath .githooks
```

Da quel momento il check parte automaticamente prima di ogni push (`git push --no-verify` per saltarlo).

## Privacy e analytics

- Nessun Google Analytics.
- **Cloudflare Web Analytics** è opzionale e cookieless: per attivarlo inserisci il token in `_config.yml` (`cloudflare_analytics_token`).
- Font, jQuery, Bootstrap e Font Awesome sono serviti localmente.
- I video YouTube sono in modalità **click-to-load**: nessuna richiesta a YouTube finché non clicchi.
- Pagine legali: `/privacy.html`, `/cookies-policy/`, `/affiliate-disclosure.html`.

## Archivio e ricerca

- `/archive/` — tutti i post per anno.
- `/categories/` e `/tags/` — indici che filtrano la ricerca.
- `/search.html` — ricerca client-side con Lunr self-hosted; indice generato in `search.json`.
- Nessun servizio esterno: Lunr è in `assets/vendor/lunr/`.

## URL e redirect

- Gli URL dei post esistenti sono **congelati**: non cambiare le categorie dei post già pubblicati.
- `scripts/check-urls.rb` confronta `_site/urls.json` con `scripts/url-baseline.json` e blocca build/CI se un URL cambia.
- Per un cambio intenzionale: aggiorna `scripts/url-baseline.json` e aggiungi un redirect.
- I vecchi URL WordPress `?p=ID` vengono rediretti da `redirects.json` + `assets/legacy-redirect.js` (fallback lato browser).
- I 158 vecchi link su `redblue.netsons.org` sono persi: il dominio non risponde più.

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
