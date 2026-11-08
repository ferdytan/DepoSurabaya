import{r as l,j as e}from"./app-C5VGbm9p.js";import{D as te,a as ae,b as ie,c as se}from"./dialog-DnjEv78a.js";import{a as E,B as W}from"./button-CnUvUvcq.js";import{I as n}from"./input-DOECDKop.js";import{L as o}from"./label-f8eLAqBp.js";import{F as le}from"./file-text-DHMqU4Fk.js";import{P as re}from"./printer-BATfSuGt.js";/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ne=[["rect",{width:"18",height:"7",x:"3",y:"3",rx:"1",key:"f1a2em"}],["rect",{width:"9",height:"7",x:"3",y:"14",rx:"1",key:"jqznyg"}],["rect",{width:"5",height:"7",x:"16",y:"14",rx:"1",key:"q5h2i8"}]],oe=E("LayoutTemplate",ne);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ce=[["path",{d:"M21 10.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h12.5",key:"1uzm8b"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]],de=E("SquareCheckBig",ce);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const me=[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}]],xe=E("Square",me),T={88:{pageWidthMm:184,pageHeightMm:124,previewW:696,previewH:466,label:"88% (Rekomendasi Dot Matrix)",desc:"Standar paling optimal untuk continuous form agar tidak terpotong tepi/traktor"},85:{pageWidthMm:178,pageHeightMm:120,previewW:672,previewH:450,label:"85% (Kompak)",desc:"Ekstra aman dari pinggiran kertas & lipatan perforasi"},92:{pageWidthMm:192,pageHeightMm:128,previewW:726,previewH:484,label:"92%",desc:"Sedikit lebih lebar"},100:{pageWidthMm:200,pageHeightMm:132,previewW:756,previewH:500,label:"100% (Penuh)",desc:"Ukuran media penuh tanpa pengurangan"}};function we({isOpen:R,onClose:C,data:a}){const Y=l.useRef(null);function q(t){try{const i=new Date(t);if(isNaN(i.getTime()))return t;const s=String(i.getDate()).padStart(2,"0"),c=String(i.getMonth()+1).padStart(2,"0"),d=i.getFullYear();return`${s} - ${c} - ${d}`}catch{return t}}const L=t=>{if(!t)return'1 X 20"';const i=t.toLowerCase();return i.includes("45")?'1 X 45"':i.includes("40")?'1 X 40"':i.includes("20")?'1 X 20"':`1 X ${t}`},[h,M]=l.useState(""),[b,P]=l.useState(""),[g,I]=l.useState(""),[f,O]=l.useState(""),[v,$]=l.useState("-"),[u,H]=l.useState("FULL CONT(ON-CHASIS)"),[w,z]=l.useState("-"),[m,U]=l.useState(""),[k,D]=l.useState(()=>L(a==null?void 0:a.size)),[j,K]=l.useState(()=>(a==null?void 0:a.service_type)||"PLUG & MONITORING TEMPERATURE"),[p,X]=l.useState(!1),[N,B]=l.useState("modern"),[G,V]=l.useState("88");l.useEffect(()=>{if(a){const t=new Date,i=String(t.getDate()).padStart(2,"0"),s=String(t.getMonth()+1).padStart(2,"0"),c=t.getFullYear(),d=String(t.getHours()).padStart(2,"0"),A=String(t.getMinutes()).padStart(2,"0");M(a.date?q(a.date):`${i} - ${s} - ${c}`),P(a.exit_time||`${d}:${A}`),I(a.police_number||""),O(a.destination||""),$(a.seal_number||"-"),H(a.commodity?a.commodity.toUpperCase():"FULL CONT(ON-CHASIS)"),z(a.notes||"-"),U(a.container_number||""),D(L(a.size)),K(a.service_type||"PLUG & MONITORING TEMPERATURE")}},[a,R]);const J=k,F=j||(a==null?void 0:a.service_type)||"PLUG & MONITORING TEMPERATURE",y=(a==null?void 0:a.customer_name)||"-",r=(a==null?void 0:a.shipper_name)||null,S=T[G]||T[88],Q=()=>{const t=p?`<img src="${window.location.origin}/logo.png" class="depo-logo" alt="Logo" style="height: 30px; max-height: 30px; width: 36px; max-width: 36px; object-fit: contain;" />`:"",{pageWidthMm:i,pageHeightMm:s}=S;return N==="modern"?`<!DOCTYPE html>
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
        .sj-print-wrapper {
            width: 210mm !important;
            height: 140mm !important;
            max-height: 140mm !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            box-sizing: border-box !important;
            padding: 0 !important;
            margin: 0 !important;
        }
        .sj-page {
            width: ${i}mm !important;
            height: ${s}mm !important;
            max-width: ${i}mm !important;
            max-height: ${s}mm !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: flex-start !important;
            overflow: hidden !important;
            page-break-before: avoid !important;
            page-break-inside: avoid !important;
            page-break-after: avoid !important;
            box-sizing: border-box !important;
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
                        <div class="m-val-log">${h||"-"}</div>
                    </div>
                    <div class="m-col-log">
                        <div class="m-lbl">JAM KELUAR</div>
                        <div class="m-val-log">${b||"-"}</div>
                    </div>
                    <div class="m-col-log">
                        <div class="m-lbl">NO. POLISI</div>
                        <div class="m-val-log">${g||"-"}</div>
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
                        <div class="m-party-val">${r?r.startsWith("(")?r:`(${r})`:"-"}</div>
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
                        <div class="m-hero-size-val">${k}</div>
                    </div>
                </div>

                <!-- Row 4: Subgrid Muatan & Layanan -->
                <div class="m-row-subgrid">
                    <div class="m-sub-col m-sub-isi">
                        <div class="m-lbl">ISI KONTAINER</div>
                        <div class="m-sub-val-wrap">
                            <div class="m-sub-val">${u||"FULL CONT(ON-CHASIS)"}</div>
                        </div>
                    </div>
                    <div class="m-sub-col m-sub-segel">
                        <div class="m-lbl">NO. SEGEL</div>
                        <div class="m-sub-val-wrap">
                            <div class="m-sub-val">${v||"-"}</div>
                        </div>
                    </div>
                    <div class="m-sub-col m-sub-ket">
                        <div class="m-lbl">KETERANGAN</div>
                        <div class="m-sub-val-wrap">
                            <div class="m-sub-val">${w||"-"}</div>
                        </div>
                    </div>
                    <div class="m-sub-col m-sub-layanan">
                        <div class="m-lbl">NAMA PRODUK / LAYANAN</div>
                        <div class="m-sub-val-wrap" style="justify-content: center;">
                            <div class="m-layanan-val">${j}</div>
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
    <title>Surat Jalan - ${m||"Depo Surabaya"}</title>
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
        .sj-print-wrapper {
            width: 210mm !important;
            height: 140mm !important;
            max-height: 140mm !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            box-sizing: border-box !important;
            padding: 0 !important;
            margin: 0 !important;
        }
        .sj-page {
            width: ${i}mm !important;
            height: ${s}mm !important;
            max-width: ${i}mm !important;
            max-height: ${s}mm !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
            overflow: hidden !important;
            page-break-before: avoid !important;
            page-break-inside: avoid !important;
            page-break-after: avoid !important;
            box-sizing: border-box !important;
        }
        .header-section {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 1mm;
        }
        .company-wrapper {
            display: flex;
            align-items: flex-start;
            max-width: 85mm;
            min-width: 0;
        }
        .depo-logo {
            height: 30px !important;
            max-height: 30px !important;
            width: 36px !important;
            max-width: 36px !important;
            object-fit: contain !important;
            margin-right: 6px !important;
            flex-shrink: 0;
            filter: grayscale(100%) contrast(150%);
        }
        .company-text {
            flex: 1;
            min-width: 0;
        }
        .company-name {
            font-size: 12.5pt;
            font-weight: 900;
            letter-spacing: 0px;
            line-height: 1.15;
            color: #000000;
            white-space: nowrap;
        }
        .company-address {
            font-size: 8.5pt;
            font-weight: 800;
            line-height: 1.25;
            margin-top: 1px;
            color: #000000;
            white-space: nowrap;
        }
        .company-phone {
            font-size: 8pt;
            font-weight: 800;
            line-height: 1.2;
            color: #000000;
            white-space: nowrap;
        }
        .customer-info {
            margin-top: 1.5mm;
            font-size: 11pt;
            font-weight: 900;
            line-height: 1.2;
            color: #000000;
            text-transform: uppercase;
        }
        .shipper-info {
            font-size: 10.5pt;
            font-weight: 900;
            padding-left: 18mm;
            color: #000000;
            text-transform: uppercase;
            margin-top: 0.5mm;
        }

        /* Title Box */
        .title-box {
            border: 2px solid #000;
            padding: 1.5mm 4mm;
            text-align: center;
            align-self: flex-start;
            margin: 0 1.5mm;
            flex-shrink: 0;
            white-space: nowrap;
        }
        .title-text {
            font-size: 12.5pt;
            font-weight: 900;
            letter-spacing: 2px;
            line-height: 1;
            color: #000000;
            white-space: nowrap;
        }

        /* Meta Box Right */
        .meta-box {
            width: 60mm;
            border: 2px solid #000;
            font-size: 9.5pt;
        }
        .meta-row {
            display: flex;
            border-bottom: 1.5px solid #000;
            height: 5.6mm;
            align-items: center;
        }
        .meta-row:last-child {
            border-bottom: none;
        }
        .meta-lbl {
            width: 22mm;
            padding-left: 2mm;
            font-weight: 900;
            font-size: 9.5pt;
            color: #000000;
        }
        .meta-sep {
            width: 3mm;
            font-weight: 900;
            color: #000000;
        }
        .meta-val {
            flex: 1;
            padding-right: 2mm;
            font-weight: 900;
            font-size: 10pt;
            color: #000000;
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
            border: 1.5px solid #000;
            vertical-align: middle;
        }
        .td-lbl {
            width: 28mm;
            font-size: 9.5pt;
            font-weight: 900;
            text-align: center;
            line-height: 1.15;
            padding: 0.8mm;
            color: #000000;
        }
        .td-cont-num {
            height: 14mm;
            font-size: 24pt;
            font-weight: 900;
            letter-spacing: 0.5px;
            text-align: center;
            color: #000000;
            font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
        }
        .td-val-row {
            height: 7.5mm;
            font-size: 10.5pt;
            font-weight: 900;
            text-align: center;
            padding: 0 2mm;
            color: #000000;
        }
        .td-service-col {
            width: 50mm;
            text-align: center;
            vertical-align: middle;
            padding: 0;
        }
        .service-size-box {
            font-size: 13pt;
            font-weight: 900;
            padding: 1.5mm 0;
            border-bottom: 1.5px solid #000;
            color: #000000;
        }
        .service-title-box {
            font-size: 12pt;
            font-weight: 900;
            padding: 3mm 1.5mm;
            line-height: 1.2;
            text-transform: uppercase;
            color: #000000;
        }

        /* Footer Signature Table */
        table.footer-table {
            width: 100%;
            border: 2px solid #000;
            border-top: none;
            border-collapse: collapse;
            height: 25mm;
        }
        table.footer-table td {
            border: 1.5px solid #000;
            vertical-align: top;
        }
        .td-notice {
            width: 50mm;
            padding: 2mm;
            font-size: 8.5pt;
            font-weight: 800;
            line-height: 1.25;
            color: #000000;
        }
        .td-notice u {
            font-weight: 900;
        }
        .td-sig-col {
            width: 30mm;
            text-align: center;
            font-size: 9.5pt;
            font-weight: 900;
            text-transform: uppercase;
            color: #000000;
            padding-top: 2mm;
        }
        .td-sig-empty {
            flex: 1;
            text-align: center;
            font-size: 9.5pt;
            font-weight: 900;
            text-transform: uppercase;
            color: #000000;
            padding-top: 2mm;
        }
    </style>
</head>
<body>
    <div class="sj-print-wrapper">
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
                            <div class="meta-val">${h||"-"}</div>
                        </div>
                        <div class="meta-row">
                            <div class="meta-lbl">Jam Keluar</div>
                            <div class="meta-sep">:</div>
                            <div class="meta-val">${b||"-"}</div>
                        </div>
                        <div class="meta-row">
                            <div class="meta-lbl">No. Pol</div>
                            <div class="meta-sep">:</div>
                            <div class="meta-val">${g||"-"}</div>
                        </div>
                        <div class="meta-row">
                            <div class="meta-lbl">Tujuan</div>
                            <div class="meta-sep">:</div>
                            <div class="meta-val">${f||"-"}</div>
                        </div>
                    </div>
                </div>

                <!-- Customer & Shipper Row -->
                <div class="customer-info">
                    Customer : ${y}
                    ${r?`<div class="shipper-info">(${r})</div>`:""}
                </div>
            </div>

            <!-- Main Grid Table -->
            <table class="grid-table">
                <tbody>
                    <tr>
                        <td class="td-lbl">NO<br>CONTAINER</td>
                        <td class="td-cont-num">${m}</td>
                        <td rowspan="4" class="td-service-col">
                            <div class="service-size-box">${J}</div>
                            <div class="service-title-box">${F}</div>
                        </td>
                    </tr>
                    <tr>
                        <td class="td-lbl">ISI</td>
                        <td class="td-val-row">${u||"FULL CONT(ON-CHASIS)"}</td>
                    </tr>
                    <tr>
                        <td class="td-lbl">NO SEGEL</td>
                        <td class="td-val-row">${v||"-"}</td>
                    </tr>
                    <tr>
                        <td class="td-lbl">KETERANGAN</td>
                        <td class="td-val-row">${w||"-"}</td>
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
    </div>
</body>
</html>`},Z=()=>{var A;const t=Q(),i=document.getElementById("sj-print-iframe");i&&i.remove();const s=document.createElement("iframe");s.id="sj-print-iframe",s.style.position="fixed",s.style.right="0",s.style.bottom="0",s.style.width="0",s.style.height="0",s.style.border="0",s.style.visibility="hidden",document.body.appendChild(s);const c=((A=s.contentWindow)==null?void 0:A.document)||s.contentDocument;if(!c){alert("Gagal menyiapkan pencetakan. Silakan coba lagi.");return}c.open(),c.write(t),c.close();const d=()=>{setTimeout(()=>{var x,_;try{(x=s.contentWindow)==null||x.focus(),(_=s.contentWindow)==null||_.print()}catch(ee){console.error("Print error:",ee)}finally{setTimeout(()=>{document.body.contains(s)&&s.remove()},1e3)}},250)};if(p){const x=c.querySelector("img");x&&!x.complete?(x.onload=d,x.onerror=d):d()}else d()};return a?e.jsx(te,{open:R,onOpenChange:C,children:e.jsxs(ae,{className:"w-full sm:max-w-5xl lg:max-w-6xl max-h-[96vh] overflow-y-auto p-4 sm:p-6",children:[e.jsx(ie,{className:"border-b pb-3",children:e.jsx(se,{className:"text-lg font-bold flex items-center justify-between",children:e.jsx("span",{children:"Cetak Surat Jalan (Ukuran Media: 21 x 14 cm)"})})}),e.jsxs("div",{className:"bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs space-y-2.5",children:[e.jsxs("div",{className:"flex flex-wrap items-center justify-between gap-2",children:[e.jsxs("div",{className:"flex items-center gap-1.5 bg-white border border-slate-300 rounded-lg p-0.5",children:[e.jsxs("button",{type:"button",onClick:()=>B("standard"),className:`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition cursor-pointer ${N==="standard"?"bg-blue-600 text-white shadow-xs":"text-slate-600 hover:text-slate-900 hover:bg-slate-100"}`,children:[e.jsx(le,{className:"h-3.5 w-3.5"}),"Standar (Continuous Form)"]}),e.jsxs("button",{type:"button",onClick:()=>B("modern"),className:`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition cursor-pointer ${N==="modern"?"bg-blue-600 text-white shadow-xs":"text-slate-600 hover:text-slate-900 hover:bg-slate-100"}`,children:[e.jsx(oe,{className:"h-3.5 w-3.5"}),"Desain Baru (Modern Clean)"]})]}),e.jsxs("div",{className:"flex items-center gap-1 bg-white border border-slate-300 rounded-lg p-0.5",children:[e.jsx("span",{className:"text-[11px] font-semibold text-slate-500 pl-2 pr-1",children:"Skala Cetak:"}),["88","85","92","100"].map(t=>{const i=T[t];return e.jsx("button",{type:"button",onClick:()=>V(t),className:`px-2 py-0.5 rounded text-[11px] font-bold transition cursor-pointer ${G===t?"bg-indigo-600 text-white shadow-xs":"text-slate-600 hover:text-slate-900 hover:bg-slate-100"}`,title:i.desc,children:t==="88"?"88% (Rekomendasi Dot Matrix)":`${t}%`},t)})]}),e.jsxs("button",{type:"button",onClick:()=>X(!p),className:"inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold cursor-pointer transition",children:[p?e.jsx(de,{className:"h-3.5 w-3.5 text-blue-600"}):e.jsx(xe,{className:"h-3.5 w-3.5 text-slate-400"}),"Sertakan Logo Perusahaan"]})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsxs("div",{className:"grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2",children:[e.jsxs("div",{children:[e.jsx(o,{className:"text-[11px] text-gray-700",children:"Tanggal"}),e.jsx(n,{value:h,onChange:t=>M(t.target.value),className:"h-8 text-xs bg-white",placeholder:"DD - MM - YYYY"})]}),e.jsxs("div",{children:[e.jsx(o,{className:"text-[11px] text-gray-700",children:"Jam Keluar"}),e.jsx(n,{value:b,onChange:t=>P(t.target.value),className:"h-8 text-xs bg-white",placeholder:"HH:MM"})]}),e.jsxs("div",{children:[e.jsx(o,{className:"text-[11px] text-gray-700",children:"No. Polisi"}),e.jsx(n,{value:g,onChange:t=>I(t.target.value),className:"h-8 text-xs bg-white",placeholder:"Contoh: L 1234 AB"})]}),e.jsxs("div",{children:[e.jsx(o,{className:"text-[11px] text-gray-700",children:"Tujuan"}),e.jsx(n,{value:f,onChange:t=>O(t.target.value),className:"h-8 text-xs bg-white",placeholder:"Contoh: Pelabuhan"})]}),e.jsxs("div",{children:[e.jsx(o,{className:"text-[11px] text-gray-700",children:"No. Container"}),e.jsx(n,{value:m,onChange:t=>U(t.target.value),className:"h-8 text-xs bg-white font-bold",placeholder:"Nomor Container"})]}),e.jsxs("div",{children:[e.jsx(o,{className:"text-[11px] text-gray-700",children:"Jumlah / Ukuran"}),e.jsx(n,{value:k,onChange:t=>D(t.target.value),className:"h-8 text-xs bg-white font-bold",placeholder:'1 X 20"'})]})]}),e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2",children:[e.jsxs("div",{children:[e.jsx(o,{className:"text-[11px] text-gray-700 font-semibold",children:"Nama Produk / Layanan"}),e.jsx(n,{value:j,onChange:t=>K(t.target.value),className:"h-8 text-xs bg-white font-bold",placeholder:"PLUG & MONITORING TEMPERATURE"})]}),e.jsxs("div",{children:[e.jsx(o,{className:"text-[11px] text-gray-700",children:"Isi Kontainer"}),e.jsx(n,{value:u,onChange:t=>H(t.target.value),className:"h-8 text-xs bg-white",placeholder:"FULL CONT(ON-CHASIS)"})]}),e.jsxs("div",{children:[e.jsx(o,{className:"text-[11px] text-gray-700",children:"No. Segel"}),e.jsx(n,{value:v,onChange:t=>$(t.target.value),className:"h-8 text-xs bg-white",placeholder:"Nomor Segel"})]}),e.jsxs("div",{children:[e.jsx(o,{className:"text-[11px] text-gray-700",children:"Keterangan / Catatan"}),e.jsx(n,{value:w,onChange:t=>z(t.target.value),className:"h-8 text-xs bg-white",placeholder:"Catatan tambahan..."})]})]})]})]}),e.jsx("div",{className:"flex flex-col items-center p-3 bg-slate-200/70 rounded-xl overflow-x-auto space-y-2",children:e.jsxs("div",{ref:Y,className:"relative bg-white shadow-md border border-gray-400 w-[794px] min-w-[794px] h-[529px] min-h-[529px] rounded flex items-center justify-center select-none",style:{fontFamily:'Arial, "Helvetica Neue", Helvetica, sans-serif'},children:[e.jsx("div",{className:"absolute left-1.5 top-0 bottom-0 flex flex-col justify-between py-2 pointer-events-none opacity-25",children:Array.from({length:16}).map((t,i)=>e.jsx("div",{className:"w-2.5 h-2.5 rounded-full bg-gray-700"},i))}),e.jsx("div",{className:"absolute right-1.5 top-0 bottom-0 flex flex-col justify-between py-2 pointer-events-none opacity-25",children:Array.from({length:16}).map((t,i)=>e.jsx("div",{className:"w-2.5 h-2.5 rounded-full bg-gray-700"},i))}),e.jsx("div",{className:"absolute left-[44px] top-0 bottom-0 border-r border-dashed border-gray-300 pointer-events-none",title:"Batas perforasi traktor kiri"}),e.jsx("div",{className:"absolute right-[44px] top-0 bottom-0 border-l border-dashed border-gray-300 pointer-events-none",title:"Batas perforasi traktor kanan"}),e.jsx("div",{className:"flex flex-col justify-between",style:{width:`${S.previewW}px`,height:`${S.previewH}px`,transition:"all 0.15s ease"},children:N==="modern"?e.jsxs("div",{className:"w-full h-full flex flex-col justify-start",children:[e.jsxs("div",{className:"flex justify-between items-center border-b-2 border-black pb-1.5 gap-2",children:[e.jsxs("div",{className:"flex items-center gap-2 min-w-0 flex-1",children:[p&&e.jsx("img",{src:"/logo.png",alt:"Logo Depo",className:"h-7 w-auto max-w-[36px] object-contain filter grayscale contrast-150 shrink-0",style:{maxHeight:"30px",maxWidth:"36px"}}),e.jsxs("div",{className:"min-w-0 flex-1",children:[e.jsx("div",{className:"font-black text-[13.5px] tracking-tight text-black leading-tight whitespace-nowrap",children:"PT. DEPO SURABAYA SEJAHTERA"}),e.jsx("div",{className:"text-[10px] sm:text-[10.5px] font-bold text-black leading-tight mt-0.5 whitespace-nowrap tracking-tight",children:"Jl. Tanjung Sadari No. 90 (Tanjung Batu No. 1) • Telp. 031-353 9484 / 3539485 • Fax. 031-3539482"})]})]}),e.jsx("div",{className:"text-right shrink-0 ml-2",children:e.jsx("div",{className:"font-black text-lg sm:text-xl tracking-[1.5px] text-black leading-none whitespace-nowrap",children:"SURAT JALAN"})})]}),e.jsxs("div",{className:"border-2 border-black bg-white flex flex-col mt-2 flex-1",children:[e.jsxs("div",{className:"shrink-0 grid grid-cols-4 border-b-2 border-black divide-x-2 divide-black min-h-[46px]",children:[e.jsxs("div",{className:"p-1.5 flex flex-col justify-center",children:[e.jsx("div",{className:"text-[10.5px] uppercase font-black text-black tracking-wide leading-tight",children:"TANGGAL"}),e.jsx("div",{className:"text-[13px] font-black text-black truncate mt-0.5",children:h||"-"})]}),e.jsxs("div",{className:"p-1.5 flex flex-col justify-center",children:[e.jsx("div",{className:"text-[10.5px] uppercase font-black text-black tracking-wide leading-tight",children:"JAM KELUAR"}),e.jsx("div",{className:"text-[13px] font-black text-black truncate mt-0.5",children:b||"-"})]}),e.jsxs("div",{className:"p-1.5 flex flex-col justify-center",children:[e.jsx("div",{className:"text-[10.5px] uppercase font-black text-black tracking-wide leading-tight",children:"NO. POLISI"}),e.jsx("div",{className:"text-[13px] font-black text-black truncate mt-0.5",children:g||"-"})]}),e.jsxs("div",{className:"p-1.5 flex flex-col justify-center",children:[e.jsx("div",{className:"text-[10.5px] uppercase font-black text-black tracking-wide leading-tight",children:"TUJUAN"}),e.jsx("div",{className:"text-[13px] font-black text-black truncate mt-0.5",children:f||"-"})]})]}),e.jsxs("div",{className:"shrink-0 border-b-2 border-black grid grid-cols-2 divide-x-2 divide-black bg-white min-h-[44px]",children:[e.jsxs("div",{className:"px-3 py-1.5 flex flex-col justify-center min-w-0",children:[e.jsx("div",{className:"text-[10px] uppercase font-black text-black tracking-wide leading-tight",children:"CUSTOMER"}),e.jsx("div",{className:"text-[12px] font-black text-black uppercase tracking-tight leading-tight break-words mt-0.5 text-left",children:y})]}),e.jsxs("div",{className:"px-3 py-1.5 flex flex-col justify-center min-w-0",children:[e.jsx("div",{className:"text-[10px] uppercase font-black text-black tracking-wide leading-tight",children:"SHIPPER"}),e.jsx("div",{className:"text-[12px] font-black text-black uppercase tracking-tight leading-tight break-words mt-0.5 text-left",children:r?r.startsWith("(")?r:`(${r})`:"-"})]})]}),e.jsxs("div",{className:"flex-[1.3] min-h-[75px] border-b-2 border-black flex",children:[e.jsxs("div",{className:"flex-1 border-r-2 border-black p-2 flex flex-col justify-center",children:[e.jsx("div",{className:"text-[10.5px] uppercase font-black text-black tracking-wide leading-tight",children:"NO. CONTAINER"}),e.jsx("div",{className:"text-2xl sm:text-3xl font-black tracking-wider text-black mt-0.5 leading-none",children:m||"-"})]}),e.jsxs("div",{className:"w-[200px] sm:w-[220px] p-2 flex flex-col justify-center items-center text-center bg-white",children:[e.jsx("div",{className:"text-[10.5px] uppercase font-black text-black tracking-wide leading-tight",children:"JUMLAH / UKURAN"}),e.jsx("div",{className:"text-xl sm:text-2xl font-black text-black mt-0.5 leading-none",children:k})]})]}),e.jsxs("div",{className:"flex-[1.1] min-h-[70px] border-b-2 border-black flex",children:[e.jsxs("div",{className:"flex-1 border-r-2 border-black grid grid-cols-12 divide-x-2 divide-black bg-white",children:[e.jsxs("div",{className:"col-span-5 px-2 pt-1 pb-1.5 flex flex-col justify-between",children:[e.jsx("div",{className:"text-[10.5px] uppercase font-black text-black tracking-wide leading-tight",children:"ISI KONTAINER"}),e.jsx("div",{className:"flex-1 flex items-center",children:e.jsx("div",{className:"text-[11.5px] font-black text-black break-words whitespace-normal leading-tight",children:u||"FULL CONT(ON-CHASIS)"})})]}),e.jsxs("div",{className:"col-span-3 px-2 pt-1 pb-1.5 flex flex-col justify-between",children:[e.jsx("div",{className:"text-[10.5px] uppercase font-black text-black tracking-wide leading-tight",children:"NO. SEGEL"}),e.jsx("div",{className:"flex-1 flex items-center",children:e.jsx("div",{className:"text-[11.5px] font-black text-black break-words",children:v||"-"})})]}),e.jsxs("div",{className:"col-span-4 px-2 pt-1 pb-1.5 flex flex-col justify-between",children:[e.jsx("div",{className:"text-[10.5px] uppercase font-black text-black tracking-wide leading-tight",children:"KETERANGAN"}),e.jsx("div",{className:"flex-1 flex items-center",children:e.jsx("div",{className:"text-[11.5px] font-black text-black break-words",children:w||"-"})})]})]}),e.jsxs("div",{className:"w-[200px] sm:w-[220px] px-2 pt-1 pb-1.5 flex flex-col items-center text-center bg-white justify-between",children:[e.jsx("div",{className:"text-[10.5px] uppercase font-black text-black tracking-wide leading-tight",children:"NAMA PRODUK / LAYANAN"}),e.jsx("div",{className:"flex-1 flex items-center justify-center",children:e.jsx("div",{className:"text-xs sm:text-sm font-black uppercase tracking-tight leading-tight text-black",children:j})})]})]}),e.jsxs("div",{className:"flex-[1.4] min-h-[95px] flex items-stretch divide-x-2 divide-black",children:[e.jsxs("div",{className:"w-[300px] sm:w-[325px] p-2 bg-white flex flex-col justify-start gap-1",children:[e.jsx("div",{className:"text-[10.5px] font-black uppercase text-black underline tracking-wide leading-tight",children:"PERHATIAN PENTING :"}),e.jsx("div",{className:"text-[11px] font-black text-black leading-snug mt-0.5",children:"Mohon kondisi container dan segel dicek terlebih dahulu sebelum meninggalkan area depo. Segala bentuk komplain setelah keluar depo di luar tanggung jawab kami."})]}),e.jsxs("div",{className:"flex-1 p-1.5 bg-white flex flex-col justify-between text-center",children:[e.jsx("div",{className:"text-[10px] font-black uppercase text-black",children:"DISERAHKAN OLEH"}),e.jsx("div",{className:"border-b-2 border-dotted border-black mx-2 mb-0.5"})]}),e.jsxs("div",{className:"flex-1 p-1.5 bg-white flex flex-col justify-between text-center",children:[e.jsx("div",{className:"text-[10px] font-black uppercase text-black",children:"SOPIR TRUK"}),e.jsx("div",{className:"border-b-2 border-dotted border-black mx-2 mb-0.5"})]}),e.jsxs("div",{className:"flex-1 p-1.5 bg-white flex flex-col justify-between text-center",children:[e.jsx("div",{className:"text-[10px] font-black uppercase text-black",children:"PENERIMA BARANG / DEPO"}),e.jsx("div",{className:"border-b-2 border-dotted border-black mx-2 mb-0.5"})]})]})]})]}):e.jsxs("div",{className:"w-full h-full flex flex-col justify-between",children:[e.jsxs("div",{children:[e.jsxs("div",{className:"flex justify-between items-start",children:[e.jsxs("div",{className:"flex items-start max-w-[340px] min-w-0",children:[p&&e.jsx("img",{src:"/logo.png",alt:"Logo Depo",className:"h-7 w-auto max-w-[36px] object-contain filter grayscale contrast-150 shrink-0 mr-2",style:{maxHeight:"30px",maxWidth:"36px"}}),e.jsxs("div",{className:"company-text min-w-0",children:[e.jsx("div",{className:"font-black text-[13.5px] tracking-normal text-black leading-tight whitespace-nowrap",children:"PT. DEPO SURABAYA SEJAHTERA"}),e.jsx("div",{className:"font-bold text-[10.5px] text-black leading-snug mt-0.5 whitespace-nowrap",children:"Jl. Tanjung Sadari No. 90 (Tanjung Batu No. 1)"}),e.jsx("div",{className:"font-bold text-[10px] text-black leading-snug whitespace-nowrap",children:"Telp. 031-353 9484, 031-3539485   Fax. 031-3539482"})]})]}),e.jsx("div",{className:"border-2 border-black px-3 py-1 text-center self-start shrink-0 whitespace-nowrap",children:e.jsx("div",{className:"font-black text-sm tracking-[2px] text-black whitespace-nowrap",children:"SURAT JALAN"})}),e.jsxs("div",{className:"w-[230px] border-2 border-black text-[12.5px]",children:[e.jsxs("div",{className:"flex border-b-2 border-black py-0.5 items-center",children:[e.jsx("div",{className:"w-[85px] pl-2 font-black text-black",children:"Tanggal"}),e.jsx("div",{className:"w-3 font-black text-black",children:":"}),e.jsx("div",{className:"flex-1 pr-1.5 font-black text-black truncate",children:h||"-"})]}),e.jsxs("div",{className:"flex border-b-2 border-black py-0.5 items-center",children:[e.jsx("div",{className:"w-[85px] pl-2 font-black text-black",children:"Jam Keluar"}),e.jsx("div",{className:"w-3 font-black text-black",children:":"}),e.jsx("div",{className:"flex-1 pr-1.5 font-black text-black truncate",children:b||"-"})]}),e.jsxs("div",{className:"flex border-b-2 border-black py-0.5 items-center",children:[e.jsx("div",{className:"w-[85px] pl-2 font-black text-black",children:"No. Pol"}),e.jsx("div",{className:"w-3 font-black text-black",children:":"}),e.jsx("div",{className:"flex-1 pr-1.5 font-black text-black truncate",children:g||"-"})]}),e.jsxs("div",{className:"flex py-0.5 items-center",children:[e.jsx("div",{className:"w-[85px] pl-2 font-black text-black",children:"Tujuan"}),e.jsx("div",{className:"w-3 font-black text-black",children:":"}),e.jsx("div",{className:"flex-1 pr-1.5 font-black text-black truncate",children:f||"-"})]})]})]}),e.jsxs("div",{className:"mt-1.5 text-[14px] font-black text-black leading-tight uppercase",children:["Customer : ",e.jsx("span",{className:"font-black",children:y}),r&&e.jsxs("div",{className:"font-black text-black text-[13px] pl-16 mt-0.5",children:["(",r,")"]})]})]}),e.jsx("table",{className:"w-full border-2 border-black border-collapse",children:e.jsxs("tbody",{children:[e.jsxs("tr",{children:[e.jsxs("td",{className:"w-[115px] border-2 border-black p-1.5 font-black text-center text-[12px] text-black uppercase",children:["NO",e.jsx("br",{}),"CONTAINER"]}),e.jsx("td",{className:"border-2 border-black p-1.5 font-black text-2xl sm:text-3xl text-center tracking-normal text-black",children:m}),e.jsxs("td",{rowSpan:4,className:"w-[200px] border-2 border-black p-0 text-center align-middle bg-white",children:[e.jsx("div",{className:"text-sm font-black py-2 border-b-2 border-black text-black",children:J}),e.jsx("div",{className:"text-sm font-black py-4 px-1.5 tracking-wide uppercase leading-tight text-black",children:F})]})]}),e.jsxs("tr",{children:[e.jsx("td",{className:"border-2 border-black p-1 font-black text-center text-[12px] text-black uppercase",children:"ISI"}),e.jsx("td",{className:"border-2 border-black p-1 px-2.5 font-black text-xs sm:text-[13px] text-center text-black",children:u||"FULL CONT(ON-CHASIS)"})]}),e.jsxs("tr",{children:[e.jsx("td",{className:"border-2 border-black p-1 font-black text-center text-[12px] text-black uppercase",children:"NO SEGEL"}),e.jsx("td",{className:"border-2 border-black p-1 px-2.5 font-black text-xs sm:text-[13px] text-center text-black",children:v||"-"})]}),e.jsxs("tr",{children:[e.jsx("td",{className:"border-2 border-black p-1 font-black text-center text-[12px] text-black uppercase",children:"KETERANGAN"}),e.jsx("td",{className:"border-2 border-black p-1 px-2.5 font-black text-xs sm:text-[13px] text-center text-black",children:w||"-"})]})]})}),e.jsx("table",{className:"w-full border-2 border-black border-t-0 border-collapse h-[95px]",children:e.jsx("tbody",{children:e.jsxs("tr",{children:[e.jsxs("td",{className:"w-[230px] sm:w-[250px] border-2 border-black p-2 text-[10.5px] font-bold leading-snug text-black align-top",children:[e.jsx("strong",{className:"underline font-black",children:"PERHATIAN :"})," Mohon container dicek terlebih dahulu, komplain setelah keluar depo bukan tanggung jawab kami."]}),e.jsx("td",{className:"w-[125px] border-2 border-black text-center p-1.5 align-top",children:e.jsx("div",{className:"font-black text-[11px] uppercase text-black",children:"Diserahkan oleh"})}),e.jsx("td",{className:"w-[125px] border-2 border-black text-center p-1.5 align-top",children:e.jsx("div",{className:"font-black text-[11px] uppercase text-black",children:"Sopir"})}),e.jsx("td",{className:"border-2 border-black text-center p-1.5 align-top",children:e.jsx("div",{className:"font-black text-[11px] uppercase text-black",children:"Penerima"})})]})})})]})})]})}),e.jsxs("div",{className:"flex flex-wrap justify-between items-center pt-2 border-t mt-2 gap-2",children:[e.jsxs("div",{className:"text-xs text-gray-600",children:["Media: ",e.jsx("strong",{children:"21 cm x 14 cm (Dot Matrix Continuous Form)"})," • Skala:"," ",e.jsx("strong",{className:"text-indigo-700",children:S.label})," • Pilihan Layout:"," ",e.jsx("strong",{children:N==="modern"?"Desain Baru (Modern Clean)":"Standar (Continuous Form)"})]}),e.jsxs("div",{className:"flex gap-2",children:[e.jsx(W,{variant:"outline",size:"sm",onClick:C,children:"Tutup"}),e.jsxs(W,{size:"sm",onClick:Z,className:"bg-blue-600 hover:bg-blue-700 text-white gap-1.5 font-semibold",children:[e.jsx(re,{className:"h-4 w-4"}),"Cetak Surat Jalan"]})]})]})]})}):null}export{we as S};
