import{r as x,K as xt,j as e,L as mt,$ as Ke,S as ee}from"./app-B-kZz2hh.js";import{A as ht,a as ut,b as gt,c as ft,d as bt}from"./app-layout-VIUNX0QL.js";import{B as $}from"./button-CaRWaqlO.js";import{I as me}from"./input-9eaN7YsM.js";import{L as B}from"./label-sgfCnrAP.js";import{S as yt,a as wt,b as jt,c as vt,d as he}from"./select-D_YeVBS7.js";import{S as Ee}from"./searchable-select-CINUUPoi.js";import{T as Nt,a as St,b as ue,c as v,d as _t,e as y}from"./table-vx6HrDsg.js";import{C as Re}from"./checkbox-BXZdEZ0V.js";import{X as Oe,D as He,b as Ue,c as Je,d as ge,S as Ye,e as kt}from"./global-container-search-Df1Tj0Nk.js";import{t as Dt}from"./terbilang-DIgi2L4g.js";import{D as $t}from"./date-range-picker-B4EDavey.js";import{C as Ve}from"./check-0jESA3BR.js";import{F as fe}from"./filter-CrmIQNmY.js";import{C as Ct}from"./chevron-up-CdhBhGXv.js";import{C as be}from"./chevron-down-Zn-b1Z2A.js";import{P as te}from"./printer-it1FL2LN.js";import{F as Tt}from"./file-text-Cy9l6kFk.js";import{R as Pt}from"./rotate-ccw-Bmw1ISsC.js";import{S as At}from"./sparkles-DkTAHfHQ.js";import{A as Lt,a as Ft,b as It}from"./arrow-up-CB2P-1s_.js";/* empty css            */import"./index-PP1qHFyS.js";import"./index-MS8UyAx2.js";import"./Combination-s3E4MMcE.js";import"./index-DNwYDPHv.js";import"./truck-Cf5L5LIl.js";import"./index-BsMJkQq6.js";import"./app-logo-icon-BCZVp2WL.js";import"./chevron-left-C7I2NcpL.js";const qe=["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];function ye(n){if(!n)return e.jsx("span",{className:"text-gray-400",children:"–"});const l=new Date(n);if(isNaN(l.getTime()))return e.jsx("span",{className:"text-gray-400",children:"–"});const h=String(l.getDate()).padStart(2,"0"),g=qe[l.getMonth()],w=l.getFullYear(),a=String(l.getHours()).padStart(2,"0"),m=String(l.getMinutes()).padStart(2,"0");return e.jsxs("div",{className:"flex flex-col leading-tight whitespace-nowrap",children:[e.jsxs("span",{className:"font-semibold text-slate-800 text-xs",children:[h," ",g," ",w]}),e.jsxs("span",{className:"text-[11px] text-slate-500 font-normal",children:[a,":",m," WIB"]})]})}function Ge(n){if(!n)return"–";const l=new Date(n);if(isNaN(l.getTime()))return"–";const h=String(l.getDate()).padStart(2,"0"),g=qe[l.getMonth()],w=l.getFullYear(),a=String(l.getHours()).padStart(2,"0"),m=String(l.getMinutes()).padStart(2,"0");return`${h} ${g} ${w}, ${a}:${m}`}function We(n,l){if(!n)return l||"-";const h=String(n).trim();return h.toLowerCase().endsWith("ft")?h:h==="20"||h==="40"?`${h}ft`:h||l||"-"}function ae(n){if(!n)return"-";try{const l=new Date(n);if(isNaN(l.getTime()))return String(n);const h=String(l.getDate()).padStart(2,"0"),g=String(l.getMonth()+1).padStart(2,"0"),w=l.getFullYear(),a=String(l.getHours()).padStart(2,"0"),m=String(l.getMinutes()).padStart(2,"0");return`${h}-${g}-${w} / ${a}.${m}`}catch{return String(n)}}function V(n){if(!n)return"-";const l=String(n).toLowerCase();return l.includes("20")?"20'":l.includes("40")?"40'":l.includes("45")?"45'":n}function S(n){return new Intl.NumberFormat("id-ID",{minimumFractionDigits:0,maximumFractionDigits:0}).format(n)}const Mt=[{title:"Dashboard",href:"/dashboard"},{title:"Karantina & Fumigasi",href:"/karantina"}];function ma({orders:n,customers:l=[],shippers:h=[],products:g=[],filters:w}){var Pe,Ae,Le;const a=w||{},[m,se]=x.useState(a.customer_id||"all"),[C,re]=x.useState(a.shipper_id||"all"),[A,ne]=x.useState(a.fumigator||""),[K,le]=x.useState(a.exclude_status||"active"),[f,G]=x.useState(a.date_from||""),[b,W]=x.useState(a.date_to||""),[E,ie]=x.useState(a.date_type||"entry_date"),[R,oe]=x.useState(a.search||""),[we,je]=x.useState(String(a.per_page||25)),Qe=Array.isArray(w==null?void 0:w.product_ids)?w.product_ids.map(Number).filter(t=>!isNaN(t)):[],[c,_]=x.useState(Qe),[O,ve]=x.useState(""),[de,Xe]=x.useState(!0),[ce,Ne]=x.useState(!1),Ze=x.useMemo(()=>[{value:"all",label:"Semua Customer"},...l.map(t=>({value:String(t.id),label:t.name}))],[l]),et=x.useMemo(()=>[{value:"all",label:"Semua Shipper"},...h.map(t=>({value:String(t.id),label:t.name}))],[h]);x.useEffect(()=>{se(a.customer_id||"all"),re(a.shipper_id||"all"),ne(a.fumigator||""),le(a.exclude_status||"active"),G(a.date_from||""),W(a.date_to||""),ie(a.date_type||"entry_date"),oe(a.search||""),je(String(a.per_page||25));const t=Array.isArray(a.product_ids)?a.product_ids.map(Number).filter(s=>!isNaN(s)):[];_(t)},[a.customer_id,a.shipper_id,a.fumigator,a.exclude_status,a.date_from,a.date_to,a.date_type,a.search,a.per_page,a.product_ids]);const pe=t=>{const s=(t==null?void 0:t.customer_id)!==void 0?t.customer_id:m,o=(t==null?void 0:t.shipper_id)!==void 0?t.shipper_id:C,i=(t==null?void 0:t.fumigator)!==void 0?t.fumigator:A,j=(t==null?void 0:t.product_ids)!==void 0?t.product_ids:c,H=(t==null?void 0:t.exclude_status)!==void 0?t.exclude_status:K,p=(t==null?void 0:t.date_from)!==void 0?t.date_from:f,I=(t==null?void 0:t.date_to)!==void 0?t.date_to:b,M=(t==null?void 0:t.date_type)!==void 0?t.date_type:E,U=(t==null?void 0:t.search)!==void 0?t.search:R,J=(t==null?void 0:t.per_page)!==void 0?t.per_page:we;ee.get(route("index_karantina"),{customer_id:s==="all"?void 0:s,shipper_id:o==="all"?void 0:o,fumigator:i?i.trim():void 0,product_ids:j.length>0?j:void 0,exclude_status:H,date_from:p||void 0,date_to:I||void 0,date_type:M,search:U?U.trim():void 0,per_page:J,sort_by:a.sort_by||void 0,sort_dir:a.sort_dir||void 0,trashed:a.trashed||void 0},{preserveState:!0,preserveScroll:!0})},[Se,_e]=x.useState(!1),tt=()=>{_e(!0),ee.post(route("karantina.save_default_products"),{product_ids:c},{preserveScroll:!0,onFinish:()=>_e(!1)})},at=()=>{se("all"),re("all"),ne(""),_(a.default_product_ids||[]),le("active"),G(""),W(""),ie("entry_date"),oe(""),je("25"),ee.get(route("index_karantina"),{},{preserveScroll:!0})},ke=t=>{t.key==="Enter"&&(t.preventDefault(),pe())},L=x.useMemo(()=>(a.default_product_ids||[]).map(Number).filter(t=>!isNaN(t)),[a.default_product_ids]),F=x.useMemo(()=>{if(c.length!==L.length)return!1;const t=new Set(c);return L.every(s=>t.has(s))},[c,L]),De=x.useMemo(()=>g.filter(t=>{const s=(t.service_type||"").toLowerCase();return s.includes("karantina")||s.includes("fumigasi")}).map(t=>t.id),[g]),$e=t=>{_(s=>s.includes(t)?s.filter(o=>o!==t):[...s,t])},st=()=>{_(L)},rt=()=>{_(De)},nt=()=>{_(g.map(t=>t.id))},lt=()=>{_([])},T=g.filter(t=>t.service_type.toLowerCase().includes(O.toLowerCase())),Ce=T.length>0&&T.every(t=>c.includes(t.id)),Te=()=>{const t=T.map(s=>s.id);if(Ce){const s=new Set(t);_(o=>o.filter(i=>!s.has(i)))}else _(s=>Array.from(new Set([...s,...t])))},q=async(t="A")=>{const s=window.open("","_blank");if(!s){alert("Gagal membuka jendela cetak. Pastikan izin popup browser diaktifkan.");return}const o=t==="B"?"Billing Statement":t==="B_CLASSIC"?"Billing Statement (Klasik)":t==="C"?"Laporan Pemeriksaan On-Chassis":t==="D"?"Laporan Fumigasi B":"Laporan Fumigasi";s.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Menyiapkan ${o}...</title>
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
                <div style="font-size: 15px; font-weight: 600;">Menyiapkan data ${o}...</div>
                <div style="font-size: 12px; color: #64748b; margin-top: 5px;">Total data: ${n.total??n.data.length} kontainer</div>
            </body>
            </html>
        `),s.document.close(),Ne(!0);try{const i=new URLSearchParams;m&&m!=="all"&&i.append("customer_id",m),C&&C!=="all"&&i.append("shipper_id",C),A&&i.append("fumigator",A),K&&i.append("exclude_status",K),f&&i.append("date_from",f),b&&i.append("date_to",b),E&&i.append("date_type",E),R&&i.append("search",R),a.trashed&&i.append("trashed",a.trashed),a.sort_by&&i.append("sort_by",a.sort_by),a.sort_dir&&i.append("sort_dir",a.sort_dir),c.length>0&&c.forEach(r=>i.append("product_ids[]",r.toString()));const j=await fetch(`/karantina/print-data?${i.toString()}`);if(!j.ok)throw new Error("Gagal mengambil data dari server");const p=(await j.json()).data||[];if(p.length===0){s.document.body.innerHTML=`
                    <div style="text-align: center; margin-top: 50px; font-family: Arial, sans-serif;">
                        <p style="color: #ef4444; font-weight: 600;">Tidak ada data yang sesuai filter untuk dicetak.</p>
                        <button onclick="window.close()" style="padding: 6px 14px; cursor: pointer; border-radius: 4px; border: 1px solid #ccc;">Tutup</button>
                    </div>
                `;return}const I=f?new Date(f).toLocaleDateString("id-ID"):"Semua",M=b?new Date(b).toLocaleDateString("id-ID"):"Semua",U=`${I} s/d ${M}`,J="/logo-dss.png",Fe=new Date().toLocaleDateString("id-ID",{day:"numeric",month:"long",year:"numeric",hour:"2-digit",minute:"2-digit"});let Y="-";if(m&&m!=="all"){const r=l.find(d=>String(d.id)===String(m));Y=r?r.name:m}else{const r=Array.from(new Set(p.map(d=>d.customer_name).filter(Boolean)));r.length===1&&r[0]!=="-"?Y=r[0]:r.length>1&&(Y="Semua Customer")}const X=r=>{const d=new Date(r),k=String(d.getDate()).padStart(2,"0"),D=String(d.getMonth()+1).padStart(2,"0"),N=String(d.getFullYear()).slice(-2);return`${k}/${D}/${N}`},Ie=f&&b?`${X(f)} - ${X(b)}`:f||b?`${f?X(f):""} - ${b?X(b):""}`:U,Me=p.reduce((r,d)=>r+(typeof d.price=="number"?d.price:0),0),ze=p.reduce((r,d)=>{const k=typeof d.price=="number"?d.price:0;return r+(typeof d.ppn=="number"?d.ppn:Math.round(k*.11))},0),xe=Me+ze,it=Dt(xe),ot=p.filter(r=>V(r.price_type)==="20'").length,dt=p.filter(r=>V(r.price_type)==="40'").length,Be=p.filter(r=>V(r.price_type)==="45'").length,ct=[`20': ${ot} Kontainer`,`40': ${dt} Kontainer`,...Be>0?[`45': ${Be} Kontainer`]:[],`Total: ${p.length} Kontainer`].join(" | ");let Z="";if(t==="B")Z=`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Billing Statement - PT. Depo Surabaya Sejahtera</title>
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
                        <img src="${J}" alt="DSS Logo" class="header-logo" onerror="this.onerror=null;this.src='/logo.png'">
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
                            <span class="meta-value" style="font-size: 9.5pt; color: #0284c7;">${Y}</span>
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
                            <span class="meta-value">${p.length} Unit</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-label" style="width: auto;">Dicetak :</span>
                            <span class="meta-value">${Fe} WIB</span>
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
                        ${p.map((r,d)=>{const D=d===p.length-1?"row-solid-bottom":"row-dashed",N=typeof r.price=="number"?r.price:0,z=typeof r.ppn=="number"?r.ppn:Math.round(N*.11),u=typeof r.total=="number"?r.total:N+z;return`
                            <tr class="${D}">
                                <td class="text-center">${d+1}</td>
                                <td class="text-center container-code">${r.container_number}</td>
                                <td>${r.shipper_name??"-"}</td>
                                <td class="text-center">${ae(r.entry_date)}</td>
                                <td class="text-center">${ae(r.exit_date)}</td>
                                <td class="text-center">${V(r.price_type)}</td>
                                <td class="text-center">${r.service_type??"Fumigasi"}</td>
                                <td class="text-center">${r.fumigasi??"-"}</td>
                                <td>
                                    <div class="currency-cell">
                                        <span>Rp</span>
                                        <span>${S(N)}</span>
                                    </div>
                                </td>
                                <td>
                                    <div class="currency-cell">
                                        <span>Rp</span>
                                        <span>${S(z)}</span>
                                    </div>
                                </td>
                                <td>
                                    <div class="currency-cell" style="font-weight: 700;">
                                        <span>Rp</span>
                                        <span>${S(u)}</span>
                                    </div>
                                </td>
                            </tr>
                            `}).join("")}
                        <tr class="summary-row">
                            <td colspan="8" class="text-right">
                                TOTAL KESELURUHAN (${ct})
                            </td>
                            <td>
                                <div class="currency-cell">
                                    <span>Rp</span>
                                    <span>${S(Me)}</span>
                                </div>
                            </td>
                            <td>
                                <div class="currency-cell">
                                    <span>Rp</span>
                                    <span>${S(ze)}</span>
                                </div>
                            </td>
                            <td class="grand-total-highlight">
                                <div class="currency-cell" style="font-weight: 900; font-size: 9pt;">
                                    <span>Rp</span>
                                    <span>${S(xe)}</span>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div class="footer-wrapper">
                    <div class="terbilang-card">
                        <span style="font-weight: 600; color: #64748b;">Terbilang: </span>
                        <span class="terbilang-text"># ${it} #</span>
                    </div>
                </div>
            </body>
            </html>
                `;else if(t==="B_CLASSIC")Z=`
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
                    <img src="${J}" alt="DSS Logo" class="header-logo" onerror="this.onerror=null;this.src='/logo.png'">
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
                            <td class="meta-value">${Y}</td>
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
                        ${p.map((r,d)=>{const D=d===p.length-1?"row-solid-bottom":"row-dashed",N=typeof r.price=="number"?r.price:0,z=typeof r.ppn=="number"?r.ppn:Math.round(N*.11),u=typeof r.total=="number"?r.total:N+z;return`
                            <tr class="${D}">
                                <td class="text-center">${d+1}</td>
                                <td class="text-center" style="font-weight: 700;">${r.container_number}</td>
                                <td class="text-center">${r.shipper_name??"-"}</td>
                                <td class="text-center">${ae(r.entry_date)}</td>
                                <td class="text-center">${ae(r.exit_date)}</td>
                                <td class="text-center">${V(r.price_type)}</td>
                                <td class="text-center">${r.service_type??"Fumigasi"}</td>
                                <td class="text-center">${r.fumigasi??"-"}</td>
                                <td>
                                    <div class="currency-cell">
                                        <span>Rp</span>
                                        <span>${S(N)}</span>
                                    </div>
                                </td>
                                <td>
                                    <div class="currency-cell">
                                        <span>Rp</span>
                                        <span>${S(z)}</span>
                                    </div>
                                </td>
                                <td>
                                    <div class="currency-cell">
                                        <span>Rp</span>
                                        <span>${S(u)}</span>
                                    </div>
                                </td>
                            </tr>
                            `}).join("")}
                        <tr class="grand-total-row">
                            <td colspan="10" style="border: none; background: transparent;"></td>
                            <td class="grand-total-cell">
                                <div class="currency-cell" style="font-weight: 800;">
                                    <span>Rp</span>
                                    <span>${S(xe)}</span>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </body>
            </html>
                `;else{const r=t==="C",d=t==="D",k=t==="A",D=t==="A"||t==="D";Z=`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>${t==="C"?"Laporan Pemeriksaan On-Chassis":t==="D"?"Laporan Fumigasi B":"Laporan Fumigasi"} - PT. Depo Surabaya Sejahtera</title>
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
                            <img src="${J}" alt="Logo" style="width: 55px; height: 55px; object-fit: contain;" onerror="this.onerror=null;this.src='/logo.png'">
                        </td>
                        <td style="vertical-align: middle;">
                            <div class="company-name">PT. DEPO SURABAYA SEJAHTERA</div>
                            <div class="company-address">
                                Jl. Tanjung Sadari No. 90 (Tanjung Batu No. 1) | Telp. 031-353 9484, 031-3539485 | Fax. 031-3539482
                            </div>
                        </td>
                        <td style="text-align: right; vertical-align: middle;">
                            <div class="report-title">${t==="C"?"LAPORAN PEMERIKSAAN ON-CHASSIS":"LAPORAN FUMIGASI"}</div>
                        </td>
                    </tr>
                </table>

                <div class="filter-info">
                    <div>
                        <strong>Periode:</strong> ${U} &nbsp;|&nbsp;
                        <strong>Total:</strong> ${p.length} Kontainer
                    </div>
                    <div>
                        <strong>Dicetak pada:</strong> ${Fe} WIB
                    </div>
                </div>

                <table class="data-table">
                    <thead>
                        <tr>
                            <th style="width: 30px; text-align: center;">No</th>
                            <th>Nomor Kontainer</th>
                            ${k?"<th>Customer</th>":""}
                            <th>Nama Shipper</th>
                            ${D?"<th>Fumigator</th>":""}
                            <th style="text-align: center; width: 60px;">Size</th>
                            <th>Tanggal Masuk</th>
                            <th>Tanggal Keluar</th>
                            <th>Komoditi</th>
                            <th>Negara Tujuan</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${p.map((u,pt)=>`
                            <tr>
                                <td class="text-center">${pt+1}</td>
                                <td style="font-weight: 700; font-family: monospace;">${u.container_number}</td>
                                ${k?`<td>${u.customer_name??"-"}</td>`:""}
                                <td>${u.shipper_name??"-"}</td>
                                ${D?`<td>${u.fumigasi??'<span class="text-gray-400">–</span>'}</td>`:""}
                                <td class="text-center">${We(u.price_type)}</td>
                                <td>${u.entry_date?Ge(u.entry_date):'<span class="text-gray-400">–</span>'}</td>
                                <td>${u.exit_date?Ge(u.exit_date):'<span class="text-gray-400">–</span>'}</td>
                                <td>${u.commodity??"-"}</td>
                                <td>${u.country??"-"}</td>
                            </tr>
                        `).join("")}
                    </tbody>
                </table>
            </body>
            </html>
            `}s.document.open(),s.document.write(Z),s.document.close(),setTimeout(()=>{s.focus(),s.print()},300)}catch(i){console.error("Error saat mencetak billing statement:",i),s.document.body.innerHTML=`
                <div style="text-align: center; margin-top: 50px; font-family: Arial, sans-serif;">
                    <p style="color: #ef4444; font-weight: 600;">Terjadi kesalahan saat memuat seluruh data kontainer.</p>
                    <button onclick="window.close()" style="padding: 6px 14px; cursor: pointer; border-radius: 4px; border: 1px solid #ccc;">Tutup</button>
                </div>
            `}finally{Ne(!1)}},P=({label:t,field:s,currentSort:o,currentDir:i})=>{const j=o===s&&i==="asc"?"desc":"asc";return e.jsxs(Ke,{href:route("index_karantina",{customer_id:m==="all"?void 0:m,shipper_id:C==="all"?void 0:C,fumigator:A?A.trim():void 0,exclude_status:K,date_from:f||void 0,date_to:b||void 0,date_type:E,product_ids:c.length>0?c:void 0,search:R||void 0,per_page:we,sort_by:s,sort_dir:j}),preserveState:!0,preserveScroll:!0,className:"inline-flex items-center gap-1 font-semibold text-slate-700 hover:text-black transition-colors",children:[e.jsx("span",{children:t}),o===s?j==="asc"?e.jsx(Lt,{className:"h-3.5 w-3.5 text-blue-600"}):e.jsx(Ft,{className:"h-3.5 w-3.5 text-blue-600"}):e.jsx(It,{className:"h-3.5 w-3.5 text-gray-400 opacity-60 hover:opacity-100"})]})},{props:Q}=xt();return e.jsxs(ht,{breadcrumbs:Mt,children:[e.jsx(mt,{title:"Karantina & Fumigasi - Depo Surabaya"}),e.jsxs("div",{className:"w-full space-y-6 px-4 py-6 sm:px-6 lg:px-8 bg-slate-50/50 min-h-screen",children:[((Pe=Q.flash)==null?void 0:Pe.success)&&e.jsxs("div",{className:"flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-800 shadow-2xs",children:[e.jsx(Ve,{className:"h-4 w-4 text-emerald-600 shrink-0"}),e.jsx("span",{children:Q.flash.success})]}),((Ae=Q.flash)==null?void 0:Ae.error)&&e.jsxs("div",{className:"flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-800 shadow-2xs",children:[e.jsx(Oe,{className:"h-4 w-4 text-rose-600 shrink-0"}),e.jsx("span",{children:Q.flash.error})]}),e.jsxs("div",{className:"flex flex-col sm:flex-row sm:items-center justify-between gap-4",children:[e.jsxs("div",{children:[e.jsxs("div",{className:"flex items-center gap-2.5",children:[e.jsx(ut,{className:"h-7 w-7 text-gray-900"}),e.jsx("h1",{className:"text-2xl font-bold tracking-tight text-gray-900",children:"Karantina & Fumigasi"}),e.jsx("span",{className:"inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700 border border-slate-200",children:"Billing & Monitoring"})]}),e.jsx("p",{className:"text-xs text-gray-500 mt-1",children:"Kelola data pergerakan kontainer karantina, filter multi-parameter, dan cetak billing statement resmi."})]}),e.jsxs("div",{className:"flex flex-wrap items-center gap-2",children:[e.jsxs($,{variant:"outline",size:"sm",onClick:()=>Xe(!de),className:"gap-1.5 h-9 text-xs border-gray-300 bg-white shadow-2xs",children:[e.jsx(fe,{className:"h-3.5 w-3.5 text-blue-600"}),e.jsx("span",{children:"Filter"}),de?e.jsx(Ct,{className:"h-3.5 w-3.5 text-gray-500"}):e.jsx(be,{className:"h-3.5 w-3.5 text-gray-500"})]}),e.jsxs($,{type:"button",size:"sm",disabled:ce,onClick:()=>q("B"),className:"bg-gray-900 hover:bg-black text-white font-semibold text-xs h-9 px-3 gap-1.5 shadow-2xs disabled:opacity-70 whitespace-nowrap",title:"Cetak Billing Statement Resmi (Model Modern)",children:[e.jsx(te,{className:`h-3.5 w-3.5 ${ce?"animate-spin":""}`}),e.jsx("span",{children:"Billing Statement"})]}),e.jsxs(He,{children:[e.jsx(Ue,{asChild:!0,children:e.jsxs($,{type:"button",size:"sm",disabled:ce,variant:"outline",className:"border-gray-300 text-gray-800 bg-white hover:bg-gray-50 font-semibold text-xs h-9 px-3 gap-1.5 shadow-2xs whitespace-nowrap",title:"Pilih dan Cetak Format Laporan",children:[e.jsx(Tt,{className:"h-3.5 w-3.5 text-blue-600"}),e.jsx("span",{children:"Laporan"}),e.jsx(be,{className:"h-3 w-3 text-gray-400 ml-0.5"})]})}),e.jsxs(Je,{align:"end",className:"w-80",children:[e.jsxs(ge,{onClick:()=>q("A"),className:"cursor-pointer flex flex-col items-start py-2.5 px-3",children:[e.jsxs("div",{className:"font-semibold text-xs text-gray-900 flex items-center gap-1.5",children:[e.jsx(te,{className:"h-3.5 w-3.5 text-blue-600"}),e.jsx("span",{children:"Laporan Fumigasi"})]}),e.jsx("span",{className:"text-[11px] text-gray-500 mt-1 pl-5",children:"Laporan Format Lengkap"})]}),e.jsxs(ge,{onClick:()=>q("D"),className:"cursor-pointer flex flex-col items-start py-2.5 px-3 border-t border-gray-100",children:[e.jsxs("div",{className:"font-semibold text-xs text-gray-900 flex items-center gap-1.5",children:[e.jsx(te,{className:"h-3.5 w-3.5 text-emerald-600"}),e.jsx("span",{children:"Laporan Fumigasi B"})]}),e.jsx("span",{className:"text-[11px] text-gray-500 mt-1 pl-5",children:"Format Laporan Fumigasi tanpa kolom Customer"})]}),e.jsxs(ge,{onClick:()=>q("C"),className:"cursor-pointer flex flex-col items-start py-2.5 px-3 border-t border-gray-100",children:[e.jsxs("div",{className:"font-semibold text-xs text-gray-700 flex items-center gap-1.5",children:[e.jsx(te,{className:"h-3.5 w-3.5 text-gray-600"}),e.jsx("span",{children:"Laporan Pemeriksaan On-Chassis"})]}),e.jsx("span",{className:"text-[11px] text-gray-500 mt-1 pl-5",children:"Format pemeriksaan tanpa Customer & Fumigator"})]})]})]})]})]}),de&&e.jsxs("div",{className:"rounded-xl border border-gray-200 bg-white p-5 shadow-xs space-y-4",children:[e.jsxs("div",{className:"flex items-center justify-between border-b border-gray-100 pb-3",children:[e.jsxs("span",{className:"text-sm font-bold text-gray-800 flex items-center gap-2",children:[e.jsx(fe,{className:"h-4 w-4 text-blue-600"}),"Parameter Filter"]}),e.jsxs($,{variant:"ghost",size:"sm",onClick:at,className:"text-xs text-gray-500 hover:text-rose-600 gap-1.5 h-8 px-2",children:[e.jsx(Pt,{className:"h-3.5 w-3.5"}),e.jsx("span",{children:"Reset Filter"})]})]}),e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4",children:[e.jsxs("div",{className:"space-y-1.5",children:[e.jsx(B,{className:"text-xs font-semibold text-gray-700",children:"Customer"}),e.jsx(Ee,{options:Ze,value:m,onChange:t=>se(t||"all"),placeholder:"Semua Customer",searchPlaceholder:"Cari customer...",showClear:!1,className:"w-full text-xs h-9 bg-white"})]}),e.jsxs("div",{className:"space-y-1.5",children:[e.jsx(B,{className:"text-xs font-semibold text-gray-700",children:"Shipper"}),e.jsx(Ee,{options:et,value:C,onChange:t=>re(t||"all"),placeholder:"Semua Shipper",searchPlaceholder:"Cari shipper...",showClear:!1,className:"w-full text-xs h-9 bg-white"})]}),e.jsxs("div",{className:"space-y-1.5",children:[e.jsx(B,{className:"text-xs font-semibold text-gray-700",children:"Fumigator"}),e.jsx(me,{type:"text",value:A,onChange:t=>ne(t.target.value),onKeyDown:ke,placeholder:"Ketik nama fumigator...",className:"text-xs h-9 bg-white border-gray-200"})]}),e.jsxs("div",{className:"space-y-1.5",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{className:"flex items-center gap-1.5",children:[e.jsx(B,{className:"text-xs font-semibold text-gray-700",children:"Jenis Layanan"}),F&&c.length>0&&e.jsx("span",{className:"text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200",children:"Default"})]}),c.length>0&&e.jsxs(gt,{children:[e.jsx(ft,{asChild:!0,children:e.jsx("button",{type:"button",className:"inline-flex items-center gap-1 text-[10px] text-blue-700 font-bold bg-blue-50 hover:bg-blue-100 px-1.5 py-0.5 rounded border border-blue-200 cursor-pointer transition-colors",children:e.jsxs("span",{children:[c.length," dipilih"]})})}),e.jsxs(bt,{side:"top",align:"end",className:"bg-slate-900 text-slate-100 p-2.5 max-w-xs shadow-xl rounded-lg border border-slate-800 text-[11px] space-y-1.5 z-50",children:[e.jsx("div",{className:"font-semibold text-slate-200 border-b border-slate-700 pb-1 flex items-center justify-between gap-3",children:e.jsxs("span",{children:["Layanan Terpilih (",c.length,"):"]})}),e.jsx("ul",{className:"max-h-52 overflow-y-auto space-y-1 pr-1 text-slate-300",children:c.map(t=>{const s=g.find(o=>o.id===t);return s?e.jsxs("li",{className:"flex items-center gap-1.5",children:[e.jsx("span",{className:"h-1.5 w-1.5 rounded-full bg-blue-400 shrink-0"}),e.jsx("span",{className:"truncate",children:s.service_type})]},t):null})})]})]})]}),e.jsxs(He,{children:[e.jsx(Ue,{asChild:!0,children:e.jsxs($,{variant:"outline",type:"button",className:"w-full justify-between border-gray-200 bg-white text-xs font-normal text-gray-800 shadow-2xs hover:bg-gray-50 h-9",children:[e.jsx("span",{className:"truncate",children:c.length===0?"Semua Layanan":F?`Default Layanan (${c.length})`:c.length===1?((Le=g.find(t=>t.id===c[0]))==null?void 0:Le.service_type)||"1 Layanan":`${c.length} Layanan Dipilih`}),e.jsx(be,{className:"ml-1.5 h-3.5 w-3.5 shrink-0 opacity-50"})]})}),e.jsxs(Je,{className:"w-88 p-2.5 shadow-xl max-w-sm",align:"start",children:[e.jsxs("div",{className:"flex items-center justify-between px-1 pb-2 border-b border-gray-100",children:[e.jsx("span",{className:"text-xs font-semibold text-gray-800",children:"Pilih Layanan"}),e.jsxs("div",{className:"flex flex-wrap gap-1.5 text-[11px]",children:[L.length>0&&e.jsxs("button",{type:"button",onClick:t=>{t.preventDefault(),st()},className:`px-1.5 py-0.5 rounded text-[10px] font-medium transition-colors ${F?"bg-emerald-100 text-emerald-800 font-bold":"bg-emerald-50 text-emerald-700 hover:bg-emerald-100"}`,title:"Terapkan master default yang tersimpan",children:["Default (",L.length,")"]}),e.jsxs("button",{type:"button",onClick:t=>{t.preventDefault(),rt()},className:"px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors",title:"Pilih semua layanan karantina & fumigasi",children:["Karantina (",De.length,")"]}),e.jsx("button",{type:"button",onClick:t=>{t.preventDefault(),nt()},className:"text-gray-600 hover:text-blue-600 text-[10px] font-medium",children:"Semua"}),e.jsx("span",{className:"text-gray-300",children:"|"}),e.jsx("button",{type:"button",onClick:t=>{t.preventDefault(),lt()},className:"text-gray-500 hover:text-rose-600 text-[10px]",children:"Kosongkan"})]})]}),e.jsxs("div",{className:"relative my-2 px-0.5",children:[e.jsx(Ye,{className:"absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-400"}),e.jsx(me,{type:"text",placeholder:"Cari layanan...",value:O,onChange:t=>ve(t.target.value),onKeyDown:t=>t.stopPropagation(),className:"h-8 pl-8 pr-7 text-xs rounded-md border-gray-200"}),O&&e.jsx("button",{type:"button",onClick:()=>ve(""),className:"absolute right-2.5 top-2 text-gray-400 hover:text-gray-600",children:e.jsx(Oe,{className:"h-3.5 w-3.5"})})]}),T.length>0&&e.jsxs("div",{onClick:t=>{t.preventDefault(),Te()},className:"flex items-center gap-2 px-2 py-1.5 mb-1.5 rounded bg-slate-50 hover:bg-slate-100 cursor-pointer text-xs font-medium text-slate-700 border border-slate-200 transition-colors",children:[e.jsx(Re,{checked:Ce,onCheckedChange:Te,className:"h-3.5 w-3.5"}),e.jsx("span",{className:"truncate text-xs",children:O?`Centang Semua ("${O}")`:`Centang Semua (${T.length})`})]}),e.jsx("div",{className:"space-y-0.5 max-h-56 overflow-y-auto pr-0.5",children:T.length===0?e.jsx("div",{className:"py-4 text-center text-xs text-gray-400",children:"Tidak ada layanan cocok"}):T.map(t=>{const s=c.includes(t.id);return e.jsxs("div",{onClick:o=>{o.preventDefault(),$e(t.id)},className:`flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer text-xs transition-colors ${s?"bg-blue-50 text-blue-900 font-medium":"hover:bg-gray-100 text-gray-700"}`,children:[e.jsx(Re,{checked:s,onCheckedChange:()=>$e(t.id),className:"h-3.5 w-3.5"}),e.jsx("span",{className:"truncate",children:t.service_type})]},t.id)})}),e.jsxs("div",{className:"mt-2 pt-2 border-t border-gray-100 space-y-1.5",children:[e.jsx($,{type:"button",variant:"outline",size:"sm",disabled:Se||F,onClick:t=>{t.preventDefault(),tt()},className:`w-full h-8 text-[11px] justify-center gap-1.5 ${F?"bg-emerald-50 text-emerald-700 border-emerald-200 cursor-default opacity-90":"hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 text-gray-700"}`,children:F?e.jsxs(e.Fragment,{children:[e.jsx(Ve,{className:"h-3.5 w-3.5 text-emerald-600"}),e.jsx("span",{children:"Sudah Sesuai Master Default"})]}):Se?e.jsx("span",{children:"Menyimpan Master Default..."}):e.jsxs(e.Fragment,{children:[e.jsx(At,{className:"h-3.5 w-3.5 text-blue-600"}),e.jsx("span",{children:"Jadikan Pilihan Saat Ini Sebagai Master Default"})]})}),e.jsxs("div",{className:"flex items-center justify-between px-1 text-[11px] text-gray-500",children:[e.jsx("span",{children:"Master Setting Global"}),e.jsxs(Ke,{href:route("settings.system"),className:"inline-flex items-center gap-1 text-blue-600 hover:underline font-medium",children:[e.jsx(kt,{className:"h-3 w-3"}),"Buka Pengaturan Sistem"]})]})]})]})]})]})]}),e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1",children:[e.jsxs("div",{className:"space-y-1.5",children:[e.jsx(B,{className:"text-xs font-semibold text-gray-700",children:"Status Exclude"}),e.jsxs(yt,{value:K,onValueChange:le,children:[e.jsx(wt,{className:"w-full text-xs h-9 bg-white border-gray-200",children:e.jsx(jt,{})}),e.jsxs(vt,{children:[e.jsx(he,{value:"active",children:"Hanya yang Diikutsertakan (Default)"}),e.jsx(he,{value:"all",children:"Semua (Termasuk yang di-exclude)"}),e.jsx(he,{value:"excluded",children:"Hanya yang Di-exclude"})]})]})]}),e.jsxs("div",{className:"space-y-1.5 sm:col-span-2 lg:col-span-3",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx(B,{className:"text-xs font-semibold text-gray-700",children:"Rentang Tanggal"}),e.jsxs("div",{className:"flex items-center gap-1.5",children:[e.jsx("span",{className:"text-[11px] text-gray-500",children:"Berdasarkan:"}),e.jsxs("select",{value:E,onChange:t=>ie(t.target.value),className:"text-[11px] font-semibold text-blue-600 bg-blue-50 border border-blue-200 rounded px-1.5 py-0.5 cursor-pointer focus:ring-0",children:[e.jsx("option",{value:"entry_date",children:"Tgl Masuk"}),e.jsx("option",{value:"eir_date",children:"Tgl EIR"}),e.jsx("option",{value:"exit_date",children:"Tgl Keluar"})]})]})]}),e.jsx($t,{startDate:f,endDate:b,onChange:({startDate:t,endDate:s})=>{G(t),W(s)},onApply:({startDate:t,endDate:s})=>{G(t),W(s),pe({date_from:t,date_to:s})},placeholder:"Semua rentang tanggal...",className:"w-full",align:"right"})]})]}),e.jsxs("div",{className:"flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-gray-100",children:[e.jsxs("div",{className:"relative w-full sm:max-w-md",children:[e.jsx(Ye,{className:"absolute left-3 top-2.5 h-4 w-4 text-gray-400"}),e.jsx(me,{type:"text",placeholder:"Cari nomor kontainer, customer, shipper, layanan, atau komoditi... (Tekan Enter)",value:R,onChange:t=>oe(t.target.value),onKeyDown:ke,className:"pl-9 text-xs h-9 bg-white border-gray-200"})]}),e.jsx("div",{className:"flex items-center gap-2 w-full sm:w-auto justify-end",children:e.jsx($,{size:"sm",onClick:()=>pe(),className:"bg-gray-900 hover:bg-black text-white font-semibold text-xs h-9 px-5 shadow-2xs",children:"Terapkan Filter"})})]})]}),e.jsxs("div",{className:"rounded-xl border border-gray-200 bg-white shadow-xs p-5 space-y-4",children:[e.jsx("div",{className:"flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3",children:e.jsxs("div",{children:[e.jsx("h2",{className:"text-base font-bold text-gray-900",children:"Daftar Kontainer Karantina & Fumigasi"}),e.jsxs("p",{className:"text-xs text-gray-500 mt-0.5",children:["Menampilkan total ",e.jsx("span",{className:"font-bold text-gray-800",children:n.total??n.data.length})," kontainer sesuai kriteria filter aktif."]})]})}),e.jsx("div",{className:"overflow-x-auto rounded-lg border border-gray-200",children:e.jsxs(Nt,{children:[e.jsx(St,{className:"bg-slate-50 text-xs font-semibold text-slate-700 border-b border-gray-200",children:e.jsxs(ue,{className:"hover:bg-transparent",children:[e.jsx(v,{className:"px-4 py-3.5 whitespace-nowrap",children:e.jsx(P,{label:"Nomor Kontainer",field:"container_number",currentSort:a.sort_by,currentDir:a.sort_dir})}),e.jsx(v,{className:"px-4 py-3.5 whitespace-nowrap",children:e.jsx(P,{label:"Customer",field:"customers.name",currentSort:a.sort_by,currentDir:a.sort_dir})}),e.jsx(v,{className:"px-4 py-3.5 whitespace-nowrap",children:e.jsx(P,{label:"Nama Shipper",field:"shippers.name",currentSort:a.sort_by,currentDir:a.sort_dir})}),e.jsx(v,{className:"px-4 py-3.5 whitespace-nowrap",children:"Layanan"}),e.jsx(v,{className:"px-4 py-3.5 text-center whitespace-nowrap",children:"Size"}),e.jsx(v,{className:"px-4 py-3.5 whitespace-nowrap",children:e.jsx(P,{label:"Tanggal Masuk",field:"entry_date",currentSort:a.sort_by,currentDir:a.sort_dir})}),e.jsx(v,{className:"px-4 py-3.5 whitespace-nowrap",children:e.jsx(P,{label:"Tanggal EIR",field:"eir_date",currentSort:a.sort_by,currentDir:a.sort_dir})}),e.jsx(v,{className:"px-4 py-3.5 whitespace-nowrap",children:e.jsx(P,{label:"Tanggal Keluar",field:"exit_date",currentSort:a.sort_by,currentDir:a.sort_dir})}),e.jsx(v,{className:"px-4 py-3.5 whitespace-nowrap",children:"Komoditi"}),e.jsx(v,{className:"px-4 py-3.5 whitespace-nowrap",children:"Negara Tujuan"}),e.jsx(v,{className:"px-4 py-3.5 whitespace-nowrap",children:e.jsx(P,{label:"Fumigator",field:"fumigasi",currentSort:a.sort_by,currentDir:a.sort_dir})})]})}),e.jsx(_t,{className:"divide-y divide-gray-100 bg-white",children:n.data.length===0?e.jsx(ue,{children:e.jsx(y,{colSpan:11,className:"py-12 text-center text-sm text-gray-500",children:e.jsxs("div",{className:"flex flex-col items-center justify-center gap-1.5",children:[e.jsx(fe,{className:"h-6 w-6 text-gray-300"}),e.jsx("span",{className:"font-semibold text-gray-700",children:"Tidak ada data kontainer yang sesuai filter."}),e.jsx("span",{className:"text-xs text-gray-400",children:"Silakan ubah parameter filter atau klik Reset Filter."})]})})}):n.data.map(t=>{var s,o,i,j,H,p,I,M;return e.jsxs(ue,{className:"hover:bg-slate-50/70 transition-colors",children:[e.jsx(y,{className:"px-4 py-3 text-sm font-bold text-slate-900 font-mono",children:t.container_number}),e.jsx(y,{className:"px-4 py-3 text-sm font-semibold text-slate-900",children:((o=(s=t.order)==null?void 0:s.customer)==null?void 0:o.name)??t.customer_name??"-"}),e.jsx(y,{className:"px-4 py-3 text-sm text-slate-700",children:((j=(i=t.order)==null?void 0:i.shipper)==null?void 0:j.name)??t.shipper_name??"-"}),e.jsx(y,{className:"px-4 py-3 text-sm",children:e.jsx("span",{className:"inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 whitespace-nowrap",children:((H=t.product)==null?void 0:H.service_type)??t.service_type??((p=t.order)!=null&&p.fumigasi?"Fumigasi":"-")})}),e.jsx(y,{className:"px-4 py-3 text-sm text-center",children:e.jsx("span",{className:"inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200",children:We(t.price_type)})}),e.jsx(y,{className:"px-4 py-3 text-sm",children:ye(t.entry_date)}),e.jsx(y,{className:"px-4 py-3 text-sm",children:ye(t.eir_date)}),e.jsx(y,{className:"px-4 py-3 text-sm",children:ye(t.exit_date)}),e.jsx(y,{className:"px-4 py-3 text-sm text-slate-800",children:t.commodity??"-"}),e.jsx(y,{className:"px-4 py-3 text-sm text-slate-800",children:t.country??"-"}),e.jsx(y,{className:"px-4 py-3 text-sm",children:((I=t.order)==null?void 0:I.fumigasi)??t.fumigasi?e.jsx("span",{className:"inline-flex items-center rounded-md bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800 border border-amber-200",children:((M=t.order)==null?void 0:M.fumigasi)??t.fumigasi}):e.jsx("span",{className:"text-gray-400",children:"–"})})]},t.id)})})]})}),e.jsxs("div",{className:"flex flex-col sm:flex-row items-center justify-between gap-3 pt-2",children:[e.jsxs("p",{className:"text-xs text-gray-500",children:["Menampilkan ",e.jsx("span",{className:"font-semibold text-gray-800",children:n.from??0})," sampai"," ",e.jsx("span",{className:"font-semibold text-gray-800",children:n.to??0})," dari"," ",e.jsx("span",{className:"font-semibold text-gray-800",children:n.total??n.data.length})," kontainer"]}),e.jsx("div",{className:"flex flex-wrap justify-center gap-1",children:n.links.map((t,s)=>t.url?e.jsx($,{variant:t.active?"default":"outline",disabled:!t.url,onClick:()=>ee.get(t.url,{},{preserveState:!0,preserveScroll:!0}),className:`px-3 py-1 text-xs font-medium h-8 ${t.active?"bg-gray-900 text-white hover:bg-black":"text-gray-700 bg-white border-gray-200"}`,children:t.label.replace(/&laquo; Previous|Next &raquo;/,o=>o.includes("Previous")?"← Prev":o.includes("Next")?"Next →":o)},s):e.jsx("span",{className:"px-2.5 py-1 text-xs text-gray-400",children:"..."},s))})]})]})]})]})}export{ma as default};
