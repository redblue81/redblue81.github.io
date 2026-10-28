$ErrorActionPreference = "Stop"

$root = (& git rev-parse --show-toplevel).Trim()
if ($LASTEXITCODE -ne 0 -or -not $root) {
    Write-Error "Non sei in un repository git."
    exit 1
}

$dirty = & git status --porcelain
if ($dirty) {
    Write-Host "Attenzione: ci sono modifiche non committate. Il check usa solo HEAD." -ForegroundColor Yellow
}

$command = 'rm -rf /tmp/src; mkdir -p /tmp/src; git -C /src archive HEAD | tar -x -C /tmp/src; cd /tmp/src; bash scripts/check-clean.sh'

docker run --rm `
    -v "${root}:/src" `
    -v "redblue-blog-bundle:/tmp/bundle" `
    -w /src `
    -e BUNDLE_PATH=/tmp/bundle `
    -e BUNDLE_FROZEN=true `
    ruby:3.2 bash -lc $command

if ($LASTEXITCODE -ne 0) {
    Write-Host "Check fallito: push bloccato. Correggi e riprova (oppure usa 'git push --no-verify')." -ForegroundColor Red
    exit 1
}

Write-Host "Build + html-proofer OK su git archive HEAD." -ForegroundColor Green
