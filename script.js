/* ============================================================
   CEILING APP — script.js
   ============================================================ */

/* ── SCREEN NAV ── */
function openScreen(id) {
  document.getElementById('dashboard').style.display = 'none';
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  if (id === 'quotation-screen') setTodayDate('qd-date');
  if (id === 'invoice-screen')   { setTodayDate('id-date'); calcInvoice(); }
  if (id === 'worker-screen')    { renderWorkers(); }
}

function backToDash() {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('dashboard').style.display = '';
}

function setTodayDate(elId) {
  const el = document.getElementById(elId);
  if (el && !el.textContent.trim()) {
    const n = new Date();
    const d = String(n.getDate()).padStart(2,'0');
    const m = String(n.getMonth()+1).padStart(2,'0');
    const y = String(n.getFullYear()).slice(2);
    el.textContent = `${d}-${m}-${y}`;
  }
}

/* ══════════════ QUOTATION ══════════════ */

function addQRow() {
  const tbody = document.getElementById('q-table-body');
  const num = tbody.querySelectorAll('tr').length + 1;
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td class="tc-no" contenteditable="true">${num}</td>
    <td class="tc-content khmer" contenteditable="true"></td>
    <td class="tc-size" contenteditable="true"></td>
    <td class="tc-price" contenteditable="true"></td>
    <td class="tc-act no-print"><button class="del-btn" onclick="deleteQRow(this)">✕</button></td>`;
  tbody.appendChild(tr);
  tr.querySelector('.tc-content').focus();
}

function deleteQRow(btn) { btn.closest('tr').remove(); renumberQ(); }
function renumberQ() {
  document.querySelectorAll('#q-table-body tr').forEach((r,i) => {
    const c = r.querySelector('.tc-no'); if (c) c.textContent = i+1;
  });
}

function addQNote() {
  const list = document.getElementById('q-notes-list');
  const n = list.querySelectorAll('.note').length + 1;
  const p = document.createElement('p');
  p.className = 'note khmer'; p.contentEditable = 'true'; p.textContent = `${n}. `;
  list.appendChild(p); p.focus();
  const r = document.createRange(), s = window.getSelection();
  r.selectNodeContents(p); r.collapse(false); s.removeAllRanges(); s.addRange(r);
}

/* Quotation customer modal */
function openQCustomerModal() {
  document.getElementById('qf-customer').value = document.getElementById('qd-customer').textContent.trim();
  document.getElementById('qf-contact').value  = document.getElementById('qd-contact').textContent.trim();
  document.getElementById('qf-address').value  = document.getElementById('qd-address').textContent.trim();
  document.getElementById('qf-quoteno').value  = document.getElementById('qd-quoteno').textContent.trim();
  document.getElementById('qf-date').value     = document.getElementById('qd-date').textContent.trim();
  document.getElementById('qCustomerModal').classList.add('open');
}
function closeQCustomerModal() { document.getElementById('qCustomerModal').classList.remove('open'); }
function closeIfQOverlay(e) { if (e.target === document.getElementById('qCustomerModal')) closeQCustomerModal(); }
function applyQCustomer() {
  document.getElementById('qd-customer').textContent = document.getElementById('qf-customer').value;
  document.getElementById('qd-contact').textContent  = document.getElementById('qf-contact').value;
  document.getElementById('qd-address').textContent  = document.getElementById('qf-address').value;
  document.getElementById('qd-quoteno').textContent  = document.getElementById('qf-quoteno').value;
  document.getElementById('qd-date').textContent     = document.getElementById('qf-date').value;
  closeQCustomerModal();
}

/* Quotation PDF */
async function saveQuotationPDF() {
  await savePDF('quotation-doc', 'q-savebtn', 'Quotation Ceiling', '.page-wrapper');
}
function saveQForMobile() { mobilePrint(); }

/* ══════════════ INVOICE ══════════════ */

function addIRow() {
  const tbody = document.getElementById('i-table-body');
  const num = tbody.querySelectorAll('tr').length + 1;
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td class="tc-no" contenteditable="true">${num}</td>
    <td class="tc-content khmer" contenteditable="true"></td>
    <td class="tc-size" contenteditable="true" oninput="calcInvoice()"></td>
    <td class="tc-price" contenteditable="true" oninput="calcInvoice()"></td>
    <td class="tc-price itotal"></td>
    <td class="tc-act no-print"><button class="del-btn" onclick="deleteIRow(this)">✕</button></td>`;
  tbody.appendChild(tr);
  tr.querySelector('.tc-content').focus();
}

function deleteIRow(btn) { btn.closest('tr').remove(); renumberI(); calcInvoice(); }
function renumberI() {
  document.querySelectorAll('#i-table-body tr').forEach((r,i) => {
    const c = r.querySelector('.tc-no'); if (c) c.textContent = i+1;
  });
}

function calcInvoice() {
  let sub = 0;
  document.querySelectorAll('#i-table-body tr').forEach(tr => {
    const sizeCell  = tr.querySelector('.tc-size');
    const priceCell = tr.querySelector('.tc-price[contenteditable]');
    const totalCell = tr.querySelector('.itotal');
    if (priceCell && totalCell) {
      const sizeRaw  = sizeCell  ? sizeCell.textContent.replace(/[^0-9.]/g,'') : '';
      const priceRaw = priceCell.textContent.replace(/[^0-9.]/g,'');
      const size  = parseFloat(sizeRaw)  || 0;
      const price = parseFloat(priceRaw) || 0;
      const lineTotal = size * price;
      sub += lineTotal;
      totalCell.textContent = (size > 0 && price > 0) ? lineTotal.toFixed(2) + '$' : '';
    }
  });
  const depositText = document.getElementById('i-deposit').textContent.replace(/[^0-9.]/g,'');
  const deposit = parseFloat(depositText) || 0;
  const total = sub - deposit;
  document.getElementById('i-total').textContent = total.toFixed(2) + '$';
}

function addINote() {
  const list = document.getElementById('i-notes-list');
  const n = list.querySelectorAll('.note').length + 1;
  const p = document.createElement('p');
  p.className = 'note khmer'; p.contentEditable = 'true'; p.textContent = `${n}. `;
  list.appendChild(p); p.focus();
  const r = document.createRange(), s = window.getSelection();
  r.selectNodeContents(p); r.collapse(false); s.removeAllRanges(); s.addRange(r);
}

/* Invoice customer modal */
function openICustomerModal() {
  document.getElementById('if-customer').value = document.getElementById('id-customer').textContent.trim();
  document.getElementById('if-contact').value  = document.getElementById('id-contact').textContent.trim();
  document.getElementById('if-address').value  = document.getElementById('id-address').textContent.trim();
  document.getElementById('if-invno').value    = document.getElementById('id-invno').textContent.trim();
  document.getElementById('if-date').value     = document.getElementById('id-date').textContent.trim();
  document.getElementById('iCustomerModal').classList.add('open');
}
function closeICustomerModal() { document.getElementById('iCustomerModal').classList.remove('open'); }
function closeIfIOverlay(e) { if (e.target === document.getElementById('iCustomerModal')) closeICustomerModal(); }
function applyICustomer() {
  document.getElementById('id-customer').textContent = document.getElementById('if-customer').value;
  document.getElementById('id-contact').textContent  = document.getElementById('if-contact').value;
  document.getElementById('id-address').textContent  = document.getElementById('if-address').value;
  document.getElementById('id-invno').textContent    = document.getElementById('if-invno').value;
  document.getElementById('id-date').textContent     = document.getElementById('if-date').value;
  closeICustomerModal();
}

/* Invoice PDF */
async function saveInvoicePDF() {
  await savePDF('invoice-doc', 'i-savebtn', 'Invoice Ceiling', '.page-wrapper');
}
function saveIForMobile() { mobilePrint(); }

/* ══════════════ SHARED PDF HELPERS ══════════════ */
async function savePDF(docId, btnId, filename, wrapperSel) {
  const btn = document.getElementById(btnId);
  const origHTML = btn.innerHTML;
  btn.textContent = '⏳ Generating…'; btn.disabled = true;

  document.querySelectorAll('.no-print').forEach(el => {
    el.dataset.prevDisplay = el.style.display; el.style.display = 'none';
  });
  if (wrapperSel) document.querySelector(wrapperSel).style.paddingTop = '0';

  const docEl = document.getElementById(docId);
  try {
    await document.fonts.ready;
    const canvas = await html2canvas(docEl, {
      scale: 2, useCORS: true, allowTaint: true, logging: false,
      backgroundColor: '#ffffff',
      onclone: doc => new Promise(r => setTimeout(r, 200))
    });
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
    const margin = 5, printW = pageW - margin*2;
    const printH = canvas.height * (printW / canvas.width);
    if (printH <= pageH - margin*2) {
      pdf.addImage(canvas, 'PNG', margin, margin, printW, printH, '', 'FAST');
    } else {
      const mmPerPx = printW / canvas.width;
      const sliceH = Math.floor((pageH - margin*2) / mmPerPx);
      let y = 0;
      while (y < canvas.height) {
        const s = document.createElement('canvas');
        s.width = canvas.width; s.height = Math.min(sliceH, canvas.height - y);
        s.getContext('2d').drawImage(canvas, 0, -y);
        pdf.addImage(s, 'PNG', margin, margin, printW, s.height*mmPerPx, '', 'FAST');
        y += sliceH; if (y < canvas.height) pdf.addPage();
      }
    }
    pdf.save(filename + '.pdf');
  } finally {
    document.querySelectorAll('.no-print').forEach(el => { el.style.display = el.dataset.prevDisplay || ''; });
    if (wrapperSel) document.querySelector(wrapperSel).style.paddingTop = '';
    btn.innerHTML = origHTML; btn.disabled = false;
  }
}

function mobilePrint() {
  document.querySelectorAll('.no-print').forEach(el => { el.style.display = 'none'; });
  window.print();
  setTimeout(() => { document.querySelectorAll('.no-print').forEach(el => { el.style.display = ''; }); }, 1000);
}

/* ══════════════ WORKERS ══════════════ */
let workers = [];
let editingIdx = null;

/* ── WORKER PRINT DOC ── */
function buildWorkerPrintDoc() {
  const dateFrom = document.getElementById('wd-date-from').textContent.trim();
  const dateTo   = document.getElementById('wd-date-to').textContent.trim();
  const sigDate  = document.getElementById('wd-sig-date').textContent.trim();
  const sigName  = document.getElementById('wd-sig-name').textContent.trim();

  // Convert signature image to base64 so it renders in the off-screen canvas
  function getSignatureBase64() {
    try {
      const img = document.querySelector('.wsa-sig-img');
      if (!img || !img.complete) return '';
      const c = document.createElement('canvas');
      c.width = img.naturalWidth; c.height = img.naturalHeight;
      c.getContext('2d').drawImage(img, 0, 0);
      return c.toDataURL('image/png');
    } catch(e) { return ''; }
  }
  const sigSrc = getSignatureBase64() || 'signature.png';

  // Column header style — matches the blue/teal colors in the image
  const TH = `padding:9px 8px;border:1px solid #2c3e6b;text-align:center;font-family:'Noto Sans Khmer',sans-serif;font-size:10.5px;line-height:1.5;vertical-align:middle;`;
  const TD = `padding:7px 8px;border:1px solid #2c3e6b;text-align:center;font-family:'DM Sans',sans-serif;font-size:12px;vertical-align:middle;`;

  let rows = '';
  workers.forEach((w, i) => {
    const gross   = (w.rate || 0) * (w.days || 0);
    const already = parseFloat(w.already) || 0;
    const remain  = gross - already;
    rows += `<tr>
      <td style="${TD}">${w.days || 0} ថ្ងៃ</td>
      <td style="${TD}">${w.rate || 0}$</td>
      <td style="${TD}">0$</td>
      <td style="${TD}">${gross.toFixed(2)}$</td>
      <td style="${TD}">${already > 0 ? already.toFixed(2)+'$' : '125$'}</td>
      <td style="${TD};font-weight:700;">${remain.toFixed(2)}$</td>
    </tr>`;
  });

  // If no workers, show a blank row
  if (!rows) rows = `<tr>
    <td style="${TD}"> </td><td style="${TD}"> </td><td style="${TD}">0$</td>
    <td style="${TD}"> </td><td style="${TD}"> </td><td style="${TD}"> </td>
  </tr>`;

  return `<div id="worker-print-doc" style="background:#fff;width:794px;padding:40px 36px 60px;font-family:'DM Sans',sans-serif;font-size:12px;color:#1C1C1E;">
    <!-- Title -->
    <div style="text-align:center;margin-bottom:18px;">
      <span style="font-family:'Noto Sans Khmer',sans-serif;font-size:14px;font-weight:700;color:#1C1C1E;border-bottom:1.5px solid #1C1C1E;padding-bottom:2px;">${workers[0].name}</span>
    </div>
    <!-- Table -->
    <table style="width:100%;border-collapse:collapse;border:1.5px solid #2c3e6b;">
      <thead>
        <tr>
          <th style="${TH};color:#2980b9;background:#fff;width:15%;">ចំនួនថ្ងៃធ្វើការ</th>
          <th style="${TH};color:#27ae60;background:#fff;width:13%;">ចំនួនប្រាក់គិតតង្វៃ</th>
          <th style="${TH};color:#2980b9;background:#fff;width:15%;">ថ្លៃដឹក ( 0 ដង )</th>
          <th style="${TH};color:#c0392b;background:#fff;width:17%;">ចំនួនប្រាក់ដែលត្រូវស្រ្បើក</th>
          <th style="${TH};color:#27ae60;background:#fff;width:17%;">ចំនួនបើកមានសង្វែមុន</th>
          <th style="${TH};color:#8e44ad;background:#fff;width:23%;">ចំនួនបើកសម្រាប់ថ្ងៃ<br/><span style="font-size:9.5px;">${dateFrom} ដល់ ${dateTo}</span></th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
    <!-- Signature block — right aligned, matches image -->
    <div style="margin-top:44px;text-align:right;padding-right:10px;">
      <div style="display:inline-block;text-align:center;">
        <div style="border:1px solid #aaa;padding:6px 10px;min-width:110px;min-height:64px;display:flex;align-items:center;justify-content:center;margin-bottom:6px;">
          <img src="${sigSrc}" style="max-width:100px;max-height:54px;object-fit:contain;" crossorigin="anonymous"/>
        </div>
        <div style="font-family:'Noto Sans Khmer',sans-serif;font-size:13px;font-weight:700;color:#1C1C1E;">${sigName}</div>
        <div style="font-family:'Noto Sans Khmer',sans-serif;font-size:11px;color:#444;margin-top:3px;">ក្រចេះថ្ងៃទី ${sigDate}</div>
      </div>
    </div>
  </div>`;
}

async function saveWorkerPDF() {
  const btn = document.getElementById('w-savebtn');
  const origHTML = btn.innerHTML;
  btn.textContent = '⏳ Generating…'; btn.disabled = true;

  // Pre-load signature as base64 so html2canvas can render it
  async function preloadSigB64() {
    return new Promise(resolve => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const c = document.createElement('canvas');
          c.width = img.naturalWidth; c.height = img.naturalHeight;
          c.getContext('2d').drawImage(img, 0, 0);
          resolve(c.toDataURL('image/png'));
        } catch(e) { resolve(''); }
      };
      img.onerror = () => resolve('');
      img.src = 'signature.png?' + Date.now();
    });
  }
  const sigB64 = await preloadSigB64();

  // Build a temp container
  const wrapper = document.createElement('div');
  wrapper.style.cssText = 'position:fixed;top:-9999px;left:-9999px;';
  wrapper.innerHTML = buildWorkerPrintDoc();
  // Inject base64 signature if available
  if (sigB64) {
    const si = wrapper.querySelector('img[src="signature.png"], img[src^="data:"]');
    if (si) si.src = sigB64;
  }
  document.body.appendChild(wrapper);

  try {
    await document.fonts.ready;
    await new Promise(r => setTimeout(r, 400));
    const canvas = await html2canvas(wrapper.firstElementChild, {
      scale: 2, useCORS: true, allowTaint: true, logging: false,
      backgroundColor: '#ffffff'
    });
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
    const margin = 5, printW = pageW - margin*2;
    const printH = canvas.height * (printW / canvas.width);
    if (printH <= pageH - margin*2) {
      pdf.addImage(canvas, 'PNG', margin, margin, printW, printH, '', 'FAST');
    } else {
      const mmPerPx = printW / canvas.width;
      const sliceH = Math.floor((pageH - margin*2) / mmPerPx);
      let y = 0;
      while (y < canvas.height) {
        const s = document.createElement('canvas');
        s.width = canvas.width; s.height = Math.min(sliceH, canvas.height - y);
        s.getContext('2d').drawImage(canvas, 0, -y);
        pdf.addImage(s, 'PNG', margin, margin, printW, s.height*mmPerPx, '', 'FAST');
        y += sliceH; if (y < canvas.height) pdf.addPage();
      }
    }
    pdf.save('Worker-Spend.pdf');
  } finally {
    document.body.removeChild(wrapper);
    btn.innerHTML = origHTML; btn.disabled = false;
  }
}

function printWorker() {
  // inject print-only doc into page
  const existing = document.getElementById('worker-print-area');
  if (existing) existing.remove();
  const div = document.createElement('div');
  div.id = 'worker-print-area';
  div.className = 'worker-print-only';
  div.innerHTML = buildWorkerPrintDoc();
  document.body.appendChild(div);

  const noprints = document.querySelectorAll('.no-print');
  noprints.forEach(el => { el.dataset.prevDisplay = el.style.display; el.style.display = 'none'; });
  document.getElementById('worker-screen').style.display = 'none';

  window.print();

  setTimeout(() => {
    noprints.forEach(el => { el.style.display = el.dataset.prevDisplay || ''; });
    document.getElementById('worker-screen').style.display = '';
    div.remove();
  }, 1000);
}

function renderWorkers() {
  const tbody = document.getElementById('worker-list');
  tbody.innerHTML = '';
  let totalDays = 0, totalPay = 0;
  workers.forEach((w, i) => {
    const gross   = (w.rate || 0) * (w.days || 0);
    const already = parseFloat(w.already) || 0;
    const remain  = gross - already;
    totalDays += w.days || 0; totalPay += gross;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="wt-name khmer">${w.name}<div style="font-size:10px;color:#888;font-weight:400;">${w.role || ''}</div></td>
      <td class="khmer" style="font-size:11px;">${w.role || '—'}</td>
      <td>${w.days || 0}</td>
      <td>$${(w.rate||0).toFixed(2)}</td>
      <td style="font-weight:600;">$${gross.toFixed(2)}</td>
      <td style="color:#e67e22;">$${already.toFixed(2)}</td>
      <td class="wt-remain">$${remain.toFixed(2)}</td>
      <td class="wt-btns no-print">
        <button class="wc-btn" onclick="editWorker(${i})">✏️</button>
        <button class="wc-btn red" onclick="deleteWorker(${i})">✕</button>
      </td>`;
    tbody.appendChild(tr);
  });
  document.getElementById('ws-count').textContent  = workers.length;
  document.getElementById('ws-days').textContent   = totalDays;
  document.getElementById('ws-total').textContent  = '$' + totalPay.toFixed(2);
  document.getElementById('ws-avg').textContent    = workers.length ? '$' + (totalPay/workers.length).toFixed(2) : '$0';
}

function openWModal(idx = null) {
  editingIdx = idx;
  document.getElementById('wm-title').textContent = idx !== null ? 'Edit Worker' : 'Add Worker';
  const w = idx !== null ? workers[idx] : {};
  document.getElementById('wf-name').value    = w.name    || '';
  document.getElementById('wf-role').value    = w.role    || '';
  document.getElementById('wf-rate').value    = w.rate    || '';
  document.getElementById('wf-days').value    = w.days    || '';
  document.getElementById('wf-already').value = w.already || '';
  document.getElementById('wModal').classList.add('open');
}
function editWorker(i) { openWModal(i); }
function deleteWorker(i) { workers.splice(i,1); renderWorkers(); }
function closeWModal() { document.getElementById('wModal').classList.remove('open'); }
function closeIfWOverlay(e) { if (e.target === document.getElementById('wModal')) closeWModal(); }
function applyWorker() {
  const name = document.getElementById('wf-name').value.trim();
  if (!name) return;
  const w = {
    name,
    role:    document.getElementById('wf-role').value.trim(),
    rate:    parseFloat(document.getElementById('wf-rate').value)    || 0,
    days:    parseFloat(document.getElementById('wf-days').value)    || 0,
    already: parseFloat(document.getElementById('wf-already').value) || 0
  };
  if (editingIdx !== null) workers[editingIdx] = w; else workers.push(w);
  closeWModal(); renderWorkers();
}

/* ══════════════ KEYBOARD ══════════════ */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeQCustomerModal(); closeICustomerModal(); closeWModal();
  }
  if (e.key === 'Enter' && e.target.closest('td[contenteditable]')) {
    e.preventDefault();
    const td = e.target.closest('td'), tr = td.closest('tr');
    const idx = Array.from(tr.children).indexOf(td);
    const next = tr.nextElementSibling;
    if (next) { const cell = next.children[idx]; if (cell && cell.contentEditable==='true') cell.focus(); }
  }
});
