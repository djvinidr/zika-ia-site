'use strict';
/* Conta e senha demonstrativas SOMENTE para a prévia offline.
   NUNCA use estas credenciais para identificar desenvolvedores no site público.
   A produção usa Supabase + lista de UUIDs no backend. */
(function(){
  const $=s=>document.querySelector(s);
  const ACC='zika_demo_users_v1', SES='zika_demo_session_v1';
  const texts={
    pt:{sign:'Entrar / Criar conta',me:'Minha conta',developer:'DESENVOLVEDOR',free:'CONTA GRÁTIS',title:'Acesso local de demonstração',login:'Entrar',signup:'Criar conta',email:'E-mail',password:'Senha (mín. 8 caracteres)',loginBtn:'Entrar',signupBtn:'Cadastrar',hint:'Este login vale apenas neste navegador. Não é uma conta Supabase nem protege pagamentos.',owner:'Criar como minha conta de DESENVOLVEDOR local (sem créditos e sem marca d’água)',already:'Já existe uma conta desenvolvedora local neste navegador.',created:'Conta local criada. Você entrou.',wrong:'E-mail ou senha incorretos.',duplicate:'Este e-mail já está cadastrado neste navegador.',signedOut:'Você saiu da conta.',signout:'Sair da conta?',storage:'Armazenamento local ou criptografia indisponível. Abra em localhost.',choose:'Entre ou crie uma conta para continuar.',welcome:'Bem-vindo ao modo desenvolvedor local. Aqui não há cobrança nem limite de créditos.',secure:'Proteção real do desenvolvedor somente com Supabase e permissão no servidor.'},
    en:{sign:'Sign in / Create account',me:'My account',developer:'DEVELOPER',free:'FREE ACCOUNT',title:'Local demo sign-in',login:'Sign in',signup:'Sign up',email:'Email',password:'Password (8 characters minimum)',loginBtn:'Sign in',signupBtn:'Create account',hint:'This login exists only in your browser. It is not a Supabase account and cannot secure billing.',owner:'Create as my local DEVELOPER account (unlimited credits, no watermark)',already:'A local developer account already exists in this browser.',created:'Local account created. Signed in.',wrong:'Wrong email or password.',duplicate:'This email is already registered in this browser.',signedOut:'Signed out.',signout:'Sign out?',storage:'Local storage or cryptography unavailable. Try localhost.',choose:'Sign in or create an account to continue.',welcome:'Welcome to local developer mode. No charge and no credit limit here.',secure:'Real developer permissions require Supabase and server-side authorization.'},
    es:{sign:'Entrar / Crear cuenta',me:'Mi cuenta',developer:'DESARROLLADOR',free:'CUENTA GRATIS',title:'Acceso de demostración local',login:'Entrar',signup:'Crear cuenta',email:'Correo',password:'Contraseña (mín. 8 caracteres)',loginBtn:'Entrar',signupBtn:'Crear cuenta',hint:'Este acceso solo funciona en este navegador. No es una cuenta Supabase ni protege pagos.',owner:'Crear como mi cuenta de DESARROLLADOR local (sin límite y sin marca de agua)',already:'Ya existe un desarrollador local en este navegador.',created:'Cuenta local creada.',wrong:'Correo o contraseña incorrectos.',duplicate:'Esta dirección ya existe en este navegador.',signedOut:'Sesión cerrada.',signout:'¿Cerrar sesión?',storage:'El almacenamiento o cifrado local no está disponible. Prueba localhost.',choose:'Inicia sesión o crea una cuenta para continuar.',welcome:'Modo de desarrollo local: sin cobros ni límite de créditos.',secure:'La autorización real requiere Supabase y permisos del servidor.'}
  };
  const language=()=>document.documentElement.lang.startsWith('en')?'en':document.documentElement.lang.startsWith('es')?'es':'pt';
  const t=k=>texts[language()][k];
  let selected=null,mode='login',listeners=[];
  function store(){try{return JSON.parse(localStorage.getItem(ACC)||'{}')}catch{return {}}}
  function save(accounts){localStorage.setItem(ACC,JSON.stringify(accounts))}
  function current(){return selected ? store()[selected]||null : null}
  function emit(){listeners.forEach(fn=>fn(current()));paint()}
  function subscribe(fn){listeners.push(fn)}
  function encode(bytes){return btoa(String.fromCharCode(...bytes))}
  function decode(str){return Uint8Array.from(atob(str),ch=>ch.charCodeAt(0))}
  async function digest(password,salt){
    if(!crypto.subtle)throw Error(t('storage'));
    const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(password),'PBKDF2',false,['deriveBits']);
    const bits=await crypto.subtle.deriveBits({name:'PBKDF2',hash:'SHA-256',salt:decode(salt),iterations:180000},key,256);
    return encode(new Uint8Array(bits));
  }
  function setCredits(value){if(!selected)return;const accounts=store(),a=accounts[selected];if(!a||a.role!=='free')return;a.credits=Math.max(0,Math.min(3,value));save(accounts);emit()}
  function toast(msg){const e=$('#toast');if(!e)return;e.textContent=msg;e.hidden=false;setTimeout(()=>e.hidden=true,6000)}
  function showAuth(){paint();$('#authMessage').textContent=t('hint');const dlg=$('#authDialog');if(!dlg.open)dlg.showModal();$('#authEmail').focus()}
  function switchMode(next){mode=next;$('#loginTab').classList.toggle('active',mode==='login');$('#signupTab').classList.toggle('active',mode==='signup');$('#authMessage').textContent=t('hint');paint()}
  function paint(){
    const account=current();
    $('#accountButton').textContent=account?`${selected.split('@')[0]} · ${t('me')}`:t('sign');
    const devBadge=$('#devRoleBadge');if(devBadge){devBadge.hidden=!account||account.role!=='developer';devBadge.textContent=t('developer')}
    $('#authTitle').textContent=t('title');$('#loginTab').textContent=t('login');$('#signupTab').textContent=t('signup');
    $('#authEmailLabel').textContent=t('email');$('#authPassLabel').textContent=t('password');
    $('#authSubmit').textContent=mode==='login'?t('loginBtn'):t('signupBtn');
    $('#authPassword').autocomplete=mode==='login'?'current-password':'new-password';
    const opt=$('#demoDevOption'),label=$('#demoDevLabel');
    if(label)label.textContent=t('owner');
    if(opt){const hasDev=Object.values(store()).some(a=>a.role==='developer');opt.closest('.demo-dev-opt').hidden=mode!=='signup'||hasDev;if(hasDev)opt.checked=false}
    const hint=$('#demoAuthHint');if(hint)hint.textContent=`${t('hint')} ${t('secure')}`;
  }
  async function submit(ev){
    ev.preventDefault();ev.stopImmediatePropagation();
    const email=$('#authEmail').value.trim().toLowerCase(),pass=$('#authPassword').value;
    const message=$('#authMessage'),btn=$('#authSubmit');
    if(pass.length<8){message.textContent=t('password');return}
    btn.disabled=true;
    try{
      const accounts=store();
      if(mode==='signup'){
        if(accounts[email])throw Error(t('duplicate'));
        const dev=Boolean($('#demoDevOption')?.checked)&&!Object.values(accounts).some(a=>a.role==='developer');
        const salt=encode(crypto.getRandomValues(new Uint8Array(16)));
        accounts[email]={email,role:dev?'developer':'free',salt,hash:await digest(pass,salt),credits:3};
        save(accounts);
      }else{
        const user=accounts[email];
        if(!user||await digest(pass,user.salt)!==user.hash)throw Error(t('wrong'));
      }
      selected=email;sessionStorage.setItem(SES,email);$('#authPassword').value='';$('#authDialog').close();emit();toast(current()?.role==='developer'?t('welcome'):t('created'));
    }catch(e){message.textContent=e.message||t('storage')}
    finally{btn.disabled=false;paint()}
  }
  function init(){
    try{const remembered=sessionStorage.getItem(SES);if(remembered&&store()[remembered])selected=remembered}catch{}
    const account=$('#accountButton');
    document.addEventListener('click',e=>{if(e.target.closest('#accountButton')){
      e.preventDefault();e.stopImmediatePropagation();
      if(selected){if(confirm(t('signout'))){selected=null;sessionStorage.removeItem(SES);emit();toast(t('signedOut'))}}
      else showAuth();
    }else if(e.target.closest('#loginTab')){e.preventDefault();e.stopImmediatePropagation();switchMode('login')}
     else if(e.target.closest('#signupTab')){e.preventDefault();e.stopImmediatePropagation();switchMode('signup')}
    },true);
    document.addEventListener('submit',e=>{if(e.target.id==='authForm')submit(e)},true);
    document.querySelectorAll('.lang-btn').forEach(b=>b.addEventListener('click',()=>queueMicrotask(paint)));
    paint();emit();
  }
  window.ZikaDemoAuth={current,subscribe,setCredits,open:showAuth,paint,t};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
