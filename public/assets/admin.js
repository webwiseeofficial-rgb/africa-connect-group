(function(){
'use strict';
var C=window.ACG_CONFIG||{},U=(C.SUPABASE_URL||'').replace(/\/$/,''),K=C.SUPABASE_ANON_KEY||'';
var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return [].slice.call((r||document).querySelectorAll(s))};
function h(tag,attrs){var e=document.createElement(tag);attrs=attrs||{};
 for(var k in attrs){var v=attrs[k];if(v==null||v===false)continue;if(k==='class')e.className=v;else if(k==='text')e.textContent=v;else if(k.slice(0,2)==='on')e.addEventListener(k.slice(2),v);else e.setAttribute(k,v===true?'':v)}
 for(var i=2;i<arguments.length;i++){var c=arguments[i];if(c==null||c===false)continue;e.appendChild(typeof c==='string'?document.createTextNode(c):c)}return e}
function store(k,v){try{if(v===undefined)return localStorage.getItem(k);if(v===null)localStorage.removeItem(k);else localStorage.setItem(k,v)}catch(e){}return null}
var toastT;function toast(m,bad){var t=$('#toast');t.textContent=m;t.className='toast'+(bad?' bad':'');t.hidden=false;clearTimeout(toastT);toastT=setTimeout(function(){t.hidden=true},3200)}

if(!U||!K){$('#setup').hidden=false;return}

/* ================= auth & API ================= */
var session=null;try{session=JSON.parse(store('acg_admin_session')||'null')}catch(e){}
function saveSession(s){session=s;store('acg_admin_session',s?JSON.stringify(s):null)}
function setSession(j){saveSession({access_token:j.access_token,refresh_token:j.refresh_token,expires_at:Math.floor(Date.now()/1000)+(j.expires_in||3600),email:(j.user&&j.user.email)||(session&&session.email)||''})}
function authReq(grant,body){return fetch(U+'/auth/v1/token?grant_type='+grant,{method:'POST',headers:{apikey:K,'Content-Type':'application/json'},body:JSON.stringify(body)})}
function fresh(){
 if(!session)return Promise.reject(new Error('no session'));
 if(session.expires_at-Math.floor(Date.now()/1000)>60)return Promise.resolve(session.access_token);
 return authReq('refresh_token',{refresh_token:session.refresh_token}).then(function(r){if(!r.ok)throw new Error('expired');return r.json()}).then(function(j){setSession(j);return session.access_token})
}
function api(path,opt){
 opt=opt||{};
 return fresh().then(function(tok){
  var hd=Object.assign({apikey:K,Authorization:'Bearer '+tok},opt.headers||{});
  if(opt.json!==undefined){hd['Content-Type']='application/json';opt.body=JSON.stringify(opt.json)}
  return fetch(U+path,{method:opt.method||'GET',headers:hd,body:opt.body})
 }).then(function(r){
  if(r.status===401){logout();throw new Error('Session expirée')}
  if(!r.ok)return r.text().then(function(t){var m=t;try{m=JSON.parse(t).message||t}catch(e){}throw new Error(m||('Erreur '+r.status))});
  var ct=r.headers.get('content-type')||'';return ct.indexOf('json')>-1?r.json():null
 })
}
function logout(){saveSession(null);showLogin()}

/* ================= views switching ================= */
function showLogin(){$('#app').hidden=true;$('#login').hidden=false;$('#loginErr').hidden=true}
function showApp(){$('#login').hidden=true;$('#app').hidden=false;$('#who').textContent=session&&session.email||'';tab(store('acg_admin_tab')||'stats')}
$('#loginForm').addEventListener('submit',function(e){
 e.preventDefault();var f=e.target,b=$('button',f),er=$('#loginErr');er.hidden=true;b.disabled=true;
 authReq('password',{email:f.email.value.trim(),password:f.password.value}).then(function(r){return r.json().then(function(j){if(!r.ok)throw new Error(j.error_description||j.msg||'Échec');return j})})
 .then(function(j){setSession(j);f.password.value='';showApp()})
 .catch(function(x){er.textContent=/invalid|credentials/i.test(x.message)?'E-mail ou mot de passe incorrect.':x.message;er.hidden=false})
 .then(function(){b.disabled=false})
});
$('#logout').addEventListener('click',logout);
$('#tabs').addEventListener('click',function(e){var b=e.target.closest('button');if(b)tab(b.dataset.tab)});
function tab(t){
 store('acg_admin_tab',t);
 $$('#tabs button').forEach(function(b){b.classList.toggle('on',b.dataset.tab===t)});
 ['stats','news','project','contact'].forEach(function(v){$('#v-'+v).hidden=v!==t});
 ({stats:viewStats,news:function(){viewEntries('news')},project:function(){viewEntries('project')},contact:viewContact})[t]()
}
function loading(el){el.replaceChildren(h('p',{class:'muted',text:'Chargement…'}))}
function fail(el,e){el.replaceChildren(h('div',{class:'card'},h('p',{class:'err',text:'Erreur : '+e.message})))}

/* ================= STATS ================= */
var days=30;
var LANGS={fr:'Français',en:'English',ar:'العربية',es:'Español','?':'Inconnue'},DEV={mobile:'Mobile',tablet:'Tablette',desktop:'Ordinateur','?':'Inconnu'};
var PAGES={'/':'Accueil','/about':'À propos','/poles':'Nos pôles','/projects':'Projets & opportunités','/partners':'Partenariats','/news':'Actualités','/contact':'Contact'};
function nf(n){return Number(n||0).toLocaleString('fr-FR')}
function viewStats(){
 var el=$('#v-stats');loading(el);
 api('/rest/v1/rpc/visit_stats',{method:'POST',json:{days:days}}).then(function(s){
  var seg=h('div',{class:'seg'});[7,30,90].forEach(function(d){seg.appendChild(h('button',{class:d===days?'on':'',text:d+' jours',onclick:function(){days=d;viewStats()}}))});
  var off=store('acg_notrack')==='1';
  el.replaceChildren(
   h('div',{class:'v-head'},h('div',{},h('h1',{text:'Visiteurs'}),h('p',{class:'muted',text:'Statistiques du site sur les '+days+' derniers jours.'})),seg),
   h('div',{class:'kpis'},kpi('Pages vues',s.views),kpi('Visiteurs uniques',s.uniques),kpi('Pages vues aujourd’hui',s.today_views),kpi('Visiteurs aujourd’hui',s.today_uniques)),
   h('div',{class:'card'},h('h3',{text:'Activité par jour'}),chart(s.daily),h('div',{class:'legend'},h('span',{},h('i',{style:'background:#bcd2f5'}),'Pages vues'),h('span',{},h('i',{style:'background:var(--gold)'}),'Visiteurs uniques'))),
   h('div',{class:'grid2'},list('Pages les plus vues',s.pages,function(l){return PAGES[l.replace(/\/$/,'')||'/']||l}),list('Sources de trafic',s.sources,function(l){return l==='direct'?'Accès direct':l})),
   h('div',{class:'grid2'},list('Langues',s.langs,function(l){return LANGS[l]||l}),list('Appareils',s.devices,function(l){return DEV[l]||l})),
   h('div',{class:'card'},h('label',{class:'chk'},h('input',{type:'checkbox',checked:off,onchange:function(e){store('acg_notrack',e.target.checked?'1':null);toast(e.target.checked?'Vos visites ne seront plus comptées sur cet appareil.':'Vos visites sont de nouveau comptées.')}}),'Ne pas compter mes visites sur cet appareil'),h('p',{class:'note',text:'Les visites de cette page d’administration ne sont jamais comptées. Les robots et moteurs de recherche sont exclus.'}))
  )
 }).catch(function(e){fail(el,e)})
}
function kpi(l,v){return h('div',{class:'kpi'},h('small',{text:l}),h('b',{text:nf(v)}))}
function list(title,rows,fmt){
 var max=Math.max.apply(null,rows.map(function(r){return r.n}).concat([1])),box=h('div',{class:'lst'});
 if(!rows.length)box.appendChild(h('p',{class:'note',text:'Aucune donnée pour le moment.'}));
 rows.forEach(function(r){box.appendChild(h('div',{class:'lrow'},h('span',{text:fmt(r.label),title:r.label}),h('b',{text:nf(r.n)}),h('span',{class:'meter'},h('i',{style:'width:'+Math.max(2,r.n/max*100)+'%'}))))});
 return h('div',{class:'card'},h('h3',{text:title}),box)
}
function chart(daily){
 var W=800,Ht=230,pl=34,pb=24,pt=10,n=daily.length,iw=W-pl-8,ih=Ht-pb-pt;
 var max=Math.max.apply(null,daily.map(function(d){return d.views}).concat([1]));
 var step=max<=5?1:Math.pow(10,Math.floor(Math.log10(max/4)));var m=Math.ceil(max/step)*step;if(m/step>8){step*=2;m=Math.ceil(max/step)*step}
 var NS='http://www.w3.org/2000/svg',svg=document.createElementNS(NS,'svg');svg.setAttribute('viewBox','0 0 '+W+' '+Ht);svg.setAttribute('class','chart');svg.setAttribute('role','img');svg.setAttribute('aria-label','Pages vues par jour');
 function mk(t,a,tx){var e=document.createElementNS(NS,t);for(var k in a)e.setAttribute(k,a[k]);if(tx!=null)e.textContent=tx;svg.appendChild(e);return e}
 for(var v=0;v<=m;v+=step){var y=pt+ih-(v/m)*ih;mk('line',{x1:pl,x2:W-8,y1:y,y2:y,class:'gl'});mk('text',{x:pl-6,y:y+4,'text-anchor':'end'},v)}
 var bw=iw/n,pts=[];
 daily.forEach(function(d,i){var bh=(d.views/m)*ih,x=pl+i*bw,y=pt+ih-bh;
  var r=mk('rect',{x:x+bw*.14,y:y,width:Math.max(1,bw*.72),height:Math.max(0,bh),rx:Math.min(4,bw*.2),class:'bar'});
  var t=document.createElementNS(NS,'title');t.textContent=d.day.split('-').reverse().join('/')+' — '+d.views+' vues, '+d.uniques+' visiteurs';r.appendChild(t);
  pts.push([x+bw/2,pt+ih-(d.uniques/m)*ih]);
  var every=n>45?10:n>16?5:1;if(i%every===0||i===n-1){var p=d.day.split('-');mk('text',{x:x+bw/2,y:Ht-6,'text-anchor':'middle'},p[2]+'/'+p[1])}
 });
 mk('polyline',{points:pts.map(function(p){return p[0].toFixed(1)+','+p[1].toFixed(1)}).join(' '),class:'ln'});
 if(n<=31)pts.forEach(function(p){mk('circle',{cx:p[0],cy:p[1],r:2.5,class:'dt'})});
 return svg
}

/* ================= ENTRIES (news / projects) ================= */
var KIND={news:{one:'actualité',new:'Nouvelle actualité',title:'Actualités',sub:'Publiez des nouvelles : elles apparaissent sur la page « Actualités » du site.',add:'Ajouter une actualité'},
          project:{one:'projet',new:'Nouveau projet',title:'Projets & opportunités',sub:'Publiez des projets ou opportunités : ils apparaissent sur la page « Projets & opportunités ».',add:'Ajouter un projet'}};
var LG=[['fr','Français'],['en','English'],['ar','العربية'],['es','Español']];
function fdate(s){try{return new Date(s).toLocaleDateString('fr-FR',{day:'numeric',month:'short',year:'numeric'})}catch(e){return ''}}
function viewEntries(kind){
 var el=$('#v-'+kind),k=KIND[kind];loading(el);
 api('/rest/v1/entries?kind=eq.'+kind+'&order=created_at.desc&select=*').then(function(rows){
  var box=h('div',{class:'lst',style:'gap:.7rem'});
  if(!rows.length)box.appendChild(h('div',{class:'empty-l',text:'Aucune '+k.one+' pour le moment. Cliquez sur « '+k.add+' » pour commencer.'}));
  rows.forEach(function(r){
   var th=r.image_url?h('img',{class:'thumb',src:r.image_url,alt:'',loading:'lazy'}):h('div',{class:'thumb',text:'Sans image'});
   box.appendChild(h('div',{class:'erow'},th,
    h('div',{},h('h3',{text:(r.title&&r.title.fr)||'(sans titre)'}),h('div',{class:'meta'},h('span',{class:'badge'+(r.published?'':' off'),text:r.published?'Publié':'Masqué'}),h('span',{text:fdate(r.created_at)}),h('span',{text:LG.filter(function(l){return r.title&&r.title[l[0]]}).map(function(l){return l[0].toUpperCase()}).join(' · ')}))),
    h('div',{class:'acts'},
     h('button',{class:'btn ghost sm',text:'Modifier',onclick:function(){editor(kind,r)}}),
     h('button',{class:'btn ghost sm',text:r.published?'Masquer':'Publier',onclick:function(){api('/rest/v1/entries?id=eq.'+r.id,{method:'PATCH',json:{published:!r.published,updated_at:new Date().toISOString()}}).then(function(){toast(r.published?'Masqué du site.':'Publié sur le site.');viewEntries(kind)}).catch(function(e){toast(e.message,1)})}}),
     h('button',{class:'btn danger sm',text:'Supprimer',onclick:function(){if(!confirm('Supprimer définitivement cette '+k.one+' ?'))return;
      api('/rest/v1/entries?id=eq.'+r.id,{method:'DELETE'}).then(function(){return removeImg(r.image_path)}).then(function(){toast('Supprimé.');viewEntries(kind)}).catch(function(e){toast(e.message,1)})}}))))
  });
  el.replaceChildren(h('div',{class:'v-head'},h('div',{},h('h1',{text:k.title}),h('p',{class:'muted',text:k.sub})),h('button',{class:'btn primary',text:'+ '+k.add,onclick:function(){editor(kind,null)}})),box)
 }).catch(function(e){fail(el,e)})
}
function removeImg(path){return path?api('/storage/v1/object/media/'+path,{method:'DELETE'}).catch(function(){}):Promise.resolve()}
function resize(file){
 return new Promise(function(res,rej){
  if(!/^image\//.test(file.type))return rej(new Error('Le fichier doit être une image.'));
  if(/gif|svg/.test(file.type)){if(file.size>5e6)return rej(new Error('Image trop lourde (5 Mo max).'));return res({blob:file,ext:file.type.indexOf('gif')>-1?'gif':'svg'})}
  var img=new Image(),u=URL.createObjectURL(file);
  img.onload=function(){var M=1600,s=Math.min(1,M/Math.max(img.width,img.height)),c=document.createElement('canvas');c.width=Math.round(img.width*s);c.height=Math.round(img.height*s);
   var x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);x.drawImage(img,0,0,c.width,c.height);URL.revokeObjectURL(u);
   c.toBlob(function(b){b?res({blob:b,ext:'jpg'}):rej(new Error('Conversion impossible.'))},'image/jpeg',.85)};
  img.onerror=function(){URL.revokeObjectURL(u);rej(new Error('Image illisible.'))};img.src=u})
}
function upload(kind,file){
 return resize(file).then(function(o){
  var path=kind+'/'+Date.now()+'-'+Math.random().toString(36).slice(2,8)+'.'+o.ext;
  return api('/storage/v1/object/media/'+path,{method:'POST',body:o.blob,headers:{'Content-Type':o.blob.type||'image/jpeg','x-upsert':'false'}}).then(function(){return {path:path,url:U+'/storage/v1/object/public/media/'+path}})})
}
function editor(kind,row){
 var k=KIND[kind],data={title:Object.assign({},row&&row.title),body:Object.assign({},row&&row.body)},cur='fr',img={url:row&&row.image_url||null,path:row&&row.image_path||null,file:null,removed:false};
 var tabs=h('div',{class:'langtabs'}),ti=h('input',{type:'text',maxlength:'200'}),bo=h('textarea'),prev=h('div'),err=h('p',{class:'err',hidden:true}),pub=h('input',{type:'checkbox'});
 pub.checked=row?row.published:true;
 function sync(){data.title[cur]=ti.value.trim();data.body[cur]=bo.value.trim()}
 function drawTabs(){tabs.replaceChildren.apply(tabs,LG.map(function(l){var done=(data.title[l[0]]||'').trim();var b=h('button',{type:'button',class:l[0]===cur?'on':'',onclick:function(){sync();cur=l[0];load();drawTabs()}},l[1]);if(done&&l[0]!==cur)b.appendChild(h('i',{text:'✓'}));return b}))}
 function load(){ti.value=data.title[cur]||'';bo.value=data.body[cur]||'';var rtl=cur==='ar';ti.dir=bo.dir=rtl?'rtl':'ltr';ti.placeholder=cur==='fr'?'Titre (obligatoire)':'Titre (facultatif — le français sera utilisé à défaut)';bo.placeholder=cur==='fr'?'Texte…':'Texte (facultatif)'}
 var file=h('input',{type:'file',accept:'image/*',hidden:true,onchange:function(e){var f=e.target.files[0];if(!f)return;img.file=f;img.removed=false;drawImg()}});
 function drawImg(){
  var src=img.file?URL.createObjectURL(img.file):(!img.removed&&img.url)||null;
  prev.className='imgbox';
  prev.replaceChildren.apply(prev,[src?h('img',{src:src,alt:''}):null,h('div',{},h('div',{class:'hint',text:src?'Image jointe (facultatif).':'Aucune image — c’est facultatif. Vous pouvez en ajouter une si vous le souhaitez.'}),h('div',{style:'display:flex;gap:.5rem;margin-top:.5rem;flex-wrap:wrap'},
   h('button',{type:'button',class:'btn ghost sm',text:src?'Changer l’image':'Ajouter une image',onclick:function(){file.value='';file.click()}}),
   src?h('button',{type:'button',class:'btn danger sm',text:'Retirer l’image',onclick:function(){img.file=null;img.removed=true;drawImg()}}):null))].filter(Boolean))
 }
 var save=h('button',{class:'btn primary',type:'button',text:'Enregistrer'});
 save.addEventListener('click',function(){
  sync();err.hidden=true;
  if(!data.title.fr){err.textContent='Le titre en français est obligatoire.';err.hidden=false;if(cur!=='fr'){cur='fr';load();drawTabs()}ti.focus();return}
  if(!data.body.fr&&!data.title.fr){return}
  save.disabled=true;save.textContent='Enregistrement…';
  var clean=function(o){var r={};LG.forEach(function(l){if(o[l[0]])r[l[0]]=o[l[0]]});return r};
  var up=img.file?upload(kind,img.file):Promise.resolve(null);
  up.then(function(u){
   var rec={kind:kind,title:clean(data.title),body:clean(data.body),published:pub.checked,updated_at:new Date().toISOString()},oldPath=row&&row.image_path;
   if(u){rec.image_url=u.url;rec.image_path=u.path}else if(img.removed){rec.image_url=null;rec.image_path=null}
   var p=row?api('/rest/v1/entries?id=eq.'+row.id,{method:'PATCH',json:rec}):api('/rest/v1/entries',{method:'POST',json:rec,headers:{Prefer:'return=minimal'}});
   return p.then(function(){return (u||img.removed)?removeImg(oldPath):null})
  }).then(function(){closeModal();toast('Enregistré.');viewEntries(kind)})
  .catch(function(e){err.textContent='Erreur : '+e.message;err.hidden=false;save.disabled=false;save.textContent='Enregistrer'})
 });
 drawTabs();load();drawImg();
 openModal(h('div',{style:'display:contents'},
  h('h2',{text:row?'Modifier l’'+k.one:k.new}),
  h('div',{},tabs),
  h('label',{},'Titre',ti),h('label',{},'Texte',bo),
  h('div',{},h('b',{style:'font-size:.86rem;color:var(--navy)',text:'Image (facultatif)'}),prev,file),
  h('label',{class:'chk'},pub,'Publier sur le site'),
  err,
  h('div',{class:'foot'},h('button',{class:'btn ghost',type:'button',text:'Annuler',onclick:closeModal}),save)))
}
function openModal(c){var b=$('#modalBox');b.replaceChildren(c);$('#modal').hidden=false;document.body.style.overflow='hidden';setTimeout(function(){var i=$('input[type=text]',b);i&&i.focus()},30)}
function closeModal(){$('#modal').hidden=true;document.body.style.overflow=''}
$('#modal').addEventListener('mousedown',function(e){if(e.target.id==='modal')closeModal()});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!$('#modal').hidden)closeModal()});

/* ================= CONTACT SETTINGS ================= */
function viewContact(){
 var el=$('#v-contact');loading(el);
 api('/rest/v1/settings?id=eq.1&select=*').then(function(r){
  var s=r[0]||{};
  function fld(name,label,type,hint,ph){return h('label',{},label,h('input',{type:type,name:name,value:s[name]||'',placeholder:ph||'',autocomplete:'off'}),hint?h('span',{class:'note',text:hint}):null)}
  var f=h('form',{class:'card form-grid',novalidate:true},
   fld('email','Adresse e-mail','email','Affichée dans l’en-tête, le pied de page et les pages de contact. Reçoit aussi les messages du formulaire.','contact@exemple.com'),
   fld('whatsapp','Numéro WhatsApp','text','Utilisé par les boutons WhatsApp et le formulaire. Format international.','+243 899 639 009'),
   h('div',{class:'two'},fld('phone1','Téléphone principal (RDC)','text','','+243 899 639 009'),fld('phone2','Téléphone secondaire (Algérie)','text','','+213 793 338 879')),
   h('p',{class:'err',hidden:true,id:'cErr'}),
   h('div',{},h('button',{class:'btn primary',type:'submit',text:'Enregistrer les modifications'})));
  f.addEventListener('submit',function(e){
   e.preventDefault();var er=$('#cErr'),v=function(n){return f[n].value.trim()},b=$('button',f);er.hidden=true;
   var bad=null;if(!/^\S+@\S+\.\S+$/.test(v('email')))bad='Adresse e-mail invalide.';
   ['whatsapp','phone1','phone2'].forEach(function(n){if(!bad&&v(n)&&(!/^\+?[\d\s().-]+$/.test(v(n))||v(n).replace(/\D/g,'').length<7))bad='Numéro invalide : '+v(n)});
   if(!bad&&!v('whatsapp'))bad='Le numéro WhatsApp est obligatoire.';
   if(!bad&&!v('phone1'))bad='Le téléphone principal est obligatoire.';
   if(bad){er.textContent=bad;er.hidden=false;return}
   b.disabled=true;
   api('/rest/v1/settings?id=eq.1',{method:'PATCH',json:{email:v('email'),whatsapp:v('whatsapp'),phone1:v('phone1'),phone2:v('phone2')||null,updated_at:new Date().toISOString()}})
   .then(function(){toast('Coordonnées mises à jour sur le site.')}).catch(function(x){er.textContent='Erreur : '+x.message;er.hidden=false}).then(function(){b.disabled=false})
  });
  el.replaceChildren(h('div',{class:'v-head'},h('div',{},h('h1',{text:'Coordonnées'}),h('p',{class:'muted',text:'Modifiez les informations de contact affichées partout sur le site (4 langues).'}))),f)
 }).catch(function(e){fail(el,e)})
}

/* ================= boot ================= */
if(session){fresh().then(showApp).catch(showLogin)}else showLogin();
})();
