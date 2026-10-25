'use strict';
/* Zika IA Cloud: real Supabase login + server-sourced credits + Mercado Pago checkout.
   Never trust a plan/credit balance controlled in the browser.
*/
(function(){
  const cfg=window.ZIKA_CONFIG||{};
  const $=s=>document.querySelector(s);
  const $$=s=>Array.from(document.querySelectorAll(s));
  const words={
    pt:{sign:'Entrar / Criar conta',account:'Minha conta',logout:'Sair',balance:'Saldo',daily:'Testes gratuitos restantes hoje',login:'Entrar',signup:'Criar conta',email:'Seu e-mail',pass:'Senha',modal:'Minha conta Zika IA',send:'Entrar',create:'Cadastrar',working:'Processando...',need:'Faça login para continuar.',configured:'Configure as chaves do Supabase e a URL da API para ativar o login.',checkoutOff:'Checkout indisponível: conecte Mercado Pago e a API.',cloudOff:'Conecte a API e a GPU para melhorar imagens na nuvem.',cost:'Custo estimado',credit:'crédito',credits:'créditos',forfiles:'para',files:'imagens',free:'Grátis com marca d’água',paid:'Plano pago: sem marca d’água',confirm:'Enviado. Confirme seu e-mail e depois faça login.',fail:'Não foi possível entrar ou cadastrar.',accountCheck:'Consultando créditos...',buyWait:'Abrindo checkout...',done:'Imagem processada e baixada.',failGPU:'Falha ao processar. O servidor deve devolver seus créditos.',processing:'Processando',choose:'Escolha imagens primeiro.',limit:'Limite gratuito esgotado ou créditos insuficientes.',preview:'Prévia do site: valores sugeridos, cobrança ainda não ativada.'},
    en:{sign:'Sign in / Sign up',account:'My account',logout:'Log out',balance:'Balance',daily:'Free uses left today',login:'Sign in',signup:'Sign up',email:'Your email',pass:'Password',modal:'My Zika IA account',send:'Sign in',create:'Create account',working:'Processing...',need:'Sign in to continue.',configured:'Set Supabase credentials and API URL to enable sign-in.',checkoutOff:'Checkout unavailable: connect Mercado Pago and API.',cloudOff:'Connect the API and GPU to process cloud images.',cost:'Estimated cost',credit:'credit',credits:'credits',forfiles:'for',files:'images',free:'Free with watermark',paid:'Paid plan: no watermark',confirm:'Sent. Confirm your email, then sign in.',fail:'Sign-in or registration failed.',accountCheck:'Checking credits...',buyWait:'Opening checkout...',done:'Image processed and downloaded.',failGPU:'Processing failed. Your credits should be refunded by the server.',processing:'Processing',choose:'Choose images first.',limit:'Free limit reached or insufficient credits.',preview:'SaaS preview: proposed prices; payments not yet live.'},
    es:{sign:'Entrar / Crear cuenta',account:'Mi cuenta',logout:'Salir',balance:'Saldo',daily:'Pruebas gratuitas restantes hoy',login:'Entrar',signup:'Crear cuenta',email:'Tu correo',pass:'Contraseña',modal:'Mi cuenta Zika IA',send:'Entrar',create:'Crear cuenta',working:'Procesando...',need:'Inicia sesión para continuar.',configured:'Configura Supabase y la URL de API para habilitar el acceso.',checkoutOff:'Pago no disponible: conecta Mercado Pago y API.',cloudOff:'Conecta API y GPU para procesar imágenes.',cost:'Costo estimado',credit:'crédito',credits:'créditos',forfiles:'para',files:'imágenes',free:'Gratis con marca de agua',paid:'Plan de pago: sin marca de agua',confirm:'Enviado. Confirma tu correo y vuelve a entrar.',fail:'No se pudo acceder o registrar.',accountCheck:'Consultando créditos...',buyWait:'Abriendo pago...',done:'Imagen procesada y descargada.',failGPU:'Error al procesar. El servidor debe reembolsar los créditos.',processing:'Procesando',choose:'Selecciona imágenes primero.',limit:'Límite gratuito agotado o créditos insuficientes.',preview:'Vista previa: precios propuestos, pagos aún no activos.'}
  };

  // Regras finais e textos de assinatura (PT/EN/ES).
  Object.assign(words.pt,{daily:'Créditos grátis restantes',free:'Grátis • marca d’água',creditsExpired:'Créditos não acumulam',renewAt:'Próxima reposição',cancel:'Cancelar renovação automática',cancelAsk:'Cancelar as próximas cobranças? Você mantém o acesso até o fim do período pago.',cancelDone:'Renovação cancelada. Seu acesso permanece até o vencimento.',cancelOff:'Cancelamento indisponível enquanto pagamentos não estão ativos.',preview:'Prévia comercial. Assinaturas ainda não ativadas: precisamos conectar e testar pagamentos, banco e GPU.'});
  Object.assign(words.en,{daily:'Free credits remaining',free:'Free • watermark',creditsExpired:'Credits do not roll over',renewAt:'Next credit refill',cancel:'Cancel automatic renewal',cancelAsk:'Stop future charges? Your plan remains available until the end of the paid period.',cancelDone:'Automatic renewal canceled. Access remains until the end of the paid period.',cancelOff:'Cancellation unavailable until payments are enabled.',preview:'Commercial preview. Subscriptions are not active: billing, database, and GPU must be configured and tested.'});
  Object.assign(words.es,{daily:'Créditos gratuitos restantes',free:'Gratis • marca de agua',creditsExpired:'Los créditos no se acumulan',renewAt:'Próxima renovación de créditos',cancel:'Cancelar renovación automática',cancelAsk:'¿Detener los próximos cobros? Mantendrás el acceso hasta el fin del período pagado.',cancelDone:'Renovación cancelada. El acceso se mantiene hasta finalizar el período pagado.',cancelOff:'Cancelación no disponible hasta activar pagos.',preview:'Vista previa comercial. Las suscripciones no están activadas: falta configurar y probar pagos, base de datos y GPU.'});
  const state={email:null,tier:'free',developer:false,paid:false,credits:null,expires_at:null,credit_renews_at:null,subscription_status:null};
  let session=null,mode='login',pendingPlan=null,processing=false;
  const lang=()=>document.documentElement.lang?.startsWith('es')?'es':document.documentElement.lang?.startsWith('en')?'en':'pt';
  const t=k=>words[lang()][k]||k;
  const toast=msg=>{const e=$('#toast');if(e){e.textContent=msg;e.hidden=false;clearTimeout(toast._timer);toast._timer=setTimeout(()=>e.hidden=true,6000)} };
  const active=()=>Boolean(cfg.supabaseUrl&&cfg.supabaseAnonKey&&cfg.apiBaseUrl);
  const supa=path=>cfg.supabaseUrl.replace(/\/$/,'')+path;
  const api=path=>cfg.apiBaseUrl.replace(/\/$/,'')+path;
  function setSession(data){session=data?.access_token?data:null;
    try{if(session)sessionStorage.setItem('zika_session',JSON.stringify(session));else sessionStorage.removeItem('zika_session')}catch(_e){}
  }
  async function authCall(path,body){
    const r=await fetch(supa(path),{method:'POST',headers:{'Content-Type':'application/json','apikey':cfg.supabaseAnonKey},body:JSON.stringify(body)});
    const data=await r.json().catch(()=>({}));if(!r.ok)throw Error(data.msg||data.message||data.error_description||`HTTP ${r.status}`);return data;
  }
  async function refresh(){
    if(!session?.refresh_token)return false;
    try{const s=await authCall('/auth/v1/token?grant_type=refresh_token',{refresh_token:session.refresh_token});setSession(s);return true}catch(e){setSession(null);return false}
  }
  async function request(path,opt={}){
    if(!session?.access_token)throw Error(t('need'));
    let r=await fetch(api(path),{...opt,headers:{...opt.headers,Authorization:`Bearer ${session.access_token}`}});
    if(r.status===401 && await refresh())r=await fetch(api(path),{...opt,headers:{...opt.headers,Authorization:`Bearer ${session.access_token}`}});
    if(!r.ok){const body=await r.text();throw Error(body.slice(0,360)||`HTTP ${r.status}`)}
    return r;
  }
  function creditsCost(tool,scale){
    if(tool==='removebg')return 1;
    const table={photo:{1:2,2:2,4:3,5:5,6:6,7:8,8:10},anime:{1:1,2:1,4:2,5:3,6:4,7:4,8:5}};
    return table[tool]?.[Number(scale)] ?? 0;
  }
  function updateCost(){
    const el=$('#costEstimator');if(!el)return;
    const count=typeof files==='undefined'?0:files.length;
    const tool=typeof activeTool==='undefined'?'photo':activeTool;
    const scale=$('#scaleSelect')?.value||4;
    const per=state.developer?0:creditsCost(tool,scale),total=count*per;
    el.textContent=`${t('cost')}: ${total||per} ${total===1||(!total&&per===1)?t('credit'):t('credits')} ${t('forfiles')} ${count||1} ${t('files')}.`;
  }
  function translate(){
    $('#accountButton').textContent=state.email?`${state.email.split('@')[0]} · ${t('account')}`:t('sign');
    const badge=$('#devRoleBadge');if(badge){badge.hidden=!state.developer;badge.textContent=lang()==='en'?'DEVELOPER':lang()==='es'?'DESARROLLADOR':'DESENVOLVEDOR'}
    $('#authTitle').textContent=t('modal');$('#loginTab').textContent=t('login');$('#signupTab').textContent=t('signup');$('#authEmailLabel').textContent=t('email');$('#authPassLabel').textContent=t('pass');
    $('#authSubmit').textContent=mode==='login'?t('send'):t('create');
    $('#checkoutNotice').textContent=t('preview');
    $('#cancelSubscription').textContent=t('cancel');
    updateWalletText();updateCost();
  }
  function updateWalletText(){
    const el=$('#creditMeter');if(!el)return;
    const cancel=$('#cancelSubscription');
    cancel.hidden=!(state.paid && state.subscription_status==='active');
    if(!state.email){el.textContent=t('need');return}
    if(state.developer){el.textContent=lang()==='en'?'✦ DEVELOPER · unlimited credits · no watermark':lang()==='es'?'✦ DESARROLLADOR · créditos ilimitados · sin marca de agua':'✦ DESENVOLVEDOR · créditos ilimitados · sem marca d’água';return}
    if(state.paid){
      const renewal=state.credit_renews_at?new Date(state.credit_renews_at).toLocaleDateString(lang()==='pt'?'pt-BR':lang()==='es'?'es-ES':'en-US'):'';
      el.textContent=`${t('balance')}: ${state.credits} ${t('credits')} · ${t('paid')}`+
        (renewal?` · ${t('renewAt')}: ${renewal}`:'')+
        (state.subscription_status==='canceled'?` · ${t('cancelDone')}`:'');
    }else el.textContent=`${t('daily')}: ${state.credits}/3 · ${t('free')}`;
  }
  function planUi(){if(typeof applyPlanUi==='function')applyPlanUi()}
  async function loadAccount(){
    if(!session?.access_token){state.email=null;state.tier='free';state.developer=false;state.paid=false;state.credits=null;translate();planUi();return}
    try{const r=await request('/api/me');const data=await r.json();Object.assign(state,data);
      translate();planUi();
    }catch(e){toast(e.message);state.email=null;state.developer=false;translate();planUi()}
  }
  function showAuth(message=''){
    const dlg=$('#authDialog');$('#authMessage').textContent=message;dlg.showModal();$('#authEmail').focus();
  }
  async function signOut(){try{if(session?.access_token)await fetch(supa('/auth/v1/logout'),{method:'POST',headers:{apikey:cfg.supabaseAnonKey,Authorization:`Bearer ${session.access_token}`}})}catch(_){}
    setSession(null);await loadAccount();}
  async function accountButton(){
    if(!active()){toast(t('configured'));return}
    if(state.email){if(confirm(lang()==='pt'?'Sair da conta?':lang()==='es'?'¿Salir de la cuenta?':'Sign out?'))await signOut();return}
    showAuth();
  }
  async function submitAuth(ev){ev.preventDefault();if(!active()){toast(t('configured'));return}
    const btn=$('#authSubmit');btn.disabled=true;btn.textContent=t('working');
    try{const email=$('#authEmail').value.trim(),password=$('#authPassword').value;
      const result=mode==='signup'?await authCall('/auth/v1/signup',{email,password}):
        await authCall('/auth/v1/token?grant_type=password',{email,password});
      if(result.access_token){setSession(result);$('#authDialog').close();await loadAccount();if(pendingPlan){const p=pendingPlan;pendingPlan=null;await checkout(p)}}
      else $('#authMessage').textContent=t('confirm');
    }catch(e){$('#authMessage').textContent=`${t('fail')} ${e.message}`}
    finally{btn.disabled=false;btn.textContent=mode==='login'?t('send'):t('create')}
  }
  async function checkout(plan){
    if(!['starter','pro','annual'].includes(plan))return;
    if(!active()){toast(t('checkoutOff'));return}
    if(!state.email){pendingPlan=plan;showAuth(t('need'));return}
    toast(t('buyWait'));
    try{const r=await request('/api/checkout',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({plan})});
      const json=await r.json();if(!json.checkout_url?.startsWith('https://'))throw Error('Checkout indisponível');
      window.location.assign(json.checkout_url);
    }catch(e){toast(`${t('checkoutOff')} ${e.message}`)}
  }
  async function cancelSubscription(){
    if(!active()){toast(t('cancelOff'));return}
    if(!state.email){showAuth(t('need'));return}
    if(!confirm(t('cancelAsk')))return;
    try{await request('/api/cancel-subscription',{method:'POST'});toast(t('cancelDone'));await loadAccount()}
    catch(e){toast(`${t('cancelOff')} ${e.message}`)}
  }
  async function processImages(){
    if(processing)return;
    if(typeof files==='undefined'||!files.length){toast(t('choose'));return}
    if(!active()){toast(t('cloudOff'));return}
    if(!state.email){showAuth(t('need'));return}
    const per=creditsCost(activeTool,$('#scaleSelect').value);
    const needed=files.length*per;
    if(state.credits!=null&&needed>state.credits){toast(t('limit'));return}
    processing=true;const btn=$('#processButton');btn.disabled=true;
    let done=0;
    try{for(let i=0;i<files.length;i++){
      const f=files[i],fd=new FormData();fd.append('file',f.file,f.file.name);fd.append('tool',activeTool);fd.append('scale',activeTool==='removebg'?'1':$('#scaleSelect').value);
      const label=btn.querySelector('span:nth-child(2)');if(label)label.textContent=`${t('processing')} ${i+1}/${files.length}...`;
      const r=await request('/api/process',{method:'POST',body:fd});const blob=await r.blob();
      saveBlob(blob,f.file.name.replace(/\.[^/.]+$/,'')+`_ZIKA_${activeTool.toUpperCase()}.png`);done++;await loadAccount();
    }toast(`${t('done')} (${done}/${files.length})`)}
    catch(e){toast(`${t('failGPU')} ${e.message}`);await loadAccount()}
    finally{processing=false;btn.disabled=false;if(typeof labelTool==='function')labelTool();if(typeof renderFiles==='function')renderFiles()}
  }
  async function start(){
    try{session=JSON.parse(sessionStorage.getItem('zika_session')||'null')}catch(e){session=null}
    $('#accountButton').addEventListener('click',accountButton);
    $('#cancelSubscription').addEventListener('click',cancelSubscription);
    $('#closeAuth').addEventListener('click',()=>$('#authDialog').close());
    $('#authDialog').addEventListener('click',e=>{if(e.target===$('#authDialog'))$('#authDialog').close()});
    $('#loginTab').addEventListener('click',()=>{mode='login';$('#loginTab').classList.add('active');$('#signupTab').classList.remove('active');$('#authMessage').textContent='';translate()});
    $('#signupTab').addEventListener('click',()=>{mode='signup';$('#signupTab').classList.add('active');$('#loginTab').classList.remove('active');$('#authMessage').textContent='';translate()});
    $('#authForm').addEventListener('submit',submitAuth);
    $$('.plan-button').forEach(btn=>btn.addEventListener('click',async e=>{
      const p=btn.closest('.plan-card')?.dataset.plan;if(!p)return;
      e.preventDefault();if(p==='free'){if(!state.email)showAuth(t('need'));else $('#studio').scrollIntoView({behavior:'smooth'})}
      else await checkout(p);
    }));
    translate();
    if(active()&&session?.access_token)await loadAccount();
  }
  window.ZikaCloud={state,translate,updateCost,processImages};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
