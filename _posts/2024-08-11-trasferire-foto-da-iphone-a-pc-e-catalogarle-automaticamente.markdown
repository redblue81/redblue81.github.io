---
layout: post
title: Trasferire foto da iPhone a PC e catalogarle automaticamente
#background: '/assets/images/smart-home-3096219_1920-768x512.jpg'
author: RedBlue
categories: 
- guide
- windows
- programmazione
---

Mia moglie possiede un iPhone, e ovviamente nella memoria di quel device ci sono diverse migliaia di foto, molte delle quali decisamente importanti dal punto di vista affettivo.

Fermo restando che esiste iCloud, se lo spazio sul device termina, come fare a **trasferire tutte**, ma proprio tutte quelle foto su un normale PC con Windows (ebbene si, in casa non abbiamo un Mac)?

Il primo tentativo è stato ovviamente con i software consigliati da Apple, ma niente, non venivano scaricate tutte, perciò dopo un po' di prove varie ho deciso di cercare una via alternativa. Ed ecco la mia soluzione per trasferire foto da iPhone a PC e catalogarle automaticamente.

In primo luogo, ho creato un'**utenza locale** di Windows, al quale ho assegnato una password:

{% highlight powershell %}
net user "iphone_user" "987654321" /add
{% endhighlight %}

Poi, ho creato una cartella, l'ho **condivisa** e ho dato all'utente creato sopra i permessi per il controllo completo (lettura e scrittura): dopo aver creato la cartella, clic destro sulla **cartella -> Proprietà -> Condivisione -> Condividi**.

Nella finestra che si apre selezionare l'utente appena creato ed aggiungerlo a quelli autorizzati, poi selezionare anche **Lettura/Scrittura** (di default sarà indicato solo "Lettura"). Cliccare su **Condividi** e poi nella schermata principale, su **Condivisione avanzata** e poi su **Autorizzazioni**, infine spuntare il **Controllo completo** per il nostro utente.

Cliccare su Ok su tutte le finestre fino a chiudere quella principale relativa alla cartella. Abbiamo finito per quanto riguarda Windows.

A questo punto, sull'iPhone ho installato [Owlfiles](https://apps.apple.com/it/app/owlfiles-file-manager/id510282524){:target="_blank"} (uno dei tanti file manager disponibili gratuitamente sull'App Store di Apple) e da lì ho configurato la connessione ad un server, ovviamente il mio PC, basta indicare l'indirizzo IP del computer e successivamente come nome utente e password indicare quelli del solito utente che abbiamo creato in precedenza. Owlfiles permette di selezionare tutte le foto presenti sul device in un solo tocco, e importarli sul server, con un banalissimo copia e incolla.

Fatto, dopo il tempo necessario a trasferire qualche migliaio di files, tutte le foto erano sul PC!

Ma non è tutto, perchè dopo il trasferimento, c'era la titanica impresa di **catalogarle** tutte per data (chi ha dei bimbi piccoli forse può capirmi)! In pratica, le foto andavano catalogate in cartelle col nome nel formato *MM_YYYY*, in base alla data di ultima modifica: ho pensato di ricorrere ad un piccolissimo script in PowerShell:

{% highlight powershell %}
$p = "path_completo_cartella_condivisa_creata_in_precedenza"
get-childitem -Path $p |
     Move-Item -Destination {
        New-Item -ItemType Directory -Path (Join-Path $p $_.LastWriteTime.ToString("yyyy_MM")) -Force
    }
{% endhighlight %}

In pratica, per ogni file presente nella cartella condivisa, questo viene spostato nella cartella relativa al mese corretto in base alla data di ultima modifica del file, e se questa non esiste, viene **creata**.

Alla prossima..
