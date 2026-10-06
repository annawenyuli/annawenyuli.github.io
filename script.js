
const qs=(s,e=document)=>e.querySelector(s), qsa=(s,e=document)=>[...e.querySelectorAll(s)];
const nav=qs('.nav'), toggle=qs('.mobile-toggle'); if(toggle) toggle.addEventListener('click',()=>nav.classList.toggle('open'));
const file=(location.pathname.split('/').pop()||'index.html'); qsa('.nav a').forEach(a=>{if(a.getAttribute('href')?.split('/').pop()===file)a.classList.add('active')});

// TOC active state
const tocLinks=qsa('.toc a'); if(tocLinks.length){const sections=tocLinks.map(a=>qs(a.getAttribute('href'))).filter(Boolean);const onScroll=()=>{let id=sections[0]?.id;sections.forEach(s=>{if(s.getBoundingClientRect().top<170)id=s.id});tocLinks.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+id))};addEventListener('scroll',onScroll,{passive:true});onScroll()}

const colorForArena=a=>{const k=window.ARENA_COLORS?.[a]||'slate';const map={violet:'#7357e8',slate:'#657383',indigo:'#4c5bd5',cyan:'#0b91b7',blue:'#2979db',amber:'#d99b12',coral:'#e95b50',teal:'#168b82',rose:'#db2777',green:'#169b62',orange:'#f97316',purple:'#8b4fcc',lime:'#65a30d',stone:'#7b746c'};return map[k]||map.slate};

// Ecosystem
if(qs('#ecosystem-map')){
 let view='stack', industry='All', layer='All';
 const data=window.ECOSYSTEM_DATA||[];
 const industries=['All',...new Set(data.map(d=>d.industry))]; const layers=['All',...new Set(data.map(d=>d.layer))];
 const industrySel=qs('#industry-filter'), layerSel=qs('#layer-filter');
 industries.forEach(v=>industrySel.insertAdjacentHTML('beforeend',`<option>${v}</option>`)); layers.forEach(v=>layerSel.insertAdjacentHTML('beforeend',`<option>${v}</option>`));
 industrySel.onchange=e=>{industry=e.target.value;render()}; layerSel.onchange=e=>{layer=e.target.value;render()};
 qsa('.view-btn').forEach(b=>b.onclick=()=>{view=b.dataset.view;qsa('.view-btn').forEach(x=>x.classList.toggle('active',x===b));render()});
 const node=d=>`<div class="company-node" style="--arena:${colorForArena(d.arena)}" title="${d.arena}"><b>${d.name}</b><small>${d.company} · ${d.type}</small></div>`;
 function render(){
  const rows=data.filter(d=>(industry==='All'||d.industry===industry)&&(layer==='All'||d.layer===layer)); const el=qs('#ecosystem-map');
  if(!rows.length){el.innerHTML='<div class="empty-state">No companies match this filter.</div>';return}
  if(view==='stack'){
   const order=[...new Set(data.map(d=>d.layer))]; el.className='ecosystem-stack'; el.innerHTML=order.filter(l=>rows.some(d=>d.layer===l)).map(l=>{
    const rr=rows.filter(d=>d.layer===l); const inds=[...new Set(rr.map(d=>d.industry))]; return `<section class="layer-block"><div class="layer-head"><strong>${l}</strong><span>${rr.length} products / companies</span></div><div class="industry-groups">${inds.map(i=>`<div class="industry-group"><div class="industry-title">${i}</div><div class="company-nodes">${rr.filter(d=>d.industry===i).map(node).join('')}</div></div>`).join('')}</div></section>`}).join('');
  } else {
   const inds=[...new Set(rows.map(d=>d.industry))]; el.className='industry-view'; el.innerHTML=inds.map(i=>{const rr=rows.filter(d=>d.industry===i);const ls=[...new Set(rr.map(d=>d.layer))];return `<section class="industry-block"><h3>${i}</h3>${ls.map(l=>`<div class="layer-strip"><div class="layer-strip-label">${l}</div><div class="company-nodes">${rr.filter(d=>d.layer===l).map(node).join('')}</div></div>`).join('')}</section>`}).join('');
  }
 }
 render();
 const legend=qs('#arena-legend'); [...new Set(data.map(d=>d.arena))].forEach(a=>legend.insertAdjacentHTML('beforeend',`<span class="legend-chip" style="--c:${colorForArena(a)}">${a}</span>`));
}

// Big Tech graph
if(qs('#bigtech-network')){
 const canvas=qs('#bigtech-network'), svg=qs('#network-svg'), detail=qs('#company-detail');
 const data=window.BIGTECH_DATA||[]; const byId={};
 data.forEach(d=>{const n=document.createElement('button');n.className='tech-node';n.id='node-'+d.id;n.style.left=d.x+'%';n.style.top=d.y+'%';n.style.setProperty('--accent-node',d.accent);n.innerHTML=`<h3>${d.company}</h3>${d.lines.slice(0,4).map(x=>`<div class="node-line"><b>${x[0]}:</b> ${x[1]}</div>`).join('')}<div class="node-line"><b>Click →</b> full product lines</div>`;n.onclick=()=>showDetail(d);canvas.appendChild(n);byId[d.id]=n});
 (window.EXTERNAL_LINKS||[]).forEach((d,i)=>{const n=document.createElement('div');n.className='external-node';n.id='external-'+i;n.style.left=d.x+'%';n.style.top=d.y+'%';n.textContent=d.name;canvas.appendChild(n);byId['external-'+i]=n});
 function lineBetween(a,b,label,dashed=false,href=''){
  const ca=canvas.getBoundingClientRect(), ra=a.getBoundingClientRect(), rb=b.getBoundingClientRect(); const x1=ra.left+ra.width/2-ca.left,y1=ra.top+ra.height/2-ca.top,x2=rb.left+rb.width/2-ca.left,y2=rb.top+rb.height/2-ca.top;
  const line=document.createElementNS('http://www.w3.org/2000/svg','line');line.setAttribute('x1',x1);line.setAttribute('y1',y1);line.setAttribute('x2',x2);line.setAttribute('y2',y2);line.setAttribute('stroke',dashed?'#a3a9b1':'#8790a0');line.setAttribute('stroke-width',dashed?'1.2':'1.6');if(dashed)line.setAttribute('stroke-dasharray','6 5');svg.appendChild(line);
  const mx=(x1+x2)/2,my=(y1+y2)/2;const t=document.createElementNS('http://www.w3.org/2000/svg','text');t.setAttribute('x',mx);t.setAttribute('y',my-5);t.setAttribute('text-anchor','middle');t.setAttribute('font-size','9');t.setAttribute('font-weight','700');t.setAttribute('fill','#66707b');t.textContent=label;svg.appendChild(t)
 }
 function draw(){svg.innerHTML='';(window.PARTNERSHIPS||[]).forEach(p=>lineBetween(byId[p.a],byId[p.b],p.label,p.dashed,p.source));(window.EXTERNAL_LINKS||[]).forEach((p,i)=>lineBetween(byId['external-'+i],byId[p.to],p.label,false,p.source))}
 function showDetail(d){detail.classList.add('open');detail.innerHTML=`<div class="eyebrow">${d.company}</div><h3>${d.company}: AI product map</h3><p>${d.thesis}</p><div class="company-nodes">${d.lines.map(x=>`<div class="company-node" style="--arena:${d.accent}"><b>${x[0]}</b><small>${x[1]}</small></div>`).join('')}</div><p><a class="source-link" target="_blank" rel="noreferrer" href="${d.source}">Primary source ↗</a></p>`;detail.scrollIntoView({behavior:'smooth',block:'nearest'})}
 draw(); addEventListener('resize',()=>requestAnimationFrame(draw)); setTimeout(draw,100);
}

// Tech terms
if(qs('#term-grid')){
 const all=window.TERM_DATA||[]; let selected=location.hash?decodeURIComponent(location.hash.slice(1)):''; let cat='All'; let search='';
 const cats=['All',...new Set(all.map(x=>x.category))]; const sel=qs('#term-category'); cats.forEach(c=>sel.insertAdjacentHTML('beforeend',`<option>${c}</option>`));sel.onchange=e=>{cat=e.target.value;render()};qs('#term-search').oninput=e=>{search=e.target.value.toLowerCase();render()};
 function detail(t){if(!t)return;selected=t.name;history.replaceState(null,'','#'+encodeURIComponent(t.name));qsa('.term-card').forEach(c=>c.classList.toggle('active',c.dataset.term===t.name));qs('#term-detail').innerHTML=`<div class="term-cat">${t.category}</div><h2>${t.name}</h2><p>${t.desc}</p><div class="micro-flow">${t.flow.map(s=>`<div class="micro-step">${s}</div>`).join('')}</div><div class="term-section"><b>Why it matters</b><p>${t.why||'This term describes a real boundary in modern AI systems. Understanding which component owns this job makes architecture and vendor comparisons much easier.'}</p></div><div class="term-section"><b>Do not confuse it with</b><p>${t.confuse||'Adjacent terms may sit above or below it in the stack; focus on what this component is responsible for executing or representing.'}</p></div>`}
 function render(){const rows=all.filter(t=>(cat==='All'||t.category===cat)&&(!search||`${t.name} ${t.desc} ${t.category}`.toLowerCase().includes(search)));qs('#term-grid').innerHTML=rows.map(t=>`<button class="term-card ${selected===t.name?'active':''}" data-term="${t.name}"><b>${t.name}</b><small>${t.category}</small><p>${t.desc}</p></button>`).join('');qsa('.term-card').forEach(c=>c.onclick=()=>detail(all.find(t=>t.name===c.dataset.term)));if(!selected&&rows[0])detail(rows[0]);else if(selected)detail(all.find(t=>t.name===selected)||rows[0])}
 render();
}
