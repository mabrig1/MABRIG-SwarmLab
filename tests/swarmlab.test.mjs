import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const get=(p)=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const html=get('index.html'),standalone=get('standalone.html'),js=get('assets/app.js'),style=get('assets/styles.css'),handoff=get('assets/handoff.js');
test('both versions include a real 20–50 selector and labelled simulation',()=>{
 assert.match(html,/id="count-slider"[^>]*min="20"[^>]*max="50"/);
 assert.match(standalone,/id="count-slider"[^>]*min="20"[^>]*max="50"/);
 assert.match(standalone,/Guided simulation/);
 assert.match(js,/const TEAMS/);
 assert.match(js,/getAgents/);
});
test('modular site references its own local assets',()=>{
 assert.match(html,/href="\.\/assets\/styles\.css"/);
 assert.match(html,/src="\.\/assets\/app\.js"/);
 assert.match(html,/src="\.\/assets\/handoff\.js"/);
 assert.ok(style.length>5000);
});
test('the shipped live-AI switch stays disabled pending a protected gateway',()=>{
 for(const page of [html,standalone]){
  assert.match(page,/<option value="live" disabled>/);
  assert.match(page,/Continue building in BuildRx/);
 }
 assert.doesNotMatch(js,/sk-or-v1-|Bearer\s+[A-Za-z0-9]{20,}/);
});
test('the AI University handoff is explicit and does not leak missions into URLs',()=>{
 assert.match(handoff,/navigator\.clipboard\.writeText\(mission\)/);
 assert.match(handoff,/window\.open\('https:\/\/www\.buildrx\.online\/projects'/);
 assert.match(handoff,/sessionStorage\.setItem/);
 assert.doesNotMatch(handoff,/URLSearchParams|[?&]prompt=/);
});
test('standalone bundles the same core engine, styling and handoff',()=>{
 assert.ok(standalone.includes(js.trim()));
 assert.ok(standalone.includes(handoff.trim()));
 assert.ok(standalone.includes(style.trim()));
});
test('JavaScript sources parse without requiring external dependencies',()=>{
 assert.doesNotThrow(()=>new Function(js));
 assert.doesNotThrow(()=>new Function(handoff));
});
