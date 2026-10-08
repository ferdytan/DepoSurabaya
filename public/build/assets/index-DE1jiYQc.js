import{r as m,K as He,j as e,L as Je,S as se,$ as Ue}from"./app-DKsMueke.js";import{A as Ye,X as re,D as Oe,c as Ve,d as qe,a as De}from"./app-layout-48jqDbb9.js";import{B as _}from"./button-B4o0DkSE.js";import{I as ne}from"./input-B6dv4J5G.js";import{L as $}from"./label-CFi9zRWZ.js";import{S as le,a as ie,b as oe,c as de,d as k}from"./select-BszVOv2X.js";import{T as We,a as Ge,b as ce,c as w,d as Qe,e as y}from"./table-Dgda-Pw1.js";import{C as Te}from"./checkbox-CEAfM5gb.js";import{D as Xe}from"./date-range-picker-CntMq6qB.js";import{C as Ze}from"./check-DJ51CznK.js";import{S as et}from"./shield-CPA5rO8-.js";import{F as pe}from"./filter-C0RWzddC.js";import{C as tt}from"./chevron-up-DTPYtRGt.js";import{C as $e}from"./chevron-down-DtrFP5Gg.js";import{P as Ce}from"./printer-DtF870cC.js";import{R as at}from"./rotate-ccw-B_730Dp9.js";import{A as st,a as rt,b as nt}from"./arrow-up-ChP_mSdn.js";import"./index-xkgr_Q-s.js";import"./Combination-D0gbfjG2.js";import"./index-CK-z1qPO.js";import"./index-K09xIItT.js";import"./app-logo-icon-Dh1prUXV.js";import"./index-CiyXGxRr.js";import"./chevron-left-B4ofEzKL.js";const Ie=["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];function xe(n){if(!n)return e.jsx("span",{className:"text-gray-400",children:"–"});const l=new Date(n);if(isNaN(l.getTime()))return e.jsx("span",{className:"text-gray-400",children:"–"});const x=String(l.getDate()).padStart(2,"0"),u=Ie[l.getMonth()],b=l.getFullYear(),a=String(l.getHours()).padStart(2,"0"),d=String(l.getMinutes()).padStart(2,"0");return e.jsxs("div",{className:"flex flex-col leading-tight whitespace-nowrap",children:[e.jsxs("span",{className:"font-semibold text-slate-800 text-xs",children:[x," ",u," ",b]}),e.jsxs("span",{className:"text-[11px] text-slate-500 font-normal",children:[a,":",d," WIB"]})]})}function me(n){if(!n)return"–";const l=new Date(n);if(isNaN(l.getTime()))return"–";const x=String(l.getDate()).padStart(2,"0"),u=Ie[l.getMonth()],b=l.getFullYear(),a=String(l.getHours()).padStart(2,"0"),d=String(l.getMinutes()).padStart(2,"0");return`${x} ${u} ${b}, ${a}:${d}`}function Ae(n,l){if(!n)return l||"-";const x=String(n).trim();return x.toLowerCase().endsWith("ft")?x:x==="20"||x==="40"?`${x}ft`:x||l||"-"}function Pe(n){if(!n)return"-";try{const l=new Date(n);if(isNaN(l.getTime()))return String(n);const x=String(l.getDate()).padStart(2,"0"),u=String(l.getMonth()+1).padStart(2,"0"),b=l.getFullYear(),a=String(l.getHours()).padStart(2,"0"),d=String(l.getMinutes()).padStart(2,"0");return`${x}-${u}-${b} / ${a}.${d}`}catch{return String(n)}}function lt(n){if(!n)return"-";const l=String(n).toLowerCase();return l.includes("20")?"20'":l.includes("40")?"40'":l.includes("45")?"45'":n}function J(n){return new Intl.NumberFormat("id-ID",{minimumFractionDigits:0,maximumFractionDigits:0}).format(n)}const it=[{title:"Dashboard",href:"/dashboard"},{title:"Karantina & Fumigasi",href:"/karantina"}];function Pt({orders:n,customers:l=[],shippers:x=[],products:u=[],filters:b}){var Ne,ve,Se;const a=b||{},[d,U]=m.useState(a.customer_id||"all"),[v,Y]=m.useState(a.shipper_id||"all"),[D,O]=m.useState(a.fumigator||""),[C,V]=m.useState(a.exclude_status||"active"),[h,B]=m.useState(a.date_from||""),[g,z]=m.useState(a.date_to||""),[A,q]=m.useState(a.date_type||"entry_date"),[P,W]=m.useState(a.search||""),[he,ge]=m.useState(String(a.per_page||25)),Le=Array.isArray(b==null?void 0:b.product_ids)?b.product_ids.map(Number).filter(t=>!isNaN(t)):[],[p,N]=m.useState(Le),[I,ue]=m.useState(""),[G,Fe]=m.useState(!0),[Q,be]=m.useState(!1);m.useEffect(()=>{U(a.customer_id||"all"),Y(a.shipper_id||"all"),O(a.fumigator||""),V(a.exclude_status||"active"),B(a.date_from||""),z(a.date_to||""),q(a.date_type||"entry_date"),W(a.search||""),ge(String(a.per_page||25));const t=Array.isArray(a.product_ids)?a.product_ids.map(Number).filter(s=>!isNaN(s)):[];N(t)},[a.customer_id,a.shipper_id,a.fumigator,a.exclude_status,a.date_from,a.date_to,a.date_type,a.search,a.per_page,a.product_ids]);const X=t=>{const s=(t==null?void 0:t.customer_id)!==void 0?t.customer_id:d,i=(t==null?void 0:t.shipper_id)!==void 0?t.shipper_id:v,o=(t==null?void 0:t.fumigator)!==void 0?t.fumigator:D,f=(t==null?void 0:t.product_ids)!==void 0?t.product_ids:p,_e=(t==null?void 0:t.exclude_status)!==void 0?t.exclude_status:C,j=(t==null?void 0:t.date_from)!==void 0?t.date_from:h,ee=(t==null?void 0:t.date_to)!==void 0?t.date_to:g,te=(t==null?void 0:t.date_type)!==void 0?t.date_type:A,L=(t==null?void 0:t.search)!==void 0?t.search:P,E=(t==null?void 0:t.per_page)!==void 0?t.per_page:he;se.get(route("index_karantina"),{customer_id:s==="all"?void 0:s,shipper_id:i==="all"?void 0:i,fumigator:o?o.trim():void 0,product_ids:f.length>0?f:void 0,exclude_status:_e,date_from:j||void 0,date_to:ee||void 0,date_type:te,search:L?L.trim():void 0,per_page:E,sort_by:a.sort_by||void 0,sort_dir:a.sort_dir||void 0,trashed:a.trashed||void 0},{preserveState:!0,preserveScroll:!0})},Be=()=>{U("all"),Y("all"),O(""),N([]),V("active"),B(""),z(""),q("entry_date"),W(""),ge("25"),se.get(route("index_karantina"),{},{preserveScroll:!0})},fe=t=>{t.key==="Enter"&&(t.preventDefault(),X())},Z=t=>{N(s=>s.includes(t)?s.filter(i=>i!==t):[...s,t])},S=u.filter(t=>t.service_type.toLowerCase().includes(I.toLowerCase())),ye=S.length>0&&S.every(t=>p.includes(t.id)),je=()=>{const t=S.map(s=>s.id);if(ye){const s=new Set(t);N(i=>i.filter(o=>!s.has(o)))}else N(s=>Array.from(new Set([...s,...t])))},we=async(t="A")=>{const s=window.open("","_blank");if(!s){alert("Gagal membuka jendela cetak. Pastikan izin popup browser diaktifkan.");return}const i=t==="B"?"Billing Statement B":"Billing Statement A";s.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Menyiapkan ${i}...</title>
                <style>
                    body {
                        font-family: 'Segoe UI', Arial, sans-serif;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        height: 70vh;
                        color: #334155;
                        margin: 0;
                    }
                    .spinner {
                        width: 36px;
                        height: 36px;
                        border: 3px solid #e2e8f0;
                        border-top-color: #0f172a;
                        border-radius: 50%;
                        animation: spin 0.8s linear infinite;
                        margin-bottom: 14px;
                    }
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                </style>
            </head>
            <body>
                <div class="spinner"></div>
                <div style="font-size: 15px; font-weight: 600;">Menyiapkan data ${i}...</div>
                <div style="font-size: 12px; color: #64748b; margin-top: 5px;">Total data: ${n.total??n.data.length} kontainer</div>
            </body>
            </html>
        `),s.document.close(),be(!0);try{const o=new URLSearchParams;d&&d!=="all"&&o.append("customer_id",d),v&&v!=="all"&&o.append("shipper_id",v),D&&o.append("fumigator",D),C&&o.append("exclude_status",C),h&&o.append("date_from",h),g&&o.append("date_to",g),A&&o.append("date_type",A),P&&o.append("search",P),a.trashed&&o.append("trashed",a.trashed),a.sort_by&&o.append("sort_by",a.sort_by),a.sort_dir&&o.append("sort_dir",a.sort_dir),p.length>0&&p.forEach(r=>o.append("product_ids[]",r.toString()));const f=await fetch(`/karantina/print-data?${o.toString()}`);if(!f.ok)throw new Error("Gagal mengambil data dari server");const j=(await f.json()).data||[];if(j.length===0){s.document.body.innerHTML=`
                    <div style="text-align: center; margin-top: 50px; font-family: Arial, sans-serif;">
                        <p style="color: #ef4444; font-weight: 600;">Tidak ada data yang sesuai filter untuk dicetak.</p>
                        <button onclick="window.close()" style="padding: 6px 14px; cursor: pointer; border-radius: 4px; border: 1px solid #ccc;">Tutup</button>
                    </div>
                `;return}const ee=h?new Date(h).toLocaleDateString("id-ID"):"Semua",te=g?new Date(g).toLocaleDateString("id-ID"):"Semua",L=`${ee} s/d ${te}`,E="/logo-dss.png",ze=new Date().toLocaleDateString("id-ID",{day:"numeric",month:"long",year:"numeric",hour:"2-digit",minute:"2-digit"});let K="-";if(d&&d!=="all"){const r=l.find(c=>String(c.id)===String(d));K=r?r.name:d}else{const r=Array.from(new Set(j.map(c=>c.customer_name).filter(Boolean)));r.length===1&&r[0]!=="-"?K=r[0]:r.length>1&&(K="Semua Customer")}const R=r=>{const c=new Date(r),H=String(c.getDate()).padStart(2,"0"),ae=String(c.getMonth()+1).padStart(2,"0"),F=String(c.getFullYear()).slice(-2);return`${H}/${ae}/${F}`},Me=h&&g?`${R(h)} - ${R(g)}`:h||g?`${h?R(h):""} - ${g?R(g):""}`:L,Ee=j.reduce((r,c)=>{const H=typeof c.total=="number"?c.total:(c.price||0)+Math.round((c.price||0)*.11);return r+H},0),Ke=t==="B"?`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Billing Statement B - PT. Depo Surabaya Sejahtera</title>
                <style>
                    @page {
                        size: A4 portrait;
                        margin: 12mm 10mm;
                    }
                    * {
                        box-sizing: border-box;
                        font-family: Arial, Helvetica, sans-serif;
                        color: #000;
                    }
                    body {
                        margin: 0;
                        padding: 4px;
                        font-size: 8.5pt;
                    }
                    .header-box {
                        display: flex;
                        align-items: center;
                        gap: 14px;
                        margin-bottom: 22px;
                    }
                    .header-logo {
                        width: 58px;
                        height: 58px;
                        object-fit: contain;
                    }
                    .header-company {
                        line-height: 1.35;
                    }
                    .company-name {
                        font-size: 11pt;
                        font-weight: 800;
                        color: #000;
                    }
                    .company-address {
                        font-size: 8.5pt;
                        color: #222;
                    }
                    .statement-title-section {
                        margin-bottom: 14px;
                    }
                    .statement-title {
                        font-size: 11pt;
                        font-weight: 800;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                        margin-bottom: 8px;
                    }
                    .meta-table {
                        border-collapse: collapse;
                        font-size: 8.5pt;
                    }
                    .meta-table td {
                        padding: 2px 0;
                        vertical-align: top;
                    }
                    .meta-label {
                        width: 75px;
                        font-weight: 700;
                    }
                    .meta-sep {
                        width: 14px;
                        text-align: center;
                        font-weight: 700;
                    }
                    .meta-value {
                        font-weight: 700;
                    }
                    table.b-table {
                        width: 100%;
                        border-collapse: collapse;
                        font-size: 8.5pt;
                        border: 1px solid #000;
                    }
                    table.b-table th {
                        border: 1px solid #000;
                        padding: 5px 4px;
                        font-weight: 700;
                        text-align: center;
                        background-color: #fff;
                        vertical-align: middle;
                    }
                    table.b-table td {
                        border-left: 1px solid #000;
                        border-right: 1px solid #000;
                        padding: 5px 4px;
                        vertical-align: middle;
                    }
                    .row-dashed td {
                        border-bottom: 1px dashed #000;
                    }
                    .row-solid-bottom td {
                        border-bottom: 1px solid #000;
                    }
                    .text-center { text-align: center; }
                    .currency-cell {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 0 4px;
                        font-variant-numeric: tabular-nums;
                    }
                    .grand-total-row td {
                        border: none;
                        padding: 0;
                    }
                    .grand-total-cell {
                        border: 2px solid #000 !important;
                        padding: 5px 4px !important;
                        font-weight: 800 !important;
                        background-color: #fff;
                    }
                    @media print {
                        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                    }
                </style>
            </head>
            <body>
                <div class="header-box">
                    <img src="${E}" alt="DSS Logo" class="header-logo" onerror="this.onerror=null;this.src='/logo.png'">
                    <div class="header-company">
                        <div class="company-name">PT. DEPO SURABAYA SEJAHTERA</div>
                        <div class="company-address">Tanjung Sadari No. 90</div>
                        <div class="company-address">Surabaya</div>
                        <div class="company-address">Jawa Timur - Indonesia</div>
                    </div>
                </div>

                <div class="statement-title-section">
                    <div class="statement-title">BILLING STATEMENT</div>
                    <table class="meta-table">
                        <tr>
                            <td class="meta-label">Customer</td>
                            <td class="meta-sep">:</td>
                            <td class="meta-value">${K}</td>
                        </tr>
                        <tr>
                            <td class="meta-label">Periode</td>
                            <td class="meta-sep">:</td>
                            <td class="meta-value">${Me}</td>
                        </tr>
                    </table>
                </div>

                <table class="b-table">
                    <thead>
                        <tr>
                            <th rowspan="2" style="width: 32px;">No.</th>
                            <th rowspan="2" style="width: 140px;">No. Container</th>
                            <th rowspan="2" style="width: 125px;">Shipper</th>
                            <th colspan="2">Date / Time</th>
                            <th rowspan="2" style="width: 55px;">Ukuran</th>
                            <th rowspan="2" style="width: 85px;">Jasa</th>
                            <th rowspan="2" style="width: 110px;">Price</th>
                            <th rowspan="2" style="width: 100px;">PPN 11 %</th>
                            <th rowspan="2" style="width: 110px;">Total</th>
                        </tr>
                        <tr>
                            <th style="width: 130px;">In</th>
                            <th style="width: 130px;">Out</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${j.map((r,c)=>{const ae=c===j.length-1?"row-solid-bottom":"row-dashed",F=typeof r.price=="number"?r.price:0,ke=typeof r.ppn=="number"?r.ppn:Math.round(F*.11),Re=typeof r.total=="number"?r.total:F+ke;return`
                            <tr class="${ae}">
                                <td class="text-center">${c+1}</td>
                                <td class="text-center" style="font-weight: 700;">${r.container_number}</td>
                                <td class="text-center">${r.shipper_name??"-"}</td>
                                <td class="text-center">${Pe(r.entry_date)}</td>
                                <td class="text-center">${Pe(r.exit_date)}</td>
                                <td class="text-center">${lt(r.price_type)}</td>
                                <td class="text-center">${r.service_type??r.fumigasi??"Fumigasi"}</td>
                                <td>
                                    <div class="currency-cell">
                                        <span>Rp</span>
                                        <span>${J(F)}</span>
                                    </div>
                                </td>
                                <td>
                                    <div class="currency-cell">
                                        <span>Rp</span>
                                        <span>${J(ke)}</span>
                                    </div>
                                </td>
                                <td>
                                    <div class="currency-cell">
                                        <span>Rp</span>
                                        <span>${J(Re)}</span>
                                    </div>
                                </td>
                            </tr>
                            `}).join("")}
                        <tr class="grand-total-row">
                            <td colspan="9" style="border: none; background: transparent;"></td>
                            <td class="grand-total-cell">
                                <div class="currency-cell" style="font-weight: 800;">
                                    <span>Rp</span>
                                    <span>${J(Ee)}</span>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </body>
            </html>
            `:`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>${i} - PT. Depo Surabaya Sejahtera</title>
                <style>
                    @page {
                        size: A4 landscape;
                        margin: 10mm;
                    }
                    * {
                        box-sizing: border-box;
                        font-family: Arial, Helvetica, sans-serif;
                        color: #111;
                    }
                    body {
                        margin: 0;
                        padding: 10px;
                        font-size: 11px;
                    }
                    .header-table {
                        width: 100%;
                        border-bottom: 2px solid #000;
                        padding-bottom: 8px;
                        margin-bottom: 12px;
                    }
                    .company-name {
                        font-size: 16pt;
                        font-weight: 800;
                        margin-bottom: 2px;
                    }
                    .company-address {
                        font-size: 9pt;
                        color: #444;
                    }
                    .report-title {
                        text-align: right;
                        font-size: 16pt;
                        font-weight: 900;
                        color: #0f172a;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                    }
                    .filter-info {
                        display: flex;
                        justify-content: space-between;
                        font-size: 9pt;
                        background: #f8fafc;
                        border: 1px solid #e2e8f0;
                        padding: 8px 12px;
                        border-radius: 4px;
                        margin-bottom: 12px;
                    }
                    table.data-table {
                        width: 100%;
                        border-collapse: collapse;
                        font-size: 9pt;
                    }
                    table.data-table th, table.data-table td {
                        border: 1px solid #333;
                        padding: 6px 8px;
                        vertical-align: middle;
                    }
                    table.data-table th {
                        background-color: #f1f5f9;
                        font-weight: 700;
                        text-align: left;
                    }
                    .text-center { text-align: center; }
                    .text-gray-400 { color: #94a3b8; }
                    @media print {
                        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                    }
                </style>
            </head>
            <body>
                <table class="header-table">
                    <tr>
                        <td style="width: 70px; vertical-align: middle;">
                            <img src="${E}" alt="Logo" style="width: 55px; height: 55px; object-fit: contain;" onerror="this.onerror=null;this.src='/logo.png'">
                        </td>
                        <td style="vertical-align: middle;">
                            <div class="company-name">PT. DEPO SURABAYA SEJAHTERA</div>
                            <div class="company-address">
                                Jl. Tanjung Sadari No. 90 (Tanjung Batu No. 1) | Telp. 031-353 9484, 031-3539485 | Fax. 031-3539482
                            </div>
                        </td>
                        <td style="text-align: right; vertical-align: middle;">
                            <div class="report-title">${i}</div>
                            <div style="font-size: 10pt; color: #475569; font-weight: 600;">Layanan Karantina & Fumigasi</div>
                        </td>
                    </tr>
                </table>

                <div class="filter-info">
                    <div>
                        <strong>Periode:</strong> ${L} &nbsp;|&nbsp;
                        <strong>Total:</strong> ${j.length} Kontainer
                    </div>
                    <div>
                        <strong>Dicetak pada:</strong> ${ze} WIB
                    </div>
                </div>

                <table class="data-table">
                    <thead>
                        <tr>
                            <th style="width: 30px; text-align: center;">No</th>
                            <th>Nomor Kontainer</th>
                            <th>Nama Shipper</th>
                            <th style="text-align: center; width: 60px;">Size</th>
                            <th>Tanggal Masuk</th>
                            <th>Tanggal EIR</th>
                            <th>Tanggal Keluar</th>
                            <th>Komoditi</th>
                            <th>Negara Tujuan</th>
                            <th>Fumigator</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${j.map((r,c)=>`
                            <tr>
                                <td class="text-center">${c+1}</td>
                                <td style="font-weight: 700; font-family: monospace;">${r.container_number}</td>
                                <td>${r.shipper_name??"-"}</td>
                                <td class="text-center">${Ae(r.price_type)}</td>
                                <td>${r.entry_date?me(r.entry_date):'<span class="text-gray-400">–</span>'}</td>
                                <td>${r.eir_date?me(r.eir_date):'<span class="text-gray-400">–</span>'}</td>
                                <td>${r.exit_date?me(r.exit_date):'<span class="text-gray-400">–</span>'}</td>
                                <td>${r.commodity??"-"}</td>
                                <td>${r.country??"-"}</td>
                                <td>${r.fumigasi??'<span class="text-gray-400">–</span>'}</td>
                            </tr>
                        `).join("")}
                    </tbody>
                </table>
            </body>
            </html>
            `;s.document.open(),s.document.write(Ke),s.document.close(),setTimeout(()=>{s.focus(),s.print()},300)}catch(o){console.error("Error saat mencetak billing statement:",o),s.document.body.innerHTML=`
                <div style="text-align: center; margin-top: 50px; font-family: Arial, sans-serif;">
                    <p style="color: #ef4444; font-weight: 600;">Terjadi kesalahan saat memuat seluruh data kontainer.</p>
                    <button onclick="window.close()" style="padding: 6px 14px; cursor: pointer; border-radius: 4px; border: 1px solid #ccc;">Tutup</button>
                </div>
            `}finally{be(!1)}},T=({label:t,field:s,currentSort:i,currentDir:o})=>{const f=i===s&&o==="asc"?"desc":"asc";return e.jsxs(Ue,{href:route("index_karantina",{customer_id:d==="all"?void 0:d,shipper_id:v==="all"?void 0:v,fumigator:D?D.trim():void 0,exclude_status:C,date_from:h||void 0,date_to:g||void 0,date_type:A,product_ids:p.length>0?p:void 0,search:P||void 0,per_page:he,sort_by:s,sort_dir:f}),preserveState:!0,preserveScroll:!0,className:"inline-flex items-center gap-1 font-semibold text-slate-700 hover:text-black transition-colors",children:[e.jsx("span",{children:t}),i===s?f==="asc"?e.jsx(st,{className:"h-3.5 w-3.5 text-blue-600"}):e.jsx(rt,{className:"h-3.5 w-3.5 text-blue-600"}):e.jsx(nt,{className:"h-3.5 w-3.5 text-gray-400 opacity-60 hover:opacity-100"})]})},{props:M}=He();return e.jsxs(Ye,{breadcrumbs:it,children:[e.jsx(Je,{title:"Karantina & Fumigasi - Depo Surabaya"}),e.jsxs("div",{className:"w-full space-y-6 px-4 py-6 sm:px-6 lg:px-8 bg-slate-50/50 min-h-screen",children:[((Ne=M.flash)==null?void 0:Ne.success)&&e.jsxs("div",{className:"flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-800 shadow-2xs",children:[e.jsx(Ze,{className:"h-4 w-4 text-emerald-600 shrink-0"}),e.jsx("span",{children:M.flash.success})]}),((ve=M.flash)==null?void 0:ve.error)&&e.jsxs("div",{className:"flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-800 shadow-2xs",children:[e.jsx(re,{className:"h-4 w-4 text-rose-600 shrink-0"}),e.jsx("span",{children:M.flash.error})]}),e.jsxs("div",{className:"flex flex-col sm:flex-row sm:items-center justify-between gap-4",children:[e.jsxs("div",{children:[e.jsxs("div",{className:"flex items-center gap-2.5",children:[e.jsx(et,{className:"h-7 w-7 text-gray-900"}),e.jsx("h1",{className:"text-2xl font-bold tracking-tight text-gray-900",children:"Karantina & Fumigasi"}),e.jsx("span",{className:"inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700 border border-slate-200",children:"Billing & Monitoring"})]}),e.jsx("p",{className:"text-xs text-gray-500 mt-1",children:"Kelola data pergerakan kontainer karantina, filter multi-parameter, dan cetak billing statement resmi."})]}),e.jsxs("div",{className:"flex flex-wrap items-center gap-2",children:[e.jsxs(_,{variant:"outline",size:"sm",onClick:()=>Fe(!G),className:"gap-1.5 h-9 text-xs border-gray-300 bg-white shadow-2xs",children:[e.jsx(pe,{className:"h-3.5 w-3.5 text-blue-600"}),e.jsx("span",{children:"Filter"}),G?e.jsx(tt,{className:"h-3.5 w-3.5 text-gray-500"}):e.jsx($e,{className:"h-3.5 w-3.5 text-gray-500"})]}),e.jsxs(_,{type:"button",size:"sm",disabled:Q,onClick:()=>we("A"),className:"bg-gray-900 hover:bg-black text-white font-semibold text-xs h-9 px-3.5 gap-1.5 shadow-2xs disabled:opacity-70",title:"Cetak Billing Statement Format A",children:[e.jsx(Ce,{className:`h-3.5 w-3.5 ${Q?"animate-spin":""}`}),e.jsx("span",{children:"Billing Statement A"})]}),e.jsxs(_,{type:"button",size:"sm",disabled:Q,onClick:()=>we("B"),variant:"outline",className:"border-gray-300 text-gray-800 bg-white hover:bg-gray-50 font-semibold text-xs h-9 px-3.5 gap-1.5 shadow-2xs",title:"Cetak Billing Statement Format B",children:[e.jsx(Ce,{className:"h-3.5 w-3.5 text-gray-600"}),e.jsx("span",{children:"Billing Statement B"})]})]})]}),G&&e.jsxs("div",{className:"rounded-xl border border-gray-200 bg-white p-5 shadow-xs space-y-4",children:[e.jsxs("div",{className:"flex items-center justify-between border-b border-gray-100 pb-3",children:[e.jsxs("span",{className:"text-sm font-bold text-gray-800 flex items-center gap-2",children:[e.jsx(pe,{className:"h-4 w-4 text-blue-600"}),"Parameter Filter"]}),e.jsxs(_,{variant:"ghost",size:"sm",onClick:Be,className:"text-xs text-gray-500 hover:text-rose-600 gap-1.5 h-8 px-2",children:[e.jsx(at,{className:"h-3.5 w-3.5"}),e.jsx("span",{children:"Reset Filter"})]})]}),e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4",children:[e.jsxs("div",{className:"space-y-1.5",children:[e.jsx($,{className:"text-xs font-semibold text-gray-700",children:"Customer"}),e.jsxs(le,{value:d,onValueChange:U,children:[e.jsx(ie,{className:"w-full text-xs h-9 bg-white border-gray-200",children:e.jsx(oe,{placeholder:"Semua Customer"})}),e.jsxs(de,{children:[e.jsx(k,{value:"all",children:"Semua Customer"}),l.map(t=>e.jsx(k,{value:String(t.id),children:t.name},t.id))]})]})]}),e.jsxs("div",{className:"space-y-1.5",children:[e.jsx($,{className:"text-xs font-semibold text-gray-700",children:"Shipper"}),e.jsxs(le,{value:v,onValueChange:Y,children:[e.jsx(ie,{className:"w-full text-xs h-9 bg-white border-gray-200",children:e.jsx(oe,{placeholder:"Semua Shipper"})}),e.jsxs(de,{children:[e.jsx(k,{value:"all",children:"Semua Shipper"}),x.map(t=>e.jsx(k,{value:String(t.id),children:t.name},t.id))]})]})]}),e.jsxs("div",{className:"space-y-1.5",children:[e.jsx($,{className:"text-xs font-semibold text-gray-700",children:"Fumigator"}),e.jsx(ne,{type:"text",value:D,onChange:t=>O(t.target.value),onKeyDown:fe,placeholder:"Ketik nama fumigator...",className:"text-xs h-9 bg-white border-gray-200"})]}),e.jsxs("div",{className:"space-y-1.5",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx($,{className:"text-xs font-semibold text-gray-700",children:"Jenis Layanan"}),p.length>0&&e.jsxs("span",{className:"text-[10px] text-blue-600 font-bold bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200",children:[p.length," dipilih"]})]}),e.jsxs(Oe,{children:[e.jsx(Ve,{asChild:!0,children:e.jsxs(_,{variant:"outline",type:"button",className:"w-full justify-between border-gray-200 bg-white text-xs font-normal text-gray-800 shadow-2xs hover:bg-gray-50 h-9",children:[e.jsx("span",{className:"truncate",children:p.length===0?"Semua Layanan":p.length===1?((Se=u.find(t=>t.id===p[0]))==null?void 0:Se.service_type)||"1 Layanan":`${p.length} Layanan Dipilih`}),e.jsx($e,{className:"ml-1.5 h-3.5 w-3.5 shrink-0 opacity-50"})]})}),e.jsxs(qe,{className:"w-80 p-2 shadow-lg",align:"start",children:[e.jsxs("div",{className:"flex items-center justify-between px-2 py-1.5 border-b border-gray-100 mb-2",children:[e.jsx("span",{className:"text-xs font-semibold text-gray-700",children:"Pilih Layanan"}),e.jsxs("div",{className:"flex gap-2 text-[11px]",children:[e.jsxs("button",{type:"button",onClick:t=>{t.preventDefault(),N(u.map(s=>s.id))},className:"text-blue-600 hover:underline font-medium",children:["Semua (",u.length,")"]}),e.jsx("span",{className:"text-gray-300",children:"|"}),e.jsx("button",{type:"button",onClick:t=>{t.preventDefault(),N([])},className:"text-gray-500 hover:underline",children:"Reset"})]})]}),e.jsxs("div",{className:"relative mb-2 px-1",children:[e.jsx(De,{className:"absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400"}),e.jsx(ne,{type:"text",placeholder:"Cari layanan...",value:I,onChange:t=>ue(t.target.value),onKeyDown:t=>t.stopPropagation(),className:"h-8 pl-8 pr-7 text-xs rounded-md border-gray-200"}),I&&e.jsx("button",{type:"button",onClick:()=>ue(""),className:"absolute right-3 top-2 text-gray-400 hover:text-gray-600",children:e.jsx(re,{className:"h-3.5 w-3.5"})})]}),S.length>0&&e.jsxs("div",{onClick:t=>{t.preventDefault(),je()},className:"flex items-center gap-2 px-2 py-1.5 mb-1.5 rounded bg-slate-50 hover:bg-slate-100 cursor-pointer text-xs font-medium text-slate-700 border border-slate-200 transition-colors",children:[e.jsx(Te,{checked:ye,onCheckedChange:je,className:"h-3.5 w-3.5"}),e.jsx("span",{className:"truncate text-xs",children:I?`Centang Semua ("${I}")`:`Centang Semua (${S.length})`})]}),e.jsx("div",{className:"space-y-0.5 max-h-56 overflow-y-auto",children:S.length===0?e.jsx("div",{className:"py-4 text-center text-xs text-gray-400",children:"Tidak ada layanan cocok"}):S.map(t=>{const s=p.includes(t.id);return e.jsxs("div",{onClick:i=>{i.preventDefault(),Z(t.id)},className:`flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer text-xs transition-colors ${s?"bg-blue-50 text-blue-900 font-medium":"hover:bg-gray-100 text-gray-700"}`,children:[e.jsx(Te,{checked:s,onCheckedChange:()=>Z(t.id),className:"h-3.5 w-3.5"}),e.jsx("span",{className:"truncate",children:t.service_type})]},t.id)})})]})]})]})]}),e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1",children:[e.jsxs("div",{className:"space-y-1.5",children:[e.jsx($,{className:"text-xs font-semibold text-gray-700",children:"Status Exclude"}),e.jsxs(le,{value:C,onValueChange:V,children:[e.jsx(ie,{className:"w-full text-xs h-9 bg-white border-gray-200",children:e.jsx(oe,{})}),e.jsxs(de,{children:[e.jsx(k,{value:"active",children:"Hanya yang Diikutsertakan (Default)"}),e.jsx(k,{value:"all",children:"Semua (Termasuk yang di-exclude)"}),e.jsx(k,{value:"excluded",children:"Hanya yang Di-exclude"})]})]})]}),e.jsxs("div",{className:"space-y-1.5 sm:col-span-2 lg:col-span-3",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx($,{className:"text-xs font-semibold text-gray-700",children:"Rentang Tanggal"}),e.jsxs("div",{className:"flex items-center gap-1.5",children:[e.jsx("span",{className:"text-[11px] text-gray-500",children:"Berdasarkan:"}),e.jsxs("select",{value:A,onChange:t=>q(t.target.value),className:"text-[11px] font-semibold text-blue-600 bg-blue-50 border border-blue-200 rounded px-1.5 py-0.5 cursor-pointer focus:ring-0",children:[e.jsx("option",{value:"entry_date",children:"Tgl Masuk"}),e.jsx("option",{value:"eir_date",children:"Tgl EIR"}),e.jsx("option",{value:"exit_date",children:"Tgl Keluar"})]})]})]}),e.jsx(Xe,{startDate:h,endDate:g,onChange:({startDate:t,endDate:s})=>{B(t),z(s)},onApply:({startDate:t,endDate:s})=>{B(t),z(s),X({date_from:t,date_to:s})},placeholder:"Semua rentang tanggal...",className:"w-full",align:"right"})]})]}),p.length>0&&e.jsxs("div",{className:"flex flex-wrap items-center gap-1.5 border-t border-gray-100 pt-2.5",children:[e.jsx("span",{className:"text-[11px] text-gray-500 font-medium",children:"Layanan Terpilih:"}),p.map(t=>{const s=u.find(i=>i.id===t);return s?e.jsxs("span",{className:"inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 border border-blue-200",children:[s.service_type,e.jsx("button",{type:"button",onClick:()=>Z(t),className:"hover:text-blue-900 focus:outline-none",children:e.jsx(re,{className:"h-3 w-3"})})]},t):null}),e.jsx("button",{type:"button",onClick:()=>N([]),className:"text-[11px] text-gray-500 hover:text-rose-600 underline ml-1",children:"Hapus Semua"})]}),e.jsxs("div",{className:"flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-gray-100",children:[e.jsxs("div",{className:"relative w-full sm:max-w-md",children:[e.jsx(De,{className:"absolute left-3 top-2.5 h-4 w-4 text-gray-400"}),e.jsx(ne,{type:"text",placeholder:"Cari nomor kontainer, customer, shipper, atau komoditi... (Tekan Enter)",value:P,onChange:t=>W(t.target.value),onKeyDown:fe,className:"pl-9 text-xs h-9 bg-white border-gray-200"})]}),e.jsx("div",{className:"flex items-center gap-2 w-full sm:w-auto justify-end",children:e.jsx(_,{size:"sm",onClick:()=>X(),className:"bg-gray-900 hover:bg-black text-white font-semibold text-xs h-9 px-5 shadow-2xs",children:"Terapkan Filter"})})]})]}),e.jsxs("div",{className:"rounded-xl border border-gray-200 bg-white shadow-xs p-5 space-y-4",children:[e.jsx("div",{className:"flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3",children:e.jsxs("div",{children:[e.jsx("h2",{className:"text-base font-bold text-gray-900",children:"Daftar Kontainer Karantina & Fumigasi"}),e.jsxs("p",{className:"text-xs text-gray-500 mt-0.5",children:["Menampilkan total ",e.jsx("span",{className:"font-bold text-gray-800",children:n.total??n.data.length})," kontainer sesuai kriteria filter aktif."]})]})}),e.jsx("div",{className:"overflow-x-auto rounded-lg border border-gray-200",children:e.jsxs(We,{children:[e.jsx(Ge,{className:"bg-slate-50 text-xs font-semibold text-slate-700 border-b border-gray-200",children:e.jsxs(ce,{className:"hover:bg-transparent",children:[e.jsx(w,{className:"px-4 py-3.5 whitespace-nowrap",children:e.jsx(T,{label:"Nomor Kontainer",field:"container_number",currentSort:a.sort_by,currentDir:a.sort_dir})}),e.jsx(w,{className:"px-4 py-3.5 whitespace-nowrap",children:e.jsx(T,{label:"Nama Shipper",field:"shippers.name",currentSort:a.sort_by,currentDir:a.sort_dir})}),e.jsx(w,{className:"px-4 py-3.5 text-center whitespace-nowrap",children:"Size"}),e.jsx(w,{className:"px-4 py-3.5 whitespace-nowrap",children:e.jsx(T,{label:"Tanggal Masuk",field:"entry_date",currentSort:a.sort_by,currentDir:a.sort_dir})}),e.jsx(w,{className:"px-4 py-3.5 whitespace-nowrap",children:e.jsx(T,{label:"Tanggal EIR",field:"eir_date",currentSort:a.sort_by,currentDir:a.sort_dir})}),e.jsx(w,{className:"px-4 py-3.5 whitespace-nowrap",children:e.jsx(T,{label:"Tanggal Keluar",field:"exit_date",currentSort:a.sort_by,currentDir:a.sort_dir})}),e.jsx(w,{className:"px-4 py-3.5 whitespace-nowrap",children:"Komoditi"}),e.jsx(w,{className:"px-4 py-3.5 whitespace-nowrap",children:"Negara Tujuan"}),e.jsx(w,{className:"px-4 py-3.5 whitespace-nowrap",children:e.jsx(T,{label:"Fumigator",field:"fumigasi",currentSort:a.sort_by,currentDir:a.sort_dir})})]})}),e.jsx(Qe,{className:"divide-y divide-gray-100 bg-white",children:n.data.length===0?e.jsx(ce,{children:e.jsx(y,{colSpan:9,className:"py-12 text-center text-sm text-gray-500",children:e.jsxs("div",{className:"flex flex-col items-center justify-center gap-1.5",children:[e.jsx(pe,{className:"h-6 w-6 text-gray-300"}),e.jsx("span",{className:"font-semibold text-gray-700",children:"Tidak ada data kontainer yang sesuai filter."}),e.jsx("span",{className:"text-xs text-gray-400",children:"Silakan ubah parameter filter atau klik Reset Filter."})]})})}):n.data.map(t=>{var s,i,o,f;return e.jsxs(ce,{className:"hover:bg-slate-50/70 transition-colors",children:[e.jsx(y,{className:"px-4 py-3 text-sm font-bold text-slate-900 font-mono",children:t.container_number}),e.jsx(y,{className:"px-4 py-3 text-sm text-slate-800",children:((i=(s=t.order)==null?void 0:s.shipper)==null?void 0:i.name)??t.shipper_name??"-"}),e.jsx(y,{className:"px-4 py-3 text-sm text-center",children:e.jsx("span",{className:"inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200",children:Ae(t.price_type)})}),e.jsx(y,{className:"px-4 py-3 text-sm",children:xe(t.entry_date)}),e.jsx(y,{className:"px-4 py-3 text-sm",children:xe(t.eir_date)}),e.jsx(y,{className:"px-4 py-3 text-sm",children:xe(t.exit_date)}),e.jsx(y,{className:"px-4 py-3 text-sm text-slate-800",children:t.commodity??"-"}),e.jsx(y,{className:"px-4 py-3 text-sm text-slate-800",children:t.country??"-"}),e.jsx(y,{className:"px-4 py-3 text-sm",children:((o=t.order)==null?void 0:o.fumigasi)??t.fumigasi?e.jsx("span",{className:"inline-flex items-center rounded-md bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800 border border-amber-200",children:((f=t.order)==null?void 0:f.fumigasi)??t.fumigasi}):e.jsx("span",{className:"text-gray-400",children:"–"})})]},t.id)})})]})}),e.jsxs("div",{className:"flex flex-col sm:flex-row items-center justify-between gap-3 pt-2",children:[e.jsxs("p",{className:"text-xs text-gray-500",children:["Menampilkan ",e.jsx("span",{className:"font-semibold text-gray-800",children:n.from??0})," sampai"," ",e.jsx("span",{className:"font-semibold text-gray-800",children:n.to??0})," dari"," ",e.jsx("span",{className:"font-semibold text-gray-800",children:n.total??n.data.length})," kontainer"]}),e.jsx("div",{className:"flex flex-wrap justify-center gap-1",children:n.links.map((t,s)=>t.url?e.jsx(_,{variant:t.active?"default":"outline",disabled:!t.url,onClick:()=>se.get(t.url,{},{preserveState:!0,preserveScroll:!0}),className:`px-3 py-1 text-xs font-medium h-8 ${t.active?"bg-gray-900 text-white hover:bg-black":"text-gray-700 bg-white border-gray-200"}`,children:t.label.replace(/&laquo; Previous|Next &raquo;/,i=>i.includes("Previous")?"← Prev":i.includes("Next")?"Next →":i)},s):e.jsx("span",{className:"px-2.5 py-1 text-xs text-gray-400",children:"..."},s))})]})]})]})]})}export{Pt as default};
