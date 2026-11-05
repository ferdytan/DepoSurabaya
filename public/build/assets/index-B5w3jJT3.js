import{r as x,K as xt,j as e,L as mt,$ as Ee,S as ae}from"./app-CuiI-bXU.js";import{A as ht,a as ut}from"./app-layout-Dg70RYa8.js";import{B as N}from"./button-D2GgstEi.js";import{I as he}from"./input-UaeEHfkn.js";import{L as F}from"./label-NinIsYZZ.js";import{S as gt,a as bt,b as ft,c as yt,d as ue}from"./select-Dqx5ru98.js";import{S as Ke}from"./searchable-select-CmLQGtq1.js";import{T as wt,a as jt,b as ge,c as j,d as vt,e as f}from"./table-Cner12oe.js";import{C as Re}from"./checkbox-K0fs1NmF.js";import{X as be,D as He,b as Ue,c as Je,d as Oe,S as Ve,e as Nt}from"./global-container-search-C3Ap70Vf.js";import{t as St}from"./terbilang-DIgi2L4g.js";import{D as _t}from"./date-range-picker-5F0L3nQW.js";import{C as Ye}from"./check-BM02xq7E.js";import{F as fe}from"./filter-DGkV4rt8.js";import{C as kt}from"./chevron-up-Cyb3SZ94.js";import{C as ye}from"./chevron-down-7WFaXtC9.js";import{P as z}from"./printer-CQ8TrLYr.js";import{R as Dt}from"./rotate-ccw-CdFtxlYe.js";import{S as $t}from"./sparkles--9x36w1K.js";import{A as Ct,a as Tt,b as At}from"./arrow-up-BeCyoMHE.js";/* empty css            */import"./index-D3OVIp0V.js";import"./index-ZpjmVY27.js";import"./Combination-DJtH8hUj.js";import"./index-BXM9btKd.js";import"./truck-C2Z_9Mz2.js";import"./index-DWL529Nm.js";import"./app-logo-icon-g-Ep7uYi.js";import"./chevron-left-DgSeAUy0.js";const qe=["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];function we(l){if(!l)return e.jsx("span",{className:"text-gray-400",children:"–"});const i=new Date(l);if(isNaN(i.getTime()))return e.jsx("span",{className:"text-gray-400",children:"–"});const h=String(i.getDate()).padStart(2,"0"),u=qe[i.getMonth()],y=i.getFullYear(),a=String(i.getHours()).padStart(2,"0"),m=String(i.getMinutes()).padStart(2,"0");return e.jsxs("div",{className:"flex flex-col leading-tight whitespace-nowrap",children:[e.jsxs("span",{className:"font-semibold text-slate-800 text-xs",children:[h," ",u," ",y]}),e.jsxs("span",{className:"text-[11px] text-slate-500 font-normal",children:[a,":",m," WIB"]})]})}function Ge(l){if(!l)return"–";const i=new Date(l);if(isNaN(i.getTime()))return"–";const h=String(i.getDate()).padStart(2,"0"),u=qe[i.getMonth()],y=i.getFullYear(),a=String(i.getHours()).padStart(2,"0"),m=String(i.getMinutes()).padStart(2,"0");return`${h} ${u} ${y}, ${a}:${m}`}function We(l,i){if(!l)return i||"-";const h=String(l).trim();return h.toLowerCase().endsWith("ft")?h:h==="20"||h==="40"?`${h}ft`:h||i||"-"}function se(l){if(!l)return"-";try{const i=new Date(l);if(isNaN(i.getTime()))return String(l);const h=String(i.getDate()).padStart(2,"0"),u=String(i.getMonth()+1).padStart(2,"0"),y=i.getFullYear(),a=String(i.getHours()).padStart(2,"0"),m=String(i.getMinutes()).padStart(2,"0");return`${h}-${u}-${y} / ${a}.${m}`}catch{return String(l)}}function G(l){if(!l)return"-";const i=String(l).toLowerCase();return i.includes("20")?"20'":i.includes("40")?"40'":i.includes("45")?"45'":l}function S(l){return new Intl.NumberFormat("id-ID",{minimumFractionDigits:0,maximumFractionDigits:0}).format(l)}const Pt=[{title:"Dashboard",href:"/dashboard"},{title:"Karantina & Fumigasi",href:"/karantina"}];function oa({orders:l,customers:i=[],shippers:h=[],products:u=[],filters:y}){var Ae,Pe,Le;const a=y||{},[m,re]=x.useState(a.customer_id||"all"),[k,ne]=x.useState(a.shipper_id||"all"),[A,le]=x.useState(a.fumigator||""),[E,ie]=x.useState(a.exclude_status||"active"),[g,W]=x.useState(a.date_from||""),[b,q]=x.useState(a.date_to||""),[K,oe]=x.useState(a.date_type||"entry_date"),[R,de]=x.useState(a.search||""),[je,ve]=x.useState(String(a.per_page||25)),Qe=Array.isArray(y==null?void 0:y.product_ids)?y.product_ids.map(Number).filter(t=>!isNaN(t)):[],[c,v]=x.useState(Qe),[H,Ne]=x.useState(""),[ce,Xe]=x.useState(!0),[D,Se]=x.useState(!1),Ze=x.useMemo(()=>[{value:"all",label:"Semua Customer"},...i.map(t=>({value:String(t.id),label:t.name}))],[i]),et=x.useMemo(()=>[{value:"all",label:"Semua Shipper"},...h.map(t=>({value:String(t.id),label:t.name}))],[h]);x.useEffect(()=>{re(a.customer_id||"all"),ne(a.shipper_id||"all"),le(a.fumigator||""),ie(a.exclude_status||"active"),W(a.date_from||""),q(a.date_to||""),oe(a.date_type||"entry_date"),de(a.search||""),ve(String(a.per_page||25));const t=Array.isArray(a.product_ids)?a.product_ids.map(Number).filter(s=>!isNaN(s)):[];v(t)},[a.customer_id,a.shipper_id,a.fumigator,a.exclude_status,a.date_from,a.date_to,a.date_type,a.search,a.per_page,a.product_ids]);const pe=t=>{const s=(t==null?void 0:t.customer_id)!==void 0?t.customer_id:m,d=(t==null?void 0:t.shipper_id)!==void 0?t.shipper_id:k,o=(t==null?void 0:t.fumigator)!==void 0?t.fumigator:A,w=(t==null?void 0:t.product_ids)!==void 0?t.product_ids:c,J=(t==null?void 0:t.exclude_status)!==void 0?t.exclude_status:E,p=(t==null?void 0:t.date_from)!==void 0?t.date_from:g,I=(t==null?void 0:t.date_to)!==void 0?t.date_to:b,B=(t==null?void 0:t.date_type)!==void 0?t.date_type:K,O=(t==null?void 0:t.search)!==void 0?t.search:R,V=(t==null?void 0:t.per_page)!==void 0?t.per_page:je;ae.get(route("index_karantina"),{customer_id:s==="all"?void 0:s,shipper_id:d==="all"?void 0:d,fumigator:o?o.trim():void 0,product_ids:w.length>0?w:void 0,exclude_status:J,date_from:p||void 0,date_to:I||void 0,date_type:B,search:O?O.trim():void 0,per_page:V,sort_by:a.sort_by||void 0,sort_dir:a.sort_dir||void 0,trashed:a.trashed||void 0},{preserveState:!0,preserveScroll:!0})},[_e,ke]=x.useState(!1),tt=()=>{ke(!0),ae.post(route("karantina.save_default_products"),{product_ids:c},{preserveScroll:!0,onFinish:()=>ke(!1)})},at=()=>{re("all"),ne("all"),le(""),v(a.default_product_ids||[]),ie("active"),W(""),q(""),oe("entry_date"),de(""),ve("25"),ae.get(route("index_karantina"),{},{preserveScroll:!0})},De=t=>{t.key==="Enter"&&(t.preventDefault(),pe())},P=x.useMemo(()=>(a.default_product_ids||[]).map(Number).filter(t=>!isNaN(t)),[a.default_product_ids]),L=x.useMemo(()=>{if(c.length!==P.length)return!1;const t=new Set(c);return P.every(s=>t.has(s))},[c,P]),$e=x.useMemo(()=>u.filter(t=>{const s=(t.service_type||"").toLowerCase();return s.includes("karantina")||s.includes("fumigasi")}).map(t=>t.id),[u]),xe=t=>{v(s=>s.includes(t)?s.filter(d=>d!==t):[...s,t])},st=()=>{v(P)},rt=()=>{v($e)},nt=()=>{v(u.map(t=>t.id))},lt=()=>{v([])},$=u.filter(t=>t.service_type.toLowerCase().includes(H.toLowerCase())),Ce=$.length>0&&$.every(t=>c.includes(t.id)),Te=()=>{const t=$.map(s=>s.id);if(Ce){const s=new Set(t);v(d=>d.filter(o=>!s.has(o)))}else v(s=>Array.from(new Set([...s,...t])))},U=async(t="A")=>{const s=window.open("","_blank");if(!s){alert("Gagal membuka jendela cetak. Pastikan izin popup browser diaktifkan.");return}const d=t==="B"?"Billing Statement B (Versi 2 Modern)":t==="B_CLASSIC"?"Billing Statement B (Versi 1 Klasik)":t==="C"?"Billing Statement C":t==="D"?"Billing Statement D (Klasik)":"Billing Statement A";s.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Menyiapkan ${d}...</title>
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
                <div style="font-size: 15px; font-weight: 600;">Menyiapkan data ${d}...</div>
                <div style="font-size: 12px; color: #64748b; margin-top: 5px;">Total data: ${l.total??l.data.length} kontainer</div>
            </body>
            </html>
        `),s.document.close(),Se(!0);try{const o=new URLSearchParams;m&&m!=="all"&&o.append("customer_id",m),k&&k!=="all"&&o.append("shipper_id",k),A&&o.append("fumigator",A),E&&o.append("exclude_status",E),g&&o.append("date_from",g),b&&o.append("date_to",b),K&&o.append("date_type",K),R&&o.append("search",R),a.trashed&&o.append("trashed",a.trashed),a.sort_by&&o.append("sort_by",a.sort_by),a.sort_dir&&o.append("sort_dir",a.sort_dir),c.length>0&&c.forEach(r=>o.append("product_ids[]",r.toString()));const w=await fetch(`/karantina/print-data?${o.toString()}`);if(!w.ok)throw new Error("Gagal mengambil data dari server");const p=(await w.json()).data||[];if(p.length===0){s.document.body.innerHTML=`
                    <div style="text-align: center; margin-top: 50px; font-family: Arial, sans-serif;">
                        <p style="color: #ef4444; font-weight: 600;">Tidak ada data yang sesuai filter untuk dicetak.</p>
                        <button onclick="window.close()" style="padding: 6px 14px; cursor: pointer; border-radius: 4px; border: 1px solid #ccc;">Tutup</button>
                    </div>
                `;return}const I=g?new Date(g).toLocaleDateString("id-ID"):"Semua",B=b?new Date(b).toLocaleDateString("id-ID"):"Semua",O=`${I} s/d ${B}`,V="/logo-dss.png",Ie=new Date().toLocaleDateString("id-ID",{day:"numeric",month:"long",year:"numeric",hour:"2-digit",minute:"2-digit"});let Y="-";if(m&&m!=="all"){const r=i.find(n=>String(n.id)===String(m));Y=r?r.name:m}else{const r=Array.from(new Set(p.map(n=>n.customer_name).filter(Boolean)));r.length===1&&r[0]!=="-"?Y=r[0]:r.length>1&&(Y="Semua Customer")}const X=r=>{const n=new Date(r),_=String(n.getDate()).padStart(2,"0"),ee=String(n.getMonth()+1).padStart(2,"0"),T=String(n.getFullYear()).slice(-2);return`${_}/${ee}/${T}`},Be=g&&b?`${X(g)} - ${X(b)}`:g||b?`${g?X(g):""} - ${b?X(b):""}`:O,Me=p.reduce((r,n)=>r+(typeof n.price=="number"?n.price:0),0),Fe=p.reduce((r,n)=>{const _=typeof n.price=="number"?n.price:0;return r+(typeof n.ppn=="number"?n.ppn:Math.round(_*.11))},0),me=Me+Fe,it=St(me),ot=p.filter(r=>G(r.price_type)==="20'").length,dt=p.filter(r=>G(r.price_type)==="40'").length,ze=p.filter(r=>G(r.price_type)==="45'").length,ct=[`20': ${ot} Kontainer`,`40': ${dt} Kontainer`,...ze>0?[`45': ${ze} Kontainer`]:[],`Total: ${p.length} Kontainer`].join(" | ");let Z="";if(t==="B")Z=`
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
                        <img src="${V}" alt="DSS Logo" class="header-logo" onerror="this.onerror=null;this.src='/logo.png'">
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
                            <span class="meta-value">${Be}</span>
                        </div>
                    </div>
                    <div class="meta-col" style="align-items: flex-end;">
                        <div class="meta-item">
                            <span class="meta-label" style="width: auto;">Total Kontainer :</span>
                            <span class="meta-value">${p.length} Unit</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-label" style="width: auto;">Dicetak :</span>
                            <span class="meta-value">${Ie} WIB</span>
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
                        ${p.map((r,n)=>{const ee=n===p.length-1?"row-solid-bottom":"row-dashed",T=typeof r.price=="number"?r.price:0,M=typeof r.ppn=="number"?r.ppn:Math.round(T*.11),te=typeof r.total=="number"?r.total:T+M;return`
                            <tr class="${ee}">
                                <td class="text-center">${n+1}</td>
                                <td class="text-center container-code">${r.container_number}</td>
                                <td>${r.shipper_name??"-"}</td>
                                <td class="text-center">${se(r.entry_date)}</td>
                                <td class="text-center">${se(r.exit_date)}</td>
                                <td class="text-center">${G(r.price_type)}</td>
                                <td class="text-center">${r.service_type??"Fumigasi"}</td>
                                <td class="text-center">${r.fumigasi??"-"}</td>
                                <td>
                                    <div class="currency-cell">
                                        <span>Rp</span>
                                        <span>${S(T)}</span>
                                    </div>
                                </td>
                                <td>
                                    <div class="currency-cell">
                                        <span>Rp</span>
                                        <span>${S(M)}</span>
                                    </div>
                                </td>
                                <td>
                                    <div class="currency-cell" style="font-weight: 700;">
                                        <span>Rp</span>
                                        <span>${S(te)}</span>
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
                                    <span>${S(Fe)}</span>
                                </div>
                            </td>
                            <td class="grand-total-highlight">
                                <div class="currency-cell" style="font-weight: 900; font-size: 9pt;">
                                    <span>Rp</span>
                                    <span>${S(me)}</span>
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
                `;else if(t==="B_CLASSIC"||t==="D"){const r=t==="D";Z=`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>${r?"Billing Statement D":"Billing Statement B (Klasik)"} - PT. Depo Surabaya Sejahtera</title>
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
                    <img src="${V}" alt="DSS Logo" class="header-logo" onerror="this.onerror=null;this.src='/logo.png'">
                    <div class="header-company">
                        <div class="company-name">PT. DEPO SURABAYA SEJAHTERA</div>
                        <div class="company-address">Tanjung Sadari No. 90</div>
                        <div class="company-address">Surabaya</div>
                        <div class="company-address">Jawa Timur - Indonesia</div>
                    </div>
                </div>

                <div class="statement-title-section">
                    <div class="statement-title">${r?"BILLING STATEMENT D":"BILLING STATEMENT"}</div>
                    <table class="meta-table">
                        ${r?"":`
                        <tr>
                            <td class="meta-label">Customer</td>
                            <td class="meta-sep">:</td>
                            <td class="meta-value">${Y}</td>
                        </tr>
                        `}
                        <tr>
                            <td class="meta-label">Periode</td>
                            <td class="meta-sep">:</td>
                            <td class="meta-value">${Be}</td>
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
                        ${p.map((n,_)=>{const T=_===p.length-1?"row-solid-bottom":"row-dashed",M=typeof n.price=="number"?n.price:0,te=typeof n.ppn=="number"?n.ppn:Math.round(M*.11),pt=typeof n.total=="number"?n.total:M+te;return`
                            <tr class="${T}">
                                <td class="text-center">${_+1}</td>
                                <td class="text-center" style="font-weight: 700;">${n.container_number}</td>
                                <td class="text-center">${n.shipper_name??"-"}</td>
                                <td class="text-center">${se(n.entry_date)}</td>
                                <td class="text-center">${se(n.exit_date)}</td>
                                <td class="text-center">${G(n.price_type)}</td>
                                <td class="text-center">${n.service_type??"Fumigasi"}</td>
                                <td class="text-center">${n.fumigasi??"-"}</td>
                                <td>
                                    <div class="currency-cell">
                                        <span>Rp</span>
                                        <span>${S(M)}</span>
                                    </div>
                                </td>
                                <td>
                                    <div class="currency-cell">
                                        <span>Rp</span>
                                        <span>${S(te)}</span>
                                    </div>
                                </td>
                                <td>
                                    <div class="currency-cell">
                                        <span>Rp</span>
                                        <span>${S(pt)}</span>
                                    </div>
                                </td>
                            </tr>
                            `}).join("")}
                        <tr class="grand-total-row">
                            <td colspan="10" style="border: none; background: transparent;"></td>
                            <td class="grand-total-cell">
                                <div class="currency-cell" style="font-weight: 800;">
                                    <span>Rp</span>
                                    <span>${S(me)}</span>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </body>
            </html>
                `}else{const r=t==="C";Z=`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>${r?"Billing Statement C":"Billing Statement"} - PT. Depo Surabaya Sejahtera</title>
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
                            <img src="${V}" alt="Logo" style="width: 55px; height: 55px; object-fit: contain;" onerror="this.onerror=null;this.src='/logo.png'">
                        </td>
                        <td style="vertical-align: middle;">
                            <div class="company-name">PT. DEPO SURABAYA SEJAHTERA</div>
                            <div class="company-address">
                                Jl. Tanjung Sadari No. 90 (Tanjung Batu No. 1) | Telp. 031-353 9484, 031-3539485 | Fax. 031-3539482
                            </div>
                        </td>
                        <td style="text-align: right; vertical-align: middle;">
                            <div class="report-title">${r?"BILLING STATEMENT C":"BILLING STATEMENT"}</div>
                            <div style="font-size: 10pt; color: #475569; font-weight: 600;">Layanan Karantina & Fumigasi</div>
                        </td>
                    </tr>
                </table>

                <div class="filter-info">
                    <div>
                        <strong>Periode:</strong> ${O} &nbsp;|&nbsp;
                        <strong>Total:</strong> ${p.length} Kontainer
                    </div>
                    <div>
                        <strong>Dicetak pada:</strong> ${Ie} WIB
                    </div>
                </div>

                <table class="data-table">
                    <thead>
                        <tr>
                            <th style="width: 30px; text-align: center;">No</th>
                            <th>Nomor Kontainer</th>
                            ${r?"":"<th>Customer</th>"}
                            <th>Nama Shipper</th>
                            ${r?"":"<th>Fumigator</th>"}
                            <th style="text-align: center; width: 60px;">Size</th>
                            <th>Tanggal Masuk</th>
                            <th>Tanggal Keluar</th>
                            <th>Komoditi</th>
                            <th>Negara Tujuan</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${p.map((n,_)=>`
                            <tr>
                                <td class="text-center">${_+1}</td>
                                <td style="font-weight: 700; font-family: monospace;">${n.container_number}</td>
                                ${r?"":`<td>${n.customer_name??"-"}</td>`}
                                <td>${n.shipper_name??"-"}</td>
                                ${r?"":`<td>${n.fumigasi??'<span class="text-gray-400">–</span>'}</td>`}
                                <td class="text-center">${We(n.price_type)}</td>
                                <td>${n.entry_date?Ge(n.entry_date):'<span class="text-gray-400">–</span>'}</td>
                                <td>${n.exit_date?Ge(n.exit_date):'<span class="text-gray-400">–</span>'}</td>
                                <td>${n.commodity??"-"}</td>
                                <td>${n.country??"-"}</td>
                            </tr>
                        `).join("")}
                    </tbody>
                </table>
            </body>
            </html>
            `}s.document.open(),s.document.write(Z),s.document.close(),setTimeout(()=>{s.focus(),s.print()},300)}catch(o){console.error("Error saat mencetak billing statement:",o),s.document.body.innerHTML=`
                <div style="text-align: center; margin-top: 50px; font-family: Arial, sans-serif;">
                    <p style="color: #ef4444; font-weight: 600;">Terjadi kesalahan saat memuat seluruh data kontainer.</p>
                    <button onclick="window.close()" style="padding: 6px 14px; cursor: pointer; border-radius: 4px; border: 1px solid #ccc;">Tutup</button>
                </div>
            `}finally{Se(!1)}},C=({label:t,field:s,currentSort:d,currentDir:o})=>{const w=d===s&&o==="asc"?"desc":"asc";return e.jsxs(Ee,{href:route("index_karantina",{customer_id:m==="all"?void 0:m,shipper_id:k==="all"?void 0:k,fumigator:A?A.trim():void 0,exclude_status:E,date_from:g||void 0,date_to:b||void 0,date_type:K,product_ids:c.length>0?c:void 0,search:R||void 0,per_page:je,sort_by:s,sort_dir:w}),preserveState:!0,preserveScroll:!0,className:"inline-flex items-center gap-1 font-semibold text-slate-700 hover:text-black transition-colors",children:[e.jsx("span",{children:t}),d===s?w==="asc"?e.jsx(Ct,{className:"h-3.5 w-3.5 text-blue-600"}):e.jsx(Tt,{className:"h-3.5 w-3.5 text-blue-600"}):e.jsx(At,{className:"h-3.5 w-3.5 text-gray-400 opacity-60 hover:opacity-100"})]})},{props:Q}=xt();return e.jsxs(ht,{breadcrumbs:Pt,children:[e.jsx(mt,{title:"Karantina & Fumigasi - Depo Surabaya"}),e.jsxs("div",{className:"w-full space-y-6 px-4 py-6 sm:px-6 lg:px-8 bg-slate-50/50 min-h-screen",children:[((Ae=Q.flash)==null?void 0:Ae.success)&&e.jsxs("div",{className:"flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-800 shadow-2xs",children:[e.jsx(Ye,{className:"h-4 w-4 text-emerald-600 shrink-0"}),e.jsx("span",{children:Q.flash.success})]}),((Pe=Q.flash)==null?void 0:Pe.error)&&e.jsxs("div",{className:"flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-800 shadow-2xs",children:[e.jsx(be,{className:"h-4 w-4 text-rose-600 shrink-0"}),e.jsx("span",{children:Q.flash.error})]}),e.jsxs("div",{className:"flex flex-col sm:flex-row sm:items-center justify-between gap-4",children:[e.jsxs("div",{children:[e.jsxs("div",{className:"flex items-center gap-2.5",children:[e.jsx(ut,{className:"h-7 w-7 text-gray-900"}),e.jsx("h1",{className:"text-2xl font-bold tracking-tight text-gray-900",children:"Karantina & Fumigasi"}),e.jsx("span",{className:"inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700 border border-slate-200",children:"Billing & Monitoring"})]}),e.jsx("p",{className:"text-xs text-gray-500 mt-1",children:"Kelola data pergerakan kontainer karantina, filter multi-parameter, dan cetak billing statement resmi."})]}),e.jsxs("div",{className:"flex flex-wrap items-center gap-2",children:[e.jsxs(N,{variant:"outline",size:"sm",onClick:()=>Xe(!ce),className:"gap-1.5 h-9 text-xs border-gray-300 bg-white shadow-2xs",children:[e.jsx(fe,{className:"h-3.5 w-3.5 text-blue-600"}),e.jsx("span",{children:"Filter"}),ce?e.jsx(kt,{className:"h-3.5 w-3.5 text-gray-500"}):e.jsx(ye,{className:"h-3.5 w-3.5 text-gray-500"})]}),e.jsxs(N,{type:"button",size:"sm",disabled:D,onClick:()=>U("A"),className:"bg-gray-900 hover:bg-black text-white font-semibold text-xs h-9 px-2.5 sm:px-3 gap-1.5 shadow-2xs disabled:opacity-70 whitespace-nowrap",title:"Cetak Billing Statement A (Format Lengkap)",children:[e.jsx(z,{className:`h-3.5 w-3.5 ${D?"animate-spin":""}`}),e.jsx("span",{children:"Statement A"})]}),e.jsxs(He,{children:[e.jsx(Ue,{asChild:!0,children:e.jsxs(N,{type:"button",size:"sm",disabled:D,variant:"outline",className:"border-gray-300 text-gray-800 bg-white hover:bg-gray-50 font-semibold text-xs h-9 px-2.5 sm:px-3 gap-1.5 shadow-2xs whitespace-nowrap",title:"Pilih dan Cetak Billing Statement Format B",children:[e.jsx(z,{className:"h-3.5 w-3.5 text-gray-600"}),e.jsx("span",{children:"Statement B"}),e.jsx(ye,{className:"h-3 w-3 text-gray-400 ml-0.5"})]})}),e.jsxs(Je,{align:"end",className:"w-72",children:[e.jsxs(Oe,{onClick:()=>U("B"),className:"cursor-pointer flex flex-col items-start py-2.5 px-3",children:[e.jsxs("div",{className:"font-semibold text-xs text-gray-900 flex items-center gap-1.5",children:[e.jsx(z,{className:"h-3.5 w-3.5 text-blue-600"}),e.jsx("span",{children:"Versi 2 (Modern - A4 Landscape)"})]}),e.jsx("span",{className:"text-[11px] text-gray-500 mt-1 pl-5",children:"Desain modern, rekap total, terbilang resmi & kolom tanda tangan"})]}),e.jsxs(Oe,{onClick:()=>U("B_CLASSIC"),className:"cursor-pointer flex flex-col items-start py-2.5 px-3 border-t border-gray-100",children:[e.jsxs("div",{className:"font-semibold text-xs text-gray-700 flex items-center gap-1.5",children:[e.jsx(z,{className:"h-3.5 w-3.5 text-gray-500"}),e.jsx("span",{children:"Versi 1 (Klasik - A4 Landscape)"})]}),e.jsx("span",{className:"text-[11px] text-gray-500 mt-1 pl-5",children:"Format tabel standar klasik / retro"})]})]})]}),e.jsxs(N,{type:"button",size:"sm",disabled:D,onClick:()=>U("C"),variant:"outline",className:"border-gray-300 text-gray-800 bg-white hover:bg-gray-50 font-semibold text-xs h-9 px-2.5 sm:px-3 gap-1.5 shadow-2xs disabled:opacity-70 whitespace-nowrap",title:"Cetak Billing Statement C (Format A tanpa Customer & Fumigator)",children:[e.jsx(z,{className:`h-3.5 w-3.5 ${D?"animate-spin":"text-gray-600"}`}),e.jsx("span",{children:"Statement C"})]}),e.jsxs(N,{type:"button",size:"sm",disabled:D,onClick:()=>U("D"),variant:"outline",className:"border-gray-300 text-gray-800 bg-white hover:bg-gray-50 font-semibold text-xs h-9 px-2.5 sm:px-3 gap-1.5 shadow-2xs disabled:opacity-70 whitespace-nowrap",title:"Cetak Billing Statement D (Format B Klasik tanpa Customer)",children:[e.jsx(z,{className:`h-3.5 w-3.5 ${D?"animate-spin":"text-gray-600"}`}),e.jsx("span",{children:"Statement D"})]})]})]}),ce&&e.jsxs("div",{className:"rounded-xl border border-gray-200 bg-white p-5 shadow-xs space-y-4",children:[e.jsxs("div",{className:"flex items-center justify-between border-b border-gray-100 pb-3",children:[e.jsxs("span",{className:"text-sm font-bold text-gray-800 flex items-center gap-2",children:[e.jsx(fe,{className:"h-4 w-4 text-blue-600"}),"Parameter Filter"]}),e.jsxs(N,{variant:"ghost",size:"sm",onClick:at,className:"text-xs text-gray-500 hover:text-rose-600 gap-1.5 h-8 px-2",children:[e.jsx(Dt,{className:"h-3.5 w-3.5"}),e.jsx("span",{children:"Reset Filter"})]})]}),e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4",children:[e.jsxs("div",{className:"space-y-1.5",children:[e.jsx(F,{className:"text-xs font-semibold text-gray-700",children:"Customer"}),e.jsx(Ke,{options:Ze,value:m,onChange:t=>re(t||"all"),placeholder:"Semua Customer",searchPlaceholder:"Cari customer...",showClear:!1,className:"w-full text-xs h-9 bg-white"})]}),e.jsxs("div",{className:"space-y-1.5",children:[e.jsx(F,{className:"text-xs font-semibold text-gray-700",children:"Shipper"}),e.jsx(Ke,{options:et,value:k,onChange:t=>ne(t||"all"),placeholder:"Semua Shipper",searchPlaceholder:"Cari shipper...",showClear:!1,className:"w-full text-xs h-9 bg-white"})]}),e.jsxs("div",{className:"space-y-1.5",children:[e.jsx(F,{className:"text-xs font-semibold text-gray-700",children:"Fumigator"}),e.jsx(he,{type:"text",value:A,onChange:t=>le(t.target.value),onKeyDown:De,placeholder:"Ketik nama fumigator...",className:"text-xs h-9 bg-white border-gray-200"})]}),e.jsxs("div",{className:"space-y-1.5",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{className:"flex items-center gap-1.5",children:[e.jsx(F,{className:"text-xs font-semibold text-gray-700",children:"Jenis Layanan"}),L&&c.length>0&&e.jsx("span",{className:"text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200",children:"Default"})]}),c.length>0&&e.jsxs("span",{className:"text-[10px] text-blue-600 font-bold bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200",children:[c.length," dipilih"]})]}),e.jsxs(He,{children:[e.jsx(Ue,{asChild:!0,children:e.jsxs(N,{variant:"outline",type:"button",className:"w-full justify-between border-gray-200 bg-white text-xs font-normal text-gray-800 shadow-2xs hover:bg-gray-50 h-9",children:[e.jsx("span",{className:"truncate",children:c.length===0?"Semua Layanan":L?`Default Layanan (${c.length})`:c.length===1?((Le=u.find(t=>t.id===c[0]))==null?void 0:Le.service_type)||"1 Layanan":`${c.length} Layanan Dipilih`}),e.jsx(ye,{className:"ml-1.5 h-3.5 w-3.5 shrink-0 opacity-50"})]})}),e.jsxs(Je,{className:"w-88 p-2.5 shadow-xl max-w-sm",align:"start",children:[e.jsxs("div",{className:"flex items-center justify-between px-1 pb-2 border-b border-gray-100",children:[e.jsx("span",{className:"text-xs font-semibold text-gray-800",children:"Pilih Layanan"}),e.jsxs("div",{className:"flex flex-wrap gap-1.5 text-[11px]",children:[P.length>0&&e.jsxs("button",{type:"button",onClick:t=>{t.preventDefault(),st()},className:`px-1.5 py-0.5 rounded text-[10px] font-medium transition-colors ${L?"bg-emerald-100 text-emerald-800 font-bold":"bg-emerald-50 text-emerald-700 hover:bg-emerald-100"}`,title:"Terapkan master default yang tersimpan",children:["Default (",P.length,")"]}),e.jsxs("button",{type:"button",onClick:t=>{t.preventDefault(),rt()},className:"px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors",title:"Pilih semua layanan karantina & fumigasi",children:["Karantina (",$e.length,")"]}),e.jsx("button",{type:"button",onClick:t=>{t.preventDefault(),nt()},className:"text-gray-600 hover:text-blue-600 text-[10px] font-medium",children:"Semua"}),e.jsx("span",{className:"text-gray-300",children:"|"}),e.jsx("button",{type:"button",onClick:t=>{t.preventDefault(),lt()},className:"text-gray-500 hover:text-rose-600 text-[10px]",children:"Kosongkan"})]})]}),e.jsxs("div",{className:"relative my-2 px-0.5",children:[e.jsx(Ve,{className:"absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-400"}),e.jsx(he,{type:"text",placeholder:"Cari layanan...",value:H,onChange:t=>Ne(t.target.value),onKeyDown:t=>t.stopPropagation(),className:"h-8 pl-8 pr-7 text-xs rounded-md border-gray-200"}),H&&e.jsx("button",{type:"button",onClick:()=>Ne(""),className:"absolute right-2.5 top-2 text-gray-400 hover:text-gray-600",children:e.jsx(be,{className:"h-3.5 w-3.5"})})]}),$.length>0&&e.jsxs("div",{onClick:t=>{t.preventDefault(),Te()},className:"flex items-center gap-2 px-2 py-1.5 mb-1.5 rounded bg-slate-50 hover:bg-slate-100 cursor-pointer text-xs font-medium text-slate-700 border border-slate-200 transition-colors",children:[e.jsx(Re,{checked:Ce,onCheckedChange:Te,className:"h-3.5 w-3.5"}),e.jsx("span",{className:"truncate text-xs",children:H?`Centang Semua ("${H}")`:`Centang Semua (${$.length})`})]}),e.jsx("div",{className:"space-y-0.5 max-h-56 overflow-y-auto pr-0.5",children:$.length===0?e.jsx("div",{className:"py-4 text-center text-xs text-gray-400",children:"Tidak ada layanan cocok"}):$.map(t=>{const s=c.includes(t.id);return e.jsxs("div",{onClick:d=>{d.preventDefault(),xe(t.id)},className:`flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer text-xs transition-colors ${s?"bg-blue-50 text-blue-900 font-medium":"hover:bg-gray-100 text-gray-700"}`,children:[e.jsx(Re,{checked:s,onCheckedChange:()=>xe(t.id),className:"h-3.5 w-3.5"}),e.jsx("span",{className:"truncate",children:t.service_type})]},t.id)})}),e.jsxs("div",{className:"mt-2 pt-2 border-t border-gray-100 space-y-1.5",children:[e.jsx(N,{type:"button",variant:"outline",size:"sm",disabled:_e||L,onClick:t=>{t.preventDefault(),tt()},className:`w-full h-8 text-[11px] justify-center gap-1.5 ${L?"bg-emerald-50 text-emerald-700 border-emerald-200 cursor-default opacity-90":"hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 text-gray-700"}`,children:L?e.jsxs(e.Fragment,{children:[e.jsx(Ye,{className:"h-3.5 w-3.5 text-emerald-600"}),e.jsx("span",{children:"Sudah Sesuai Master Default"})]}):_e?e.jsx("span",{children:"Menyimpan Master Default..."}):e.jsxs(e.Fragment,{children:[e.jsx($t,{className:"h-3.5 w-3.5 text-blue-600"}),e.jsx("span",{children:"Jadikan Pilihan Saat Ini Sebagai Master Default"})]})}),e.jsxs("div",{className:"flex items-center justify-between px-1 text-[11px] text-gray-500",children:[e.jsx("span",{children:"Master Setting Global"}),e.jsxs(Ee,{href:route("settings.system"),className:"inline-flex items-center gap-1 text-blue-600 hover:underline font-medium",children:[e.jsx(Nt,{className:"h-3 w-3"}),"Buka Pengaturan Sistem"]})]})]})]})]})]})]}),e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1",children:[e.jsxs("div",{className:"space-y-1.5",children:[e.jsx(F,{className:"text-xs font-semibold text-gray-700",children:"Status Exclude"}),e.jsxs(gt,{value:E,onValueChange:ie,children:[e.jsx(bt,{className:"w-full text-xs h-9 bg-white border-gray-200",children:e.jsx(ft,{})}),e.jsxs(yt,{children:[e.jsx(ue,{value:"active",children:"Hanya yang Diikutsertakan (Default)"}),e.jsx(ue,{value:"all",children:"Semua (Termasuk yang di-exclude)"}),e.jsx(ue,{value:"excluded",children:"Hanya yang Di-exclude"})]})]})]}),e.jsxs("div",{className:"space-y-1.5 sm:col-span-2 lg:col-span-3",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx(F,{className:"text-xs font-semibold text-gray-700",children:"Rentang Tanggal"}),e.jsxs("div",{className:"flex items-center gap-1.5",children:[e.jsx("span",{className:"text-[11px] text-gray-500",children:"Berdasarkan:"}),e.jsxs("select",{value:K,onChange:t=>oe(t.target.value),className:"text-[11px] font-semibold text-blue-600 bg-blue-50 border border-blue-200 rounded px-1.5 py-0.5 cursor-pointer focus:ring-0",children:[e.jsx("option",{value:"entry_date",children:"Tgl Masuk"}),e.jsx("option",{value:"eir_date",children:"Tgl EIR"}),e.jsx("option",{value:"exit_date",children:"Tgl Keluar"})]})]})]}),e.jsx(_t,{startDate:g,endDate:b,onChange:({startDate:t,endDate:s})=>{W(t),q(s)},onApply:({startDate:t,endDate:s})=>{W(t),q(s),pe({date_from:t,date_to:s})},placeholder:"Semua rentang tanggal...",className:"w-full",align:"right"})]})]}),c.length>0&&e.jsxs("div",{className:"flex flex-wrap items-center gap-1.5 border-t border-gray-100 pt-2.5",children:[e.jsx("span",{className:"text-[11px] text-gray-500 font-medium",children:"Layanan Terpilih:"}),c.map(t=>{const s=u.find(d=>d.id===t);return s?e.jsxs("span",{className:"inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 border border-blue-200",children:[s.service_type,e.jsx("button",{type:"button",onClick:()=>xe(t),className:"hover:text-blue-900 focus:outline-none",children:e.jsx(be,{className:"h-3 w-3"})})]},t):null}),e.jsx("button",{type:"button",onClick:()=>v([]),className:"text-[11px] text-gray-500 hover:text-rose-600 underline ml-1",children:"Hapus Semua"})]}),e.jsxs("div",{className:"flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-gray-100",children:[e.jsxs("div",{className:"relative w-full sm:max-w-md",children:[e.jsx(Ve,{className:"absolute left-3 top-2.5 h-4 w-4 text-gray-400"}),e.jsx(he,{type:"text",placeholder:"Cari nomor kontainer, customer, shipper, layanan, atau komoditi... (Tekan Enter)",value:R,onChange:t=>de(t.target.value),onKeyDown:De,className:"pl-9 text-xs h-9 bg-white border-gray-200"})]}),e.jsx("div",{className:"flex items-center gap-2 w-full sm:w-auto justify-end",children:e.jsx(N,{size:"sm",onClick:()=>pe(),className:"bg-gray-900 hover:bg-black text-white font-semibold text-xs h-9 px-5 shadow-2xs",children:"Terapkan Filter"})})]})]}),e.jsxs("div",{className:"rounded-xl border border-gray-200 bg-white shadow-xs p-5 space-y-4",children:[e.jsx("div",{className:"flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3",children:e.jsxs("div",{children:[e.jsx("h2",{className:"text-base font-bold text-gray-900",children:"Daftar Kontainer Karantina & Fumigasi"}),e.jsxs("p",{className:"text-xs text-gray-500 mt-0.5",children:["Menampilkan total ",e.jsx("span",{className:"font-bold text-gray-800",children:l.total??l.data.length})," kontainer sesuai kriteria filter aktif."]})]})}),e.jsx("div",{className:"overflow-x-auto rounded-lg border border-gray-200",children:e.jsxs(wt,{children:[e.jsx(jt,{className:"bg-slate-50 text-xs font-semibold text-slate-700 border-b border-gray-200",children:e.jsxs(ge,{className:"hover:bg-transparent",children:[e.jsx(j,{className:"px-4 py-3.5 whitespace-nowrap",children:e.jsx(C,{label:"Nomor Kontainer",field:"container_number",currentSort:a.sort_by,currentDir:a.sort_dir})}),e.jsx(j,{className:"px-4 py-3.5 whitespace-nowrap",children:e.jsx(C,{label:"Customer",field:"customers.name",currentSort:a.sort_by,currentDir:a.sort_dir})}),e.jsx(j,{className:"px-4 py-3.5 whitespace-nowrap",children:e.jsx(C,{label:"Nama Shipper",field:"shippers.name",currentSort:a.sort_by,currentDir:a.sort_dir})}),e.jsx(j,{className:"px-4 py-3.5 whitespace-nowrap",children:"Layanan"}),e.jsx(j,{className:"px-4 py-3.5 text-center whitespace-nowrap",children:"Size"}),e.jsx(j,{className:"px-4 py-3.5 whitespace-nowrap",children:e.jsx(C,{label:"Tanggal Masuk",field:"entry_date",currentSort:a.sort_by,currentDir:a.sort_dir})}),e.jsx(j,{className:"px-4 py-3.5 whitespace-nowrap",children:e.jsx(C,{label:"Tanggal EIR",field:"eir_date",currentSort:a.sort_by,currentDir:a.sort_dir})}),e.jsx(j,{className:"px-4 py-3.5 whitespace-nowrap",children:e.jsx(C,{label:"Tanggal Keluar",field:"exit_date",currentSort:a.sort_by,currentDir:a.sort_dir})}),e.jsx(j,{className:"px-4 py-3.5 whitespace-nowrap",children:"Komoditi"}),e.jsx(j,{className:"px-4 py-3.5 whitespace-nowrap",children:"Negara Tujuan"}),e.jsx(j,{className:"px-4 py-3.5 whitespace-nowrap",children:e.jsx(C,{label:"Fumigator",field:"fumigasi",currentSort:a.sort_by,currentDir:a.sort_dir})})]})}),e.jsx(vt,{className:"divide-y divide-gray-100 bg-white",children:l.data.length===0?e.jsx(ge,{children:e.jsx(f,{colSpan:11,className:"py-12 text-center text-sm text-gray-500",children:e.jsxs("div",{className:"flex flex-col items-center justify-center gap-1.5",children:[e.jsx(fe,{className:"h-6 w-6 text-gray-300"}),e.jsx("span",{className:"font-semibold text-gray-700",children:"Tidak ada data kontainer yang sesuai filter."}),e.jsx("span",{className:"text-xs text-gray-400",children:"Silakan ubah parameter filter atau klik Reset Filter."})]})})}):l.data.map(t=>{var s,d,o,w,J,p,I,B;return e.jsxs(ge,{className:"hover:bg-slate-50/70 transition-colors",children:[e.jsx(f,{className:"px-4 py-3 text-sm font-bold text-slate-900 font-mono",children:t.container_number}),e.jsx(f,{className:"px-4 py-3 text-sm font-semibold text-slate-900",children:((d=(s=t.order)==null?void 0:s.customer)==null?void 0:d.name)??t.customer_name??"-"}),e.jsx(f,{className:"px-4 py-3 text-sm text-slate-700",children:((w=(o=t.order)==null?void 0:o.shipper)==null?void 0:w.name)??t.shipper_name??"-"}),e.jsx(f,{className:"px-4 py-3 text-sm",children:e.jsx("span",{className:"inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 whitespace-nowrap",children:((J=t.product)==null?void 0:J.service_type)??t.service_type??((p=t.order)!=null&&p.fumigasi?"Fumigasi":"-")})}),e.jsx(f,{className:"px-4 py-3 text-sm text-center",children:e.jsx("span",{className:"inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200",children:We(t.price_type)})}),e.jsx(f,{className:"px-4 py-3 text-sm",children:we(t.entry_date)}),e.jsx(f,{className:"px-4 py-3 text-sm",children:we(t.eir_date)}),e.jsx(f,{className:"px-4 py-3 text-sm",children:we(t.exit_date)}),e.jsx(f,{className:"px-4 py-3 text-sm text-slate-800",children:t.commodity??"-"}),e.jsx(f,{className:"px-4 py-3 text-sm text-slate-800",children:t.country??"-"}),e.jsx(f,{className:"px-4 py-3 text-sm",children:((I=t.order)==null?void 0:I.fumigasi)??t.fumigasi?e.jsx("span",{className:"inline-flex items-center rounded-md bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800 border border-amber-200",children:((B=t.order)==null?void 0:B.fumigasi)??t.fumigasi}):e.jsx("span",{className:"text-gray-400",children:"–"})})]},t.id)})})]})}),e.jsxs("div",{className:"flex flex-col sm:flex-row items-center justify-between gap-3 pt-2",children:[e.jsxs("p",{className:"text-xs text-gray-500",children:["Menampilkan ",e.jsx("span",{className:"font-semibold text-gray-800",children:l.from??0})," sampai"," ",e.jsx("span",{className:"font-semibold text-gray-800",children:l.to??0})," dari"," ",e.jsx("span",{className:"font-semibold text-gray-800",children:l.total??l.data.length})," kontainer"]}),e.jsx("div",{className:"flex flex-wrap justify-center gap-1",children:l.links.map((t,s)=>t.url?e.jsx(N,{variant:t.active?"default":"outline",disabled:!t.url,onClick:()=>ae.get(t.url,{},{preserveState:!0,preserveScroll:!0}),className:`px-3 py-1 text-xs font-medium h-8 ${t.active?"bg-gray-900 text-white hover:bg-black":"text-gray-700 bg-white border-gray-200"}`,children:t.label.replace(/&laquo; Previous|Next &raquo;/,d=>d.includes("Previous")?"← Prev":d.includes("Next")?"Next →":d)},s):e.jsx("span",{className:"px-2.5 py-1 text-xs text-gray-400",children:"..."},s))})]})]})]})]})}export{oa as default};
