import{r as p,K as qt,j as t,L as Gt,S as dt,$ as Qt}from"./app-ChyQYIb1.js";import{A as Xt}from"./app-layout-C-kfGykb.js";import{B as $}from"./button-Cy-GLTCw.js";import{I as ct}from"./input-DL3mXR4u.js";import{L as C}from"./label-JJxcJy2F.js";import{S as Zt,a as te,b as ee,c as ae,d as pt}from"./select-D_tjjwqC.js";import{S as At}from"./searchable-select-BmUoiT2z.js";import{T as se,a as re,b as xt,c as N,d as ne,e as w}from"./table-DxgV6GEf.js";import{C as Lt}from"./checkbox-rsYWncRN.js";import{X as mt,D as It,b as Bt,c as zt,d as Ft,S as Mt}from"./global-container-search-EA3h0Yw1.js";import{t as le}from"./terbilang-DIgi2L4g.js";import{D as ie}from"./date-range-picker-DIxL64nR.js";import{C as oe}from"./check-C9FEUoQD.js";import{S as de}from"./shield-BkJfwPmF.js";import{F as ht}from"./filter-CLLph976.js";import{C as ce}from"./chevron-up-DJpjk02H.js";import{C as gt}from"./chevron-down-PSXCIx19.js";import{P as V}from"./printer-BS02z8-E.js";import{R as pe}from"./rotate-ccw-BzF1zJmg.js";import{A as xe,a as me,b as he}from"./arrow-up-CumFwRP2.js";import"./index-BTwTEU-y.js";import"./index-BfelsJv_.js";import"./Combination-rbVtpuqM.js";import"./index-BivNEK3P.js";import"./truck-D6vRjUIe.js";import"./index-AZdzGj_D.js";import"./app-logo-icon-DNtEDTLk.js";import"./chevron-left-DbZ3fWLU.js";const Ht=["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];function ut(n){if(!n)return t.jsx("span",{className:"text-gray-400",children:"–"});const l=new Date(n);if(isNaN(l.getTime()))return t.jsx("span",{className:"text-gray-400",children:"–"});const x=String(l.getDate()).padStart(2,"0"),f=Ht[l.getMonth()],b=l.getFullYear(),a=String(l.getHours()).padStart(2,"0"),c=String(l.getMinutes()).padStart(2,"0");return t.jsxs("div",{className:"flex flex-col leading-tight whitespace-nowrap",children:[t.jsxs("span",{className:"font-semibold text-slate-800 text-xs",children:[x," ",f," ",b]}),t.jsxs("span",{className:"text-[11px] text-slate-500 font-normal",children:[a,":",c," WIB"]})]})}function Et(n){if(!n)return"–";const l=new Date(n);if(isNaN(l.getTime()))return"–";const x=String(l.getDate()).padStart(2,"0"),f=Ht[l.getMonth()],b=l.getFullYear(),a=String(l.getHours()).padStart(2,"0"),c=String(l.getMinutes()).padStart(2,"0");return`${x} ${f} ${b}, ${a}:${c}`}function Rt(n,l){if(!n)return l||"-";const x=String(n).trim();return x.toLowerCase().endsWith("ft")?x:x==="20"||x==="40"?`${x}ft`:x||l||"-"}function Y(n){if(!n)return"-";try{const l=new Date(n);if(isNaN(l.getTime()))return String(n);const x=String(l.getDate()).padStart(2,"0"),f=String(l.getMonth()+1).padStart(2,"0"),b=l.getFullYear(),a=String(l.getHours()).padStart(2,"0"),c=String(l.getMinutes()).padStart(2,"0");return`${x}-${f}-${b} / ${a}.${c}`}catch{return String(n)}}function Kt(n){if(!n)return"-";const l=String(n).toLowerCase();return l.includes("20")?"20'":l.includes("40")?"40'":l.includes("45")?"45'":n}function j(n){return new Intl.NumberFormat("id-ID",{minimumFractionDigits:0,maximumFractionDigits:0}).format(n)}const ge=[{title:"Dashboard",href:"/dashboard"},{title:"Karantina & Fumigasi",href:"/karantina"}];function Oe({orders:n,customers:l=[],shippers:x=[],products:f=[],filters:b}){var St,_t,kt;const a=b||{},[c,W]=p.useState(a.customer_id||"all"),[_,q]=p.useState(a.shipper_id||"all"),[T,G]=p.useState(a.fumigator||""),[P,Q]=p.useState(a.exclude_status||"active"),[g,K]=p.useState(a.date_from||""),[u,H]=p.useState(a.date_to||""),[A,X]=p.useState(a.date_type||"entry_date"),[L,Z]=p.useState(a.search||""),[ft,bt]=p.useState(String(a.per_page||25)),Ut=Array.isArray(b==null?void 0:b.product_ids)?b.product_ids.map(Number).filter(e=>!isNaN(e)):[],[m,S]=p.useState(Ut),[I,yt]=p.useState(""),[tt,Ot]=p.useState(!0),[et,wt]=p.useState(!1),Jt=p.useMemo(()=>[{value:"all",label:"Semua Customer"},...l.map(e=>({value:String(e.id),label:e.name}))],[l]),Vt=p.useMemo(()=>[{value:"all",label:"Semua Shipper"},...x.map(e=>({value:String(e.id),label:e.name}))],[x]);p.useEffect(()=>{W(a.customer_id||"all"),q(a.shipper_id||"all"),G(a.fumigator||""),Q(a.exclude_status||"active"),K(a.date_from||""),H(a.date_to||""),X(a.date_type||"entry_date"),Z(a.search||""),bt(String(a.per_page||25));const e=Array.isArray(a.product_ids)?a.product_ids.map(Number).filter(r=>!isNaN(r)):[];S(e)},[a.customer_id,a.shipper_id,a.fumigator,a.exclude_status,a.date_from,a.date_to,a.date_type,a.search,a.per_page,a.product_ids]);const at=e=>{const r=(e==null?void 0:e.customer_id)!==void 0?e.customer_id:c,i=(e==null?void 0:e.shipper_id)!==void 0?e.shipper_id:_,o=(e==null?void 0:e.fumigator)!==void 0?e.fumigator:T,y=(e==null?void 0:e.product_ids)!==void 0?e.product_ids:m,$t=(e==null?void 0:e.exclude_status)!==void 0?e.exclude_status:P,h=(e==null?void 0:e.date_from)!==void 0?e.date_from:g,nt=(e==null?void 0:e.date_to)!==void 0?e.date_to:u,lt=(e==null?void 0:e.date_type)!==void 0?e.date_type:A,B=(e==null?void 0:e.search)!==void 0?e.search:L,z=(e==null?void 0:e.per_page)!==void 0?e.per_page:ft;dt.get(route("index_karantina"),{customer_id:r==="all"?void 0:r,shipper_id:i==="all"?void 0:i,fumigator:o?o.trim():void 0,product_ids:y.length>0?y:void 0,exclude_status:$t,date_from:h||void 0,date_to:nt||void 0,date_type:lt,search:B?B.trim():void 0,per_page:z,sort_by:a.sort_by||void 0,sort_dir:a.sort_dir||void 0,trashed:a.trashed||void 0},{preserveState:!0,preserveScroll:!0})},Yt=()=>{W("all"),q("all"),G(""),S([]),Q("active"),K(""),H(""),X("entry_date"),Z(""),bt("25"),dt.get(route("index_karantina"),{},{preserveScroll:!0})},jt=e=>{e.key==="Enter"&&(e.preventDefault(),at())},st=e=>{S(r=>r.includes(e)?r.filter(i=>i!==e):[...r,e])},k=f.filter(e=>e.service_type.toLowerCase().includes(I.toLowerCase())),vt=k.length>0&&k.every(e=>m.includes(e.id)),Nt=()=>{const e=k.map(r=>r.id);if(vt){const r=new Set(e);S(i=>i.filter(o=>!r.has(o)))}else S(r=>Array.from(new Set([...r,...e])))},rt=async(e="A")=>{const r=window.open("","_blank");if(!r){alert("Gagal membuka jendela cetak. Pastikan izin popup browser diaktifkan.");return}const i=e==="B"?"Billing Statement B (Versi 2 Modern)":e==="B_CLASSIC"?"Billing Statement B (Versi 1 Klasik)":"Billing Statement";r.document.write(`
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
        `),r.document.close(),wt(!0);try{const o=new URLSearchParams;c&&c!=="all"&&o.append("customer_id",c),_&&_!=="all"&&o.append("shipper_id",_),T&&o.append("fumigator",T),P&&o.append("exclude_status",P),g&&o.append("date_from",g),u&&o.append("date_to",u),A&&o.append("date_type",A),L&&o.append("search",L),a.trashed&&o.append("trashed",a.trashed),a.sort_by&&o.append("sort_by",a.sort_by),a.sort_dir&&o.append("sort_dir",a.sort_dir),m.length>0&&m.forEach(s=>o.append("product_ids[]",s.toString()));const y=await fetch(`/karantina/print-data?${o.toString()}`);if(!y.ok)throw new Error("Gagal mengambil data dari server");const h=(await y.json()).data||[];if(h.length===0){r.document.body.innerHTML=`
                    <div style="text-align: center; margin-top: 50px; font-family: Arial, sans-serif;">
                        <p style="color: #ef4444; font-weight: 600;">Tidak ada data yang sesuai filter untuk dicetak.</p>
                        <button onclick="window.close()" style="padding: 6px 14px; cursor: pointer; border-radius: 4px; border: 1px solid #ccc;">Tutup</button>
                    </div>
                `;return}const nt=g?new Date(g).toLocaleDateString("id-ID"):"Semua",lt=u?new Date(u).toLocaleDateString("id-ID"):"Semua",B=`${nt} s/d ${lt}`,z="/logo-dss.png",Tt=new Date().toLocaleDateString("id-ID",{day:"numeric",month:"long",year:"numeric",hour:"2-digit",minute:"2-digit"});let F="-";if(c&&c!=="all"){const s=l.find(d=>String(d.id)===String(c));F=s?s.name:c}else{const s=Array.from(new Set(h.map(d=>d.customer_name).filter(Boolean)));s.length===1&&s[0]!=="-"?F=s[0]:s.length>1&&(F="Semua Customer")}const O=s=>{const d=new Date(s),M=String(d.getDate()).padStart(2,"0"),E=String(d.getMonth()+1).padStart(2,"0"),v=String(d.getFullYear()).slice(-2);return`${M}/${E}/${v}`},Dt=g&&u?`${O(g)} - ${O(u)}`:g||u?`${g?O(g):""} - ${u?O(u):""}`:B,Ct=h.reduce((s,d)=>s+(typeof d.price=="number"?d.price:0),0),Pt=h.reduce((s,d)=>{const M=typeof d.price=="number"?d.price:0;return s+(typeof d.ppn=="number"?d.ppn:Math.round(M*.11))},0),it=Ct+Pt,Wt=le(it);let J="";e==="B"?J=`
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
                        <img src="${z}" alt="DSS Logo" class="header-logo" onerror="this.onerror=null;this.src='/logo.png'">
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
                            <span class="meta-value" style="font-size: 9.5pt; color: #0284c7;">${F}</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-label">Periode</span>
                            <span>:</span>
                            <span class="meta-value">${Dt}</span>
                        </div>
                    </div>
                    <div class="meta-col" style="align-items: flex-end;">
                        <div class="meta-item">
                            <span class="meta-label" style="width: auto;">Total Kontainer :</span>
                            <span class="meta-value">${h.length} Unit</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-label" style="width: auto;">Dicetak :</span>
                            <span class="meta-value">${Tt} WIB</span>
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
                        ${h.map((s,d)=>{const E=d===h.length-1?"row-solid-bottom":"row-dashed",v=typeof s.price=="number"?s.price:0,R=typeof s.ppn=="number"?s.ppn:Math.round(v*.11),ot=typeof s.total=="number"?s.total:v+R;return`
                            <tr class="${E}">
                                <td class="text-center">${d+1}</td>
                                <td class="text-center container-code">${s.container_number}</td>
                                <td>${s.shipper_name??"-"}</td>
                                <td class="text-center">${Y(s.entry_date)}</td>
                                <td class="text-center">${Y(s.exit_date)}</td>
                                <td class="text-center">${Kt(s.price_type)}</td>
                                <td class="text-center">${s.service_type??"Fumigasi"}</td>
                                <td class="text-center">${s.fumigasi??"-"}</td>
                                <td>
                                    <div class="currency-cell">
                                        <span>Rp</span>
                                        <span>${j(v)}</span>
                                    </div>
                                </td>
                                <td>
                                    <div class="currency-cell">
                                        <span>Rp</span>
                                        <span>${j(R)}</span>
                                    </div>
                                </td>
                                <td>
                                    <div class="currency-cell" style="font-weight: 700;">
                                        <span>Rp</span>
                                        <span>${j(ot)}</span>
                                    </div>
                                </td>
                            </tr>
                            `}).join("")}
                        <tr class="summary-row">
                            <td colspan="8" class="text-right">
                                TOTAL KESELURUHAN (${h.length} Kontainer)
                            </td>
                            <td>
                                <div class="currency-cell">
                                    <span>Rp</span>
                                    <span>${j(Ct)}</span>
                                </div>
                            </td>
                            <td>
                                <div class="currency-cell">
                                    <span>Rp</span>
                                    <span>${j(Pt)}</span>
                                </div>
                            </td>
                            <td class="grand-total-highlight">
                                <div class="currency-cell" style="font-weight: 900; font-size: 9pt;">
                                    <span>Rp</span>
                                    <span>${j(it)}</span>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div class="footer-wrapper">
                    <div class="terbilang-card">
                        <span style="font-weight: 600; color: #64748b;">Terbilang: </span>
                        <span class="terbilang-text"># ${Wt} #</span>
                    </div>
                </div>
            </body>
            </html>
                `:e==="B_CLASSIC"?J=`
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
                    <img src="${z}" alt="DSS Logo" class="header-logo" onerror="this.onerror=null;this.src='/logo.png'">
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
                            <td class="meta-value">${F}</td>
                        </tr>
                        <tr>
                            <td class="meta-label">Periode</td>
                            <td class="meta-sep">:</td>
                            <td class="meta-value">${Dt}</td>
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
                        ${h.map((s,d)=>{const E=d===h.length-1?"row-solid-bottom":"row-dashed",v=typeof s.price=="number"?s.price:0,R=typeof s.ppn=="number"?s.ppn:Math.round(v*.11),ot=typeof s.total=="number"?s.total:v+R;return`
                            <tr class="${E}">
                                <td class="text-center">${d+1}</td>
                                <td class="text-center" style="font-weight: 700;">${s.container_number}</td>
                                <td class="text-center">${s.shipper_name??"-"}</td>
                                <td class="text-center">${Y(s.entry_date)}</td>
                                <td class="text-center">${Y(s.exit_date)}</td>
                                <td class="text-center">${Kt(s.price_type)}</td>
                                <td class="text-center">${s.service_type??"Fumigasi"}</td>
                                <td class="text-center">${s.fumigasi??"-"}</td>
                                <td>
                                    <div class="currency-cell">
                                        <span>Rp</span>
                                        <span>${j(v)}</span>
                                    </div>
                                </td>
                                <td>
                                    <div class="currency-cell">
                                        <span>Rp</span>
                                        <span>${j(R)}</span>
                                    </div>
                                </td>
                                <td>
                                    <div class="currency-cell">
                                        <span>Rp</span>
                                        <span>${j(ot)}</span>
                                    </div>
                                </td>
                            </tr>
                            `}).join("")}
                        <tr class="grand-total-row">
                            <td colspan="10" style="border: none; background: transparent;"></td>
                            <td class="grand-total-cell">
                                <div class="currency-cell" style="font-weight: 800;">
                                    <span>Rp</span>
                                    <span>${j(it)}</span>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </body>
            </html>
                `:J=`
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
                            <img src="${z}" alt="Logo" style="width: 55px; height: 55px; object-fit: contain;" onerror="this.onerror=null;this.src='/logo.png'">
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
                        <strong>Periode:</strong> ${B} &nbsp;|&nbsp;
                        <strong>Total:</strong> ${h.length} Kontainer
                    </div>
                    <div>
                        <strong>Dicetak pada:</strong> ${Tt} WIB
                    </div>
                </div>

                <table class="data-table">
                    <thead>
                        <tr>
                            <th style="width: 30px; text-align: center;">No</th>
                            <th>Nomor Kontainer</th>
                            <th>Nama Shipper</th>
                            <th>Fumigator</th>
                            <th style="text-align: center; width: 60px;">Size</th>
                            <th>Tanggal Masuk</th>
                            <th>Tanggal Keluar</th>
                            <th>Komoditi</th>
                            <th>Negara Tujuan</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${h.map((s,d)=>`
                            <tr>
                                <td class="text-center">${d+1}</td>
                                <td style="font-weight: 700; font-family: monospace;">${s.container_number}</td>
                                <td>${s.shipper_name??"-"}</td>
                                <td>${s.fumigasi??'<span class="text-gray-400">–</span>'}</td>
                                <td class="text-center">${Rt(s.price_type)}</td>
                                <td>${s.entry_date?Et(s.entry_date):'<span class="text-gray-400">–</span>'}</td>
                                <td>${s.exit_date?Et(s.exit_date):'<span class="text-gray-400">–</span>'}</td>
                                <td>${s.commodity??"-"}</td>
                                <td>${s.country??"-"}</td>
                            </tr>
                        `).join("")}
                    </tbody>
                </table>
            </body>
            </html>
            `,r.document.open(),r.document.write(J),r.document.close(),setTimeout(()=>{r.focus(),r.print()},300)}catch(o){console.error("Error saat mencetak billing statement:",o),r.document.body.innerHTML=`
                <div style="text-align: center; margin-top: 50px; font-family: Arial, sans-serif;">
                    <p style="color: #ef4444; font-weight: 600;">Terjadi kesalahan saat memuat seluruh data kontainer.</p>
                    <button onclick="window.close()" style="padding: 6px 14px; cursor: pointer; border-radius: 4px; border: 1px solid #ccc;">Tutup</button>
                </div>
            `}finally{wt(!1)}},D=({label:e,field:r,currentSort:i,currentDir:o})=>{const y=i===r&&o==="asc"?"desc":"asc";return t.jsxs(Qt,{href:route("index_karantina",{customer_id:c==="all"?void 0:c,shipper_id:_==="all"?void 0:_,fumigator:T?T.trim():void 0,exclude_status:P,date_from:g||void 0,date_to:u||void 0,date_type:A,product_ids:m.length>0?m:void 0,search:L||void 0,per_page:ft,sort_by:r,sort_dir:y}),preserveState:!0,preserveScroll:!0,className:"inline-flex items-center gap-1 font-semibold text-slate-700 hover:text-black transition-colors",children:[t.jsx("span",{children:e}),i===r?y==="asc"?t.jsx(xe,{className:"h-3.5 w-3.5 text-blue-600"}):t.jsx(me,{className:"h-3.5 w-3.5 text-blue-600"}):t.jsx(he,{className:"h-3.5 w-3.5 text-gray-400 opacity-60 hover:opacity-100"})]})},{props:U}=qt();return t.jsxs(Xt,{breadcrumbs:ge,children:[t.jsx(Gt,{title:"Karantina & Fumigasi - Depo Surabaya"}),t.jsxs("div",{className:"w-full space-y-6 px-4 py-6 sm:px-6 lg:px-8 bg-slate-50/50 min-h-screen",children:[((St=U.flash)==null?void 0:St.success)&&t.jsxs("div",{className:"flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-800 shadow-2xs",children:[t.jsx(oe,{className:"h-4 w-4 text-emerald-600 shrink-0"}),t.jsx("span",{children:U.flash.success})]}),((_t=U.flash)==null?void 0:_t.error)&&t.jsxs("div",{className:"flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-800 shadow-2xs",children:[t.jsx(mt,{className:"h-4 w-4 text-rose-600 shrink-0"}),t.jsx("span",{children:U.flash.error})]}),t.jsxs("div",{className:"flex flex-col sm:flex-row sm:items-center justify-between gap-4",children:[t.jsxs("div",{children:[t.jsxs("div",{className:"flex items-center gap-2.5",children:[t.jsx(de,{className:"h-7 w-7 text-gray-900"}),t.jsx("h1",{className:"text-2xl font-bold tracking-tight text-gray-900",children:"Karantina & Fumigasi"}),t.jsx("span",{className:"inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700 border border-slate-200",children:"Billing & Monitoring"})]}),t.jsx("p",{className:"text-xs text-gray-500 mt-1",children:"Kelola data pergerakan kontainer karantina, filter multi-parameter, dan cetak billing statement resmi."})]}),t.jsxs("div",{className:"flex flex-wrap items-center gap-2",children:[t.jsxs($,{variant:"outline",size:"sm",onClick:()=>Ot(!tt),className:"gap-1.5 h-9 text-xs border-gray-300 bg-white shadow-2xs",children:[t.jsx(ht,{className:"h-3.5 w-3.5 text-blue-600"}),t.jsx("span",{children:"Filter"}),tt?t.jsx(ce,{className:"h-3.5 w-3.5 text-gray-500"}):t.jsx(gt,{className:"h-3.5 w-3.5 text-gray-500"})]}),t.jsxs($,{type:"button",size:"sm",disabled:et,onClick:()=>rt("A"),className:"bg-gray-900 hover:bg-black text-white font-semibold text-xs h-9 px-3.5 gap-1.5 shadow-2xs disabled:opacity-70",title:"Cetak Billing Statement",children:[t.jsx(V,{className:`h-3.5 w-3.5 ${et?"animate-spin":""}`}),t.jsx("span",{children:"Billing Statement"})]}),t.jsxs(It,{children:[t.jsx(Bt,{asChild:!0,children:t.jsxs($,{type:"button",size:"sm",disabled:et,variant:"outline",className:"border-gray-300 text-gray-800 bg-white hover:bg-gray-50 font-semibold text-xs h-9 px-3.5 gap-1.5 shadow-2xs",title:"Pilih dan Cetak Billing Statement Format B",children:[t.jsx(V,{className:"h-3.5 w-3.5 text-gray-600"}),t.jsx("span",{children:"Billing Statement B"}),t.jsx(gt,{className:"h-3 w-3 text-gray-400 ml-0.5"})]})}),t.jsxs(zt,{align:"end",className:"w-72",children:[t.jsxs(Ft,{onClick:()=>rt("B"),className:"cursor-pointer flex flex-col items-start py-2.5 px-3",children:[t.jsxs("div",{className:"font-semibold text-xs text-gray-900 flex items-center gap-1.5",children:[t.jsx(V,{className:"h-3.5 w-3.5 text-blue-600"}),t.jsx("span",{children:"Versi 2 (Modern - A4 Landscape)"})]}),t.jsx("span",{className:"text-[11px] text-gray-500 mt-1 pl-5",children:"Desain modern, rekap total, terbilang resmi & kolom tanda tangan"})]}),t.jsxs(Ft,{onClick:()=>rt("B_CLASSIC"),className:"cursor-pointer flex flex-col items-start py-2.5 px-3 border-t border-gray-100",children:[t.jsxs("div",{className:"font-semibold text-xs text-gray-700 flex items-center gap-1.5",children:[t.jsx(V,{className:"h-3.5 w-3.5 text-gray-500"}),t.jsx("span",{children:"Versi 1 (Klasik - A4 Landscape)"})]}),t.jsx("span",{className:"text-[11px] text-gray-500 mt-1 pl-5",children:"Format tabel standar klasik / retro"})]})]})]})]})]}),tt&&t.jsxs("div",{className:"rounded-xl border border-gray-200 bg-white p-5 shadow-xs space-y-4",children:[t.jsxs("div",{className:"flex items-center justify-between border-b border-gray-100 pb-3",children:[t.jsxs("span",{className:"text-sm font-bold text-gray-800 flex items-center gap-2",children:[t.jsx(ht,{className:"h-4 w-4 text-blue-600"}),"Parameter Filter"]}),t.jsxs($,{variant:"ghost",size:"sm",onClick:Yt,className:"text-xs text-gray-500 hover:text-rose-600 gap-1.5 h-8 px-2",children:[t.jsx(pe,{className:"h-3.5 w-3.5"}),t.jsx("span",{children:"Reset Filter"})]})]}),t.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4",children:[t.jsxs("div",{className:"space-y-1.5",children:[t.jsx(C,{className:"text-xs font-semibold text-gray-700",children:"Customer"}),t.jsx(At,{options:Jt,value:c,onChange:e=>W(e||"all"),placeholder:"Semua Customer",searchPlaceholder:"Cari customer...",showClear:!1,className:"w-full text-xs h-9 bg-white"})]}),t.jsxs("div",{className:"space-y-1.5",children:[t.jsx(C,{className:"text-xs font-semibold text-gray-700",children:"Shipper"}),t.jsx(At,{options:Vt,value:_,onChange:e=>q(e||"all"),placeholder:"Semua Shipper",searchPlaceholder:"Cari shipper...",showClear:!1,className:"w-full text-xs h-9 bg-white"})]}),t.jsxs("div",{className:"space-y-1.5",children:[t.jsx(C,{className:"text-xs font-semibold text-gray-700",children:"Fumigator"}),t.jsx(ct,{type:"text",value:T,onChange:e=>G(e.target.value),onKeyDown:jt,placeholder:"Ketik nama fumigator...",className:"text-xs h-9 bg-white border-gray-200"})]}),t.jsxs("div",{className:"space-y-1.5",children:[t.jsxs("div",{className:"flex items-center justify-between",children:[t.jsx(C,{className:"text-xs font-semibold text-gray-700",children:"Jenis Layanan"}),m.length>0&&t.jsxs("span",{className:"text-[10px] text-blue-600 font-bold bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200",children:[m.length," dipilih"]})]}),t.jsxs(It,{children:[t.jsx(Bt,{asChild:!0,children:t.jsxs($,{variant:"outline",type:"button",className:"w-full justify-between border-gray-200 bg-white text-xs font-normal text-gray-800 shadow-2xs hover:bg-gray-50 h-9",children:[t.jsx("span",{className:"truncate",children:m.length===0?"Semua Layanan":m.length===1?((kt=f.find(e=>e.id===m[0]))==null?void 0:kt.service_type)||"1 Layanan":`${m.length} Layanan Dipilih`}),t.jsx(gt,{className:"ml-1.5 h-3.5 w-3.5 shrink-0 opacity-50"})]})}),t.jsxs(zt,{className:"w-80 p-2 shadow-lg",align:"start",children:[t.jsxs("div",{className:"flex items-center justify-between px-2 py-1.5 border-b border-gray-100 mb-2",children:[t.jsx("span",{className:"text-xs font-semibold text-gray-700",children:"Pilih Layanan"}),t.jsxs("div",{className:"flex gap-2 text-[11px]",children:[t.jsxs("button",{type:"button",onClick:e=>{e.preventDefault(),S(f.map(r=>r.id))},className:"text-blue-600 hover:underline font-medium",children:["Semua (",f.length,")"]}),t.jsx("span",{className:"text-gray-300",children:"|"}),t.jsx("button",{type:"button",onClick:e=>{e.preventDefault(),S([])},className:"text-gray-500 hover:underline",children:"Reset"})]})]}),t.jsxs("div",{className:"relative mb-2 px-1",children:[t.jsx(Mt,{className:"absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400"}),t.jsx(ct,{type:"text",placeholder:"Cari layanan...",value:I,onChange:e=>yt(e.target.value),onKeyDown:e=>e.stopPropagation(),className:"h-8 pl-8 pr-7 text-xs rounded-md border-gray-200"}),I&&t.jsx("button",{type:"button",onClick:()=>yt(""),className:"absolute right-3 top-2 text-gray-400 hover:text-gray-600",children:t.jsx(mt,{className:"h-3.5 w-3.5"})})]}),k.length>0&&t.jsxs("div",{onClick:e=>{e.preventDefault(),Nt()},className:"flex items-center gap-2 px-2 py-1.5 mb-1.5 rounded bg-slate-50 hover:bg-slate-100 cursor-pointer text-xs font-medium text-slate-700 border border-slate-200 transition-colors",children:[t.jsx(Lt,{checked:vt,onCheckedChange:Nt,className:"h-3.5 w-3.5"}),t.jsx("span",{className:"truncate text-xs",children:I?`Centang Semua ("${I}")`:`Centang Semua (${k.length})`})]}),t.jsx("div",{className:"space-y-0.5 max-h-56 overflow-y-auto",children:k.length===0?t.jsx("div",{className:"py-4 text-center text-xs text-gray-400",children:"Tidak ada layanan cocok"}):k.map(e=>{const r=m.includes(e.id);return t.jsxs("div",{onClick:i=>{i.preventDefault(),st(e.id)},className:`flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer text-xs transition-colors ${r?"bg-blue-50 text-blue-900 font-medium":"hover:bg-gray-100 text-gray-700"}`,children:[t.jsx(Lt,{checked:r,onCheckedChange:()=>st(e.id),className:"h-3.5 w-3.5"}),t.jsx("span",{className:"truncate",children:e.service_type})]},e.id)})})]})]})]})]}),t.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1",children:[t.jsxs("div",{className:"space-y-1.5",children:[t.jsx(C,{className:"text-xs font-semibold text-gray-700",children:"Status Exclude"}),t.jsxs(Zt,{value:P,onValueChange:Q,children:[t.jsx(te,{className:"w-full text-xs h-9 bg-white border-gray-200",children:t.jsx(ee,{})}),t.jsxs(ae,{children:[t.jsx(pt,{value:"active",children:"Hanya yang Diikutsertakan (Default)"}),t.jsx(pt,{value:"all",children:"Semua (Termasuk yang di-exclude)"}),t.jsx(pt,{value:"excluded",children:"Hanya yang Di-exclude"})]})]})]}),t.jsxs("div",{className:"space-y-1.5 sm:col-span-2 lg:col-span-3",children:[t.jsxs("div",{className:"flex items-center justify-between",children:[t.jsx(C,{className:"text-xs font-semibold text-gray-700",children:"Rentang Tanggal"}),t.jsxs("div",{className:"flex items-center gap-1.5",children:[t.jsx("span",{className:"text-[11px] text-gray-500",children:"Berdasarkan:"}),t.jsxs("select",{value:A,onChange:e=>X(e.target.value),className:"text-[11px] font-semibold text-blue-600 bg-blue-50 border border-blue-200 rounded px-1.5 py-0.5 cursor-pointer focus:ring-0",children:[t.jsx("option",{value:"entry_date",children:"Tgl Masuk"}),t.jsx("option",{value:"eir_date",children:"Tgl EIR"}),t.jsx("option",{value:"exit_date",children:"Tgl Keluar"})]})]})]}),t.jsx(ie,{startDate:g,endDate:u,onChange:({startDate:e,endDate:r})=>{K(e),H(r)},onApply:({startDate:e,endDate:r})=>{K(e),H(r),at({date_from:e,date_to:r})},placeholder:"Semua rentang tanggal...",className:"w-full",align:"right"})]})]}),m.length>0&&t.jsxs("div",{className:"flex flex-wrap items-center gap-1.5 border-t border-gray-100 pt-2.5",children:[t.jsx("span",{className:"text-[11px] text-gray-500 font-medium",children:"Layanan Terpilih:"}),m.map(e=>{const r=f.find(i=>i.id===e);return r?t.jsxs("span",{className:"inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 border border-blue-200",children:[r.service_type,t.jsx("button",{type:"button",onClick:()=>st(e),className:"hover:text-blue-900 focus:outline-none",children:t.jsx(mt,{className:"h-3 w-3"})})]},e):null}),t.jsx("button",{type:"button",onClick:()=>S([]),className:"text-[11px] text-gray-500 hover:text-rose-600 underline ml-1",children:"Hapus Semua"})]}),t.jsxs("div",{className:"flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-gray-100",children:[t.jsxs("div",{className:"relative w-full sm:max-w-md",children:[t.jsx(Mt,{className:"absolute left-3 top-2.5 h-4 w-4 text-gray-400"}),t.jsx(ct,{type:"text",placeholder:"Cari nomor kontainer, customer, shipper, atau komoditi... (Tekan Enter)",value:L,onChange:e=>Z(e.target.value),onKeyDown:jt,className:"pl-9 text-xs h-9 bg-white border-gray-200"})]}),t.jsx("div",{className:"flex items-center gap-2 w-full sm:w-auto justify-end",children:t.jsx($,{size:"sm",onClick:()=>at(),className:"bg-gray-900 hover:bg-black text-white font-semibold text-xs h-9 px-5 shadow-2xs",children:"Terapkan Filter"})})]})]}),t.jsxs("div",{className:"rounded-xl border border-gray-200 bg-white shadow-xs p-5 space-y-4",children:[t.jsx("div",{className:"flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3",children:t.jsxs("div",{children:[t.jsx("h2",{className:"text-base font-bold text-gray-900",children:"Daftar Kontainer Karantina & Fumigasi"}),t.jsxs("p",{className:"text-xs text-gray-500 mt-0.5",children:["Menampilkan total ",t.jsx("span",{className:"font-bold text-gray-800",children:n.total??n.data.length})," kontainer sesuai kriteria filter aktif."]})]})}),t.jsx("div",{className:"overflow-x-auto rounded-lg border border-gray-200",children:t.jsxs(se,{children:[t.jsx(re,{className:"bg-slate-50 text-xs font-semibold text-slate-700 border-b border-gray-200",children:t.jsxs(xt,{className:"hover:bg-transparent",children:[t.jsx(N,{className:"px-4 py-3.5 whitespace-nowrap",children:t.jsx(D,{label:"Nomor Kontainer",field:"container_number",currentSort:a.sort_by,currentDir:a.sort_dir})}),t.jsx(N,{className:"px-4 py-3.5 whitespace-nowrap",children:t.jsx(D,{label:"Nama Shipper",field:"shippers.name",currentSort:a.sort_by,currentDir:a.sort_dir})}),t.jsx(N,{className:"px-4 py-3.5 text-center whitespace-nowrap",children:"Size"}),t.jsx(N,{className:"px-4 py-3.5 whitespace-nowrap",children:t.jsx(D,{label:"Tanggal Masuk",field:"entry_date",currentSort:a.sort_by,currentDir:a.sort_dir})}),t.jsx(N,{className:"px-4 py-3.5 whitespace-nowrap",children:t.jsx(D,{label:"Tanggal EIR",field:"eir_date",currentSort:a.sort_by,currentDir:a.sort_dir})}),t.jsx(N,{className:"px-4 py-3.5 whitespace-nowrap",children:t.jsx(D,{label:"Tanggal Keluar",field:"exit_date",currentSort:a.sort_by,currentDir:a.sort_dir})}),t.jsx(N,{className:"px-4 py-3.5 whitespace-nowrap",children:"Komoditi"}),t.jsx(N,{className:"px-4 py-3.5 whitespace-nowrap",children:"Negara Tujuan"}),t.jsx(N,{className:"px-4 py-3.5 whitespace-nowrap",children:t.jsx(D,{label:"Fumigator",field:"fumigasi",currentSort:a.sort_by,currentDir:a.sort_dir})})]})}),t.jsx(ne,{className:"divide-y divide-gray-100 bg-white",children:n.data.length===0?t.jsx(xt,{children:t.jsx(w,{colSpan:9,className:"py-12 text-center text-sm text-gray-500",children:t.jsxs("div",{className:"flex flex-col items-center justify-center gap-1.5",children:[t.jsx(ht,{className:"h-6 w-6 text-gray-300"}),t.jsx("span",{className:"font-semibold text-gray-700",children:"Tidak ada data kontainer yang sesuai filter."}),t.jsx("span",{className:"text-xs text-gray-400",children:"Silakan ubah parameter filter atau klik Reset Filter."})]})})}):n.data.map(e=>{var r,i,o,y;return t.jsxs(xt,{className:"hover:bg-slate-50/70 transition-colors",children:[t.jsx(w,{className:"px-4 py-3 text-sm font-bold text-slate-900 font-mono",children:e.container_number}),t.jsx(w,{className:"px-4 py-3 text-sm text-slate-800",children:((i=(r=e.order)==null?void 0:r.shipper)==null?void 0:i.name)??e.shipper_name??"-"}),t.jsx(w,{className:"px-4 py-3 text-sm text-center",children:t.jsx("span",{className:"inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200",children:Rt(e.price_type)})}),t.jsx(w,{className:"px-4 py-3 text-sm",children:ut(e.entry_date)}),t.jsx(w,{className:"px-4 py-3 text-sm",children:ut(e.eir_date)}),t.jsx(w,{className:"px-4 py-3 text-sm",children:ut(e.exit_date)}),t.jsx(w,{className:"px-4 py-3 text-sm text-slate-800",children:e.commodity??"-"}),t.jsx(w,{className:"px-4 py-3 text-sm text-slate-800",children:e.country??"-"}),t.jsx(w,{className:"px-4 py-3 text-sm",children:((o=e.order)==null?void 0:o.fumigasi)??e.fumigasi?t.jsx("span",{className:"inline-flex items-center rounded-md bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800 border border-amber-200",children:((y=e.order)==null?void 0:y.fumigasi)??e.fumigasi}):t.jsx("span",{className:"text-gray-400",children:"–"})})]},e.id)})})]})}),t.jsxs("div",{className:"flex flex-col sm:flex-row items-center justify-between gap-3 pt-2",children:[t.jsxs("p",{className:"text-xs text-gray-500",children:["Menampilkan ",t.jsx("span",{className:"font-semibold text-gray-800",children:n.from??0})," sampai"," ",t.jsx("span",{className:"font-semibold text-gray-800",children:n.to??0})," dari"," ",t.jsx("span",{className:"font-semibold text-gray-800",children:n.total??n.data.length})," kontainer"]}),t.jsx("div",{className:"flex flex-wrap justify-center gap-1",children:n.links.map((e,r)=>e.url?t.jsx($,{variant:e.active?"default":"outline",disabled:!e.url,onClick:()=>dt.get(e.url,{},{preserveState:!0,preserveScroll:!0}),className:`px-3 py-1 text-xs font-medium h-8 ${e.active?"bg-gray-900 text-white hover:bg-black":"text-gray-700 bg-white border-gray-200"}`,children:e.label.replace(/&laquo; Previous|Next &raquo;/,i=>i.includes("Previous")?"← Prev":i.includes("Next")?"Next →":i)},r):t.jsx("span",{className:"px-2.5 py-1 text-xs text-gray-400",children:"..."},r))})]})]})]})]})}export{Oe as default};
