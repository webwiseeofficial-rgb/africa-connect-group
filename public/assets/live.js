/* Public site ⇄ Supabase: editable contact details, visit tracking, news & projects feeds. */
(function(){
 var C=window.ACG_CONFIG||{},U=(C.SUPABASE_URL||'').replace(/\/$/,''),K=C.SUPABASE_ANON_KEY||'';
 if(!U||!K)return;
 var d=document,lg=d.documentElement.lang||'fr',H={apikey:K,Authorization:'Bearer '+K};
 function get(q){return fetch(U+'/rest/v1/'+q,{headers:H}).then(function(r){if(!r.ok)throw 0;return r.json()})}
 function ls(k,v){try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){}return null}

 /* ---------- 1. contact details ---------- */
 var dig=function(x){return String(x||'').replace(/\D/g,'')};
 var cur={email:'africaconnectgroup1@gmail.com',wa:'243899639009',wad:'+243 899 639 009',p1:'243899639009',p1d:'+243 899 639 009',p2:'213793338879',p2d:'+213 793 338 879'};
 function applyContact(s){
  if(!s)return;
  var n={email:(s.email||'').trim()||cur.email,
   wa:dig(s.whatsapp)||cur.wa,wad:(s.whatsapp||'').trim()||cur.wad,
   p1:dig(s.phone1)||cur.p1,p1d:(s.phone1||'').trim()||cur.p1d,
   p2:dig(s.phone2)||cur.p2,p2d:(s.phone2||'').trim()||cur.p2d};
  d.querySelectorAll('a[href]').forEach(function(a){
   var h=a.getAttribute('href');
   if(h.indexOf('wa.me/'+cur.wa)>-1){a.setAttribute('href',h.replace('wa.me/'+cur.wa,'wa.me/'+n.wa));if(a.textContent.trim()===cur.wad&&!a.children.length)a.textContent=n.wad}
   else if(h==='tel:+'+cur.p1)a.setAttribute('href','tel:+'+n.p1);
   else if(h==='tel:+'+cur.p2)a.setAttribute('href','tel:+'+n.p2);
   else if(h==='mailto:'+cur.email)a.setAttribute('href','mailto:'+n.email);
  });
  d.querySelectorAll('[data-email]').forEach(function(f){if(f.dataset.email===cur.email)f.dataset.email=n.email});
  d.querySelectorAll('[data-wa]').forEach(function(f){if(f.dataset.wa===cur.wa)f.dataset.wa=n.wa});
  var w=d.createTreeWalker(d.body,NodeFilter.SHOW_TEXT),t,list=[];
  while(t=w.nextNode())list.push(t);
  list.forEach(function(t){
   var v=t.nodeValue;if(v.indexOf('+')<0&&v.indexOf('@')<0)return;
   var o=v;
   if(cur.p1d!==n.p1d)o=o.split(cur.p1d).join(n.p1d);
   if(cur.p2d!==n.p2d)o=o.split(cur.p2d).join(n.p2d);
   if(cur.email!==n.email)o=o.split(cur.email).join(n.email);
   if(o!==v)t.nodeValue=o;
  });
  cur=n;
 }
 var cached=ls('acg_settings');
 function run(f){d.readyState==='loading'?d.addEventListener('DOMContentLoaded',f):f()}
 run(function(){
  if(cached){try{applyContact(JSON.parse(cached))}catch(e){}}
  get('settings?select=email,whatsapp,phone1,phone2&id=eq.1').then(function(r){if(r[0]){ls('acg_settings',JSON.stringify(r[0]));applyContact(r[0])}}).catch(function(){});
 });

 /* ---------- 2. visit tracking ---------- */
 (function(){
  var p=location.pathname.replace(/\/$/,'')||'/';
  if(/^\/admin/.test(p)||navigator.webdriver||/bot|crawl|spider|headless|lighthouse|preview/i.test(navigator.userAgent))return;
  if(ls('acg_notrack')==='1')return;
  var id=ls('acg_vid');if(!id){id=(window.crypto&&crypto.randomUUID?crypto.randomUUID():String(Date.now())+Math.random().toString(16).slice(2));ls('acg_vid',id)}
  var path=p.replace(/^\/(en|ar|es)(?=\/|$)/,'')||'/';
  var ua=navigator.userAgent,dev=/iPad|Tablet/i.test(ua)?'tablet':/Mobi|Android|iPhone/i.test(ua)?'mobile':'desktop';
  var ref='';try{if(d.referrer){var h=new URL(d.referrer).hostname.replace(/^www\./,'');if(h&&h!==location.hostname.replace(/^www\./,''))ref=h}}catch(e){}
  fetch(U+'/rest/v1/visits',{method:'POST',keepalive:true,headers:Object.assign({'Content-Type':'application/json',Prefer:'return=minimal'},H),
   body:JSON.stringify({path:path,lang:lg,visitor:id,device:dev,referrer:ref||null})}).catch(function(){});
 })();

 /* ---------- 3. news & projects feeds ---------- */
 function el(t,c,x){var e=d.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
 function pick(o){o=o||{};return (o[lg]&&o[lg].trim())?o[lg]:(o.fr||o.en||'')}
 function feed(box){
  var kind=box.dataset.feed,more=box.dataset.more||'Read more',less=box.dataset.less||'Close';
  get('entries?select=id,title,body,image_url,created_at&kind=eq.'+kind+'&order=created_at.desc&limit=60').then(function(rows){
   if(!rows.length)return;
   rows.forEach(function(r){
    var card=el('article','fc-post'+(r.image_url?' has-img':''));
    if(r.image_url){var im=el('img');im.src=r.image_url;im.alt='';im.loading='lazy';var fig=el('div','fp-img');fig.appendChild(im);card.appendChild(fig)}
    var b=el('div','fp-body');
    var dt=el('time','fp-date');try{dt.textContent=new Date(r.created_at).toLocaleDateString(lg,{day:'numeric',month:'long',year:'numeric'})}catch(e){dt.textContent=r.created_at.slice(0,10)}
    dt.setAttribute('datetime',r.created_at);
    b.appendChild(dt);b.appendChild(el('h3','',pick(r.title)));
    var txt=pick(r.body),short=txt.length>190?txt.slice(0,190).replace(/\s+\S*$/,'')+'…':txt;
    var p=el('p','fp-text',short);b.appendChild(p);
    if(short!==txt){var btn=el('button','fp-more',more);btn.type='button';var open=false;
     btn.addEventListener('click',function(){open=!open;p.textContent=open?txt:short;btn.textContent=open?less:more;p.classList.toggle('open',open)});b.appendChild(btn)}
    card.appendChild(b);box.appendChild(card);
   });
   box.hidden=false;
   var emp=box.parentNode.querySelector('[data-feed-empty]');if(emp)emp.hidden=true;
  }).catch(function(){});
 }
 run(function(){d.querySelectorAll('[data-feed]').forEach(feed)});
})();
