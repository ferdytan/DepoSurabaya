import{r as x,K as xt,j as e,L as mt,$ as Ue,S as te}from"./app-DD_WbcX5.js";import{A as ht,a as ut}from"./app-layout-BEgvADjF.js";import{B as S}from"./button-WPkkqOxM.js";import{I as fe}from"./input-DswkMGzr.js";import{L as z}from"./label-BlndSlGq.js";import{S as gt,a as ft,b as bt,c as yt,d as be}from"./select-C7wWimIu.js";import{S as Je}from"./searchable-select-DMOA2blF.js";import{T as wt,a as jt,b as ye,c as N,d as Nt,e as b}from"./table-CakN85Vg.js";import{C as Oe}from"./checkbox-C1y8dKMO.js";import{X as we,D as je,b as Ne,c as ve,d as ae,S as Ye,e as vt}from"./global-container-search-Cwhm3wZ1.js";import{t as St}from"./terbilang-DIgi2L4g.js";import{D as _t}from"./date-range-picker-CDqPvh3f.js";import{C as Ge}from"./check-vpcdIh_E.js";import{F as Se}from"./filter-ikTLyymq.js";import{C as kt}from"./chevron-up-BamONDPJ.js";import{C as se}from"./chevron-down-CVqoUdai.js";import{P as k}from"./printer-Chak_6it.js";import{R as Dt}from"./rotate-ccw-KxHxRZFK.js";import{S as Ct}from"./sparkles-MDLlPbNd.js";import{A as $t,a as Tt,b as At}from"./arrow-up-WtNpxdt2.js";/* empty css            */import"./index-C8dAEQ-M.js";import"./index-DjmgaV_F.js";import"./Combination-D4sbFYMM.js";import"./index-C39EdvcN.js";import"./truck-jtd_lAbu.js";import"./index-CAKwN4Ev.js";import"./app-logo-icon-BVmcvb98.js";import"./chevron-left-dEouRlv7.js";const Qe=["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];function _e(l){if(!l)return e.jsx("span",{className:"text-gray-400",children:"–"});const i=new Date(l);if(isNaN(i.getTime()))return e.jsx("span",{className:"text-gray-400",children:"–"});const h=String(i.getDate()).padStart(2,"0"),u=Qe[i.getMonth()],y=i.getFullYear(),a=String(i.getHours()).padStart(2,"0"),m=String(i.getMinutes()).padStart(2,"0");return e.jsxs("div",{className:"flex flex-col leading-tight whitespace-nowrap",children:[e.jsxs("span",{className:"font-semibold text-slate-800 text-xs",children:[h," ",u," ",y]}),e.jsxs("span",{className:"text-[11px] text-slate-500 font-normal",children:[a,":",m," WIB"]})]})}function We(l){if(!l)return"–";const i=new Date(l);if(isNaN(i.getTime()))return"–";const h=String(i.getDate()).padStart(2,"0"),u=Qe[i.getMonth()],y=i.getFullYear(),a=String(i.getHours()).padStart(2,"0"),m=String(i.getMinutes()).padStart(2,"0");return`${h} ${u} ${y}, ${a}:${m}`}function qe(l,i){if(!l)return i||"-";const h=String(l).trim();return h.toLowerCase().endsWith("ft")?h:h==="20"||h==="40"?`${h}ft`:h||i||"-"}function re(l){if(!l)return"-";try{const i=new Date(l);if(isNaN(i.getTime()))return String(l);const h=String(i.getDate()).padStart(2,"0"),u=String(i.getMonth()+1).padStart(2,"0"),y=i.getFullYear(),a=String(i.getHours()).padStart(2,"0"),m=String(i.getMinutes()).padStart(2,"0");return`${h}-${u}-${y} / ${a}.${m}`}catch{return String(l)}}function W(l){if(!l)return"-";const i=String(l).toLowerCase();return i.includes("20")?"20'":i.includes("40")?"40'":i.includes("45")?"45'":l}function _(l){return new Intl.NumberFormat("id-ID",{minimumFractionDigits:0,maximumFractionDigits:0}).format(l)}const Pt=[{title:"Dashboard",href:"/dashboard"},{title:"Karantina & Fumigasi",href:"/karantina"}];function oa({orders:l,customers:i=[],shippers:h=[],products:u=[],filters:y}){var Me,Fe,ze;const a=y||{},[m,ne]=x.useState(a.customer_id||"all"),[D,le]=x.useState(a.shipper_id||"all"),[A,ie]=x.useState(a.fumigator||""),[E,oe]=x.useState(a.exclude_status||"active"),[g,q]=x.useState(a.date_from||""),[f,Q]=x.useState(a.date_to||""),[K,de]=x.useState(a.date_type||"entry_date"),[R,ce]=x.useState(a.search||""),[ke,De]=x.useState(String(a.per_page||25)),Xe=Array.isArray(y==null?void 0:y.product_ids)?y.product_ids.map(Number).filter(t=>!isNaN(t)):[],[c,v]=x.useState(Xe),[H,Ce]=x.useState(""),[pe,Ze]=x.useState(!0),[P,$e]=x.useState(!1),et=x.useMemo(()=>[{value:"all",label:"Semua Customer"},...i.map(t=>({value:String(t.id),label:t.name}))],[i]),tt=x.useMemo(()=>[{value:"all",label:"Semua Shipper"},...h.map(t=>({value:String(t.id),label:t.name}))],[h]);x.useEffect(()=>{ne(a.customer_id||"all"),le(a.shipper_id||"all"),ie(a.fumigator||""),oe(a.exclude_status||"active"),q(a.date_from||""),Q(a.date_to||""),de(a.date_type||"entry_date"),ce(a.search||""),De(String(a.per_page||25));const t=Array.isArray(a.product_ids)?a.product_ids.map(Number).filter(r=>!isNaN(r)):[];v(t)},[a.customer_id,a.shipper_id,a.fumigator,a.exclude_status,a.date_from,a.date_to,a.date_type,a.search,a.per_page,a.product_ids]);const xe=t=>{const r=(t==null?void 0:t.customer_id)!==void 0?t.customer_id:m,d=(t==null?void 0:t.shipper_id)!==void 0?t.shipper_id:D,o=(t==null?void 0:t.fumigator)!==void 0?t.fumigator:A,w=(t==null?void 0:t.product_ids)!==void 0?t.product_ids:c,V=(t==null?void 0:t.exclude_status)!==void 0?t.exclude_status:E,p=(t==null?void 0:t.date_from)!==void 0?t.date_from:g,M=(t==null?void 0:t.date_to)!==void 0?t.date_to:f,F=(t==null?void 0:t.date_type)!==void 0?t.date_type:K,U=(t==null?void 0:t.search)!==void 0?t.search:R,J=(t==null?void 0:t.per_page)!==void 0?t.per_page:ke;te.get(route("index_karantina"),{customer_id:r==="all"?void 0:r,shipper_id:d==="all"?void 0:d,fumigator:o?o.trim():void 0,product_ids:w.length>0?w:void 0,exclude_status:V,date_from:p||void 0,date_to:M||void 0,date_type:F,search:U?U.trim():void 0,per_page:J,sort_by:a.sort_by||void 0,sort_dir:a.sort_dir||void 0,trashed:a.trashed||void 0},{preserveState:!0,preserveScroll:!0})},[Te,Ae]=x.useState(!1),at=()=>{Ae(!0),te.post(route("karantina.save_default_products"),{product_ids:c},{preserveScroll:!0,onFinish:()=>Ae(!1)})},st=()=>{ne("all"),le("all"),ie(""),v(a.default_product_ids||[]),oe("active"),q(""),Q(""),de("entry_date"),ce(""),De("25"),te.get(route("index_karantina"),{},{preserveScroll:!0})},Pe=t=>{t.key==="Enter"&&(t.preventDefault(),xe())},B=x.useMemo(()=>(a.default_product_ids||[]).map(Number).filter(t=>!isNaN(t)),[a.default_product_ids]),L=x.useMemo(()=>{if(c.length!==B.length)return!1;const t=new Set(c);return B.every(r=>t.has(r))},[c,B]),Be=x.useMemo(()=>u.filter(t=>{const r=(t.service_type||"").toLowerCase();return r.includes("karantina")||r.includes("fumigasi")}).map(t=>t.id),[u]),me=t=>{v(r=>r.includes(t)?r.filter(d=>d!==t):[...r,t])},rt=()=>{v(B)},nt=()=>{v(Be)},lt=()=>{v(u.map(t=>t.id))},it=()=>{v([])},C=u.filter(t=>t.service_type.toLowerCase().includes(H.toLowerCase())),Le=C.length>0&&C.every(t=>c.includes(t.id)),Ie=()=>{const t=C.map(r=>r.id);if(Le){const r=new Set(t);v(d=>d.filter(o=>!r.has(o)))}else v(r=>Array.from(new Set([...r,...t])))},I=async(t="A")=>{const r=window.open("","_blank");if(!r){alert("Gagal membuka jendela cetak. Pastikan izin popup browser diaktifkan.");return}const d=t==="B"?"Billing Statement B (Versi 2 Modern)":t==="B_CLASSIC"?"Billing Statement B (Versi 1 Klasik)":t==="C"?"Billing Statement C":t==="D"?"Billing Statement D (Versi 2 Modern)":t==="D_CLASSIC"?"Billing Statement D (Versi 1 Klasik)":"Billing Statement A";r.document.write(`
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
        `),r.document.close(),$e(!0);try{const o=new URLSearchParams;m&&m!=="all"&&o.append("customer_id",m),D&&D!=="all"&&o.append("shipper_id",D),A&&o.append("fumigator",A),E&&o.append("exclude_status",E),g&&o.append("date_from",g),f&&o.append("date_to",f),K&&o.append("date_type",K),R&&o.append("search",R),a.trashed&&o.append("trashed",a.trashed),a.sort_by&&o.append("sort_by",a.sort_by),a.sort_dir&&o.append("sort_dir",a.sort_dir),c.length>0&&c.forEach(n=>o.append("product_ids[]",n.toString()));const w=await fetch(`/karantina/print-data?${o.toString()}`);if(!w.ok)throw new Error("Gagal mengambil data dari server");const p=(await w.json()).data||[];if(p.length===0){r.document.body.innerHTML=`
                    <div style="text-align: center; margin-top: 50px; font-family: Arial, sans-serif;">
                        <p style="color: #ef4444; font-weight: 600;">Tidak ada data yang sesuai filter untuk dicetak.</p>
                        <button onclick="window.close()" style="padding: 6px 14px; cursor: pointer; border-radius: 4px; border: 1px solid #ccc;">Tutup</button>
                    </div>
                `;return}const M=g?new Date(g).toLocaleDateString("id-ID"):"Semua",F=f?new Date(f).toLocaleDateString("id-ID"):"Semua",U=`${M} s/d ${F}`,J="/logo-dss.png",Ee=new Date().toLocaleDateString("id-ID",{day:"numeric",month:"long",year:"numeric",hour:"2-digit",minute:"2-digit"});let O="-";if(m&&m!=="all"){const n=i.find(s=>String(s.id)===String(m));O=n?n.name:m}else{const n=Array.from(new Set(p.map(s=>s.customer_name).filter(Boolean)));n.length===1&&n[0]!=="-"?O=n[0]:n.length>1&&(O="Semua Customer")}const Z=n=>{const s=new Date(n),j=String(s.getDate()).padStart(2,"0"),ue=String(s.getMonth()+1).padStart(2,"0"),Y=String(s.getFullYear()).slice(-2);return`${j}/${ue}/${Y}`},Ke=g&&f?`${Z(g)} - ${Z(f)}`:g||f?`${g?Z(g):""} - ${f?Z(f):""}`:U,Re=p.reduce((n,s)=>n+(typeof s.price=="number"?s.price:0),0),He=p.reduce((n,s)=>{const j=typeof s.price=="number"?s.price:0;return n+(typeof s.ppn=="number"?s.ppn:Math.round(j*.11))},0),he=Re+He,ot=St(he),dt=p.filter(n=>W(n.price_type)==="20'").length,ct=p.filter(n=>W(n.price_type)==="40'").length,Ve=p.filter(n=>W(n.price_type)==="45'").length,pt=[`20': ${dt} Kontainer`,`40': ${ct} Kontainer`,...Ve>0?[`45': ${Ve} Kontainer`]:[],`Total: ${p.length} Kontainer`].join(" | ");let ee="";if(t==="B"||t==="D"){const n=t==="D";ee=`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>${n?"Billing Statement D":"Billing Statement B"} - PT. Depo Surabaya Sejahtera</title>
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
                        <div class="statement-title">${n?"BILLING STATEMENT D":"BILLING STATEMENT"}</div>
                    </div>
                </div>

                <div class="meta-panel">
                    <div class="meta-col">
                        ${n?"":`
                        <div class="meta-item">
                            <span class="meta-label">Customer</span>
                            <span>:</span>
                            <span class="meta-value" style="font-size: 9.5pt; color: #0284c7;">${O}</span>
                        </div>
                        `}
                        <div class="meta-item">
                            <span class="meta-label">Periode</span>
                            <span>:</span>
                            <span class="meta-value">${Ke}</span>
                        </div>
                    </div>
                    <div class="meta-col" style="align-items: flex-end;">
                        <div class="meta-item">
                            <span class="meta-label" style="width: auto;">Total Kontainer :</span>
                            <span class="meta-value">${p.length} Unit</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-label" style="width: auto;">Dicetak :</span>
                            <span class="meta-value">${Ee} WIB</span>
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
                        ${p.map((s,j)=>{const Y=j===p.length-1?"row-solid-bottom":"row-dashed",T=typeof s.price=="number"?s.price:0,G=typeof s.ppn=="number"?s.ppn:Math.round(T*.11),ge=typeof s.total=="number"?s.total:T+G;return`
                            <tr class="${Y}">
                                <td class="text-center">${j+1}</td>
                                <td class="text-center container-code">${s.container_number}</td>
                                <td>${s.shipper_name??"-"}</td>
                                <td class="text-center">${re(s.entry_date)}</td>
                                <td class="text-center">${re(s.exit_date)}</td>
                                <td class="text-center">${W(s.price_type)}</td>
                                <td class="text-center">${s.service_type??"Fumigasi"}</td>
                                <td class="text-center">${s.fumigasi??"-"}</td>
                                <td>
                                    <div class="currency-cell">
                                        <span>Rp</span>
                                        <span>${_(T)}</span>
                                    </div>
                                </td>
                                <td>
                                    <div class="currency-cell">
                                        <span>Rp</span>
                                        <span>${_(G)}</span>
                                    </div>
                                </td>
                                <td>
                                    <div class="currency-cell" style="font-weight: 700;">
                                        <span>Rp</span>
                                        <span>${_(ge)}</span>
                                    </div>
                                </td>
                            </tr>
                            `}).join("")}
                        <tr class="summary-row">
                            <td colspan="8" class="text-right">
                                TOTAL KESELURUHAN (${pt})
                            </td>
                            <td>
                                <div class="currency-cell">
                                    <span>Rp</span>
                                    <span>${_(Re)}</span>
                                </div>
                            </td>
                            <td>
                                <div class="currency-cell">
                                    <span>Rp</span>
                                    <span>${_(He)}</span>
                                </div>
                            </td>
                            <td class="grand-total-highlight">
                                <div class="currency-cell" style="font-weight: 900; font-size: 9pt;">
                                    <span>Rp</span>
                                    <span>${_(he)}</span>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div class="footer-wrapper">
                    <div class="terbilang-card">
                        <span style="font-weight: 600; color: #64748b;">Terbilang: </span>
                        <span class="terbilang-text"># ${ot} #</span>
                    </div>
                </div>
            </body>
            </html>
                `}else if(t==="B_CLASSIC"||t==="D_CLASSIC"){const n=t==="D_CLASSIC";ee=`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>${n?"Billing Statement D (Klasik)":"Billing Statement B (Klasik)"} - PT. Depo Surabaya Sejahtera</title>
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
                    <div class="statement-title">${n?"BILLING STATEMENT D":"BILLING STATEMENT"}</div>
                    <table class="meta-table">
                        ${n?"":`
                        <tr>
                            <td class="meta-label">Customer</td>
                            <td class="meta-sep">:</td>
                            <td class="meta-value">${O}</td>
                        </tr>
                        `}
                        <tr>
                            <td class="meta-label">Periode</td>
                            <td class="meta-sep">:</td>
                            <td class="meta-value">${Ke}</td>
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
                        ${p.map((s,j)=>{const Y=j===p.length-1?"row-solid-bottom":"row-dashed",T=typeof s.price=="number"?s.price:0,G=typeof s.ppn=="number"?s.ppn:Math.round(T*.11),ge=typeof s.total=="number"?s.total:T+G;return`
                            <tr class="${Y}">
                                <td class="text-center">${j+1}</td>
                                <td class="text-center" style="font-weight: 700;">${s.container_number}</td>
                                <td class="text-center">${s.shipper_name??"-"}</td>
                                <td class="text-center">${re(s.entry_date)}</td>
                                <td class="text-center">${re(s.exit_date)}</td>
                                <td class="text-center">${W(s.price_type)}</td>
                                <td class="text-center">${s.service_type??"Fumigasi"}</td>
                                <td class="text-center">${s.fumigasi??"-"}</td>
                                <td>
                                    <div class="currency-cell">
                                        <span>Rp</span>
                                        <span>${_(T)}</span>
                                    </div>
                                </td>
                                <td>
                                    <div class="currency-cell">
                                        <span>Rp</span>
                                        <span>${_(G)}</span>
                                    </div>
                                </td>
                                <td>
                                    <div class="currency-cell">
                                        <span>Rp</span>
                                        <span>${_(ge)}</span>
                                    </div>
                                </td>
                            </tr>
                            `}).join("")}
                        <tr class="grand-total-row">
                            <td colspan="10" style="border: none; background: transparent;"></td>
                            <td class="grand-total-cell">
                                <div class="currency-cell" style="font-weight: 800;">
                                    <span>Rp</span>
                                    <span>${_(he)}</span>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </body>
            </html>
                `}else{const n=t==="C";ee=`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>${n?"Billing Statement C":"Billing Statement"} - PT. Depo Surabaya Sejahtera</title>
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
                            <div class="report-title">${n?"BILLING STATEMENT C":"BILLING STATEMENT"}</div>
                            <div style="font-size: 10pt; color: #475569; font-weight: 600;">Layanan Karantina & Fumigasi</div>
                        </td>
                    </tr>
                </table>

                <div class="filter-info">
                    <div>
                        <strong>Periode:</strong> ${U} &nbsp;|&nbsp;
                        <strong>Total:</strong> ${p.length} Kontainer
                    </div>
                    <div>
                        <strong>Dicetak pada:</strong> ${Ee} WIB
                    </div>
                </div>

                <table class="data-table">
                    <thead>
                        <tr>
                            <th style="width: 30px; text-align: center;">No</th>
                            <th>Nomor Kontainer</th>
                            ${n?"":"<th>Customer</th>"}
                            <th>Nama Shipper</th>
                            ${n?"":"<th>Fumigator</th>"}
                            <th style="text-align: center; width: 60px;">Size</th>
                            <th>Tanggal Masuk</th>
                            <th>Tanggal Keluar</th>
                            <th>Komoditi</th>
                            <th>Negara Tujuan</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${p.map((s,j)=>`
                            <tr>
                                <td class="text-center">${j+1}</td>
                                <td style="font-weight: 700; font-family: monospace;">${s.container_number}</td>
                                ${n?"":`<td>${s.customer_name??"-"}</td>`}
                                <td>${s.shipper_name??"-"}</td>
                                ${n?"":`<td>${s.fumigasi??'<span class="text-gray-400">–</span>'}</td>`}
                                <td class="text-center">${qe(s.price_type)}</td>
                                <td>${s.entry_date?We(s.entry_date):'<span class="text-gray-400">–</span>'}</td>
                                <td>${s.exit_date?We(s.exit_date):'<span class="text-gray-400">–</span>'}</td>
                                <td>${s.commodity??"-"}</td>
                                <td>${s.country??"-"}</td>
                            </tr>
                        `).join("")}
                    </tbody>
                </table>
            </body>
            </html>
            `}r.document.open(),r.document.write(ee),r.document.close(),setTimeout(()=>{r.focus(),r.print()},300)}catch(o){console.error("Error saat mencetak billing statement:",o),r.document.body.innerHTML=`
                <div style="text-align: center; margin-top: 50px; font-family: Arial, sans-serif;">
                    <p style="color: #ef4444; font-weight: 600;">Terjadi kesalahan saat memuat seluruh data kontainer.</p>
                    <button onclick="window.close()" style="padding: 6px 14px; cursor: pointer; border-radius: 4px; border: 1px solid #ccc;">Tutup</button>
                </div>
            `}finally{$e(!1)}},$=({label:t,field:r,currentSort:d,currentDir:o})=>{const w=d===r&&o==="asc"?"desc":"asc";return e.jsxs(Ue,{href:route("index_karantina",{customer_id:m==="all"?void 0:m,shipper_id:D==="all"?void 0:D,fumigator:A?A.trim():void 0,exclude_status:E,date_from:g||void 0,date_to:f||void 0,date_type:K,product_ids:c.length>0?c:void 0,search:R||void 0,per_page:ke,sort_by:r,sort_dir:w}),preserveState:!0,preserveScroll:!0,className:"inline-flex items-center gap-1 font-semibold text-slate-700 hover:text-black transition-colors",children:[e.jsx("span",{children:t}),d===r?w==="asc"?e.jsx($t,{className:"h-3.5 w-3.5 text-blue-600"}):e.jsx(Tt,{className:"h-3.5 w-3.5 text-blue-600"}):e.jsx(At,{className:"h-3.5 w-3.5 text-gray-400 opacity-60 hover:opacity-100"})]})},{props:X}=xt();return e.jsxs(ht,{breadcrumbs:Pt,children:[e.jsx(mt,{title:"Karantina & Fumigasi - Depo Surabaya"}),e.jsxs("div",{className:"w-full space-y-6 px-4 py-6 sm:px-6 lg:px-8 bg-slate-50/50 min-h-screen",children:[((Me=X.flash)==null?void 0:Me.success)&&e.jsxs("div",{className:"flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-800 shadow-2xs",children:[e.jsx(Ge,{className:"h-4 w-4 text-emerald-600 shrink-0"}),e.jsx("span",{children:X.flash.success})]}),((Fe=X.flash)==null?void 0:Fe.error)&&e.jsxs("div",{className:"flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-800 shadow-2xs",children:[e.jsx(we,{className:"h-4 w-4 text-rose-600 shrink-0"}),e.jsx("span",{children:X.flash.error})]}),e.jsxs("div",{className:"flex flex-col sm:flex-row sm:items-center justify-between gap-4",children:[e.jsxs("div",{children:[e.jsxs("div",{className:"flex items-center gap-2.5",children:[e.jsx(ut,{className:"h-7 w-7 text-gray-900"}),e.jsx("h1",{className:"text-2xl font-bold tracking-tight text-gray-900",children:"Karantina & Fumigasi"}),e.jsx("span",{className:"inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700 border border-slate-200",children:"Billing & Monitoring"})]}),e.jsx("p",{className:"text-xs text-gray-500 mt-1",children:"Kelola data pergerakan kontainer karantina, filter multi-parameter, dan cetak billing statement resmi."})]}),e.jsxs("div",{className:"flex flex-wrap items-center gap-2",children:[e.jsxs(S,{variant:"outline",size:"sm",onClick:()=>Ze(!pe),className:"gap-1.5 h-9 text-xs border-gray-300 bg-white shadow-2xs",children:[e.jsx(Se,{className:"h-3.5 w-3.5 text-blue-600"}),e.jsx("span",{children:"Filter"}),pe?e.jsx(kt,{className:"h-3.5 w-3.5 text-gray-500"}):e.jsx(se,{className:"h-3.5 w-3.5 text-gray-500"})]}),e.jsxs(S,{type:"button",size:"sm",disabled:P,onClick:()=>I("A"),className:"bg-gray-900 hover:bg-black text-white font-semibold text-xs h-9 px-3.5 gap-1.5 shadow-2xs disabled:opacity-70",title:"Cetak Billing Statement A (Format Lengkap)",children:[e.jsx(k,{className:`h-3.5 w-3.5 ${P?"animate-spin":""}`}),e.jsx("span",{children:"Billing Statement A"})]}),e.jsxs(je,{children:[e.jsx(Ne,{asChild:!0,children:e.jsxs(S,{type:"button",size:"sm",disabled:P,variant:"outline",className:"border-gray-300 text-gray-800 bg-white hover:bg-gray-50 font-semibold text-xs h-9 px-3.5 gap-1.5 shadow-2xs",title:"Pilih dan Cetak Billing Statement Format B",children:[e.jsx(k,{className:"h-3.5 w-3.5 text-gray-600"}),e.jsx("span",{children:"Billing Statement B"}),e.jsx(se,{className:"h-3 w-3 text-gray-400 ml-0.5"})]})}),e.jsxs(ve,{align:"end",className:"w-72",children:[e.jsxs(ae,{onClick:()=>I("B"),className:"cursor-pointer flex flex-col items-start py-2.5 px-3",children:[e.jsxs("div",{className:"font-semibold text-xs text-gray-900 flex items-center gap-1.5",children:[e.jsx(k,{className:"h-3.5 w-3.5 text-blue-600"}),e.jsx("span",{children:"Versi 2 (Modern - A4 Landscape)"})]}),e.jsx("span",{className:"text-[11px] text-gray-500 mt-1 pl-5",children:"Desain modern, rekap total, terbilang resmi & kolom tanda tangan"})]}),e.jsxs(ae,{onClick:()=>I("B_CLASSIC"),className:"cursor-pointer flex flex-col items-start py-2.5 px-3 border-t border-gray-100",children:[e.jsxs("div",{className:"font-semibold text-xs text-gray-700 flex items-center gap-1.5",children:[e.jsx(k,{className:"h-3.5 w-3.5 text-gray-500"}),e.jsx("span",{children:"Versi 1 (Klasik - A4 Landscape)"})]}),e.jsx("span",{className:"text-[11px] text-gray-500 mt-1 pl-5",children:"Format tabel standar klasik / retro"})]})]})]}),e.jsxs(S,{type:"button",size:"sm",disabled:P,onClick:()=>I("C"),variant:"outline",className:"border-gray-300 text-gray-800 bg-white hover:bg-gray-50 font-semibold text-xs h-9 px-3.5 gap-1.5 shadow-2xs disabled:opacity-70",title:"Cetak Billing Statement C (Format A tanpa Customer & Fumigator)",children:[e.jsx(k,{className:`h-3.5 w-3.5 ${P?"animate-spin":"text-gray-600"}`}),e.jsx("span",{children:"Billing Statement C"})]}),e.jsxs(je,{children:[e.jsx(Ne,{asChild:!0,children:e.jsxs(S,{type:"button",size:"sm",disabled:P,variant:"outline",className:"border-gray-300 text-gray-800 bg-white hover:bg-gray-50 font-semibold text-xs h-9 px-3.5 gap-1.5 shadow-2xs",title:"Pilih dan Cetak Billing Statement Format D (Format B tanpa Customer)",children:[e.jsx(k,{className:"h-3.5 w-3.5 text-gray-600"}),e.jsx("span",{children:"Billing Statement D"}),e.jsx(se,{className:"h-3 w-3 text-gray-400 ml-0.5"})]})}),e.jsxs(ve,{align:"end",className:"w-72",children:[e.jsxs(ae,{onClick:()=>I("D"),className:"cursor-pointer flex flex-col items-start py-2.5 px-3",children:[e.jsxs("div",{className:"font-semibold text-xs text-gray-900 flex items-center gap-1.5",children:[e.jsx(k,{className:"h-3.5 w-3.5 text-blue-600"}),e.jsx("span",{children:"Versi 2 (Modern - Tanpa Customer)"})]}),e.jsx("span",{className:"text-[11px] text-gray-500 mt-1 pl-5",children:"Format B Modern tanpa menampilkan nama customer"})]}),e.jsxs(ae,{onClick:()=>I("D_CLASSIC"),className:"cursor-pointer flex flex-col items-start py-2.5 px-3 border-t border-gray-100",children:[e.jsxs("div",{className:"font-semibold text-xs text-gray-700 flex items-center gap-1.5",children:[e.jsx(k,{className:"h-3.5 w-3.5 text-gray-500"}),e.jsx("span",{children:"Versi 1 (Klasik - Tanpa Customer)"})]}),e.jsx("span",{className:"text-[11px] text-gray-500 mt-1 pl-5",children:"Format B Klasik tanpa menampilkan nama customer"})]})]})]})]})]}),pe&&e.jsxs("div",{className:"rounded-xl border border-gray-200 bg-white p-5 shadow-xs space-y-4",children:[e.jsxs("div",{className:"flex items-center justify-between border-b border-gray-100 pb-3",children:[e.jsxs("span",{className:"text-sm font-bold text-gray-800 flex items-center gap-2",children:[e.jsx(Se,{className:"h-4 w-4 text-blue-600"}),"Parameter Filter"]}),e.jsxs(S,{variant:"ghost",size:"sm",onClick:st,className:"text-xs text-gray-500 hover:text-rose-600 gap-1.5 h-8 px-2",children:[e.jsx(Dt,{className:"h-3.5 w-3.5"}),e.jsx("span",{children:"Reset Filter"})]})]}),e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4",children:[e.jsxs("div",{className:"space-y-1.5",children:[e.jsx(z,{className:"text-xs font-semibold text-gray-700",children:"Customer"}),e.jsx(Je,{options:et,value:m,onChange:t=>ne(t||"all"),placeholder:"Semua Customer",searchPlaceholder:"Cari customer...",showClear:!1,className:"w-full text-xs h-9 bg-white"})]}),e.jsxs("div",{className:"space-y-1.5",children:[e.jsx(z,{className:"text-xs font-semibold text-gray-700",children:"Shipper"}),e.jsx(Je,{options:tt,value:D,onChange:t=>le(t||"all"),placeholder:"Semua Shipper",searchPlaceholder:"Cari shipper...",showClear:!1,className:"w-full text-xs h-9 bg-white"})]}),e.jsxs("div",{className:"space-y-1.5",children:[e.jsx(z,{className:"text-xs font-semibold text-gray-700",children:"Fumigator"}),e.jsx(fe,{type:"text",value:A,onChange:t=>ie(t.target.value),onKeyDown:Pe,placeholder:"Ketik nama fumigator...",className:"text-xs h-9 bg-white border-gray-200"})]}),e.jsxs("div",{className:"space-y-1.5",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{className:"flex items-center gap-1.5",children:[e.jsx(z,{className:"text-xs font-semibold text-gray-700",children:"Jenis Layanan"}),L&&c.length>0&&e.jsx("span",{className:"text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200",children:"Default"})]}),c.length>0&&e.jsxs("span",{className:"text-[10px] text-blue-600 font-bold bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200",children:[c.length," dipilih"]})]}),e.jsxs(je,{children:[e.jsx(Ne,{asChild:!0,children:e.jsxs(S,{variant:"outline",type:"button",className:"w-full justify-between border-gray-200 bg-white text-xs font-normal text-gray-800 shadow-2xs hover:bg-gray-50 h-9",children:[e.jsx("span",{className:"truncate",children:c.length===0?"Semua Layanan":L?`Default Layanan (${c.length})`:c.length===1?((ze=u.find(t=>t.id===c[0]))==null?void 0:ze.service_type)||"1 Layanan":`${c.length} Layanan Dipilih`}),e.jsx(se,{className:"ml-1.5 h-3.5 w-3.5 shrink-0 opacity-50"})]})}),e.jsxs(ve,{className:"w-88 p-2.5 shadow-xl max-w-sm",align:"start",children:[e.jsxs("div",{className:"flex items-center justify-between px-1 pb-2 border-b border-gray-100",children:[e.jsx("span",{className:"text-xs font-semibold text-gray-800",children:"Pilih Layanan"}),e.jsxs("div",{className:"flex flex-wrap gap-1.5 text-[11px]",children:[B.length>0&&e.jsxs("button",{type:"button",onClick:t=>{t.preventDefault(),rt()},className:`px-1.5 py-0.5 rounded text-[10px] font-medium transition-colors ${L?"bg-emerald-100 text-emerald-800 font-bold":"bg-emerald-50 text-emerald-700 hover:bg-emerald-100"}`,title:"Terapkan master default yang tersimpan",children:["Default (",B.length,")"]}),e.jsxs("button",{type:"button",onClick:t=>{t.preventDefault(),nt()},className:"px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors",title:"Pilih semua layanan karantina & fumigasi",children:["Karantina (",Be.length,")"]}),e.jsx("button",{type:"button",onClick:t=>{t.preventDefault(),lt()},className:"text-gray-600 hover:text-blue-600 text-[10px] font-medium",children:"Semua"}),e.jsx("span",{className:"text-gray-300",children:"|"}),e.jsx("button",{type:"button",onClick:t=>{t.preventDefault(),it()},className:"text-gray-500 hover:text-rose-600 text-[10px]",children:"Kosongkan"})]})]}),e.jsxs("div",{className:"relative my-2 px-0.5",children:[e.jsx(Ye,{className:"absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-400"}),e.jsx(fe,{type:"text",placeholder:"Cari layanan...",value:H,onChange:t=>Ce(t.target.value),onKeyDown:t=>t.stopPropagation(),className:"h-8 pl-8 pr-7 text-xs rounded-md border-gray-200"}),H&&e.jsx("button",{type:"button",onClick:()=>Ce(""),className:"absolute right-2.5 top-2 text-gray-400 hover:text-gray-600",children:e.jsx(we,{className:"h-3.5 w-3.5"})})]}),C.length>0&&e.jsxs("div",{onClick:t=>{t.preventDefault(),Ie()},className:"flex items-center gap-2 px-2 py-1.5 mb-1.5 rounded bg-slate-50 hover:bg-slate-100 cursor-pointer text-xs font-medium text-slate-700 border border-slate-200 transition-colors",children:[e.jsx(Oe,{checked:Le,onCheckedChange:Ie,className:"h-3.5 w-3.5"}),e.jsx("span",{className:"truncate text-xs",children:H?`Centang Semua ("${H}")`:`Centang Semua (${C.length})`})]}),e.jsx("div",{className:"space-y-0.5 max-h-56 overflow-y-auto pr-0.5",children:C.length===0?e.jsx("div",{className:"py-4 text-center text-xs text-gray-400",children:"Tidak ada layanan cocok"}):C.map(t=>{const r=c.includes(t.id);return e.jsxs("div",{onClick:d=>{d.preventDefault(),me(t.id)},className:`flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer text-xs transition-colors ${r?"bg-blue-50 text-blue-900 font-medium":"hover:bg-gray-100 text-gray-700"}`,children:[e.jsx(Oe,{checked:r,onCheckedChange:()=>me(t.id),className:"h-3.5 w-3.5"}),e.jsx("span",{className:"truncate",children:t.service_type})]},t.id)})}),e.jsxs("div",{className:"mt-2 pt-2 border-t border-gray-100 space-y-1.5",children:[e.jsx(S,{type:"button",variant:"outline",size:"sm",disabled:Te||L,onClick:t=>{t.preventDefault(),at()},className:`w-full h-8 text-[11px] justify-center gap-1.5 ${L?"bg-emerald-50 text-emerald-700 border-emerald-200 cursor-default opacity-90":"hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 text-gray-700"}`,children:L?e.jsxs(e.Fragment,{children:[e.jsx(Ge,{className:"h-3.5 w-3.5 text-emerald-600"}),e.jsx("span",{children:"Sudah Sesuai Master Default"})]}):Te?e.jsx("span",{children:"Menyimpan Master Default..."}):e.jsxs(e.Fragment,{children:[e.jsx(Ct,{className:"h-3.5 w-3.5 text-blue-600"}),e.jsx("span",{children:"Jadikan Pilihan Saat Ini Sebagai Master Default"})]})}),e.jsxs("div",{className:"flex items-center justify-between px-1 text-[11px] text-gray-500",children:[e.jsx("span",{children:"Master Setting Global"}),e.jsxs(Ue,{href:route("settings.system"),className:"inline-flex items-center gap-1 text-blue-600 hover:underline font-medium",children:[e.jsx(vt,{className:"h-3 w-3"}),"Buka Pengaturan Sistem"]})]})]})]})]})]})]}),e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1",children:[e.jsxs("div",{className:"space-y-1.5",children:[e.jsx(z,{className:"text-xs font-semibold text-gray-700",children:"Status Exclude"}),e.jsxs(gt,{value:E,onValueChange:oe,children:[e.jsx(ft,{className:"w-full text-xs h-9 bg-white border-gray-200",children:e.jsx(bt,{})}),e.jsxs(yt,{children:[e.jsx(be,{value:"active",children:"Hanya yang Diikutsertakan (Default)"}),e.jsx(be,{value:"all",children:"Semua (Termasuk yang di-exclude)"}),e.jsx(be,{value:"excluded",children:"Hanya yang Di-exclude"})]})]})]}),e.jsxs("div",{className:"space-y-1.5 sm:col-span-2 lg:col-span-3",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx(z,{className:"text-xs font-semibold text-gray-700",children:"Rentang Tanggal"}),e.jsxs("div",{className:"flex items-center gap-1.5",children:[e.jsx("span",{className:"text-[11px] text-gray-500",children:"Berdasarkan:"}),e.jsxs("select",{value:K,onChange:t=>de(t.target.value),className:"text-[11px] font-semibold text-blue-600 bg-blue-50 border border-blue-200 rounded px-1.5 py-0.5 cursor-pointer focus:ring-0",children:[e.jsx("option",{value:"entry_date",children:"Tgl Masuk"}),e.jsx("option",{value:"eir_date",children:"Tgl EIR"}),e.jsx("option",{value:"exit_date",children:"Tgl Keluar"})]})]})]}),e.jsx(_t,{startDate:g,endDate:f,onChange:({startDate:t,endDate:r})=>{q(t),Q(r)},onApply:({startDate:t,endDate:r})=>{q(t),Q(r),xe({date_from:t,date_to:r})},placeholder:"Semua rentang tanggal...",className:"w-full",align:"right"})]})]}),c.length>0&&e.jsxs("div",{className:"flex flex-wrap items-center gap-1.5 border-t border-gray-100 pt-2.5",children:[e.jsx("span",{className:"text-[11px] text-gray-500 font-medium",children:"Layanan Terpilih:"}),c.map(t=>{const r=u.find(d=>d.id===t);return r?e.jsxs("span",{className:"inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 border border-blue-200",children:[r.service_type,e.jsx("button",{type:"button",onClick:()=>me(t),className:"hover:text-blue-900 focus:outline-none",children:e.jsx(we,{className:"h-3 w-3"})})]},t):null}),e.jsx("button",{type:"button",onClick:()=>v([]),className:"text-[11px] text-gray-500 hover:text-rose-600 underline ml-1",children:"Hapus Semua"})]}),e.jsxs("div",{className:"flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-gray-100",children:[e.jsxs("div",{className:"relative w-full sm:max-w-md",children:[e.jsx(Ye,{className:"absolute left-3 top-2.5 h-4 w-4 text-gray-400"}),e.jsx(fe,{type:"text",placeholder:"Cari nomor kontainer, customer, shipper, layanan, atau komoditi... (Tekan Enter)",value:R,onChange:t=>ce(t.target.value),onKeyDown:Pe,className:"pl-9 text-xs h-9 bg-white border-gray-200"})]}),e.jsx("div",{className:"flex items-center gap-2 w-full sm:w-auto justify-end",children:e.jsx(S,{size:"sm",onClick:()=>xe(),className:"bg-gray-900 hover:bg-black text-white font-semibold text-xs h-9 px-5 shadow-2xs",children:"Terapkan Filter"})})]})]}),e.jsxs("div",{className:"rounded-xl border border-gray-200 bg-white shadow-xs p-5 space-y-4",children:[e.jsx("div",{className:"flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3",children:e.jsxs("div",{children:[e.jsx("h2",{className:"text-base font-bold text-gray-900",children:"Daftar Kontainer Karantina & Fumigasi"}),e.jsxs("p",{className:"text-xs text-gray-500 mt-0.5",children:["Menampilkan total ",e.jsx("span",{className:"font-bold text-gray-800",children:l.total??l.data.length})," kontainer sesuai kriteria filter aktif."]})]})}),e.jsx("div",{className:"overflow-x-auto rounded-lg border border-gray-200",children:e.jsxs(wt,{children:[e.jsx(jt,{className:"bg-slate-50 text-xs font-semibold text-slate-700 border-b border-gray-200",children:e.jsxs(ye,{className:"hover:bg-transparent",children:[e.jsx(N,{className:"px-4 py-3.5 whitespace-nowrap",children:e.jsx($,{label:"Nomor Kontainer",field:"container_number",currentSort:a.sort_by,currentDir:a.sort_dir})}),e.jsx(N,{className:"px-4 py-3.5 whitespace-nowrap",children:e.jsx($,{label:"Customer",field:"customers.name",currentSort:a.sort_by,currentDir:a.sort_dir})}),e.jsx(N,{className:"px-4 py-3.5 whitespace-nowrap",children:e.jsx($,{label:"Nama Shipper",field:"shippers.name",currentSort:a.sort_by,currentDir:a.sort_dir})}),e.jsx(N,{className:"px-4 py-3.5 whitespace-nowrap",children:"Layanan"}),e.jsx(N,{className:"px-4 py-3.5 text-center whitespace-nowrap",children:"Size"}),e.jsx(N,{className:"px-4 py-3.5 whitespace-nowrap",children:e.jsx($,{label:"Tanggal Masuk",field:"entry_date",currentSort:a.sort_by,currentDir:a.sort_dir})}),e.jsx(N,{className:"px-4 py-3.5 whitespace-nowrap",children:e.jsx($,{label:"Tanggal EIR",field:"eir_date",currentSort:a.sort_by,currentDir:a.sort_dir})}),e.jsx(N,{className:"px-4 py-3.5 whitespace-nowrap",children:e.jsx($,{label:"Tanggal Keluar",field:"exit_date",currentSort:a.sort_by,currentDir:a.sort_dir})}),e.jsx(N,{className:"px-4 py-3.5 whitespace-nowrap",children:"Komoditi"}),e.jsx(N,{className:"px-4 py-3.5 whitespace-nowrap",children:"Negara Tujuan"}),e.jsx(N,{className:"px-4 py-3.5 whitespace-nowrap",children:e.jsx($,{label:"Fumigator",field:"fumigasi",currentSort:a.sort_by,currentDir:a.sort_dir})})]})}),e.jsx(Nt,{className:"divide-y divide-gray-100 bg-white",children:l.data.length===0?e.jsx(ye,{children:e.jsx(b,{colSpan:11,className:"py-12 text-center text-sm text-gray-500",children:e.jsxs("div",{className:"flex flex-col items-center justify-center gap-1.5",children:[e.jsx(Se,{className:"h-6 w-6 text-gray-300"}),e.jsx("span",{className:"font-semibold text-gray-700",children:"Tidak ada data kontainer yang sesuai filter."}),e.jsx("span",{className:"text-xs text-gray-400",children:"Silakan ubah parameter filter atau klik Reset Filter."})]})})}):l.data.map(t=>{var r,d,o,w,V,p,M,F;return e.jsxs(ye,{className:"hover:bg-slate-50/70 transition-colors",children:[e.jsx(b,{className:"px-4 py-3 text-sm font-bold text-slate-900 font-mono",children:t.container_number}),e.jsx(b,{className:"px-4 py-3 text-sm font-semibold text-slate-900",children:((d=(r=t.order)==null?void 0:r.customer)==null?void 0:d.name)??t.customer_name??"-"}),e.jsx(b,{className:"px-4 py-3 text-sm text-slate-700",children:((w=(o=t.order)==null?void 0:o.shipper)==null?void 0:w.name)??t.shipper_name??"-"}),e.jsx(b,{className:"px-4 py-3 text-sm",children:e.jsx("span",{className:"inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 whitespace-nowrap",children:((V=t.product)==null?void 0:V.service_type)??t.service_type??((p=t.order)!=null&&p.fumigasi?"Fumigasi":"-")})}),e.jsx(b,{className:"px-4 py-3 text-sm text-center",children:e.jsx("span",{className:"inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200",children:qe(t.price_type)})}),e.jsx(b,{className:"px-4 py-3 text-sm",children:_e(t.entry_date)}),e.jsx(b,{className:"px-4 py-3 text-sm",children:_e(t.eir_date)}),e.jsx(b,{className:"px-4 py-3 text-sm",children:_e(t.exit_date)}),e.jsx(b,{className:"px-4 py-3 text-sm text-slate-800",children:t.commodity??"-"}),e.jsx(b,{className:"px-4 py-3 text-sm text-slate-800",children:t.country??"-"}),e.jsx(b,{className:"px-4 py-3 text-sm",children:((M=t.order)==null?void 0:M.fumigasi)??t.fumigasi?e.jsx("span",{className:"inline-flex items-center rounded-md bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800 border border-amber-200",children:((F=t.order)==null?void 0:F.fumigasi)??t.fumigasi}):e.jsx("span",{className:"text-gray-400",children:"–"})})]},t.id)})})]})}),e.jsxs("div",{className:"flex flex-col sm:flex-row items-center justify-between gap-3 pt-2",children:[e.jsxs("p",{className:"text-xs text-gray-500",children:["Menampilkan ",e.jsx("span",{className:"font-semibold text-gray-800",children:l.from??0})," sampai"," ",e.jsx("span",{className:"font-semibold text-gray-800",children:l.to??0})," dari"," ",e.jsx("span",{className:"font-semibold text-gray-800",children:l.total??l.data.length})," kontainer"]}),e.jsx("div",{className:"flex flex-wrap justify-center gap-1",children:l.links.map((t,r)=>t.url?e.jsx(S,{variant:t.active?"default":"outline",disabled:!t.url,onClick:()=>te.get(t.url,{},{preserveState:!0,preserveScroll:!0}),className:`px-3 py-1 text-xs font-medium h-8 ${t.active?"bg-gray-900 text-white hover:bg-black":"text-gray-700 bg-white border-gray-200"}`,children:t.label.replace(/&laquo; Previous|Next &raquo;/,d=>d.includes("Previous")?"← Prev":d.includes("Next")?"Next →":d)},r):e.jsx("span",{className:"px-2.5 py-1 text-xs text-gray-400",children:"..."},r))})]})]})]})]})}export{oa as default};
