import{r as p,K as it,j as e,L as ot,$ as Fe,S as Q}from"./app-DZsTgAxc.js";import{A as dt,a as ct}from"./app-layout-6K9zfsu5.js";import{B as _}from"./button-Dz2-nK9T.js";import{I as me}from"./input-CgxrOr4E.js";import{L as I}from"./label-Bx8AURPk.js";import{S as pt,a as xt,b as mt,c as ht,d as he}from"./select-DEwpMQkF.js";import{S as ze}from"./searchable-select-CIf3MTzS.js";import{T as ut,a as gt,b as ue,c as j,d as ft,e as b}from"./table-CzUPA18C.js";import{C as Ke}from"./checkbox-CS9yCvjO.js";import{X as ge,D as Ee,b as Re,c as He,d as Ue,S as Je,e as bt}from"./global-container-search-BwWMC0cy.js";import{t as yt}from"./terbilang-DIgi2L4g.js";import{D as wt}from"./date-range-picker-lo0SZnFp.js";import{C as Oe}from"./check-CC-9GDlZ.js";import{F as fe}from"./filter-DtiEdC38.js";import{C as jt}from"./chevron-up-938CvRf2.js";import{C as be}from"./chevron-down-CDeegOTs.js";import{P as X}from"./printer-CYeVYyu5.js";import{R as vt}from"./rotate-ccw-CcQQR8z2.js";import{S as Nt}from"./sparkles-DGNfRt6e.js";import{A as St,a as _t,b as kt}from"./arrow-up-lC7aDYdq.js";/* empty css            */import"./index-B_RdEvlN.js";import"./index-HbQTC_oZ.js";import"./Combination-Bnjz1AtN.js";import"./index-BJrjyUR-.js";import"./truck-BXoSD-LL.js";import"./index-CPVN73lB.js";import"./app-logo-icon-CccBPood.js";import"./chevron-left-DIoUFevD.js";const We=["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];function ye(n){if(!n)return e.jsx("span",{className:"text-gray-400",children:"–"});const l=new Date(n);if(isNaN(l.getTime()))return e.jsx("span",{className:"text-gray-400",children:"–"});const h=String(l.getDate()).padStart(2,"0"),u=We[l.getMonth()],y=l.getFullYear(),a=String(l.getHours()).padStart(2,"0"),x=String(l.getMinutes()).padStart(2,"0");return e.jsxs("div",{className:"flex flex-col leading-tight whitespace-nowrap",children:[e.jsxs("span",{className:"font-semibold text-slate-800 text-xs",children:[h," ",u," ",y]}),e.jsxs("span",{className:"text-[11px] text-slate-500 font-normal",children:[a,":",x," WIB"]})]})}function Ve(n){if(!n)return"–";const l=new Date(n);if(isNaN(l.getTime()))return"–";const h=String(l.getDate()).padStart(2,"0"),u=We[l.getMonth()],y=l.getFullYear(),a=String(l.getHours()).padStart(2,"0"),x=String(l.getMinutes()).padStart(2,"0");return`${h} ${u} ${y}, ${a}:${x}`}function Ye(n,l){if(!n)return l||"-";const h=String(n).trim();return h.toLowerCase().endsWith("ft")?h:h==="20"||h==="40"?`${h}ft`:h||l||"-"}function Z(n){if(!n)return"-";try{const l=new Date(n);if(isNaN(l.getTime()))return String(n);const h=String(l.getDate()).padStart(2,"0"),u=String(l.getMonth()+1).padStart(2,"0"),y=l.getFullYear(),a=String(l.getHours()).padStart(2,"0"),x=String(l.getMinutes()).padStart(2,"0");return`${h}-${u}-${y} / ${a}.${x}`}catch{return String(n)}}function Ge(n){if(!n)return"-";const l=String(n).toLowerCase();return l.includes("20")?"20'":l.includes("40")?"40'":l.includes("45")?"45'":n}function N(n){return new Intl.NumberFormat("id-ID",{minimumFractionDigits:0,maximumFractionDigits:0}).format(n)}const Dt=[{title:"Dashboard",href:"/dashboard"},{title:"Karantina & Fumigasi",href:"/karantina"}];function sa({orders:n,customers:l=[],shippers:h=[],products:u=[],filters:y}){var Te,Pe,Ae;const a=y||{},[x,ee]=p.useState(a.customer_id||"all"),[k,te]=p.useState(a.shipper_id||"all"),[C,ae]=p.useState(a.fumigator||""),[M,se]=p.useState(a.exclude_status||"active"),[g,V]=p.useState(a.date_from||""),[f,Y]=p.useState(a.date_to||""),[B,re]=p.useState(a.date_type||"entry_date"),[F,ne]=p.useState(a.search||""),[we,je]=p.useState(String(a.per_page||25)),qe=Array.isArray(y==null?void 0:y.product_ids)?y.product_ids.map(Number).filter(t=>!isNaN(t)):[],[c,v]=p.useState(qe),[z,ve]=p.useState(""),[le,Qe]=p.useState(!0),[ie,Ne]=p.useState(!1),Xe=p.useMemo(()=>[{value:"all",label:"Semua Customer"},...l.map(t=>({value:String(t.id),label:t.name}))],[l]),Ze=p.useMemo(()=>[{value:"all",label:"Semua Shipper"},...h.map(t=>({value:String(t.id),label:t.name}))],[h]);p.useEffect(()=>{ee(a.customer_id||"all"),te(a.shipper_id||"all"),ae(a.fumigator||""),se(a.exclude_status||"active"),V(a.date_from||""),Y(a.date_to||""),re(a.date_type||"entry_date"),ne(a.search||""),je(String(a.per_page||25));const t=Array.isArray(a.product_ids)?a.product_ids.map(Number).filter(r=>!isNaN(r)):[];v(t)},[a.customer_id,a.shipper_id,a.fumigator,a.exclude_status,a.date_from,a.date_to,a.date_type,a.search,a.per_page,a.product_ids]);const oe=t=>{const r=(t==null?void 0:t.customer_id)!==void 0?t.customer_id:x,i=(t==null?void 0:t.shipper_id)!==void 0?t.shipper_id:k,o=(t==null?void 0:t.fumigator)!==void 0?t.fumigator:C,w=(t==null?void 0:t.product_ids)!==void 0?t.product_ids:c,K=(t==null?void 0:t.exclude_status)!==void 0?t.exclude_status:M,m=(t==null?void 0:t.date_from)!==void 0?t.date_from:g,A=(t==null?void 0:t.date_to)!==void 0?t.date_to:f,L=(t==null?void 0:t.date_type)!==void 0?t.date_type:B,E=(t==null?void 0:t.search)!==void 0?t.search:F,R=(t==null?void 0:t.per_page)!==void 0?t.per_page:we;Q.get(route("index_karantina"),{customer_id:r==="all"?void 0:r,shipper_id:i==="all"?void 0:i,fumigator:o?o.trim():void 0,product_ids:w.length>0?w:void 0,exclude_status:K,date_from:m||void 0,date_to:A||void 0,date_type:L,search:E?E.trim():void 0,per_page:R,sort_by:a.sort_by||void 0,sort_dir:a.sort_dir||void 0,trashed:a.trashed||void 0},{preserveState:!0,preserveScroll:!0})},[Se,_e]=p.useState(!1),et=()=>{_e(!0),Q.post(route("karantina.save_default_products"),{product_ids:c},{preserveScroll:!0,onFinish:()=>_e(!1)})},tt=()=>{ee("all"),te("all"),ae(""),v(a.default_product_ids||[]),se("active"),V(""),Y(""),re("entry_date"),ne(""),je("25"),Q.get(route("index_karantina"),{},{preserveScroll:!0})},ke=t=>{t.key==="Enter"&&(t.preventDefault(),oe())},T=p.useMemo(()=>(a.default_product_ids||[]).map(Number).filter(t=>!isNaN(t)),[a.default_product_ids]),P=p.useMemo(()=>{if(c.length!==T.length)return!1;const t=new Set(c);return T.every(r=>t.has(r))},[c,T]),De=p.useMemo(()=>u.filter(t=>{const r=(t.service_type||"").toLowerCase();return r.includes("karantina")||r.includes("fumigasi")}).map(t=>t.id),[u]),de=t=>{v(r=>r.includes(t)?r.filter(i=>i!==t):[...r,t])},at=()=>{v(T)},st=()=>{v(De)},rt=()=>{v(u.map(t=>t.id))},nt=()=>{v([])},D=u.filter(t=>t.service_type.toLowerCase().includes(z.toLowerCase())),$e=D.length>0&&D.every(t=>c.includes(t.id)),Ce=()=>{const t=D.map(r=>r.id);if($e){const r=new Set(t);v(i=>i.filter(o=>!r.has(o)))}else v(r=>Array.from(new Set([...r,...t])))},ce=async(t="A")=>{const r=window.open("","_blank");if(!r){alert("Gagal membuka jendela cetak. Pastikan izin popup browser diaktifkan.");return}const i=t==="B"?"Billing Statement B (Versi 2 Modern)":t==="B_CLASSIC"?"Billing Statement B (Versi 1 Klasik)":"Billing Statement";r.document.write(`
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
        `),r.document.close(),Ne(!0);try{const o=new URLSearchParams;x&&x!=="all"&&o.append("customer_id",x),k&&k!=="all"&&o.append("shipper_id",k),C&&o.append("fumigator",C),M&&o.append("exclude_status",M),g&&o.append("date_from",g),f&&o.append("date_to",f),B&&o.append("date_type",B),F&&o.append("search",F),a.trashed&&o.append("trashed",a.trashed),a.sort_by&&o.append("sort_by",a.sort_by),a.sort_dir&&o.append("sort_dir",a.sort_dir),c.length>0&&c.forEach(s=>o.append("product_ids[]",s.toString()));const w=await fetch(`/karantina/print-data?${o.toString()}`);if(!w.ok)throw new Error("Gagal mengambil data dari server");const m=(await w.json()).data||[];if(m.length===0){r.document.body.innerHTML=`
                    <div style="text-align: center; margin-top: 50px; font-family: Arial, sans-serif;">
                        <p style="color: #ef4444; font-weight: 600;">Tidak ada data yang sesuai filter untuk dicetak.</p>
                        <button onclick="window.close()" style="padding: 6px 14px; cursor: pointer; border-radius: 4px; border: 1px solid #ccc;">Tutup</button>
                    </div>
                `;return}const A=g?new Date(g).toLocaleDateString("id-ID"):"Semua",L=f?new Date(f).toLocaleDateString("id-ID"):"Semua",E=`${A} s/d ${L}`,R="/logo-dss.png",Le=new Date().toLocaleDateString("id-ID",{day:"numeric",month:"long",year:"numeric",hour:"2-digit",minute:"2-digit"});let H="-";if(x&&x!=="all"){const s=l.find(d=>String(d.id)===String(x));H=s?s.name:x}else{const s=Array.from(new Set(m.map(d=>d.customer_name).filter(Boolean)));s.length===1&&s[0]!=="-"?H=s[0]:s.length>1&&(H="Semua Customer")}const W=s=>{const d=new Date(s),U=String(d.getDate()).padStart(2,"0"),J=String(d.getMonth()+1).padStart(2,"0"),S=String(d.getFullYear()).slice(-2);return`${U}/${J}/${S}`},Ie=g&&f?`${W(g)} - ${W(f)}`:g||f?`${g?W(g):""} - ${f?W(f):""}`:E,Me=m.reduce((s,d)=>s+(typeof d.price=="number"?d.price:0),0),Be=m.reduce((s,d)=>{const U=typeof d.price=="number"?d.price:0;return s+(typeof d.ppn=="number"?d.ppn:Math.round(U*.11))},0),pe=Me+Be,lt=yt(pe);let q="";t==="B"?q=`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Billing Statement B - PT. Depo Surabaya Sejahtera</title>
                <style>
                    @page {
                        size: A4 landscape;
                        margin: 8mm 10mm;
                    }
                    * {
                        box-sizing: border-box;
                        font-family: Arial, 'Segoe UI', Helvetica, sans-serif;
                        color: #0f172a;
                    }
                    body {
                        margin: 0;
                        padding: 0;
                        font-size: 8.5pt;
                        background: #ffffff;
                    }
                    .header-container {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        border-bottom: 2.5px solid #0f172a;
                        padding-bottom: 8px;
                        margin-bottom: 12px;
                    }
                    .header-left {
                        display: flex;
                        align-items: center;
                        gap: 14px;
                    }
                    .header-logo {
                        width: 58px;
                        height: 58px;
                        object-fit: contain;
                    }
                    .company-name {
                        font-size: 14pt;
                        font-weight: 800;
                        color: #0f172a;
                        letter-spacing: 0.5px;
                        margin-bottom: 2px;
                    }
                    .company-address {
                        font-size: 8.5pt;
                        color: #475569;
                        line-height: 1.35;
                    }
                    .header-right {
                        text-align: right;
                    }
                    .statement-title {
                        font-size: 16pt;
                        font-weight: 900;
                        color: #0f172a;
                        letter-spacing: 1px;
                        margin-bottom: 2px;
                    }

                    /* Meta Info Panel */
                    .meta-panel {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        background: #f8fafc;
                        border: 1px solid #e2e8f0;
                        border-left: 4px solid #0f172a;
                        border-radius: 4px;
                        padding: 8px 14px;
                        margin-bottom: 12px;
                        font-size: 8.5pt;
                    }
                    .meta-col {
                        display: flex;
                        flex-direction: column;
                        gap: 3px;
                    }
                    .meta-item {
                        display: flex;
                        gap: 8px;
                    }
                    .meta-label {
                        width: 95px;
                        color: #64748b;
                        font-weight: 600;
                    }
                    .meta-value {
                        color: #0f172a;
                        font-weight: 700;
                    }

                    /* Modern Table B */
                    table.modern-b-table {
                        width: 100%;
                        border-collapse: collapse;
                        font-size: 8.5pt;
                    }
                    table.modern-b-table th {
                        background-color: #f1f5f9;
                        color: #0f172a;
                        font-weight: 700;
                        border-top: 2px solid #0f172a;
                        border-bottom: 2px solid #0f172a;
                        border-left: 1px solid #cbd5e1;
                        border-right: 1px solid #cbd5e1;
                        padding: 6px 5px;
                        text-align: center;
                        vertical-align: middle;
                    }
                    table.modern-b-table td {
                        border-left: 1px solid #e2e8f0;
                        border-right: 1px solid #e2e8f0;
                        padding: 5.5px 6px;
                        vertical-align: middle;
                    }
                    .row-dashed td {
                        border-bottom: 1px dashed #cbd5e1;
                    }
                    .row-solid-bottom td {
                        border-bottom: 2px solid #0f172a;
                    }
                    .text-center { text-align: center; }
                    .text-right { text-align: right; }
                    .container-code {
                        font-weight: 700;
                        color: #0f172a;
                    }
                    .currency-cell {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        font-variant-numeric: tabular-nums;
                    }
                    
                    /* Summary Row */
                    .summary-row td {
                        background-color: #f8fafc;
                        border-top: 2px solid #0f172a;
                        border-bottom: 2px solid #0f172a;
                        padding: 7px 6px;
                        font-weight: 800;
                    }
                    .grand-total-highlight {
                        background-color: #f1f5f9 !important;
                        border-left: 1px solid #0f172a !important;
                        border-right: 1px solid #0f172a !important;
                    }

                    /* Footer */
                    .footer-wrapper {
                        margin-top: 14px;
                        page-break-inside: avoid;
                    }
                    .terbilang-card {
                        background: #f8fafc;
                        border: 1px solid #e2e8f0;
                        border-left: 3px solid #0f172a;
                        padding: 6px 12px;
                        border-radius: 4px;
                        font-size: 8pt;
                    }
                    .terbilang-text {
                        font-weight: 700;
                        font-style: italic;
                        color: #0f172a;
                    }
                    @media print {
                        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                    }
                </style>
            </head>
            <body>
                <div class="header-container">
                    <div class="header-left">
                        <img src="${R}" alt="DSS Logo" class="header-logo" onerror="this.onerror=null;this.src='/logo.png'">
                        <div>
                            <div class="company-name">PT. DEPO SURABAYA SEJAHTERA</div>
                            <div class="company-address">
                                Jl. Tanjung Sadari No. 90 (Tanjung Batu No. 1) | Telp. 031-353 9484, 031-3539485 | Fax. 031-3539482<br>
                                Surabaya, Jawa Timur - Indonesia
                            </div>
                        </div>
                    </div>
                    <div class="header-right">
                        <div class="statement-title">BILLING STATEMENT</div>
                    </div>
                </div>

                <div class="meta-panel">
                    <div class="meta-col">
                        <div class="meta-item">
                            <span class="meta-label">Customer</span>
                            <span>:</span>
                            <span class="meta-value" style="font-size: 9.5pt; color: #0284c7;">${H}</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-label">Periode</span>
                            <span>:</span>
                            <span class="meta-value">${Ie}</span>
                        </div>
                    </div>
                    <div class="meta-col" style="align-items: flex-end;">
                        <div class="meta-item">
                            <span class="meta-label" style="width: auto;">Total Kontainer :</span>
                            <span class="meta-value">${m.length} Unit</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-label" style="width: auto;">Dicetak :</span>
                            <span class="meta-value">${Le} WIB</span>
                        </div>
                    </div>
                </div>

                <table class="modern-b-table">
                    <thead>
                        <tr>
                            <th rowspan="2" style="width: 28px;">No.</th>
                            <th rowspan="2" style="width: 135px;">No. Container</th>
                            <th rowspan="2" style="width: 140px;">Shipper</th>
                            <th colspan="2">Date / Time</th>
                            <th rowspan="2" style="width: 50px;">Ukuran</th>
                            <th rowspan="2" style="width: 85px;">Jasa</th>
                            <th rowspan="2" style="width: 95px;">Fumigator</th>
                            <th rowspan="2" style="width: 110px;">Price</th>
                            <th rowspan="2" style="width: 95px;">PPN 11 %</th>
                            <th rowspan="2" style="width: 115px;">Total</th>
                        </tr>
                        <tr>
                            <th style="width: 95px;">In</th>
                            <th style="width: 95px;">Out</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${m.map((s,d)=>{const J=d===m.length-1?"row-solid-bottom":"row-dashed",S=typeof s.price=="number"?s.price:0,O=typeof s.ppn=="number"?s.ppn:Math.round(S*.11),xe=typeof s.total=="number"?s.total:S+O;return`
                            <tr class="${J}">
                                <td class="text-center">${d+1}</td>
                                <td class="text-center container-code">${s.container_number}</td>
                                <td>${s.shipper_name??"-"}</td>
                                <td class="text-center">${Z(s.entry_date)}</td>
                                <td class="text-center">${Z(s.exit_date)}</td>
                                <td class="text-center">${Ge(s.price_type)}</td>
                                <td class="text-center">${s.service_type??"Fumigasi"}</td>
                                <td class="text-center">${s.fumigasi??"-"}</td>
                                <td>
                                    <div class="currency-cell">
                                        <span>Rp</span>
                                        <span>${N(S)}</span>
                                    </div>
                                </td>
                                <td>
                                    <div class="currency-cell">
                                        <span>Rp</span>
                                        <span>${N(O)}</span>
                                    </div>
                                </td>
                                <td>
                                    <div class="currency-cell" style="font-weight: 700;">
                                        <span>Rp</span>
                                        <span>${N(xe)}</span>
                                    </div>
                                </td>
                            </tr>
                            `}).join("")}
                        <tr class="summary-row">
                            <td colspan="8" class="text-right">
                                TOTAL KESELURUHAN (${m.length} Kontainer)
                            </td>
                            <td>
                                <div class="currency-cell">
                                    <span>Rp</span>
                                    <span>${N(Me)}</span>
                                </div>
                            </td>
                            <td>
                                <div class="currency-cell">
                                    <span>Rp</span>
                                    <span>${N(Be)}</span>
                                </div>
                            </td>
                            <td class="grand-total-highlight">
                                <div class="currency-cell" style="font-weight: 900; font-size: 9pt;">
                                    <span>Rp</span>
                                    <span>${N(pe)}</span>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div class="footer-wrapper">
                    <div class="terbilang-card">
                        <span style="font-weight: 600; color: #64748b;">Terbilang: </span>
                        <span class="terbilang-text"># ${lt} #</span>
                    </div>
                </div>
            </body>
            </html>
                `:t==="B_CLASSIC"?q=`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Billing Statement B (Klasik) - PT. Depo Surabaya Sejahtera</title>
                <style>
                    @page {
                        size: A4 landscape;
                        margin: 8mm 10mm;
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
                        margin-bottom: 18px;
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
                        margin-bottom: 12px;
                    }
                    .statement-title {
                        font-size: 11pt;
                        font-weight: 800;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                        margin-bottom: 6px;
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
                    <img src="${R}" alt="DSS Logo" class="header-logo" onerror="this.onerror=null;this.src='/logo.png'">
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
                            <td class="meta-value">${H}</td>
                        </tr>
                        <tr>
                            <td class="meta-label">Periode</td>
                            <td class="meta-sep">:</td>
                            <td class="meta-value">${Ie}</td>
                        </tr>
                    </table>
                </div>

                <table class="b-table">
                    <thead>
                        <tr>
                            <th rowspan="2" style="width: 28px;">No.</th>
                            <th rowspan="2" style="width: 135px;">No. Container</th>
                            <th rowspan="2" style="width: 140px;">Shipper</th>
                            <th colspan="2">Date / Time</th>
                            <th rowspan="2" style="width: 50px;">Ukuran</th>
                            <th rowspan="2" style="width: 85px;">Jasa</th>
                            <th rowspan="2" style="width: 95px;">Fumigator</th>
                            <th rowspan="2" style="width: 110px;">Price</th>
                            <th rowspan="2" style="width: 95px;">PPN 11 %</th>
                            <th rowspan="2" style="width: 115px;">Total</th>
                        </tr>
                        <tr>
                            <th style="width: 95px;">In</th>
                            <th style="width: 95px;">Out</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${m.map((s,d)=>{const J=d===m.length-1?"row-solid-bottom":"row-dashed",S=typeof s.price=="number"?s.price:0,O=typeof s.ppn=="number"?s.ppn:Math.round(S*.11),xe=typeof s.total=="number"?s.total:S+O;return`
                            <tr class="${J}">
                                <td class="text-center">${d+1}</td>
                                <td class="text-center" style="font-weight: 700;">${s.container_number}</td>
                                <td class="text-center">${s.shipper_name??"-"}</td>
                                <td class="text-center">${Z(s.entry_date)}</td>
                                <td class="text-center">${Z(s.exit_date)}</td>
                                <td class="text-center">${Ge(s.price_type)}</td>
                                <td class="text-center">${s.service_type??"Fumigasi"}</td>
                                <td class="text-center">${s.fumigasi??"-"}</td>
                                <td>
                                    <div class="currency-cell">
                                        <span>Rp</span>
                                        <span>${N(S)}</span>
                                    </div>
                                </td>
                                <td>
                                    <div class="currency-cell">
                                        <span>Rp</span>
                                        <span>${N(O)}</span>
                                    </div>
                                </td>
                                <td>
                                    <div class="currency-cell">
                                        <span>Rp</span>
                                        <span>${N(xe)}</span>
                                    </div>
                                </td>
                            </tr>
                            `}).join("")}
                        <tr class="grand-total-row">
                            <td colspan="10" style="border: none; background: transparent;"></td>
                            <td class="grand-total-cell">
                                <div class="currency-cell" style="font-weight: 800;">
                                    <span>Rp</span>
                                    <span>${N(pe)}</span>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </body>
            </html>
                `:q=`
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
                            <img src="${R}" alt="Logo" style="width: 55px; height: 55px; object-fit: contain;" onerror="this.onerror=null;this.src='/logo.png'">
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
                        <strong>Periode:</strong> ${E} &nbsp;|&nbsp;
                        <strong>Total:</strong> ${m.length} Kontainer
                    </div>
                    <div>
                        <strong>Dicetak pada:</strong> ${Le} WIB
                    </div>
                </div>

                <table class="data-table">
                    <thead>
                        <tr>
                            <th style="width: 30px; text-align: center;">No</th>
                            <th>Nomor Kontainer</th>
                            <th>Customer</th>
                            <th>Nama Shipper</th>
                            <th>Layanan</th>
                            <th>Fumigator</th>
                            <th style="text-align: center; width: 60px;">Size</th>
                            <th>Tanggal Masuk</th>
                            <th>Tanggal Keluar</th>
                            <th>Komoditi</th>
                            <th>Negara Tujuan</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${m.map((s,d)=>`
                            <tr>
                                <td class="text-center">${d+1}</td>
                                <td style="font-weight: 700; font-family: monospace;">${s.container_number}</td>
                                <td>${s.customer_name??"-"}</td>
                                <td>${s.shipper_name??"-"}</td>
                                <td>${s.service_type??"-"}</td>
                                <td>${s.fumigasi??'<span class="text-gray-400">–</span>'}</td>
                                <td class="text-center">${Ye(s.price_type)}</td>
                                <td>${s.entry_date?Ve(s.entry_date):'<span class="text-gray-400">–</span>'}</td>
                                <td>${s.exit_date?Ve(s.exit_date):'<span class="text-gray-400">–</span>'}</td>
                                <td>${s.commodity??"-"}</td>
                                <td>${s.country??"-"}</td>
                            </tr>
                        `).join("")}
                    </tbody>
                </table>
            </body>
            </html>
            `,r.document.open(),r.document.write(q),r.document.close(),setTimeout(()=>{r.focus(),r.print()},300)}catch(o){console.error("Error saat mencetak billing statement:",o),r.document.body.innerHTML=`
                <div style="text-align: center; margin-top: 50px; font-family: Arial, sans-serif;">
                    <p style="color: #ef4444; font-weight: 600;">Terjadi kesalahan saat memuat seluruh data kontainer.</p>
                    <button onclick="window.close()" style="padding: 6px 14px; cursor: pointer; border-radius: 4px; border: 1px solid #ccc;">Tutup</button>
                </div>
            `}finally{Ne(!1)}},$=({label:t,field:r,currentSort:i,currentDir:o})=>{const w=i===r&&o==="asc"?"desc":"asc";return e.jsxs(Fe,{href:route("index_karantina",{customer_id:x==="all"?void 0:x,shipper_id:k==="all"?void 0:k,fumigator:C?C.trim():void 0,exclude_status:M,date_from:g||void 0,date_to:f||void 0,date_type:B,product_ids:c.length>0?c:void 0,search:F||void 0,per_page:we,sort_by:r,sort_dir:w}),preserveState:!0,preserveScroll:!0,className:"inline-flex items-center gap-1 font-semibold text-slate-700 hover:text-black transition-colors",children:[e.jsx("span",{children:t}),i===r?w==="asc"?e.jsx(St,{className:"h-3.5 w-3.5 text-blue-600"}):e.jsx(_t,{className:"h-3.5 w-3.5 text-blue-600"}):e.jsx(kt,{className:"h-3.5 w-3.5 text-gray-400 opacity-60 hover:opacity-100"})]})},{props:G}=it();return e.jsxs(dt,{breadcrumbs:Dt,children:[e.jsx(ot,{title:"Karantina & Fumigasi - Depo Surabaya"}),e.jsxs("div",{className:"w-full space-y-6 px-4 py-6 sm:px-6 lg:px-8 bg-slate-50/50 min-h-screen",children:[((Te=G.flash)==null?void 0:Te.success)&&e.jsxs("div",{className:"flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-800 shadow-2xs",children:[e.jsx(Oe,{className:"h-4 w-4 text-emerald-600 shrink-0"}),e.jsx("span",{children:G.flash.success})]}),((Pe=G.flash)==null?void 0:Pe.error)&&e.jsxs("div",{className:"flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-800 shadow-2xs",children:[e.jsx(ge,{className:"h-4 w-4 text-rose-600 shrink-0"}),e.jsx("span",{children:G.flash.error})]}),e.jsxs("div",{className:"flex flex-col sm:flex-row sm:items-center justify-between gap-4",children:[e.jsxs("div",{children:[e.jsxs("div",{className:"flex items-center gap-2.5",children:[e.jsx(ct,{className:"h-7 w-7 text-gray-900"}),e.jsx("h1",{className:"text-2xl font-bold tracking-tight text-gray-900",children:"Karantina & Fumigasi"}),e.jsx("span",{className:"inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700 border border-slate-200",children:"Billing & Monitoring"})]}),e.jsx("p",{className:"text-xs text-gray-500 mt-1",children:"Kelola data pergerakan kontainer karantina, filter multi-parameter, dan cetak billing statement resmi."})]}),e.jsxs("div",{className:"flex flex-wrap items-center gap-2",children:[e.jsxs(_,{variant:"outline",size:"sm",onClick:()=>Qe(!le),className:"gap-1.5 h-9 text-xs border-gray-300 bg-white shadow-2xs",children:[e.jsx(fe,{className:"h-3.5 w-3.5 text-blue-600"}),e.jsx("span",{children:"Filter"}),le?e.jsx(jt,{className:"h-3.5 w-3.5 text-gray-500"}):e.jsx(be,{className:"h-3.5 w-3.5 text-gray-500"})]}),e.jsxs(_,{type:"button",size:"sm",disabled:ie,onClick:()=>ce("A"),className:"bg-gray-900 hover:bg-black text-white font-semibold text-xs h-9 px-3.5 gap-1.5 shadow-2xs disabled:opacity-70",title:"Cetak Billing Statement",children:[e.jsx(X,{className:`h-3.5 w-3.5 ${ie?"animate-spin":""}`}),e.jsx("span",{children:"Billing Statement"})]}),e.jsxs(Ee,{children:[e.jsx(Re,{asChild:!0,children:e.jsxs(_,{type:"button",size:"sm",disabled:ie,variant:"outline",className:"border-gray-300 text-gray-800 bg-white hover:bg-gray-50 font-semibold text-xs h-9 px-3.5 gap-1.5 shadow-2xs",title:"Pilih dan Cetak Billing Statement Format B",children:[e.jsx(X,{className:"h-3.5 w-3.5 text-gray-600"}),e.jsx("span",{children:"Billing Statement B"}),e.jsx(be,{className:"h-3 w-3 text-gray-400 ml-0.5"})]})}),e.jsxs(He,{align:"end",className:"w-72",children:[e.jsxs(Ue,{onClick:()=>ce("B"),className:"cursor-pointer flex flex-col items-start py-2.5 px-3",children:[e.jsxs("div",{className:"font-semibold text-xs text-gray-900 flex items-center gap-1.5",children:[e.jsx(X,{className:"h-3.5 w-3.5 text-blue-600"}),e.jsx("span",{children:"Versi 2 (Modern - A4 Landscape)"})]}),e.jsx("span",{className:"text-[11px] text-gray-500 mt-1 pl-5",children:"Desain modern, rekap total, terbilang resmi & kolom tanda tangan"})]}),e.jsxs(Ue,{onClick:()=>ce("B_CLASSIC"),className:"cursor-pointer flex flex-col items-start py-2.5 px-3 border-t border-gray-100",children:[e.jsxs("div",{className:"font-semibold text-xs text-gray-700 flex items-center gap-1.5",children:[e.jsx(X,{className:"h-3.5 w-3.5 text-gray-500"}),e.jsx("span",{children:"Versi 1 (Klasik - A4 Landscape)"})]}),e.jsx("span",{className:"text-[11px] text-gray-500 mt-1 pl-5",children:"Format tabel standar klasik / retro"})]})]})]})]})]}),le&&e.jsxs("div",{className:"rounded-xl border border-gray-200 bg-white p-5 shadow-xs space-y-4",children:[e.jsxs("div",{className:"flex items-center justify-between border-b border-gray-100 pb-3",children:[e.jsxs("span",{className:"text-sm font-bold text-gray-800 flex items-center gap-2",children:[e.jsx(fe,{className:"h-4 w-4 text-blue-600"}),"Parameter Filter"]}),e.jsxs(_,{variant:"ghost",size:"sm",onClick:tt,className:"text-xs text-gray-500 hover:text-rose-600 gap-1.5 h-8 px-2",children:[e.jsx(vt,{className:"h-3.5 w-3.5"}),e.jsx("span",{children:"Reset Filter"})]})]}),e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4",children:[e.jsxs("div",{className:"space-y-1.5",children:[e.jsx(I,{className:"text-xs font-semibold text-gray-700",children:"Customer"}),e.jsx(ze,{options:Xe,value:x,onChange:t=>ee(t||"all"),placeholder:"Semua Customer",searchPlaceholder:"Cari customer...",showClear:!1,className:"w-full text-xs h-9 bg-white"})]}),e.jsxs("div",{className:"space-y-1.5",children:[e.jsx(I,{className:"text-xs font-semibold text-gray-700",children:"Shipper"}),e.jsx(ze,{options:Ze,value:k,onChange:t=>te(t||"all"),placeholder:"Semua Shipper",searchPlaceholder:"Cari shipper...",showClear:!1,className:"w-full text-xs h-9 bg-white"})]}),e.jsxs("div",{className:"space-y-1.5",children:[e.jsx(I,{className:"text-xs font-semibold text-gray-700",children:"Fumigator"}),e.jsx(me,{type:"text",value:C,onChange:t=>ae(t.target.value),onKeyDown:ke,placeholder:"Ketik nama fumigator...",className:"text-xs h-9 bg-white border-gray-200"})]}),e.jsxs("div",{className:"space-y-1.5",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{className:"flex items-center gap-1.5",children:[e.jsx(I,{className:"text-xs font-semibold text-gray-700",children:"Jenis Layanan"}),P&&c.length>0&&e.jsx("span",{className:"text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200",children:"Default"})]}),c.length>0&&e.jsxs("span",{className:"text-[10px] text-blue-600 font-bold bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200",children:[c.length," dipilih"]})]}),e.jsxs(Ee,{children:[e.jsx(Re,{asChild:!0,children:e.jsxs(_,{variant:"outline",type:"button",className:"w-full justify-between border-gray-200 bg-white text-xs font-normal text-gray-800 shadow-2xs hover:bg-gray-50 h-9",children:[e.jsx("span",{className:"truncate",children:c.length===0?"Semua Layanan":P?`Default Layanan (${c.length})`:c.length===1?((Ae=u.find(t=>t.id===c[0]))==null?void 0:Ae.service_type)||"1 Layanan":`${c.length} Layanan Dipilih`}),e.jsx(be,{className:"ml-1.5 h-3.5 w-3.5 shrink-0 opacity-50"})]})}),e.jsxs(He,{className:"w-88 p-2.5 shadow-xl max-w-sm",align:"start",children:[e.jsxs("div",{className:"flex items-center justify-between px-1 pb-2 border-b border-gray-100",children:[e.jsx("span",{className:"text-xs font-semibold text-gray-800",children:"Pilih Layanan"}),e.jsxs("div",{className:"flex flex-wrap gap-1.5 text-[11px]",children:[T.length>0&&e.jsxs("button",{type:"button",onClick:t=>{t.preventDefault(),at()},className:`px-1.5 py-0.5 rounded text-[10px] font-medium transition-colors ${P?"bg-emerald-100 text-emerald-800 font-bold":"bg-emerald-50 text-emerald-700 hover:bg-emerald-100"}`,title:"Terapkan master default yang tersimpan",children:["Default (",T.length,")"]}),e.jsxs("button",{type:"button",onClick:t=>{t.preventDefault(),st()},className:"px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors",title:"Pilih semua layanan karantina & fumigasi",children:["Karantina (",De.length,")"]}),e.jsx("button",{type:"button",onClick:t=>{t.preventDefault(),rt()},className:"text-gray-600 hover:text-blue-600 text-[10px] font-medium",children:"Semua"}),e.jsx("span",{className:"text-gray-300",children:"|"}),e.jsx("button",{type:"button",onClick:t=>{t.preventDefault(),nt()},className:"text-gray-500 hover:text-rose-600 text-[10px]",children:"Kosongkan"})]})]}),e.jsxs("div",{className:"relative my-2 px-0.5",children:[e.jsx(Je,{className:"absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-400"}),e.jsx(me,{type:"text",placeholder:"Cari layanan...",value:z,onChange:t=>ve(t.target.value),onKeyDown:t=>t.stopPropagation(),className:"h-8 pl-8 pr-7 text-xs rounded-md border-gray-200"}),z&&e.jsx("button",{type:"button",onClick:()=>ve(""),className:"absolute right-2.5 top-2 text-gray-400 hover:text-gray-600",children:e.jsx(ge,{className:"h-3.5 w-3.5"})})]}),D.length>0&&e.jsxs("div",{onClick:t=>{t.preventDefault(),Ce()},className:"flex items-center gap-2 px-2 py-1.5 mb-1.5 rounded bg-slate-50 hover:bg-slate-100 cursor-pointer text-xs font-medium text-slate-700 border border-slate-200 transition-colors",children:[e.jsx(Ke,{checked:$e,onCheckedChange:Ce,className:"h-3.5 w-3.5"}),e.jsx("span",{className:"truncate text-xs",children:z?`Centang Semua ("${z}")`:`Centang Semua (${D.length})`})]}),e.jsx("div",{className:"space-y-0.5 max-h-56 overflow-y-auto pr-0.5",children:D.length===0?e.jsx("div",{className:"py-4 text-center text-xs text-gray-400",children:"Tidak ada layanan cocok"}):D.map(t=>{const r=c.includes(t.id);return e.jsxs("div",{onClick:i=>{i.preventDefault(),de(t.id)},className:`flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer text-xs transition-colors ${r?"bg-blue-50 text-blue-900 font-medium":"hover:bg-gray-100 text-gray-700"}`,children:[e.jsx(Ke,{checked:r,onCheckedChange:()=>de(t.id),className:"h-3.5 w-3.5"}),e.jsx("span",{className:"truncate",children:t.service_type})]},t.id)})}),e.jsxs("div",{className:"mt-2 pt-2 border-t border-gray-100 space-y-1.5",children:[e.jsx(_,{type:"button",variant:"outline",size:"sm",disabled:Se||P,onClick:t=>{t.preventDefault(),et()},className:`w-full h-8 text-[11px] justify-center gap-1.5 ${P?"bg-emerald-50 text-emerald-700 border-emerald-200 cursor-default opacity-90":"hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 text-gray-700"}`,children:P?e.jsxs(e.Fragment,{children:[e.jsx(Oe,{className:"h-3.5 w-3.5 text-emerald-600"}),e.jsx("span",{children:"Sudah Sesuai Master Default"})]}):Se?e.jsx("span",{children:"Menyimpan Master Default..."}):e.jsxs(e.Fragment,{children:[e.jsx(Nt,{className:"h-3.5 w-3.5 text-blue-600"}),e.jsx("span",{children:"Jadikan Pilihan Saat Ini Sebagai Master Default"})]})}),e.jsxs("div",{className:"flex items-center justify-between px-1 text-[11px] text-gray-500",children:[e.jsx("span",{children:"Master Setting Global"}),e.jsxs(Fe,{href:route("settings.system"),className:"inline-flex items-center gap-1 text-blue-600 hover:underline font-medium",children:[e.jsx(bt,{className:"h-3 w-3"}),"Buka Pengaturan Sistem"]})]})]})]})]})]})]}),e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1",children:[e.jsxs("div",{className:"space-y-1.5",children:[e.jsx(I,{className:"text-xs font-semibold text-gray-700",children:"Status Exclude"}),e.jsxs(pt,{value:M,onValueChange:se,children:[e.jsx(xt,{className:"w-full text-xs h-9 bg-white border-gray-200",children:e.jsx(mt,{})}),e.jsxs(ht,{children:[e.jsx(he,{value:"active",children:"Hanya yang Diikutsertakan (Default)"}),e.jsx(he,{value:"all",children:"Semua (Termasuk yang di-exclude)"}),e.jsx(he,{value:"excluded",children:"Hanya yang Di-exclude"})]})]})]}),e.jsxs("div",{className:"space-y-1.5 sm:col-span-2 lg:col-span-3",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx(I,{className:"text-xs font-semibold text-gray-700",children:"Rentang Tanggal"}),e.jsxs("div",{className:"flex items-center gap-1.5",children:[e.jsx("span",{className:"text-[11px] text-gray-500",children:"Berdasarkan:"}),e.jsxs("select",{value:B,onChange:t=>re(t.target.value),className:"text-[11px] font-semibold text-blue-600 bg-blue-50 border border-blue-200 rounded px-1.5 py-0.5 cursor-pointer focus:ring-0",children:[e.jsx("option",{value:"entry_date",children:"Tgl Masuk"}),e.jsx("option",{value:"eir_date",children:"Tgl EIR"}),e.jsx("option",{value:"exit_date",children:"Tgl Keluar"})]})]})]}),e.jsx(wt,{startDate:g,endDate:f,onChange:({startDate:t,endDate:r})=>{V(t),Y(r)},onApply:({startDate:t,endDate:r})=>{V(t),Y(r),oe({date_from:t,date_to:r})},placeholder:"Semua rentang tanggal...",className:"w-full",align:"right"})]})]}),c.length>0&&e.jsxs("div",{className:"flex flex-wrap items-center gap-1.5 border-t border-gray-100 pt-2.5",children:[e.jsx("span",{className:"text-[11px] text-gray-500 font-medium",children:"Layanan Terpilih:"}),c.map(t=>{const r=u.find(i=>i.id===t);return r?e.jsxs("span",{className:"inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 border border-blue-200",children:[r.service_type,e.jsx("button",{type:"button",onClick:()=>de(t),className:"hover:text-blue-900 focus:outline-none",children:e.jsx(ge,{className:"h-3 w-3"})})]},t):null}),e.jsx("button",{type:"button",onClick:()=>v([]),className:"text-[11px] text-gray-500 hover:text-rose-600 underline ml-1",children:"Hapus Semua"})]}),e.jsxs("div",{className:"flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-gray-100",children:[e.jsxs("div",{className:"relative w-full sm:max-w-md",children:[e.jsx(Je,{className:"absolute left-3 top-2.5 h-4 w-4 text-gray-400"}),e.jsx(me,{type:"text",placeholder:"Cari nomor kontainer, customer, shipper, layanan, atau komoditi... (Tekan Enter)",value:F,onChange:t=>ne(t.target.value),onKeyDown:ke,className:"pl-9 text-xs h-9 bg-white border-gray-200"})]}),e.jsx("div",{className:"flex items-center gap-2 w-full sm:w-auto justify-end",children:e.jsx(_,{size:"sm",onClick:()=>oe(),className:"bg-gray-900 hover:bg-black text-white font-semibold text-xs h-9 px-5 shadow-2xs",children:"Terapkan Filter"})})]})]}),e.jsxs("div",{className:"rounded-xl border border-gray-200 bg-white shadow-xs p-5 space-y-4",children:[e.jsx("div",{className:"flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3",children:e.jsxs("div",{children:[e.jsx("h2",{className:"text-base font-bold text-gray-900",children:"Daftar Kontainer Karantina & Fumigasi"}),e.jsxs("p",{className:"text-xs text-gray-500 mt-0.5",children:["Menampilkan total ",e.jsx("span",{className:"font-bold text-gray-800",children:n.total??n.data.length})," kontainer sesuai kriteria filter aktif."]})]})}),e.jsx("div",{className:"overflow-x-auto rounded-lg border border-gray-200",children:e.jsxs(ut,{children:[e.jsx(gt,{className:"bg-slate-50 text-xs font-semibold text-slate-700 border-b border-gray-200",children:e.jsxs(ue,{className:"hover:bg-transparent",children:[e.jsx(j,{className:"px-4 py-3.5 whitespace-nowrap",children:e.jsx($,{label:"Nomor Kontainer",field:"container_number",currentSort:a.sort_by,currentDir:a.sort_dir})}),e.jsx(j,{className:"px-4 py-3.5 whitespace-nowrap",children:e.jsx($,{label:"Customer",field:"customers.name",currentSort:a.sort_by,currentDir:a.sort_dir})}),e.jsx(j,{className:"px-4 py-3.5 whitespace-nowrap",children:e.jsx($,{label:"Nama Shipper",field:"shippers.name",currentSort:a.sort_by,currentDir:a.sort_dir})}),e.jsx(j,{className:"px-4 py-3.5 whitespace-nowrap",children:"Layanan"}),e.jsx(j,{className:"px-4 py-3.5 text-center whitespace-nowrap",children:"Size"}),e.jsx(j,{className:"px-4 py-3.5 whitespace-nowrap",children:e.jsx($,{label:"Tanggal Masuk",field:"entry_date",currentSort:a.sort_by,currentDir:a.sort_dir})}),e.jsx(j,{className:"px-4 py-3.5 whitespace-nowrap",children:e.jsx($,{label:"Tanggal EIR",field:"eir_date",currentSort:a.sort_by,currentDir:a.sort_dir})}),e.jsx(j,{className:"px-4 py-3.5 whitespace-nowrap",children:e.jsx($,{label:"Tanggal Keluar",field:"exit_date",currentSort:a.sort_by,currentDir:a.sort_dir})}),e.jsx(j,{className:"px-4 py-3.5 whitespace-nowrap",children:"Komoditi"}),e.jsx(j,{className:"px-4 py-3.5 whitespace-nowrap",children:"Negara Tujuan"}),e.jsx(j,{className:"px-4 py-3.5 whitespace-nowrap",children:e.jsx($,{label:"Fumigator",field:"fumigasi",currentSort:a.sort_by,currentDir:a.sort_dir})})]})}),e.jsx(ft,{className:"divide-y divide-gray-100 bg-white",children:n.data.length===0?e.jsx(ue,{children:e.jsx(b,{colSpan:11,className:"py-12 text-center text-sm text-gray-500",children:e.jsxs("div",{className:"flex flex-col items-center justify-center gap-1.5",children:[e.jsx(fe,{className:"h-6 w-6 text-gray-300"}),e.jsx("span",{className:"font-semibold text-gray-700",children:"Tidak ada data kontainer yang sesuai filter."}),e.jsx("span",{className:"text-xs text-gray-400",children:"Silakan ubah parameter filter atau klik Reset Filter."})]})})}):n.data.map(t=>{var r,i,o,w,K,m,A,L;return e.jsxs(ue,{className:"hover:bg-slate-50/70 transition-colors",children:[e.jsx(b,{className:"px-4 py-3 text-sm font-bold text-slate-900 font-mono",children:t.container_number}),e.jsx(b,{className:"px-4 py-3 text-sm font-semibold text-slate-900",children:((i=(r=t.order)==null?void 0:r.customer)==null?void 0:i.name)??t.customer_name??"-"}),e.jsx(b,{className:"px-4 py-3 text-sm text-slate-700",children:((w=(o=t.order)==null?void 0:o.shipper)==null?void 0:w.name)??t.shipper_name??"-"}),e.jsx(b,{className:"px-4 py-3 text-sm",children:e.jsx("span",{className:"inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 whitespace-nowrap",children:((K=t.product)==null?void 0:K.service_type)??t.service_type??((m=t.order)!=null&&m.fumigasi?"Fumigasi":"-")})}),e.jsx(b,{className:"px-4 py-3 text-sm text-center",children:e.jsx("span",{className:"inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200",children:Ye(t.price_type)})}),e.jsx(b,{className:"px-4 py-3 text-sm",children:ye(t.entry_date)}),e.jsx(b,{className:"px-4 py-3 text-sm",children:ye(t.eir_date)}),e.jsx(b,{className:"px-4 py-3 text-sm",children:ye(t.exit_date)}),e.jsx(b,{className:"px-4 py-3 text-sm text-slate-800",children:t.commodity??"-"}),e.jsx(b,{className:"px-4 py-3 text-sm text-slate-800",children:t.country??"-"}),e.jsx(b,{className:"px-4 py-3 text-sm",children:((A=t.order)==null?void 0:A.fumigasi)??t.fumigasi?e.jsx("span",{className:"inline-flex items-center rounded-md bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800 border border-amber-200",children:((L=t.order)==null?void 0:L.fumigasi)??t.fumigasi}):e.jsx("span",{className:"text-gray-400",children:"–"})})]},t.id)})})]})}),e.jsxs("div",{className:"flex flex-col sm:flex-row items-center justify-between gap-3 pt-2",children:[e.jsxs("p",{className:"text-xs text-gray-500",children:["Menampilkan ",e.jsx("span",{className:"font-semibold text-gray-800",children:n.from??0})," sampai"," ",e.jsx("span",{className:"font-semibold text-gray-800",children:n.to??0})," dari"," ",e.jsx("span",{className:"font-semibold text-gray-800",children:n.total??n.data.length})," kontainer"]}),e.jsx("div",{className:"flex flex-wrap justify-center gap-1",children:n.links.map((t,r)=>t.url?e.jsx(_,{variant:t.active?"default":"outline",disabled:!t.url,onClick:()=>Q.get(t.url,{},{preserveState:!0,preserveScroll:!0}),className:`px-3 py-1 text-xs font-medium h-8 ${t.active?"bg-gray-900 text-white hover:bg-black":"text-gray-700 bg-white border-gray-200"}`,children:t.label.replace(/&laquo; Previous|Next &raquo;/,i=>i.includes("Previous")?"← Prev":i.includes("Next")?"Next →":i)},r):e.jsx("span",{className:"px-2.5 py-1 text-xs text-gray-400",children:"..."},r))})]})]})]})]})}export{sa as default};
