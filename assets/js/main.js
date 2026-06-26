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

  // Team-Karten: Inhalt bleibt sauber (nur Foto + Text) -> JS baut Vorder-/Rückseite zur Laufzeit.
  // Buch = on Hover (CSS) + Tap (Touch); Flip = on Klick.
  var teamIsBook=document.body.classList.contains('cardfx-book');
  document.querySelectorAll('.team-card').forEach(function(card){
    var info=card.querySelector('.team-card__info'); if(!info) return;
    if(card.querySelector('.team-card__inner')) return;      // schon umgebaut
    var photo=card.querySelector('.team-card__photo');
    var strongEl=info.querySelector('strong'), emEl=info.querySelector('em');
    var capName=strongEl?strongEl.innerHTML:'';
    var capDog=emEl?emEl.innerHTML:'';
    var fullInfo=info.innerHTML;
    var inner=document.createElement('div'); inner.className='team-card__inner';
    var front=document.createElement('div'); front.className='team-card__front';
    var back=document.createElement('div'); back.className='team-card__back';
    if(photo) front.appendChild(photo);
    var cap=document.createElement('div'); cap.className='team-card__caption';
    cap.innerHTML='<strong>'+capName+'</strong>'+(capDog?'<span class="team-card__dog">'+capDog+'</span>':'');
    front.appendChild(cap);
    if(info.parentNode) info.parentNode.removeChild(info);   // volle Infos nur noch auf der Rueckseite
    var moreBtn=document.createElement('button');
    moreBtn.type='button'; moreBtn.className='team-card__more-btn'; moreBtn.textContent='Mehr Infos';
    front.appendChild(moreBtn);
    var backBody=document.createElement('div'); backBody.className='team-card__back-body'; backBody.innerHTML=fullInfo;
    var backBtn=document.createElement('button'); backBtn.type='button'; backBtn.className='team-card__back-btn'; backBtn.textContent='Zurück';
    back.appendChild(backBody); back.appendChild(backBtn);
    inner.appendChild(front); inner.appendChild(back);
    card.appendChild(inner);
    card.classList.add('is-flip-ready');                     // erst jetzt Karten-Optik auf Vorder-/Rückseite
    card.setAttribute('tabindex','0'); card.setAttribute('role','button'); card.setAttribute('aria-label','Details anzeigen');
    backBtn.addEventListener('click',function(e){ e.stopPropagation(); card.classList.remove('is-flipped'); });
    card.addEventListener('click',function(){ if(teamIsBook){ card.classList.toggle('is-flipped'); } else if(!card.classList.contains('is-flipped')){ card.classList.add('is-flipped'); } });
    card.addEventListener('keydown',function(e){
      if(e.key==='Enter'||e.key===' '){ e.preventDefault(); card.classList.toggle('is-flipped'); }
      else if(e.key==='Escape'){ card.classList.remove('is-flipped'); }
    });
  });
})();
