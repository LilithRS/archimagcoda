
/* ============================================================
   1. Данные и утилиты
   ============================================================ */
const COURSES = [
  "Первые чары: Scratch",
  "Python: заклинания и алгоритмы",
  "Веб-магия: HTML / CSS / JS",
  "Создатель игр: Godot",
  "ИИ и нейрочары",
  "Олимпиадная магия: C++"
];
const ICONS = {
  scratch:'<rect x="3" y="4" width="18" height="16" rx="3"/><path d="M7 9h4v4H7zM13 9h4M13 13h4M7 16h10"/>',
  python:'<path d="M12 3c-4 0-5 2-5 4v3h6v1H6c-2 0-3 2-3 5s1 5 3 5h2v-4c0-2 1-3 3-3h5c2 0 3-1 3-3V7c0-2-1-4-5-4z"/><circle cx="9.5" cy="7" r=".8" fill="currentColor"/><path d="M12 21c4 0 5-2 5-4v-3h-6v-1h7c2 0 3-2 3-5s-1-5-3-5h-2v4c0 2-1 3-3 3H8c-2 0-3 1-3 3v3c0 2 1 4 5 4z"/><circle cx="14.5" cy="17" r=".8" fill="currentColor"/>',
  web:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
  game:'<path d="M7 8h10a4 4 0 0 1 4 4l-1 5a3 3 0 0 1-5 1l-1-2H10l-1 2a3 3 0 0 1-5-1L3 12a4 4 0 0 1 4-4z"/><path d="M7.5 11v3M6 12.5h3M16 11.5h.01M18 13.5h.01"/>',
  ai:'<rect x="4" y="5" width="16" height="14" rx="3"/><path d="M9 10h.01M15 10h.01M9 15c2 1.5 4 1.5 6 0M12 2v3M2 12h2M20 12h2M12 19v3"/>',
  cpp:'<path d="m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16"/>'
};
const COURSE_DATA = [
  {icon:'scratch',age:'7-9',level:'Первый круг',duration:'4 месяца',lang:'Scratch',color:'#49d6ff',
   desc:'Блочные чары: ребёнок собирает мультфильмы и мини-игры, не пугаясь синтаксиса. Учимся думать последовательностями, условиями и циклами через игру.',
   syllabus:['Оживляем персонажей и придумываем сюжет','Условия, циклы и события как «заклинания»','Свой первый проект: игра-лабиринт','Защита проекта перед гильдией и родителями']},
  {icon:'python',age:'10-12',level:'Второй круг',duration:'6 месяцев',lang:'Python',color:'#8b6cff',
   desc:'Настоящий текстовый код: переменные, функции, списки и алгоритмы превращаются в чат-ботов, генераторы загадок и текстовые квесты.',
   syllabus:['Переменные, типы данных и волшебный ввод','Условия, циклы и отладка «по шагам»','Функции и списки: свой генератор историй','Итоговый проект на выбор ребёнка']},
  {icon:'web',age:'10-12',level:'Второй круг',duration:'5 месяцев',lang:'HTML / CSS / JS',color:'#5eead4',
   desc:'Сайт как артефакт: от первой строчки разметки до интерактивной страницы, которую можно отправить друзьям ссылкой.',
   syllabus:['HTML-каркас и семантика страницы','CSS: цвета, сетки, анимации и адаптивность','JavaScript: кнопки, события, мини-игры','Публикация своего сайта в сети']},
  {icon:'game',age:'13-16',level:'Третий круг',duration:'8 месяцев',lang:'Godot / GDScript',color:'#ffcf87',
   desc:'Полный цикл создания 2D-игры: уровни, физика, персонажи, звук и сборка билда, который можно скачать и показать друзьям.',
   syllabus:['Сцены, ноды и игровой цикл','Физика, управление и столкновения','Уровни, интерфейс, очки и звук','Релиз своей игры и презентация']},
  {icon:'ai',age:'13-16',level:'Третий круг',duration:'5 месяцев',lang:'Python + ML',color:'#2f8bff',
   desc:'Что такое нейросети, как они учатся и где ошибаются. Обучаем классификатор, пробуем генерацию и обсуждаем этику ИИ.',
   syllabus:['Данные и признаки: учим машину видеть','Первая модель и честная проверка точности','Генеративные модели и промпты','Проект: «умный» помощник своей гильдии']},
  {icon:'cpp',age:'13-16',level:'Круг архимага',duration:'9 месяцев',lang:'C++',color:'#c79bff',
   desc:'Алгоритмы, сложность и олимпиадные задачи для тех, кто хочет соревноваться и поступать в профильные классы и вузы.',
   syllabus:['Синтаксис, память и отладка','Сортировки, поиск, структуры данных','Динамика, графы, жадные алгоритмы','Разбор настоящих олимпиадных задач']}
];
const LESSONS = [
  {t:'Разведка идеи',s:'5–10 минут · обсуждение',icon:'✦',text:'Наставник начинает с вопроса «а что, если...». Ребёнок сам формулирует, что должно получиться, и рисует план на доске или в цифровом блокноте.',list:['Никакой лекции вместо дела','Идея принадлежит ребёнку','Можно придумать что угодно'],mana:20},
  {t:'Сборка заклинания',s:'35 минут · практика',icon:'{ }',text:'Пишем код небольшими шагами и сразу запускаем. Каждая новая строчка что-то меняет на экране — магия становится видимой и понятной.',list:['Живой результат каждые 5 минут','Ошибки — это часть задания','Наставник рядом, но не за руку'],mana:58},
  {t:'Отладка и «почему»',s:'20 минут · разбор',icon:'⚙',text:'Разбираем, что пошло не так и почему. Ребёнок учится читать сообщения об ошибках и объяснять решение вслух — именно здесь рождается настоящее понимание.',list:['Читаем логи и гипотезы','Парное программирование','Вопрос «почему?» важнее ответа'],mana:82},
  {t:'Показ гильдии',s:'15 минут · демонстрация',icon:'★',text:'Каждый показывает свой проект и рассказывает, как он работает. В конце — короткая обратная связь и новый «уровень» в личном гримуаре.',list:['Презентация без страха','Прогресс виден родителям','Домашка только по желанию'],mana:100}
];
const SPELLS = [
  {tab:'Scratch',file:'кот-чары.sb3',color:'#49d6ff',result:'Кот ожил, мяукнул и побежал за курсором ✦',
   code:'<span class="tok-com"># 🪄 первое заклинание</span>\n<span class="tok-key">когда</span> <span class="tok-fn">нажат</span> <span class="tok-str">▶</span>\n  <span class="tok-fn">сказать</span> <span class="tok-str">«Привет, архимаг!»</span>\n  <span class="tok-key">повторить</span> <span class="tok-num">10</span>\n    <span class="tok-fn">идти</span> <span class="tok-num">10</span> шагов\n    <span class="tok-fn">изменить</span> цвет на <span class="tok-num">25</span>'},
  {tab:'Python',file:'spellbook.py',color:'#8b6cff',result:'Дракон из света появился над академией ✦',
   code:'<span class="tok-com"># 🪄 summon a light dragon</span>\n<span class="tok-key">import</span> <span class="tok-var">magic</span>\n\n<span class="tok-key">def</span> <span class="tok-fn">summon</span>(<span class="tok-var">mana</span>=<span class="tok-num">100</span>):\n    <span class="tok-var">dragon</span> = <span class="tok-var">magic</span>.<span class="tok-fn">Dragon</span>(<span class="tok-str">"light"</span>)\n    <span class="tok-key">return</span> <span class="tok-var">dragon</span>.<span class="tok-fn">awaken</span>(<span class="tok-var">mana</span>)\n\n<span class="tok-fn">print</span>(<span class="tok-fn">summon</span>())'},
  {tab:'JavaScript',file:'portal.js',color:'#5eead4',result:'Портал открыт: можно переходить на новый уровень ✦',
   code:'<span class="tok-com">// 🪄 open the code portal</span>\n<span class="tok-key">const</span> <span class="tok-var">portal</span> = <span class="tok-fn">createPortal</span>({\n  <span class="tok-var">rune</span>: <span class="tok-str">"archimag"</span>,\n  <span class="tok-var">mana</span>: <span class="tok-num">100</span>\n});\n\n<span class="tok-var">portal</span>.<span class="tok-fn">charge</span>().<span class="tok-fn">open</span>();'}
];
const CODEX_LINES = ['import magic','wand = Wand("архимаг")','wand.charge(mana=100)','wand.cast("lumos")'];
const SCHEMA_FALLBACK = `CREATE TABLE reviews (\n  id INTEGER PRIMARY KEY AUTOINCREMENT,\n  author TEXT NOT NULL, role TEXT NOT NULL,\n  course TEXT NOT NULL, rating INTEGER CHECK(rating BETWEEN 1 AND 5),\n  text TEXT NOT NULL, likes INTEGER DEFAULT 0,\n  status TEXT DEFAULT 'published', created_at TEXT NOT NULL\n);\nCREATE TABLE leads (\n  id INTEGER PRIMARY KEY AUTOINCREMENT, parent TEXT, child TEXT,\n  age INTEGER, course TEXT, contact TEXT, created_at TEXT\n);`;
const SCHEMA_POSTGRES = `CREATE TABLE reviews (\n  id SERIAL PRIMARY KEY,\n  author TEXT NOT NULL, role TEXT NOT NULL,\n  course TEXT NOT NULL, rating INTEGER CHECK(rating BETWEEN 1 AND 5),\n  text TEXT NOT NULL, likes INTEGER DEFAULT 0,\n  status TEXT DEFAULT 'published', created_at TEXT NOT NULL\n);\nCREATE TABLE leads (\n  id SERIAL PRIMARY KEY, parent TEXT, child TEXT,\n  age INTEGER, course TEXT, contact TEXT, created_at TEXT\n);\nCREATE INDEX idx_reviews_created ON reviews(created_at DESC);`;
const ENDPOINTS = [
  ['GET','/api/reviews','список отзывов, фильтры course / q / sort'],
  ['POST','/api/reviews','создать отзыв (валидация + антиспам)'],
  ['POST','/api/reviews/:id/like','+1 к лайкам отзыва'],
  ['DELETE','/api/reviews/:id','удалить отзыв · только админ'],
  ['GET','/api/leads','заявки на урок · только админ'],
  ['POST','/api/leads','создать заявку (публично)'],
  ['GET','/api/stats','агрегаты: средний рейтинг, по курсам'],
  ['GET','/api/export.csv','выгрузка CSV · только для админа'],
  ['POST','/api/admin/login','вход: cookie-сессия HMAC'],
  ['GET','/api/admin/session','состояние сессии'],
  ['POST','/api/admin/logout','выход']
];

const $ = (s,r=document)=>r.querySelector(s);
const $$ = (s,r=document)=>Array.from(r.querySelectorAll(s));
const esc = s => String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pad2 = n=>String(n).padStart(2,'0');
const reduced = ()=>typeof window.matchMedia==='function'&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function daysAgo(n){const d=new Date(Date.now()-n*86400000);return `${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())} ${pad2(d.getHours())}:${pad2(d.getMinutes())}`;}
const SEED = [
  ['Анна М.','родитель',COURSES[0],5,'Сын пришёл с первого урока и два часа рассказывал, как «оживил» кота в Scratch. Даже бабушке показал проект по видеосвязи. Впервые вижу, чтобы домашка вызывала такой восторг.',24,1],
  ['Мила, 11 лет','ученик',COURSES[1],5,'Написала программу, которая загадывает загадки про единорогов. Наставник показал, как сделать её сложнее, и теперь в неё играет весь класс!',18,2],
  ['Игорь П.','родитель',COURSES[2],5,'Дочь собрала сайт-портфолио про свой аквариум. Очень круто, что занятия не по учебнику, а сразу про настоящий проект и видимый результат.',31,4],
  ['Кирилл, 14 лет','ученик',COURSES[3],5,'Сделал свою первую игру с драконом за полтора месяца. Когда друг прошёл уровень, я чуть не взорвался от гордости.',42,7],
  ['Екатерина Л.','родитель',COURSES[5],5,'Готовились к олимпиаде, в итоге приз на региональном этапе. Отдельное спасибо за терпение: объясняют до тех пор, пока реально не станет понятно.',15,11],
  ['София, 13 лет','ученик',COURSES[4],5,'Учили нейросеть отличать котов от драконов. Получалось не сразу, но было очень интересно разбираться, почему она ошибается.',26,14],
  ['Дмитрий К.','родитель',COURSES[0],4,'Нравится, что группы маленькие и ребёнка реально слышат. Хотелось бы чуть больше домашних заданий, но это скорее плюс — не перегружают.',9,19],
  ['Алина, 16 лет','выпускник',COURSES[5],5,'Пришла на Scratch в десять, закончила C++ и поступила в профильный класс. Архимаг — место, где не боялись моих «а что, если...».',27,25]
].map((r,i)=>({id:1000+i,author:r[0],role:r[1],course:r[2],rating:r[3],text:r[4],likes:r[5],status:'published',created_at:daysAgo(r[6])}));
const SEED_LEADS = [
  ['Мария','Тимур',9,COURSES[0],'maria@example.com',1],
  ['Олег','Варя',12,COURSES[1],'+7 900 000-00-00',3],
  ['Наталья','Артём',15,COURSES[3],'nat@example.com',6]
].map((r,i)=>({id:500+i,parent:r[0],child:r[1],age:r[2],course:r[3],contact:r[4],created_at:daysAgo(r[5])}));

/* Хранилище с фолбэком: в песочнице просмотрщика localStorage может быть недоступен */
const mem = {};
const store = {
  get(k){try{return localStorage.getItem(k)}catch(e){return mem[k]||null}},
  set(k,v){try{localStorage.setItem(k,v)}catch(e){mem[k]=v}}
};
function localReviews(){
  try{const raw=store.get('archimag_reviews');if(raw){const a=JSON.parse(raw);if(Array.isArray(a))return a;}}catch(e){}
  return SEED.slice();
}
function localLeads(){
  try{const raw=store.get('archimag_leads');if(raw){const a=JSON.parse(raw);if(Array.isArray(a))return a;}}catch(e){}
  return SEED_LEADS.slice();
}
function saveLocal(){store.set('archimag_reviews',JSON.stringify(state.reviews));store.set('archimag_leads',JSON.stringify(state.leads));}

const state = {
  mode:'local', view:'site', reviews:[], leads:[], stats:null,
  filter:'all', sort:'new', expanded:false, fresh:new Set(), liked:new Set(),
  dbTab:'reviews', dbQuery:'', dbCourse:'all', dbRating:'all',
  spell:1, lesson:0, age:'all', rating:5, codex:[], codexStep:0, codexSolved:false,
  preselectCourse:'', authRequired:false, admin:true, engine:'sqlite'
};
let toastTimer;
function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('show'),3000);}
/* Если фронтенд и API живут на разных доменах, задайте перед подключением app.js:
   window.ARCHIMAG_API_BASE = 'https://your-api.example.com/';
   По умолчанию используются относительные пути api/... (один сервер). */
const API_BASE = window.ARCHIMAG_API_BASE ? String(window.ARCHIMAG_API_BASE).replace(/\/?$/, '/') : '';
const apiUrl = p => API_BASE + 'api' + p;
function api(path,opts={}){return fetch(apiUrl(path),Object.assign({headers:{'Content-Type':'application/json'}},opts));}
async function apiJSON(path,opts){const r=await api(path,opts);const d=await r.json();if(!r.ok)throw new Error(d.error||'Ошибка запроса');return d;}

/* ============================================================
   2. Загрузка данных: PostgreSQL / SQLite или локальный демо-режим
   ============================================================ */
async function boot(){
  try{
    const ctrl=new AbortController();const timer=setTimeout(()=>ctrl.abort(),1600);
    const hr=await fetch(apiUrl('/health'),{signal:ctrl.signal});clearTimeout(timer);
    if(!hr.ok)throw new Error('no api');
    const h=await hr.json().catch(()=>({}));
    state.engine=h.engine||'sqlite';
    const rev=await apiJSON('/reviews');
    state.mode='server';state.reviews=rev.items;
    state.stats=await apiJSON('/stats').catch(()=>null);
    const sess=await apiJSON('/admin/session').catch(()=>({auth_required:true,authenticated:false}));
    state.authRequired=!!sess.auth_required;
    state.admin=state.authRequired?!!sess.authenticated:true;
    if(state.admin){
      const ld=await apiJSON('/leads').catch(()=>({items:[]}));
      state.leads=ld.items||[];
    }else state.leads=[];
  }catch(e){
    state.mode='local';state.engine='local';state.authRequired=false;state.admin=true;
    state.reviews=localReviews();state.leads=localLeads();state.stats=null;
  }
  buildStatic();renderReviews();renderDB();updateMode();
  if(state.mode==='server')setInterval(sync,5000);
}
function engineLabel(){return state.engine==='postgresql'?'PostgreSQL':'SQLite';}
function updateMode(){
  const server=state.mode==='server';
  $('#modeBadge').textContent=server?engineLabel()+' · LIVE':'Демо · локально';
  $('#dbStatus').innerHTML='<i></i>'+(server?engineLabel()+' подключена':'демо-хранилище')+(state.authRequired?' · 🔒':'');
  $('#dbStatus').style.color=server?'':'var(--gold)';
  const auth=$('#adminAuthBtn');
  auth.style.display=(server&&state.authRequired&&state.admin)?'inline-flex':'none';
  auth.textContent='Выйти';
  $('#storageNote').textContent=server
    ? `Отзывы и заявки сохраняются в ${engineLabel()} на сервере. Форма публикует отзыв сразу, лента обновляется раз в 5 секунд. Админ-панель${state.authRequired?' защищена паролем':''}: поиск, удаление и выгрузка CSV.`
    : 'Сейчас открыт файл без сервера: отзывы работают в демо-режиме и сохраняются в браузере. Запустите server.py, чтобы форма писала в настоящую базу данных.';
  const note=$('#dbEngineNote');
  note.innerHTML=server
    ? (state.engine==='postgresql'
        ? 'PostgreSQL · общая база <span style="font-family:var(--mono)">DATABASE_URL</span> · таблицы <span style="font-family:var(--mono)">reviews</span> и <span style="font-family:var(--mono)">leads</span>'
        : 'SQLite · <span style="font-family:var(--mono)">data/reviews.db</span> · таблицы <span style="font-family:var(--mono)">reviews</span> и <span style="font-family:var(--mono)">leads</span>')
    : 'Демо-режим · <span style="font-family:var(--mono)">localStorage</span> · таблицы <span style="font-family:var(--mono)">reviews</span> и <span style="font-family:var(--mono)">leads</span>';
}
async function sync(manual){
  if(state.mode!=='server'||(document.visibilityState==='hidden'&&!manual))return;
  try{
    const [rev,st]=await Promise.all([apiJSON('/reviews'),apiJSON('/stats')]);
    const known=new Set(state.reviews.map(r=>r.id));
    const added=rev.items.filter(r=>!known.has(r.id));
    state.reviews=rev.items;state.stats=st;
    if(state.authRequired){
      const sess=await apiJSON('/admin/session').catch(()=>null);
      if(sess&&!sess.authenticated&&state.admin){adminExpired();return;}
    }
    if(state.admin){
      const ld=await apiJSON('/leads').catch(()=>null);
      if(ld)state.leads=ld.items||[];
    }
    if(added.length){added.forEach(r=>state.fresh.add(r.id));toast(`✦ Новый отзыв в академии: ${added[0].author}`);}
    renderReviews();if(state.view==='database')renderDB();
    if(manual)toast('Данные обновлены из '+engineLabel());
  }catch(e){/* временно недоступно — оставляем текущие данные */}
}

/* ============================================================
   3. Статические интерактивные блоки
   ============================================================ */
function buildStatic(){
  // ticker
  const words=['PYTHON','SCRATCH','АЛГОРИТМЫ','GODOT','НЕЙРОСЕТИ','C++','ПЕРВЫЙ ПРОЕКТ','ГИЛЬДИИ','ОЛИМПИАДЫ','HTML / CSS','ОТЛАДКА','МАНА 100%'];
  $('#tickerTrack').innerHTML=(words.concat(words)).map(w=>`<span>${w}</span>`).join('');
  // selects
  const opts=COURSES.map(c=>`<option value="${esc(c)}">${esc(c)}</option>`).join('');
  $('#reviewFilter').innerHTML='<option value="all">Все направления</option>'+opts;
  $('#reviewCourse').innerHTML=opts;
  $('#leadCourse').innerHTML=opts;
  // courses
  $('#courseGrid').innerHTML=COURSE_DATA.map((c,i)=>`
    <button class="course-card" data-course="${i}" data-age="${c.age}">
      <span class="rune">${i%2?'{ }':'✦'}</span>
      <span class="course-icon" style="color:${c.color}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${ICONS[c.icon]}</svg></span>
      <div class="course-meta"><span class="tag">${c.age} лет</span><span class="tag gold">${c.level}</span><span class="tag">${c.lang}</span></div>
      <h3>${esc(COURSES[i])}</h3><p>${esc(c.desc)}</p>
      <span class="course-link">Открыть программу <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>
    </button>`).join('');
  // lessons
  $('#lessonSteps').innerHTML=LESSONS.map((l,i)=>`<button class="lesson-step ${i===0?'active':''}" data-lesson="${i}"><span class="num">${pad2(i+1)}</span><span><b>${l.t}</b><small>${l.s}</small></span></button>`).join('');
  renderLesson();
  // spells
  $('#spellTabs').innerHTML=SPELLS.map((s,i)=>`<button data-spell="${i}" class="${i===state.spell?'active':''}">${s.tab}</button>`).join('');
  renderSpell();initCanvas();
  // codex
  shuffleCodex();
  // counters
  if('IntersectionObserver' in window){
    const io=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){animateCount(e.target);io.unobserve(e.target)}})},{threshold:.4});
    $$('[data-count]').forEach(el=>io.observe(el));
  }else{$$('[data-count]').forEach(animateCount)}
  // mouse parallax
  const hero=$('.hero');
  if(hero&&!reduced()){
    hero.addEventListener('mousemove',e=>{
      const x=(e.clientX/innerWidth-.5)*14,y=(e.clientY/innerHeight-.5)*10;
      const c=$('#spellConsole');if(c)c.style.transform=`translate(${x*.35}px,${y*.35}px)`;
      const r=$('.hero-runes');if(r)r.style.marginLeft=`${x}px`;
    });
  }
}
function animateCount(el){
  const target=parseFloat(el.dataset.count),dec=+(el.dataset.decimal||0),suffix=el.dataset.suffix||'';
  const dur=1200,start=performance.now();
  function frame(t){
    const p=Math.min(1,(t-start)/dur),v=target*(1-Math.pow(1-p,3));
    el.textContent=(dec?v.toFixed(dec):Math.round(v).toLocaleString('ru-RU'))+suffix;
    if(p<1)requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
function renderLesson(){
  $$('#lessonSteps .lesson-step').forEach(b=>b.classList.toggle('active',+b.dataset.lesson===state.lesson));
  const l=LESSONS[state.lesson];
  $('#lessonPanel').innerHTML=`<div class="big-rune">${l.icon}</div><div class="lp-icon" style="font-family:var(--mono);font-size:20px">${l.icon}</div>
    <h3>${pad2(state.lesson+1)}. ${l.t}</h3><p>${l.text}</p>
    <div class="lp-list">${l.list.map(x=>`<span>✦ ${x}</span>`).join('')}</div>
    <div class="mana-label"><span>Мана урока</span><span>${l.mana}%</span></div><div class="mana-bar"><i style="width:${l.mana}%"></i></div>`;
}
function renderSpell(){
  const s=SPELLS[state.spell];
  $$('#spellTabs button').forEach(b=>b.classList.toggle('active',+b.dataset.spell===state.spell));
  $('#spellFile').textContent=s.file;$('#spellCode').innerHTML=s.code;
  $('#spellOutput').textContent='Нажми «Произнести», чтобы увидеть магию';
}
/* Canvas: рунный круг и вспышка частиц */
let cv,ctx,particles=[],raf=null;
function initCanvas(){
  cv=$('#spellCanvas');if(!cv)return;
  try{ctx=cv.getContext('2d')}catch(e){ctx=null}
  if(!ctx)return; // без canvas интерфейс остаётся рабочим
  const resize=()=>{const r=cv.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);cv.width=Math.max(1,r.width*d);cv.height=Math.max(1,r.height*d);ctx.setTransform(d,0,0,d,0,0)};
  resize();if(window.ResizeObserver)new ResizeObserver(resize).observe(cv);else window.addEventListener('resize',resize);
  function frame(t){
    const w=cv.clientWidth,h=cv.clientHeight;ctx.clearRect(0,0,w,h);
    const cx=w/2,cy=h/2,tm=t/1000,col=SPELLS[state.spell].color;
    ctx.save();ctx.translate(cx,cy);ctx.rotate(tm*.25);
    ctx.strokeStyle='rgba(73,214,255,.35)';ctx.lineWidth=1;ctx.setLineDash([4,9]);
    ctx.beginPath();ctx.arc(0,0,42,0,Math.PI*2);ctx.stroke();
    ctx.setLineDash([]);ctx.strokeStyle='rgba(139,108,255,.3)';
    ctx.beginPath();ctx.arc(0,0,29,0,Math.PI*2);ctx.stroke();
    for(let i=0;i<6;i++){const a=i*Math.PI/3;ctx.fillStyle='rgba(73,214,255,'+(.3+.25*Math.sin(tm*2+i))+')';ctx.beginPath();ctx.arc(Math.cos(a)*42,Math.sin(a)*42,2.2,0,Math.PI*2);ctx.fill()}
    ctx.restore();
    ctx.fillStyle=col;ctx.globalAlpha=.16+.1*Math.sin(tm*2);ctx.beginPath();ctx.arc(cx,cy,9,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
    particles=particles.filter(p=>p.life>0);
    particles.forEach(p=>{
      p.x+=p.vx;p.y+=p.vy;p.vy+=.012;p.life-=1;
      ctx.globalAlpha=Math.max(0,p.life/p.max);ctx.fillStyle=p.c;
      ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();
    });
    ctx.globalAlpha=1;
    if(!reduced())raf=requestAnimationFrame(frame);
  }
  if(raf)cancelAnimationFrame(raf);frame(0);
}
function burst(){
  const s=SPELLS[state.spell];$('#spellOutput').textContent=s.result;
  if(!cv||!ctx)return;
  const w=cv.clientWidth,h=cv.clientHeight,col=s.color;
  for(let i=0;i<90;i++){
    const a=Math.random()*Math.PI*2,sp=.6+Math.random()*3.4,life=45+Math.random()*55;
    particles.push({x:w/2,y:h/2,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp-.4,life,max:life,r:.8+Math.random()*2.2,c:Math.random()>.55?col:'#eaf7ff'});
  }
  if(reduced()){/* частицы не анимируем */}
}
function shuffleCodex(){
  let a=[0,1,2,3];
  do{a.sort(()=>Math.random()-.5)}while(a.join('')==='0123');
  state.codex=a;state.codexStep=0;state.codexSolved=false;
  $('#codexBox').classList.remove('solved');renderCodex();
}
function renderCodex(){
  $('#codexLines').innerHTML=state.codex.map((idx,i)=>`<button class="code-line ${i<state.codexStep?'used':''}" data-codex="${idx}"><span class="ln">${pad2(i+1)}</span><span>${esc(CODEX_LINES[idx])}</span></button>`).join('');
  $('#codexProgress').innerHTML=[0,1,2,3].map(i=>`<i class="${i<state.codexStep?'on':''}"></i>`).join('');
  const st=$('#codexStatus');
  if(state.codexSolved){st.className='codex-status success';st.textContent='✦ Портал открыт! Первое заклинание собрано верно';}
  else{st.className='codex-status';st.textContent=`✦ Шаг ${state.codexStep+1} из 4 · выбери следующую строку`;}
}

/* ============================================================
   4. Живые отзывы
   ============================================================ */
function avatarColor(name){
  let h=0;for(const c of String(name))h=(h*31+c.charCodeAt(0))>>>0;
  const a=190+h%45,b=255+h%35;
  return `linear-gradient(135deg,hsl(${a} 90% 68%),hsl(${b} 90% 62%))`;
}
function dateLabel(s){
  const p=String(s||'').slice(0,10).split('-');
  return p.length===3?`${p[2]}.${p[1]}.${p[0].slice(2)}`:String(s||'').slice(0,10);
}
function reviewCard(r){
  const stars='★'.repeat(r.rating)+'☆'.repeat(5-r.rating);
  const initials=String(r.author).trim().split(/\s+/).slice(0,2).map(w=>w[0]).join('').toUpperCase();
  return `<article class="review-card ${state.fresh.has(r.id)?'is-new':''}">
    <div class="rc-top"><div class="avatar" style="background:${avatarColor(r.author)}">${esc(initials)}</div>
      <div class="rc-author"><b>${esc(r.author)}</b><span>${esc(r.role)} · ученик академии</span></div>
      <span class="rc-course" title="${esc(r.course)}">${esc(r.course)}</span></div>
    <div class="stars">${stars}</div>
    <p class="rc-text">«${esc(r.text)}»</p>
    <div class="rc-foot"><span class="rc-date">${dateLabel(r.created_at)}</span>
      <span style="display:flex;gap:10px;align-items:center"><span class="verified">✦ проверено</span>
      <button class="like-btn ${state.liked.has(r.id)?'liked':''}" data-like="${r.id}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 10v11H4V10zM7 10l4-7c2 0 3 1.5 3 3v3h5a2 2 0 0 1 2 2l-1.5 7a2 2 0 0 1-2 1.5H7"/></svg><span>${r.likes||0}</span></button></span></div>
  </article>`;
}
function renderReviews(){
  let items=state.reviews.slice();
  if(state.filter!=='all')items=items.filter(r=>r.course===state.filter);
  const cmp={new:(a,b)=>b.id-a.id,rating:(a,b)=>b.rating-a.rating||b.id-a.id,likes:(a,b)=>(b.likes||0)-(a.likes||0)||b.id-a.id}[state.sort];
  items.sort(cmp);
  const visible=state.expanded?items:items.slice(0,6);
  $('#reviewsGrid').innerHTML=visible.map(reviewCard).join('');
  $('#reviewsEmpty').style.display=items.length?'none':'block';
  $('#reviewsCount').textContent=`${items.length} отзыв${items.length===1?'':(items.length<5?'а':'ов')} · средняя оценка ${avgRating(items)} ★`;
  $('#showMore').style.display=items.length>6?'inline-flex':'none';
  $('#showMore').textContent=state.expanded?'Свернуть ↑':`Показать все отзывы (${items.length}) ↓`;
  setTimeout(()=>state.fresh.clear(),1200);
}
function avgRating(items){if(!items.length)return '—';return (items.reduce((s,r)=>s+r.rating,0)/items.length).toFixed(1);}

/* ============================================================
   5. Формы
   ============================================================ */
function openModal(id){
  $$('.modal-backdrop').forEach(m=>m.classList.remove('open'));
  $('#'+id).classList.add('open');document.body.style.overflow='hidden';
  if(id==='leadModal'&&state.preselectCourse)$('#leadCourse').value=state.preselectCourse;
}
function closeModal(){$$('.modal-backdrop').forEach(m=>m.classList.remove('open'));document.body.style.overflow='';}
function formError(id,msg){const e=$('#'+id);e.textContent=msg;e.classList.toggle('show',!!msg);}
function formData(form){
  const d={};new FormData(form).forEach((v,k)=>d[k]=typeof v==='string'?v.trim():v);
  d.consent=!!form.querySelector('[name=consent]').checked;return d;
}
async function submitReview(e){
  e.preventDefault();const f=e.target,d=formData(f);d.rating=state.rating;
  if(d.author.length<2)return formError('reviewError','Укажите имя (минимум 2 символа).');
  if(d.text.length<10)return formError('reviewError','Напишите отзыв чуть подробнее — минимум 10 символов.');
  if(!COURSES.includes(d.course))return formError('reviewError','Выберите направление из списка.');
  if(!d.consent)return formError('reviewError','Нужно согласие на публикацию отзыва.');
  formError('reviewError','');
  const btn=f.querySelector('[type=submit]');btn.disabled=true;btn.textContent='Публикуем…';
  try{
    let item;
    if(state.mode==='server'){
      const r=await apiJSON('/reviews',{method:'POST',body:JSON.stringify(d)});item=r.item;
    }else{
      item={id:Date.now(),author:d.author,role:d.role,course:d.course,rating:d.rating,text:d.text,likes:0,status:'published',created_at:daysAgo(0)};
    }
    state.reviews.unshift(item);state.fresh.add(item.id);
    if(state.mode==='local')saveLocal();
    state.filter='all';state.expanded=false;$('#reviewFilter').value='all';
    closeModal();f.reset();state.rating=5;paintStars();
    renderReviews();renderDB();switchView('site');
    setTimeout(()=>{const el=$('#reviews');if(el&&el.scrollIntoView)el.scrollIntoView({behavior:'smooth',block:'start'})},80);
    toast('✦ Отзыв опубликован и сохранён в базе!');
  }catch(err){formError('reviewError',err.message||'Не удалось отправить отзыв.')}
  finally{btn.disabled=false;btn.textContent='Опубликовать отзыв ✦'}
}
async function submitLead(e){
  e.preventDefault();const f=e.target,d=formData(f);d.age=parseInt(d.age,10);
  if(d.parent.length<2||d.child.length<2)return formError('leadError','Укажите имена родителя и ребёнка.');
  if(!(d.age>=6&&d.age<=18))return formError('leadError','Возраст должен быть от 6 до 18 лет.');
  if(d.contact.length<5)return formError('leadError','Укажите e-mail или телефон для связи.');
  if(!d.consent)return formError('leadError','Нужно согласие на обработку контактов.');
  formError('leadError','');
  const btn=f.querySelector('[type=submit]');btn.disabled=true;btn.textContent='Отправляем…';
  try{
    let item;
    if(state.mode==='server'){
      const r=await apiJSON('/leads',{method:'POST',body:JSON.stringify(d)});item=r.item;
    }else{
      item={id:Date.now(),parent:d.parent,child:d.child,age:d.age,course:d.course,contact:d.contact,created_at:daysAgo(0)};
    }
    state.leads.unshift(item);if(state.mode==='local')saveLocal();
    closeModal();f.reset();renderDB();toast('✦ Заявка принята! Наставник свяжется с вами.');
  }catch(err){formError('leadError',err.message||'Не удалось отправить заявку.')}
  finally{btn.disabled=false;btn.textContent='Отправить заявку ✦'}
}
function paintStars(){$$('#starsInput button').forEach(b=>b.classList.toggle('on',+b.dataset.star<=state.rating));}

/* ============================================================
   6. База данных (админ-экран)
   ============================================================ */
function statsData(){
  const rs=state.reviews,avg=rs.length?(rs.reduce((s,r)=>s+r.rating,0)/rs.length):0;
  const byCourse=COURSES.map(c=>({course:c,n:rs.filter(r=>r.course===c).length}));
  return {total:rs.length,avg,courses:COURSES.length,leads:state.leads.length,byCourse};
}
function adminGateHTML(){
  return `<div class="admin-gate"><div class="gate-icon">🔒</div>
    <h3>Вход в базу данных</h3>
    <p>Заявки содержат контакты родителей. Войдите под логином администратора, чтобы видеть таблицы, удалять записи и выгружать CSV.</p>
    <form id="adminLoginForm" class="admin-login-form" novalidate>
      <div class="field"><label>Логин</label><input name="username" autocomplete="username" value="admin"></div>
      <div class="field"><label>Пароль</label><input name="password" type="password" autocomplete="current-password" placeholder="••••••••"></div>
      <div class="form-error" id="adminError"></div>
      <button type="submit" class="btn btn-primary" style="width:100%">Войти ✦</button>
    </form>
    <div class="hint">Логин и пароль задаются переменными ADMIN_USER / ADMIN_PASSWORD на сервере. Сессия подписана HMAC и не хранится в памяти сервера — работает на нескольких инстансах.</div>
  </div>`;
}
async function adminLogin(f){
  const d={username:f.elements.username.value.trim(),password:f.elements.password.value};
  const btn=f.querySelector('[type=submit]');btn.disabled=true;btn.textContent='Проверяем…';
  try{
    await apiJSON('/admin/login',{method:'POST',body:JSON.stringify(d)});
    state.admin=true;
    const ld=await apiJSON('/leads').catch(()=>({items:[]}));
    state.leads=ld.items||[];
    renderDB();updateMode();toast('✦ Доступ к базе данных получен');
  }catch(e){
    const el=$('#adminError');
    if(el){el.textContent=e.message||'Неверный логин или пароль';el.classList.add('show')}
  }finally{btn.disabled=false;btn.textContent='Войти ✦'}
}
async function adminLogout(){
  try{await apiJSON('/admin/logout',{method:'POST',body:'{}'})}catch(e){}
  state.admin=false;state.leads=[];renderDB();updateMode();toast('Вы вышли из админки');
}
function adminExpired(){state.admin=false;state.leads=[];renderDB();updateMode();toast('Сессия истекла — войдите снова');}

function renderDB(){
  const s=statsData();
  const locked=state.mode==='server'&&state.authRequired&&!state.admin;
  $('#dbStats').innerHTML=`
    <div class="db-stat"><span>Отзывов в таблице</span><b>${s.total}</b><small>reviews · status = published</small></div>
    <div class="db-stat"><span>Средний рейтинг</span><b style="color:var(--gold)">${s.avg.toFixed(1)} ★</b><small>AVG(rating)</small></div>
    <div class="db-stat"><span>Направлений</span><b>${s.courses}</b><small> DISTINCT(course)</small></div>
    <div class="db-stat"><span>Заявок на урок</span><b>${locked?'—':s.leads}</b><small>${locked?'доступно после входа':'leads'}</small></div>`;
  $$('#dbTabs button').forEach(b=>b.classList.toggle('active',b.dataset.db===state.dbTab));
  const box=$('#dbContent');
  $('#dbExport').style.display=locked?'none':'';
  $('#dbRefresh').style.display=locked?'none':'';
  if(locked){box.innerHTML=adminGateHTML();return;}
  if(state.dbTab==='schema'){
    const ddl=esc(state.engine==='postgresql'?SCHEMA_POSTGRES:SCHEMA_FALLBACK);
    const engine=state.engine==='postgresql'?'PostgreSQL':'SQLite';
    box.innerHTML=`<div class="schema-pad"><pre>${ddl}</pre>
      <h3 style="font-size:15px;margin:0 0 12px">REST API сервера</h3>
      <div class="endpoint-list">${ENDPOINTS.map(([m,p,d])=>`<div class="endpoint"><b>${m}</b><span>${esc(p)}</span><span style="color:var(--dim);margin-left:auto">${esc(d)}</span></div>`).join('')}</div>
      <p style="font-size:11.5px;color:var(--dim);margin:18px 0 0;line-height:1.7">Движок: <span style="font-family:var(--mono);color:var(--cyan)">${engine}</span>. Запуск: <span style="font-family:var(--mono);color:var(--cyan)">python3 server.py 8001</span>. SQLite создаётся в <span style="font-family:var(--mono)">data/reviews.db</span>, PostgreSQL подключается через <span style="font-family:var(--mono)">DATABASE_URL</span>. В форме есть валидация, honeypot и ограничение частоты запросов; destructive-операции и контакты требуют входа.</p></div>`;
    return;
  }
  if(state.dbTab==='leads'){
    const q=state.dbQuery.toLowerCase();
    const rows=state.leads.filter(l=>!q||[l.parent,l.child,l.course,l.contact].join(' ').toLowerCase().includes(q));
    box.innerHTML=`<div class="db-toolbar"><input id="dbSearch" placeholder="Поиск по имени, курсу, контакту…" value="${esc(state.dbQuery)}"><span class="count">${rows.length} записей · таблица leads</span></div>`+tableShell(rows.length?`
      <thead><tr><th>ID</th><th>Дата</th><th>Родитель</th><th>Ребёнок</th><th>Возраст</th><th>Направление</th><th>Контакт</th><th></th></tr></thead>
      <tbody>${rows.map(l=>`<tr><td class="mono">#${l.id}</td><td class="mono">${esc(l.created_at)}</td><td>${esc(l.parent)}</td><td>${esc(l.child)}</td><td>${l.age}</td><td>${esc(l.course)}</td><td class="mono">${esc(l.contact)}</td><td><button class="del-btn" data-del-lead="${l.id}">Удалить</button></td></tr>`).join('')}</tbody>`:'');
    bindDBSearch();return;
  }
  const q=state.dbQuery.toLowerCase();
  let rows=state.reviews.filter(r=>(state.dbCourse==='all'||r.course===state.dbCourse)&&(state.dbRating==='all'||r.rating===+state.dbRating)&&(!q||[r.author,r.text,r.course,r.role].join(' ').toLowerCase().includes(q)));
  box.innerHTML=`<div class="db-toolbar">
      <input id="dbSearch" placeholder="Поиск по автору или тексту…" value="${esc(state.dbQuery)}">
      <select id="dbCourseSel"><option value="all">Все курсы</option>${COURSES.map(c=>`<option value="${esc(c)}" ${state.dbCourse===c?'selected':''}>${esc(c)}</option>`).join('')}</select>
      <select id="dbRatingSel"><option value="all">Любая оценка</option>${[5,4,3,2,1].map(n=>`<option value="${n}" ${state.dbRating==n?'selected':''}>${n} ★</option>`).join('')}</select>
      <span class="count">${rows.length} из ${state.reviews.length} записей · reviews</span></div>`+tableShell(rows.length?`
      <thead><tr><th>ID</th><th>Дата</th><th>Автор</th><th>Роль</th><th>Направление</th><th>★</th><th>Текст отзыва</th><th>♡</th><th>Статус</th><th></th></tr></thead>
      <tbody>${rows.map(r=>`<tr><td class="mono">#${r.id}</td><td class="mono">${esc(r.created_at)}</td><td>${esc(r.author)}</td><td><span class="badge">${esc(r.role)}</span></td><td>${esc(r.course)}</td><td class="rating-cell">${'★'.repeat(r.rating)}</td><td class="text-cell"><span title="${esc(r.text)}">${esc(r.text)}</span></td><td class="mono">${r.likes||0}</td><td><span class="badge green">${esc(r.status||'published')}</span></td><td><button class="del-btn" data-del-review="${r.id}">Удалить</button></td></tr>`).join('')}</tbody>`:'');
  bindDBSearch();
}
function tableShell(inner){return inner?`<div class="table-scroll"><table>${inner}</table></div>`:'<div class="db-empty">Ничего не найдено ✦</div>';}
function bindDBSearch(){
  const el=$('#dbSearch');if(el)el.addEventListener('input',e=>{state.dbQuery=e.target.value;renderDB();const n=$('#dbSearch');if(n){n.focus();n.setSelectionRange(n.value.length,n.value.length)}});
  const c=$('#dbCourseSel');if(c)c.addEventListener('change',e=>{state.dbCourse=e.target.value;renderDB()});
  const r=$('#dbRatingSel');if(r)r.addEventListener('change',e=>{state.dbRating=e.target.value;renderDB()});
}
function exportCSV(){
  if(state.mode==='server'){window.location.href=apiUrl('/export.csv');toast('↓ CSV выгружается из '+engineLabel());return;}
  const head=['id','created_at','author','role','course','rating','text','likes','status'];
  const lines=[head.join(';')].concat(state.reviews.map(r=>head.map(k=>'"'+String(r[k]==null?'':r[k]).replace(/"/g,'""')+'"').join(';')));
  const blob=new Blob(['\ufeff'+lines.join('\n')],{type:'text/csv;charset=utf-8'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='archimag-reviews.csv';a.click();
  setTimeout(()=>URL.revokeObjectURL(a.href),1000);toast('↓ CSV собран из демо-данных');
}

/* ============================================================
   7. Навигация и события
   ============================================================ */
function switchView(v){
  state.view=v;document.body.dataset.view=v;
  $$('.view').forEach(el=>el.classList.toggle('active',el.id==='view-'+v));
  $$('#viewSwitch button').forEach(b=>b.classList.toggle('active',b.dataset.view===v));
  $('#siteNav').style.display=v==='site'?'':'none';
  try{
    const de=document.documentElement,prev=de.style.scrollBehavior;
    de.style.scrollBehavior='auto';window.scrollTo(0,0);document.body.scrollTop=0;
    de.style.scrollBehavior=prev;
  }catch(e){}
  if(v==='database')renderDB();
}
function scrollToSection(sel){const el=$(sel);if(el&&el.scrollIntoView)el.scrollIntoView({behavior:'smooth',block:'start'});}

document.addEventListener('click',e=>{
  const viewBtn=e.target.closest('button[data-view],a[data-view]');if(viewBtn){switchView(viewBtn.dataset.view);return;}
  const open=e.target.closest('[data-open]');if(open){state.preselectCourse='';openModal(open.dataset.open==='review'?'reviewModal':'leadModal');return;}
  const close=e.target.closest('[data-close]');if(close){closeModal();return;}
  const scroll=e.target.closest('[data-scroll]');if(scroll){e.preventDefault();if(state.view!=='site')switchView('site');setTimeout(()=>scrollToSection(scroll.dataset.scroll),60);return;}
  const anchor=e.target.closest('a[href^="#"]');if(anchor&&anchor.getAttribute('href')!=='#'){e.preventDefault();if(state.view!=='site')switchView('site');setTimeout(()=>scrollToSection(anchor.getAttribute('href')),60);return;}

  const course=e.target.closest('[data-course]');
  if(course&&course.classList.contains('course-card')){showCourse(+course.dataset.course);return;}
  const age=e.target.closest('[data-age]');if(age){state.age=age.dataset.age;$$('#ageFilter .filter-chip').forEach(b=>b.classList.toggle('active',b===age));
    let n=0;$$('#courseGrid .course-card').forEach(c=>{const show=state.age==='all'||c.dataset.age===state.age;c.style.display=show?'flex':'none';if(show)n++});$('#courseCount').textContent=`${n} направлений`;return;}
  const lesson=e.target.closest('[data-lesson]');if(lesson){state.lesson=+lesson.dataset.lesson;renderLesson();return;}
  const spell=e.target.closest('[data-spell]');if(spell){state.spell=+spell.dataset.spell;renderSpell();return;}
  const star=e.target.closest('[data-star]');if(star){state.rating=+star.dataset.star;paintStars();return;}
  const like=e.target.closest('[data-like]');if(like){handleLike(+like.dataset.like);return;}
  const codex=e.target.closest('[data-codex]');if(codex){handleCodex(+codex.dataset.codex,codex);return;}
  const delR=e.target.closest('[data-del-review]');if(delR){deleteRecord('reviews',+delR.dataset.delReview);return;}
  const delL=e.target.closest('[data-del-lead]');if(delL){deleteRecord('leads',+delL.dataset.delLead);return;}
  const dbTab=e.target.closest('[data-db]');if(dbTab){state.dbTab=dbTab.dataset.db;renderDB();return;}
  if(e.target.classList.contains('modal-backdrop'))closeModal();
});
function showCourse(i){
  const c=COURSE_DATA[i];
  $('#courseModalTitle').textContent=COURSES[i];
  $('#courseModalSub').textContent=`${c.level} · ${c.age} лет · ${c.duration}`;
  $('#courseModalTags').innerHTML=`<span class="tag">${c.lang}</span><span class="tag gold">${c.duration}</span><span class="tag">Группы до 8 человек</span>`;
  $('#courseModalDesc').textContent=c.desc;
  $('#courseModalSyllabus').innerHTML=c.syllabus.map(x=>`<li>${esc(x)}</li>`).join('');
  state.preselectCourse=COURSES[i];openModal('courseModal');
}
async function handleLike(id){
  if(state.liked.has(id))return toast('Вы уже поддержали этот отзыв ✦');
  try{
    if(state.mode==='server'){
      const d=await apiJSON(`/reviews/${id}/like`,{method:'POST',body:'{}'});
      const i=state.reviews.findIndex(r=>r.id===id);if(i>=0)state.reviews[i]=d.item;
    }else{
      const r=state.reviews.find(r=>r.id===id);if(r)r.likes=(r.likes||0)+1;saveLocal();
    }
    state.liked.add(id);renderReviews();if(state.view==='database')renderDB();
  }catch(e){toast('Не удалось поставить лайк')}
}
function handleCodex(idx,el){
  if(state.codexSolved)return;
  if(idx===state.codexStep){state.codexStep++;renderCodex();
    if(state.codexStep===4){state.codexSolved=true;$('#codexBox').classList.add('solved');renderCodex();burst();toast('✦ Портал открыт! Первое заклинание работает');}
  }else{
    el.classList.add('wrong');setTimeout(()=>{state.codexStep=0;renderCodex()},380);
    $('#codexStatus').textContent='✦ SyntaxError: порядок строк нарушен, попробуй снова';
  }
}
async function deleteRecord(table,id){
  if(!confirm('Удалить запись #'+id+' из базы?'))return;
  try{
    if(state.mode==='server')await apiJSON(`/${table}/${id}`,{method:'DELETE'});
    if(table==='reviews'){state.reviews=state.reviews.filter(r=>r.id!==id);renderReviews()}
    else state.leads=state.leads.filter(r=>r.id!==id);
    if(state.mode==='local')saveLocal();
    renderDB();toast('Запись удалена');
  }catch(e){if(String(e.message).includes('Требуется вход'))adminExpired();else toast('Не удалось удалить запись')}
}
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});

$('#runSpell').addEventListener('click',burst);
$('#shuffleSpell').addEventListener('click',()=>{state.spell=(state.spell+1)%SPELLS.length;renderSpell();burst();});
$('#codexShuffle').addEventListener('click',shuffleCodex);
$('#reviewFilter').addEventListener('change',e=>{state.filter=e.target.value;renderReviews()});
$('#reviewSort').addEventListener('change',e=>{state.sort=e.target.value;renderReviews()});
$('#showMore').addEventListener('click',()=>{state.expanded=!state.expanded;renderReviews()});
$('#reviewForm').addEventListener('submit',submitReview);
document.addEventListener('submit',e=>{if(e.target.id==='adminLoginForm'){e.preventDefault();adminLogin(e.target)}});
$('#adminAuthBtn').addEventListener('click',adminLogout);
$('#leadForm').addEventListener('submit',submitLead);
$('#courseApply').addEventListener('click',()=>{closeModal();openModal('leadModal')});
$('#dbRefresh').addEventListener('click',()=>state.mode==='server'?sync(true):(renderDB(),toast('Демо-данные обновлены')));
$('#dbExport').addEventListener('click',exportCSV);
paintStars();boot();
