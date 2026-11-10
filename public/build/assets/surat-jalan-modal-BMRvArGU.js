import{r as l,j as e}from"./app-UJTBFfeA.js";import{D as ae,a as re,b as le,c as se}from"./dialog-BBUz0m3g.js";import{a as E,B as _}from"./button-D7KG41-l.js";import{I as n}from"./input-BooJv7XY.js";import{L as o}from"./label-DE3K4PeE.js";import{F as ne}from"./file-text-B6dD1-yR.js";import{P as oe}from"./printer-LcrUGPjK.js";/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const de=[["rect",{width:"18",height:"7",x:"3",y:"3",rx:"1",key:"f1a2em"}],["rect",{width:"9",height:"7",x:"3",y:"14",rx:"1",key:"jqznyg"}],["rect",{width:"5",height:"7",x:"16",y:"14",rx:"1",key:"q5h2i8"}]],ce=E("LayoutTemplate",de);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const me=[["path",{d:"M21 10.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h12.5",key:"1uzm8b"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]],pe=E("SquareCheckBig",me);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const xe=[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}]],he=E("Square",xe),C={100:{pageWidthMm:202,pageHeightMm:128,previewW:764,previewH:485,label:"100% (Rekomendasi Lebar & Tinggi 13 cm)",desc:"Lebar maksimal memenuhi continuous form dan tinggi 13 cm"},95:{pageWidthMm:195,pageHeightMm:128,previewW:738,previewH:485,label:"95%",desc:"Lebar proporsional dengan margin aman"},90:{pageWidthMm:188,pageHeightMm:128,previewW:710,previewH:485,label:"90%",desc:"Ukuran sedang"},85:{pageWidthMm:180,pageHeightMm:128,previewW:680,previewH:485,label:"85% (Kompak)",desc:"Ekstra aman dari pinggiran kertas & lipatan perforasi"}};function Ne({isOpen:R,onClose:L,data:i}){const W=l.useRef(null);function V(t){try{const r=new Date(t);if(isNaN(r.getTime()))return t;const a=String(r.getDate()).padStart(2,"0"),d=String(r.getMonth()+1).padStart(2,"0"),c=r.getFullYear();return`${a} - ${d} - ${c}`}catch{return t}}const z=t=>{if(!t)return'1 X 20"';const r=t.toLowerCase();return r.includes("45")?'1 X 45"':r.includes("40")?'1 X 40"':r.includes("20")?'1 X 20"':`1 X ${t}`},[g,P]=l.useState(""),[b,M]=l.useState(""),[v,I]=l.useState(""),[f,O]=l.useState(""),[u,$]=l.useState("-"),[w,H]=l.useState("FULL CONT(ON-CHASIS)"),[j,U]=l.useState("-"),[m,D]=l.useState(""),[N,K]=l.useState(()=>z(i==null?void 0:i.size)),[k,F]=l.useState(()=>(i==null?void 0:i.service_type)||"PLUG & MONITORING TEMPERATURE"),[x,Y]=l.useState(!1),[h,G]=l.useState("standard"),[J,q]=l.useState("100"),[A,X]=l.useState("Vessel Schedule");l.useEffect(()=>{if(i){const t=new Date,r=String(t.getDate()).padStart(2,"0"),a=String(t.getMonth()+1).padStart(2,"0"),d=t.getFullYear(),c=String(t.getHours()).padStart(2,"0"),T=String(t.getMinutes()).padStart(2,"0");P(i.date?V(i.date):`${r} - ${a} - ${d}`),M(i.exit_time||`${c}:${T}`),I(i.police_number||""),O(i.destination||""),$(i.seal_number||"-"),H(i.commodity?i.commodity.toUpperCase():"FULL CONT(ON-CHASIS)"),U(i.notes||"-"),D(i.container_number||""),K(z(i.size)),F(i.service_type||"PLUG & MONITORING TEMPERATURE")}},[i,R]);const Q=N,Z=k||(i==null?void 0:i.service_type)||"PLUG & MONITORING TEMPERATURE",y=(i==null?void 0:i.customer_name)||"-",s=(i==null?void 0:i.shipper_name)||null,S=C[J]||C[100],ee=()=>{const t=x?`<img src="${window.location.origin}/logo.png" class="depo-logo" alt="Logo" style="height: 30px; max-height: 30px; width: 36px; max-width: 36px; object-fit: contain;" />`:"",{pageWidthMm:r,pageHeightMm:a}=S;return h==="modern"?`<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Surat Jalan (Modern) - ${m||"Depo Surabaya"}</title>
    <style>
        @page {
            size: 210mm 140mm;
            margin: 0mm;
        }
        *, *::before, *::after {
            box-sizing: border-box !important;
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
            background: transparent !important;
            font-family: "Courier New", Courier, monospace !important;
            -webkit-font-smoothing: none !important;
            -moz-osx-font-smoothing: grayscale !important;
            text-rendering: geometricPrecision !important;
            color: #000000 !important;
            overflow: hidden !important;
        }
        .sj-print-wrapper {
            width: 210mm !important;
            height: 140mm !important;
            max-height: 140mm !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: flex-start !important;
            box-sizing: border-box !important;
            padding-top: 20px !important;
            padding-left: 0 !important;
            padding-right: 0 !important;
            padding-bottom: 0 !important;
            margin: 0 !important;
            background: transparent !important;
        }
        .sj-page {
            width: ${r}mm !important;
            height: ${a}mm !important;
            max-width: ${r}mm !important;
            max-height: ${a}mm !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: flex-start !important;
            overflow: hidden !important;
            page-break-before: avoid !important;
            page-break-inside: avoid !important;
            page-break-after: avoid !important;
            box-sizing: border-box !important;
            background: transparent !important;
        }
        table, tr, td, th, .page-break-avoid, .m-unified-frame, .m-row-footer {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
        }
        
        /* Modern Header */
        .m-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2.5px solid #000;
            padding-bottom: 1.5mm;
            gap: 2mm;
        }
        .m-brand {
            display: flex;
            align-items: center;
            gap: 2mm;
            min-width: 0;
            flex: 1;
        }
        .depo-logo {
            height: 30px !important;
            max-height: 30px !important;
            width: 36px !important;
            max-width: 36px !important;
            object-fit: contain !important;
            flex-shrink: 0;
            filter: grayscale(100%) contrast(150%);
        }
        .m-brand-info {
            min-width: 0;
            flex: 1;
        }
        .m-brand-title {
            font-size: 12.5pt;
            font-weight: 900;
            letter-spacing: -0.2px;
            line-height: 1.1;
            color: #000000;
            white-space: nowrap;
        }
        .m-brand-desc {
            font-size: 7.8pt;
            font-weight: 800;
            color: #000000;
            line-height: 1.2;
            margin-top: 1px;
            white-space: nowrap;
            letter-spacing: -0.25px;
        }
        .m-doc-box {
            text-align: right;
            flex-shrink: 0;
            margin-left: 2mm;
        }
        .m-doc-title {
            font-size: 16pt;
            font-weight: 900;
            letter-spacing: 1.5px;
            line-height: 1;
            color: #000000;
            white-space: nowrap;
        }

        /* Unified Master Form Frame (Mengisi 1 Halaman Penuh Secara Proporsional) */
        .m-unified-frame {
            border: 2px solid #000;
            margin-top: 2mm;
            background: #ffffff;
            display: flex;
            flex-direction: column;
            flex: 1 !important;
        }

        /* Row 1: Logistics Bar (4 Kolom Terpadu) */
        .m-row-logistics {
            display: flex;
            border-bottom: 2px solid #000;
            flex-shrink: 0;
            min-height: 12mm;
        }
        .m-col-log {
            flex: 1;
            padding: 1.5mm 2.5mm;
            border-right: 2px solid #000;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        .m-col-log:last-child {
            border-right: none;
        }
        .m-lbl {
            font-size: 8.5pt;
            font-weight: 900;
            text-transform: uppercase;
            color: #000000;
            letter-spacing: 0.3px;
            line-height: 1;
        }
        .m-val-log {
            font-size: 11pt;
            font-weight: 900;
            color: #000000;
            margin-top: 1mm;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            line-height: 1.1;
        }

        /* Row 2: Customer & Shipper Banner (2 Kolom Terpisah, Label di Atas, Nama di Bawah) */
        .m-row-party {
            display: flex;
            border-bottom: 2px solid #000;
            background: #ffffff;
            flex-shrink: 0;
            min-height: 11mm;
        }
        .m-party-col {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 1.5mm 3mm;
            box-sizing: border-box;
            min-width: 0;
        }
        .m-party-col:first-child {
            border-right: 2px solid #000;
        }
        .m-party-val {
            font-size: 10.5pt;
            font-weight: 900;
            color: #000000;
            text-transform: uppercase;
            letter-spacing: 0.1px;
            line-height: 1.2;
            word-break: break-word;
            margin-top: 0.8mm;
            text-align: left;
        }

        /* Row 3: Hero Container Box (Lapang & Menonjol) */
        .m-row-hero {
            display: flex;
            border-bottom: 2px solid #000;
            flex: 1.3;
            min-height: 22mm;
        }
        .m-hero-left {
            flex: 1;
            border-right: 2px solid #000;
            padding: 2mm 3.5mm;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        .m-hero-cont-num {
            font-size: 28pt;
            font-weight: 900;
            letter-spacing: 0.5px;
            font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
            line-height: 1.05;
            margin-top: 1mm;
            color: #000000;
        }
        .m-hero-right {
            width: 58mm;
            padding: 2mm 2mm;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            background: #ffffff;
        }
        .m-hero-size-val {
            font-size: 20pt;
            font-weight: 900;
            letter-spacing: 0.5px;
            line-height: 1.05;
            margin-top: 1mm;
            color: #000000;
        }

        /* Row 4: Subgrid Muatan & Layanan */
        .m-row-subgrid {
            display: flex;
            border-bottom: 2px solid #000;
            flex: 1.1;
            min-height: 20mm;
        }
        .m-sub-col {
            padding: 2mm 2.5mm;
            border-right: 2px solid #000;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
        }
        .m-sub-isi {
            flex: 1.6;
        }
        .m-sub-segel {
            flex: 1;
        }
        .m-sub-ket {
            flex: 1.2;
        }
        .m-sub-layanan {
            width: 58mm;
            border-right: none;
            align-items: center;
            text-align: center;
        }
        .m-sub-val-wrap {
            flex: 1;
            display: flex;
            align-items: center;
            margin-top: 1mm;
        }
        .m-sub-val {
            font-size: 11pt;
            font-weight: 900;
            color: #000000;
            line-height: 1.25;
            word-break: break-word;
        }
        .m-layanan-val {
            font-size: 12.5pt;
            font-weight: 900;
            text-transform: uppercase;
            line-height: 1.2;
            letter-spacing: 0.2px;
            color: #000000;
            text-align: center;
        }

        /* Row 5: Signatures & Disclaimer */
        .m-row-footer {
            display: flex;
            flex: 1.4;
            min-height: 28mm;
        }
        .m-footer-notice {
            width: 74mm;
            border-right: 2px solid #000;
            padding: 2mm 3mm;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            gap: 1.2mm;
            background: #ffffff;
            box-sizing: border-box;
        }
        .m-notice-title {
            font-size: 9.5pt;
            font-weight: 900;
            text-transform: uppercase;
            color: #000000;
            text-decoration: underline;
            letter-spacing: 0.2px;
            line-height: 1.15;
        }
        .m-notice-body {
            font-size: 9.5pt;
            font-weight: 900;
            line-height: 1.25;
            color: #000000;
            margin-top: 0.5mm;
        }
        .m-sig-col {
            flex: 1;
            border-right: 2px solid #000;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 2mm 1.5mm 1.5mm 1.5mm;
            text-align: center;
            background: #ffffff;
            box-sizing: border-box;
        }
        .m-sig-col:last-child {
            border-right: none;
        }
        .m-sig-role {
            font-size: 8.5pt;
            font-weight: 900;
            text-transform: uppercase;
            color: #000000;
            letter-spacing: 0.2px;
        }
        .m-sig-line {
            border-bottom: 2px dotted #000;
            margin: 0 2mm 1mm 2mm;
        }
    </style>
</head>
<body>
    <div class="sj-print-wrapper">
        <div class="sj-page">
            <!-- Modern Header -->
            <div class="m-header">
                <div class="m-brand">
                    ${t}
                    <div class="m-brand-info">
                        <div class="m-brand-title">PT. DEPO SURABAYA SEJAHTERA</div>
                        <div class="m-brand-desc">Jl. Tanjung Sadari No. 90 (Tanjung Batu No. 1) &bull; Telp. 031-353 9484 / 3539485 &bull; Fax. 031-3539482</div>
                    </div>
                </div>
                <div class="m-doc-box">
                    <div class="m-doc-title">SURAT JALAN</div>
                </div>
            </div>

            <!-- Unified Master Form Frame (Rapat, Kokoh, Tanpa Celah Kosong) -->
            <div class="m-unified-frame">
                <!-- Row 1: Logistics Bar (4 Kolom Terpadu) -->
                <div class="m-row-logistics">
                    <div class="m-col-log">
                        <div class="m-lbl">TANGGAL</div>
                        <div class="m-val-log">${g||"-"}</div>
                    </div>
                    <div class="m-col-log">
                        <div class="m-lbl">JAM KELUAR</div>
                        <div class="m-val-log">${b||"-"}</div>
                    </div>
                    <div class="m-col-log">
                        <div class="m-lbl">NO. POLISI</div>
                        <div class="m-val-log">${v||"-"}</div>
                    </div>
                    <div class="m-col-log">
                        <div class="m-lbl">TUJUAN</div>
                        <div class="m-val-log">${f||"-"}</div>
                    </div>
                </div>

                <!-- Row 2: Customer & Shipper Banner (2 Kolom, Label di Atas) -->
                <div class="m-row-party">
                    <div class="m-party-col">
                        <div class="m-lbl">CUSTOMER</div>
                        <div class="m-party-val">${y}</div>
                    </div>
                    <div class="m-party-col">
                        <div class="m-lbl">SHIPPER</div>
                        <div class="m-party-val">${s?s.startsWith("(")?s:`(${s})`:"-"}</div>
                    </div>
                </div>

                <!-- Row 3: Hero Container Box -->
                <div class="m-row-hero">
                    <div class="m-hero-left">
                        <div class="m-lbl">NO. CONTAINER</div>
                        <div class="m-hero-cont-num">${m||"-"}</div>
                    </div>
                    <div class="m-hero-right">
                        <div class="m-lbl">JUMLAH / UKURAN</div>
                        <div class="m-hero-size-val">${N}</div>
                    </div>
                </div>

                <!-- Row 4: Subgrid Muatan & Layanan -->
                <div class="m-row-subgrid">
                    <div class="m-sub-col m-sub-isi">
                        <div class="m-lbl">ISI KONTAINER</div>
                        <div class="m-sub-val-wrap">
                            <div class="m-sub-val">${w||"FULL CONT(ON-CHASIS)"}</div>
                        </div>
                    </div>
                    <div class="m-sub-col m-sub-segel">
                        <div class="m-lbl">NO. SEGEL</div>
                        <div class="m-sub-val-wrap">
                            <div class="m-sub-val">${u||"-"}</div>
                        </div>
                    </div>
                    <div class="m-sub-col m-sub-ket">
                        <div class="m-lbl">KETERANGAN</div>
                        <div class="m-sub-val-wrap">
                            <div class="m-sub-val">${j||"-"}</div>
                        </div>
                    </div>
                    <div class="m-sub-col m-sub-layanan">
                        <div class="m-lbl">NAMA PRODUK / LAYANAN</div>
                        <div class="m-sub-val-wrap" style="justify-content: center;">
                            <div class="m-layanan-val">${k}</div>
                        </div>
                    </div>
                </div>

                <!-- Row 5: Signatures & Disclaimer -->
                <div class="m-row-footer">
                    <div class="m-footer-notice">
                        <div class="m-notice-title">PERHATIAN PENTING :</div>
                        <div class="m-notice-body">Mohon kondisi container dan segel dicek terlebih dahulu sebelum meninggalkan area depo. Segala bentuk komplain setelah keluar depo di luar tanggung jawab kami.</div>
                    </div>
                    <div class="m-sig-col">
                        <div class="m-sig-role">DISERAHKAN OLEH</div>
                        <div class="m-sig-line"></div>
                    </div>
                    <div class="m-sig-col">
                        <div class="m-sig-role">SOPIR TRUK</div>
                        <div class="m-sig-line"></div>
                    </div>
                    <div class="m-sig-col">
                        <div class="m-sig-role">PENERIMA BARANG / DEPO</div>
                        <div class="m-sig-line"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>`:`<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Surat Jalan (Versi 2) - ${m||"Depo Surabaya"}</title>
    <style>
        @page {
            size: 210mm 140mm;
            margin: 0mm;
        }
        *, *::before, *::after {
            box-sizing: border-box !important;
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
            background: transparent !important;
            font-family: "Courier New", Courier, monospace !important;
            -webkit-font-smoothing: none !important;
            -moz-osx-font-smoothing: grayscale !important;
            text-rendering: geometricPrecision !important;
            color: #000000 !important;
            overflow: hidden !important;
        }
        .sj-print-wrapper {
            width: 210mm !important;
            height: 140mm !important;
            max-height: 140mm !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: flex-start !important;
            box-sizing: border-box !important;
            padding-top: 5mm !important;
            padding-left: 0 !important;
            padding-right: 0 !important;
            padding-bottom: 0 !important;
            margin: 0 !important;
            background: transparent !important;
        }
        .sj-page {
            width: ${r}mm !important;
            max-width: ${r}mm !important;
            height: 128mm !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
            overflow: hidden !important;
            page-break-before: avoid !important;
            page-break-inside: avoid !important;
            page-break-after: avoid !important;
            box-sizing: border-box !important;
            background: transparent !important;
        }

        /* V2 Excel Master Frame (1 Kotak Utuh Mengelilingi Keseluruhan Tinggi ~128mm / 13 cm) */
        .v2-master-frame {
            width: 100%;
            height: 128mm !important;
            border: 1px solid #000000 !important;
            box-sizing: border-box !important;
            background: transparent !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
            page-break-inside: avoid !important;
        }
        .v2-top-header {
            display: flex;
            justify-content: space-between;
            align-items: stretch;
            height: 32mm !important;
            border-bottom: 1px solid #000000 !important;
            background: transparent !important;
            box-sizing: border-box !important;
        }
        .v2-company-box {
            flex: 1;
            padding: 2mm 3mm;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            min-width: 0;
            background: transparent !important;
        }
        .v2-company-name {
            font-size: 14.5pt;
            font-weight: bold;
            line-height: 1.15;
            color: #000000 !important;
            white-space: nowrap;
            letter-spacing: 0px;
        }
        .v2-company-addr {
            font-size: 9.5pt;
            font-weight: bold;
            line-height: 1.25;
            color: #000000 !important;
            margin-top: 0.8mm;
            white-space: nowrap;
        }
        .v2-company-telp {
            font-size: 9pt;
            font-weight: bold;
            line-height: 1.2;
            color: #000000 !important;
            white-space: nowrap;
        }
        .v2-customer-line {
            margin-top: 2.5mm;
            font-size: 11pt;
            font-weight: bold;
            color: #000000 !important;
            line-height: 1.2;
            text-transform: uppercase;
            word-break: break-word;
        }
        .v2-shipper-line {
            font-size: 10pt;
            font-weight: bold;
            color: #000000 !important;
            line-height: 1.2;
            text-transform: uppercase;
            word-break: break-word;
            padding-left: 24mm;
        }
        .v2-meta-table {
            width: 65mm;
            height: 32mm !important;
            border-left: 1px solid #000000 !important;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            background: transparent !important;
            box-sizing: border-box !important;
        }
        .v2-meta-row {
            display: flex;
            align-items: center;
            border-bottom: 1px solid #000000 !important;
            height: 8mm !important;
            font-size: 9.5pt;
            font-weight: bold;
            color: #000000 !important;
            box-sizing: border-box !important;
        }
        .v2-meta-row:last-child {
            border-bottom: none !important;
        }
        .v2-meta-lbl {
            width: 24mm;
            padding-left: 2mm;
            color: #000000 !important;
            white-space: nowrap;
        }
        .v2-meta-sep {
            width: 3mm;
            text-align: center;
            color: #000000 !important;
        }
        .v2-meta-val {
            flex: 1;
            padding-right: 2mm;
            color: #000000 !important;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        /* V2 Main Grid Table (~51mm) */
        table.v2-grid {
            width: 100%;
            height: 51mm !important;
            border-collapse: collapse !important;
            border: none !important;
            background: transparent !important;
            page-break-inside: avoid !important;
            box-sizing: border-box !important;
        }
        table.v2-grid tr {
            page-break-inside: avoid !important;
        }
        table.v2-grid td {
            border: 1px solid #000000 !important;
            color: #000000 !important;
            background: transparent !important;
            box-sizing: border-box !important;
        }
        .v2-lbl-col {
            width: 32mm;
            font-size: 9.5pt;
            font-weight: bold;
            text-align: center;
            line-height: 1.2;
            vertical-align: middle;
            color: #000000 !important;
        }
        .v2-cont-num {
            height: 13.5mm;
            font-size: 14.5pt;
            font-weight: bold;
            letter-spacing: 1px;
            text-align: center;
            vertical-align: middle;
            color: #000000 !important;
        }
        .v2-size-col {
            width: 52mm;
            height: 13.5mm;
            font-size: 12pt;
            font-weight: bold;
            text-align: center;
            vertical-align: middle;
            border-bottom: 1px solid #000000 !important;
            color: #000000 !important;
        }
        .v2-val-row {
            height: 12.5mm;
            font-size: 10.5pt;
            font-weight: bold;
            text-align: center;
            vertical-align: middle;
            padding: 0 2mm;
            color: #000000 !important;
        }
        .v2-service-col {
            width: 52mm;
            height: 37.5mm;
            text-align: center;
            vertical-align: middle;
            padding: 2mm 1mm;
            font-size: 15pt;
            font-weight: bold;
            font-style: italic;
            text-transform: uppercase;
            line-height: 1.2;
            color: #000000 !important;
        }

        /* V2 Footer Table (~45mm - Ruang TTD Luas & Proporsional) */
        table.v2-footer {
            width: 100%;
            height: 45mm !important;
            border-collapse: collapse !important;
            border: none !important;
            border-top: 1px solid #000000 !important;
            background: transparent !important;
            page-break-inside: avoid !important;
            box-sizing: border-box !important;
        }
        table.v2-footer tr {
            page-break-inside: avoid !important;
        }
        table.v2-footer td {
            border: 1px solid #000000 !important;
            border-top: none !important;
            color: #000000 !important;
            background: transparent !important;
            vertical-align: top;
            box-sizing: border-box !important;
        }
        .v2-notice-col {
            width: 58mm;
            padding: 2.5mm 3mm;
            font-size: 9pt;
            font-weight: bold;
            line-height: 1.35;
            color: #000000 !important;
        }
        .v2-notice-col u {
            font-weight: bold;
        }
        .v2-sig-col {
            width: 34mm;
            text-align: center;
            padding-top: 2mm;
            font-size: 9.5pt;
            font-weight: bold;
            color: #000000 !important;
        }
        .v2-sig-last {
            text-align: center;
            padding-top: 2mm;
            font-size: 9.5pt;
            font-weight: bold;
            color: #000000 !important;
        }
    </style>
</head>
<body>
    <div class="sj-print-wrapper">
        <div class="sj-page">
            <div class="v2-master-frame">
                <!-- Header Section -->
                <div class="v2-top-header">
                    <div class="v2-company-box">
                        <div style="display: flex; align-items: flex-start;">
                            ${t}
                            <div>
                                <div class="v2-company-name">PT. DEPO SURABAYA SEJAHTERA</div>
                                <div class="v2-company-addr">Jl. Tanjung Sadari No. 90 (Tanjung Batu No. 1)</div>
                                <div class="v2-company-telp">Telp. 031-353 9484, 031-3539485 &nbsp; Fax. 031-3539482</div>
                            </div>
                        </div>
                        <div class="v2-customer-line">
                            Customer : ${y}
                        </div>
                        ${s?`
                        <div class="v2-shipper-line">
                            (${s})
                        </div>`:""}
                    </div>
                    <div class="v2-meta-table">
                        <div class="v2-meta-row">
                            <div class="v2-meta-lbl">Tanggal</div>
                            <div class="v2-meta-sep">:</div>
                            <div class="v2-meta-val">${g||"-"}</div>
                        </div>
                        <div class="v2-meta-row">
                            <div class="v2-meta-lbl">Jam Keluar</div>
                            <div class="v2-meta-sep">:</div>
                            <div class="v2-meta-val">${b||"-"}</div>
                        </div>
                        <div class="v2-meta-row">
                            <div class="v2-meta-lbl">No. Pol</div>
                            <div class="v2-meta-sep">:</div>
                            <div class="v2-meta-val">${v||"-"}</div>
                        </div>
                        <div class="v2-meta-row">
                            <div class="v2-meta-lbl">Tujuan</div>
                            <div class="v2-meta-sep">:</div>
                            <div class="v2-meta-val">${f||"-"}</div>
                        </div>
                    </div>
                </div>

                <!-- Main Table Grid -->
                <table class="v2-grid">
                    <tbody>
                        <tr>
                            <td class="v2-lbl-col">NO<br>CONTAINER</td>
                            <td class="v2-cont-num">${m||"-"}</td>
                            <td class="v2-size-col">${Q}</td>
                        </tr>
                        <tr>
                            <td class="v2-lbl-col">ISI</td>
                            <td class="v2-val-row">${w||"FULL CONT(ON-CHASIS)"}</td>
                            <td rowspan="3" class="v2-service-col">${Z}</td>
                        </tr>
                        <tr>
                            <td class="v2-lbl-col">NO SEGEL</td>
                            <td class="v2-val-row">${u||"-"}</td>
                        </tr>
                        <tr>
                            <td class="v2-lbl-col">KETERANGAN</td>
                            <td class="v2-val-row">${j||"-"}</td>
                        </tr>
                    </tbody>
                </table>

                <!-- Footer Signatures Grid -->
                <table class="v2-footer">
                    <tbody>
                        <tr>
                            <td class="v2-notice-col">
                                <u>PERHATIAN :</u> Mohon container dicek terlebih dahulu, komplain setelah keluar depo bukan tanggung jawab kami.
                            </td>
                            <td class="v2-sig-col">
                                Diserahkan Oleh
                            </td>
                            <td class="v2-sig-col">
                                Sopir
                            </td>
                            <td class="v2-sig-last">
                                ${A||"Vessel Schedule"}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</body>
</html>`},te=()=>{var T;const t=ee(),r=document.getElementById("sj-print-iframe");r&&r.remove();const a=document.createElement("iframe");a.id="sj-print-iframe",a.style.position="fixed",a.style.right="0",a.style.bottom="0",a.style.width="0",a.style.height="0",a.style.border="0",a.style.visibility="hidden",document.body.appendChild(a);const d=((T=a.contentWindow)==null?void 0:T.document)||a.contentDocument;if(!d){alert("Gagal menyiapkan pencetakan. Silakan coba lagi.");return}d.open(),d.write(t),d.close();const c=()=>{setTimeout(()=>{var p,B;try{(p=a.contentWindow)==null||p.focus(),(B=a.contentWindow)==null||B.print()}catch(ie){console.error("Print error:",ie)}finally{setTimeout(()=>{document.body.contains(a)&&a.remove()},1e3)}},250)};if(x){const p=d.querySelector("img");p&&!p.complete?(p.onload=c,p.onerror=c):c()}else c()};return i?e.jsx(ae,{open:R,onOpenChange:L,children:e.jsxs(re,{className:"w-full sm:max-w-5xl lg:max-w-6xl max-h-[96vh] overflow-y-auto p-4 sm:p-6",children:[e.jsx("style",{dangerouslySetInnerHTML:{__html:`
                    @media print {
                        @page {
                            size: 210mm 140mm;
                            margin: 0mm;
                        }
                        *, *::before, *::after {
                            -webkit-print-color-adjust: exact !important;
                            print-color-adjust: exact !important;
                        }
                        body > *:not([data-radix-portal]),
                        nav, aside, header, footer,
                        .sj-ui-header,
                        .sj-ui-toolbar,
                        .sj-ui-controls,
                        .sj-ui-footer,
                        .sj-sprocket-holes,
                        .sj-perforation-line,
                        [data-radix-dialog-overlay],
                        button {
                            display: none !important;
                        }
                        html, body {
                            width: 210mm !important;
                            height: 140mm !important;
                            margin: 0 !important;
                            padding: 0 !important;
                            background: transparent !important;
                            overflow: hidden !important;
                            font-family: "Courier New", Courier, monospace !important;
                            -webkit-font-smoothing: none !important;
                            -moz-osx-font-smoothing: grayscale !important;
                            text-rendering: geometricPrecision !important;
                            color: #000000 !important;
                        }
                        .sj-printable-paper {
                            position: fixed !important;
                            left: 0 !important;
                            top: 0 !important;
                            width: 210mm !important;
                            height: 140mm !important;
                            margin: 0 !important;
                            padding-top: 15px !important;
                            box-shadow: none !important;
                            border: none !important;
                            background: transparent !important;
                            z-index: 999999 !important;
                        }
                        table, tr, td, th {
                            page-break-inside: avoid !important;
                            break-inside: avoid !important;
                        }
                    }
                `}}),e.jsx(le,{className:"border-b pb-3 sj-ui-header",children:e.jsx(se,{className:"text-lg font-bold flex items-center justify-between",children:e.jsx("span",{children:"Cetak Surat Jalan (Ukuran Media: 21 x 14 cm)"})})}),e.jsxs("div",{className:"bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs space-y-2.5 sj-ui-controls",children:[e.jsxs("div",{className:"flex flex-wrap items-center justify-between gap-2",children:[e.jsxs("div",{className:"flex items-center gap-1.5 bg-white border border-slate-300 rounded-lg p-0.5 sj-ui-toolbar",children:[e.jsxs("button",{type:"button",onClick:()=>G("standard"),className:`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition cursor-pointer ${h==="standard"?"bg-blue-600 text-white shadow-xs":"text-slate-600 hover:text-slate-900 hover:bg-slate-100"}`,children:[e.jsx(ne,{className:"h-3.5 w-3.5"}),"Versi 2 (Format Excel / Continuous)"]}),e.jsxs("button",{type:"button",onClick:()=>G("modern"),className:`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition cursor-pointer ${h==="modern"?"bg-blue-600 text-white shadow-xs":"text-slate-600 hover:text-slate-900 hover:bg-slate-100"}`,children:[e.jsx(ce,{className:"h-3.5 w-3.5"}),"Versi 1 (Modern Industrial)"]})]}),e.jsxs("div",{className:"flex items-center gap-1 bg-white border border-slate-300 rounded-lg p-0.5",children:[e.jsx("span",{className:"text-[11px] font-semibold text-slate-500 pl-2 pr-1",children:"Skala Cetak:"}),["100","95","90","85"].map(t=>{const r=C[t];return e.jsx("button",{type:"button",onClick:()=>q(t),className:`px-2 py-0.5 rounded text-[11px] font-bold transition cursor-pointer ${J===t?"bg-indigo-600 text-white shadow-xs":"text-slate-600 hover:text-slate-900 hover:bg-slate-100"}`,title:r.desc,children:t==="100"?"100% (Lebar Maksimal)":`${t}%`},t)})]}),e.jsxs("button",{type:"button",onClick:()=>Y(!x),className:"inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold cursor-pointer transition",children:[x?e.jsx(pe,{className:"h-3.5 w-3.5 text-blue-600"}):e.jsx(he,{className:"h-3.5 w-3.5 text-slate-400"}),"Sertakan Logo Perusahaan"]})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsxs("div",{className:"grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2",children:[e.jsxs("div",{children:[e.jsx(o,{className:"text-[11px] text-gray-700",children:"Tanggal"}),e.jsx(n,{value:g,onChange:t=>P(t.target.value),className:"h-8 text-xs bg-white",placeholder:"DD - MM - YYYY"})]}),e.jsxs("div",{children:[e.jsx(o,{className:"text-[11px] text-gray-700",children:"Jam Keluar"}),e.jsx(n,{value:b,onChange:t=>M(t.target.value),className:"h-8 text-xs bg-white",placeholder:"HH:MM"})]}),e.jsxs("div",{children:[e.jsx(o,{className:"text-[11px] text-gray-700",children:"No. Polisi"}),e.jsx(n,{value:v,onChange:t=>I(t.target.value),className:"h-8 text-xs bg-white",placeholder:"Contoh: L 1234 AB"})]}),e.jsxs("div",{children:[e.jsx(o,{className:"text-[11px] text-gray-700",children:"Tujuan"}),e.jsx(n,{value:f,onChange:t=>O(t.target.value),className:"h-8 text-xs bg-white",placeholder:"Contoh: Pelabuhan"})]}),e.jsxs("div",{children:[e.jsx(o,{className:"text-[11px] text-gray-700",children:"No. Container"}),e.jsx(n,{value:m,onChange:t=>D(t.target.value),className:"h-8 text-xs bg-white font-bold",placeholder:"Nomor Container"})]}),e.jsxs("div",{children:[e.jsx(o,{className:"text-[11px] text-gray-700",children:"Jumlah / Ukuran"}),e.jsx(n,{value:N,onChange:t=>K(t.target.value),className:"h-8 text-xs bg-white font-bold",placeholder:'1 X 20"'})]})]}),e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2",children:[e.jsxs("div",{children:[e.jsx(o,{className:"text-[11px] text-gray-700 font-semibold",children:"Nama Produk / Layanan"}),e.jsx(n,{value:k,onChange:t=>F(t.target.value),className:"h-8 text-xs bg-white font-bold",placeholder:"PLUG & MONITORING TEMPERATURE"})]}),e.jsxs("div",{children:[e.jsx(o,{className:"text-[11px] text-gray-700",children:"Isi Kontainer"}),e.jsx(n,{value:w,onChange:t=>H(t.target.value),className:"h-8 text-xs bg-white",placeholder:"FULL CONT(ON-CHASIS)"})]}),e.jsxs("div",{children:[e.jsx(o,{className:"text-[11px] text-gray-700",children:"No. Segel"}),e.jsx(n,{value:u,onChange:t=>$(t.target.value),className:"h-8 text-xs bg-white",placeholder:"Nomor Segel"})]}),e.jsxs("div",{children:[e.jsx(o,{className:"text-[11px] text-gray-700",children:"Keterangan / Catatan"}),e.jsx(n,{value:j,onChange:t=>U(t.target.value),className:"h-8 text-xs bg-white",placeholder:"Catatan tambahan..."})]}),e.jsxs("div",{children:[e.jsx(o,{className:"text-[11px] text-gray-700 font-semibold",children:"Kolom TTD 4 (Penerima)"}),e.jsx(n,{value:A,onChange:t=>X(t.target.value),className:"h-8 text-xs bg-white font-medium",placeholder:"Vessel Schedule / Penerima"})]})]})]})]}),e.jsx("div",{className:"flex flex-col items-center p-3 bg-slate-200/70 rounded-xl overflow-x-auto space-y-2 sj-preview-container",children:e.jsx("div",{ref:W,id:"sj-print-paper-root",className:"relative bg-white shadow-md border border-slate-300 w-[794px] min-w-[794px] h-[529px] min-h-[529px] rounded-lg flex flex-col items-center justify-start pt-[18px] select-none sj-printable-paper",style:{fontFamily:h==="standard"?'"Courier New", Courier, monospace':'Arial, "Helvetica Neue", Helvetica, sans-serif'},children:e.jsx("div",{className:"flex flex-col justify-between",style:{width:`${S.previewW}px`,height:`${S.previewH}px`,transition:"all 0.15s ease"},children:h==="modern"?e.jsxs("div",{className:"w-full h-full flex flex-col justify-start",children:[e.jsxs("div",{className:"flex justify-between items-center border-b-2 border-black pb-1.5 gap-2",children:[e.jsxs("div",{className:"flex items-center gap-2 min-w-0 flex-1",children:[x&&e.jsx("img",{src:"/logo.png",alt:"Logo Depo",className:"h-7 w-auto max-w-[36px] object-contain filter grayscale contrast-150 shrink-0",style:{maxHeight:"30px",maxWidth:"36px"}}),e.jsxs("div",{className:"min-w-0 flex-1",children:[e.jsx("div",{className:"font-black text-[13.5px] tracking-tight text-black leading-tight whitespace-nowrap",children:"PT. DEPO SURABAYA SEJAHTERA"}),e.jsx("div",{className:"text-[10px] sm:text-[10.5px] font-bold text-black leading-tight mt-0.5 whitespace-nowrap tracking-tight",children:"Jl. Tanjung Sadari No. 90 (Tanjung Batu No. 1) • Telp. 031-353 9484 / 3539485 • Fax. 031-3539482"})]})]}),e.jsx("div",{className:"text-right shrink-0 ml-2",children:e.jsx("div",{className:"font-black text-lg sm:text-xl tracking-[1.5px] text-black leading-none whitespace-nowrap",children:"SURAT JALAN"})})]}),e.jsxs("div",{className:"border-2 border-black bg-white flex flex-col mt-2 flex-1",children:[e.jsxs("div",{className:"shrink-0 grid grid-cols-4 border-b-2 border-black divide-x-2 divide-black min-h-[46px]",children:[e.jsxs("div",{className:"p-1.5 flex flex-col justify-center",children:[e.jsx("div",{className:"text-[10.5px] uppercase font-black text-black tracking-wide leading-tight",children:"TANGGAL"}),e.jsx("div",{className:"text-[13px] font-black text-black truncate mt-0.5",children:g||"-"})]}),e.jsxs("div",{className:"p-1.5 flex flex-col justify-center",children:[e.jsx("div",{className:"text-[10.5px] uppercase font-black text-black tracking-wide leading-tight",children:"JAM KELUAR"}),e.jsx("div",{className:"text-[13px] font-black text-black truncate mt-0.5",children:b||"-"})]}),e.jsxs("div",{className:"p-1.5 flex flex-col justify-center",children:[e.jsx("div",{className:"text-[10.5px] uppercase font-black text-black tracking-wide leading-tight",children:"NO. POLISI"}),e.jsx("div",{className:"text-[13px] font-black text-black truncate mt-0.5",children:v||"-"})]}),e.jsxs("div",{className:"p-1.5 flex flex-col justify-center",children:[e.jsx("div",{className:"text-[10.5px] uppercase font-black text-black tracking-wide leading-tight",children:"TUJUAN"}),e.jsx("div",{className:"text-[13px] font-black text-black truncate mt-0.5",children:f||"-"})]})]}),e.jsxs("div",{className:"shrink-0 border-b-2 border-black grid grid-cols-2 divide-x-2 divide-black bg-white min-h-[44px]",children:[e.jsxs("div",{className:"px-3 py-1.5 flex flex-col justify-center min-w-0",children:[e.jsx("div",{className:"text-[10px] uppercase font-black text-black tracking-wide leading-tight",children:"CUSTOMER"}),e.jsx("div",{className:"text-[12px] font-black text-black uppercase tracking-tight leading-tight break-words mt-0.5 text-left",children:y})]}),e.jsxs("div",{className:"px-3 py-1.5 flex flex-col justify-center min-w-0",children:[e.jsx("div",{className:"text-[10px] uppercase font-black text-black tracking-wide leading-tight",children:"SHIPPER"}),e.jsx("div",{className:"text-[12px] font-black text-black uppercase tracking-tight leading-tight break-words mt-0.5 text-left",children:s?s.startsWith("(")?s:`(${s})`:"-"})]})]}),e.jsxs("div",{className:"flex-[1.3] min-h-[75px] border-b-2 border-black flex",children:[e.jsxs("div",{className:"flex-1 border-r-2 border-black p-2 flex flex-col justify-center",children:[e.jsx("div",{className:"text-[10.5px] uppercase font-black text-black tracking-wide leading-tight",children:"NO. CONTAINER"}),e.jsx("div",{className:"text-2xl sm:text-3xl font-black tracking-wider text-black mt-0.5 leading-none",children:m||"-"})]}),e.jsxs("div",{className:"w-[200px] sm:w-[220px] p-2 flex flex-col justify-center items-center text-center bg-white",children:[e.jsx("div",{className:"text-[10.5px] uppercase font-black text-black tracking-wide leading-tight",children:"JUMLAH / UKURAN"}),e.jsx("div",{className:"text-xl sm:text-2xl font-black text-black mt-0.5 leading-none",children:N})]})]}),e.jsxs("div",{className:"flex-[1.1] min-h-[70px] border-b-2 border-black flex",children:[e.jsxs("div",{className:"flex-1 border-r-2 border-black grid grid-cols-12 divide-x-2 divide-black bg-white",children:[e.jsxs("div",{className:"col-span-5 px-2 pt-1 pb-1.5 flex flex-col justify-between",children:[e.jsx("div",{className:"text-[10.5px] uppercase font-black text-black tracking-wide leading-tight",children:"ISI KONTAINER"}),e.jsx("div",{className:"flex-1 flex items-center",children:e.jsx("div",{className:"text-[11.5px] font-black text-black break-words whitespace-normal leading-tight",children:w||"FULL CONT(ON-CHASIS)"})})]}),e.jsxs("div",{className:"col-span-3 px-2 pt-1 pb-1.5 flex flex-col justify-between",children:[e.jsx("div",{className:"text-[10.5px] uppercase font-black text-black tracking-wide leading-tight",children:"NO. SEGEL"}),e.jsx("div",{className:"flex-1 flex items-center",children:e.jsx("div",{className:"text-[11.5px] font-black text-black break-words",children:u||"-"})})]}),e.jsxs("div",{className:"col-span-4 px-2 pt-1 pb-1.5 flex flex-col justify-between",children:[e.jsx("div",{className:"text-[10.5px] uppercase font-black text-black tracking-wide leading-tight",children:"KETERANGAN"}),e.jsx("div",{className:"flex-1 flex items-center",children:e.jsx("div",{className:"text-[11.5px] font-black text-black break-words",children:j||"-"})})]})]}),e.jsxs("div",{className:"w-[200px] sm:w-[220px] px-2 pt-1 pb-1.5 flex flex-col items-center text-center bg-white justify-between",children:[e.jsx("div",{className:"text-[10.5px] uppercase font-black text-black tracking-wide leading-tight",children:"NAMA PRODUK / LAYANAN"}),e.jsx("div",{className:"flex-1 flex items-center justify-center",children:e.jsx("div",{className:"text-xs sm:text-sm font-black uppercase tracking-tight leading-tight text-black",children:k})})]})]}),e.jsxs("div",{className:"flex-[1.4] min-h-[95px] flex items-stretch divide-x-2 divide-black",children:[e.jsxs("div",{className:"w-[300px] sm:w-[325px] p-2 bg-white flex flex-col justify-start gap-1",children:[e.jsx("div",{className:"text-[10.5px] font-black uppercase text-black underline tracking-wide leading-tight",children:"PERHATIAN PENTING :"}),e.jsx("div",{className:"text-[11px] font-black text-black leading-snug mt-0.5",children:"Mohon kondisi container dan segel dicek terlebih dahulu sebelum meninggalkan area depo. Segala bentuk komplain setelah keluar depo di luar tanggung jawab kami."})]}),e.jsxs("div",{className:"flex-1 p-1.5 bg-white flex flex-col justify-between text-center",children:[e.jsx("div",{className:"text-[10px] font-black uppercase text-black",children:"DISERAHKAN OLEH"}),e.jsx("div",{className:"border-b-2 border-dotted border-black mx-2 mb-0.5"})]}),e.jsxs("div",{className:"flex-1 p-1.5 bg-white flex flex-col justify-between text-center",children:[e.jsx("div",{className:"text-[10px] font-black uppercase text-black",children:"SOPIR TRUK"}),e.jsx("div",{className:"border-b-2 border-dotted border-black mx-2 mb-0.5"})]}),e.jsxs("div",{className:"flex-1 p-1.5 bg-white flex flex-col justify-between text-center",children:[e.jsx("div",{className:"text-[10px] font-black uppercase text-black",children:"PENERIMA BARANG / DEPO"}),e.jsx("div",{className:"border-b-2 border-dotted border-black mx-2 mb-0.5"})]})]})]})]}):e.jsx("div",{className:"w-full h-full flex flex-col justify-between select-none",style:{fontFamily:'"Courier New", Courier, monospace'},children:e.jsxs("div",{className:"w-full h-full border border-black bg-white flex flex-col justify-between",children:[e.jsxs("div",{className:"flex justify-between items-stretch border-b border-black h-[120px] shrink-0",children:[e.jsxs("div",{className:"flex-1 p-2.5 flex flex-col justify-between min-w-0",children:[e.jsxs("div",{className:"flex items-start",children:[x&&e.jsx("img",{src:"/logo.png",alt:"Logo Depo",className:"h-8 w-auto max-w-[38px] object-contain filter grayscale contrast-150 shrink-0 mr-2",style:{maxHeight:"32px",maxWidth:"38px"}}),e.jsxs("div",{className:"min-w-0",children:[e.jsx("div",{className:"font-bold text-[18px] tracking-normal text-black leading-tight whitespace-nowrap",children:"PT. DEPO SURABAYA SEJAHTERA"}),e.jsx("div",{className:"font-bold text-[11px] text-black leading-tight mt-1 whitespace-nowrap",children:"Jl. Tanjung Sadari No. 90 (Tanjung Batu No. 1)"}),e.jsx("div",{className:"font-bold text-[10.5px] text-black leading-tight mt-0.5 whitespace-nowrap",children:"Telp. 031-353 9484, 031-3539485   Fax. 031-3539482"})]})]}),e.jsxs("div",{className:"mt-1",children:[e.jsxs("div",{className:"text-[13px] font-bold text-black leading-tight uppercase",children:["Customer : ",y]}),s&&e.jsxs("div",{className:"text-[12px] font-bold text-black leading-tight uppercase pl-24 mt-0.5",children:["(",s,")"]})]})]}),e.jsxs("div",{className:"w-[230px] sm:w-[245px] border-l border-black text-[12px] flex flex-col justify-between shrink-0",children:[e.jsxs("div",{className:"flex items-center border-b border-black h-[30px] px-2.5 font-bold",children:[e.jsx("div",{className:"w-[85px] text-black",children:"Tanggal"}),e.jsx("div",{className:"w-3 text-center text-black",children:":"}),e.jsx("div",{className:"flex-1 text-black truncate",children:g||"-"})]}),e.jsxs("div",{className:"flex items-center border-b border-black h-[30px] px-2.5 font-bold",children:[e.jsx("div",{className:"w-[85px] text-black",children:"Jam Keluar"}),e.jsx("div",{className:"w-3 text-center text-black",children:":"}),e.jsx("div",{className:"flex-1 text-black truncate",children:b||"-"})]}),e.jsxs("div",{className:"flex items-center border-b border-black h-[30px] px-2.5 font-bold",children:[e.jsx("div",{className:"w-[85px] text-black",children:"No. Pol"}),e.jsx("div",{className:"w-3 text-center text-black",children:":"}),e.jsx("div",{className:"flex-1 text-black truncate",children:v||"-"})]}),e.jsxs("div",{className:"flex items-center h-[30px] px-2.5 font-bold",children:[e.jsx("div",{className:"w-[85px] text-black",children:"Tujuan"}),e.jsx("div",{className:"w-3 text-center text-black",children:":"}),e.jsx("div",{className:"flex-1 text-black truncate",children:f||"-"})]})]})]}),e.jsx("table",{className:"w-full border-collapse border-b border-black text-black h-[195px]",children:e.jsxs("tbody",{children:[e.jsxs("tr",{className:"h-[50px]",children:[e.jsxs("td",{className:"w-[120px] sm:w-[130px] border-r border-b border-black p-1.5 font-bold text-center text-[12px] uppercase leading-tight align-middle",children:["NO",e.jsx("br",{}),"CONTAINER"]}),e.jsx("td",{className:"border-r border-b border-black p-1 font-bold text-[18px] text-center tracking-wider align-middle",children:m||"-"}),e.jsx("td",{className:"w-[190px] sm:w-[205px] border-b border-black p-1 text-center align-middle font-bold text-sm sm:text-[15px]",children:N})]}),e.jsxs("tr",{className:"h-[48px]",children:[e.jsx("td",{className:"border-r border-b border-black p-1 font-bold text-center text-[12px] uppercase align-middle",children:"ISI"}),e.jsx("td",{className:"border-r border-b border-black p-1 px-2.5 font-bold text-xs sm:text-[13px] text-center align-middle",children:w||"FULL CONT(ON-CHASIS)"}),e.jsx("td",{rowSpan:3,className:"border-black p-2 text-center align-middle",children:e.jsx("div",{className:"text-[16px] sm:text-[17px] font-bold italic uppercase tracking-wide leading-tight",children:k})})]}),e.jsxs("tr",{className:"h-[48px]",children:[e.jsx("td",{className:"border-r border-b border-black p-1 font-bold text-center text-[12px] uppercase align-middle",children:"NO SEGEL"}),e.jsx("td",{className:"border-r border-b border-black p-1 px-2.5 font-bold text-xs sm:text-[13px] text-center align-middle",children:u||"-"})]}),e.jsxs("tr",{className:"h-[48px]",children:[e.jsx("td",{className:"border-r border-black p-1 font-bold text-center text-[12px] uppercase align-middle",children:"KETERANGAN"}),e.jsx("td",{className:"border-r border-black p-1 px-2.5 font-bold text-xs sm:text-[13px] text-center align-middle",children:j||"-"})]})]})}),e.jsx("table",{className:"w-full border-collapse h-[170px] text-black",children:e.jsx("tbody",{children:e.jsxs("tr",{children:[e.jsxs("td",{className:"w-[220px] sm:w-[245px] border-r border-black p-3 text-[11px] font-bold leading-relaxed align-top",children:[e.jsx("u",{className:"font-bold",children:"PERHATIAN :"})," Mohon container dicek terlebih dahulu, komplain setelah keluar depo bukan tanggung jawab kami."]}),e.jsx("td",{className:"w-[125px] sm:w-[135px] border-r border-black text-center p-2 align-top",children:e.jsx("div",{className:"font-bold text-[12px]",children:"Diserahkan Oleh"})}),e.jsx("td",{className:"w-[125px] sm:w-[135px] border-r border-black text-center p-2 align-top",children:e.jsx("div",{className:"font-bold text-[12px]",children:"Sopir"})}),e.jsx("td",{className:"text-center p-2 align-top",children:e.jsx("div",{className:"font-bold text-[12px]",children:A||"Vessel Schedule"})})]})})})]})})})})}),e.jsxs("div",{className:"flex flex-wrap justify-between items-center pt-2 border-t mt-2 gap-2 sj-ui-footer",children:[e.jsxs("div",{className:"text-xs text-gray-600",children:["Media: ",e.jsx("strong",{children:"21 cm x 14 cm (Dot Matrix Continuous Form)"})," • Skala:"," ",e.jsx("strong",{className:"text-indigo-700",children:S.label})," • Pilihan Layout:"," ",e.jsx("strong",{children:h==="standard"?"Versi 2 (Format Excel / Continuous)":"Versi 1 (Modern Industrial)"})]}),e.jsxs("div",{className:"flex gap-2",children:[e.jsx(_,{variant:"outline",size:"sm",onClick:L,children:"Tutup"}),e.jsxs(_,{size:"sm",onClick:te,className:"bg-blue-600 hover:bg-blue-700 text-white gap-1.5 font-semibold",children:[e.jsx(oe,{className:"h-4 w-4"}),"Cetak Surat Jalan"]})]})]})]})}):null}export{Ne as S};
