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

  // Team-/Hundeführer-Karten: "Mehr anzeigen"-Knopf, wenn der Text gekürzt ist
  document.querySelectorAll('.team-card').forEach(function(card){
    var info=card.querySelector('.team-card__info'); if(!info) return;
    var btn=document.createElement('button');
    btn.type='button'; btn.className='team-card__more is-empty'; btn.textContent='Mehr anzeigen';
    btn.addEventListener('click',function(){
      var ex=card.classList.toggle('is-expanded');
      btn.textContent=ex?'Weniger':'Mehr anzeigen';
    });
    card.appendChild(btn);
    var check=function(){
      if(card.classList.contains('is-expanded'))return;            // aufgeklappt: Knopf bleibt
      btn.classList.toggle('is-empty', info.scrollHeight<=info.clientHeight+1);
    };
    check();
    window.addEventListener('resize',check,{passive:true});
    window.addEventListener('load',check);
    if(document.fonts&&document.fonts.ready){document.fonts.ready.then(check);}
  });
})();
