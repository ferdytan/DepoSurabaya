import{c as w,B as M}from"./button-DqA0v0FR.js";import{r as l,j as e}from"./app-Bu7ecqZZ.js";import{D as K,a as U,b as Y,c as G}from"./dialog-BAJGUtC4.js";import{I as o}from"./input-B-H-0AZR.js";import{L as d}from"./label-C2nxvUCE.js";import{P as q}from"./printer-CMogWGpP.js";/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const X=[["path",{d:"M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z",key:"q3az6g"}],["path",{d:"M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8",key:"1h4pet"}],["path",{d:"M12 17.5v-11",key:"1jc1ny"}]],ne=w("Receipt",X);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const W=[["path",{d:"M21 10.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h12.5",key:"1uzm8b"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]],V=w("SquareCheckBig",W);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Z=[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}]],Q=w("Square",Z);function oe({isOpen:y,onClose:k,data:a}){const H=l.useRef(null),[g,S]=l.useState(""),[b,C]=l.useState(""),[f,T]=l.useState(""),[u,A]=l.useState(""),[v,$]=l.useState("-"),[j,z]=l.useState("FULL CONT(ON-CHASIS)"),[N,E]=l.useState("-"),[x,L]=l.useState(""),[m,O]=l.useState(!1);l.useEffect(()=>{if(a){const t=new Date,i=String(t.getDate()).padStart(2,"0"),s=String(t.getMonth()+1).padStart(2,"0"),r=t.getFullYear(),n=String(t.getHours()).padStart(2,"0"),h=String(t.getMinutes()).padStart(2,"0");S(a.date?J(a.date):`${i} - ${s} - ${r}`),C(a.exit_time||`${n}:${h}`),T(a.police_number||""),A(a.destination||""),$(a.seal_number||"-"),z(a.commodity?a.commodity.toUpperCase():"FULL CONT(ON-CHASIS)"),E(a.notes||"-"),L(a.container_number||"")}},[a,y]);function J(t){try{const i=new Date(t);if(isNaN(i.getTime()))return t;const s=String(i.getDate()).padStart(2,"0"),r=String(i.getMonth()+1).padStart(2,"0"),n=i.getFullYear();return`${s} - ${r} - ${n}`}catch{return t}}const I=(t=>{if(!t)return'1 X 20"';const i=t.toLowerCase();return i.includes("45")?'1 X 45"':i.includes("40")?'1 X 40"':i.includes("20")?'1 X 20"':`1 X ${t}`})(a==null?void 0:a.size),P=(a==null?void 0:a.service_type)||"PEMERIKSAAN KARANTINA",D=(a==null?void 0:a.customer_name)||"-",p=(a==null?void 0:a.shipper_name)||null,_=()=>{const t=m?`<img src="${window.location.origin}/logo.png" class="depo-logo" alt="Logo" style="height: 35px; max-height: 35px; width: 42px; max-width: 42px; object-fit: contain; margin-right: 8px;" />`:"";return`<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Surat Jalan - ${x||"Depo Surabaya"}</title>
    <style>
        @page {
            size: 210mm 140mm;
            margin: 0mm;
        }
        *, *::before, *::after {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
        }
        html, body {
            width: 210mm !important;
            height: 140mm !important;
            max-height: 140mm !important;
            min-height: 140mm !important;
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            font-family: Arial, "Helvetica Neue", Helvetica, sans-serif !important;
            color: #000000 !important;
            overflow: hidden !important;
        }
        .sj-page {
            width: 210mm !important;
            height: 140mm !important;
            max-height: 140mm !important;
            padding: 4mm 7mm 4mm 7mm !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
            overflow: hidden !important;
            page-break-before: avoid !important;
            page-break-inside: avoid !important;
            page-break-after: avoid !important;
            break-before: avoid !important;
            break-inside: avoid !important;
            break-after: avoid !important;
        }
        .header-section {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 1.5mm;
        }
        .company-wrapper {
            display: flex;
            align-items: flex-start;
            max-width: 95mm;
        }
        .depo-logo {
            height: 35px !important;
            max-height: 35px !important;
            width: 42px !important;
            max-width: 42px !important;
            object-fit: contain !important;
            margin-right: 7px !important;
            filter: grayscale(100%) contrast(150%);
        }
        .company-text {
            flex: 1;
        }
        .company-name {
            font-size: 13.5pt;
            font-weight: 900;
            letter-spacing: 0px;
            line-height: 1.15;
            color: #000;
        }
        .company-address {
            font-size: 8.5pt;
            font-weight: 600;
            line-height: 1.25;
            margin-top: 1px;
            color: #111;
        }
        .company-phone {
            font-size: 8pt;
            font-weight: 500;
            line-height: 1.2;
            color: #222;
        }
        .customer-info {
            margin-top: 2mm;
            font-size: 9pt;
            font-weight: 800;
            line-height: 1.25;
        }
        .shipper-info {
            font-size: 8.5pt;
            font-weight: 700;
            padding-left: 17mm;
            color: #222;
        }

        /* Title Box */
        .title-box {
            border: 1.5px solid #000;
            padding: 2mm 6mm;
            text-align: center;
            align-self: flex-start;
            margin: 0 2mm;
        }
        .title-text {
            font-size: 12.5pt;
            font-weight: 900;
            letter-spacing: 2px;
            line-height: 1;
            color: #000;
        }

        /* Meta Box Right */
        .meta-box {
            width: 62mm;
            border: 1.5px solid #000;
            font-size: 8pt;
        }
        .meta-row {
            display: flex;
            border-bottom: 1px solid #000;
            height: 5.4mm;
            align-items: center;
        }
        .meta-row:last-child {
            border-bottom: none;
        }
        .meta-lbl {
            width: 21mm;
            padding-left: 2mm;
            font-weight: 600;
        }
        .meta-sep {
            width: 3mm;
            font-weight: 700;
        }
        .meta-val {
            flex: 1;
            padding-right: 2mm;
            font-weight: 700;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }

        /* Main Grid Table */
        table.grid-table {
            width: 100%;
            border: 2px solid #000;
            border-collapse: collapse;
        }
        table.grid-table td {
            border: 1px solid #000;
            vertical-align: middle;
        }
        .td-lbl {
            width: 33mm;
            font-size: 8.5pt;
            font-weight: 800;
            text-align: center;
            line-height: 1.15;
            padding: 1mm;
        }
        .td-cont-num {
            height: 16mm;
            font-size: 26pt;
            font-weight: 900;
            letter-spacing: 2px;
            text-align: center;
            font-family: 'Arial Black', Impact, Arial, monospace, sans-serif;
        }
        .td-val-row {
            height: 8.5mm;
            font-size: 10pt;
            font-weight: 700;
            text-align: center;
            padding: 0 3mm;
        }
        .td-service-col {
            width: 56mm;
            text-align: center;
            vertical-align: middle;
            padding: 0;
        }
        .service-size-box {
            font-size: 12.5pt;
            font-weight: 900;
            padding: 2mm 0;
            border-bottom: 1.5px solid #000;
        }
        .service-title-box {
            font-size: 13pt;
            font-weight: 900;
            font-style: italic;
            padding: 4mm 2mm;
            line-height: 1.25;
            text-transform: uppercase;
        }

        /* Footer Signature Table */
        table.footer-table {
            width: 100%;
            border: 2px solid #000;
            border-top: none;
            border-collapse: collapse;
            height: 31mm;
        }
        table.footer-table td {
            border: 1px solid #000;
            vertical-align: top;
        }
        .td-notice {
            width: 46mm;
            padding: 2.5mm;
            font-size: 7.5pt;
            line-height: 1.3;
            color: #111;
        }
        .td-notice u {
            font-weight: 700;
        }
        .td-sig-col {
            width: 36mm;
            text-align: center;
            font-size: 8.5pt;
            font-weight: 700;
            padding-top: 2mm;
        }
        .td-sig-empty {
            flex: 1;
            text-align: center;
            font-size: 8.5pt;
            font-weight: 700;
            padding-top: 2mm;
        }
    </style>
</head>
<body>
    <div class="sj-page">
        <!-- Top Section -->
        <div>
            <div class="header-section">
                <!-- Company Info -->
                <div class="company-wrapper">
                    ${t}
                    <div class="company-text">
                        <div class="company-name">PT. DEPO SURABAYA SEJAHTERA</div>
                        <div class="company-address">Jl. Tanjung Sadari No. 90 (Tanjung Batu No. 1)</div>
                        <div class="company-phone">Telp. 031-353 9484, 031-3539485 &nbsp; Fax. 031-3539482</div>
                    </div>
                </div>

                <!-- Center Title SURAT JALAN -->
                <div class="title-box">
                    <div class="title-text">SURAT JALAN</div>
                </div>

                <!-- Meta Box Kanan -->
                <div class="meta-box">
                    <div class="meta-row">
                        <div class="meta-lbl">Tanggal</div>
                        <div class="meta-sep">:</div>
                        <div class="meta-val">${g||"-"}</div>
                    </div>
                    <div class="meta-row">
                        <div class="meta-lbl">Jam Keluar</div>
                        <div class="meta-sep">:</div>
                        <div class="meta-val">${b||"-"}</div>
                    </div>
                    <div class="meta-row">
                        <div class="meta-lbl">No. Pol</div>
                        <div class="meta-sep">:</div>
                        <div class="meta-val">${f||"-"}</div>
                    </div>
                    <div class="meta-row">
                        <div class="meta-lbl">Tujuan</div>
                        <div class="meta-sep">:</div>
                        <div class="meta-val">${u||"-"}</div>
                    </div>
                </div>
            </div>

            <!-- Customer & Shipper Row -->
            <div class="customer-info">
                Customer : ${D}
                ${p?`<div class="shipper-info">(${p})</div>`:""}
            </div>
        </div>

        <!-- Main Grid Table -->
        <table class="grid-table">
            <tbody>
                <tr>
                    <td class="td-lbl">NO<br>CONTAINER</td>
                    <td class="td-cont-num">${x}</td>
                    <td rowspan="4" class="td-service-col">
                        <div class="service-size-box">${I}</div>
                        <div class="service-title-box">${P}</div>
                    </td>
                </tr>
                <tr>
                    <td class="td-lbl">ISI</td>
                    <td class="td-val-row">${j||"FULL CONT(ON-CHASIS)"}</td>
                </tr>
                <tr>
                    <td class="td-lbl">NO SEGEL</td>
                    <td class="td-val-row">${v||"-"}</td>
                </tr>
                <tr>
                    <td class="td-lbl">KETERANGAN</td>
                    <td class="td-val-row">${N||"-"}</td>
                </tr>
            </tbody>
        </table>

        <!-- Footer Signatures Grid -->
        <table class="footer-table">
            <tbody>
                <tr>
                    <td class="td-notice">
                        <strong><u>PERHATIAN :</u></strong> Mohon container dicek terlebih dahulu, komplain setelah keluar depo bukan tanggung jawab kami.
                    </td>
                    <td class="td-sig-col">
                        Diserahkan oleh
                    </td>
                    <td class="td-sig-col">
                        Sopir
                    </td>
                    <td class="td-sig-empty">
                        Penerima
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</body>
</html>`},B=()=>{var h;const t=_(),i=document.getElementById("sj-print-iframe");i&&i.remove();const s=document.createElement("iframe");s.id="sj-print-iframe",s.style.position="fixed",s.style.right="0",s.style.bottom="0",s.style.width="0",s.style.height="0",s.style.border="0",s.style.visibility="hidden",document.body.appendChild(s);const r=((h=s.contentWindow)==null?void 0:h.document)||s.contentDocument;if(!r){alert("Gagal menyiapkan pencetakan. Silakan coba lagi.");return}r.open(),r.write(t),r.close();const n=()=>{setTimeout(()=>{var c,R;try{(c=s.contentWindow)==null||c.focus(),(R=s.contentWindow)==null||R.print()}catch(F){console.error("Print error:",F)}finally{setTimeout(()=>{document.body.contains(s)&&s.remove()},1e3)}},250)};if(m){const c=r.querySelector("img");c&&!c.complete?(c.onload=n,c.onerror=n):n()}else n()};return a?e.jsx(K,{open:y,onOpenChange:k,children:e.jsxs(U,{className:"w-full sm:max-w-5xl lg:max-w-6xl max-h-[96vh] overflow-y-auto p-4 sm:p-6",children:[e.jsx(Y,{className:"border-b pb-3",children:e.jsx(G,{className:"text-lg font-bold flex items-center justify-between",children:e.jsx("span",{children:"Cetak Surat Jalan (Ukuran Media: 21 x 14 cm)"})})}),e.jsxs("div",{className:"bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs space-y-2.5",children:[e.jsxs("div",{className:"flex flex-wrap items-center justify-between gap-2",children:[e.jsx("span",{className:"font-bold text-slate-800",children:"Sesuaikan Data Pengiriman Sebelum Cetak:"}),e.jsxs("button",{type:"button",onClick:()=>O(!m),className:"inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold cursor-pointer transition",children:[m?e.jsx(V,{className:"h-3.5 w-3.5 text-blue-600"}):e.jsx(Q,{className:"h-3.5 w-3.5 text-slate-400"}),"Sertakan Logo Perusahaan"]})]}),e.jsxs("div",{className:"grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2",children:[e.jsxs("div",{children:[e.jsx(d,{className:"text-[11px] text-gray-700",children:"Tanggal"}),e.jsx(o,{value:g,onChange:t=>S(t.target.value),className:"h-8 text-xs bg-white",placeholder:"DD - MM - YYYY"})]}),e.jsxs("div",{children:[e.jsx(d,{className:"text-[11px] text-gray-700",children:"Jam Keluar"}),e.jsx(o,{value:b,onChange:t=>C(t.target.value),className:"h-8 text-xs bg-white",placeholder:"HH:MM"})]}),e.jsxs("div",{children:[e.jsx(d,{className:"text-[11px] text-gray-700",children:"No. Polisi"}),e.jsx(o,{value:f,onChange:t=>T(t.target.value),className:"h-8 text-xs bg-white",placeholder:"Contoh: L 1234 AB"})]}),e.jsxs("div",{children:[e.jsx(d,{className:"text-[11px] text-gray-700",children:"Tujuan"}),e.jsx(o,{value:u,onChange:t=>A(t.target.value),className:"h-8 text-xs bg-white",placeholder:"Contoh: Pelabuhan"})]}),e.jsxs("div",{children:[e.jsx(d,{className:"text-[11px] text-gray-700",children:"No. Segel"}),e.jsx(o,{value:v,onChange:t=>$(t.target.value),className:"h-8 text-xs bg-white",placeholder:"Nomor Segel"})]}),e.jsxs("div",{children:[e.jsx(d,{className:"text-[11px] text-gray-700",children:"Isi Kontainer"}),e.jsx(o,{value:j,onChange:t=>z(t.target.value),className:"h-8 text-xs bg-white",placeholder:"FULL CONT(ON-CHASIS)"})]}),e.jsxs("div",{children:[e.jsx(d,{className:"text-[11px] text-gray-700",children:"No. Container"}),e.jsx(o,{value:x,onChange:t=>L(t.target.value),className:"h-8 text-xs bg-white font-mono font-bold",placeholder:"Nomor Container"})]}),e.jsxs("div",{className:"col-span-2 sm:col-span-4 lg:col-span-7",children:[e.jsx(d,{className:"text-[11px] text-gray-700",children:"Keterangan"}),e.jsx(o,{value:N,onChange:t=>E(t.target.value),className:"h-8 text-xs bg-white",placeholder:"Catatan / keterangan tambahan..."})]})]})]}),e.jsx("div",{className:"flex justify-center p-3 bg-slate-200/70 rounded-xl overflow-x-auto",children:e.jsxs("div",{ref:H,className:"relative bg-white shadow-md border border-gray-400 p-6 w-[794px] min-w-[794px] h-[529px] min-h-[529px] rounded flex flex-col justify-between select-none",children:[e.jsx("div",{className:"absolute left-1.5 top-0 bottom-0 flex flex-col justify-between py-2 pointer-events-none opacity-20",children:Array.from({length:16}).map((t,i)=>e.jsx("div",{className:"w-2.5 h-2.5 rounded-full bg-gray-700"},i))}),e.jsx("div",{className:"absolute right-1.5 top-0 bottom-0 flex flex-col justify-between py-2 pointer-events-none opacity-20",children:Array.from({length:16}).map((t,i)=>e.jsx("div",{className:"w-2.5 h-2.5 rounded-full bg-gray-700"},i))}),e.jsxs("div",{children:[e.jsxs("div",{className:"flex justify-between items-start",children:[e.jsxs("div",{className:"flex items-start max-w-[360px]",children:[m&&e.jsx("img",{src:"/logo.png",alt:"Logo Depo",className:"h-9 w-auto max-w-[42px] object-contain filter grayscale contrast-150 shrink-0 mr-2",style:{maxHeight:"36px",maxWidth:"42px"}}),e.jsxs("div",{className:"company-text",children:[e.jsx("div",{className:"font-black text-[15px] tracking-normal text-black leading-tight",children:"PT. DEPO SURABAYA SEJAHTERA"}),e.jsx("div",{className:"font-semibold text-[11px] text-gray-800 leading-snug mt-0.5",children:"Jl. Tanjung Sadari No. 90 (Tanjung Batu No. 1)"}),e.jsx("div",{className:"text-[10px] text-gray-700 leading-snug",children:"Telp. 031-353 9484, 031-3539485   Fax. 031-3539482"})]})]}),e.jsx("div",{className:"border-[1.5px] border-black px-3.5 py-1 text-center self-start",children:e.jsx("div",{className:"font-black text-sm tracking-[2px] text-black",children:"SURAT JALAN"})}),e.jsxs("div",{className:"w-[230px] border-[1.5px] border-black text-[11px]",children:[e.jsxs("div",{className:"flex border-b border-black py-0.5 items-center",children:[e.jsx("div",{className:"w-[80px] pl-2 font-semibold",children:"Tanggal"}),e.jsx("div",{className:"w-3 font-bold",children:":"}),e.jsx("div",{className:"flex-1 pr-2 font-bold truncate",children:g||"-"})]}),e.jsxs("div",{className:"flex border-b border-black py-0.5 items-center",children:[e.jsx("div",{className:"w-[80px] pl-2 font-semibold",children:"Jam Keluar"}),e.jsx("div",{className:"w-3 font-bold",children:":"}),e.jsx("div",{className:"flex-1 pr-2 font-bold truncate",children:b||"-"})]}),e.jsxs("div",{className:"flex border-b border-black py-0.5 items-center",children:[e.jsx("div",{className:"w-[80px] pl-2 font-semibold",children:"No. Pol"}),e.jsx("div",{className:"w-3 font-bold",children:":"}),e.jsx("div",{className:"flex-1 pr-2 font-bold truncate",children:f||"-"})]}),e.jsxs("div",{className:"flex py-0.5 items-center",children:[e.jsx("div",{className:"w-[80px] pl-2 font-semibold",children:"Tujuan"}),e.jsx("div",{className:"w-3 font-bold",children:":"}),e.jsx("div",{className:"flex-1 pr-2 font-bold truncate",children:u||"-"})]})]})]}),e.jsxs("div",{className:"mt-2 text-[12px] font-bold text-gray-950 leading-tight",children:["Customer : ",D,p&&e.jsxs("div",{className:"font-semibold text-gray-800 pl-16",children:["(",p,")"]})]})]}),e.jsx("table",{className:"w-full border-2 border-black border-collapse",children:e.jsxs("tbody",{children:[e.jsxs("tr",{children:[e.jsxs("td",{className:"w-[125px] border border-black p-2 font-bold text-center text-xs",children:["NO",e.jsx("br",{}),"CONTAINER"]}),e.jsx("td",{className:"border border-black p-2 font-black text-2xl sm:text-3xl text-center tracking-wider font-mono",children:x}),e.jsxs("td",{rowSpan:4,className:"w-[210px] border border-black p-0 text-center align-middle bg-gray-50/30",children:[e.jsx("div",{className:"text-base font-black py-2.5 border-b-[1.5px] border-black",children:I}),e.jsx("div",{className:"text-base font-black italic py-5 px-2 tracking-wide uppercase leading-tight",children:P})]})]}),e.jsxs("tr",{children:[e.jsx("td",{className:"border border-black p-1.5 font-bold text-center text-xs",children:"ISI"}),e.jsx("td",{className:"border border-black p-1.5 px-3 font-semibold text-xs sm:text-sm text-center",children:j||"FULL CONT(ON-CHASIS)"})]}),e.jsxs("tr",{children:[e.jsx("td",{className:"border border-black p-1.5 font-bold text-center text-xs",children:"NO SEGEL"}),e.jsx("td",{className:"border border-black p-1.5 px-3 font-semibold text-xs sm:text-sm text-center",children:v||"-"})]}),e.jsxs("tr",{children:[e.jsx("td",{className:"border border-black p-1.5 font-bold text-center text-xs",children:"KETERANGAN"}),e.jsx("td",{className:"border border-black p-1.5 px-3 font-semibold text-xs sm:text-sm text-center",children:N||"-"})]})]})}),e.jsx("table",{className:"w-full border-2 border-black border-t-0 border-collapse h-[115px]",children:e.jsx("tbody",{children:e.jsxs("tr",{children:[e.jsxs("td",{className:"w-[185px] border border-black p-2.5 text-[10px] leading-tight text-gray-800 align-top",children:[e.jsx("strong",{children:e.jsx("u",{children:"PERHATIAN :"})})," Mohon container dicek terlebih dahulu, komplain setelah keluar depo bukan tanggung jawab kami."]}),e.jsx("td",{className:"w-[145px] border border-black text-center text-xs p-2 align-top",children:e.jsx("div",{className:"font-semibold",children:"Diserahkan oleh"})}),e.jsx("td",{className:"w-[145px] border border-black text-center text-xs p-2 align-top",children:e.jsx("div",{className:"font-semibold",children:"Sopir"})}),e.jsx("td",{className:"border border-black text-center text-xs p-2 align-top",children:e.jsx("div",{className:"font-semibold",children:"Penerima"})})]})})})]})}),e.jsxs("div",{className:"flex flex-wrap justify-between items-center pt-2 border-t mt-2 gap-2",children:[e.jsxs("div",{className:"text-xs text-gray-500",children:["Format Cetak: ",e.jsx("strong",{children:"21 cm x 14 cm (Continuous Form / Dot Matrix)"})," • Pastikan margin printer ",e.jsx("strong",{children:"Default / None"})]}),e.jsxs("div",{className:"flex gap-2",children:[e.jsx(M,{variant:"outline",size:"sm",onClick:k,children:"Tutup"}),e.jsxs(M,{size:"sm",onClick:B,className:"bg-blue-600 hover:bg-blue-700 text-white gap-1.5 font-semibold",children:[e.jsx(q,{className:"h-4 w-4"}),"Cetak Surat Jalan"]})]})]})]})}):null}export{ne as R,oe as S};
