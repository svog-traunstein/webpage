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
})();
