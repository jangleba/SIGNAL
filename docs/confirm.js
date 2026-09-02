(() => {
  const offers = {
    termomodernizacja: { company:"TermoPilot", title:"Kompleksowa termomodernizacja domu", short:"Termomodernizacja domu", description:"Pompa ciepła, fotowoltaika oraz montaż po sprawdzeniu parametrów budynku.", region:"Warszawa i okolice do 60 km", cost:"45–75 tys. zł brutto", condition:"Dotacja nie jest gwarantowana", needs:["Pełna termomodernizacja","Pompa ciepła","Fotowoltaika","Najpierw konsultacja"] },
    "pompa-ciepla": { company:"TermoPilot", title:"Dobór i montaż pompy ciepła", short:"Pompa ciepła", description:"Dobór urządzenia, instalacja i uruchomienie po analizie budynku.", region:"Warszawa i okolice do 60 km", cost:"28–45 tys. zł brutto", condition:"Dobór mocy po analizie budynku", needs:["Wymiana ogrzewania","Pompa do nowego domu","Modernizacja instalacji","Najpierw dobór mocy"] },
    fotowoltaika: { company:"TermoPilot", title:"Fotowoltaika dobrana do zużycia", short:"Fotowoltaika", description:"Projekt i montaż po analizie rachunków, dachu i możliwości przyłączeniowych.", region:"Warszawa i okolice do 60 km", cost:"18–35 tys. zł brutto", condition:"Moc instalacji po analizie zużycia", needs:["Instalacja dla domu","Fotowoltaika z magazynem","Rozbudowa instalacji","Analiza opłacalności"] }
  };
  const sourceNames = { instagram:"Instagramie", facebook:"Facebooku", tiktok:"TikToku", google:"Google", www:"stronie firmy", direct:"linku bezpośrednim" };
  const params = new URLSearchParams(location.search);
  const offerKey = offers[params.get("offer")] ? params.get("offer") : "termomodernizacja";
  const offer = offers[offerKey];
  const sourceKey = sourceNames[params.get("source")] ? params.get("source") : "instagram";
  const sourcePlain = {instagram:"Instagram",facebook:"Facebook",tiktok:"TikTok",google:"Google",www:"Strona WWW",direct:"Link bezpośredni"}[sourceKey];
  const campaign = (params.get("campaign") || "kampania-demo").replace(/[^\p{L}\p{N} _-]/gu, "").slice(0, 48);
  const state = { need:"", location:"", action:"", duration:"", slot:"" };
  let current = "start"; const history = [];
  const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const safe = v => String(v || "").replace(/[&<>'"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
  const setText = (s,v) => { const n=$(s); if(n) n.textContent=v; };
  setText("[data-company]",offer.company); setText("[data-region]",offer.region); setText("[data-title]",offer.title); setText("[data-description]",offer.description); setText("[data-cost]",offer.cost); setText("[data-condition]",offer.condition); setText("[data-source-label]",`Reklama na ${sourceNames[sourceKey]}`); setText("[data-consent]",`Proszę wyłącznie ${offer.company} o kontakt w wybranej sprawie i terminie.`);
  $("[data-needs]").innerHTML = offer.needs.map(n => `<button type="button" data-need="${safe(n)}"><strong>${safe(n)}</strong><i>✓</i></button>`).join("");

  function show(screen, remember=true){ if(remember && screen!==current) history.push(current); current=screen; $$('[data-screen]').forEach(n=>{const a=n.dataset.screen===screen;n.hidden=!a;n.classList.toggle('active',a)}); const step=screen==='start'?1:screen==='details'?2:3; $$('.confirm-progress i').forEach((n,i)=>n.classList.toggle('active',i<step)); scrollTo({top:0,behavior:'smooth'}); }
  function close(){ if(window.history.length>1 && document.referrer) window.history.back(); else location.href='zamkniete.html'; }
  $$('[data-close]').forEach(b=>b.addEventListener('click',close)); $$('[data-back]').forEach(b=>b.addEventListener('click',()=>show(history.pop()||'start',false)));
  $$('[data-intent]').forEach(b=>b.addEventListener('click',()=>show(b.dataset.intent==='interested'?'details':b.dataset.intent)));
  $('[data-change-mind]').addEventListener('click',()=>show('details',false));
  function select(group,button){ $$(group).forEach(n=>n.classList.toggle('selected',n===button)); }
  $$('[data-need]').forEach(b=>b.addEventListener('click',()=>{state.need=b.dataset.need;select('[data-need]',b);validateDetails()}));
  $$('[data-action]').forEach(b=>b.addEventListener('click',()=>{state.action=b.dataset.action;state.duration=b.dataset.duration;select('[data-action]',b);validateDetails()}));
  $('#confirmLocation').addEventListener('input',validateDetails);
  function validateDetails(){ $('[data-next-contact]').disabled=!(state.need&&state.action&&$('#confirmLocation').value.trim().length>=2); }
  $('[data-next-contact]').addEventListener('click',()=>{state.location=$('#confirmLocation').value.trim();if(!(state.need&&state.action&&state.location.length>=2))return;show('contact');renderSummary()});
  $$('[data-slot]').forEach(b=>b.addEventListener('click',()=>{state.slot=b.dataset.slot;select('[data-slot]',b);renderSummary()}));
  function renderSummary(){ $('[data-summary]').innerHTML=`<span>Twoje ustalenia</span><strong>${safe(state.action||'Wybierz działanie')} · ${safe(state.slot||'wybierz termin')}</strong><small>${safe(state.need)} · ${safe(state.location)}</small>`; }
  const digits=v=>v.replace(/\D/g,'');
  $('[data-send-code]').addEventListener('click',()=>{const name=$('#confirmName').value.trim(),phone=$('#confirmPhone').value.trim(),consent=$('#confirmConsent').checked,error=$('[data-contact-error]');error.textContent='';if(!state.slot)return void(error.textContent='Wybierz dogodny termin.');if(name.length<2)return void(error.textContent='Podaj imię.');if(digits(phone).length!==9)return void(error.textContent='Podaj dziewięciocyfrowy numer telefonu.');if(!consent)return void(error.textContent='Potwierdź dokładnie opisany cel kontaktu.');$('[data-otp]').hidden=false;$('[data-otp-input]').focus()});
  $('[data-confirm]').addEventListener('click',()=>{const error=$('[data-contact-error]');if($('[data-otp-input]').value.trim()!=='4821')return void(error.textContent='W demonstracji wpisz kod 4821.');const name=$('#confirmName').value.trim(),phone=$('#confirmPhone').value.trim(),now=new Date(),displayed=new Intl.DateTimeFormat('pl-PL',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'}).format(now),consent=`Proszę wyłącznie ${offer.company} o kontakt w sprawie „${state.need}”, aby wykonać „${state.action}”, w terminie ${state.slot}.`;const saved=window.SignalStore&&window.SignalStore.saveRecord({name,phone,status:'new',statusLabel:'Nowe',need:state.need,location:state.location,action:state.action,duration:state.duration,time:state.slot,channel:'Telefon',offerKey,offer:offer.short,cost:offer.cost,condition:offer.condition,sourceKey,source:sourcePlain,campaign,entry:'Link SIGNAL',entryKey:'link',placement:params.get('placement')||'reklama',origin:'Bezpośrednio z reklamy przez SIGNAL',consent,opened:displayed,selected:displayed,confirmed:displayed,createdAt:now.toISOString()});setText('[data-success-text]',`${name}, ${offer.company} skontaktuje się wyłącznie w sprawie „${state.action}” w terminie ${state.slot.toLowerCase()}.`);$('[data-ticket]').innerHTML=`<div><span>Potrzeba</span><strong>${safe(state.need)}</strong></div><div><span>Miejsce</span><strong>${safe(state.location)}</strong></div><div><span>Termin</span><strong>${safe(state.slot)}</strong></div><div><span>Numer sprawy</span><strong>${safe(saved?saved.id:'SG-DEMO')}</strong></div>`;history.length=0;show('success',false)});
})();
