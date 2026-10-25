"use strict";
/**
 * Zika IA: offline FREE plan experience test. This is *not* a GPU enhancer,
 * authenticated account, server-side anti-abuse system or payment flow.
 * Open TESTE_GRATIS_OFFLINE.html to try interface, costs and watermark.
 * Production site continues to use the existing authenticated backend.
 */
(function(){
  const $ = q => document.querySelector(q);
  const storageKey = 'zika-local-free-trial-v1';
  const demo = { credits:0, developer:false, busy:false, compareUrl:null };
  const auth=()=>window.ZikaDemoAuth;
  const words = {
    pt:{banner:'MODO TESTE GRÁTIS • FUNCIONA OFFLINE',detail:'Teste créditos, envio e PNG com marca d’água. Aqui usamos filtros simples do navegador, NÃO o motor de IA. Nenhum pagamento ou cadastro real.',account:'Teste local • sem cadastro',credit:'Saldo do teste grátis',spent:'Créditos usados',before:'Antes',after:'Resultado demonstrativo',download:'Imagem de teste baixada com marca d’água',off:'Assinaturas desativadas no teste. Nenhum valor será cobrado.',noCredit:'Créditos insuficientes para esta operação.',noFile:'Escolha uma imagem antes de processar.',tooBig:'No teste offline, selecione uma imagem menor ou uma ampliação menor (máximo de 12 megapixels).',error:'Não foi possível gerar o arquivo de teste. Créditos preservados.',processing:'Criando teste',label:'O teste não usa IA: só amplia e aplica um filtro básico. Remover Fundo funciona apenas com fundos uniformes.',tip:'Para gastar 1 crédito, escolha Anime 2× ou Remover Fundo. Melhorar Foto 4× custa 3 créditos.',reset:'Reiniciar teste',resetConfirm:'Reiniciar o saldo de 3 créditos deste teste local?',resetDone:'Saldo do teste reiniciado.',remaining:'restantes',limit:'Sem créditos: volte ao início do teste pelo botão Reiniciar teste.',ready:'Teste gratuito funcionando localmente — sem GPU'},
    en:{banner:'FREE TEST MODE • WORKS OFFLINE',detail:'Try credits, uploads and watermarked PNGs. This uses simple browser filters, NOT the AI engine. No actual signup or payment.',account:'Local test • no signup',credit:'Free test balance',spent:'Credits used',before:'Before',after:'Demo output',download:'Demo image downloaded with watermark',off:'Subscriptions disabled for this test. No charge is made.',noCredit:'Not enough credits for this operation.',noFile:'Select an image before processing.',tooBig:'For the offline test, use a smaller image or upscale factor (12 megapixels maximum).',error:'Could not create a demo image. Credits retained.',processing:'Generating demo',label:'Demo does not run AI: basic upscale and image filter only. Remove Background supports simple uniform backgrounds only.',tip:'To spend 1 credit, choose Anime 2× or Background Remover. Photo 4× costs 3 credits.',reset:'Restart test',resetConfirm:'Restart the 3-credit local test?',resetDone:'Demo credit balance reset.',remaining:'remaining',limit:'No credits left: use Restart test to try again.',ready:'Free trial runs locally — no GPU'},
    es:{banner:'MODO PRUEBA GRATIS • SIN CONEXIÓN',detail:'Prueba créditos, envíos y PNG con marca de agua. Usa filtros simples del navegador, NO el motor IA. Sin pagos ni registro real.',account:'Prueba local • sin registro',credit:'Saldo de la prueba gratuita',spent:'Créditos usados',before:'Antes',after:'Resultado de prueba',download:'Imagen de prueba descargada con marca de agua',off:'Suscripciones desactivadas. No hay cobros.',noCredit:'Créditos insuficientes para la operación.',noFile:'Elige una imagen antes de procesar.',tooBig:'Para esta prueba utiliza una imagen o ampliación menor (máximo 12 megapíxeles).',error:'No se pudo crear la imagen de prueba. Créditos conservados.',processing:'Creando prueba',label:'Esta prueba NO usa IA: solo escala y filtros básicos. La eliminación de fondo sirve para fondos uniformes.',tip:'Para gastar 1 crédito, selecciona Anime 2× o Quitar Fondo. Foto 4× cuesta 3 créditos.',reset:'Reiniciar prueba',resetConfirm:'¿Reiniciar la prueba local de 3 créditos?',resetDone:'Saldo de prueba reiniciado.',remaining:'restantes',limit:'Sin créditos. Usa Reiniciar prueba para volver a probar.',ready:'Prueba gratuita local — sin GPU'}
  };
  const lang=()=>document.documentElement.lang.startsWith('en')?'en':document.documentElement.lang.startsWith('es')?'es':'pt';
  const t=k=>words[lang()][k];
  const toast=message=>{const el=$('#toast');if(!el)return;el.textContent=message;el.hidden=false;setTimeout(()=>el.hidden=true,6500)};
  function syncAccount(){
    const a=auth()?.current();
    demo.developer=a?.role==='developer';
    demo.credits=a?.credits??0;
    if(demo.developer)demo.credits=0;
    window.ZikaCloud.state.email=a?.email||null;
    window.ZikaCloud.state.tier=demo.developer?'developer':'free';
    window.ZikaCloud.state.developer=demo.developer;
    window.ZikaCloud.state.paid=demo.developer;
  }
  function persist(){if(!demo.developer)auth()?.setCredits(demo.credits)}
  function cost(tool,scale){if(tool==='removebg')return 1;const map={photo:{1:2,2:2,4:3,5:5,6:6,7:8,8:10},anime:{1:1,2:1,4:2,5:3,6:4,7:4,8:5}};return map[tool]?.[Number(scale)]??100}
  function currentSelection(){return {tool:activeTool,scale:activeTool==='removebg'?1:Number($('#scaleSelect').value),items:files}}
  function updateDemoUI(){
    const needed=(()=>{const {tool,scale,items}=currentSelection();return (demo.developer?0:cost(tool,scale)*items.length)})();
    auth()?.paint();
    $('#creditMeter').innerHTML=demo.developer?'<strong>✦ DESENVOLVEDOR · ∞ créditos · sem marca d’água</strong>':`<strong>${t('credit')}: <span class="demo-credits-number">${demo.credits}</span>/3</strong><div class="demo-meter-track"><div style="width:${Math.round(demo.credits/3*100)}%"></div></div>`;
    $('#planNote').textContent=demo.developer?'✦ Modo desenvolvedor · downloads sem marca d’água e sem desconto de créditos':t('label');
    $('#serverNote').textContent=t('ready');
    $('#checkoutNotice').textContent=t('off');
    $('#trialBannerTitle').textContent=demo.developer?'✦ MODO DESENVOLVEDOR · ∞ CRÉDITOS':t('banner');
    $('#trialBannerDesc').textContent=demo.developer?'Teste local ilimitado, sem marca d’água. A imagem ainda usa filtros do navegador, NÃO a IA real.':' '+t('detail');
    $('#trialTip').textContent=demo.developer?'Desenvolvedor local: imagens sem marca d’água, nenhum crédito descontado. O teste ainda NÃO usa IA.':t('tip');
    $('#resetFreeTest').textContent=t('reset');$('#resetFreeTest').hidden=demo.developer||!auth()?.current();
    // Let original cloud module compute the cost labels from final price table.
    window.ZikaCloud?.updateCost();
    const btn=$('#processButton');
    if(!auth()?.current() || (!demo.developer&&demo.credits===0)){if(!demo.busy)btn.disabled=true;}
    else if(!demo.busy)btn.disabled=!files.length;
    if(!demo.developer&&demo.credits<needed && files.length>0)$('#costEstimator').classList.add('demo-insufficient');
    else $('#costEstimator').classList.remove('demo-insufficient');
  }
  function decode(path){return new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=reject;img.src=path})}
  async function imageFileBlob(canvas){return new Promise((res,rej)=>canvas.toBlob(b=>b?res(b):rej(Error('image encoder')),'image/png'))}
  function sampleBackgroundRemoval(canvas){
    const ctx=canvas.getContext('2d',{willReadFrequently:true});const w=canvas.width,h=canvas.height;
    const img=ctx.getImageData(0,0,w,h),px=img.data;
    const offs=[0,(w-1)*4,((h-1)*w)*4,((h*w)-1)*4];
    const samples=offs.map(i=>[px[i],px[i+1],px[i+2]]);
    // For truly flat-background demo images, use a robust dominant corner.
    let ref=samples[0],best=Infinity;
    for(const s of samples){let total=0;for(const r of samples){total+=(s[0]-r[0])**2+(s[1]-r[1])**2+(s[2]-r[2])**2;}if(total<best){best=total;ref=s}}
    const visited=new Uint8Array(w*h);const queue=new Uint32Array(w*h);let head=0,tail=0;
    const matches=p=>{const i=p*4,dr=px[i]-ref[0],dg=px[i+1]-ref[1],db=px[i+2]-ref[2];return dr*dr+dg*dg+db*db<=52*52 && px[i+3]>0};
    const push=p=>{if(!visited[p]&&matches(p)){visited[p]=1;queue[tail++]=p}};
    for(let x=0;x<w;x++){push(x);push((h-1)*w+x)}
    for(let y=0;y<h;y++){push(y*w);push(y*w+w-1)}
    while(head<tail){const p=queue[head++],x=p%w,y=Math.floor(p/w);if(x>0)push(p-1);if(x<w-1)push(p+1);if(y>0)push(p-w);if(y<h-1)push(p+w)}
    for(let p=0;p<visited.length;p++){if(visited[p])px[p*4+3]=0}
    ctx.putImageData(img,0,0);
  }
  async function watermarkedCanvas(base){
    const wm=await decode('./assets/watermark-zika-free.png');
    const out=document.createElement('canvas');out.width=base.width;out.height=base.height;
    const ctx=out.getContext('2d');ctx.drawImage(base,0,0);
    const layer=document.createElement('canvas');layer.width=base.width;layer.height=base.height;
    const wc=layer.getContext('2d');
    const tw=Math.max(240,Math.min(1100,Math.round(out.width*.86)));
    const th=Math.max(1,Math.round(tw*wm.height/wm.width));
    wc.globalAlpha=.27;
    for(let y=0;y<out.height;y+=th){for(let x=0;x<out.width;x+=tw)wc.drawImage(wm,x,y,tw,th)}
    wc.globalAlpha=1;
    wc.globalCompositeOperation='destination-in';wc.drawImage(base,0,0);
    ctx.drawImage(layer,0,0);
    return out;
  }
  async function transform(file,tool,scale,withWatermark=true){
    const raw=await decode(file.url);
    const w=tool==='removebg'?raw.naturalWidth:Math.round(raw.naturalWidth*scale),
          h=tool==='removebg'?raw.naturalHeight:Math.round(raw.naturalHeight*scale);
    if(w*h>12e6||w>13000||h>13000)throw Error('DEMO_TOO_BIG');
    const cv=document.createElement('canvas');cv.width=w;cv.height=h;
    const ctx=cv.getContext('2d',{willReadFrequently:tool==='removebg'});ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';
    if(tool==='photo')ctx.filter='contrast(1.04) saturate(1.06)';
    if(tool==='anime')ctx.filter='contrast(1.09) saturate(1.14)';
    ctx.drawImage(raw,0,0,w,h);ctx.filter='none';
    if(tool==='removebg')sampleBackgroundRemoval(cv);
    return withWatermark?watermarkedCanvas(cv):cv;
  }
  async function doProcess(){
    if(demo.busy)return;
    const {tool,scale,items}=currentSelection();
    if(!auth()?.current()){auth()?.open();toast(auth()?.t('choose')||t('noFile'));return}
    if(!items.length){toast(t('noFile'));return}
    const each=demo.developer?0:cost(tool,scale),required=each*items.length;
    if(required>demo.credits){toast(t('noCredit'));return}
    demo.busy=true;const button=$('#processButton');button.disabled=true;
    let completed=0;
    try{
      for(const file of items){
        button.querySelector('span:nth-child(2)').textContent=`${t('processing')} ${completed+1}/${items.length}…`;
        const result=await transform(file,tool,scale,!demo.developer);
        const blob=await imageFileBlob(result);
        // Credits are decremented only after successful image encoding.
        if(!demo.developer){demo.credits-=each;persist()}
        saveBlob(blob,file.file.name.replace(/\.[^.]+$/,'')+(demo.developer?'_ZIKA_DESENVOLVEDOR_TESTE.png':'_ZIKA_GRATIS_TESTE.png'));
        if(demo.compareUrl)URL.revokeObjectURL(demo.compareUrl);
        demo.compareUrl=URL.createObjectURL(blob);
        $('#beforeImage').src=file.url;
        $('#afterImage').src=demo.compareUrl;
        $('#compareStage').dataset.demo='localtest';
        $('#demoLabel').textContent=t('after');
        $('#demoDescription').textContent=t('label');
        $('#demoSizes').textContent=`${file.width} × ${file.height} px → ${result.width} × ${result.height} px`;
        $('#demoBadge').textContent='TESTE LOCAL · NÃO IA';
        $('#compareStage').style.backgroundColor='#16151a';
        $('#compareStage').classList.add('demo-free-result');
        setComparison(50);completed++;updateDemoUI();
      }
      toast(demo.developer?`Modo desenvolvedor · ${completed}/${items.length} · sem marca d’água`:`${t('download')} · ${completed}/${items.length} · ${demo.credits} ${t('remaining')}`);
    }catch(e){console.warn('Demo image failed:',e);toast(e.message==='DEMO_TOO_BIG'?t('tooBig'):t('error'))}
    finally{demo.busy=false;if(typeof labelTool==='function')labelTool();if(typeof renderFiles==='function')renderFiles();updateDemoUI()}
  }
  function start(){
    syncAccount();
    Object.defineProperty(window.ZikaCloud.state,'credits',{get:()=>demo.developer?null:demo.credits,configurable:true});
    auth()?.subscribe(()=>{syncAccount();updateDemoUI();applyPlanUi()});
    window.ZikaCloud.processImages=doProcess;
    const originalTranslate=window.ZikaCloud.translate;
    window.ZikaCloud.translate=function(){originalTranslate();updateDemoUI()};
    const originalCost=window.ZikaCloud.updateCost;
    window.ZikaCloud.updateCost=()=>{originalCost();if(!demo.busy&&$('#trialBannerTitle')){
      const {tool,scale,items}=currentSelection();
      $('#costEstimator').classList.toggle('demo-insufficient',items.length>0&&!demo.developer&&cost(tool,scale)*items.length>demo.credits);
    }};
    // Prevent any production account/checkout action in this isolated demo.
    document.addEventListener('click',e=>{
      const plan=e.target.closest('.plan-button');
      if(plan){e.preventDefault();e.stopImmediatePropagation();if(plan.closest('[data-plan="free"]')){if(!auth()?.current())auth()?.open();else $('#studio').scrollIntoView({behavior:'smooth'});}else toast(t('off'));}
    },true);
    $('#cancelSubscription').hidden=true;
    $('#resetFreeTest').addEventListener('click',()=>{if(!auth()?.current()||demo.developer)return;if(confirm(t('resetConfirm'))){demo.credits=3;persist();updateDemoUI();toast(t('resetDone'))}});
    window.addEventListener('beforeunload',()=>{if(demo.compareUrl)URL.revokeObjectURL(demo.compareUrl)});
    // Language and scale changes from existing app update free-specific labels too.
    document.querySelectorAll('.lang-btn,.tool-tab,#scaleSelect,#clearFiles,#addFiles').forEach(el=>el.addEventListener('click',()=>queueMicrotask(updateDemoUI)));
    $('#fileInput').addEventListener('change',()=>setTimeout(updateDemoUI,120));
    window.ZikaCloud.translate();applyPlanUi();updateDemoUI();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
