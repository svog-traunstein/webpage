(function(){
  // mobile nav
  var t=document.querySelector('.js-nav-toggle'), n=document.querySelector('.js-nav');
  if(t&&n){t.addEventListener('click',function(){var o=n.classList.toggle('is-open');t.setAttribute('aria-expanded',o);t.classList.toggle('is-active',o);});}
  // mobile submenus
  document.querySelectorAll('.submenu-toggle').forEach(function(b){
    b.addEventListener('click',function(e){e.preventDefault();b.parentNode.classList.toggle('is-expanded');});
  });
  // sticky header shadow
  var h=document.querySelector('.js-header');
  if(h){var on=function(){h.classList.toggle('is-scrolled',window.scrollY>10);};on();window.addEventListener('scroll',on,{passive:true});}

  // content-aware Burger: umschalten, sobald die Navi neben Logo + Button nicht mehr passt
  var inner=h&&h.querySelector('.site-header__inner');
  if(inner){
    var fit=function(){
      h.classList.remove('nav-collapsed');                 // erst ausklappen, dann messen
      if(inner.scrollWidth>inner.clientWidth+1){
        h.classList.add('nav-collapsed');                  // passt nicht -> Burger
      }else if(n){                                          // passt -> offenes Panel sicher schließen
        n.classList.remove('is-open');
        if(t){t.setAttribute('aria-expanded','false');t.classList.remove('is-active');}
      }
    };
    fit();
    window.addEventListener('resize',fit,{passive:true});
    window.addEventListener('load',fit);
    if(document.fonts&&document.fonts.ready){document.fonts.ready.then(fit);}
  }

  // Team-Karten: das Theme baut Vorder-/Rueckseite zur Laufzeit.
  // Unterstuetzte Eingaben je Karte:
  //  (1) Block-Editor empfohlen: Bild-Block .team-card  +  getrennte Bloecke .team-front / .team-back
  //  (2) Block-Editor kurz:      Bild-Block .team-card  +  ein folgender Absatz (Fallback)
  //  (3) klassisch:              .team-card mit .team-card__photo + .team-card__info
  // Buch = Hover/Tap; Flip = Klick.
  var teamIsBook=document.body.classList.contains('cardfx-book');

  function firstHTML(el,sel){ var e=el.querySelector(sel); return e?e.innerHTML:''; }

  function collectContent(card){
    var photo=card.querySelector('.team-card__photo');
    var img=card.querySelector('img');
    if(!photo && img){ photo=document.createElement('div'); photo.className='team-card__photo'; img.parentNode.insertBefore(photo,img); photo.appendChild(img); }

    var frontHTML='', backHTML='';

    // (1) getrennte Geschwister-Bloecke .team-front / .team-back einsammeln (und einverleiben)
    var sib=card.nextElementSibling;
    while(sib && sib.classList && (sib.classList.contains('team-front')||sib.classList.contains('team-back'))){
      if(sib.classList.contains('team-front')) frontHTML=sib.innerHTML;
      if(sib.classList.contains('team-back'))  backHTML=sib.innerHTML;
      var rm=sib; sib=sib.nextElementSibling; rm.parentNode.removeChild(rm);
    }

    if(!frontHTML && !backHTML){
      // (3) vorhandenes .team-card__info  ODER  (2) figcaption / folgender Absatz
      var info=card.querySelector('.team-card__info'), infoHTML='';
      if(info){ infoHTML=info.innerHTML; if(info.parentNode) info.parentNode.removeChild(info); }
      else {
        var cap=card.querySelector('figcaption');
        if(cap && cap.innerHTML.trim()) infoHTML=cap.innerHTML;
        if(cap && cap.parentNode) cap.parentNode.removeChild(cap);
        if(!infoHTML){
          var nx=card.nextElementSibling;
          if(nx && (nx.tagName==='P' || (nx.classList && nx.classList.contains('team-info')))){ infoHTML=nx.innerHTML; nx.parentNode.removeChild(nx); }
        }
      }
      backHTML=infoHTML;
      // Vorderseite ableiten: Name (fett / 1. Zeile) + Hund (kursiv / 2. Zeile)
      var tmp=document.createElement('div'); tmp.innerHTML=infoHTML;
      var nm=firstHTML(tmp,'strong,b'), dg=firstHTML(tmp,'em,i');
      if(!nm){ var parts=infoHTML.split(/<br\s*\/?>/i); nm=(parts[0]||'').replace(/<[^>]+>/g,'').trim(); if(!dg&&parts[1]) dg=parts[1].replace(/<[^>]+>/g,'').trim(); }
      frontHTML='<strong>'+nm+'</strong>'+(dg?'<span class="team-card__dog">'+dg+'</span>':'');
    }

    return { photo:photo, frontHTML:frontHTML, backHTML:(backHTML||frontHTML) };
  }

  // 1) Karten aufbauen (Foto + Vorder-/Rueckseite)
  document.querySelectorAll('.team-card').forEach(function(card){
    if(card.querySelector('.team-card__inner')) return;      // schon umgebaut
    if(!card.querySelector('img') && !card.querySelector('.team-card__photo') && !card.querySelector('.team-card__info')) return;
    var c=collectContent(card);
    var inner=document.createElement('div'); inner.className='team-card__inner';
    var front=document.createElement('div'); front.className='team-card__front';
    var back=document.createElement('div'); back.className='team-card__back';
    if(c.photo) front.appendChild(c.photo);
    var cap=document.createElement('div'); cap.className='team-card__caption'; cap.innerHTML=c.frontHTML;
    front.appendChild(cap);
    var moreBtn=document.createElement('button'); moreBtn.type='button'; moreBtn.className='team-card__more-btn'; moreBtn.textContent='Mehr Infos';
    front.appendChild(moreBtn);
    var backBody=document.createElement('div'); backBody.className='team-card__back-body'; backBody.innerHTML=c.backHTML;
    var backBtn=document.createElement('button'); backBtn.type='button'; backBtn.className='team-card__back-btn'; backBtn.textContent='Zurück';
    back.appendChild(backBody); back.appendChild(backBtn);
    inner.appendChild(front); inner.appendChild(back);
    card.appendChild(inner);
    card.classList.add('is-flip-ready');
    card.setAttribute('tabindex','0'); card.setAttribute('role','button'); card.setAttribute('aria-label','Details anzeigen');
    backBtn.addEventListener('click',function(e){ e.stopPropagation(); card.classList.remove('is-flipped'); });
    card.addEventListener('click',function(){ if(teamIsBook){ card.classList.toggle('is-flipped'); } else if(!card.classList.contains('is-flipped')){ card.classList.add('is-flipped'); } });
    card.addEventListener('keydown',function(e){
      if(e.key==='Enter'||e.key===' '){ e.preventDefault(); card.classList.toggle('is-flipped'); }
      else if(e.key==='Escape'){ card.classList.remove('is-flipped'); }
    });
  });

  // 2) Auto-Raster: lose .team-card (nebeneinander, nicht in einem .team-grid) gruppieren
  (function(){var done=[];
    document.querySelectorAll('.team-card').forEach(function(card){
      if(done.indexOf(card)>-1 || card.closest('.team-grid')) return;
      var group=[card], m=card.nextElementSibling;
      while(m && m.classList && m.classList.contains('team-card')){ group.push(m); m=m.nextElementSibling; }
      var grid=document.createElement('div'); grid.className='team-grid';
      card.parentNode.insertBefore(grid,card);
      group.forEach(function(g){ done.push(g); grid.appendChild(g); });
    });
  })();
})();
