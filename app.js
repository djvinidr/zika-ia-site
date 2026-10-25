'use strict';
/* Zika IA v4 · frontend static / API ready · PT + EN + ES */
const $=(selector)=>document.querySelector(selector);
const $$=(selector)=>Array.from(document.querySelectorAll(selector));
const config=window.ZIKA_CONFIG||{};
const demos={
  anime:{before:'./assets/anime-antes.webp',after:'./assets/anime-depois.webp',label:'animeDemo',subtitle:'animeDemoDetail',badge:'ZIKA IA · 8X',beforeSize:'567 × 567',afterSize:'2048 × 2048'},
  photo:{before:'./assets/foto-antes.webp',after:'./assets/foto-depois.webp',label:'photoDemo',subtitle:'photoDemoDetail',badge:'ZIKA IA · FOTO',beforeSize:'424 × 530',afterSize:'1638 × 2048'},
  removebg:{before:'./assets/removebg-antes.webp',after:'./assets/removebg-depois.png',label:'removeDemo',subtitle:'removeDemoDetail',badge:'ZIKA IA · PNG',beforeSize:'1638 × 2048',afterSize:'1638 × 2048'}
};
const translations={
pt:{
  navPhoto:'Melhorar imagem',navAnime:'Anime e Desenho',navRemove:'Remover fundo',navFeatures:'Ferramentas',navPlans:'Planos',start:'Começar agora ↗',
  eyebrow:'EDIÇÃO DE IMAGENS COM INTELIGÊNCIA ARTIFICIAL',heroLead:'Melhore a qualidade da sua imagem',heroHighlight:'com inteligência artificial.',heroDescription:'Rostos, fotos, animes e desenhos com mais definição. Escolha uma ferramenta, envie sua imagem e compare os detalhes.',
  tabPhoto:'Melhorar Foto',tabAnime:'Anime e Desenho',tabRemove:'Remover Fundo',liveStatus:'Prévia pronta para testar',
  uploadTitleMini:'SUA IMAGEM',toolPhotoTitle:'Melhorar fotos e rostos',toolPhotoDesc:'Detecção automática de rostos, fundo e paisagens.',toolAnimeTitle:'Melhorar anime e desenhos',toolAnimeDesc:'Mais definição em traços, olhos, cabelo e cenários ilustrados.',toolRemoveTitle:'Remover fundo de imagem',toolRemoveDesc:'Recorte de pessoas e objetos com saída PNG transparente.',
  dropMain:'Arraste suas imagens aqui',dropSub:'ou selecione arquivos no seu dispositivo',selectImages:'Selecionar imagens',batchHint:'Até 20 imagens por vez · máximo 20 MB por arquivo',selectedFilesLabel:'IMAGENS SELECIONADAS',clear:'Limpar tudo',addImages:'+ Adicionar imagens',
  settingsLabel:'AJUSTES DA IMAGEM',upscaleOptions:'Opções de ampliação do Zika IA',scaleLabel:'Super resolução',outputSize:'TAMANHO PREVISTO',sizeHint:'O tamanho será calculado automaticamente',sizeNoFile:'Envie uma imagem para ver a resolução',sizeFirst:'Primeira imagem',
  process:'Melhorar imagem',processAnime:'Melhorar anime',processRemove:'Remover fundo',previewDisclosure:'Prévia e configurações disponíveis. O processamento online exige conectar um servidor GPU à API do site.',
  actualResult:'RESULTADO REAL NO ZIKA IA',demoTitle:'Veja os detalhes ganharem vida.',interactive:'INTERATIVO',before:'ANTES',after:'DEPOIS',animeDemo:'Anime e Desenho',animeDemoDetail:'Teste real: traços, cabelo, espada e fundo',photoDemo:'Melhorar Foto',photoDemoDetail:'Teste real: rostos, cabelo e paisagem',removeDemo:'Remover Fundo',removeDemoDetail:'Teste real: retrato com recorte de cabelo e fundo removido',animeThumb:'Desenho',photoThumb:'Foto',removeThumb:'Remover fundo',dragTip:'Arraste a linha para comparar',demoNote:'Antes/Depois feito com arquivos reais enviados para o projeto. Não é uma simulação de processamento online.',
  trustFirst:'Rostos + paisagens em um só modo',trustSecond:'Modelo dedicado para anime',trustThird:'Processamento de várias imagens',trustFourth:'Até 8× de ampliação',
  toolsEyebrow:'FERRAMENTAS ZIKA IA',featuresTitle:'Uma IA para cada tipo de imagem.',featuresSubtitle:'Tudo o que você precisa em um único estúdio online.',
  featurePhotoTitle:'Melhorar Foto',featurePhotoText:'Restauração automática de rostos, fotos de grupo, cabelo, cenário e paisagens, sem selecionar áreas manualmente.',photoPoint1:'Rostos e cenários em uma etapa',photoPoint2:'Redução de ruídos e artefatos',
  featureAnimeTitle:'Anime e Desenho',featureAnimeText:'Mais definição em traços, olhos, cabelos, contornos de personagens e cenários ilustrados.',animePoint1:'Real-ESRGAN x4plus Anime',animePoint2:'Detalhes e contornos mais definidos',
  featureRemoveTitle:'Remover Fundo',featureRemoveText:'Isola pessoas e objetos para gerar PNG com transparência, usando sempre o processamento de qualidade.',removePoint1:'BiRefNet General · Qualidade',removePoint2:'PNG transparente',useFeature:'Experimentar ↗',
  faqEyebrow:'INFORMAÇÕES IMPORTANTES',faqTitle:'Como funciona esta versão?',faq1Title:'O site já melhora imagens de verdade?',faq1Answer:'O envio, a prévia, o cálculo de resolução e o Antes/Depois funcionam no navegador. O processamento de IA precisa de um servidor GPU conectado ao endpoint configurável.',faq2Title:'As opções são as da versão atualizada?',faq2Answer:'Sim: Melhorar Foto, Anime e Desenho, Remover Fundo, escalas 1×, 2× e 4× a 8×, Qualidade sempre ativada e seleção de múltiplas imagens.',faq3Title:'O Antes/Depois de anime é real?',faq3Answer:'Sim. Usamos os dois arquivos fornecidos para este projeto: a ilustração original e seu resultado de melhoria pelo Zika IA. A origem e os direitos da ilustração devem ser verificados antes da publicação comercial.',
  contactKicker:"CONTATO",contactTitle:"Fale com o Zika IA",contactDescription:"Dúvidas, sugestões ou parcerias? Entre em contato.",contactEmail:"E-mail",
  footerDesc:'Seu estúdio de imagens com inteligência artificial.',faqLabel:'Dúvidas',footerStatus:'Prévia de site • API do motor ainda não conectada',pricingEyebrow:'PLANOS E CRÉDITOS',pricingTitle:'Escolha um plano para usar o Zika IA.',pricingSubtitle:'Pacotes sem renovação automática. Preços sugeridos; valide custos antes do lançamento.',planCurrent:'PLANO ATUAL',planBestValue:'MELHOR CUSTO',freePlan:'Grátis',monthlyPlan:'Mensal',annualPlan:'Anual',freePlanSub:'2 imagens por dia',monthlyPlanSub:'Pacote de 1.000 créditos por 30 dias',annualPlanSub:'4.000 créditos válidos por 365 dias',freePlanBtn:'Começar grátis',paidPlanBtn:'Comprar pacote',annualEquivalent:'equivale a US$ 3,33/mês',freeFeat1:"Downloads com marca d'água",freeFeat2:'2 testes grátis por dia',freeFeat3:'Recursos básicos para testar',monthlyFeat1:"Sem marca d'água",monthlyFeat2:'Processamento em lote',monthlyFeat3:'Uso comercial',monthlyFeat4:'Créditos extras quando quiser',annualFeat1:"Sem marca d'água",annualFeat2:'4.000 créditos por 12 meses',annualFeat3:'Melhor custo por imagem',annualFeat4:'Uso comercial e lote',creditsEyebrow:'COMO OS CRÉDITOS FUNCIONAM',creditsTitle:'Regras simples para o site.',creditsIntro:"Você controla o gasto por imagem e sabe quando a marca d'água aparece.",creditRule1:'1 crédito = 1 imagem processada em Foto, Anime/Desenho ou Remover Fundo.',creditRule2:'Escalas de 1×, 2× e 4× consomem 1 crédito por imagem.',creditRule3:'Escalas de 5× a 8× consomem 2 créditos por imagem.',creditRule4:'No lote, cada arquivo desconta créditos separadamente.',creditRule5:"Plano grátis exporta com marca d'água. Plano pago exporta sem marca d'água.",inlinePlanLabel:'Seu plano atual',inlinePlanFree:"Grátis com marca d'água",inlinePlanPaid:"Pago sem marca d'água",
  scaleOptions:['1× — Original melhorado','2× — Leve','4× — Alta definição','5× — IA + ajuste','6× — IA + ajuste','7× — IA + ajuste','8× — Máxima ampliação'],
  cmUnit:'cm',pixelUnit:'px',sizePreserved:'Dimensões preservadas · PNG transparente',maxSize:'O limite é 20 MB por arquivo.',badFile:'Formato não aceito. Use PNG, JPG, WEBP, BMP, GIF ou AVIF.',tooMany:'O limite é 20 arquivos por vez.',noUpload:'Selecione pelo menos uma imagem.',engineNotReady:'O envio está pronto, mas a melhoria online ainda precisa de um servidor GPU. A demonstração não altera sua imagem.',processing:'Processando',processed:'Arquivo concluído! O download começou.',processError:'Falha no processamento online. Confira o endpoint e tente novamente.',menu:'Abrir menu',freeWatermarkNotice:"Plano grátis: o download sai com marca d'água Zika IA.",paidNoWatermark:"Plano pago: download sem marca d'água.",
},
en:{
  navPhoto:'Enhance image',navAnime:'Anime & Illustration',navRemove:'Remove background',navFeatures:'Features',navPlans:'Pricing',start:'Get started ↗',
  eyebrow:'AI-POWERED IMAGE ENHANCEMENT',heroLead:'Improve your image quality',heroHighlight:'with artificial intelligence.',heroDescription:'Sharper faces, photos, anime and illustrations. Choose a tool, upload your images, and compare every detail.',
  tabPhoto:'Photo Enhancer',tabAnime:'Anime & Illustration',tabRemove:'Background Remover',liveStatus:'Preview ready to try',
  uploadTitleMini:'YOUR IMAGE',toolPhotoTitle:'Enhance photos & faces',toolPhotoDesc:'Automatically detects faces, background and landscapes.',toolAnimeTitle:'Enhance anime & drawings',toolAnimeDesc:'Sharper outlines, eyes, hair and illustrated environments.',toolRemoveTitle:'Remove image backgrounds',toolRemoveDesc:'Cut out people and objects into transparent PNG files.',
  dropMain:'Drop your images here',dropSub:'or select files from your device',selectImages:'Select images',batchHint:'Up to 20 images · 20 MB per file',selectedFilesLabel:'SELECTED IMAGES',clear:'Clear all',addImages:'+ Add images',
  settingsLabel:'IMAGE SETTINGS',upscaleOptions:'Zika IA upscale options',scaleLabel:'Super resolution',outputSize:'EXPECTED SIZE',sizeHint:'Dimensions are calculated automatically',sizeNoFile:'Upload an image to see its size',sizeFirst:'First image',
  process:'Enhance image',processAnime:'Enhance anime',processRemove:'Remove background',previewDisclosure:'File preview and settings are available. Cloud AI processing requires connecting a GPU server to the site API.',
  actualResult:'REAL ZIKA IA RESULT',demoTitle:'Watch the details come alive.',interactive:'INTERACTIVE',before:'BEFORE',after:'AFTER',animeDemo:'Anime & Illustration',animeDemoDetail:'Real test: outlines, hair, sword and background',photoDemo:'Photo Enhancer',photoDemoDetail:'Real test: faces, hair and scenery',removeDemo:'Background Remover',removeDemoDetail:'Real test: portrait with hair cutout and removed background',animeThumb:'Drawing',photoThumb:'Photo',removeThumb:'Remove bg',dragTip:'Drag the handle to compare',demoNote:'Before/after uses actual files provided for this project. It is not a simulated online enhancement.',
  trustFirst:'Faces + landscapes together',trustSecond:'Dedicated anime model',trustThird:'Batch file selection',trustFourth:'Up to 8× upscale',
  toolsEyebrow:'ZIKA IA FEATURES',featuresTitle:'The right AI for every image.',featuresSubtitle:'All the tools you need in one online studio.',
  featurePhotoTitle:'Photo Enhancer',featurePhotoText:'Automatically restores faces, group photos, hair, scenery and landscapes without manual region selection.',photoPoint1:'Faces and scenery in one pass',photoPoint2:'Noise and artifact reduction',
  featureAnimeTitle:'Anime & Illustration',featureAnimeText:'Improve outlines, eyes, hair, character details and illustrated environments.',animePoint1:'Real-ESRGAN x4plus Anime',animePoint2:'Sharper outlines and details',
  featureRemoveTitle:'Background Remover',featureRemoveText:'Isolate people and objects into transparent PNGs with quality processing always enabled.',removePoint1:'BiRefNet General · Quality',removePoint2:'Transparent PNG',useFeature:'Try this tool ↗',
  faqEyebrow:'GOOD TO KNOW',faqTitle:'How does this version work?',faq1Title:'Does the website already enhance images?',faq1Answer:'Uploading, previewing, resolution estimates and the before/after slider work in your browser. Actual AI processing requires a GPU server connected to the configurable endpoint.',faq2Title:'Are the settings from the updated engine?',faq2Answer:'Yes: Photo Enhancer, Anime & Illustration, Background Remover, scales 1×, 2× and 4× through 8×, always-on Quality mode, and multi-image selection.',faq3Title:'Is the anime before/after real?',faq3Answer:'Yes. We use the two files provided for this project: the original illustration and its enhanced Zika IA result. Please verify the illustration’s provenance and rights before commercial publication.',
  contactKicker:"CONTACT",contactTitle:"Get in touch with Zika IA",contactDescription:"Questions, ideas, or partnerships? Reach out to us.",contactEmail:"Email",
  footerDesc:'Your AI-powered image studio.',faqLabel:'FAQ',footerStatus:'Site preview • engine API not connected yet',pricingEyebrow:'PLANS & CREDITS',pricingTitle:'Choose a plan for Zika IA.',pricingSubtitle:'One-time packages without automatic renewal. Proposed prices; validate costs before launch.',planCurrent:'CURRENT PLAN',planBestValue:'BEST VALUE',freePlan:'Free',monthlyPlan:'Monthly',annualPlan:'Yearly',freePlanSub:'2 images per day',monthlyPlanSub:'1,000-credit package for 30 days',annualPlanSub:'4,000 credits valid for 365 days',freePlanBtn:'Start free',paidPlanBtn:'Buy package',annualEquivalent:'equivalent to US$ 3.33/month',freeFeat1:'Watermarked downloads',freeFeat2:'2 free tests per day',freeFeat3:'Basic features to test',monthlyFeat1:'No watermark',monthlyFeat2:'Batch processing',monthlyFeat3:'Commercial use',monthlyFeat4:'Extra credits anytime',annualFeat1:'No watermark',annualFeat2:'4,000 credits for 12 months',annualFeat3:'Best cost per image',annualFeat4:'Commercial use and batch',creditsEyebrow:'HOW CREDITS WORK',creditsTitle:'Simple rules for the website.',creditsIntro:'Control your spend per image and know exactly when the watermark appears.',creditRule1:'1 credit = 1 processed image in Photo, Anime/Illustration, or Background Remover.',creditRule2:'1×, 2× and 4× scales use 1 credit per image.',creditRule3:'5× to 8× scales use 2 credits per image.',creditRule4:'In batch mode, each file spends credits separately.',creditRule5:'Free plan exports with watermark. Paid plan exports without watermark.',inlinePlanLabel:'Your current plan',inlinePlanFree:'Free with watermark',inlinePlanPaid:'Paid without watermark',
  scaleOptions:['1× — Enhanced original','2× — Light','4× — High definition','5× — AI + resize','6× — AI + resize','7× — AI + resize','8× — Maximum upscale'],
  cmUnit:'cm',pixelUnit:'px',sizePreserved:'Original size preserved · transparent PNG',maxSize:'Maximum file size is 20 MB.',badFile:'Unsupported format. Use PNG, JPG, WEBP, BMP, GIF or AVIF.',tooMany:'A maximum of 20 files is supported.',noUpload:'Select at least one image.',engineNotReady:'Upload preview is ready, but online enhancement needs a GPU server. This demo does not modify your image.',processing:'Processing',processed:'File complete! Download started.',processError:'Online processing failed. Check the endpoint and try again.',menu:'Open menu'
},
es:{
  "navPhoto": "Mejorar imagen",
  "navAnime": "Anime y Dibujo",
  "navRemove": "Quitar fondo",
  "navFeatures": "Herramientas",
  "navPlans": "Planes",
  "start": "Empezar ahora ↗",
  "eyebrow": "EDICIÓN DE IMÁGENES CON INTELIGENCIA ARTIFICIAL",
  "heroLead": "Mejora la calidad de tu imagen",
  "heroHighlight": "con inteligencia artificial.",
  "heroDescription": "Rostros, fotos, anime e ilustraciones con mayor definición. Elige una herramienta, sube tus imágenes y compara cada detalle.",
  "tabPhoto": "Mejorar Foto",
  "tabAnime": "Anime y Dibujo",
  "tabRemove": "Quitar Fondo",
  "liveStatus": "Vista previa lista para probar",
  "uploadTitleMini": "TU IMAGEN",
  "toolPhotoTitle": "Mejorar fotos y rostros",
  "toolPhotoDesc": "Detección automática de rostros, fondos y paisajes.",
  "toolAnimeTitle": "Mejorar anime y dibujos",
  "toolAnimeDesc": "Más definición en trazos, ojos, cabello y escenarios ilustrados.",
  "toolRemoveTitle": "Quitar el fondo de una imagen",
  "toolRemoveDesc": "Recorta personas y objetos y obtén un PNG transparente.",
  "dropMain": "Arrastra tus imágenes aquí",
  "dropSub": "o selecciona archivos de tu dispositivo",
  "selectImages": "Seleccionar imágenes",
  "batchHint": "Hasta 20 imágenes a la vez · máximo 20 MB por archivo",
  "selectedFilesLabel": "IMÁGENES SELECCIONADAS",
  "clear": "Borrar todo",
  "addImages": "+ Añadir imágenes",
  "settingsLabel": "AJUSTES DE IMAGEN",
  "upscaleOptions": "Opciones de ampliación de Zika IA",
  "scaleLabel": "Superresolución",
  
  "outputSize": "TAMAÑO PREVISTO",
  "sizeHint": "El tamaño se calculará automáticamente",
  "sizeNoFile": "Sube una imagen para ver la resolución",
  "sizeFirst": "Primera imagen",
  "process": "Mejorar imagen",
  "processAnime": "Mejorar anime",
  "processRemove": "Quitar fondo",
  "previewDisclosure": "La vista previa y los ajustes están disponibles. Para procesar imágenes en línea hay que conectar un servidor con GPU a la API del sitio.",
  "actualResult": "RESULTADO REAL EN ZIKA IA",
  "demoTitle": "Mira cómo cobran vida los detalles.",
  "interactive": "INTERACTIVO",
  "before": "ANTES",
  "after": "DESPUÉS",
  "animeDemo": "Anime y Dibujo",
  "animeDemoDetail": "Prueba real: trazos, cabello, espada y fondo",
  "photoDemo": "Mejorar Foto",
  "photoDemoDetail": "Prueba real: rostros, cabello y paisaje",
  "removeDemo": "Quitar Fondo",
  "removeDemoDetail": "Prueba real: retrato con recorte del cabello y fondo eliminado",
  "animeThumb": "Dibujo",
  "photoThumb": "Foto",
  "removeThumb": "Quitar fondo",
  "dragTip": "Arrastra la línea para comparar",
  "demoNote": "La comparación Antes/Después utiliza archivos reales enviados para el proyecto. No es una simulación del procesamiento en línea.",
  "trustFirst": "Rostros y paisajes en un solo modo",
  "trustSecond": "Modelo especial para anime",
  "trustThird": "Procesamiento de varias imágenes",
  "trustFourth": "Ampliación de hasta 8×",
  "toolsEyebrow": "HERRAMIENTAS ZIKA IA",
  "featuresTitle": "Una IA para cada tipo de imagen.",
  "featuresSubtitle": "Todas las herramientas que necesitas en un solo estudio en línea.",
  "featurePhotoTitle": "Mejorar Foto",
  "featurePhotoText": "Restaura automáticamente rostros, fotos de grupo, cabello, escenarios y paisajes, sin seleccionar zonas manualmente.",
  "photoPoint1": "Rostros y escenarios en un solo paso",
  "photoPoint2": "Reducción de ruido y artefactos",
  "featureAnimeTitle": "Anime y Dibujo",
  "featureAnimeText": "Mejora los trazos, ojos, cabello, contornos de personajes y escenarios ilustrados.",
  "animePoint1": "Real-ESRGAN x4plus Anime",
  "animePoint2": "Trazos y detalles más definidos",
  "featureRemoveTitle": "Quitar Fondo",
  "featureRemoveText": "Aísla personas y objetos para generar imágenes PNG transparentes, siempre con procesamiento de calidad.",
  "removePoint1": "BiRefNet General · Calidad",
  "removePoint2": "PNG transparente",
  "useFeature": "Probar herramienta ↗",
  "faqEyebrow": "INFORMACIÓN IMPORTANTE",
  "faqTitle": "¿Cómo funciona esta versión?",
  "faq1Title": "¿El sitio ya mejora imágenes de verdad?",
  "faq1Answer": "La carga de archivos, la vista previa, el cálculo de resolución y el comparador Antes/Después funcionan en el navegador. El procesamiento de IA requiere un servidor con GPU conectado a la API configurada.",
  "faq2Title": "¿Están las opciones de la versión actualizada?",
  "faq2Answer": "Sí: Mejorar Foto, Anime y Dibujo, Quitar Fondo, escalas 1×, 2× y de 4× a 8×, Calidad siempre activada y selección de varias imágenes.",
  "faq3Title": "¿La comparación Antes/Después de anime es real?",
  "faq3Answer": "Sí. Usamos los dos archivos aportados para este proyecto: la ilustración original y el resultado mejorado por Zika IA. Comprueba los derechos de la ilustración antes de publicarla con fines comerciales.",
  "contactKicker": "CONTACTO",
  "contactTitle": "Contacta con Zika IA",
  "contactDescription": "¿Dudas, sugerencias o colaboraciones? Escríbenos.",
  "contactEmail": "Correo electrónico",
  "footerDesc": "Tu estudio de imágenes con inteligencia artificial.",
  "faqLabel": "Preguntas frecuentes",
  "footerStatus": "Vista previa del sitio • API del motor todavía no conectada",
  "pricingEyebrow": "PLANES Y CRÉDITOS",
  "pricingTitle": "Elige un plan para usar Zika IA.",
  "pricingSubtitle": "Paquetes sin renovación automática. Precios propuestos; valida los costos antes del lanzamiento.",
  "planCurrent": "PLAN ACTUAL",
  "planBestValue": "MEJOR COSTE",
  "freePlan": "Gratis",
  "monthlyPlan": "Mensual",
  "annualPlan": "Anual",
  "freePlanSub": "2 imágenes por día",
  "monthlyPlanSub": "Paquete de 1.000 créditos por 30 días",
  "annualPlanSub": "4.000 créditos válidos por 365 días",
  "freePlanBtn": "Empezar gratis",
  "paidPlanBtn": "Comprar paquete",
  "annualEquivalent": "equivale a US$ 3,33/mes",
  "freeFeat1": "Descargas con marca de agua",
  "freeFeat2": "2 pruebas gratis por día",
  "freeFeat3": "Funciones básicas para probar",
  "monthlyFeat1": "Sin marca de agua",
  "monthlyFeat2": "Procesamiento por lotes",
  "monthlyFeat3": "Uso comercial",
  "monthlyFeat4": "Créditos extra cuando quieras",
  "annualFeat1": "Sin marca de agua",
  "annualFeat2": "4.000 créditos por 12 meses",
  "annualFeat3": "Mejor coste por imagen",
  "annualFeat4": "Uso comercial y lotes",
  "creditsEyebrow": "CÓMO FUNCIONAN LOS CRÉDITOS",
  "creditsTitle": "Reglas sencillas para el sitio.",
  "creditsIntro": "Controlas el gasto por imagen y sabes cuándo aparece la marca de agua.",
  "creditRule1": "1 crédito = 1 imagen procesada en Foto, Anime/Dibujo o Quitar Fondo.",
  "creditRule2": "Las escalas 1×, 2× y 4× consumen 1 crédito por imagen.",
  "creditRule3": "Las escalas de 5× a 8× consumen 2 créditos por imagen.",
  "creditRule4": "En lote, cada archivo descuenta créditos por separado.",
  "creditRule5": "El plan gratis exporta con marca de agua. El plan de pago exporta sin marca de agua.",
  "inlinePlanLabel": "Tu plan actual",
  "inlinePlanFree": "Gratis con marca de agua",
  "inlinePlanPaid": "De pago sin marca de agua",
  "scaleOptions": [
    "1× — Original mejorado",
    "2× — Ligero",
    "4× — Alta definición",
    "5× — IA + ajuste",
    "6× — IA + ajuste",
    "7× — IA + ajuste",
    "8× — Ampliación máxima"
  ],
  "cmUnit": "cm",
  "pixelUnit": "px",
  "sizePreserved": "Dimensiones originales · PNG transparente",
  "maxSize": "El límite es de 20 MB por archivo.",
  "badFile": "Formato no admitido. Usa PNG, JPG, WEBP, BMP, GIF o AVIF.",
  "tooMany": "El máximo es de 20 archivos a la vez.",
  "noUpload": "Selecciona al menos una imagen.",
  "engineNotReady": "La carga está lista, pero la mejora en línea todavía necesita un servidor con GPU. Esta demostración no modifica tu imagen.",
  "processing": "Procesando",
  "processed": "¡Archivo terminado! La descarga ha comenzado.",
  "processError": "Error al procesar la imagen en línea. Comprueba el servidor y vuelve a intentarlo.",
  "menu": "Abrir menú",
  "freeWatermarkNotice": "Plan gratuito: la descarga sale con marca de agua de Zika IA.",
  "paidNoWatermark": "Plan de pago: descarga sin marca de agua."
}
};

/* Assinaturas finais: sobrescreve textos da versão anterior em PT/EN/ES */
Object.assign(translations.pt, {"pricingEyebrow": "PLANOS ZIKA IA", "pricingTitle": "Mais qualidade. Menos custo.", "pricingSubtitle": "Escolha seu plano, renove os créditos mensalmente e cancele quando quiser.", "billingSummary": "Assinatura com renovação automática", "billingDetail": "Mensais: cartão cobrado todo mês • Anual: cartão cobrado uma vez por ano", "freePlan": "Grátis", "starterPlan": "Starter", "proPlan": "Pro", "annualPlan": "Anual", "creditsOnce": "créditos iniciais", "creditsMonthly": "créditos/mês", "freePlanSub": "Uma única vez por conta", "starterPlanSub": "Para usar no dia a dia", "proPlanSub": "Para quem melhora muitas imagens", "annualPlanSub": "12 meses de acesso • equivale a US$ 3,33/mês", "perMonth": "/mês", "perYear": "/ano", "freeFeat1": "Marca d’água no download", "freeFeat2": "Teste as três ferramentas", "freeFeat3": "Sem cartão de crédito", "freePlanBtn": "Começar grátis", "noWatermark": "Sem marca d’água", "renewMonthly": "Créditos renovados mensalmente", "autoCardMonthly": "Cartão cobrado todo mês", "batchAccess": "Processamento em lote", "annualCharge": "Pagamento anual antecipado", "annualRefill": "100 créditos renovados a cada mês", "subscribe": "Assinar Starter", "subscribePro": "Assinar Pro", "subscribeAnnual": "Assinar Anual", "mostPopular": "MAIS POPULAR", "bestEconomy": "MAIS ECONÔMICO", "policyExplain": "Os créditos não acumulam: ao renovar, o saldo vira a quantidade nova do plano. Você pode cancelar a próxima cobrança; o acesso segue até o fim do período pago.", "creditsEyebrow": "CRÉDITOS POR IMAGEM", "creditsTitle": "Você sabe o custo antes de processar.", "creditsIntro": "A qualidade é automática. Operações pesadas gastam mais créditos para manter os preços acessíveis.", "toolRate": "Ferramenta", "ratesFoot": "1× tem o mesmo custo de 2×. Para 5×–7×, mostramos o preço exato ao escolher a ampliação. Remover fundo preserva o tamanho.", "cancelSubscription": "Cancelar renovação automática", "previewCharge": "Prévia: assinaturas ainda não estão ativas. Configure pagamentos e servidor GPU para liberar o checkout."});
Object.assign(translations.en, {"pricingEyebrow": "ZIKA IA PLANS", "pricingTitle": "More quality. Less cost.", "pricingSubtitle": "Choose a plan, get monthly credit renewals, and cancel whenever you like.", "billingSummary": "Automatic subscription renewal", "billingDetail": "Monthly: charged each month • Annual: charged once a year", "freePlan": "Free", "starterPlan": "Starter", "proPlan": "Pro", "annualPlan": "Annual", "creditsOnce": "one-time credits", "creditsMonthly": "credits/month", "freePlanSub": "Once per account", "starterPlanSub": "For everyday use", "proPlanSub": "For frequent enhancement", "annualPlanSub": "12 months of access • equivalent to US$3.33/month", "perMonth": "/month", "perYear": "/year", "freeFeat1": "Watermarked downloads", "freeFeat2": "Try all three tools", "freeFeat3": "No credit card required", "freePlanBtn": "Start for free", "noWatermark": "No watermark", "renewMonthly": "Credits reset every month", "autoCardMonthly": "Card charged every month", "batchAccess": "Batch processing", "annualCharge": "Annual payment upfront", "annualRefill": "100 fresh credits each month", "subscribe": "Subscribe to Starter", "subscribePro": "Subscribe to Pro", "subscribeAnnual": "Subscribe annually", "mostPopular": "MOST POPULAR", "bestEconomy": "BEST SAVINGS", "policyExplain": "Unused credits do not roll over. Every cycle resets the balance to your plan allowance. Cancel future charges anytime; access lasts until the paid period ends.", "creditsEyebrow": "CREDITS PER IMAGE", "creditsTitle": "Know the cost before processing.", "creditsIntro": "Quality is automatic. Bigger tasks cost more credits to keep plans affordable.", "toolRate": "Tool", "ratesFoot": "1× costs the same as 2×. For 5×–7×, the exact cost is shown when selecting a scale. Background remover preserves size.", "cancelSubscription": "Cancel automatic renewal", "previewCharge": "Preview: subscriptions are not live yet. Configure billing and the GPU backend to enable checkout."});
Object.assign(translations.es, {"pricingEyebrow": "PLANES ZIKA IA", "pricingTitle": "Más calidad. Menos coste.", "pricingSubtitle": "Elige un plan, renueva los créditos cada mes y cancela cuando quieras.", "billingSummary": "Suscripción de renovación automática", "billingDetail": "Mensual: cobro cada mes • Anual: cobro una vez al año", "freePlan": "Gratis", "starterPlan": "Starter", "proPlan": "Pro", "annualPlan": "Anual", "creditsOnce": "créditos iniciales", "creditsMonthly": "créditos/mes", "freePlanSub": "Una sola vez por cuenta", "starterPlanSub": "Para el día a día", "proPlanSub": "Para mejorar muchas imágenes", "annualPlanSub": "12 meses de acceso • equivale a US$ 3,33/mes", "perMonth": "/mes", "perYear": "/año", "freeFeat1": "Descargas con marca de agua", "freeFeat2": "Prueba las tres herramientas", "freeFeat3": "Sin tarjeta de crédito", "freePlanBtn": "Empezar gratis", "noWatermark": "Sin marca de agua", "renewMonthly": "Créditos renovados mensualmente", "autoCardMonthly": "Cobro en tarjeta cada mes", "batchAccess": "Procesamiento por lotes", "annualCharge": "Pago anual anticipado", "annualRefill": "100 créditos renovados cada mes", "subscribe": "Suscribir Starter", "subscribePro": "Suscribir Pro", "subscribeAnnual": "Suscribir Anual", "mostPopular": "MÁS POPULAR", "bestEconomy": "MEJOR AHORRO", "policyExplain": "Los créditos no se acumulan: cada ciclo reemplaza el saldo con los créditos del plan. Puedes cancelar el próximo cobro; el acceso sigue hasta que termine el período pagado.", "creditsEyebrow": "CRÉDITOS POR IMAGEN", "creditsTitle": "Conoce el coste antes de procesar.", "creditsIntro": "La calidad es automática. Las tareas grandes consumen más créditos para mantener precios accesibles.", "toolRate": "Herramienta", "ratesFoot": "1× cuesta lo mismo que 2×. Para 5×–7× se muestra el coste al elegir la escala. Quitar fondo mantiene el tamaño.", "cancelSubscription": "Cancelar renovación automática", "previewCharge": "Vista previa: las suscripciones todavía no están activas. Configura pagos y el servidor GPU."});
let lang='pt',activeTool='photo',activeDemo='photo',files=[],objectUrls=new Set(),processing=false,toastTimer;
try{const savedLang=localStorage.getItem('zika-lang');lang=['pt','en','es'].includes(savedLang)?savedLang:'pt'}catch(e){}
const t=(key)=>translations[lang]?.[key]||key;
function showToast(message){const e=$('#toast');e.textContent=message;e.hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>e.hidden=true,6500)}
function labelTool(){const keys={photo:['toolPhotoTitle','toolPhotoDesc','process'],anime:['toolAnimeTitle','toolAnimeDesc','processAnime'],removebg:['toolRemoveTitle','toolRemoveDesc','processRemove']};const [title,description,process]=keys[activeTool];$('#toolTitle').textContent=t(title);$('#toolDescription').textContent=t(description);$('#processButton').innerHTML=`<span>✦</span><span>${t(process)}</span><span class="btn-arrow">→</span>`;const remove=activeTool==='removebg';$('#scaleSelect').disabled=remove;$('#scaleField').style.opacity=remove?'.5':'1';$$('.tool-tab').forEach(el=>{const isSelected=el.dataset.tool===activeTool;el.classList.toggle('active',isSelected);el.setAttribute('aria-selected',String(isSelected))});updateSize();window.ZikaCloud?.updateCost()}
function selectTool(name,scroll=false){if(!['photo','anime','removebg'].includes(name))return;activeTool=name;labelTool();if(name==='anime')selectDemo('anime');else if(name==='photo')selectDemo('photo');else if(name==='removebg')selectDemo('removebg');if(scroll)$('#studio').scrollIntoView({behavior:'smooth',block:'start'})}
function selectDemo(name){if(!demos[name])return;activeDemo=name;const d=demos[name];$('#beforeImage').src=d.before;$('#afterImage').src=d.after;const beforePt=name==='photo'?'Foto antes da melhoria':name==='anime'?'Desenho antes da melhoria':'Imagem original antes de remover o fundo';const beforeEn=name==='photo'?'Photo before enhancement':name==='anime'?'Drawing before enhancement':'Original image before background removal';const afterPt=name==='photo'?'Foto após melhoria pelo Zika IA':name==='anime'?'Desenho após melhoria pelo Zika IA':'Imagem com fundo removido pelo Zika IA';const afterEn=name==='photo'?'Photo enhanced by Zika IA':name==='anime'?'Drawing enhanced by Zika IA':'Image with background removed by Zika IA';const beforeEs=name==='photo'?'Foto antes de la mejora':name==='anime'?'Dibujo antes de la mejora':'Imagen original antes de quitar el fondo';const afterEs=name==='photo'?'Foto mejorada por Zika IA':name==='anime'?'Dibujo mejorado por Zika IA':'Imagen con fondo eliminado por Zika IA';$('#beforeImage').alt={pt:beforePt,en:beforeEn,es:beforeEs}[lang];$('#afterImage').alt={pt:afterPt,en:afterEn,es:afterEs}[lang];$('#compareStage').dataset.demo=name;$('#demoLabel').textContent=t(d.label);$('#demoDescription').textContent=t(d.subtitle);$('#demoBadge').textContent=d.badge;$('#demoSizes').textContent=`${d.beforeSize} px → ${d.afterSize} px`;$$('.demo-thumb').forEach(b=>{const on=b.dataset.demo===name;b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on))});setComparison(52)}
function setComparison(raw){const pct=Math.max(0,Math.min(100,Number(raw)||0));$('#compareRange').value=String(pct);$('#afterLayer').style.clipPath=`inset(0 ${100-pct}% 0 0)`;$('#handleLine').style.left=pct+'%';$('#compareRange').setAttribute('aria-valuetext',pct+'%')}
function setLang(next){lang=['pt','en','es'].includes(next)?next:'pt';document.documentElement.lang={pt:'pt-BR',en:'en',es:'es'}[lang];document.title={pt:'Zika IA — Melhore imagens com inteligência artificial',en:'Zika IA — AI Image Enhancement',es:'Zika IA — Mejora imágenes con inteligencia artificial'}[lang];$$('[data-i18n]').forEach(el=>{el.textContent=t(el.dataset.i18n)});$$('.lang-btn').forEach(el=>{const active=el.dataset.lang===lang;el.classList.toggle('active',active);el.setAttribute('aria-pressed',String(active))});['scaleSelect'].forEach(id=>{const sel=$('#'+id),values=[1,2,4,5,6,7,8],v=sel.value;values.forEach((x,i)=>sel.options[i].textContent=t('scaleOptions')[i]);sel.value=v});labelTool();selectDemo(activeDemo);renderFiles();applyPlanUi();window.ZikaCloud?.translate();$('#menuToggle').setAttribute('aria-label',t('menu'));$('#compareRange').setAttribute('aria-label',{pt:'Arraste para comparar antes e depois',en:'Drag to compare before and after',es:'Arrastra para comparar antes y después'}[lang]);$('#dropzone').setAttribute('aria-label',{pt:'Escolher imagens',en:'Choose images',es:'Seleccionar imágenes'}[lang]);try{localStorage.setItem('zika-lang',lang)}catch(e){}}
function updateSize(){const top=files[0];const size=$('#sizeEstimate'),secondary=$('#sizeSecondary');if(!top){size.textContent=t('sizeNoFile');secondary.textContent=t('sizeHint');return}const mul=activeTool==='removebg'?1:parseInt($('#scaleSelect').value,10);const w=Math.round(top.width*mul),h=Math.round(top.height*mul),cm=x=>(x*2.54/72).toLocaleString(lang==='pt'?'pt-BR':lang==='es'?'es-ES':'en-US',{maximumFractionDigits:1});size.textContent=`${w.toLocaleString(lang==='pt'?'pt-BR':lang==='es'?'es-ES':'en-US')} × ${h.toLocaleString(lang==='pt'?'pt-BR':lang==='es'?'es-ES':'en-US')} px  ·  ${cm(w)} × ${cm(h)} cm`;secondary.textContent=activeTool==='removebg'?t('sizePreserved'):`${top.width} × ${top.height} px  →  ${mul}× · PNG`;}
const acceptedTypes=new Set(['image/png','image/jpeg','image/webp','image/bmp','image/gif','image/avif']);
async function readDimensions(file,url){return new Promise(resolve=>{const im=new Image();im.onload=()=>resolve({width:im.naturalWidth,height:im.naturalHeight});im.onerror=()=>resolve({width:0,height:0});im.src=url})}
async function loadFiles(input){const list=Array.from(input||[]);if(!list.length)return;let total=files.length;for(const file of list){if(total>=20){showToast(t('tooMany'));break}if(!acceptedTypes.has(file.type)){showToast(t('badFile'));continue}if(file.size>20*1048576){showToast(t('maxSize'));continue}const url=URL.createObjectURL(file);objectUrls.add(url);const dimensions=await readDimensions(file,url);if(!dimensions.width||!dimensions.height){URL.revokeObjectURL(url);objectUrls.delete(url);showToast(t('badFile'));continue}files.push({file,url,...dimensions});total++}renderFiles()}
function renderFiles(){const container=$('#fileList');container.textContent='';files.forEach((f,i)=>{const row=document.createElement('div');row.className='file-item';const img=document.createElement('img');img.src=f.url;img.alt='';const info=document.createElement('span');info.className='file-item-info';const nm=document.createElement('strong');nm.textContent=f.file.name;nm.title=f.file.name;const meta=document.createElement('small');meta.textContent=`${f.width} × ${f.height} px · ${(f.file.size/1048576).toFixed(2)} MB`;info.append(nm,meta);const remove=document.createElement('button');remove.className='file-remove';remove.type='button';remove.textContent='×';remove.setAttribute('aria-label',`Remove ${f.file.name}`);remove.addEventListener('click',()=>{URL.revokeObjectURL(f.url);objectUrls.delete(f.url);files.splice(i,1);renderFiles()});row.append(img,info,remove);container.append(row)});$('#emptyDrop').hidden=files.length>0;$('#selectedFiles').hidden=!files.length;$('#processButton').disabled=!files.length||processing;updateSize();window.ZikaCloud?.updateCost()}
function clearFiles(){for(const f of files){URL.revokeObjectURL(f.url);objectUrls.delete(f.url)}files=[];$('#fileInput').value='';renderFiles()}

function getAccessPlan(){return window.ZikaCloud?.state?.paid?'paid':'free'}
function getPlanTier(){return window.ZikaCloud?.state?.tier||'free'}
function applyPlanUi(){const note=$('#planNote');if(note)note.textContent=window.ZikaCloud?.state?.developer?(lang==='pt'?'✦ Desenvolvedor · créditos ilimitados · sem marca d’água':lang==='es'?'✦ Desarrollador · créditos ilimitados · sin marca de agua':'✦ Developer · unlimited credits · no watermark'):window.ZikaCloud?.state?.email?`${t('inlinePlanLabel')}: ${getAccessPlan()==='free'?t('inlinePlanFree'):t('inlinePlanPaid')}`:(lang==='pt'?'Entre na conta para consultar seu plano':lang==='es'?'Inicia sesión para consultar tu plan':'Sign in to view your plan');$$('.plan-card').forEach(card=>{const current=!!window.ZikaCloud?.state?.email&&card.dataset.plan===getPlanTier();card.classList.toggle('current-plan',current);const state=card.querySelector('.plan-state');if(state){state.textContent=current?t('planCurrent'):(card.dataset.plan==='annual'?t('planBestValue'):'');state.classList.toggle('hidden-state',!current&&card.dataset.plan!=='annual')}})}
function saveBlob(blob,name){const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),10000)}
async function processImages(){if(window.ZikaCloud)return await window.ZikaCloud.processImages();showToast('Serviço ainda não configurado.')}
function start(){setLang(lang);applyPlanUi();$('#year').textContent=String(new Date().getFullYear());$$('.lang-btn').forEach(btn=>btn.addEventListener('click',()=>setLang(btn.dataset.lang)));$$('.tool-tab').forEach(btn=>btn.addEventListener('click',()=>selectTool(btn.dataset.tool)));$$('[data-go-tool]').forEach(el=>el.addEventListener('click',()=>{selectTool(el.dataset.goTool);$('#mobileMenu').hidden=true;$('#menuToggle').setAttribute('aria-expanded','false')}));$$('[data-select-tool]').forEach(btn=>btn.addEventListener('click',()=>selectTool(btn.dataset.selectTool,true)));$$('.demo-thumb').forEach(btn=>btn.addEventListener('click',()=>selectDemo(btn.dataset.demo)));$('#compareRange').addEventListener('input',e=>setComparison(e.target.value));setComparison(52);$('#scaleSelect').addEventListener('change',()=>{updateSize();window.ZikaCloud?.updateCost()});const fileInput=$('#fileInput');const choose=()=>fileInput.click();$('#chooseFiles').addEventListener('click',e=>{e.stopPropagation();choose()});$('#addFiles').addEventListener('click',e=>{e.stopPropagation();choose()});fileInput.addEventListener('change',e=>{loadFiles(e.target.files);e.target.value='' });const zone=$('#dropzone');zone.addEventListener('click',e=>{if(e.target.closest('button')||$('#emptyDrop').hidden)return;choose()});zone.addEventListener('keydown',e=>{if(e.target===zone&&(e.key==='Enter'||e.key===' ')){e.preventDefault();choose()}});['dragover','dragenter'].forEach(ev=>zone.addEventListener(ev,e=>{e.preventDefault();zone.classList.add('drag-active')}));['dragleave','dragend'].forEach(ev=>zone.addEventListener(ev,()=>zone.classList.remove('drag-active')));zone.addEventListener('drop',e=>{e.preventDefault();zone.classList.remove('drag-active');loadFiles(e.dataTransfer.files)});$('#clearFiles').addEventListener('click',e=>{e.stopPropagation();clearFiles()});$('#processButton').addEventListener('click',processImages);const toggle=$('#menuToggle');toggle.addEventListener('click',()=>{const m=$('#mobileMenu');m.hidden=!m.hidden;toggle.setAttribute('aria-expanded',String(!m.hidden))});$$('#mobileMenu a').forEach(el=>el.addEventListener('click',()=>{$('#mobileMenu').hidden=true;toggle.setAttribute('aria-expanded','false')}));window.addEventListener('beforeunload',()=>{for(const u of objectUrls)URL.revokeObjectURL(u)})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
