const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const KEY='khunkhai-world-v1';
const defaults={time:'sunset',rain:false,panelCollapsed:false,volumes:{wind:36,rain:0,ocean:32,birds:15},positions:{}};
let saved={};try{saved=JSON.parse(localStorage.getItem(KEY)||'{}')}catch{}
const state={...defaults,...saved,volumes:{...defaults.volumes,...saved.volumes},positions:{...defaults.positions,...saved.positions}};
const persist=()=>localStorage.setItem(KEY,JSON.stringify(state));
function refreshClock(){const n=new Date();$('#clock').textContent=n.toLocaleTimeString('th-TH',{hour:'2-digit',minute:'2-digit',hour12:false});$('#date').textContent=n.toLocaleDateString('th-TH',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}refreshClock();setInterval(refreshClock,15000);
function setTime(t){state.time=t;$('#scene').classList.remove('morning','sunset','night');$('#scene').classList.add(t);$$('[data-time]').forEach(b=>b.classList.toggle('selected',b.dataset.time===t));persist()}setTime(state.time);
$$('[data-time]').forEach(b=>b.addEventListener('click',()=>setTime(b.dataset.time)));
function setRain(v){state.rain=!!v;$('#rainToggle').checked=state.rain;$('#scene').classList.toggle('raining',state.rain);if(state.rain && state.volumes.rain===0){state.volumes.rain=30;updateMixer()}persist();updateAudio()}$('#rainToggle').addEventListener('change',e=>setRain(e.target.checked));setRain(state.rain);
const names={wind:['🍃','ลมพัด'],rain:['🌧️','สายฝน'],ocean:['🌊','คลื่นทะเล'],birds:['🐦','นกร้อง']};
function updateMixer(){const root=$('#mixer');root.innerHTML='';Object.entries(names).forEach(([key,[symbol,name]])=>{const row=document.createElement('label');row.className='sound-row';row.innerHTML=`<span class="sound-label">${symbol} ${name}</span><input type="range" min="0" max="100" step="1" aria-label="${name}" value="${state.volumes[key]}"><span class="sound-val">${state.volumes[key]}%</span>`;row.querySelector('input').addEventListener('input',e=>{state.volumes[key]=+e.target.value;row.querySelector('.sound-val').textContent=e.target.value+'%';persist();updateAudio()});root.appendChild(row)})}updateMixer();
let audio=null,playing=false;
function noiseBuffer(ctx){const len=ctx.sampleRate*3,buf=ctx.createBuffer(1,len,ctx.sampleRate),a=buf.getChannelData(0);for(let i=0;i<len;i++)a[i]=Math.random()*2-1;return buf}
function noiseTrack(ctx,buf,filterType,freq,q=0.7){const src=ctx.createBufferSource();src.buffer=buf;src.loop=true;const filter=ctx.createBiquadFilter();filter.type=filterType;filter.frequency.value=freq;filter.Q.value=q;const gain=ctx.createGain();gain.gain.value=0;src.connect(filter).connect(gain).connect(ctx.destination);src.start();return{src,gain}}
function startAudio(){if(audio){audio.ctx.resume();playing=true;updateAudio();return}const ctx=new(window.AudioContext||window.webkitAudioContext)();const buf=noiseBuffer(ctx);const tracks={wind:noiseTrack(ctx,buf,'lowpass',350),rain:noiseTrack(ctx,buf,'highpass',1400),ocean:noiseTrack(ctx,buf,'lowpass',900),birds:noiseTrack(ctx,buf,'bandpass',2300,1.7)};let phase=0;const timer=setInterval(()=>{if(ctx.state!=='running')return;phase+=.13;tracks.ocean.gain.gain.setTargetAtTime((state.volumes.ocean/100)*(.055+.055*(1+Math.sin(phase))/2),ctx.currentTime,.08);tracks.wind.gain.gain.setTargetAtTime((state.volumes.wind/100)*(.045+.016*Math.sin(phase*.4)),ctx.currentTime,.09);tracks.birds.gain.gain.setTargetAtTime((state.volumes.birds/100)*((Math.sin(phase*5)>0.96)?.045:.001),ctx.currentTime,.04)},120);audio={ctx,tracks,timer};playing=true;updateAudio()}
function updateAudio(){if(!audio)return;const {ctx,tracks}=audio;tracks.rain.gain.gain.setTargetAtTime(playing?(state.volumes.rain/100)*.10:0,ctx.currentTime,.15);if(!playing){Object.values(tracks).forEach(t=>t.gain.gain.setTargetAtTime(0,ctx.currentTime,.1))}$('#muteBtn').innerHTML=playing?'Ⅱ <span>หยุดเสียง</span>':'▶ <span>เริ่มเสียง</span>'}
$('#muteBtn').addEventListener('click',()=>{if(!playing)startAudio();else{playing=false;updateAudio()}});
const titles={weather:'บรรยากาศ',sounds:'เสียงธรรมชาติ',decorate:'ตกแต่งโลก'};
function showTab(tab){$$('[data-panel]').forEach(e=>e.classList.toggle('hidden',e.dataset.panel!==tab));$$('[data-tab]').forEach(e=>e.classList.toggle('active',e.dataset.tab===tab));$('#panelTitle').textContent=titles[tab];setPanelCollapsed(false)}
function setPanelCollapsed(collapsed){
 state.panelCollapsed=!!collapsed;
 $('#panel').classList.toggle('collapsed',state.panelCollapsed);
 $('#panel').setAttribute('aria-hidden',String(state.panelCollapsed));
 $('#panel').inert=state.panelCollapsed;
 $('#panelToggle').classList.toggle('show',state.panelCollapsed);
 $('#panelToggle').setAttribute('aria-expanded',String(!state.panelCollapsed));
 persist();
}
$$('[data-tab]').forEach(b=>b.addEventListener('click',()=>showTab(b.dataset.tab)));
$('#closeBtn').addEventListener('click',()=>setPanelCollapsed(true));
$('#panelToggle').addEventListener('click',()=>setPanelCollapsed(false));
setPanelCollapsed(state.panelCollapsed);
$('#fullscreenBtn').addEventListener('click',()=>{if(document.fullscreenElement)document.exitFullscreen?.();else document.documentElement.requestFullscreen?.()});
const island=$('.island');function applyPositions(){$$('.movable').forEach(el=>{const p=state.positions[el.dataset.key];if(p){el.style.setProperty('--x',p.x+'%');el.style.setProperty('--y',p.y+'%')}})}applyPositions();
$('#editToggle').addEventListener('change',e=>$('#scene').classList.toggle('editing',e.target.checked));
$$('.movable').forEach(el=>{let dragging=false;el.addEventListener('pointerdown',e=>{if(!$('#editToggle').checked)return;dragging=true;el.setPointerCapture(e.pointerId);e.preventDefault()});el.addEventListener('pointermove',e=>{if(!dragging)return;const r=island.getBoundingClientRect();const x=Math.max(11,Math.min(89,100*(e.clientX-r.left)/r.width)),y=Math.max(36,Math.min(82,100*(e.clientY-r.top)/r.height));el.style.setProperty('--x',x+'%');el.style.setProperty('--y',y+'%');state.positions[el.dataset.key]={x,y}});el.addEventListener('pointerup',()=>{if(dragging){dragging=false;persist()}})});
$('#resetDecor').addEventListener('click',()=>{state.positions={};const p={bench:[35,68],lamp:[71,64],flowers:[60,77]};$$('.movable').forEach(el=>{el.style.setProperty('--x',p[el.dataset.key][0]+'%');el.style.setProperty('--y',p[el.dataset.key][1]+'%')});persist()});
$$('.cat').forEach(c=>c.addEventListener('click',()=>{c.style.animationDuration='.5s';setTimeout(()=>c.style.animationDuration='',1800)}));
if('serviceWorker'in navigator && location.protocol.startsWith('http'))navigator.serviceWorker.register('./sw.js').catch(()=>{});
