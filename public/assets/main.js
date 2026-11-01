(function(){
 var d=document,root=d.documentElement;root.classList.add('js');
 var hdr=d.getElementById('hdr'),b=d.getElementById('burger'),nav=d.getElementById('nav');
 function sc(){hdr.classList.toggle('scrolled',scrollY>8)}sc();addEventListener('scroll',sc,{passive:true});
 b.addEventListener('click',function(){var o=nav.classList.toggle('open');b.setAttribute('aria-expanded',o)});
 nav.addEventListener('click',function(e){if(e.target.closest('a')){nav.classList.remove('open');b.setAttribute('aria-expanded','false')}});
 var els=d.querySelectorAll('.reveal');
 if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(x){if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}})},{threshold:.12});els.forEach(function(e){io.observe(e)})}
 else els.forEach(function(e){e.classList.add('in')});
 var st=d.querySelector('.steps');
 if(st&&st.children.length){var dw=d.createElement('div');dw.className='steps-dots';dw.setAttribute('aria-hidden','true');
  for(var k=0;k<st.children.length;k++)dw.appendChild(d.createElement('i'));
  st.parentNode.insertBefore(dw,st.nextSibling);
  var upd=function(){var kids=st.children,w=kids[0].offsetWidth+12,i=Math.round(st.scrollLeft/w);
   if(st.scrollLeft+st.clientWidth>=st.scrollWidth-4)i=kids.length-1;
   for(var m=0;m<dw.children.length;m++)dw.children[m].classList.toggle('on',m===i)};
  st.addEventListener('scroll',upd,{passive:true});upd()}
 var f=d.getElementById('cform');if(!f)return;
 var q=new URLSearchParams(location.search).get('pole');if(q&&f.pole)f.pole.value=q;
 var fr=f.dataset.lang==='fr';
 f.addEventListener('click',function(e){
  var btn=e.target.closest('[data-send]');if(!btn)return;
  var v=function(n){return(f.elements[n].value||'').trim()};
  var ok=v('name')&&v('message')&&/^\S+@\S+\.\S+$/.test(v('email'));
  d.getElementById('ferr').hidden=!!ok;if(!ok)return;
  var pole=f.pole.options[f.pole.selectedIndex].text;
  var L=fr?['Nom','Entreprise','E-mail','Téléphone','Profil','Pôle','Message']:['Name','Company','Email','Phone','Profile','Division','Message'];
  var txt=[L[0]+': '+v('name'),v('company')&&L[1]+': '+v('company'),L[2]+': '+v('email'),v('phone')&&L[3]+': '+v('phone'),L[4]+': '+f.profile.value,L[5]+': '+pole,'',L[6]+':',v('message')].filter(function(x){return x!==false&&x!==''||x===''}).join('\n');
  if(btn.dataset.send==='wa')window.open('https://wa.me/'+f.dataset.wa+'?text='+encodeURIComponent((fr?'Bonjour Africa Connect Group,\n\n':'Hello Africa Connect Group,\n\n')+txt),'_blank','noopener');
  else location.href='mailto:'+f.dataset.email+'?subject='+encodeURIComponent((fr?'Demande de collaboration — ':'Collaboration request — ')+v('name'))+'&body='+encodeURIComponent(txt);
 });
})();
