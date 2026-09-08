import{r as n,j as e,L as pe,$ as ue,S as C}from"./app-hEF5q0kU.js";import{A as ge,F as je}from"./app-layout-yD6-fRbi.js";import{B as m}from"./button-CnfuRwTT.js";import{I as T}from"./input-D84BXIZM.js";import{L as o}from"./label-E1ugI-oB.js";import{C as be,S as h,a as p,b as u,c as g,d as a}from"./select-NVj75gMz.js";import{T as fe,a as ye,b as D,c as d,d as Ne,e as i}from"./table-C-PloCyi.js";import{R as Q,S as ve}from"./surat-jalan-modal-JEr-vs9c.js";import{F as X,B as we}from"./filter-CtoQSw6r.js";import{C as _e}from"./chevron-down-DAu9NTlc.js";import{P as Z}from"./printer-CxCHgQ3C.js";import{C as Se}from"./clock-FOYnxLUD.js";import{a as ke}from"./index-Bfi25le9.js";import{R as Ce}from"./rotate-ccw-CBZMsw3H.js";import{S as Te}from"./search-CNWNdojR.js";import{C as De}from"./circle-check-_Lwy7vqf.js";import{E as $e,a as ze}from"./eye-CfdetZR1.js";/* empty css            */import"./index-CAm7e2mv.js";import"./Combination-BBQPlBNr.js";import"./index-CPjrlR3N.js";import"./app-logo-icon-BoZ9kiQk.js";import"./index-CVnAyZuZ.js";import"./check-BaEOiuxa.js";import"./dialog-CQ-kvauH.js";const Pe=[{title:"Dashboard",href:"/dashboard"},{title:"Report",href:"/reports"}];function lt({reports:r,kpi:l,customers:$,shippers:z,service_types:ee,filters:c}){const[y,P]=n.useState(c.customer_id||"all"),[N,I]=n.useState(c.shipper_id||"all"),[b,F]=n.useState(c.service_type||"all"),[_,L]=n.useState(c.price_type||"all"),[v,R]=n.useState(c.date_from||""),[w,E]=n.useState(c.date_to||""),[A,K]=n.useState(c.date_type||"entry_date"),[O,B]=n.useState(c.exclude_status||"active"),[M,H]=n.useState(c.invoice_status||"all"),[U,V]=n.useState(c.search||""),[J,Y]=n.useState(String(c.per_page||25)),[S,te]=n.useState(!0),[ae,q]=n.useState(!1),[se,le]=n.useState(null),k=t=>{C.get(route("reports.index"),{customer_id:(t==null?void 0:t.customer_id)!==void 0?t.customer_id:y==="all"?void 0:y,shipper_id:(t==null?void 0:t.shipper_id)!==void 0?t.shipper_id:N==="all"?void 0:N,service_type:(t==null?void 0:t.service_type)!==void 0?t.service_type:b==="all"?void 0:b,price_type:(t==null?void 0:t.price_type)!==void 0?t.price_type:_==="all"?void 0:_,date_from:(t==null?void 0:t.date_from)!==void 0?t.date_from:v||void 0,date_to:(t==null?void 0:t.date_to)!==void 0?t.date_to:w||void 0,date_type:(t==null?void 0:t.date_type)!==void 0?t.date_type:A,exclude_status:(t==null?void 0:t.exclude_status)!==void 0?t.exclude_status:O,invoice_status:(t==null?void 0:t.invoice_status)!==void 0?t.invoice_status:M,search:(t==null?void 0:t.search)!==void 0?t.search:U||void 0,per_page:(t==null?void 0:t.per_page)!==void 0?t.per_page:J},{preserveState:!0,preserveScroll:!0})},ne=()=>{P("all"),I("all"),F("all"),L("all"),R(""),E(""),K("entry_date"),B("active"),H("all"),V(""),Y("25"),C.get(route("reports.index"),{},{preserveScroll:!0})},ie=t=>{t.key==="Enter"&&k()},re=t=>{le({container_number:t.container_number,size:t.size||"20ft",customer_name:t.customer_name,shipper_name:t.shipper_name,service_type:t.service_type,commodity:t.commodity,no_aju:t.no_aju,order_id:t.order_id,date:t.exit_date||t.entry_date}),q(!0)},j=t=>{if(!t)return"-";try{const x=new Date(t);return isNaN(x.getTime())?t:x.toLocaleDateString("id-ID",{day:"2-digit",month:"short",year:"numeric"})}catch{return t}},de=()=>{var G,W;if(r.data.length===0){alert("Tidak ada data laporan untuk dicetak.");return}const t=window.open("","_blank","width=1100,height=800");if(!t){alert("Popup terblokir oleh browser. Harap izinkan popup.");return}const x=((G=$.find(s=>String(s.id)===y))==null?void 0:G.name)||"Semua Customer",f=((W=z.find(s=>String(s.id)===N))==null?void 0:W.name)||"Semua Shipper",ce=b==="all"?"Semua Layanan":b,xe=v||w?`${j(v)} s/d ${j(w)}`:"Semua Periode",oe=new Date().toLocaleDateString("id-ID",{day:"2-digit",month:"long",year:"numeric",hour:"2-digit",minute:"2-digit"}),me=r.data.map((s,he)=>`
            <tr>
                <td style="text-align: center;">${he+1}</td>
                <td><strong>${s.customer_name}</strong></td>
                <td>${s.shipper_name}</td>
                <td>${s.service_type}</td>
                <td style="font-weight: bold; font-family: monospace;">${s.container_number}</td>
                <td style="text-align: center;">${s.size}</td>
                <td>${j(s.entry_date)}</td>
                <td>${j(s.exit_date)}</td>
                <td>${s.commodity||"-"}</td>
                <td style="text-align: center;">${s.is_invoiced?`Sudah (${s.invoice_number||"Inv"})`:"Belum"}</td>
                <td style="text-align: center;">${s.is_excluded?"Ya":"Tidak"}</td>
            </tr>
        `).join("");t.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Laporan Order Depo Surabaya</title>
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
                        text-align: center;
                        font-size: 13pt;
                        font-weight: 800;
                        text-transform: uppercase;
                        margin: 12px 0 6px 0;
                        letter-spacing: 0.5px;
                    }
                    .filter-info {
                        display: flex;
                        justify-content: space-between;
                        font-size: 9pt;
                        background: #f4f4f5;
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
                        padding: 5px 6px;
                        vertical-align: top;
                    }
                    table.data-table th {
                        background-color: #eaeaea;
                        font-weight: 700;
                        text-align: left;
                    }
                    .kpi-summary {
                        margin-top: 14px;
                        display: flex;
                        gap: 15px;
                        font-size: 9pt;
                    }
                    .kpi-pill {
                        border: 1px solid #ccc;
                        padding: 4px 10px;
                        border-radius: 4px;
                        background: #fafafa;
                    }
                    .sig-section {
                        margin-top: 30px;
                        display: flex;
                        justify-content: space-between;
                        page-break-inside: avoid;
                    }
                    .sig-box {
                        width: 200px;
                        text-align: center;
                        font-size: 9.5pt;
                    }
                    .sig-line {
                        margin-top: 50px;
                        border-bottom: 1px solid #000;
                    }
                </style>
            </head>
            <body>
                <table class="header-table">
                    <tr>
                        <td>
                            <div class="company-name">PT. DEPO SURABAYA SEJAHTERA</div>
                            <div class="company-address">
                                Jl. Tanjung Sadari No. 90 (Tanjung Batu No. 1) | Telp. 031-353 9484, 031-3539485 | Fax. 031-3539482
                            </div>
                        </td>
                        <td style="text-align: right; vertical-align: middle;">
                            <span style="font-size: 18pt; font-weight: 900; color: #1e3a8a;">LAPORAN ORDER</span>
                        </td>
                    </tr>
                </table>

                <div class="filter-info">
                    <div>
                        <strong>Customer:</strong> ${x} &nbsp;|&nbsp;
                        <strong>Shipper:</strong> ${f} &nbsp;|&nbsp;
                        <strong>Layanan:</strong> ${ce}
                    </div>
                    <div>
                        <strong>Periode:</strong> ${xe} &nbsp;|&nbsp;
                        <strong>Dicetak:</strong> ${oe}
                    </div>
                </div>

                <table class="data-table">
                    <thead>
                        <tr>
                            <th style="width: 25px; text-align: center;">No</th>
                            <th>Customer</th>
                            <th>Shipper</th>
                            <th>Layanan</th>
                            <th>No. Kontainer</th>
                            <th style="text-align: center;">Ukuran</th>
                            <th>Tgl Masuk</th>
                            <th>Tgl Keluar</th>
                            <th>Komoditi</th>
                            <th style="text-align: center;">Invoice</th>
                            <th style="text-align: center;">Exclude</th>
                        </tr>
                    </thead>

                    <tbody>
                        ${me}
                    </tbody>
                </table>

                <div class="kpi-summary">
                    <div class="kpi-pill"><strong>Total Kontainer:</strong> ${l.total_containers}</div>
                    <div class="kpi-pill"><strong>20ft:</strong> ${l.count_20ft}</div>
                    <div class="kpi-pill"><strong>40ft:</strong> ${l.count_40ft}</div>
                    <div class="kpi-pill"><strong>45ft:</strong> ${l.count_45ft}</div>
                    <div class="kpi-pill"><strong>Aktif di Depo:</strong> ${l.aktif_di_depo}</div>
                    <div class="kpi-pill"><strong>Sudah Invoice:</strong> ${l.invoiced}</div>
                </div>

                <div class="sig-section">
                    <div class="sig-box">
                        <div>Mengetahui,</div>
                        <div class="sig-line"></div>
                        <div style="margin-top: 4px; font-weight: 600;">Kepala Depo</div>
                    </div>
                    <div class="sig-box">
                        <div>Dibuat Oleh,</div>
                        <div class="sig-line"></div>
                        <div style="margin-top: 4px; font-weight: 600;">Admin Operasional</div>
                    </div>
                </div>

                <script>
                    window.onload = function() {
                        window.print();
                    };
                <\/script>
            </body>
            </html>
        `),t.document.close()};return e.jsxs(ge,{breadcrumbs:Pe,children:[e.jsx(pe,{title:"Report - Depo Surabaya"}),e.jsxs("div",{className:"w-full space-y-6 px-4 py-6 sm:px-6 lg:px-8",children:[e.jsxs("div",{className:"flex flex-col sm:flex-row sm:items-center justify-between gap-4",children:[e.jsxs("div",{children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(je,{className:"h-7 w-7 text-blue-600"}),e.jsx("h1",{className:"text-2xl font-bold tracking-tight text-gray-900",children:"Laporan Ringkasan Order"})]}),e.jsx("p",{className:"text-sm text-gray-500 mt-1",children:"Rekapitulasi seluruh order, status pergerakan kontainer, dan penagihan invoice."})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsxs(m,{variant:"outline",size:"sm",onClick:()=>te(!S),className:"gap-1.5",children:[e.jsx(X,{className:"h-4 w-4"}),e.jsx("span",{children:"Filter"}),S?e.jsx(be,{className:"h-3.5 w-3.5"}):e.jsx(_e,{className:"h-3.5 w-3.5"})]}),e.jsxs(m,{size:"sm",onClick:de,className:"bg-blue-600 hover:bg-blue-700 text-white gap-1.5",children:[e.jsx(Z,{className:"h-4 w-4"}),e.jsx("span",{children:"Cetak Laporan"})]})]})]}),e.jsxs("div",{className:"grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3",children:[e.jsxs("div",{className:"rounded-xl border border-gray-200 bg-white p-4 shadow-xs",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("span",{className:"text-xs font-semibold text-gray-500",children:"Total Kontainer"}),e.jsx(we,{className:"h-4 w-4 text-blue-600"})]}),e.jsx("div",{className:"mt-2 text-2xl font-bold text-gray-900",children:l.total_containers}),e.jsx("div",{className:"text-[11px] text-gray-500 mt-0.5",children:"Semua record terpilih"})]}),e.jsxs("div",{className:"rounded-xl border border-gray-200 bg-white p-4 shadow-xs",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("span",{className:"text-xs font-semibold text-gray-500",children:"Breakdown Ukuran"}),e.jsx("span",{className:"text-xs font-bold text-blue-600",children:"20 / 40 / 45"})]}),e.jsxs("div",{className:"mt-2 text-xl font-bold text-gray-900 flex items-center gap-1.5",children:[e.jsx("span",{children:l.count_20ft}),e.jsx("span",{className:"text-gray-300 font-normal",children:"/"}),e.jsx("span",{children:l.count_40ft}),e.jsx("span",{className:"text-gray-300 font-normal",children:"/"}),e.jsx("span",{className:"text-indigo-600",children:l.count_45ft})]}),e.jsx("div",{className:"text-[11px] text-gray-500 mt-0.5",children:"20ft / 40ft / 45ft"})]}),e.jsxs("div",{className:"rounded-xl border border-gray-200 bg-white p-4 shadow-xs",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("span",{className:"text-xs font-semibold text-emerald-700",children:"Aktif di Depo"}),e.jsx(Se,{className:"h-4 w-4 text-emerald-600"})]}),e.jsx("div",{className:"mt-2 text-2xl font-bold text-emerald-700",children:l.aktif_di_depo}),e.jsx("div",{className:"text-[11px] text-emerald-600 mt-0.5",children:"Belum gate out"})]}),e.jsxs("div",{className:"rounded-xl border border-gray-200 bg-white p-4 shadow-xs",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("span",{className:"text-xs font-semibold text-gray-500",children:"Sudah Keluar"}),e.jsx(ke,{className:"h-4 w-4 text-gray-500"})]}),e.jsx("div",{className:"mt-2 text-2xl font-bold text-gray-900",children:l.sudah_keluar}),e.jsx("div",{className:"text-[11px] text-gray-500 mt-0.5",children:"Gate out selesai"})]}),e.jsxs("div",{className:"rounded-xl border border-gray-200 bg-white p-4 shadow-xs",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("span",{className:"text-xs font-semibold text-blue-700",children:"Sudah Invoice"}),e.jsx(Q,{className:"h-4 w-4 text-blue-600"})]}),e.jsx("div",{className:"mt-2 text-2xl font-bold text-blue-700",children:l.invoiced}),e.jsx("div",{className:"text-[11px] text-blue-600 mt-0.5",children:"Tagihan terbit"})]}),e.jsxs("div",{className:"rounded-xl border border-gray-200 bg-white p-4 shadow-xs",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("span",{className:"text-xs font-semibold text-amber-700",children:"Belum Invoice"}),e.jsx(Q,{className:"h-4 w-4 text-amber-500"})]}),e.jsx("div",{className:"mt-2 text-2xl font-bold text-amber-700",children:l.uninvoiced}),e.jsx("div",{className:"text-[11px] text-amber-600 mt-0.5",children:"Perlu ditagihkan"})]})]}),S&&e.jsxs("div",{className:"rounded-xl border border-gray-200 bg-white p-5 shadow-xs space-y-4",children:[e.jsxs("div",{className:"flex items-center justify-between border-b pb-3",children:[e.jsxs("span",{className:"text-sm font-bold text-gray-800 flex items-center gap-1.5",children:[e.jsx(X,{className:"h-4 w-4 text-blue-600"}),"Parameter Filter"]}),e.jsxs(m,{variant:"ghost",size:"sm",onClick:ne,className:"text-xs text-gray-500 hover:text-red-600 gap-1",children:[e.jsx(Ce,{className:"h-3.5 w-3.5"}),"Reset Filter"]})]}),e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4",children:[e.jsxs("div",{className:"space-y-1.5",children:[e.jsx(o,{className:"text-xs font-semibold text-gray-700",children:"Customer"}),e.jsxs(h,{value:y,onValueChange:P,children:[e.jsx(p,{className:"w-full text-xs",children:e.jsx(u,{placeholder:"Semua Customer"})}),e.jsxs(g,{children:[e.jsx(a,{value:"all",children:"Semua Customer"}),$.map(t=>e.jsx(a,{value:String(t.id),children:t.name},t.id))]})]})]}),e.jsxs("div",{className:"space-y-1.5",children:[e.jsx(o,{className:"text-xs font-semibold text-gray-700",children:"Shipper"}),e.jsxs(h,{value:N,onValueChange:I,children:[e.jsx(p,{className:"w-full text-xs",children:e.jsx(u,{placeholder:"Semua Shipper"})}),e.jsxs(g,{children:[e.jsx(a,{value:"all",children:"Semua Shipper"}),z.map(t=>e.jsx(a,{value:String(t.id),children:t.name},t.id))]})]})]}),e.jsxs("div",{className:"space-y-1.5",children:[e.jsx(o,{className:"text-xs font-semibold text-gray-700",children:"Jenis Layanan"}),e.jsxs(h,{value:b,onValueChange:F,children:[e.jsx(p,{className:"w-full text-xs",children:e.jsx(u,{placeholder:"Semua Layanan"})}),e.jsxs(g,{children:[e.jsx(a,{value:"all",children:"Semua Layanan"}),ee.map(t=>e.jsx(a,{value:t,children:t},t))]})]})]}),e.jsxs("div",{className:"space-y-1.5",children:[e.jsx(o,{className:"text-xs font-semibold text-gray-700",children:"Ukuran Kontainer"}),e.jsxs(h,{value:_,onValueChange:L,children:[e.jsx(p,{className:"w-full text-xs",children:e.jsx(u,{placeholder:"Semua Ukuran"})}),e.jsxs(g,{children:[e.jsx(a,{value:"all",children:"Semua Ukuran"}),e.jsx(a,{value:"20ft",children:"20 Feet (20')"}),e.jsx(a,{value:"40ft",children:"40 Feet (40')"}),e.jsx(a,{value:"45ft",children:"45 Feet (45')"}),e.jsx(a,{value:"global",children:"Global (Flat)"})]})]})]}),e.jsxs("div",{className:"space-y-1.5",children:[e.jsx(o,{className:"text-xs font-semibold text-gray-700",children:"Status Exclude"}),e.jsxs(h,{value:O,onValueChange:B,children:[e.jsx(p,{className:"w-full text-xs",children:e.jsx(u,{})}),e.jsxs(g,{children:[e.jsx(a,{value:"active",children:"Hanya yang Diikutsertakan (Default)"}),e.jsx(a,{value:"all",children:"Semua (Termasuk yang di-exclude)"}),e.jsx(a,{value:"excluded",children:"Hanya yang Di-exclude"})]})]})]}),e.jsxs("div",{className:"space-y-1.5",children:[e.jsx(o,{className:"text-xs font-semibold text-gray-700",children:"Status Penagihan"}),e.jsxs(h,{value:M,onValueChange:H,children:[e.jsx(p,{className:"w-full text-xs",children:e.jsx(u,{})}),e.jsxs(g,{children:[e.jsx(a,{value:"all",children:"Semua Status Invoice"}),e.jsx(a,{value:"invoiced",children:"Sudah Dibuatkan Invoice"}),e.jsx(a,{value:"uninvoiced",children:"Belum Dibuatkan Invoice"})]})]})]}),e.jsxs("div",{className:"space-y-1.5",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx(o,{className:"text-xs font-semibold text-gray-700",children:"Tanggal Mulai"}),e.jsxs("select",{value:A,onChange:t=>K(t.target.value),className:"text-[11px] text-blue-600 bg-transparent border-none p-0 cursor-pointer focus:ring-0",children:[e.jsx("option",{value:"entry_date",children:"Tgl Masuk"}),e.jsx("option",{value:"exit_date",children:"Tgl Keluar"}),e.jsx("option",{value:"order_date",children:"Tgl Order"})]})]}),e.jsx(T,{type:"date",value:v,onChange:t=>R(t.target.value),className:"h-9 text-xs"})]}),e.jsxs("div",{className:"space-y-1.5",children:[e.jsx(o,{className:"text-xs font-semibold text-gray-700",children:"Tanggal Selesai"}),e.jsx(T,{type:"date",value:w,onChange:t=>E(t.target.value),className:"h-9 text-xs"})]})]}),e.jsxs("div",{className:"flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t",children:[e.jsxs("div",{className:"relative w-full sm:max-w-md",children:[e.jsx(Te,{className:"absolute left-3 top-2.5 h-4 w-4 text-gray-400"}),e.jsx(T,{type:"text",placeholder:"Cari nomor kontainer, customer, shipper, atau komoditi... (Tekan Enter)",value:U,onChange:t=>V(t.target.value),onKeyDown:ie,className:"pl-9 text-xs h-9"})]}),e.jsx("div",{className:"flex items-center gap-2 w-full sm:w-auto justify-end",children:e.jsx(m,{size:"sm",onClick:()=>k(),className:"bg-blue-600 hover:bg-blue-700 text-white text-xs px-4",children:"Terapkan Filter"})})]})]}),e.jsxs("div",{className:"rounded-xl border border-gray-200 bg-white p-6 shadow-xs space-y-4",children:[e.jsxs("div",{className:"flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2",children:[e.jsxs("div",{className:"text-xs text-gray-500 font-medium",children:["Menampilkan ",e.jsx("span",{className:"font-semibold text-gray-800",children:r.from||0})," -"," ",e.jsx("span",{className:"font-semibold text-gray-800",children:r.to||0})," dari"," ",e.jsx("span",{className:"font-semibold text-gray-800",children:r.total})," kontainer"]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{className:"text-xs text-gray-500",children:"Tampilkan per halaman:"}),e.jsxs(h,{value:J,onValueChange:t=>{Y(t),k({per_page:Number(t)})},children:[e.jsx(p,{className:"h-8 w-20 text-xs",children:e.jsx(u,{})}),e.jsxs(g,{children:[e.jsx(a,{value:"10",children:"10"}),e.jsx(a,{value:"25",children:"25"}),e.jsx(a,{value:"50",children:"50"}),e.jsx(a,{value:"100",children:"100"}),e.jsx(a,{value:"200",children:"200"})]})]})]})]}),e.jsx("div",{className:"overflow-x-auto rounded-lg border border-gray-100",children:e.jsxs(fe,{children:[e.jsx(ye,{className:"bg-gray-50",children:e.jsxs(D,{children:[e.jsx(d,{className:"w-12 text-center text-xs font-bold",children:"No"}),e.jsx(d,{className:"text-xs font-bold",children:"Customer"}),e.jsx(d,{className:"text-xs font-bold",children:"Shipper"}),e.jsx(d,{className:"text-xs font-bold",children:"Layanan"}),e.jsx(d,{className:"text-xs font-bold",children:"No. Kontainer"}),e.jsx(d,{className:"text-xs font-bold text-center",children:"Ukuran"}),e.jsx(d,{className:"text-xs font-bold",children:"Tgl Masuk"}),e.jsx(d,{className:"text-xs font-bold",children:"Tgl Keluar"}),e.jsx(d,{className:"text-xs font-bold",children:"Komoditi"}),e.jsx(d,{className:"text-xs font-bold text-center",children:"Status Invoice"}),e.jsx(d,{className:"text-xs font-bold text-center",children:"Status Exclude"}),e.jsx(d,{className:"text-xs font-bold text-right",children:"Aksi"})]})}),e.jsx(Ne,{children:r.data.length===0?e.jsx(D,{children:e.jsx(i,{colSpan:12,className:"py-8 text-center text-gray-500 text-xs",children:"Tidak ada data order yang cocok dengan filter yang dipilih."})}):r.data.map((t,x)=>e.jsxs(D,{className:"hover:bg-gray-50/80",children:[e.jsx(i,{className:"text-center text-xs font-medium text-gray-500",children:(r.from||1)+x}),e.jsx(i,{className:"text-xs font-medium text-gray-800",children:t.customer_name}),e.jsx(i,{className:"text-xs text-gray-600",children:t.shipper_name}),e.jsx(i,{className:"text-xs text-gray-700",children:e.jsx("span",{className:"inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200",children:t.service_type})}),e.jsx(i,{className:"text-xs font-mono font-bold text-gray-900",children:t.container_number}),e.jsx(i,{className:"text-center text-xs font-semibold text-gray-700",children:t.size}),e.jsx(i,{className:"text-xs text-gray-600",children:j(t.entry_date)}),e.jsx(i,{className:"text-xs text-gray-600",children:j(t.exit_date)}),e.jsx(i,{className:"text-xs text-gray-600 max-w-[140px] truncate",children:t.commodity}),e.jsx(i,{className:"text-center text-xs",children:t.is_invoiced?e.jsxs("span",{className:"inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-100 text-emerald-800 border border-emerald-300",children:[e.jsx(De,{className:"h-3 w-3"}),t.invoice_number||"Invoiced"]}):e.jsx("span",{className:"inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200",children:"Belum"})}),e.jsx(i,{className:"text-center text-xs",children:t.is_excluded?e.jsxs("span",{className:"inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-300",children:[e.jsx($e,{className:"h-3 w-3"}),"Excluded"]}):e.jsx("span",{className:"inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium text-gray-500",children:"Normal"})}),e.jsx(i,{className:"text-right",children:e.jsxs("div",{className:"flex items-center justify-end gap-1.5",children:[e.jsx(m,{size:"icon",variant:"ghost",type:"button",onClick:()=>re(t),title:"Cetak Surat Jalan (21 x 14 cm)",className:"text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50",children:e.jsx(Z,{className:"h-4 w-4"})}),t.order_pk&&e.jsx(m,{size:"icon",variant:"ghost",asChild:!0,title:"Lihat Order",children:e.jsx(ue,{href:route("orders.show",t.order_pk),className:"text-gray-500 hover:text-gray-700",children:e.jsx(ze,{className:"h-4 w-4"})})})]})})]},t.id))})]})}),e.jsxs("div",{className:"flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-gray-100",children:[e.jsxs("div",{className:"text-xs text-gray-500 font-medium",children:["Menampilkan ",e.jsx("span",{className:"font-semibold text-gray-800",children:r.from||0})," -"," ",e.jsx("span",{className:"font-semibold text-gray-800",children:r.to||0})," dari"," ",e.jsx("span",{className:"font-semibold text-gray-800",children:r.total})," kontainer"]}),e.jsx("div",{className:"flex flex-wrap items-center justify-center gap-1",children:r.links.map((t,x)=>t.url?e.jsx(m,{variant:t.active?"default":"outline",disabled:!t.url,onClick:()=>C.get(t.url),className:"px-3 py-1 text-xs whitespace-nowrap",children:t.label.replace(/&laquo; Previous|Next &raquo;/,f=>f.includes("Previous")?"← Prev":f.includes("Next")?"Next →":f)},x):e.jsx("span",{className:"px-3 py-1 text-xs text-gray-400",children:"..."},x))})]})]}),e.jsx(ve,{isOpen:ae,onClose:()=>q(!1),data:se})]})]})}export{lt as default};
