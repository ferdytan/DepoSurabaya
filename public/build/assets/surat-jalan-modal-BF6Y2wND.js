import{c as E,B as T}from"./button-BuLDcGlp.js";import{r as s,j as e}from"./app-sfwE4td5.js";import{D as L,a as P,b as H,c as M}from"./dialog-DNojFUZs.js";import{I as r}from"./input-BiUP5LnL.js";import{L as n}from"./label-CdEb_pDh.js";import{P as O}from"./printer-DxlUNX8k.js";/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _=[["path",{d:"M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z",key:"q3az6g"}],["path",{d:"M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8",key:"1h4pet"}],["path",{d:"M12 17.5v-11",key:"1jc1ny"}]],Y=E("Receipt",_);function B({isOpen:d,onClose:m,data:l}){const x=s.useRef(null),[h,p]=s.useState(""),[b,g]=s.useState(""),[f,u]=s.useState(""),[j,N]=s.useState(""),[w,v]=s.useState(""),[y,k]=s.useState("FULL CONT(ON-CHASIS)"),[S,C]=s.useState("");s.useEffect(()=>{if(l){const t=new Date,a=String(t.getDate()).padStart(2,"0"),i=String(t.getMonth()+1).padStart(2,"0"),o=t.getFullYear(),c=String(t.getHours()).padStart(2,"0"),I=String(t.getMinutes()).padStart(2,"0");p(l.date?A(l.date):`${a} - ${i} - ${o}`),g(l.exit_time||`${c}:${I}`),u(l.police_number||""),N(l.destination||""),v(l.seal_number||"-"),k(l.commodity?l.commodity.toUpperCase():"FULL CONT(ON-CHASIS)"),C(l.notes||"")}},[l,d]);function A(t){try{const a=new Date(t);if(isNaN(a.getTime()))return t;const i=String(a.getDate()).padStart(2,"0"),o=String(a.getMonth()+1).padStart(2,"0"),c=a.getFullYear();return`${i} - ${o} - ${c}`}catch{return t}}const z=t=>{if(!t)return'1 X 20"';const a=t.toLowerCase();return a.includes("45")?'1 X 45"':a.includes("40")?'1 X 40"':a.includes("20")?'1 X 20"':`1 X ${t}`},D=()=>{const t=x.current;if(!t)return;const a=window.open("","_blank","width=900,height=650");if(!a){alert("Popup terblokir oleh browser. Izinkan popup untuk mencetak Surat Jalan.");return}a.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Surat Jalan - ${(l==null?void 0:l.container_number)||"Depo Surabaya"}</title>
                <style>
                    @page {
                        size: 210mm 140mm; /* Ukuran 21 x 14 cm */
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
                        padding: 8mm 10mm 6mm 10mm;
                        background: #fff;
                    }
                    .sj-container {
                        width: 100%;
                        height: 100%;
                        display: flex;
                        flex-direction: column;
                    }
                    .header-row {
                        display: flex;
                        justify-content: space-between;
                        align-items: flex-start;
                        margin-bottom: 2mm;
                    }
                    .company-info {
                        flex: 1;
                        padding-right: 4mm;
                    }
                    .company-title {
                        font-size: 15pt;
                        font-weight: 800;
                        letter-spacing: 0.5px;
                        line-height: 1.15;
                    }
                    .company-address {
                        font-size: 8.5pt;
                        font-weight: 600;
                        margin-top: 1px;
                        line-height: 1.2;
                    }
                    .company-telp {
                        font-size: 8pt;
                        margin-top: 1px;
                        line-height: 1.2;
                    }
                    .customer-row {
                        margin-top: 3mm;
                        font-size: 9pt;
                        font-weight: 700;
                        line-height: 1.25;
                    }
                    .customer-row .shipper {
                        font-weight: 600;
                        padding-left: 18mm;
                    }
                    .meta-box {
                        width: 58mm;
                        border: 1.5px solid #000;
                        font-size: 8pt;
                    }
                    .meta-row {
                        display: flex;
                        border-bottom: 1px solid #000;
                        min-height: 5.5mm;
                        align-items: center;
                    }
                    .meta-row:last-child {
                        border-bottom: none;
                    }
                    .meta-label {
                        width: 20mm;
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
                    
                    /* Grid Data Utama */
                    .main-grid {
                        width: 100%;
                        border: 1.5px solid #000;
                        border-collapse: collapse;
                        margin-top: 1.5mm;
                    }
                    .main-grid td {
                        border: 1px solid #000;
                        padding: 1.8mm 2.5mm;
                        vertical-align: middle;
                    }
                    .col-lbl {
                        width: 30mm;
                        font-size: 8.5pt;
                        font-weight: 700;
                        text-align: center;
                        line-height: 1.15;
                    }
                    .col-val {
                        width: 95mm;
                        font-size: 9pt;
                        font-weight: 600;
                    }
                    .col-cont-num {
                        font-size: 16pt;
                        font-weight: 900;
                        letter-spacing: 1.5px;
                        text-align: center;
                        font-family: 'Arial Black', Arial, sans-serif;
                    }
                    .col-service {
                        width: 55mm;
                        text-align: center;
                        vertical-align: middle;
                        padding: 0;
                    }
                    .service-size {
                        font-size: 10.5pt;
                        font-weight: 800;
                        padding: 2.5mm 0;
                        border-bottom: 1.5px solid #000;
                    }
                    .service-title {
                        font-size: 12.5pt;
                        font-weight: 900;
                        font-style: italic;
                        padding: 4mm 2mm;
                        line-height: 1.2;
                        text-transform: uppercase;
                    }

                    /* Footer */
                    .footer-grid {
                        width: 100%;
                        border: 1.5px solid #000;
                        border-top: none;
                        border-collapse: collapse;
                        margin-top: -0.5px;
                        flex: 1;
                    }
                    .footer-grid td {
                        border: 1px solid #000;
                        vertical-align: top;
                    }
                    .footer-notice {
                        width: 42mm;
                        padding: 2mm;
                        font-size: 7.5pt;
                        line-height: 1.25;
                    }
                    .footer-notice u {
                        font-weight: 600;
                    }
                    .sig-col {
                        width: 32mm;
                        text-align: center;
                        font-size: 8pt;
                        padding-top: 1.5mm;
                        height: 20mm;
                    }
                    .sig-col-empty {
                        flex: 1;
                    }
                </style>
            </head>
            <body>
                ${t.innerHTML}
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
        `),a.document.close()};return l?e.jsx(L,{open:d,onOpenChange:m,children:e.jsxs(P,{className:"max-w-4xl max-h-[92vh] overflow-y-auto p-6",children:[e.jsx(H,{className:"border-b pb-3",children:e.jsx(M,{className:"text-lg font-bold flex items-center justify-between",children:e.jsx("span",{children:"Cetak Surat Jalan (Ukuran 21 x 14 cm)"})})}),e.jsxs("div",{className:"bg-blue-50/60 border border-blue-200 rounded-lg p-3 text-xs space-y-2",children:[e.jsx("div",{className:"font-semibold text-blue-900",children:"Sesuaikan Data Pengiriman (Opsional Sebelum Cetak):"}),e.jsxs("div",{className:"grid grid-cols-2 sm:grid-cols-4 gap-2",children:[e.jsxs("div",{children:[e.jsx(n,{className:"text-[11px] text-gray-700",children:"Tanggal"}),e.jsx(r,{value:h,onChange:t=>p(t.target.value),className:"h-8 text-xs bg-white",placeholder:"DD - MM - YYYY"})]}),e.jsxs("div",{children:[e.jsx(n,{className:"text-[11px] text-gray-700",children:"Jam Keluar"}),e.jsx(r,{value:b,onChange:t=>g(t.target.value),className:"h-8 text-xs bg-white",placeholder:"HH:MM"})]}),e.jsxs("div",{children:[e.jsx(n,{className:"text-[11px] text-gray-700",children:"No. Polisi Truk"}),e.jsx(r,{value:f,onChange:t=>u(t.target.value),className:"h-8 text-xs bg-white",placeholder:"Contoh: L 1234 AB"})]}),e.jsxs("div",{children:[e.jsx(n,{className:"text-[11px] text-gray-700",children:"Tujuan"}),e.jsx(r,{value:j,onChange:t=>N(t.target.value),className:"h-8 text-xs bg-white",placeholder:"Contoh: Pelabuhan / Depo"})]}),e.jsxs("div",{children:[e.jsx(n,{className:"text-[11px] text-gray-700",children:"No. Segel"}),e.jsx(r,{value:w,onChange:t=>v(t.target.value),className:"h-8 text-xs bg-white",placeholder:"Nomor Segel"})]}),e.jsxs("div",{children:[e.jsx(n,{className:"text-[11px] text-gray-700",children:"Isi Kontainer"}),e.jsx(r,{value:y,onChange:t=>k(t.target.value),className:"h-8 text-xs bg-white",placeholder:"FULL CONT(ON-CHASIS)"})]}),e.jsxs("div",{className:"sm:col-span-2",children:[e.jsx(n,{className:"text-[11px] text-gray-700",children:"Keterangan"}),e.jsx(r,{value:S,onChange:t=>C(t.target.value),className:"h-8 text-xs bg-white",placeholder:"Catatan tambahan..."})]})]})]}),e.jsx("div",{className:"flex justify-center p-2 bg-gray-100 rounded-xl overflow-x-auto",children:e.jsxs("div",{className:"relative bg-white shadow-md border border-gray-300 p-6 w-[794px] min-w-[794px] min-h-[530px] rounded flex flex-col justify-between select-none",children:[e.jsx("div",{className:"absolute left-1.5 top-0 bottom-0 flex flex-col justify-between py-2 pointer-events-none opacity-20",children:Array.from({length:16}).map((t,a)=>e.jsx("div",{className:"w-2.5 h-2.5 rounded-full bg-gray-600"},a))}),e.jsx("div",{className:"absolute right-1.5 top-0 bottom-0 flex flex-col justify-between py-2 pointer-events-none opacity-20",children:Array.from({length:16}).map((t,a)=>e.jsx("div",{className:"w-2.5 h-2.5 rounded-full bg-gray-600"},a))}),e.jsxs("div",{ref:x,className:"w-full h-full flex flex-col justify-between px-3",children:[e.jsxs("div",{className:"header-row flex justify-between items-start mb-2",children:[e.jsxs("div",{className:"company-info flex-1 pr-4",children:[e.jsx("div",{className:"company-title font-extrabold text-[17px] tracking-wide text-gray-900 leading-tight",children:"PT. DEPO SURABAYA SEJAHTERA"}),e.jsx("div",{className:"company-address font-semibold text-[11.5px] text-gray-800 leading-snug",children:"Jl. Tanjung Sadari No. 90 (Tanjung Batu No. 1)"}),e.jsx("div",{className:"company-telp text-[11px] text-gray-800 leading-snug",children:"Telp. 031-353 9484, 031-3539485    Fax. 031-3539482"}),e.jsxs("div",{className:"customer-row mt-3 text-[12.5px] font-bold text-gray-900 leading-tight",children:["Customer : ",l.customer_name||"-",l.shipper_name&&e.jsxs("div",{className:"shipper font-semibold text-gray-800 pl-8",children:["(",l.shipper_name,")"]})]})]}),e.jsxs("div",{className:"meta-box w-[220px] border-[1.5px] border-black text-[11px]",children:[e.jsxs("div",{className:"meta-row flex border-b border-black py-0.5 items-center",children:[e.jsx("div",{className:"meta-label w-[75px] pl-2 font-semibold",children:"Tanggal"}),e.jsx("div",{className:"meta-colon w-3",children:":"}),e.jsx("div",{className:"meta-val flex-1 pr-2 font-bold",children:h||"-"})]}),e.jsxs("div",{className:"meta-row flex border-b border-black py-0.5 items-center",children:[e.jsx("div",{className:"meta-label w-[75px] pl-2 font-semibold",children:"Jam Keluar"}),e.jsx("div",{className:"meta-colon w-3",children:":"}),e.jsx("div",{className:"meta-val flex-1 pr-2 font-bold",children:b||"-"})]}),e.jsxs("div",{className:"meta-row flex border-b border-black py-0.5 items-center",children:[e.jsx("div",{className:"meta-label w-[75px] pl-2 font-semibold",children:"No. Pol"}),e.jsx("div",{className:"meta-colon w-3",children:":"}),e.jsx("div",{className:"meta-val flex-1 pr-2 font-bold",children:f||"-"})]}),e.jsxs("div",{className:"meta-row flex py-0.5 items-center",children:[e.jsx("div",{className:"meta-label w-[75px] pl-2 font-semibold",children:"Tujuan"}),e.jsx("div",{className:"meta-colon w-3",children:":"}),e.jsx("div",{className:"meta-val flex-1 pr-2 font-bold",children:j||"-"})]})]})]}),e.jsx("table",{className:"main-grid w-full border-[1.5px] border-black border-collapse mt-2",children:e.jsxs("tbody",{children:[e.jsxs("tr",{children:[e.jsxs("td",{className:"col-lbl w-[130px] border border-black p-2 font-bold text-center text-xs",children:["NO",e.jsx("br",{}),"CONTAINER"]}),e.jsx("td",{className:"col-val col-cont-num border border-black p-2 font-black text-xl text-center tracking-wider font-mono",children:l.container_number}),e.jsxs("td",{rowSpan:4,className:"col-service w-[220px] border border-black p-0 text-center align-middle bg-gray-50/20",children:[e.jsx("div",{className:"service-size text-sm font-bold py-2 border-b-[1.5px] border-black",children:z(l.size)}),e.jsx("div",{className:"service-title text-base font-black italic py-4 px-2 tracking-wide uppercase",children:l.service_type||"PEMERIKSAAN KARANTINA"})]})]}),e.jsxs("tr",{children:[e.jsx("td",{className:"col-lbl border border-black p-1.5 font-bold text-center text-xs",children:"ISI"}),e.jsx("td",{className:"col-val border border-black p-1.5 px-3 font-semibold text-xs text-center",children:y||"FULL CONT(ON-CHASIS)"})]}),e.jsxs("tr",{children:[e.jsx("td",{className:"col-lbl border border-black p-1.5 font-bold text-center text-xs",children:"NO SEGEL"}),e.jsx("td",{className:"col-val border border-black p-1.5 px-3 font-semibold text-xs text-center",children:w||"-"})]}),e.jsxs("tr",{children:[e.jsx("td",{className:"col-lbl border border-black p-1.5 font-bold text-center text-xs",children:"KETERANGAN"}),e.jsx("td",{className:"col-val border border-black p-1.5 px-3 font-semibold text-xs text-center",children:S||"-"})]})]})}),e.jsx("table",{className:"footer-grid w-full border-[1.5px] border-black border-t-0 border-collapse",children:e.jsx("tbody",{children:e.jsxs("tr",{children:[e.jsxs("td",{className:"footer-notice w-[200px] border border-black p-2 text-[10px] leading-tight text-gray-800",children:[e.jsx("strong",{children:e.jsx("u",{children:"PERHATIAN :"})})," Mohon container dicek terlebih dahulu, komplain setelah keluar depo bukan tanggung jawab kami."]}),e.jsx("td",{className:"sig-col w-[150px] border border-black text-center text-xs p-1.5 h-20 flex-col justify-between",children:e.jsx("div",{className:"font-medium",children:"Diserahkan oleh"})}),e.jsx("td",{className:"sig-col w-[150px] border border-black text-center text-xs p-1.5 h-20 flex-col justify-between",children:e.jsx("div",{className:"font-medium",children:"Sopir"})}),e.jsx("td",{className:"border border-black flex-1"})]})})})]})]})}),e.jsxs("div",{className:"flex justify-between items-center pt-2 border-t mt-2",children:[e.jsxs("div",{className:"text-xs text-gray-500",children:["Format Cetak: ",e.jsx("strong",{children:"21 cm x 14 cm (Continuous Form)"})]}),e.jsxs("div",{className:"flex gap-2",children:[e.jsx(T,{variant:"outline",size:"sm",onClick:m,children:"Tutup"}),e.jsxs(T,{size:"sm",onClick:D,className:"bg-blue-600 hover:bg-blue-700 text-white gap-1.5",children:[e.jsx(O,{className:"h-4 w-4"}),"Cetak Surat Jalan"]})]})]})]})}):null}export{Y as R,B as S};
