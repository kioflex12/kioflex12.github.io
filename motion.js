(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const english = () => document.documentElement.lang === 'en';
  const words = (ru, en) => english() ? en : ru;
  const scenarios = {
    deck: [
      ['Задача из Jira → новая сессия', 'Jira task → new session', 'Контекст и ветка собраны', 'Context and branch ready'],
      ['Claude Code работает с задачей', 'Claude Code works on the task', 'Ответ поступает в живой чат…', 'Response streams into the chat…'],
      ['Изменения готовы к проверке', 'Changes ready for review', 'GitLab MR · статус сборки TeamCity', 'GitLab MR · TeamCity build status']
    ],
    mail: [
      ['Gmail: новые письма', 'Gmail: new messages', 'LLM отделяет важное от рассылок', 'LLM separates important mail from newsletters'],
      ['Важное письмо → Telegram', 'Important email → Telegram', 'Саммари · ответ · календарь', 'Summary · reply · calendar'],
      ['Запрос: подготовить ответ', 'Request: draft a reply', 'Черновик готов. Отправка после подтверждения.', 'Draft ready. Send only after confirmation.']
    ],
    finance: [
      ['«400 продукты и 250 такси»', '“400 groceries and 250 taxi”', 'Две траты из одного сообщения', 'Two expenses from one message'],
      ['Разбор суммы и категории', 'Parsing amounts and categories', 'Продукты: 400 ₽ · транспорт: 250 ₽', 'Groceries: ₽400 · transport: ₽250'],
      ['Запись в активный журнал', 'Saving to the active ledger', 'Mini App: расходы +650 ₽ · бюджет обновлён', 'Mini App: expenses +₽650 · budget updated']
    ]
  };
  const stages = [
    ['Задача и исходные данные', 'Task and source data', 'Контекст из кода, Jira и Confluence поступает в пайплайн.', 'Code, Jira and Confluence provide the workflow context.'],
    ['RAG: поиск контекста', 'RAG: context retrieval', 'Релевантные фрагменты базы знаний дополняют задачу.', 'Relevant knowledge-base passages enrich the task.'],
    ['Оркестратор: план работы', 'Orchestrator: work plan', 'Оркестратор распределяет контекст и выбирает нужных агентов.', 'The orchestrator distributes context and selects agents.'],
    ['Агенты: выполнение задачи', 'Agents: task execution', 'Codegen, review, migrate и bugfix — роли под разные задачи.', 'Codegen, review, migrate and bugfix handle different task types.'],
    ['MCP: вызов инструментов', 'MCP: tool calls', 'Агенты обращаются к рабочим системам через MCP-интеграции.', 'Agents access development systems through MCP integrations.'],
    ['Проверки и результат', 'Checks and result', 'Изменения проходят проверки и ревью перед merge request.', 'Changes go through checks and review before a merge request.']
  ];
  const states = [...document.querySelectorAll('[data-demo]')].map(el => ({el, kind:el.dataset.demo, step:0, elapsed:0, visible:false, paused:reduced.matches}));
  function render(state, animate = false) {
    const {el,kind,step} = state;
    el.classList.toggle('is-paused',state.paused || !state.visible || document.hidden);
    if (kind === 'gallery') {el.querySelectorAll('.game-frame').forEach((image,i)=>{image.classList.toggle('current',i===step);image.setAttribute('aria-hidden',String(i!==step));});return;}
    if (kind === 'pipeline') {
      el.querySelectorAll('[data-stage]').forEach((node,i)=>{node.classList.toggle('active',i===step);node.classList.toggle('done',i<step);});
      el.querySelector('.run-position').textContent = `0${step+1} / 06`;
      const log = el.querySelector('.run-log');log.replaceChildren(...stages.map((s,i)=>{const li=document.createElement('li');li.textContent=words(s[0],s[1]);li.className=i===step?'active':i<step?'done':'';return li;}));
      el.querySelector('.run-explanation').textContent=words(stages[step][2],stages[step][3]);
      el.querySelector('.run-progress i').style.width=`${(step+1)/6*100}%`;
    } else {
      el.dataset.frame=String(step);
      if(kind==='deck') {
        el.querySelector('.task-state').textContent=[words('В очереди','Queued'),words('Claude работает','Claude working'),words('Build ✓ · ревью','Build ✓ · review')][step];
        el.querySelector('.deck-event').textContent=[words('Jira: новая задача привязана к сессии','Jira: new task linked to session'),words('Claude: вношу изменения в auth.ts…','Claude: updating auth.ts…'),words('TeamCity: сборка готова · GitLab MR открыт','TeamCity: build passed · GitLab MR opened')][step];
      } else if(kind==='finance') {
        el.querySelector('.finance-message').textContent=step===0?words('400 продукты…','400 groceries…'):words('400 продукты ✓✓','400 groceries ✓✓');
        el.querySelector('.finance-reply').textContent=[words('Введите трату сообщением','Add an expense in a message'),words('Определяю категорию…','Identifying category…'),words('✓ Записано: продукты · 400 ₽','✓ Saved: groceries · ₽400')][step];
        el.querySelector('.finance-total').textContent=step===2?'12 800 ₽':'12 400 ₽';
        el.querySelector('.finance-left').textContent=step===2?'17 200 ₽':'17 600 ₽';
        el.querySelector('.finance-day').textContent=step===2?'1 720 ₽':'1 760 ₽';
      } else if(kind==='mail') {
        el.querySelector('.mail-result-title').textContent=step===2?words('ЧЕРНОВИК ОТВЕТА','REPLY DRAFT'):words('САММАРИ','SUMMARY');
        el.querySelector('.mail-result-body').textContent=step===2?words('Привет! Завтра в 11:00 удобно. До встречи!','Hi! Tomorrow at 11:00 works for me. See you then!'):words('Встреча завтра в 11:00. Нужно подтвердить время.','Meeting tomorrow at 11:00. Please confirm the time.');
      }
    }
  }

  const observer = new IntersectionObserver(entries=>entries.forEach(entry=>{const state=states.find(s=>s.el===entry.target);state.visible=entry.isIntersecting;render(state);}),{threshold:.15});
  states.forEach(state=>{
    observer.observe(state.el);render(state);
    state.el.querySelector('.motion-restart')?.addEventListener('click',()=>{state.step=0;state.elapsed=0;render(state,true);});
  });
  new MutationObserver(()=>{states.forEach(s=>render(s));}).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  reduced.addEventListener('change',()=>{states.forEach(s=>{s.paused=reduced.matches;render(s);});});
  document.addEventListener('visibilitychange',()=>states.forEach(s=>render(s)));
  setInterval(()=>{if(document.hidden)return;states.forEach(s=>{if(s.paused||!s.visible)return;s.elapsed+=250;const duration=s.kind==='gallery'?4200:s.kind==='pipeline'?2400:3200;if(s.elapsed<duration)return;s.elapsed=0;const count=s.kind==='pipeline'?6:s.kind==='gallery'?s.el.querySelectorAll('.game-frame').length:3;s.step=(s.step+1)%count;render(s,true);});},250);

})();
