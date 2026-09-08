import{c as I,B as A}from"./button-CnfuRwTT.js";import{r as l,j as e}from"./app-hEF5q0kU.js";import{D as P,a as E,b as H,c as M}from"./dialog-CQ-kvauH.js";import{I as r}from"./input-D84BXIZM.js";import{L as n}from"./label-E1ugI-oB.js";import{P as R}from"./printer-CxCHgQ3C.js";/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const K=[["path",{d:"M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z",key:"q3az6g"}],["path",{d:"M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8",key:"1h4pet"}],["path",{d:"M12 17.5v-11",key:"1jc1ny"}]],B=I("Receipt",K);function Y({isOpen:d,onClose:m,data:a}){const x=l.useRef(null),[h,p]=l.useState(""),[g,b]=l.useState(""),[f,u]=l.useState(""),[j,N]=l.useState(""),[w,v]=l.useState(""),[y,k]=l.useState("FULL CONT(ON-CHASIS)"),[S,C]=l.useState("");l.useEffect(()=>{if(a){const t=new Date,s=String(t.getDate()).padStart(2,"0"),i=String(t.getMonth()+1).padStart(2,"0"),o=t.getFullYear(),c=String(t.getHours()).padStart(2,"0"),L=String(t.getMinutes()).padStart(2,"0");p(a.date?T(a.date):`${s} - ${i} - ${o}`),b(a.exit_time||`${c}:${L}`),u(a.police_number||""),N(a.destination||""),v(a.seal_number||"-"),k(a.commodity?a.commodity.toUpperCase():"FULL CONT(ON-CHASIS)"),C(a.notes||"")}},[a,d]);function T(t){try{const s=new Date(t);if(isNaN(s.getTime()))return t;const i=String(s.getDate()).padStart(2,"0"),o=String(s.getMonth()+1).padStart(2,"0"),c=s.getFullYear();return`${i} - ${o} - ${c}`}catch{return t}}const z=t=>{if(!t)return'1 X 20"';const s=t.toLowerCase();return s.includes("45")?'1 X 45"':s.includes("40")?'1 X 40"':s.includes("20")?'1 X 20"':`1 X ${t}`},D=()=>{const t=x.current;if(!t)return;const s=window.open("","_blank","width=920,height=650");if(!s){alert("Popup terblokir oleh browser. Izinkan popup untuk mencetak Surat Jalan.");return}s.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Surat Jalan - ${(a==null?void 0:a.container_number)||"Depo Surabaya"}</title>
                <style>
                    @page {
                        size: 210mm 140mm; /* Ukuran Kertas 21 x 14 cm */
                        margin: 0;
                    }
                    * {
                        box-sizing: border-box;
                        margin: 0;
                        padding: 0;
                        font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
                        color: #111;
                    }
                    body {
                        width: 210mm;
                        height: 140mm;
                        padding: 5mm 8mm 5mm 8mm;
                        background: #fff;
                        overflow: hidden;
                    }
                    .sj-container {
                        width: 100%;
                        height: 130mm;
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                    }
                    
                    /* Header */
                    .header-row {
                        display: flex;
                        justify-content: space-between;
                        align-items: flex-start;
                        margin-bottom: 1.5mm;
                    }
                    .company-brand {
                        display: flex;
                        align-items: center;
                        gap: 3mm;
                    }
                    .company-logo {
                        height: 38px;
                        width: auto;
                        object-fit: contain;
                        filter: grayscale(100%) contrast(150%);
                    }
                    .company-info {
                        flex: 1;
                    }
                    .company-title {
                        font-size: 13pt;
                        font-weight: 900;
                        letter-spacing: -0.2px;
                        line-height: 1.1;
                        color: #000;
                    }
                    .company-address {
                        font-size: 8pt;
                        font-weight: 600;
                        margin-top: 1px;
                        line-height: 1.2;
                    }
                    .company-telp {
                        font-size: 7.5pt;
                        line-height: 1.2;
                    }
                    .customer-row {
                        margin-top: 2.5mm;
                        font-size: 9pt;
                        font-weight: 800;
                        line-height: 1.25;
                    }
                    .customer-row .shipper {
                        font-weight: 700;
                        padding-left: 17mm;
                        color: #222;
                    }

                    /* Center Title Box: SURAT JALAN */
                    .title-sj-box {
                        border: 2px solid #000;
                        padding: 2mm 5mm;
                        text-align: center;
                        align-self: flex-start;
                        margin: 0 3mm;
                    }
                    .title-sj-text {
                        font-size: 12.5pt;
                        font-weight: 900;
                        letter-spacing: 2.5px;
                        line-height: 1;
                        color: #000;
                    }

                    /* Meta Box Kanan */
                    .meta-box {
                        width: 60mm;
                        border: 1.5px solid #000;
                        font-size: 8pt;
                    }
                    .meta-row {
                        display: flex;
                        border-bottom: 1px solid #000;
                        height: 5.8mm;
                        align-items: center;
                    }
                    .meta-row:last-child {
                        border-bottom: none;
                    }
                    .meta-label {
                        width: 21mm;
                        padding-left: 2mm;
                        font-weight: 600;
                    }
                    .meta-colon {
                        width: 3mm;
                    }
                    .meta-val {
                        flex: 1;
                        padding-right: 2mm;
                        font-weight: 700;
                    }
                    
                    /* Grid Data Kontainer Utama */
                    .main-grid {
                        width: 100%;
                        border: 2px solid #000;
                        border-collapse: collapse;
                        margin-top: 1mm;
                    }
                    .main-grid td {
                        border: 1px solid #000;
                        vertical-align: middle;
                    }
                    .col-lbl {
                        width: 32mm;
                        font-size: 8.5pt;
                        font-weight: 800;
                        text-align: center;
                        line-height: 1.15;
                    }
                    .col-cont-num {
                        height: 16mm;
                        font-size: 24pt;
                        font-weight: 900;
                        letter-spacing: 2px;
                        text-align: center;
                        font-family: 'Arial Black', Arial, monospace, sans-serif;
                    }
                    .col-data-text {
                        height: 8.5mm;
                        font-size: 10pt;
                        font-weight: 700;
                        text-align: center;
                    }
                    .col-service {
                        width: 57mm;
                        text-align: center;
                        vertical-align: middle;
                        padding: 0;
                    }
                    .service-size {
                        font-size: 12.5pt;
                        font-weight: 900;
                        padding: 2.5mm 0;
                        border-bottom: 1.5px solid #000;
                    }
                    .service-title {
                        font-size: 13.5pt;
                        font-weight: 900;
                        font-style: italic;
                        padding: 5mm 2mm;
                        line-height: 1.25;
                        text-transform: uppercase;
                    }

                    /* Footer & Tanda Tangan */
                    .footer-grid {
                        width: 100%;
                        border: 2px solid #000;
                        border-top: none;
                        border-collapse: collapse;
                        height: 33mm;
                    }
                    .footer-grid td {
                        border: 1px solid #000;
                        vertical-align: top;
                    }
                    .footer-notice {
                        width: 44mm;
                        padding: 2.5mm;
                        font-size: 7.5pt;
                        line-height: 1.3;
                    }
                    .footer-notice u {
                        font-weight: 700;
                    }
                    .sig-col {
                        width: 36mm;
                        text-align: center;
                        font-size: 8.5pt;
                        font-weight: 700;
                        padding-top: 2mm;
                    }
                    .sig-col-empty {
                        flex: 1;
                        text-align: center;
                        font-size: 8.5pt;
                        font-weight: 700;
                        padding-top: 2mm;
                    }
                </style>
            </head>
            <body>
                <div class="sj-container">
                    ${t.innerHTML}
                </div>
                <script>
                    window.onload = function() {
                        window.print();
                        setTimeout(function() {
                            window.close();
                        }, 500);
                    };
                <\/script>
            </body>
            </html>
        `),s.document.close()};return a?e.jsx(P,{open:d,onOpenChange:m,children:e.jsxs(E,{className:"w-full sm:max-w-5xl max-h-[96vh] overflow-y-auto p-4 sm:p-6",children:[e.jsx(H,{className:"border-b pb-3",children:e.jsx(M,{className:"text-lg font-bold flex items-center justify-between",children:e.jsx("span",{children:"Cetak Surat Jalan (Format 21 x 14 cm)"})})}),e.jsxs("div",{className:"bg-blue-50/60 border border-blue-200 rounded-lg p-3 text-xs space-y-2",children:[e.jsx("div",{className:"font-semibold text-blue-900",children:"Sesuaikan Data Pengiriman Sebelum Cetak:"}),e.jsxs("div",{className:"grid grid-cols-2 sm:grid-cols-4 gap-2",children:[e.jsxs("div",{children:[e.jsx(n,{className:"text-[11px] text-gray-700",children:"Tanggal"}),e.jsx(r,{value:h,onChange:t=>p(t.target.value),className:"h-8 text-xs bg-white",placeholder:"DD - MM - YYYY"})]}),e.jsxs("div",{children:[e.jsx(n,{className:"text-[11px] text-gray-700",children:"Jam Keluar"}),e.jsx(r,{value:g,onChange:t=>b(t.target.value),className:"h-8 text-xs bg-white",placeholder:"HH:MM"})]}),e.jsxs("div",{children:[e.jsx(n,{className:"text-[11px] text-gray-700",children:"No. Polisi Truk"}),e.jsx(r,{value:f,onChange:t=>u(t.target.value),className:"h-8 text-xs bg-white",placeholder:"Contoh: L 1234 AB"})]}),e.jsxs("div",{children:[e.jsx(n,{className:"text-[11px] text-gray-700",children:"Tujuan"}),e.jsx(r,{value:j,onChange:t=>N(t.target.value),className:"h-8 text-xs bg-white",placeholder:"Contoh: Pelabuhan / Depo"})]}),e.jsxs("div",{children:[e.jsx(n,{className:"text-[11px] text-gray-700",children:"No. Segel"}),e.jsx(r,{value:w,onChange:t=>v(t.target.value),className:"h-8 text-xs bg-white",placeholder:"Nomor Segel"})]}),e.jsxs("div",{children:[e.jsx(n,{className:"text-[11px] text-gray-700",children:"Isi Kontainer"}),e.jsx(r,{value:y,onChange:t=>k(t.target.value),className:"h-8 text-xs bg-white",placeholder:"FULL CONT(ON-CHASIS)"})]}),e.jsxs("div",{className:"sm:col-span-2",children:[e.jsx(n,{className:"text-[11px] text-gray-700",children:"Keterangan"}),e.jsx(r,{value:S,onChange:t=>C(t.target.value),className:"h-8 text-xs bg-white",placeholder:"Catatan tambahan..."})]})]})]}),e.jsx("div",{className:"flex justify-center p-3 bg-gray-100 rounded-xl overflow-x-auto",children:e.jsxs("div",{className:"relative bg-white shadow-lg border border-gray-400 p-5 w-[794px] min-w-[794px] h-[529px] min-h-[529px] rounded flex flex-col justify-between select-none",children:[e.jsx("div",{className:"absolute left-1.5 top-0 bottom-0 flex flex-col justify-between py-2 pointer-events-none opacity-20",children:Array.from({length:16}).map((t,s)=>e.jsx("div",{className:"w-2.5 h-2.5 rounded-full bg-gray-700"},s))}),e.jsx("div",{className:"absolute right-1.5 top-0 bottom-0 flex flex-col justify-between py-2 pointer-events-none opacity-20",children:Array.from({length:16}).map((t,s)=>e.jsx("div",{className:"w-2.5 h-2.5 rounded-full bg-gray-700"},s))}),e.jsxs("div",{ref:x,className:"w-full h-full flex flex-col justify-between px-3",children:[e.jsxs("div",{children:[e.jsxs("div",{className:"header-row flex justify-between items-start",children:[e.jsxs("div",{className:"flex items-start gap-2.5 max-w-[340px]",children:[e.jsx("img",{src:"/logo.png",alt:"Logo Depo",className:"h-10 w-auto object-contain filter grayscale contrast-150 shrink-0"}),e.jsxs("div",{className:"company-info",children:[e.jsx("div",{className:"company-title font-black text-[15px] tracking-tight text-black leading-tight",children:"PT. DEPO SURABAYA SEJAHTERA"}),e.jsx("div",{className:"company-address font-semibold text-[10.5px] text-gray-800 leading-snug",children:"Jl. Tanjung Sadari No. 90 (Tanjung Batu No. 1)"}),e.jsx("div",{className:"company-telp text-[10px] text-gray-700 leading-snug",children:"Telp. 031-353 9484, 031-3539485   Fax. 031-3539482"})]})]}),e.jsx("div",{className:"title-sj-box border-2 border-black px-3.5 py-1 text-center self-start",children:e.jsx("div",{className:"title-sj-text font-black text-sm tracking-[3px] text-black",children:"SURAT JALAN"})}),e.jsxs("div",{className:"meta-box w-[230px] border-[1.5px] border-black text-[11px]",children:[e.jsxs("div",{className:"meta-row flex border-b border-black py-0.5 items-center",children:[e.jsx("div",{className:"meta-label w-[80px] pl-2 font-semibold",children:"Tanggal"}),e.jsx("div",{className:"meta-colon w-3",children:":"}),e.jsx("div",{className:"meta-val flex-1 pr-2 font-bold",children:h||"-"})]}),e.jsxs("div",{className:"meta-row flex border-b border-black py-0.5 items-center",children:[e.jsx("div",{className:"meta-label w-[80px] pl-2 font-semibold",children:"Jam Keluar"}),e.jsx("div",{className:"meta-colon w-3",children:":"}),e.jsx("div",{className:"meta-val flex-1 pr-2 font-bold",children:g||"-"})]}),e.jsxs("div",{className:"meta-row flex border-b border-black py-0.5 items-center",children:[e.jsx("div",{className:"meta-label w-[80px] pl-2 font-semibold",children:"No. Pol"}),e.jsx("div",{className:"meta-colon w-3",children:":"}),e.jsx("div",{className:"meta-val flex-1 pr-2 font-bold",children:f||"-"})]}),e.jsxs("div",{className:"meta-row flex py-0.5 items-center",children:[e.jsx("div",{className:"meta-label w-[80px] pl-2 font-semibold",children:"Tujuan"}),e.jsx("div",{className:"meta-colon w-3",children:":"}),e.jsx("div",{className:"meta-val flex-1 pr-2 font-bold",children:j||"-"})]})]})]}),e.jsxs("div",{className:"customer-row mt-2 text-[12px] font-bold text-gray-950 leading-tight",children:["Customer : ",a.customer_name||"-",a.shipper_name&&e.jsxs("div",{className:"shipper font-semibold text-gray-800 pl-16",children:["(",a.shipper_name,")"]})]})]}),e.jsx("table",{className:"main-grid w-full border-2 border-black border-collapse mt-2",children:e.jsxs("tbody",{children:[e.jsxs("tr",{children:[e.jsxs("td",{className:"col-lbl w-[125px] border border-black p-2 font-bold text-center text-xs",children:["NO",e.jsx("br",{}),"CONTAINER"]}),e.jsx("td",{className:"col-val col-cont-num border border-black p-2 font-black text-2xl sm:text-3xl text-center tracking-wider font-mono",children:a.container_number}),e.jsxs("td",{rowSpan:4,className:"col-service w-[220px] border border-black p-0 text-center align-middle bg-gray-50/20",children:[e.jsx("div",{className:"service-size text-base font-black py-2.5 border-b-[1.5px] border-black",children:z(a.size)}),e.jsx("div",{className:"service-title text-base font-black italic py-5 px-2 tracking-wide uppercase leading-tight",children:a.service_type||"PEMERIKSAAN KARANTINA"})]})]}),e.jsxs("tr",{children:[e.jsx("td",{className:"col-lbl border border-black p-1.5 font-bold text-center text-xs",children:"ISI"}),e.jsx("td",{className:"col-data-text border border-black p-1.5 px-3 font-semibold text-xs sm:text-sm text-center",children:y||"FULL CONT(ON-CHASIS)"})]}),e.jsxs("tr",{children:[e.jsx("td",{className:"col-lbl border border-black p-1.5 font-bold text-center text-xs",children:"NO SEGEL"}),e.jsx("td",{className:"col-data-text border border-black p-1.5 px-3 font-semibold text-xs sm:text-sm text-center",children:w||"-"})]}),e.jsxs("tr",{children:[e.jsx("td",{className:"col-lbl border border-black p-1.5 font-bold text-center text-xs",children:"KETERANGAN"}),e.jsx("td",{className:"col-data-text border border-black p-1.5 px-3 font-semibold text-xs sm:text-sm text-center",children:S||"-"})]})]})}),e.jsx("table",{className:"footer-grid w-full border-2 border-black border-t-0 border-collapse h-[120px]",children:e.jsx("tbody",{children:e.jsxs("tr",{children:[e.jsxs("td",{className:"footer-notice w-[190px] border border-black p-2.5 text-[10px] leading-tight text-gray-800 align-top",children:[e.jsx("strong",{children:e.jsx("u",{children:"PERHATIAN :"})})," Mohon container dicek terlebih dahulu, komplain setelah keluar depo bukan tanggung jawab kami."]}),e.jsx("td",{className:"sig-col w-[150px] border border-black text-center text-xs p-2 align-top",children:e.jsx("div",{className:"font-semibold",children:"Diserahkan oleh"})}),e.jsx("td",{className:"sig-col w-[150px] border border-black text-center text-xs p-2 align-top",children:e.jsx("div",{className:"font-semibold",children:"Sopir"})}),e.jsx("td",{className:"sig-col-empty border border-black text-center text-xs p-2 align-top",children:e.jsx("div",{className:"font-semibold",children:"Penerima"})})]})})})]})]})}),e.jsxs("div",{className:"flex justify-between items-center pt-2 border-t mt-2",children:[e.jsxs("div",{className:"text-xs text-gray-500",children:["Ukuran Kertas: ",e.jsx("strong",{children:"21 cm x 14 cm (Continuous Form)"})]}),e.jsxs("div",{className:"flex gap-2",children:[e.jsx(A,{variant:"outline",size:"sm",onClick:m,children:"Tutup"}),e.jsxs(A,{size:"sm",onClick:D,className:"bg-blue-600 hover:bg-blue-700 text-white gap-1.5 font-semibold",children:[e.jsx(R,{className:"h-4 w-4"}),"Cetak Surat Jalan"]})]})]})]})}):null}export{B as R,Y as S};
