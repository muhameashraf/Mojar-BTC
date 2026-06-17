function optionsHTML(){
  let h = '<option value="">— اختر / مخصص —</option>';
  ITEMS.forEach(grp => {
    h += `<optgroup label="${grp.g}">`;
    grp.list.forEach(it => h += `<option value="${it.n}">${it.n}</option>`);
    h += '</optgroup>';
  });
  return h;
}

let id = 0;
function addRow(preset){
  const tb = document.getElementById('rows');
  const rid = ++id;
  const tr = document.createElement('tr');
  tr.dataset.id = rid;
  tr.innerHTML = `
    <td class="idx"></td>
    <td>
      <select onchange="onPick(${rid})">${optionsHTML()}</select>
    </td>
    <td><input class="num count" type="number" min="0" step="1" value="" oninput="calc()"></td>
    <td><input class="num pw" type="number" min="0" step="0.01" value="" oninput="calc()"></td>
    <td class="cell"><span class="total-cell rowW">0.00</span></td>
    <td>
      <select class="karat" onchange="calc()">
        <option value="21">21</option>
        <option value="24">24</option>
        <option value="0">—</option>
      </select>
    </td>
    <td><input class="num fee" type="number" min="0" step="0.01" value="" oninput="calc()"></td>
    <td class="cell"><span class="total-cell rowFee">0</span></td>
    <td><button class="del" onclick="delRow(${rid})">×</button></td>`;
  tb.appendChild(tr);
  if(preset){
    tr.querySelector('select').value = preset;
    onPick(rid);
  }
  renumber();
}

function onPick(rid){
  const tr = document.querySelector(`tr[data-id="${rid}"]`);
  const name = tr.querySelector('select').value;
  const d = FLAT[name];
  if(d){
    tr.querySelector('.pw').value = d.w || '';
    tr.querySelector('.fee').value = d.fee;
    tr.querySelector('.karat').value = String(d.k);
    if(!tr.querySelector('.count').value) tr.querySelector('.count').value = 1;
  }
  calc();
}

function delRow(rid){
  document.querySelector(`tr[data-id="${rid}"]`).remove();
  renumber(); calc();
}
function renumber(){
  document.querySelectorAll('#rows tr').forEach((tr,i)=> tr.querySelector('.idx').textContent = i+1);
}
function clearAll(){
  if(!confirm('مسح كل الأصناف؟')) return;
  document.getElementById('rows').innerHTML=''; addRow(); calc();
}

const fmt = (n,d=2)=> n.toLocaleString('en-US',{minimumFractionDigits:d,maximumFractionDigits:d});

function calc(){
  let w24=0, w21=0, cash=0;
  document.querySelectorAll('#rows tr').forEach(tr=>{
    const c = parseFloat(tr.querySelector('.count').value)||0;
    const pw = parseFloat(tr.querySelector('.pw').value)||0;
    const fee = parseFloat(tr.querySelector('.fee').value)||0;
    const k = tr.querySelector('.karat').value;
    const rowW = c*pw;
    const rowFee = rowW*fee;
    tr.querySelector('.rowW').textContent = fmt(rowW);
    tr.querySelector('.rowFee').textContent = fmt(rowFee,0);
    // karat badge color on the select cell
    const sel = tr.querySelector('.karat');
    sel.style.color = k==='24'?'var(--k24)':k==='21'?'var(--k21)':'#999';
    sel.style.fontWeight='800';
    if(k==='24') w24+=rowW;
    else if(k==='21') w21+=rowW;
    cash += rowFee;
  });
  const conv = w24*24/21;
  const wfinal = w21 + conv;
  document.getElementById('w24').textContent = fmt(w24);
  document.getElementById('w21').textContent = fmt(w21);
  document.getElementById('conv').textContent = fmt(conv);
  document.getElementById('wfinal').textContent = fmt(wfinal);
  document.getElementById('cash').textContent = fmt(cash,0);
}

// ---- gather current rows ----
function gather(){
  const out=[];
  document.querySelectorAll('#rows tr').forEach(tr=>{
    const name = tr.querySelector('select').selectedOptions[0]?.value || '';
    const c = parseFloat(tr.querySelector('.count').value)||0;
    const pw = parseFloat(tr.querySelector('.pw').value)||0;
    const fee = parseFloat(tr.querySelector('.fee').value)||0;
    const k = tr.querySelector('.karat').value;
    if(!name && !c && !pw) return;
    out.push({name,c,pw,fee,k,rowW:c*pw,rowFee:c*pw*fee});
  });
  return out;
}
function totals(rows){
  let w24=0,w21=0,cash=0;
  rows.forEach(r=>{ if(r.k==='24')w24+=r.rowW; else if(r.k==='21')w21+=r.rowW; cash+=r.rowFee; });
  const conv=w24*24/21; return {w24,w21,conv,wfinal:w21+conv,cash};
}
function meta(){
  return {mojarNo:document.getElementById('mojarNo').value.trim()||'—',
          btcNo:document.getElementById('btcNo').value.trim()||'—',
          date:document.getElementById('recDate').value||'—'};
}

// ---- branded PDF (via print) ----
function buildPrintDoc(){
  const rows=gather(), t=totals(rows), m=meta();
  const logo=document.querySelector('.brand img').src;
  let body=rows.map((r,i)=>`<tr><td>${i+1}</td><td style="text-align:right">${r.name||'-'}</td>
    <td>${r.c||'-'}</td><td>${r.pw?fmt(r.pw):'-'}</td><td>${fmt(r.rowW)}</td>
    <td>${r.k==='0'?'-':r.k}</td><td>${r.fee?fmt(r.fee):'-'}</td><td>${fmt(r.rowFee,0)}</td></tr>`).join('');
  if(!rows.length) body='<tr><td colspan="8" style="padding:20px;color:#999">لا توجد أصناف</td></tr>';
  document.getElementById('printDoc').innerHTML=`
    <div class="pd-head">
      <div class="pd-brand"><img src="${logo}"><div>
        <h2 style="font-size:22px;font-weight:800;color:var(--gold-deep)">ايصال استلام من مورد BTC</h2>
      </div></div>
      <div class="pd-title"><div class="sub">MOJAR</div>
        <div class="pd-recno">إيصال تسليم BTC<br><b>${m.btcNo}</b></div></div>
    </div>
    <div class="pd-meta">
      <span><b>رقم إيصال موجار:</b> <span class="v">${m.mojarNo}</span></span>
      <span><b>التاريخ:</b> <span class="v">${m.date}</span></span></div>
    <table class="pd-tbl"><thead><tr>
      <th>م</th><th>الصنف</th><th>العدد</th><th>وزن القطعة</th><th>إجمالي الوزن</th>
      <th>العيار</th><th>الأجر/جم</th><th>إجمالي الأجر</th></tr></thead><tbody>${body}</tbody></table>
    <div class="pd-sums">
      <div><div class="l">وزن عيار 24</div><div class="n">${fmt(t.w24)}</div></div>
      <div><div class="l">وزن عيار 21</div><div class="n">${fmt(t.w21)}</div></div>
      <div><div class="l">24 محوّل لـ21</div><div class="n">${fmt(t.conv)}</div></div>
      <div class="final"><div class="l">الإجمالي النهائي 21</div><div class="n">${fmt(t.wfinal)}</div></div>
      <div class="cash"><div class="l">إجمالي النقدية</div><div class="n">${fmt(t.cash,0)}</div></div>
    </div>
    <div class="pd-sign">
      <div><div class="line">مندوب البيع</div></div>
      <div><div class="line">المستلم</div></div>
      <div><div class="line">ختم المحل</div></div>
    </div>
    <div class="pd-foot">المعادلة: وزن21 = وزن24 × 24 ÷ 21 — الأجر من جدول جملة BTC موسم 2025/2026 (مصنعية + دمغة)</div>`;
}
function exportPDF(){ buildPrintDoc(); window.print(); }
window.addEventListener("beforeprint", buildPrintDoc);

// ---- Excel export ----
function exportExcel(){
  const rows=gather(), t=totals(rows), m=meta();
  const aoa=[
    ["ايصال استلام من مورد BTC"],
    ["رقم إيصال موجار:", m.mojarNo, "", "رقم إيصال تسليم BTC:", m.btcNo, "", "التاريخ:", m.date],
    [],
    ["م","العدد","الصنف","وزن القطعة","إجمالي وزن عيار 24","إجمالي وزن عيار 21","الأجر/جرام","إجمالي الأجر"]
  ];
  rows.forEach((r,i)=>aoa.push([
    i+1, r.c, r.name, r.pw,
    r.k==='24'?r.rowW:"-", r.k==='21'?r.rowW:"-", r.fee, r.rowFee
  ]));
  aoa.push([]);
  aoa.push(["","","","إجمالي وزن عيار 24", t.w24, t.w21, "إجمالي النقدية", t.cash]);
  aoa.push(["","","","وزن 24 محوّل إلى 21", t.conv, "", "الإجمالي النهائي عيار 21", t.wfinal]);
  const ws=XLSX.utils.aoa_to_sheet(aoa);
  ws['!cols']=[{wch:5},{wch:7},{wch:22},{wch:11},{wch:16},{wch:16},{wch:10},{wch:13}];
  ws['!merges']=[{s:{r:0,c:0},e:{r:0,c:7}}];
  const wb=XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb,ws,"استلام BTC");
  const fn=`استلام_BTC_${m.btcNo!=='—'?m.btcNo:(m.mojarNo!=='—'?m.mojarNo:m.date)}.xlsx`;
  XLSX.writeFile(wb,fn);
}

// ================= DATABASE (local persistence) =================
const DB_KEY="mojar_btc_receipts_v1";
const SEQ_KEY="mojar_btc_seq_v1";
const SEQ_START=1000;            // first auto number will be 1001
let editingId=null;

function getSeq(){
  let s;
  try{ s=localStorage.getItem(SEQ_KEY); }catch(e){ s=null; }
  if(s===null||s===undefined){
    const nums=dbLoad().map(r=>parseInt(r.mojarNo,10)).filter(n=>!isNaN(n));
    s = nums.length? Math.max(...nums) : SEQ_START;
    setSeq(s);
  }
  return parseInt(s,10)||SEQ_START;
}
function setSeq(n){ try{ localStorage.setItem(SEQ_KEY,String(n)); }catch(e){} }
function previewMojarNo(){ document.getElementById('mojarNo').value = getSeq()+1; }

function dbLoad(){
  try{ return JSON.parse(localStorage.getItem(DB_KEY)||"[]"); }
  catch(e){ return []; }
}
function dbSave(arr){
  try{ localStorage.setItem(DB_KEY, JSON.stringify(arr)); return true; }
  catch(e){ toast("تعذّر الحفظ على هذا المتصفح — استخدم النسخة الاحتياطية JSON"); return false; }
}
function toast(msg){
  const t=document.getElementById('toast'); t.textContent=msg; t.classList.add('show');
  clearTimeout(toast._t); toast._t=setTimeout(()=>t.classList.remove('show'),2200);
}

function saveReceipt(){
  const rows=gather(), t=totals(rows), m=meta();
  if(!rows.length){ toast("أضف صنف واحد على الأقل قبل الحفظ"); return; }
  const arr=dbLoad();
  let mojarNo;
  if(editingId){
    const ex=arr.find(x=>x.id===editingId);
    mojarNo = ex ? ex.mojarNo : m.mojarNo;          // keep existing number on edit
  }else{
    const n=getSeq()+1; setSeq(n); mojarNo=String(n); // commit next number
  }
  document.getElementById('mojarNo').value=mojarNo;
  const rec={
    id: editingId || ("r"+Date.now()),
    savedAt: new Date().toISOString(),
    mojarNo, btcNo:m.btcNo, date:m.date,
    rows, totals:t
  };
  const i=arr.findIndex(x=>x.id===rec.id);
  if(i>=0) arr[i]=rec; else arr.unshift(rec);
  dbSave(arr); editingId=rec.id;
  refreshCount(); renderArchive();
  toast(i>=0?"تم تحديث الإيصال":"تم حفظ الإيصال");
}

function loadReceipt(id){
  const rec=dbLoad().find(x=>x.id===id); if(!rec) return;
  document.getElementById('mojarNo').value = rec.mojarNo==='—'?'':rec.mojarNo;
  document.getElementById('btcNo').value = rec.btcNo==='—'?'':rec.btcNo;
  document.getElementById('recDate').value = rec.date==='—'?'':rec.date;
  document.getElementById('rows').innerHTML='';
  rec.rows.forEach(r=>{
    addRow();
    const tr=document.querySelector('#rows tr:last-child');
    // try to match the saved item name in the dropdown
    const sel=tr.querySelector('select');
    if([...sel.options].some(o=>o.value===r.name)) sel.value=r.name;
    tr.querySelector('.count').value=r.c||'';
    tr.querySelector('.pw').value=r.pw||'';
    tr.querySelector('.fee').value=r.fee||'';
    tr.querySelector('.karat').value=r.k||'21';
  });
  if(!rec.rows.length) addRow();
  editingId=rec.id;
  calc(); switchView('new');
  toast("تم فتح الإيصال للتعديل");
}

function deleteReceipt(id, ev){
  ev.stopPropagation();
  if(!confirm("حذف هذا الإيصال نهائيًا؟")) return;
  const arr=dbLoad().filter(x=>x.id!==id);
  dbSave(arr); if(editingId===id) editingId=null;
  refreshCount(); renderArchive(); toast("تم الحذف");
}

function newReceipt(){
  editingId=null;
  document.getElementById('btcNo').value='';
  previewMojarNo();
  document.getElementById('recDate').valueAsDate=new Date();
  document.getElementById('rows').innerHTML='';
  addRow(); addRow(); addRow(); calc();
}

function refreshCount(){ document.getElementById('arcCount').textContent=dbLoad().length; }

function renderArchive(){
  const q=(document.getElementById('arcQuery').value||"").trim().toLowerCase();
  let arr=dbLoad();
  if(q){
    arr=arr.filter(r=>{
      const hay=[r.mojarNo,r.btcNo,r.date, ...r.rows.map(x=>x.name)].join(" ").toLowerCase();
      return hay.includes(q);
    });
  }
  const list=document.getElementById('arcList');
  if(!arr.length){ list.innerHTML='<div class="arc-empty">لا توجد إيصالات محفوظة</div>'; return; }
  list.innerHTML=arr.map(r=>`
    <div class="arc-item">
      <div class="arc-main" onclick="loadReceipt('${r.id}')">
        <div class="arc-nos">موجار: ${r.mojarNo} &nbsp;·&nbsp; <span class="btc">BTC: ${r.btcNo}</span></div>
        <div class="arc-sub">${r.date} — ${r.rows.length} صنف — نقدية ${fmt(r.totals.cash,0)} ج.م — وزن 21 نهائي ${fmt(r.totals.wfinal)} جم</div>
      </div>
      <div class="arc-actions">
        <button class="arc-load" onclick="loadReceipt('${r.id}')">فتح</button>
        <button class="arc-del" onclick="deleteReceipt('${r.id}',event)">حذف</button>
      </div>
    </div>`).join('');
}

function exportDB(){
  const data=dbLoad();
  const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download=`نسخة_احتياطية_إيصالات_${new Date().toISOString().slice(0,10)}.json`;
  a.click(); URL.revokeObjectURL(a.href);
  toast("تم تنزيل النسخة الاحتياطية");
}
function importDB(file){
  if(!file) return;
  const rd=new FileReader();
  rd.onload=()=>{
    try{
      const incoming=JSON.parse(rd.result);
      if(!Array.isArray(incoming)) throw 0;
      const cur=dbLoad();
      const map={}; cur.forEach(r=>map[r.id]=r); incoming.forEach(r=>map[r.id]=r);
      const merged=Object.values(map).sort((a,b)=>(b.savedAt||"").localeCompare(a.savedAt||""));
      dbSave(merged); refreshCount(); renderArchive();
      toast(`تم استيراد ${incoming.length} إيصال`);
    }catch(e){ toast("ملف غير صالح"); }
  };
  rd.readAsText(file);
}

function switchView(v){
  const isNew=v==='new';
  document.getElementById('viewNew').hidden=!isNew;
  document.getElementById('viewArchive').hidden=isNew;
  document.getElementById('tabNew').classList.toggle('active',isNew);
  document.getElementById('tabArc').classList.toggle('active',!isNew);
  if(!isNew) renderArchive();
}

// seed
document.getElementById('recDate').valueAsDate = new Date();
addRow(); addRow(); addRow();
previewMojarNo();
calc();
refreshCount();

// ===== PWA: offline + installable =====
if('serviceWorker' in navigator){
  window.addEventListener('load',()=>{
    navigator.serviceWorker.register('sw.js').catch(()=>{});
  });
}
