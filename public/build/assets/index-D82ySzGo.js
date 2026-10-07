import{r as c,K as Pe,j as e,L as Ae,S as G,$ as Ie}from"./app-DMsg2DCT.js";import{A as Le,X as Q,D as Fe,c as Ke,d as Be,a as ye}from"./app-layout-fwbii_N9.js";import{B as _}from"./button-DHnIvQQ_.js";import{I as X}from"./input-4A75sX0N.js";import{L as D}from"./label-Cd0NzLj_.js";import{C as Me,S as Z,a as ee,b as te,c as ae,d as v}from"./select-D3DXHwTo.js";import{T as ze,a as Ee,b as se,c as f,d as Re,e as h}from"./table-CwrSGkF1.js";import{C as je}from"./checkbox-BelPl-gr.js";import{D as He}from"./date-range-picker-CrA0J5jA.js";import{C as Ue}from"./check-B8eEzFm9.js";import{S as Je}from"./shield-Ctq1BikI.js";import{F as re}from"./filter-DoH62aTP.js";import{C as Ne}from"./chevron-down-CwIsBsZ4.js";import{P as we}from"./printer-C4nQT9gw.js";import{R as Oe}from"./rotate-ccw-CyMlzKzB.js";import{A as Ye,a as Ve,b as We}from"./arrow-up-D0P8ChSS.js";import"./index-C0MJBFh4.js";import"./Combination-DycyS7hH.js";import"./index-CtSOSS5r.js";import"./index-SV2wpsAD.js";import"./app-logo-icon-Dpuyjm3g.js";import"./index-CQDnU5uN.js";import"./chevron-left-CPcg2pwy.js";const ve=["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];function ne(l){if(!l)return e.jsx("span",{className:"text-gray-400",children:"–"});const i=new Date(l);if(isNaN(i.getTime()))return e.jsx("span",{className:"text-gray-400",children:"–"});const x=String(i.getDate()).padStart(2,"0"),u=ve[i.getMonth()],g=i.getFullYear(),a=String(i.getHours()).padStart(2,"0"),p=String(i.getMinutes()).padStart(2,"0");return e.jsxs("div",{className:"flex flex-col leading-tight whitespace-nowrap",children:[e.jsxs("span",{className:"font-semibold text-slate-800 text-xs",children:[x," ",u," ",g]}),e.jsxs("span",{className:"text-[11px] text-slate-500 font-normal",children:[a,":",p," WIB"]})]})}function le(l){if(!l)return"–";const i=new Date(l);if(isNaN(i.getTime()))return"–";const x=String(i.getDate()).padStart(2,"0"),u=ve[i.getMonth()],g=i.getFullYear(),a=String(i.getHours()).padStart(2,"0"),p=String(i.getMinutes()).padStart(2,"0");return`${x} ${u} ${g}, ${a}:${p}`}function _e(l,i){if(!l)return i||"-";const x=String(l).trim();return x.toLowerCase().endsWith("ft")?x:x==="20"||x==="40"?`${x}ft`:x||i||"-"}const qe=[{title:"Dashboard",href:"/dashboard"},{title:"Karantina & Fumigasi",href:"/karantina"}];function yt({orders:l,customers:i=[],shippers:x=[],products:u=[],filters:g}){var ue,ge,fe;const a=g||{},[p,B]=c.useState(a.customer_id||"all"),[y,M]=c.useState(a.shipper_id||"all"),[S,z]=c.useState(a.fumigator||""),[T,E]=c.useState(a.exclude_status||"active"),[j,I]=c.useState(a.date_from||""),[N,L]=c.useState(a.date_to||""),[C,R]=c.useState(a.date_type||"entry_date"),[$,H]=c.useState(a.search||""),[ie,oe]=c.useState(String(a.per_page||25)),Se=Array.isArray(g==null?void 0:g.product_ids)?g.product_ids.map(Number).filter(t=>!isNaN(t)):[],[o,b]=c.useState(Se),[P,de]=c.useState(""),[U,ke]=c.useState(!0),[J,ce]=c.useState(!1);c.useEffect(()=>{B(a.customer_id||"all"),M(a.shipper_id||"all"),z(a.fumigator||""),E(a.exclude_status||"active"),I(a.date_from||""),L(a.date_to||""),R(a.date_type||"entry_date"),H(a.search||""),oe(String(a.per_page||25));const t=Array.isArray(a.product_ids)?a.product_ids.map(Number).filter(s=>!isNaN(s)):[];b(t)},[a.customer_id,a.shipper_id,a.fumigator,a.exclude_status,a.date_from,a.date_to,a.date_type,a.search,a.per_page,a.product_ids]);const O=t=>{const s=(t==null?void 0:t.customer_id)!==void 0?t.customer_id:p,r=(t==null?void 0:t.shipper_id)!==void 0?t.shipper_id:y,n=(t==null?void 0:t.fumigator)!==void 0?t.fumigator:S,m=(t==null?void 0:t.product_ids)!==void 0?t.product_ids:o,be=(t==null?void 0:t.exclude_status)!==void 0?t.exclude_status:T,A=(t==null?void 0:t.date_from)!==void 0?t.date_from:j,V=(t==null?void 0:t.date_to)!==void 0?t.date_to:N,W=(t==null?void 0:t.date_type)!==void 0?t.date_type:C,K=(t==null?void 0:t.search)!==void 0?t.search:$,q=(t==null?void 0:t.per_page)!==void 0?t.per_page:ie;G.get(route("index_karantina"),{customer_id:s==="all"?void 0:s,shipper_id:r==="all"?void 0:r,fumigator:n?n.trim():void 0,product_ids:m.length>0?m:void 0,exclude_status:be,date_from:A||void 0,date_to:V||void 0,date_type:W,search:K?K.trim():void 0,per_page:q,sort_by:a.sort_by||void 0,sort_dir:a.sort_dir||void 0,trashed:a.trashed||void 0},{preserveState:!0,preserveScroll:!0})},De=()=>{B("all"),M("all"),z(""),b([]),E("active"),I(""),L(""),R("entry_date"),H(""),oe("25"),G.get(route("index_karantina"),{},{preserveScroll:!0})},xe=t=>{t.key==="Enter"&&(t.preventDefault(),O())},Y=t=>{b(s=>s.includes(t)?s.filter(r=>r!==t):[...s,t])},w=u.filter(t=>t.service_type.toLowerCase().includes(P.toLowerCase())),pe=w.length>0&&w.every(t=>o.includes(t.id)),me=()=>{const t=w.map(s=>s.id);if(pe){const s=new Set(t);b(r=>r.filter(n=>!s.has(n)))}else b(s=>Array.from(new Set([...s,...t])))},he=async(t="A")=>{const s=window.open("","_blank");if(!s){alert("Gagal membuka jendela cetak. Pastikan izin popup browser diaktifkan.");return}const r=t==="B"?"Billing Statement B":"Billing Statement A";s.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Menyiapkan ${r}...</title>
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
                <div style="font-size: 15px; font-weight: 600;">Menyiapkan data ${r}...</div>
                <div style="font-size: 12px; color: #64748b; margin-top: 5px;">Total data: ${l.total??l.data.length} kontainer</div>
            </body>
            </html>
        `),s.document.close(),ce(!0);try{const n=new URLSearchParams;p&&p!=="all"&&n.append("customer_id",p),y&&y!=="all"&&n.append("shipper_id",y),S&&n.append("fumigator",S),T&&n.append("exclude_status",T),j&&n.append("date_from",j),N&&n.append("date_to",N),C&&n.append("date_type",C),$&&n.append("search",$),a.trashed&&n.append("trashed",a.trashed),a.sort_by&&n.append("sort_by",a.sort_by),a.sort_dir&&n.append("sort_dir",a.sort_dir),o.length>0&&o.forEach(d=>n.append("product_ids[]",d.toString()));const m=await fetch(`/karantina/print-data?${n.toString()}`);if(!m.ok)throw new Error("Gagal mengambil data dari server");const A=(await m.json()).data||[];if(A.length===0){s.document.body.innerHTML=`
                    <div style="text-align: center; margin-top: 50px; font-family: Arial, sans-serif;">
                        <p style="color: #ef4444; font-weight: 600;">Tidak ada data yang sesuai filter untuk dicetak.</p>
                        <button onclick="window.close()" style="padding: 6px 14px; cursor: pointer; border-radius: 4px; border: 1px solid #ccc;">Tutup</button>
                    </div>
                `;return}const V=j?new Date(j).toLocaleDateString("id-ID"):"Semua",W=N?new Date(N).toLocaleDateString("id-ID"):"Semua",K=`${V} s/d ${W}`,q="/logo.png",Te=new Date().toLocaleDateString("id-ID",{day:"numeric",month:"long",year:"numeric",hour:"2-digit",minute:"2-digit"}),Ce=`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>${r} - PT. Depo Surabaya Sejahtera</title>
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
                            <img src="${q}" alt="Logo" style="width: 55px; height: 55px; object-fit: contain;">
                        </td>
                        <td style="vertical-align: middle;">
                            <div class="company-name">PT. DEPO SURABAYA SEJAHTERA</div>
                            <div class="company-address">
                                Jl. Tanjung Sadari No. 90 (Tanjung Batu No. 1) | Telp. 031-353 9484, 031-3539485 | Fax. 031-3539482
                            </div>
                        </td>
                        <td style="text-align: right; vertical-align: middle;">
                            <div class="report-title">${r}</div>
                            <div style="font-size: 10pt; color: #475569; font-weight: 600;">Layanan Karantina & Fumigasi</div>
                        </td>
                    </tr>
                </table>

                <div class="filter-info">
                    <div>
                        <strong>Periode:</strong> ${K} &nbsp;|&nbsp;
                        <strong>Total:</strong> ${A.length} Kontainer
                    </div>
                    <div>
                        <strong>Dicetak pada:</strong> ${Te} WIB
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
                        ${A.map((d,$e)=>`
                            <tr>
                                <td class="text-center">${$e+1}</td>
                                <td style="font-weight: 700; font-family: monospace;">${d.container_number}</td>
                                <td>${d.shipper_name??"-"}</td>
                                <td class="text-center">${_e(d.price_type)}</td>
                                <td>${d.entry_date?le(d.entry_date):'<span class="text-gray-400">–</span>'}</td>
                                <td>${d.eir_date?le(d.eir_date):'<span class="text-gray-400">–</span>'}</td>
                                <td>${d.exit_date?le(d.exit_date):'<span class="text-gray-400">–</span>'}</td>
                                <td>${d.commodity??"-"}</td>
                                <td>${d.country??"-"}</td>
                                <td>${d.fumigasi??'<span class="text-gray-400">–</span>'}</td>
                            </tr>
                        `).join("")}
                    </tbody>
                </table>
            </body>
            </html>
            `;s.document.open(),s.document.write(Ce),s.document.close(),setTimeout(()=>{s.focus(),s.print()},300)}catch(n){console.error("Error saat mencetak billing statement:",n),s.document.body.innerHTML=`
                <div style="text-align: center; margin-top: 50px; font-family: Arial, sans-serif;">
                    <p style="color: #ef4444; font-weight: 600;">Terjadi kesalahan saat memuat seluruh data kontainer.</p>
                    <button onclick="window.close()" style="padding: 6px 14px; cursor: pointer; border-radius: 4px; border: 1px solid #ccc;">Tutup</button>
                </div>
            `}finally{ce(!1)}},k=({label:t,field:s,currentSort:r,currentDir:n})=>{const m=r===s&&n==="asc"?"desc":"asc";return e.jsxs(Ie,{href:route("index_karantina",{customer_id:p==="all"?void 0:p,shipper_id:y==="all"?void 0:y,fumigator:S?S.trim():void 0,exclude_status:T,date_from:j||void 0,date_to:N||void 0,date_type:C,product_ids:o.length>0?o:void 0,search:$||void 0,per_page:ie,sort_by:s,sort_dir:m}),preserveState:!0,preserveScroll:!0,className:"inline-flex items-center gap-1 font-semibold text-slate-700 hover:text-black transition-colors",children:[e.jsx("span",{children:t}),r===s?m==="asc"?e.jsx(Ye,{className:"h-3.5 w-3.5 text-blue-600"}):e.jsx(Ve,{className:"h-3.5 w-3.5 text-blue-600"}):e.jsx(We,{className:"h-3.5 w-3.5 text-gray-400 opacity-60 hover:opacity-100"})]})},{props:F}=Pe();return e.jsxs(Le,{breadcrumbs:qe,children:[e.jsx(Ae,{title:"Karantina & Fumigasi - Depo Surabaya"}),e.jsxs("div",{className:"w-full space-y-6 px-4 py-6 sm:px-6 lg:px-8 bg-slate-50/50 min-h-screen",children:[((ue=F.flash)==null?void 0:ue.success)&&e.jsxs("div",{className:"flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-800 shadow-2xs",children:[e.jsx(Ue,{className:"h-4 w-4 text-emerald-600 shrink-0"}),e.jsx("span",{children:F.flash.success})]}),((ge=F.flash)==null?void 0:ge.error)&&e.jsxs("div",{className:"flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-800 shadow-2xs",children:[e.jsx(Q,{className:"h-4 w-4 text-rose-600 shrink-0"}),e.jsx("span",{children:F.flash.error})]}),e.jsxs("div",{className:"flex flex-col sm:flex-row sm:items-center justify-between gap-4",children:[e.jsxs("div",{children:[e.jsxs("div",{className:"flex items-center gap-2.5",children:[e.jsx(Je,{className:"h-7 w-7 text-gray-900"}),e.jsx("h1",{className:"text-2xl font-bold tracking-tight text-gray-900",children:"Karantina & Fumigasi"}),e.jsx("span",{className:"inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700 border border-slate-200",children:"Billing & Monitoring"})]}),e.jsx("p",{className:"text-xs text-gray-500 mt-1",children:"Kelola data pergerakan kontainer karantina, filter multi-parameter, dan cetak billing statement resmi."})]}),e.jsxs("div",{className:"flex flex-wrap items-center gap-2",children:[e.jsxs(_,{variant:"outline",size:"sm",onClick:()=>ke(!U),className:"gap-1.5 h-9 text-xs border-gray-300 bg-white shadow-2xs",children:[e.jsx(re,{className:"h-3.5 w-3.5 text-blue-600"}),e.jsx("span",{children:"Filter"}),U?e.jsx(Me,{className:"h-3.5 w-3.5 text-gray-500"}):e.jsx(Ne,{className:"h-3.5 w-3.5 text-gray-500"})]}),e.jsxs(_,{type:"button",size:"sm",disabled:J,onClick:()=>he("A"),className:"bg-gray-900 hover:bg-black text-white font-semibold text-xs h-9 px-3.5 gap-1.5 shadow-2xs disabled:opacity-70",title:"Cetak Billing Statement Format A",children:[e.jsx(we,{className:`h-3.5 w-3.5 ${J?"animate-spin":""}`}),e.jsx("span",{children:"Billing Statement A"})]}),e.jsxs(_,{type:"button",size:"sm",disabled:J,onClick:()=>he("B"),variant:"outline",className:"border-gray-300 text-gray-800 bg-white hover:bg-gray-50 font-semibold text-xs h-9 px-3.5 gap-1.5 shadow-2xs",title:"Cetak Billing Statement Format B",children:[e.jsx(we,{className:"h-3.5 w-3.5 text-gray-600"}),e.jsx("span",{children:"Billing Statement B"})]})]})]}),U&&e.jsxs("div",{className:"rounded-xl border border-gray-200 bg-white p-5 shadow-xs space-y-4",children:[e.jsxs("div",{className:"flex items-center justify-between border-b border-gray-100 pb-3",children:[e.jsxs("span",{className:"text-sm font-bold text-gray-800 flex items-center gap-2",children:[e.jsx(re,{className:"h-4 w-4 text-blue-600"}),"Parameter Filter"]}),e.jsxs(_,{variant:"ghost",size:"sm",onClick:De,className:"text-xs text-gray-500 hover:text-rose-600 gap-1.5 h-8 px-2",children:[e.jsx(Oe,{className:"h-3.5 w-3.5"}),e.jsx("span",{children:"Reset Filter"})]})]}),e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4",children:[e.jsxs("div",{className:"space-y-1.5",children:[e.jsx(D,{className:"text-xs font-semibold text-gray-700",children:"Customer"}),e.jsxs(Z,{value:p,onValueChange:B,children:[e.jsx(ee,{className:"w-full text-xs h-9 bg-white border-gray-200",children:e.jsx(te,{placeholder:"Semua Customer"})}),e.jsxs(ae,{children:[e.jsx(v,{value:"all",children:"Semua Customer"}),i.map(t=>e.jsx(v,{value:String(t.id),children:t.name},t.id))]})]})]}),e.jsxs("div",{className:"space-y-1.5",children:[e.jsx(D,{className:"text-xs font-semibold text-gray-700",children:"Shipper"}),e.jsxs(Z,{value:y,onValueChange:M,children:[e.jsx(ee,{className:"w-full text-xs h-9 bg-white border-gray-200",children:e.jsx(te,{placeholder:"Semua Shipper"})}),e.jsxs(ae,{children:[e.jsx(v,{value:"all",children:"Semua Shipper"}),x.map(t=>e.jsx(v,{value:String(t.id),children:t.name},t.id))]})]})]}),e.jsxs("div",{className:"space-y-1.5",children:[e.jsx(D,{className:"text-xs font-semibold text-gray-700",children:"Fumigator"}),e.jsx(X,{type:"text",value:S,onChange:t=>z(t.target.value),onKeyDown:xe,placeholder:"Ketik nama fumigator...",className:"text-xs h-9 bg-white border-gray-200"})]}),e.jsxs("div",{className:"space-y-1.5",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx(D,{className:"text-xs font-semibold text-gray-700",children:"Jenis Layanan"}),o.length>0&&e.jsxs("span",{className:"text-[10px] text-blue-600 font-bold bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200",children:[o.length," dipilih"]})]}),e.jsxs(Fe,{children:[e.jsx(Ke,{asChild:!0,children:e.jsxs(_,{variant:"outline",type:"button",className:"w-full justify-between border-gray-200 bg-white text-xs font-normal text-gray-800 shadow-2xs hover:bg-gray-50 h-9",children:[e.jsx("span",{className:"truncate",children:o.length===0?"Semua Layanan":o.length===1?((fe=u.find(t=>t.id===o[0]))==null?void 0:fe.service_type)||"1 Layanan":`${o.length} Layanan Dipilih`}),e.jsx(Ne,{className:"ml-1.5 h-3.5 w-3.5 shrink-0 opacity-50"})]})}),e.jsxs(Be,{className:"w-80 p-2 shadow-lg",align:"start",children:[e.jsxs("div",{className:"flex items-center justify-between px-2 py-1.5 border-b border-gray-100 mb-2",children:[e.jsx("span",{className:"text-xs font-semibold text-gray-700",children:"Pilih Layanan"}),e.jsxs("div",{className:"flex gap-2 text-[11px]",children:[e.jsxs("button",{type:"button",onClick:t=>{t.preventDefault(),b(u.map(s=>s.id))},className:"text-blue-600 hover:underline font-medium",children:["Semua (",u.length,")"]}),e.jsx("span",{className:"text-gray-300",children:"|"}),e.jsx("button",{type:"button",onClick:t=>{t.preventDefault(),b([])},className:"text-gray-500 hover:underline",children:"Reset"})]})]}),e.jsxs("div",{className:"relative mb-2 px-1",children:[e.jsx(ye,{className:"absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400"}),e.jsx(X,{type:"text",placeholder:"Cari layanan...",value:P,onChange:t=>de(t.target.value),onKeyDown:t=>t.stopPropagation(),className:"h-8 pl-8 pr-7 text-xs rounded-md border-gray-200"}),P&&e.jsx("button",{type:"button",onClick:()=>de(""),className:"absolute right-3 top-2 text-gray-400 hover:text-gray-600",children:e.jsx(Q,{className:"h-3.5 w-3.5"})})]}),w.length>0&&e.jsxs("div",{onClick:t=>{t.preventDefault(),me()},className:"flex items-center gap-2 px-2 py-1.5 mb-1.5 rounded bg-slate-50 hover:bg-slate-100 cursor-pointer text-xs font-medium text-slate-700 border border-slate-200 transition-colors",children:[e.jsx(je,{checked:pe,onCheckedChange:me,className:"h-3.5 w-3.5"}),e.jsx("span",{className:"truncate text-xs",children:P?`Centang Semua ("${P}")`:`Centang Semua (${w.length})`})]}),e.jsx("div",{className:"space-y-0.5 max-h-56 overflow-y-auto",children:w.length===0?e.jsx("div",{className:"py-4 text-center text-xs text-gray-400",children:"Tidak ada layanan cocok"}):w.map(t=>{const s=o.includes(t.id);return e.jsxs("div",{onClick:r=>{r.preventDefault(),Y(t.id)},className:`flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer text-xs transition-colors ${s?"bg-blue-50 text-blue-900 font-medium":"hover:bg-gray-100 text-gray-700"}`,children:[e.jsx(je,{checked:s,onCheckedChange:()=>Y(t.id),className:"h-3.5 w-3.5"}),e.jsx("span",{className:"truncate",children:t.service_type})]},t.id)})})]})]})]})]}),e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1",children:[e.jsxs("div",{className:"space-y-1.5",children:[e.jsx(D,{className:"text-xs font-semibold text-gray-700",children:"Status Exclude"}),e.jsxs(Z,{value:T,onValueChange:E,children:[e.jsx(ee,{className:"w-full text-xs h-9 bg-white border-gray-200",children:e.jsx(te,{})}),e.jsxs(ae,{children:[e.jsx(v,{value:"active",children:"Hanya yang Diikutsertakan (Default)"}),e.jsx(v,{value:"all",children:"Semua (Termasuk yang di-exclude)"}),e.jsx(v,{value:"excluded",children:"Hanya yang Di-exclude"})]})]})]}),e.jsxs("div",{className:"space-y-1.5 sm:col-span-2 lg:col-span-3",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx(D,{className:"text-xs font-semibold text-gray-700",children:"Rentang Tanggal"}),e.jsxs("div",{className:"flex items-center gap-1.5",children:[e.jsx("span",{className:"text-[11px] text-gray-500",children:"Berdasarkan:"}),e.jsxs("select",{value:C,onChange:t=>R(t.target.value),className:"text-[11px] font-semibold text-blue-600 bg-blue-50 border border-blue-200 rounded px-1.5 py-0.5 cursor-pointer focus:ring-0",children:[e.jsx("option",{value:"entry_date",children:"Tgl Masuk"}),e.jsx("option",{value:"eir_date",children:"Tgl EIR"}),e.jsx("option",{value:"exit_date",children:"Tgl Keluar"})]})]})]}),e.jsx(He,{startDate:j,endDate:N,onChange:({startDate:t,endDate:s})=>{I(t),L(s)},onApply:({startDate:t,endDate:s})=>{I(t),L(s),O({date_from:t,date_to:s})},placeholder:"Semua rentang tanggal...",className:"w-full",align:"right"})]})]}),o.length>0&&e.jsxs("div",{className:"flex flex-wrap items-center gap-1.5 border-t border-gray-100 pt-2.5",children:[e.jsx("span",{className:"text-[11px] text-gray-500 font-medium",children:"Layanan Terpilih:"}),o.map(t=>{const s=u.find(r=>r.id===t);return s?e.jsxs("span",{className:"inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 border border-blue-200",children:[s.service_type,e.jsx("button",{type:"button",onClick:()=>Y(t),className:"hover:text-blue-900 focus:outline-none",children:e.jsx(Q,{className:"h-3 w-3"})})]},t):null}),e.jsx("button",{type:"button",onClick:()=>b([]),className:"text-[11px] text-gray-500 hover:text-rose-600 underline ml-1",children:"Hapus Semua"})]}),e.jsxs("div",{className:"flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-gray-100",children:[e.jsxs("div",{className:"relative w-full sm:max-w-md",children:[e.jsx(ye,{className:"absolute left-3 top-2.5 h-4 w-4 text-gray-400"}),e.jsx(X,{type:"text",placeholder:"Cari nomor kontainer, customer, shipper, atau komoditi... (Tekan Enter)",value:$,onChange:t=>H(t.target.value),onKeyDown:xe,className:"pl-9 text-xs h-9 bg-white border-gray-200"})]}),e.jsx("div",{className:"flex items-center gap-2 w-full sm:w-auto justify-end",children:e.jsx(_,{size:"sm",onClick:()=>O(),className:"bg-gray-900 hover:bg-black text-white font-semibold text-xs h-9 px-5 shadow-2xs",children:"Terapkan Filter"})})]})]}),e.jsxs("div",{className:"rounded-xl border border-gray-200 bg-white shadow-xs p-5 space-y-4",children:[e.jsx("div",{className:"flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3",children:e.jsxs("div",{children:[e.jsx("h2",{className:"text-base font-bold text-gray-900",children:"Daftar Kontainer Karantina & Fumigasi"}),e.jsxs("p",{className:"text-xs text-gray-500 mt-0.5",children:["Menampilkan total ",e.jsx("span",{className:"font-bold text-gray-800",children:l.total??l.data.length})," kontainer sesuai kriteria filter aktif."]})]})}),e.jsx("div",{className:"overflow-x-auto rounded-lg border border-gray-200",children:e.jsxs(ze,{children:[e.jsx(Ee,{className:"bg-slate-50 text-xs font-semibold text-slate-700 border-b border-gray-200",children:e.jsxs(se,{className:"hover:bg-transparent",children:[e.jsx(f,{className:"px-4 py-3.5 whitespace-nowrap",children:e.jsx(k,{label:"Nomor Kontainer",field:"container_number",currentSort:a.sort_by,currentDir:a.sort_dir})}),e.jsx(f,{className:"px-4 py-3.5 whitespace-nowrap",children:e.jsx(k,{label:"Nama Shipper",field:"shippers.name",currentSort:a.sort_by,currentDir:a.sort_dir})}),e.jsx(f,{className:"px-4 py-3.5 text-center whitespace-nowrap",children:"Size"}),e.jsx(f,{className:"px-4 py-3.5 whitespace-nowrap",children:e.jsx(k,{label:"Tanggal Masuk",field:"entry_date",currentSort:a.sort_by,currentDir:a.sort_dir})}),e.jsx(f,{className:"px-4 py-3.5 whitespace-nowrap",children:e.jsx(k,{label:"Tanggal EIR",field:"eir_date",currentSort:a.sort_by,currentDir:a.sort_dir})}),e.jsx(f,{className:"px-4 py-3.5 whitespace-nowrap",children:e.jsx(k,{label:"Tanggal Keluar",field:"exit_date",currentSort:a.sort_by,currentDir:a.sort_dir})}),e.jsx(f,{className:"px-4 py-3.5 whitespace-nowrap",children:"Komoditi"}),e.jsx(f,{className:"px-4 py-3.5 whitespace-nowrap",children:"Negara Tujuan"}),e.jsx(f,{className:"px-4 py-3.5 whitespace-nowrap",children:e.jsx(k,{label:"Fumigator",field:"fumigasi",currentSort:a.sort_by,currentDir:a.sort_dir})})]})}),e.jsx(Re,{className:"divide-y divide-gray-100 bg-white",children:l.data.length===0?e.jsx(se,{children:e.jsx(h,{colSpan:9,className:"py-12 text-center text-sm text-gray-500",children:e.jsxs("div",{className:"flex flex-col items-center justify-center gap-1.5",children:[e.jsx(re,{className:"h-6 w-6 text-gray-300"}),e.jsx("span",{className:"font-semibold text-gray-700",children:"Tidak ada data kontainer yang sesuai filter."}),e.jsx("span",{className:"text-xs text-gray-400",children:"Silakan ubah parameter filter atau klik Reset Filter."})]})})}):l.data.map(t=>{var s,r,n,m;return e.jsxs(se,{className:"hover:bg-slate-50/70 transition-colors",children:[e.jsx(h,{className:"px-4 py-3 text-sm font-bold text-slate-900 font-mono",children:t.container_number}),e.jsx(h,{className:"px-4 py-3 text-sm text-slate-800",children:((r=(s=t.order)==null?void 0:s.shipper)==null?void 0:r.name)??t.shipper_name??"-"}),e.jsx(h,{className:"px-4 py-3 text-sm text-center",children:e.jsx("span",{className:"inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200",children:_e(t.price_type)})}),e.jsx(h,{className:"px-4 py-3 text-sm",children:ne(t.entry_date)}),e.jsx(h,{className:"px-4 py-3 text-sm",children:ne(t.eir_date)}),e.jsx(h,{className:"px-4 py-3 text-sm",children:ne(t.exit_date)}),e.jsx(h,{className:"px-4 py-3 text-sm text-slate-800",children:t.commodity??"-"}),e.jsx(h,{className:"px-4 py-3 text-sm text-slate-800",children:t.country??"-"}),e.jsx(h,{className:"px-4 py-3 text-sm",children:((n=t.order)==null?void 0:n.fumigasi)??t.fumigasi?e.jsx("span",{className:"inline-flex items-center rounded-md bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800 border border-amber-200",children:((m=t.order)==null?void 0:m.fumigasi)??t.fumigasi}):e.jsx("span",{className:"text-gray-400",children:"–"})})]},t.id)})})]})}),e.jsxs("div",{className:"flex flex-col sm:flex-row items-center justify-between gap-3 pt-2",children:[e.jsxs("p",{className:"text-xs text-gray-500",children:["Menampilkan ",e.jsx("span",{className:"font-semibold text-gray-800",children:l.from??0})," sampai"," ",e.jsx("span",{className:"font-semibold text-gray-800",children:l.to??0})," dari"," ",e.jsx("span",{className:"font-semibold text-gray-800",children:l.total??l.data.length})," kontainer"]}),e.jsx("div",{className:"flex flex-wrap justify-center gap-1",children:l.links.map((t,s)=>t.url?e.jsx(_,{variant:t.active?"default":"outline",disabled:!t.url,onClick:()=>G.get(t.url,{},{preserveState:!0,preserveScroll:!0}),className:`px-3 py-1 text-xs font-medium h-8 ${t.active?"bg-gray-900 text-white hover:bg-black":"text-gray-700 bg-white border-gray-200"}`,children:t.label.replace(/&laquo; Previous|Next &raquo;/,r=>r.includes("Previous")?"← Prev":r.includes("Next")?"Next →":r)},s):e.jsx("span",{className:"px-2.5 py-1 text-xs text-gray-400",children:"..."},s))})]})]})]})]})}export{yt as default};
