import{c as A,B as U}from"./button-BzBZLwOx.js";import{r as l,j as e}from"./app-CTQRw4T1.js";import{D as W,a as X,b as V,c as Z}from"./dialog-DAz1Rr-j.js";import{I as o}from"./input-CPbMC6mS.js";import{L as n}from"./label-caCOoSQk.js";import{F as Q}from"./file-text-CAJPKw_z.js";import{P as ee}from"./printer-qZvnI5M4.js";/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const te=[["rect",{width:"18",height:"7",x:"3",y:"3",rx:"1",key:"f1a2em"}],["rect",{width:"9",height:"7",x:"3",y:"14",rx:"1",key:"jqznyg"}],["rect",{width:"5",height:"7",x:"16",y:"14",rx:"1",key:"q5h2i8"}]],ae=A("LayoutTemplate",te);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const se=[["path",{d:"M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z",key:"q3az6g"}],["path",{d:"M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8",key:"1h4pet"}],["path",{d:"M12 17.5v-11",key:"1jc1ny"}]],ge=A("Receipt",se);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ie=[["path",{d:"M21 10.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h12.5",key:"1uzm8b"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]],le=A("SquareCheckBig",ie);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const re=[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}]],oe=A("Square",re);function be({isOpen:T,onClose:C,data:a}){const F=l.useRef(null);function K(t){try{const i=new Date(t);if(isNaN(i.getTime()))return t;const s=String(i.getDate()).padStart(2,"0"),r=String(i.getMonth()+1).padStart(2,"0"),c=i.getFullYear();return`${s} - ${r} - ${c}`}catch{return t}}const z=t=>{if(!t)return'1 X 20"';const i=t.toLowerCase();return i.includes("45")?'1 X 45"':i.includes("40")?'1 X 40"':i.includes("20")?'1 X 20"':`1 X ${t}`},[h,$]=l.useState(""),[g,L]=l.useState(""),[b,E]=l.useState(""),[f,I]=l.useState(""),[v,P]=l.useState("-"),[u,R]=l.useState("FULL CONT(ON-CHASIS)"),[j,D]=l.useState("-"),[m,M]=l.useState(""),[w,H]=l.useState(()=>z(a==null?void 0:a.size)),[p,_]=l.useState(!1),[N,O]=l.useState("modern");l.useEffect(()=>{if(a){const t=new Date,i=String(t.getDate()).padStart(2,"0"),s=String(t.getMonth()+1).padStart(2,"0"),r=t.getFullYear(),c=String(t.getHours()).padStart(2,"0"),S=String(t.getMinutes()).padStart(2,"0");$(a.date?K(a.date):`${i} - ${s} - ${r}`),L(a.exit_time||`${c}:${S}`),E(a.police_number||""),I(a.destination||""),P(a.seal_number||"-"),R(a.commodity?a.commodity.toUpperCase():"FULL CONT(ON-CHASIS)"),D(a.notes||"-"),M(a.container_number||""),H(z(a.size))}},[a,T]);const B=w,y=(a==null?void 0:a.service_type)||"PEMERIKSAAN KARANTINA",k=(a==null?void 0:a.customer_name)||"-",d=(a==null?void 0:a.shipper_name)||null,Y=()=>{const t=p?`<img src="${window.location.origin}/logo.png" class="depo-logo" alt="Logo" style="height: 35px; max-height: 35px; width: 42px; max-width: 42px; object-fit: contain; margin-right: 8px;" />`:"";return N==="modern"?`<!DOCTYPE html>
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
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif !important;
            color: #000000 !important;
            overflow: hidden !important;
        }
        .sj-page {
            width: 210mm !important;
            height: 140mm !important;
            max-height: 140mm !important;
            padding: 4.5mm 7.5mm !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
            overflow: hidden !important;
            page-break-before: avoid !important;
            page-break-inside: avoid !important;
            page-break-after: avoid !important;
        }
        
        /* Modern Header */
        .m-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #000;
            padding-bottom: 2mm;
        }
        .m-brand {
            display: flex;
            align-items: center;
            gap: 3mm;
        }
        .depo-logo {
            height: 36px !important;
            max-height: 36px !important;
            width: 42px !important;
            object-fit: contain !important;
            filter: grayscale(100%) contrast(150%);
        }
        .m-brand-title {
            font-size: 13pt;
            font-weight: 900;
            letter-spacing: -0.3px;
            line-height: 1.1;
        }
        .m-brand-desc {
            font-size: 7.5pt;
            color: #222;
            line-height: 1.25;
            margin-top: 1px;
        }
        .m-doc-box {
            text-align: right;
        }
        .m-doc-title {
            font-size: 20pt;
            font-weight: 900;
            letter-spacing: 2.5px;
            line-height: 1;
        }

        /* 4-Box Logistics Bar */
        .m-logistics-bar {
            display: flex;
            gap: 2mm;
            margin-top: 2mm;
        }
        .m-log-card {
            flex: 1;
            border: 1px solid #000;
            padding: 1.5mm 2.5mm;
            background: #ffffff;
        }
        .m-log-card:last-child {
            flex: 1.3;
        }
        .m-log-label {
            font-size: 6.5pt;
            text-transform: uppercase;
            font-weight: 800;
            color: #444;
            letter-spacing: 0.5px;
        }
        .m-log-value {
            font-size: 8.5pt;
            font-weight: 800;
            margin-top: 1px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        /* Customer Banner */
        .m-party-banner {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #ffffff;
            border: 1px solid #000;
            border-left: 3.5px solid #000;
            padding: 1.5mm 3mm;
            margin-top: 2mm;
            font-size: 8.5pt;
        }
        .m-party-cust {
            font-weight: 900;
        }
        .m-party-ship {
            font-weight: 700;
            color: #333;
        }

        /* Hero Container Display (Clean Border Grid, White BG, Dedicated 1x20" Column) */
        .m-container-hero {
            border: 1.5px solid #000;
            margin-top: 2mm;
            background: #ffffff;
            display: flex;
        }
        .m-hero-left {
            flex: 1;
            border-right: 1.5px solid #000;
            display: flex;
            flex-direction: column;
        }
        .m-cont-num-box {
            padding: 1.5mm 3mm;
            border-bottom: 1px solid #000;
        }
        .m-cont-lbl {
            font-size: 6.5pt;
            font-weight: 800;
            color: #444;
            letter-spacing: 0.5px;
            text-transform: uppercase;
        }
        .m-cont-number {
            font-size: 26pt;
            font-weight: 900;
            letter-spacing: -0.5px; /* Karakter rapat tegas */
            font-family: "Arial Black", Impact, monospace, sans-serif;
            line-height: 1;
            margin-top: 0.5mm;
        }
        .m-hero-subgrid {
            display: flex;
            flex: 1;
        }
        .m-subcol {
            flex: 1;
            padding: 1.5mm 3mm;
            border-right: 1px solid #000;
        }
        .m-subcol:last-child {
            border-right: none;
            flex: 1.4;
        }
        .m-subcol-lbl {
            font-size: 6.5pt;
            font-weight: 800;
            text-transform: uppercase;
            color: #444;
        }
        .m-subcol-val {
            font-size: 8.5pt;
            font-weight: 700;
            margin-top: 1px;
        }
        .m-hero-right {
            width: 58mm;
            display: flex;
            flex-direction: column;
            text-align: center;
        }
        .m-size-box {
            padding: 2mm 1.5mm;
            border-bottom: 1px solid #000;
            background: #ffffff;
        }
        .m-size-val {
            font-size: 16pt;
            font-weight: 900;
            letter-spacing: 0.5px;
            line-height: 1;
            margin-top: 0.5mm;
        }
        .m-service-box {
            flex: 1;
            padding: 2mm 1.5mm;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background: #ffffff;
        }
        .m-service-val {
            font-size: 10.5pt;
            font-weight: 900;
            font-style: italic;
            text-transform: uppercase;
            line-height: 1.2;
            letter-spacing: 0.5px;
            margin-top: 0.5mm;
        }

        /* Modern Signatures */
        .m-footer-section {
            display: flex;
            gap: 2.5mm;
            margin-top: 2mm;
            align-items: stretch;
            height: 27mm;
        }
        .m-notice-box {
            width: 50mm;
            border: 1px solid #000;
            padding: 2mm;
            font-size: 7pt;
            line-height: 1.3;
            background: #ffffff;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
        .m-notice-box u {
            font-weight: 800;
        }
        .m-sig-card {
            flex: 1;
            border: 1px solid #000;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 1.5mm;
            text-align: center;
            background: #ffffff;
        }
        .m-sig-role {
            font-size: 7.5pt;
            font-weight: 800;
            text-transform: uppercase;
        }
        .m-sig-line {
            border-bottom: 1px dotted #555;
            margin: 0 4mm 1mm 4mm;
        }
    </style>
</head>
<body>
    <div class="sj-page">
        <!-- Modern Header -->
        <div>
            <div class="m-header">
                <div class="m-brand">
                    ${t}
                    <div>
                        <div class="m-brand-title">PT. DEPO SURABAYA SEJAHTERA</div>
                        <div class="m-brand-desc">Jl. Tanjung Sadari No. 90 (Tanjung Batu No. 1) &bull; Telp. 031-353 9484 / 3539485 &bull; Fax. 031-3539482</div>
                    </div>
                </div>
                <div class="m-doc-box">
                    <div class="m-doc-title">SURAT JALAN</div>
                </div>
            </div>

            <!-- Logistics Cards -->
            <div class="m-logistics-bar">
                <div class="m-log-card">
                    <div class="m-log-label">Tanggal</div>
                    <div class="m-log-value">${h||"-"}</div>
                </div>
                <div class="m-log-card">
                    <div class="m-log-label">Jam Keluar</div>
                    <div class="m-log-value">${g||"-"}</div>
                </div>
                <div class="m-log-card">
                    <div class="m-log-label">No. Polisi</div>
                    <div class="m-log-value">${b||"-"}</div>
                </div>
                <div class="m-log-card">
                    <div class="m-log-label">Tujuan Pengiriman</div>
                    <div class="m-log-value">${f||"-"}</div>
                </div>
            </div>

            <!-- Customer & Shipper Banner -->
            <div class="m-party-banner">
                <div class="m-party-cust">Customer: ${k}</div>
                ${d?`<div class="m-party-ship">Shipper: (${d})</div>`:""}
            </div>
        </div>

        <!-- Hero Container Box -->
        <div class="m-container-hero">
            <div class="m-hero-left">
                <div class="m-cont-num-box">
                    <div class="m-cont-lbl">NO. CONTAINER</div>
                    <div class="m-cont-number">${m}</div>
                </div>
                <div class="m-hero-subgrid">
                    <div class="m-subcol">
                        <div class="m-subcol-lbl">Isi Kontainer</div>
                        <div class="m-subcol-val">${u||"FULL CONT(ON-CHASIS)"}</div>
                    </div>
                    <div class="m-subcol">
                        <div class="m-subcol-lbl">No. Segel</div>
                        <div class="m-subcol-val">${v||"-"}</div>
                    </div>
                    <div class="m-subcol">
                        <div class="m-subcol-lbl">Keterangan / Catatan</div>
                        <div class="m-subcol-val">${j||"-"}</div>
                    </div>
                </div>
            </div>
            <div class="m-hero-right">
                <div class="m-size-box">
                    <div class="m-cont-lbl">UKURAN / JUMLAH</div>
                    <div class="m-size-val">${w}</div>
                </div>
                <div class="m-service-box">
                    <div class="m-cont-lbl">JENIS LAYANAN</div>
                    <div class="m-service-val">${y}</div>
                </div>
            </div>
        </div>

        <!-- Modern Footer & Signatures -->
        <div class="m-footer-section">
            <div class="m-notice-box">
                <div><strong><u>PERHATIAN PENTING :</u></strong></div>
                <div>Mohon kondisi container dan segel dicek terlebih dahulu sebelum meninggalkan area depo. Segala bentuk komplain setelah keluar depo di luar tanggung jawab kami.</div>
            </div>
            <div class="m-sig-card">
                <div class="m-sig-role">Diserahkan Oleh</div>
                <div class="m-sig-line"></div>
            </div>
            <div class="m-sig-card">
                <div class="m-sig-role">Sopir Truk</div>
                <div class="m-sig-line"></div>
            </div>
            <div class="m-sig-card">
                <div class="m-sig-role">Penerima Barang / Depo</div>
                <div class="m-sig-line"></div>
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
            letter-spacing: -0.5px !important; /* Rapat antar karakter sesuai permintaan */
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
                        <div class="meta-val">${h||"-"}</div>
                    </div>
                    <div class="meta-row">
                        <div class="meta-lbl">Jam Keluar</div>
                        <div class="meta-sep">:</div>
                        <div class="meta-val">${g||"-"}</div>
                    </div>
                    <div class="meta-row">
                        <div class="meta-lbl">No. Pol</div>
                        <div class="meta-sep">:</div>
                        <div class="meta-val">${b||"-"}</div>
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
                Customer : ${k}
                ${d?`<div class="shipper-info">(${d})</div>`:""}
            </div>
        </div>

        <!-- Main Grid Table -->
        <table class="grid-table">
            <tbody>
                <tr>
                    <td class="td-lbl">NO<br>CONTAINER</td>
                    <td class="td-cont-num">${m}</td>
                    <td rowspan="4" class="td-service-col">
                        <div class="service-size-box">${B}</div>
                        <div class="service-title-box">${y}</div>
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
                    <td class="td-val-row">${j||"-"}</td>
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
</html>`},G=()=>{var S;const t=Y(),i=document.getElementById("sj-print-iframe");i&&i.remove();const s=document.createElement("iframe");s.id="sj-print-iframe",s.style.position="fixed",s.style.right="0",s.style.bottom="0",s.style.width="0",s.style.height="0",s.style.border="0",s.style.visibility="hidden",document.body.appendChild(s);const r=((S=s.contentWindow)==null?void 0:S.document)||s.contentDocument;if(!r){alert("Gagal menyiapkan pencetakan. Silakan coba lagi.");return}r.open(),r.write(t),r.close();const c=()=>{setTimeout(()=>{var x,J;try{(x=s.contentWindow)==null||x.focus(),(J=s.contentWindow)==null||J.print()}catch(q){console.error("Print error:",q)}finally{setTimeout(()=>{document.body.contains(s)&&s.remove()},1e3)}},250)};if(p){const x=r.querySelector("img");x&&!x.complete?(x.onload=c,x.onerror=c):c()}else c()};return a?e.jsx(W,{open:T,onOpenChange:C,children:e.jsxs(X,{className:"w-full sm:max-w-5xl lg:max-w-6xl max-h-[96vh] overflow-y-auto p-4 sm:p-6",children:[e.jsx(V,{className:"border-b pb-3",children:e.jsx(Z,{className:"text-lg font-bold flex items-center justify-between",children:e.jsx("span",{children:"Cetak Surat Jalan (Ukuran Media: 21 x 14 cm)"})})}),e.jsxs("div",{className:"bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs space-y-2.5",children:[e.jsxs("div",{className:"flex flex-wrap items-center justify-between gap-2",children:[e.jsxs("div",{className:"flex items-center gap-1.5 bg-white border border-slate-300 rounded-lg p-0.5",children:[e.jsxs("button",{type:"button",onClick:()=>O("standard"),className:`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition cursor-pointer ${N==="standard"?"bg-blue-600 text-white shadow-xs":"text-slate-600 hover:text-slate-900 hover:bg-slate-100"}`,children:[e.jsx(Q,{className:"h-3.5 w-3.5"}),"Standar (Continuous Form)"]}),e.jsxs("button",{type:"button",onClick:()=>O("modern"),className:`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition cursor-pointer ${N==="modern"?"bg-blue-600 text-white shadow-xs":"text-slate-600 hover:text-slate-900 hover:bg-slate-100"}`,children:[e.jsx(ae,{className:"h-3.5 w-3.5"}),"Desain Baru (Modern Clean)"]})]}),e.jsxs("button",{type:"button",onClick:()=>_(!p),className:"inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold cursor-pointer transition",children:[p?e.jsx(le,{className:"h-3.5 w-3.5 text-blue-600"}):e.jsx(oe,{className:"h-3.5 w-3.5 text-slate-400"}),"Sertakan Logo Perusahaan"]})]}),e.jsxs("div",{className:"grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2",children:[e.jsxs("div",{children:[e.jsx(n,{className:"text-[11px] text-gray-700",children:"Tanggal"}),e.jsx(o,{value:h,onChange:t=>$(t.target.value),className:"h-8 text-xs bg-white",placeholder:"DD - MM - YYYY"})]}),e.jsxs("div",{children:[e.jsx(n,{className:"text-[11px] text-gray-700",children:"Jam Keluar"}),e.jsx(o,{value:g,onChange:t=>L(t.target.value),className:"h-8 text-xs bg-white",placeholder:"HH:MM"})]}),e.jsxs("div",{children:[e.jsx(n,{className:"text-[11px] text-gray-700",children:"No. Polisi"}),e.jsx(o,{value:b,onChange:t=>E(t.target.value),className:"h-8 text-xs bg-white",placeholder:"Contoh: L 1234 AB"})]}),e.jsxs("div",{children:[e.jsx(n,{className:"text-[11px] text-gray-700",children:"Tujuan"}),e.jsx(o,{value:f,onChange:t=>I(t.target.value),className:"h-8 text-xs bg-white",placeholder:"Contoh: Pelabuhan"})]}),e.jsxs("div",{children:[e.jsx(n,{className:"text-[11px] text-gray-700",children:"No. Container"}),e.jsx(o,{value:m,onChange:t=>M(t.target.value),className:"h-8 text-xs bg-white font-mono font-bold tracking-tight",placeholder:"Nomor Container"})]}),e.jsxs("div",{children:[e.jsx(n,{className:"text-[11px] text-gray-700",children:"Ukuran / Jml"}),e.jsx(o,{value:w,onChange:t=>H(t.target.value),className:"h-8 text-xs bg-white font-bold",placeholder:'1 X 20"'})]}),e.jsxs("div",{children:[e.jsx(n,{className:"text-[11px] text-gray-700",children:"No. Segel"}),e.jsx(o,{value:v,onChange:t=>P(t.target.value),className:"h-8 text-xs bg-white",placeholder:"Nomor Segel"})]}),e.jsxs("div",{children:[e.jsx(n,{className:"text-[11px] text-gray-700",children:"Isi Kontainer"}),e.jsx(o,{value:u,onChange:t=>R(t.target.value),className:"h-8 text-xs bg-white",placeholder:"FULL CONT(ON-CHASIS)"})]}),e.jsxs("div",{className:"col-span-2 sm:col-span-4 lg:col-span-8",children:[e.jsx(n,{className:"text-[11px] text-gray-700",children:"Keterangan"}),e.jsx(o,{value:j,onChange:t=>D(t.target.value),className:"h-8 text-xs bg-white",placeholder:"Catatan / keterangan tambahan..."})]})]})]}),e.jsx("div",{className:"flex justify-center p-3 bg-slate-200/70 rounded-xl overflow-x-auto",children:e.jsxs("div",{ref:F,className:"relative bg-white shadow-md border border-gray-400 p-6 w-[794px] min-w-[794px] h-[529px] min-h-[529px] rounded flex flex-col justify-between select-none",children:[e.jsx("div",{className:"absolute left-1.5 top-0 bottom-0 flex flex-col justify-between py-2 pointer-events-none opacity-20",children:Array.from({length:16}).map((t,i)=>e.jsx("div",{className:"w-2.5 h-2.5 rounded-full bg-gray-700"},i))}),e.jsx("div",{className:"absolute right-1.5 top-0 bottom-0 flex flex-col justify-between py-2 pointer-events-none opacity-20",children:Array.from({length:16}).map((t,i)=>e.jsx("div",{className:"w-2.5 h-2.5 rounded-full bg-gray-700"},i))}),N==="modern"?e.jsxs("div",{className:"w-full h-full flex flex-col justify-between",children:[e.jsxs("div",{children:[e.jsxs("div",{className:"flex justify-between items-center border-b-2 border-black pb-2",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[p&&e.jsx("img",{src:"/logo.png",alt:"Logo Depo",className:"h-9 w-auto max-w-[42px] object-contain filter grayscale contrast-150 shrink-0",style:{maxHeight:"36px",maxWidth:"42px"}}),e.jsxs("div",{children:[e.jsx("div",{className:"font-black text-[15px] tracking-tight text-black leading-tight",children:"PT. DEPO SURABAYA SEJAHTERA"}),e.jsx("div",{className:"text-[10px] text-gray-700 leading-tight mt-0.5",children:"Jl. Tanjung Sadari No. 90 (Tanjung Batu No. 1) • Telp. 031-353 9484 / 3539485 • Fax. 031-3539482"})]})]}),e.jsx("div",{className:"text-right",children:e.jsx("div",{className:"font-black text-2xl tracking-[2.5px] text-black leading-none",children:"SURAT JALAN"})})]}),e.jsxs("div",{className:"grid grid-cols-4 gap-2 mt-2",children:[e.jsxs("div",{className:"border border-black p-1.5 bg-white rounded-xs",children:[e.jsx("div",{className:"text-[9px] uppercase font-bold text-gray-600",children:"Tanggal"}),e.jsx("div",{className:"text-[12px] font-black truncate",children:h||"-"})]}),e.jsxs("div",{className:"border border-black p-1.5 bg-white rounded-xs",children:[e.jsx("div",{className:"text-[9px] uppercase font-bold text-gray-600",children:"Jam Keluar"}),e.jsx("div",{className:"text-[12px] font-black truncate",children:g||"-"})]}),e.jsxs("div",{className:"border border-black p-1.5 bg-white rounded-xs",children:[e.jsx("div",{className:"text-[9px] uppercase font-bold text-gray-600",children:"No. Polisi"}),e.jsx("div",{className:"text-[12px] font-black truncate",children:b||"-"})]}),e.jsxs("div",{className:"border border-black p-1.5 bg-white rounded-xs",children:[e.jsx("div",{className:"text-[9px] uppercase font-bold text-gray-600",children:"Tujuan"}),e.jsx("div",{className:"text-[12px] font-black truncate",children:f||"-"})]})]}),e.jsxs("div",{className:"flex justify-between items-center bg-white border border-black border-l-4 px-3 py-1.5 mt-2 text-xs",children:[e.jsxs("div",{className:"font-bold text-black",children:["Customer: ",e.jsx("span",{className:"font-black",children:k})]}),d&&e.jsxs("div",{className:"font-semibold text-gray-800",children:["Shipper: (",d,")"]})]})]}),e.jsxs("div",{className:"border-2 border-black rounded-xs overflow-hidden flex bg-white mt-2",children:[e.jsxs("div",{className:"flex-1 border-r border-black flex flex-col",children:[e.jsxs("div",{className:"p-2 border-b border-black",children:[e.jsx("div",{className:"text-[9px] uppercase font-bold text-gray-600",children:"NO. CONTAINER"}),e.jsx("div",{className:"text-3xl sm:text-4xl font-black font-mono tracking-tight text-black mt-0.5",children:m})]}),e.jsxs("div",{className:"grid grid-cols-3 divide-x divide-black bg-white flex-1",children:[e.jsxs("div",{className:"p-2",children:[e.jsx("div",{className:"text-[9px] uppercase font-bold text-gray-600",children:"Isi Kontainer"}),e.jsx("div",{className:"text-[11px] font-bold text-black",children:u||"FULL CONT(ON-CHASIS)"})]}),e.jsxs("div",{className:"p-2",children:[e.jsx("div",{className:"text-[9px] uppercase font-bold text-gray-600",children:"No. Segel"}),e.jsx("div",{className:"text-[11px] font-bold text-black",children:v||"-"})]}),e.jsxs("div",{className:"p-2",children:[e.jsx("div",{className:"text-[9px] uppercase font-bold text-gray-600",children:"Keterangan"}),e.jsx("div",{className:"text-[11px] font-bold text-black",children:j||"-"})]})]})]}),e.jsxs("div",{className:"w-[210px] sm:w-[230px] flex flex-col text-center bg-white",children:[e.jsxs("div",{className:"p-2 border-b border-black",children:[e.jsx("div",{className:"text-[9px] uppercase font-bold text-gray-600",children:"UKURAN / JUMLAH"}),e.jsx("div",{className:"text-xl font-black text-black mt-0.5",children:w})]}),e.jsxs("div",{className:"p-2 flex-1 flex flex-col justify-center items-center",children:[e.jsx("div",{className:"text-[9px] uppercase font-bold text-gray-600",children:"JENIS LAYANAN"}),e.jsx("div",{className:"text-xs font-black italic uppercase tracking-wide leading-tight mt-0.5 text-black",children:y})]})]})]}),e.jsxs("div",{className:"flex gap-2.5 h-[105px] items-stretch mt-2",children:[e.jsxs("div",{className:"w-[200px] border border-black p-2 bg-white text-[9.5px] leading-tight flex flex-col justify-between",children:[e.jsx("div",{children:e.jsx("strong",{children:e.jsx("u",{children:"PERHATIAN PENTING :"})})}),e.jsx("div",{className:"text-gray-700",children:"Mohon kondisi container dan segel dicek terlebih dahulu sebelum keluar depo. Komplain setelah keluar bukan tanggung jawab kami."})]}),e.jsxs("div",{className:"flex-1 border border-black p-2 bg-white flex flex-col justify-between text-center",children:[e.jsx("div",{className:"text-[11px] font-bold uppercase",children:"Diserahkan Oleh"}),e.jsx("div",{className:"border-b border-dashed border-gray-500 mx-4"})]}),e.jsxs("div",{className:"flex-1 border border-black p-2 bg-white flex flex-col justify-between text-center",children:[e.jsx("div",{className:"text-[11px] font-bold uppercase",children:"Sopir Truk"}),e.jsx("div",{className:"border-b border-dashed border-gray-500 mx-4"})]}),e.jsxs("div",{className:"flex-1 border border-black p-2 bg-white flex flex-col justify-between text-center",children:[e.jsx("div",{className:"text-[11px] font-bold uppercase",children:"Penerima"}),e.jsx("div",{className:"border-b border-dashed border-gray-500 mx-4"})]})]})]}):e.jsxs("div",{className:"w-full h-full flex flex-col justify-between",children:[e.jsxs("div",{children:[e.jsxs("div",{className:"flex justify-between items-start",children:[e.jsxs("div",{className:"flex items-start max-w-[360px]",children:[p&&e.jsx("img",{src:"/logo.png",alt:"Logo Depo",className:"h-9 w-auto max-w-[42px] object-contain filter grayscale contrast-150 shrink-0 mr-2",style:{maxHeight:"36px",maxWidth:"42px"}}),e.jsxs("div",{className:"company-text",children:[e.jsx("div",{className:"font-black text-[15px] tracking-normal text-black leading-tight",children:"PT. DEPO SURABAYA SEJAHTERA"}),e.jsx("div",{className:"font-semibold text-[11px] text-gray-800 leading-snug mt-0.5",children:"Jl. Tanjung Sadari No. 90 (Tanjung Batu No. 1)"}),e.jsx("div",{className:"text-[10px] text-gray-700 leading-snug",children:"Telp. 031-353 9484, 031-3539485   Fax. 031-3539482"})]})]}),e.jsx("div",{className:"border-[1.5px] border-black px-3.5 py-1 text-center self-start",children:e.jsx("div",{className:"font-black text-sm tracking-[2px] text-black",children:"SURAT JALAN"})}),e.jsxs("div",{className:"w-[230px] border-[1.5px] border-black text-[11px]",children:[e.jsxs("div",{className:"flex border-b border-black py-0.5 items-center",children:[e.jsx("div",{className:"w-[80px] pl-2 font-semibold",children:"Tanggal"}),e.jsx("div",{className:"w-3 font-bold",children:":"}),e.jsx("div",{className:"flex-1 pr-2 font-bold truncate",children:h||"-"})]}),e.jsxs("div",{className:"flex border-b border-black py-0.5 items-center",children:[e.jsx("div",{className:"w-[80px] pl-2 font-semibold",children:"Jam Keluar"}),e.jsx("div",{className:"w-3 font-bold",children:":"}),e.jsx("div",{className:"flex-1 pr-2 font-bold truncate",children:g||"-"})]}),e.jsxs("div",{className:"flex border-b border-black py-0.5 items-center",children:[e.jsx("div",{className:"w-[80px] pl-2 font-semibold",children:"No. Pol"}),e.jsx("div",{className:"w-3 font-bold",children:":"}),e.jsx("div",{className:"flex-1 pr-2 font-bold truncate",children:b||"-"})]}),e.jsxs("div",{className:"flex py-0.5 items-center",children:[e.jsx("div",{className:"w-[80px] pl-2 font-semibold",children:"Tujuan"}),e.jsx("div",{className:"w-3 font-bold",children:":"}),e.jsx("div",{className:"flex-1 pr-2 font-bold truncate",children:f||"-"})]})]})]}),e.jsxs("div",{className:"mt-2 text-[12px] font-bold text-gray-950 leading-tight",children:["Customer : ",k,d&&e.jsxs("div",{className:"font-semibold text-gray-800 pl-16",children:["(",d,")"]})]})]}),e.jsx("table",{className:"w-full border-2 border-black border-collapse",children:e.jsxs("tbody",{children:[e.jsxs("tr",{children:[e.jsxs("td",{className:"w-[125px] border border-black p-2 font-bold text-center text-xs",children:["NO",e.jsx("br",{}),"CONTAINER"]}),e.jsx("td",{className:"border border-black p-2 font-black text-2xl sm:text-3xl text-center tracking-tight font-mono",children:m}),e.jsxs("td",{rowSpan:4,className:"w-[210px] border border-black p-0 text-center align-middle bg-gray-50/30",children:[e.jsx("div",{className:"text-base font-black py-2.5 border-b-[1.5px] border-black",children:B}),e.jsx("div",{className:"text-base font-black italic py-5 px-2 tracking-wide uppercase leading-tight",children:y})]})]}),e.jsxs("tr",{children:[e.jsx("td",{className:"border border-black p-1.5 font-bold text-center text-xs",children:"ISI"}),e.jsx("td",{className:"border border-black p-1.5 px-3 font-semibold text-xs sm:text-sm text-center",children:u||"FULL CONT(ON-CHASIS)"})]}),e.jsxs("tr",{children:[e.jsx("td",{className:"border border-black p-1.5 font-bold text-center text-xs",children:"NO SEGEL"}),e.jsx("td",{className:"border border-black p-1.5 px-3 font-semibold text-xs sm:text-sm text-center",children:v||"-"})]}),e.jsxs("tr",{children:[e.jsx("td",{className:"border border-black p-1.5 font-bold text-center text-xs",children:"KETERANGAN"}),e.jsx("td",{className:"border border-black p-1.5 px-3 font-semibold text-xs sm:text-sm text-center",children:j||"-"})]})]})}),e.jsx("table",{className:"w-full border-2 border-black border-t-0 border-collapse h-[115px]",children:e.jsx("tbody",{children:e.jsxs("tr",{children:[e.jsxs("td",{className:"w-[185px] border border-black p-2.5 text-[10px] leading-tight text-gray-800 align-top",children:[e.jsx("strong",{children:e.jsx("u",{children:"PERHATIAN :"})})," Mohon container dicek terlebih dahulu, komplain setelah keluar depo bukan tanggung jawab kami."]}),e.jsx("td",{className:"w-[145px] border border-black text-center text-xs p-2 align-top",children:e.jsx("div",{className:"font-semibold",children:"Diserahkan oleh"})}),e.jsx("td",{className:"w-[145px] border border-black text-center text-xs p-2 align-top",children:e.jsx("div",{className:"font-semibold",children:"Sopir"})}),e.jsx("td",{className:"border border-black text-center text-xs p-2 align-top",children:e.jsx("div",{className:"font-semibold",children:"Penerima"})})]})})})]})]})}),e.jsxs("div",{className:"flex flex-wrap justify-between items-center pt-2 border-t mt-2 gap-2",children:[e.jsxs("div",{className:"text-xs text-gray-500",children:["Format Cetak: ",e.jsx("strong",{children:"21 cm x 14 cm (Continuous Form / Dot Matrix)"})," • Pilihan Layout:"," ",e.jsx("strong",{children:N==="modern"?"Desain Baru (Modern Clean)":"Standar (Continuous Form)"})]}),e.jsxs("div",{className:"flex gap-2",children:[e.jsx(U,{variant:"outline",size:"sm",onClick:C,children:"Tutup"}),e.jsxs(U,{size:"sm",onClick:G,className:"bg-blue-600 hover:bg-blue-700 text-white gap-1.5 font-semibold",children:[e.jsx(ee,{className:"h-4 w-4"}),"Cetak Surat Jalan"]})]})]})]})}):null}export{ge as R,be as S};
