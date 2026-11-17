
/** Agent roster is shared by the browser and the Cloudflare Worker. */
const TEAMS = [
  {key:'strategy', name:'Strategy', short:'STR', color:'#b49cff', wave:1, subtitle:'Frame the mission', roles:[
    ['Mission Architect','Translate the mission into a measurable scope, constraints, dependencies, and success criteria.'],
    ['User Researcher','Identify the intended users, their problems, and unanswered questions requiring interviews.'],
    ['Market Analyst','Map alternatives, competitive advantages, and claims that must be validated.'],
    ['Opportunity Mapper','Prioritize outcomes by expected value, effort, and feasibility.'],
    ['Risk Navigator','Identify assumptions and fallback strategies before execution.'] ]},
  {key:'research', name:'Research', short:'RES', color:'#67c9ff', wave:1, subtitle:'Test the evidence', roles:[
    ['Evidence Scout','List reliable evidence needed for this mission; never invent citations or data.'],
    ['Fact Checker','Separate verified facts, estimates, and hypotheses; flag unsupported claims.'],
    ['Data Analyst','Propose useful metrics, a data collection plan, and interpretation cautions.'],
    ['Experiment Designer','Create a low-risk test with a measurable hypothesis and stopping rule.'],
    ['Insight Synthesizer','Summarize what is known, unknown, and important to investigate.'] ]},
  {key:'product', name:'Product', short:'PRD', color:'#f3b66c', wave:2, subtitle:'Design the experience', roles:[
    ['Product Lead','Define an achievable MVP, target user, scope boundaries, and acceptance criteria.'],
    ['UX Architect','Suggest a mobile-first information architecture and core screens.'],
    ['Accessibility Reviewer','Identify inclusive design, readable typography, keyboard and contrast needs.'],
    ['Journey Mapper','Describe onboarding, core task flow, and success/failure states.'],
    ['Prototype Planner','Recommend a quick clickable prototype and user-testing plan.'] ]},
  {key:'education', name:'Education', short:'EDU', color:'#68e3c9', wave:2, subtitle:'Make learning stick', roles:[
    ['Curriculum Designer','Transform complex skills into a short learning path with prerequisites.'],
    ['Learning Designer','Create an active exercise, scaffolded examples, and learner feedback points.'],
    ['Assessment Builder','Draft measurable mastery checks and a transparent rubric.'],
    ['Mentor Coach','Anticipate beginner confusion and write useful next-step guidance.'],
    ['Feedback Specialist','Suggest ways to collect learning outcomes without invasive data collection.'] ]},
  {key:'finance', name:'Finance', short:'FIN', color:'#e3cc7b', wave:2, subtitle:'Keep it viable', roles:[
    ['Cost Estimator','Outline realistic cost categories and clearly label unknown numbers.'],
    ['ROI Analyst','Describe benefits and outcomes that could justify spending without inventing results.'],
    ['Pricing Strategist','Recommend pricing experiments with fair access and clear terms.'],
    ['Budget Reviewer','Identify expense controls, free tiers, and cost escalation triggers.'],
    ['Sustainability Planner','Suggest a feasible long-term operating model and funding options.'] ]},
  {key:'engineering', name:'Engineering', short:'ENG', color:'#6aa8ff', wave:3, subtitle:'Plan the implementation', roles:[
    ['Solution Architect','Propose a minimal secure technical architecture and clear system boundaries.'],
    ['Frontend Engineer','Specify accessible responsive UI components and meaningful interactions.'],
    ['Backend Engineer','Define backend API contracts, validation, authentication, and error handling.'],
    ['Integration Engineer','Plan external service integration, secret storage, and fallback behavior.'],
    ['Test Engineer','Specify smoke tests, edge cases, rollback checks, and success criteria.'] ]},
  {key:'creative', name:'Creative', short:'CRT', color:'#ff94af', wave:3, subtitle:'Tell the story', roles:[
    ['Brand Storyteller','Create a concise truthful value proposition for the intended audience.'],
    ['Script Writer','Draft a short demo narrative with hook, transformation, and call-to-action.'],
    ['Visual Director','Suggest visual metaphors and scenes without promising nonexistent features.'],
    ['Copy Editor','Simplify language, remove unsupported hype, and clarify the next step.'],
    ['Content Planner','Suggest an ethical distribution plan across suitable content formats.'] ]},
  {key:'growth', name:'Growth', short:'GRO', color:'#d5a1ff', wave:3, subtitle:'Reach the audience', roles:[
    ['Growth Strategist','Recommend low-cost acquisition loops with trackable outcomes.'],
    ['Search Specialist','Outline search intent, page structure, and useful discoverability content.'],
    ['Community Builder','Design a trustworthy feedback community and referral path.'],
    ['Channel Analyst','Define attribution metrics and experiments without inventing traffic.'],
    ['Retention Planner','Suggest useful activation and retention improvements for real users.'] ]},
  {key:'operations', name:'Operations', short:'OPS', color:'#7dc8c3', wave:3, subtitle:'Keep work moving', roles:[
    ['Project Manager','Break delivery into prioritized checkpoints, owners, and dependencies.'],
    ['Resource Planner','Estimate team skills and infrastructure required without fake commitments.'],
    ['Workflow Engineer','Describe how human approvals, queues, and audit logs should work.'],
    ['Quality Coordinator','Specify definition of done and cross-team handoff checks.'],
    ['Documentation Lead','Write onboarding and maintenance instructions for non-experts.'] ]},
  {key:'trust', name:'Trust & Safety', short:'TRU', color:'#f0a47c', wave:4, subtitle:'Challenge the plan', roles:[
    ['Privacy Auditor','Challenge unnecessary data collection and propose privacy safeguards.'],
    ['Security Reviewer','Identify threat scenarios, abuse controls, and secret-management requirements.'],
    ['Bias Reviewer','Check who may be excluded or unfairly affected and how to test it.'],
    ['Policy Writer','Clarify consent, transparency, acceptable use, and human accountability.'],
    ['Red-Team Critic','Find the weakest assumptions and require evidence before launch.'] ]}
];
function getAgents(count=30){
  const max=Math.max(20,Math.min(50,Math.round(Number(count)||30)));
  const selected=[];
  for(let slot=0;slot<5;slot++){
    for(const team of TEAMS){
      if(selected.length>=max)break;
      const [role,instruction]=team.roles[slot];
      selected.push({id:`${team.short}-${String(slot+1).padStart(2,'0')}`,name:role,instruction,team:team.key,teamName:team.name,color:team.color,wave:team.wave,slot, status:'idle', output:'',duration:0});
    }
  }
  return selected.sort((a,b)=>a.wave-b.wave || a.slot-b.slot || a.teamName.localeCompare(b.teamName));
}
function getTeam(key){return TEAMS.find(t=>t.key===key)}



const $ = id => document.getElementById(id);
const presets = {
  education:'Design a privacy-first AI learning platform for African creators, with accessible lessons, 20-agent collaboration, and measurable outcomes.',
  business:'Design a mobile-first marketplace for local entrepreneurs, with easy storefront setup, transparent payments, customer support, and a realistic launch plan.',
  research:'Investigate how AI assistance could improve access to credible African research opportunities, with verifiable evidence and an ethical pilot design.',
  safety:'Design a proof-first consumer protection app that helps people check rental listings and suspicious offers, with privacy and human reporting safeguards.'
};
const state={count:30,agents:getAgents(30),mode:'demo',mission:presets.education,runId:0,running:false,paused:false,finished:false,currentWave:0,selectedAgent:null,teamFilter:'all',query:'',feed:[],liveAvailable:false,requireToken:false,model:'openrouter/free',startedAt:null,endedAt:null,dispatchAt:0};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const escapeAttr=esc;
function formatTime(){return new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit',second:'2-digit'});}
function addFeed(title,detail,level='info'){
  state.feed.unshift({time:formatTime(),title,detail,level});
  if(state.feed.length>90)state.feed.pop();
  renderFeed();
}
function renderFeed(){
  $('activity-feed').innerHTML=state.feed.map(f=>`<div class="feed-item ${esc(f.level)}"><span class="feed-symbol">${f.level==='error'?'!':f.level==='warn'?'◇':'✓'}</span><div><strong>${esc(f.title)}</strong><p>${esc(f.detail)}</p><time>${esc(f.time)}</time></div></div>`).join('')||'<div class="feed-item"><span class="feed-symbol">✦</span><div><strong>Orchestration engine ready</strong><p>Choose a mission and launch the simulation.</p><time>AWAITING INSTRUCTIONS</time></div></div>';
}
function stat(){const agents=state.agents,done=agents.filter(a=>a.status==='done').length,failed=agents.filter(a=>a.status==='failed').length,active=agents.filter(a=>a.status==='running').length;return{done,failed,active,pct:Math.round((done+failed)/agents.length*100)}}
function renderStats(){
  const v=stat();$('stat-total').textContent=state.count;$('stat-completed').textContent=v.done;$('stat-active').textContent=v.active;$('completion-percent').textContent=`${Math.round(v.done/state.count*100)}%`;$('stat-wave').textContent=state.currentWave?`${state.currentWave} / 4`:'—';$('wave-foot').textContent=state.currentWave?['','Discovery','Design','Execution','Safety review'][state.currentWave]:'4 sequential waves';$('progress-percent').textContent=`${v.pct}%`;$('progress-fill').style.width=`${v.pct}%`;
  $('swarm-state').className=`pill ${state.finished?'finished':state.running?'working':''}`;
  $('swarm-state').innerHTML=`<span class="small-circle"></span> ${state.finished?'COMPLETE':state.paused?'PAUSED':state.running?'RUNNING':'IDLE'}`;
  $('progress-title').textContent=state.finished?'Swarm orchestration complete':state.paused?'Execution paused':state.running?`Wave ${state.currentWave} in progress`:'Ready to orchestrate';
  $('progress-detail').textContent=state.finished?`${v.done} completed · ${v.failed} blocked · Human review required`:state.running?`${v.active} currently working · ${v.done} completed · ${v.failed} blocked`:'Your specialist teams are standing by.';
  $('pause-btn').disabled=!state.running||state.paused;$('step-btn').disabled=!state.running||!state.paused;$('run-btn').disabled=state.running;$('count-slider').disabled=state.running;$('engine-select').disabled=state.running;$('mission-input').disabled=state.running;
  $('run-btn').innerHTML=state.running?'<span>◌</span> Swarm running':'<span>▶</span> Launch swarm';
  $('mode-label').innerHTML=`<span class="green-dot"></span> ${state.mode==='live'?'LIVE AI MODE':'SIMULATION MODE'}`;
}
function renderTeams(){
  $('team-list').innerHTML=TEAMS.map(t=>{const agents=state.agents.filter(a=>a.team===t.key),finished=agents.filter(a=>a.status==='done').length,pct=Math.round(finished/Math.max(agents.length,1)*100);return `<div class="team-row ${state.teamFilter===t.key?'active':''}" data-team="${t.key}" role="button" tabindex="0" aria-label="Filter ${esc(t.name)} agents"><span class="team-bullet" style="background:${t.color}"></span><div class="team-info"><div class="team-name">${esc(t.name)} <span class="team-count">${finished}/${agents.length}</span></div><div class="team-sub">${esc(t.subtitle)}</div><div class="team-meter"><span style="width:${pct}%;background:${t.color}"></span></div></div></div>`}).join('');
  for(const item of $('team-list').querySelectorAll('[data-team]')){const act=()=>{state.teamFilter=state.teamFilter===item.dataset.team?'all':item.dataset.team;renderTeams();renderFilters();renderAgents();};item.addEventListener('click',act);item.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();act()}})}
}
function renderFilters(){
  const options=[['all','All agents'],...TEAMS.map(t=>[t.key,t.name])];
  $('filter-buttons').innerHTML=options.map(([key,name])=>`<button class="filter-btn ${state.teamFilter===key?'active':''}" data-filter="${key}">${esc(name)}</button>`).join('');
  for(const btn of $('filter-buttons').querySelectorAll('[data-filter]'))btn.addEventListener('click',()=>{state.teamFilter=btn.dataset.filter;renderFilters();renderAgents();renderTeams()});
}
function renderAgents(){
  const visible=state.agents.filter(a=>(state.teamFilter==='all'||a.team===state.teamFilter)&&`${a.name} ${a.teamName} ${a.id}`.toLowerCase().includes(state.query));
  $('agent-list').innerHTML=visible.length?visible.map(a=>`<button class="agent-card ${a.id===state.selectedAgent?'selected':''}" data-agent="${a.id}"><div class="agent-topline"><span class="agent-code">${a.id}</span><span class="agent-state ${a.status}">${{idle:'● READY',queued:'○ QUEUED',running:'◴ WORKING',done:'✓ COMPLETE',failed:'! BLOCKED'}[a.status]}</span></div><div class="agent-person"><span class="agent-avatar" style="color:${a.color};background:${a.color}1d">${esc(a.id.split('-')[0])}</span><span style="min-width:0"><strong>${esc(a.name)}</strong><small>${esc(a.teamName)}</small></span></div></button>`).join(''):'<p style="color:#91a6ba;padding:12px;">No agents match this filter.</p>';
  for(const btn of $('agent-list').querySelectorAll('[data-agent]'))btn.addEventListener('click',()=>selectAgent(btn.dataset.agent));
}
function renderInspector(){
  const a=state.agents.find(x=>x.id===state.selectedAgent);if(!a){$('inspect-name').textContent='Select an agent';$('inspect-desc').textContent='Click a dot in the swarm map or an agent in the directory to examine its assignment.';$('inspect-tag').textContent='NO AGENT SELECTED';$('inspect-status').textContent='';$('inspect-output').textContent='';return}
  $('inspect-name').textContent=a.name;$('inspect-desc').textContent=a.instruction;$('inspect-tag').textContent=`${a.id} · WAVE ${a.wave}`;$('inspect-status').textContent=a.status.toUpperCase();$('inspect-output').textContent=a.output||'Agent has not generated an output yet.';
}
function selectAgent(id){state.selectedAgent=id;renderInspector();renderAgents();renderNetwork()}
function renderNetwork(){
  const cx=370,cy=235,R=162;let out='';const positions=new Map();
  // Fixed 10-team topology avoids reshuffling the map when the agent count changes.
  TEAMS.forEach((t,i)=>{const angle=-Math.PI/2+i*2*Math.PI/10,hx=cx+R*Math.cos(angle),hy=cy+R*Math.sin(angle),a=state.agents.filter(n=>n.team===t.key);positions.set(t.key,{x:hx,y:hy,angle});out+=`<line class="connection" x1="${cx}" y1="${cy}" x2="${hx.toFixed(1)}" y2="${hy.toFixed(1)}"/>`;a.forEach((agent,j)=>{const spread=(j-(a.length-1)/2)*.41,theta=angle+spread,dist=44+(j%2)*4,x=hx+dist*Math.cos(theta),y=hy+dist*Math.sin(theta);positions.set(agent.id,{x,y});out+=`<line class="connection ${agent.status==='done'?'connection-active':''}" x1="${hx.toFixed(1)}" y1="${hy.toFixed(1)}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" />`})});
  TEAMS.forEach(t=>{const p=positions.get(t.key);out+=`<g class="node-hub" data-team-hub="${t.key}"><circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="14" stroke="${t.color}" /><circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="5" fill="${t.color}"/><title>${esc(t.name)}</title></g>`;const outward=(p.x>=cx?1:-1);const tx=p.x+outward*18;out+=`<text x="${tx.toFixed(1)}" y="${(p.y+4).toFixed(1)}" text-anchor="${outward===1?'start':'end'}" fill="#7790a7" font-size="8" font-weight="700">${esc(t.name.toUpperCase())}</text>`});
  state.agents.forEach(a=>{const p=positions.get(a.id),fill={idle:'#17283a',queued:'#25364a',running:'#f1c779',done:'#50e5bf',failed:'#ff8997'}[a.status],stroke=a.status==='idle'?a.color:fill;out+=`<g class="node-agent ${state.selectedAgent===a.id?'selected':''}" data-node="${a.id}" tabindex="0" role="button" aria-label="Select ${esc(a.name)}"><circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="7" fill="${fill}" stroke="${stroke}"></circle><title>${esc(a.name)} — ${a.status}</title></g>`});
  out+=`<circle cx="${cx}" cy="${cy}" r="38" fill="#183c3f" stroke="#46cbb0" stroke-width="1.3"/><circle cx="${cx}" cy="${cy}" r="29" fill="#194848" stroke="#3b8c82" stroke-dasharray="2 4"/><text class="network-core-title" text-anchor="middle" x="${cx}" y="${cy-3}">MABRIG</text><text class="network-core-sub" text-anchor="middle" x="${cx}" y="${cy+13}">CORE MISSION</text>`;
  $('network').innerHTML=out;
  for(const item of $('network').querySelectorAll('[data-node]')){const pick=()=>selectAgent(item.dataset.node);item.addEventListener('click',pick);item.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();pick()}})}
  for(const item of $('network').querySelectorAll('[data-team-hub]'))item.addEventListener('click',()=>{state.teamFilter=item.dataset.teamHub;renderFilters();renderAgents();renderTeams()});
}
function demoOutput(a,mission){
  const m=mission.replace(/\s+/g,' ').trim().slice(0,150);const teamSpecific={
    strategy:['Define a sharply bounded first release and a measurable outcome.','List assumptions that require interviews or verification.','Record exclusions, constraints, owners, and a rollback plan.'],
    research:['Create an evidence register with source, date, and confidence fields.','Mark proposed outcomes as hypotheses until tested.','Run a small pilot; record negative as well as positive findings.'],
    product:['Start with three essential user journeys and accessible mobile screens.','Test with beginners before expanding the feature set.','Document failure states and understandable recovery actions.'],
    education:['Build short applied lessons with practice and reflection.','Check understanding through authentic tasks, not passive views.','Provide beginner-friendly guidance and opt-in feedback.'],
    finance:['Budget hosting, inference calls, support, and maintenance separately.','Use free tiers carefully and add usage alerts and spending ceilings.','Validate willingness to pay before assuming profitability.'],
    engineering:['Implement a small secure API boundary and modular UI.','Store credentials server-side; validate inputs and limit requests.','Add smoke tests, observability, rollback, and accessible errors.'],
    creative:['Show a real workflow before making marketing promises.','Use a thirty-second story: problem, demonstration, next action.','Make the call-to-action specific, truthful, and measurable.'],
    growth:['Target one audience and one clear activation event first.','Track signups-to-value without excessive surveillance.','Compare channels through controlled, low-cost experiments.'],
    operations:['Assign milestones with review gates and visible ownership.','Keep decision logs, escalation paths, and handoff criteria.','Release in stages with human approvals at consequential steps.'],
    trust:['Minimize stored personal information and protect credentials.','Audit unsupported claims, exclusion risks, and abuse cases.','Require a human decision before publication or high-stakes use.']
  };
  const s=teamSpecific[a.team],n=a.slot;
  return `FOCUS · ${a.name}\nMission: ${m}\n\nRECOMMENDED NEXT ACTION\n${s[n%3]}\n\nEVIDENCE / ACCEPTANCE CHECK\n${s[(n+1)%3]}\n\nSTATUS · Illustrative recommendation; not independently verified.`;
}
function renderReport(){
  const done=state.agents.filter(a=>a.status==='done'||a.status==='failed');$('report-placeholder').classList.toggle('hidden',done.length>0);$('report-content').classList.toggle('hidden',done.length===0);
  if(!done.length)return;
  $('report-content').innerHTML=TEAMS.map(t=>{const completed=done.filter(a=>a.team===t.key);if(!completed.length)return'';return `<article class="report-team"><header><strong style="color:${t.color}">${esc(t.name)}</strong><small>${completed.filter(a=>a.status==='done').length}/${state.agents.filter(a=>a.team===t.key).length} completed</small></header>${completed.map(a=>`<div class="role-output"><strong>${esc(a.name)}</strong><div>${esc(a.status==='failed'?'BLOCKED · '+a.output:(a.output.split('\n').find(x=>x.startsWith('RECOMMENDED'))?a.output.split('RECOMMENDED NEXT ACTION\n')[1]?.split('\n')[0]:a.output).slice(0,270))}</div></div>`).join('')}</article>`}).join('');
}
function refresh(){renderStats();renderTeams();renderFilters();renderAgents();renderInspector();renderNetwork();renderReport()}
function reset(opts={announce:true}){
  state.runId++;state.running=false;state.paused=false;state.finished=false;state.currentWave=0;state.startedAt=null;state.endedAt=null;state.dispatchAt=0;state.agents=getAgents(state.count);state.selectedAgent=null;state.feed=[];refresh();renderFeed();if(opts.announce)addFeed('Swarm reset','All agents returned to ready state.');
}
function setMission(preset){if(state.running)return;$('mission-input').value=presets[preset];state.mission=presets[preset];for(const btn of document.querySelectorAll('[data-preset]'))btn.classList.toggle('active',btn.dataset.preset===preset);updateLength();reset({announce:false});addFeed('Mission template loaded',`${preset[0].toUpperCase()+preset.slice(1)} mission selected.`)}
function updateLength(){const s=$('mission-input').value;$('mission-length').textContent=`${s.length} / 1500 characters`}
function sleep(ms){return new Promise(resolve=>setTimeout(resolve,ms))}
async function waitUnpaused(runId){while(state.paused&&state.runId===runId)await sleep(120)}
async function demoAgent(a,runId){await sleep(500+(a.slot*157+a.name.length*79)%850);if(state.runId!==runId)throw new Error('Cancelled');return demoOutput(a,state.mission)}
async function liveAgent(a,runId){
  const context=state.agents.filter(x=>x.status==='done'&&x.wave<a.wave).slice(-8).map(x=>`${x.name}: ${x.output.slice(0,220)}`).join('\n').slice(0,2600);
  const token=$('access-token').value;
  const res=await fetch('/api/agent',{method:'POST',headers:{'Content-Type':'application/json',...(token?{'X-Swarm-Access':token}:{})},body:JSON.stringify({agentId:a.id,mission:state.mission,context})});
  let payload;try{payload=await res.json()}catch{throw new Error(`Gateway returned HTTP ${res.status}`)}
  if(!res.ok)throw new Error(payload.error||`Gateway returned HTTP ${res.status}`);
  if(state.runId!==runId)throw new Error('Cancelled');return payload.output||'No usable model output returned.';
}
async function execute(a,runId){
  await waitUnpaused(runId);if(state.runId!==runId)return;
  a.status='running';addFeed(`${a.name} dispatched`,`${a.teamName} specialist assigned to wave ${a.wave}.`);refresh();const t0=Date.now();
  try{if(state.mode==='live'){
      // Respect a conservative 20-request/minute launch cadence for free-model routing.
      const delay=Math.max(0,state.dispatchAt+3200-Date.now());if(delay)await sleep(delay);await waitUnpaused(runId);if(state.runId!==runId)return;state.dispatchAt=Date.now();
    }
    const result=state.mode==='live'?await liveAgent(a,runId):await demoAgent(a,runId);
    if(state.runId!==runId)return;a.output=result;a.duration=Date.now()-t0;a.status='done';addFeed(`${a.name} completed`,`${a.teamName} delivered a ${state.mode==='live'?'model-generated':'scripted sample'} recommendation.`);
  }catch(e){if(state.runId!==runId)return;a.status='failed';a.output=String(e?.message||e).slice(0,260);addFeed(`${a.name} blocked`,a.output,'error')}
  refresh();
}
async function runWave(wave,runId){
  const queue=state.agents.filter(a=>a.wave===wave);let next=0;const limit=state.mode==='live'?1:4;
  await Promise.all(Array.from({length:Math.min(limit,queue.length)},async()=>{while(next<queue.length&&state.runId===runId){await waitUnpaused(runId);if(state.runId!==runId)return;const a=queue[next++];await execute(a,runId)}}));
}
async function launch(){
  if(state.running)return;const mission=$('mission-input').value.trim();if(mission.length<15){addFeed('Mission needs detail','Write at least 15 characters describing what the swarm should accomplish.','warn');$('mission-input').focus();return}
  if(state.mode==='live'&&!state.liveAvailable){addFeed('Live gateway unavailable','Deploy the secure Cloudflare Worker with an OPENROUTER_API_KEY, or choose the simulation.','error');return}
  reset({announce:false});state.mission=mission;state.running=true;state.startedAt=new Date().toISOString();const id=state.runId;
  addFeed('Mission accepted',state.mode==='live'?'Live AI model calls enabled. All results require human review.':'Guided simulation started. Outputs are scripted illustrative recommendations.');refresh();
  for(let wave=1;wave<=4;wave++){
    if(state.runId!==id)return;await waitUnpaused(id);if(state.runId!==id)return;
    state.currentWave=wave;const names=['','Discovery','Product design','Execution','Safety review'];addFeed(`Wave ${wave}: ${names[wave]}`,`${state.agents.filter(a=>a.wave===wave).length} specialists scheduled; prior-wave outputs will inform live agents.`);refresh();await runWave(wave,id);
  }
  if(state.runId!==id)return;state.running=false;state.finished=true;state.endedAt=new Date().toISOString();const v=stat();addFeed('Mission cycle finished',`${v.done} completed; ${v.failed} blocked. Inspect the report and verify important recommendations.`);refresh();
}
function buildReport(kind){const used=state.agents.filter(a=>a.status==='done'||a.status==='failed');const report={name:'MABRIG SwarmLab intelligence report',mode:state.mode==='demo'?'scripted demonstration':'live model responses',generatedAt:new Date().toISOString(),mission:state.mission,agentsConfigured:state.count,agentsCompleted:used.filter(a=>a.status==='done').length,agentsBlocked:used.filter(a=>a.status==='failed').length,executionWaves:4,notice:'Simulation is not an AI result. Live model output is unverified and needs human review.',agents:used.map(({id,name,teamName,wave,status,output,duration})=>({id,name,team:teamName,wave,status,output,durationMs:duration}))};
  if(kind==='json')return{filename:'mabrig-swarm-report.json',type:'application/json',text:JSON.stringify(report,null,2)};
  let md=`# MABRIG SwarmLab — Intelligence report\n\n**Mode:** ${report.mode}\n\n**Mission:** ${report.mission}\n\n**Generated:** ${report.generatedAt}\n\n**Agents:** ${report.agentsCompleted}/${report.agentsConfigured} completed; ${report.agentsBlocked} blocked\n\n> ${report.notice}\n\n`;
  for(const t of TEAMS){const agents=used.filter(a=>a.teamName===t.name);if(!agents.length)continue;md+=`## ${t.name}\n\n`;for(const a of agents)md+=`### ${a.name} (${a.id}) — ${a.status}\n\n${a.output}\n\n`}
  return{filename:'mabrig-swarm-report.md',type:'text/markdown',text:md};
}
function download(kind){const file=buildReport(kind),blob=new Blob([file.text],{type:file.type+';charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=file.filename;a.click();setTimeout(()=>URL.revokeObjectURL(url),3000);addFeed('Report exported',`${file.filename} prepared for download.`)}
async function checkLive(){
  $('live-status').className='inline-alert';$('live-status').textContent='Checking secure AI gateway…';
  try{const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),6000);const res=await fetch('/api/status',{signal:controller.signal});clearTimeout(timeout);if(!res.ok)throw Error('API unavailable');const data=await res.json();state.liveAvailable=Boolean(data.enabled);state.requireToken=Boolean(data.protected);state.model=data.model||'openrouter/free';$('live-status').textContent=state.liveAvailable?`Gateway connected · ${state.model}${state.requireToken?' · token required':''}`:'Gateway installed, but OpenRouter key is not configured.';$('live-status').classList.toggle('ok',state.liveAvailable)}catch{state.liveAvailable=false;$('live-status').textContent='Live gateway is offline. Deploy the Worker and configure its secrets.'}
}
function init(){
  $('mission-input').addEventListener('input',()=>{updateLength();state.mission=$('mission-input').value});updateLength();
  for(const b of document.querySelectorAll('[data-preset]'))b.addEventListener('click',()=>setMission(b.dataset.preset));
  $('count-slider').addEventListener('input',e=>{state.count=Number(e.target.value);$('count-value').innerHTML=`${state.count} <small>/ 50</small>`;reset({announce:false})});
  $('engine-select').addEventListener('change',e=>{state.mode=e.target.value;$('live-controls').classList.toggle('hidden',state.mode!=='live');if(state.mode==='live')checkLive();reset({announce:false});addFeed('Execution engine selected',state.mode==='demo'?'Guided simulation: no model calls.':'Live AI: requires a configured server and may hit rate limits.')});
  $('run-btn').addEventListener('click',launch);
  $('pause-btn').addEventListener('click',()=>{state.paused=true;addFeed('Swarm paused','No further agents will be dispatched until resumed. Already-running calls may finish.','warn');refresh()});
  $('step-btn').addEventListener('click',()=>{state.paused=false;addFeed('Swarm resumed','Orchestration resumed at the next available agent.');refresh()});
  $('reset-btn').addEventListener('click',()=>reset());
  $('agent-search').addEventListener('input',e=>{state.query=e.target.value.toLowerCase().trim();renderAgents()});
  $('download-report-top').addEventListener('click',()=>download('md'));$('download-md').addEventListener('click',()=>download('md'));$('download-json').addEventListener('click',()=>download('json'));
  const dialog=$('about-dialog');$('help-btn').addEventListener('click',()=>dialog.showModal());$('close-dialog').addEventListener('click',()=>dialog.close());$('dialog-ok').addEventListener('click',()=>dialog.close());
  for(const a of document.querySelectorAll('.navitem'))a.addEventListener('click',()=>{for(const n of document.querySelectorAll('.navitem'))n.classList.remove('selected');a.classList.add('selected')});
  refresh();addFeed('Orchestration engine ready','30 agents across 10 specialist teams. Choose a mission to begin.');
}
init();

