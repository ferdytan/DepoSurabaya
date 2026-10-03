import{r as R,j as e}from"./app-BfUJ8xW3.js";import{D as F,a as U,b as B,c as L,d as H}from"./dialog-Cbs9EzM3.js";import{B as z}from"./button-BFHfZNHj.js";import{L as J}from"./label-BW8WFDuG.js";import{T as G}from"./index-BCHUc7X6.js";import{P as I}from"./printer-bC1ALHDk.js";import{F as K}from"./file-text-BXbfiSXu.js";function j(a){if(!a)return"-";const n=String(a).match(/^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2}))?/);if(n){const c=["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"],v=n[3],d=c[parseInt(n[2],10)-1]||n[2],r=n[1],b=n[4]&&n[5]?`, ${n[4]}:${n[5]} WIB`:"";return`${v} ${d} ${r}${b}`}const t=new Date(a);if(isNaN(t.getTime()))return String(a);const l=["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"],o=t.getDate().toString().padStart(2,"0"),x=l[t.getMonth()],i=t.getFullYear(),g=t.getHours().toString().padStart(2,"0"),s=t.getMinutes().toString().padStart(2,"0");return`${o} ${x} ${i}, ${g}:${s} WIB`}function W(a){try{const n=a.split("-");if(n.length===3){const t=parseInt(n[0],10),l=parseInt(n[1],10)-1,o=parseInt(n[2],10),x=new Date(t,l,o),i=["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"],g=["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"],s=i[x.getDay()]||"",c=g[l]||n[1];return`${s}, ${o.toString().padStart(2,"0")} ${c} ${t}`}}catch{}return a}function C(a){if(!a)return[];const n=[];return Array.isArray(a.rekam_suhu)&&a.rekam_suhu.length>0?a.rekam_suhu.forEach(t=>{t&&t.tanggal&&n.push({tanggal:t.tanggal,jam_data:t.jam_data||{}})}):a.temperature&&typeof a.temperature=="object"&&Object.entries(a.temperature).forEach(([t,l])=>{n.push({tanggal:t,jam_data:l||{}})}),n.sort((t,l)=>t.tanggal.localeCompare(l.tanggal)),n.map(t=>{const l=t.jam_data||{},o=[],x=Array.from({length:12}).map((d,r)=>{const b=r.toString().padStart(2,"0"),h=l[b]??l[`${b}:00`]??null;if(h!=null&&h!==""){const f=parseFloat(String(h).replace(",","."));isNaN(f)||o.push(f)}return{hour:b,label:`${b}:00`,value:h!=null&&h!==""?String(h):null}}),i=Array.from({length:12}).map((d,r)=>{const h=(r+12).toString().padStart(2,"0"),f=l[h]??l[`${h}:00`]??null;if(f!=null&&f!==""){const k=parseFloat(String(f).replace(",","."));isNaN(k)||o.push(k)}return{hour:h,label:`${h}:00`,value:f!=null&&f!==""?String(f):null}}),g=[];Object.entries(l).forEach(([d,r])=>{if(d.includes(":")&&!d.endsWith(":00")&&r!==""&&r!==null&&r!==void 0){g.push({time:d,value:String(r)});const b=parseFloat(String(r).replace(",","."));isNaN(b)||o.push(b)}}),g.sort((d,r)=>d.time.localeCompare(r.time));const s=o.length>0?Math.min(...o):null,c=o.length>0?Math.max(...o):null,v=o.length>0?Number((o.reduce((d,r)=>d+r,0)/o.length).toFixed(1)):null;return{tanggal:t.tanggal,tanggalFormatted:W(t.tanggal),jamData:l,row1:x,row2:i,customEntries:g,minTemp:s,maxTemp:c,avgTemp:v,count:o.length}})}function Y(a,n="",t="LEMBAR PEMANTAUAN SUHU & PLUG IN/OUT REEFER"){var T,_,$,E,p,w,u;const l=C(a),o=a.container_number||"-",x=a.size||a.price_type||"20ft / 40ft",i=a.order_id||((T=a.order)==null?void 0:T.order_id)||"-",g=a.no_aju||((_=a.order)==null?void 0:_.no_aju)||"-",s=a.customer_name||((E=($=a.order)==null?void 0:$.customer)==null?void 0:E.name)||"-",c=a.shipper_name||((w=(p=a.order)==null?void 0:p.shipper)==null?void 0:w.name)||"-",v=a.commodity||"REEFER COMMODITY",d=a.service_type||((u=a.product)==null?void 0:u.service_type)||"PLUG IN & MONITORING SUHU",r=[];Array.isArray(a.additional_services)&&r.push(...a.additional_services),Array.isArray(a.additional_products)&&a.additional_products.forEach(m=>{m!=null&&m.service_type&&!r.includes(m.service_type)&&r.push(m.service_type)});const b=j(a.entry_date),h=a.exit_date?j(a.exit_date):"Sedang di Depo",f=j(a.start_plug_in),k=a.plug_out?j(a.plug_out):a.start_plug_in?"SEDANG MENYALA / AKTIF":"Belum Plug In";let N="-";if(a.plug_duration_minutes!==null&&a.plug_duration_minutes!==void 0){const m=Math.floor(a.plug_duration_minutes/60),D=a.plug_duration_minutes%60;N=`${m} Jam ${D} Menit (${a.plug_duration_minutes} mnt)`}else a.start_plug_in&&!a.plug_out&&(N="Sedang berjalan...");const A=a.total_shifts!==null&&a.total_shifts!==void 0?`${a.total_shifts} Shift`:"-",S=new Date().toLocaleString("id-ID",{dateStyle:"medium",timeStyle:"short"}),P=`${window.location.origin}/logo.png`;return`<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <title>Lembar Suhu - ${o}</title>
    <style>
        @page {
            size: A4 portrait;
            margin: 10mm 12mm 12mm 12mm;
        }
        *, *::before, *::after {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
        }
        html, body {
            background: #ffffff !important;
            font-family: Arial, "Helvetica Neue", Helvetica, sans-serif !important;
            color: #000000 !important;
            font-size: 8.5pt;
            line-height: 1.25;
        }
        .page-container {
            width: 100%;
        }

        /* Kop Surat Resmi */
        .kop-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2.5px solid #000000;
            padding-bottom: 2.5mm;
            margin-bottom: 3mm;
        }
        .kop-brand {
            display: flex;
            align-items: center;
            gap: 3.5mm;
        }
        .kop-logo {
            height: 48px;
            max-height: 48px;
            width: auto;
            max-width: 52px;
            object-fit: contain;
            filter: grayscale(100%) contrast(150%);
        }
        .kop-company {
            display: flex;
            flex-direction: column;
        }
        .company-name {
            font-size: 14pt;
            font-weight: 900;
            letter-spacing: 0.2px;
            color: #000000;
            line-height: 1.1;
        }
        .company-sub {
            font-size: 8pt;
            font-weight: 700;
            color: #333333;
            letter-spacing: 0.3px;
            margin-top: 1px;
        }
        .company-address {
            font-size: 7.5pt;
            color: #222222;
            margin-top: 1px;
            line-height: 1.2;
        }
        .kop-doc-box {
            text-align: right;
            border-left: 1.5px solid #000;
            padding-left: 3.5mm;
        }
        .doc-title {
            font-size: 12pt;
            font-weight: 900;
            letter-spacing: 0.5px;
            color: #000000;
            line-height: 1.15;
            text-transform: uppercase;
        }
        .doc-subtitle {
            font-size: 7.5pt;
            font-weight: 800;
            color: #444444;
            letter-spacing: 0.8px;
            margin-top: 1px;
            text-transform: uppercase;
        }
        .doc-meta {
            font-size: 7pt;
            color: #555555;
            margin-top: 2px;
        }

        /* 3-Column Container Info Card */
        .info-card {
            width: 100%;
            border: 1.5px solid #000000;
            border-collapse: collapse;
            margin-bottom: 2.5mm;
        }
        .info-card td {
            border: 1px solid #000000;
            padding: 2mm 2.5mm;
            vertical-align: top;
            font-size: 8pt;
        }
        .info-label {
            font-size: 7pt;
            font-weight: 700;
            color: #444444;
            text-transform: uppercase;
            letter-spacing: 0.3px;
        }
        .info-value {
            font-weight: 900;
            color: #000000;
            margin-top: 0.5mm;
            font-size: 8.5pt;
        }
        .cont-num-hero {
            font-size: 14pt;
            font-weight: 900;
            letter-spacing: 0.5px;
            color: #000000;
            line-height: 1.1;
        }

        /* Operational Plug-In Box */
        .plug-card {
            width: 100%;
            border: 1.5px solid #000000;
            background-color: #f8fafc;
            border-collapse: collapse;
            margin-bottom: 3.5mm;
        }
        .plug-card td {
            border: 1px solid #000000;
            padding: 2mm 2.5mm;
            text-align: center;
            vertical-align: middle;
        }
        .plug-title {
            font-size: 7pt;
            font-weight: 800;
            color: #444444;
            text-transform: uppercase;
            letter-spacing: 0.4px;
        }
        .plug-val {
            font-size: 8.5pt;
            font-weight: 900;
            color: #000000;
            margin-top: 1px;
        }
        .plug-shift-highlight {
            font-size: 11pt;
            font-weight: 900;
            color: #000000;
        }

        /* Section Title Bar */
        .section-bar {
            font-size: 8pt;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border-bottom: 1.5px solid #000000;
            padding-bottom: 1mm;
            margin-bottom: 2mm;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        /* Day Block */
        .day-block {
            page-break-inside: avoid;
            break-inside: avoid;
            margin-bottom: 3mm;
            border: 1.5px solid #000000;
        }
        .day-header {
            background-color: #e2e8f0;
            padding: 1.5mm 2.5mm;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1.5px solid #000000;
        }
        .day-date {
            font-size: 8.5pt;
            font-weight: 900;
            color: #000000;
        }
        .day-stats {
            font-size: 7.5pt;
            font-weight: 800;
            color: #1e293b;
            letter-spacing: 0.2px;
        }

        /* Matrix Table 12 columns per row */
        .matrix-table {
            width: 100%;
            border-collapse: collapse;
            table-layout: fixed;
        }
        .matrix-table th {
            background-color: #f1f5f9;
            border: 1px solid #000000;
            padding: 1.2mm 0.5mm;
            text-align: center;
            font-size: 7pt;
            font-weight: 800;
            color: #334155;
            width: 8.33%;
        }
        .matrix-table td {
            border: 1px solid #000000;
            padding: 1.6mm 0.5mm;
            text-align: center;
            font-size: 8.5pt;
            font-weight: 800;
            color: #000000;
            width: 8.33%;
            height: 6mm;
        }
        .temp-has-val {
            font-weight: 900;
            color: #000000;
        }
        .temp-empty {
            color: #94a3b8;
            font-size: 7.5pt;
            font-weight: normal;
        }

        /* Custom Minute Readings */
        .custom-entries-row {
            padding: 1.5mm 2.5mm;
            background-color: #ffffff;
            border-top: 1px solid #000000;
            font-size: 7.5pt;
            color: #1e293b;
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 2mm;
        }
        .custom-chip {
            display: inline-block;
            border: 1px solid #000000;
            padding: 0.5mm 1.5mm;
            border-radius: 2px;
            font-weight: 800;
            background-color: #f8fafc;
        }

        /* Field Notes Box */
        .notes-card {
            border: 1.5px solid #000000;
            padding: 2mm 2.5mm;
            margin-top: 2.5mm;
            page-break-inside: avoid;
            break-inside: avoid;
        }
        .notes-title {
            font-size: 7pt;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.4px;
            color: #333333;
        }
        .notes-content {
            font-size: 7.5pt;
            color: #111111;
            margin-top: 1mm;
            line-height: 1.3;
        }

        /* Signatures Grid */
        .signatures-grid {
            width: 100%;
            border: 1.5px solid #000000;
            border-collapse: collapse;
            margin-top: 3.5mm;
            page-break-inside: avoid;
            break-inside: avoid;
        }
        .signatures-grid td {
            width: 33.33%;
            border: 1px solid #000000;
            text-align: center;
            vertical-align: top;
            padding: 2mm 2mm;
        }
        .sig-role {
            font-size: 8pt;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 0.3px;
            color: #000000;
        }
        .sig-sub {
            font-size: 7pt;
            color: #555555;
            margin-top: 0.5mm;
        }
        .sig-space {
            height: 18mm;
        }
        .sig-line {
            font-size: 8pt;
            font-weight: 900;
            color: #000000;
        }
        .sig-date {
            font-size: 7pt;
            color: #444444;
            margin-top: 1mm;
        }

        /* Bottom Footer */
        .page-footer {
            margin-top: 3mm;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 6.5pt;
            color: #666666;
            border-top: 1px dashed #aaaaaa;
            padding-top: 1.5mm;
        }
    </style>
</head>
<body>
    <div class="page-container">
        <!-- Header Kop Surat -->
        <div class="kop-header">
            <div class="kop-brand">
                <img src="${P}" alt="Logo PT. Depo Surabaya Sejahtera" class="kop-logo" />
                <div class="kop-company">
                    <div class="company-name">PT. DEPO SURABAYA SEJAHTERA</div>
                    <div class="company-sub">DEPO CONTAINER & REEFER COLD STORAGE SERVICES</div>
                    <div class="company-address">
                        Jl. Tanjung Sadari No. 90 (Tanjung Batu No. 1), Surabaya &bull; Telp. 031-353 9484, 031-3539485 &bull; Fax. 031-3539482
                    </div>
                </div>
            </div>
            <div class="kop-doc-box">
                <div class="doc-title">${t}</div>
                <div class="doc-subtitle">REEFER TEMPERATURE LOG SHEET</div>
                <div class="doc-meta">Tgl Cetak: ${S} WIB</div>
            </div>
        </div>

        <!-- 3-Column Info Card Kontainer & Order -->
        <table class="info-card">
            <tbody>
                <tr>
                    <td style="width: 36%;">
                        <div class="info-label">Nomor Kontainer</div>
                        <div class="cont-num-hero">${o}</div>
                        <div style="margin-top: 1.5mm; display: flex; gap: 2mm;">
                            <div>
                                <span class="info-label">Ukuran / Tipe:</span>
                                <span class="info-value" style="display: block;">${x}</span>
                            </div>
                            <div style="margin-left: 2mm;">
                                <span class="info-label">Komoditi:</span>
                                <span class="info-value" style="display: block;">${v}</span>
                            </div>
                        </div>
                    </td>
                    <td style="width: 32%;">
                        <div class="info-label">Order & Registrasi</div>
                        <div class="info-value">Order ID: ${i}</div>
                        ${g!=="-"?`<div class="info-value" style="margin-top: 1px;">No. AJU: ${g}</div>`:""}
                        <div style="margin-top: 1.5mm;">
                            <span class="info-label">Layanan Operasional:</span>
                            <span class="info-value" style="display: block;">${d}</span>
                            ${r.length>0?`<div style="font-size: 7pt; color: #444; margin-top: 1px;">+ ${r.join(", ")}</div>`:""}
                        </div>
                    </td>
                    <td style="width: 32%;">
                        <div class="info-label">Pihak Terkait & Status Gate</div>
                        <div class="info-value">Cust: ${s}</div>
                        ${c!=="-"?`<div style="font-size: 7.5pt; color: #333; font-weight: 700;">Shipper: ${c}</div>`:""}
                        <div style="margin-top: 1.5mm; font-size: 7.5pt; line-height: 1.25;">
                            <div><strong style="color: #444;">Gate In:</strong> ${b}</div>
                            <div><strong style="color: #444;">Gate Out:</strong> ${h}</div>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- Ringkasan Operasional Plug In & Shift -->
        <table class="plug-card">
            <tbody>
                <tr>
                    <td style="width: 25%;">
                        <div class="plug-title">Start Plug In</div>
                        <div class="plug-val">${f}</div>
                    </td>
                    <td style="width: 25%;">
                        <div class="plug-title">Plug Out</div>
                        <div class="plug-val">${k}</div>
                    </td>
                    <td style="width: 25%;">
                        <div class="plug-title">Total Durasi Plug In</div>
                        <div class="plug-val">${N}</div>
                    </td>
                    <td style="width: 25%; background-color: #f1f5f9;">
                        <div class="plug-title">Total Tagihan Shift</div>
                        <div class="plug-shift-highlight">${A}</div>
                        <div style="font-size: 6.5pt; color: #64748b; margin-top: 1px;">(1 Shift = 8 Jam 45 Menit)</div>
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- Header Section Catatan Rekaman Suhu -->
        <div class="section-bar">
            <span>RIWAYAT PENCATATAN SUHU 24 JAM PER HARI (&deg;C)</span>
            <span>Total: ${l.length} Hari Pencatatan</span>
        </div>

        <!-- Render Tiap Hari -->
        ${l.length===0?`<div style="border: 1px dashed #999; padding: 6mm; text-align: center; font-size: 8.5pt; color: #666; margin-bottom: 4mm;">
                    Belum ada riwayat pencatatan suhu 24 jam yang tersimpan untuk kontainer ini.
                </div>`:l.map(m=>{const D=m.minTemp!==null?`${m.minTemp}&deg;C`:"-",O=m.maxTemp!==null?`${m.maxTemp}&deg;C`:"-",M=m.avgTemp!==null?`${m.avgTemp}&deg;C`:"-";return`
            <div class="day-block">
                <!-- Baris Tanggal & Stats -->
                <div class="day-header">
                    <span class="day-date">TANGGAL: ${m.tanggalFormatted.toUpperCase()}</span>
                    <span class="day-stats">Statistik Suhu: Min: ${D} | Max: ${O} | Rata-rata: ${M} | ${m.count} Jam Tercatat</span>
                </div>

                <!-- Baris 1: Jam 00:00 s/d 11:00 -->
                <table class="matrix-table">
                    <thead>
                        <tr>
                            ${m.row1.map(y=>`<th>${y.label}</th>`).join("")}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            ${m.row1.map(y=>y.value!==null?`<td class="temp-has-val">${y.value}&deg;C</td>`:'<td class="temp-empty">-</td>').join("")}
                        </tr>
                    </tbody>
                </table>

                <!-- Baris 2: Jam 12:00 s/d 23:00 -->
                <table class="matrix-table" style="border-top: none;">
                    <thead>
                        <tr>
                            ${m.row2.map(y=>`<th>${y.label}</th>`).join("")}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            ${m.row2.map(y=>y.value!==null?`<td class="temp-has-val">${y.value}&deg;C</td>`:'<td class="temp-empty">-</td>').join("")}
                        </tr>
                    </tbody>
                </table>

                <!-- Entri Khusus Non-Jam Bulat (jika ada) -->
                ${m.customEntries.length>0?`
                <div class="custom-entries-row">
                    <strong>Pencatatan Waktu Khusus:</strong>
                    ${m.customEntries.map(y=>`<span class="custom-chip">${y.time} WIB: ${y.value}&deg;C</span>`).join(" ")}
                </div>`:""}
            </div>
            `}).join("")}

        <!-- Keterangan / Catatan Tambahan Lapangan -->
        <div class="notes-card">
            <div class="notes-title">Keterangan / Catatan Operasional Reefer:</div>
            <div class="notes-content">
                ${n.trim()!==""?n.replace(/\n/g,"<br/>"):"1. Pemantauan suhu dilaksanakan secara rutin dan berkala oleh petugas piket reefer PT. Depo Surabaya Sejahtera.<br/>2. Tegangan listrik dan pasokan daya generator terjaga dalam ambang batas aman selama masa plugging kontainer.<br/>3. Mohon verifikasi kondisi fisik dan suhu kontainer sebelum meninggalkan depo."}
            </div>
        </div>

        <!-- Kolom Tanda Tangan & Pengesahan (3 Kolom) -->
        <table class="signatures-grid">
            <tbody>
                <tr>
                    <td>
                        <div class="sig-role">Petugas Reefer / Checker</div>
                        <div class="sig-sub">Pencatat Suhu & Plugging</div>
                        <div class="sig-space"></div>
                        <div class="sig-line">( .................................................... )</div>
                        <div class="sig-date">Tgl: .......................................</div>
                    </td>
                    <td>
                        <div class="sig-role">Supervisor / Admin Depo</div>
                        <div class="sig-sub">Verifikasi Shift & Operasional</div>
                        <div class="sig-space"></div>
                        <div class="sig-line">( .................................................... )</div>
                        <div class="sig-date">Tgl: .......................................</div>
                    </td>
                    <td>
                        <div class="sig-role">Penerima / Driver / Shipper</div>
                        <div class="sig-sub">Serah Terima & Konfirmasi</div>
                        <div class="sig-space"></div>
                        <div class="sig-line">( .................................................... )</div>
                        <div class="sig-date">Tgl: .......................................</div>
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- Page Footer -->
        <div class="page-footer">
            <span>PT. DEPO SURABAYA SEJAHTERA &bull; Dokumen Lembar Pemantauan Suhu & Shift Reefer Resmi</span>
            <span>Halaman 1 dari 1 (Dokumen Dicetak Sistem: ${S} WIB)</span>
        </div>
    </div>
</body>
</html>`}function V(a,n="",t){return new Promise((l,o)=>{var x;try{const i=Y(a,n,t),g=document.getElementById("temp-print-iframe");g&&g.remove();const s=document.createElement("iframe");s.id="temp-print-iframe",s.style.position="fixed",s.style.right="0",s.style.bottom="0",s.style.width="0",s.style.height="0",s.style.border="0",s.style.visibility="hidden",document.body.appendChild(s);const c=((x=s.contentWindow)==null?void 0:x.document)||s.contentDocument;if(!c){alert("Gagal menyiapkan pencetakan. Silakan coba lagi."),s.remove(),o(new Error("Cannot access iframe document"));return}c.open(),c.write(i),c.close(),setTimeout(()=>{var v,d;try{(v=s.contentWindow)==null||v.focus(),(d=s.contentWindow)==null||d.print(),l()}catch(r){console.error("Print error:",r),o(r)}finally{setTimeout(()=>{document.body.contains(s)&&s.remove()},1e3)}},300)}catch(i){o(i)}})}function q(a,n="active",t){const l=n==="active"?"Sedang di Depo":n==="out"?"Sudah Keluar Depo":"Semua Kontainer",o=new Date().toLocaleString("id-ID",{dateStyle:"medium",timeStyle:"short"});return`<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <title>Rekap Pemantauan Suhu Reefer Depo</title>
    <style>
        @page {
            size: A4 landscape;
            margin: 10mm 12mm 10mm 12mm;
        }
        *, *::before, *::after {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
        }
        html, body {
            background: #ffffff !important;
            font-family: Arial, "Helvetica Neue", Helvetica, sans-serif !important;
            color: #000000 !important;
            font-size: 8pt;
            line-height: 1.25;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #000;
            padding-bottom: 2.5mm;
            margin-bottom: 3mm;
        }
        .brand {
            display: flex;
            align-items: center;
            gap: 3mm;
        }
        .logo {
            height: 42px;
            width: auto;
            object-fit: contain;
            filter: grayscale(100%) contrast(150%);
        }
        .company-name {
            font-size: 13pt;
            font-weight: 900;
            line-height: 1.1;
        }
        .title-box {
            text-align: right;
        }
        .rekap-title {
            font-size: 12pt;
            font-weight: 900;
            text-transform: uppercase;
        }
        .meta-bar {
            display: flex;
            justify-content: space-between;
            background: #f1f5f9;
            border: 1px solid #000;
            padding: 1.5mm 3mm;
            font-weight: bold;
            font-size: 8pt;
            margin-bottom: 3mm;
        }
        table.rekap-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 7.5pt;
        }
        table.rekap-table th {
            background-color: #e2e8f0;
            border: 1px solid #000;
            padding: 2mm 1.5mm;
            text-align: center;
            font-weight: 900;
            text-transform: uppercase;
        }
        table.rekap-table td {
            border: 1px solid #000;
            padding: 1.8mm 1.5mm;
            vertical-align: middle;
        }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .font-bold { font-weight: bold; }
        .font-mono { font-family: monospace; }
        .signatures {
            margin-top: 5mm;
            display: flex;
            justify-content: space-around;
            page-break-inside: avoid;
        }
        .sig-box {
            width: 35%;
            text-align: center;
            font-size: 8pt;
        }
        .sig-space { height: 18mm; }
    </style>
</head>
<body>
    <div class="header">
        <div class="brand">
            <img src="${`${window.location.origin}/logo.png`}" alt="Logo" class="logo" />
            <div>
                <div class="company-name">PT. DEPO SURABAYA SEJAHTERA</div>
                <div style="font-size: 7.5pt; color: #333;">DEPO CONTAINER & REEFER SERVICES &bull; TANJUNG SADARI SURABAYA</div>
            </div>
        </div>
        <div class="title-box">
            <div class="rekap-title">REKAPITULASI PEMANTAUAN SUHU & PLUGGING REEFER</div>
            <div style="font-size: 7pt; color: #555;">Dicetak pada: ${o} WIB</div>
        </div>
    </div>

    <div class="meta-bar">
        <span>Status Kontainer: <strong>${l}</strong> ${t?`(Pencarian: "${t}")`:""}</span>
        <span>Total Kontainer: <strong>${a.length} Unit</strong></span>
    </div>

    <table class="rekap-table">
        <thead>
            <tr>
                <th style="width: 4%;">No.</th>
                <th style="width: 14%;">No. Kontainer</th>
                <th style="width: 7%;">Size</th>
                <th style="width: 15%;">Customer / Shipper</th>
                <th style="width: 10%;">Order ID</th>
                <th style="width: 11%;">Gate In</th>
                <th style="width: 13%;">Start Plug In</th>
                <th style="width: 13%;">Plug Out</th>
                <th style="width: 8%;">Shift</th>
                <th style="width: 5%;">Status</th>
            </tr>
        </thead>
        <tbody>
            ${a.length===0?'<tr><td colspan="10" class="text-center" style="padding: 6mm;">Tidak ada data kontainer yang sesuai.</td></tr>':a.map((i,g)=>{var d,r,b,h,f;const s=i.customer_name||((r=(d=i.order)==null?void 0:d.customer)==null?void 0:r.name)||"-",c=i.shipper_name||((h=(b=i.order)==null?void 0:b.shipper)==null?void 0:h.name)||"",v=!i.exit_date;return`
                <tr>
                    <td class="text-center">${g+1}</td>
                    <td class="font-bold font-mono" style="font-size: 8.5pt;">${i.container_number}</td>
                    <td class="text-center">${i.price_type||i.size||"-"}</td>
                    <td>
                        <div class="font-bold">${s}</div>
                        ${c&&c!=="-"?`<div style="font-size: 6.5pt; color: #444;">${c}</div>`:""}
                    </td>
                    <td>${i.order_id||((f=i.order)==null?void 0:f.order_id)||"-"}</td>
                    <td class="text-center">${i.entry_date?j(i.entry_date):"-"}</td>
                    <td class="text-center">${i.start_plug_in?j(i.start_plug_in):'<span style="color:#888;">Belum Plug In</span>'}</td>
                    <td class="text-center">${i.plug_out?j(i.plug_out):i.start_plug_in?"<strong>Aktif (In)</strong>":"-"}</td>
                    <td class="text-center font-bold">${i.total_shifts!==null&&i.total_shifts!==void 0?`${i.total_shifts} Shift`:"-"}</td>
                    <td class="text-center font-bold">${v?"Depo":"Keluar"}</td>
                </tr>
                `}).join("")}
        </tbody>
    </table>

    <div class="signatures">
        <div class="sig-box">
            <div>Dibuat Oleh,</div>
            <div style="font-size: 7pt; color: #555;">Petugas Checker / Reefer</div>
            <div class="sig-space"></div>
            <div class="font-bold">( .................................................... )</div>
            <div style="font-size: 7pt; margin-top: 1mm;">Tgl: .......................................</div>
        </div>
        <div class="sig-box">
            <div>Mengetahui & Memverifikasi,</div>
            <div style="font-size: 7pt; color: #555;">Kepala Operasional / Admin Depo</div>
            <div class="sig-space"></div>
            <div class="font-bold">( .................................................... )</div>
            <div style="font-size: 7pt; margin-top: 1mm;">Tgl: .......................................</div>
        </div>
    </div>
</body>
</html>`}function ie(a,n="active",t){return new Promise((l,o)=>{var x;try{const i=q(a,n,t),g=document.getElementById("temp-rekap-print-iframe");g&&g.remove();const s=document.createElement("iframe");s.id="temp-rekap-print-iframe",s.style.position="fixed",s.style.right="0",s.style.bottom="0",s.style.width="0",s.style.height="0",s.style.border="0",s.style.visibility="hidden",document.body.appendChild(s);const c=((x=s.contentWindow)==null?void 0:x.document)||s.contentDocument;if(!c){alert("Gagal menyiapkan pencetakan rekap."),s.remove(),o(new Error("Cannot access iframe"));return}c.open(),c.write(i),c.close(),setTimeout(()=>{var v,d;try{(v=s.contentWindow)==null||v.focus(),(d=s.contentWindow)==null||d.print(),l()}catch(r){console.error("Rekap print error:",r),o(r)}finally{setTimeout(()=>{document.body.contains(s)&&s.remove()},1e3)}},300)}catch(i){o(i)}})}function ne({isOpen:a,onClose:n,data:t}){var A,S,P,T,_,$,E;const[l,o]=R.useState(""),[x,i]=R.useState(!1);if(R.useEffect(()=>{a&&o(`1. Pemantauan suhu dilaksanakan secara rutin dan berkala oleh petugas piket reefer PT. Depo Surabaya Sejahtera.
2. Pasokan daya listrik dan temperatur ruangan pendingin terjaga dalam ambang batas aman operasional.
3. Harap memeriksa kondisi fisik dan temperatur kontainer sebelum keluar pintu depo.`)},[a,t]),!t)return null;const g=C(t),s=t.container_number||"-",c=t.size||t.price_type||"20ft / 40ft",v=t.order_id||((A=t.order)==null?void 0:A.order_id)||"-",d=t.no_aju||((S=t.order)==null?void 0:S.no_aju)||"-",r=t.customer_name||((T=(P=t.order)==null?void 0:P.customer)==null?void 0:T.name)||"-",b=t.shipper_name||(($=(_=t.order)==null?void 0:_.shipper)==null?void 0:$.name)||"-",h=t.commodity||"REEFER COMMODITY",f=t.service_type||((E=t.product)==null?void 0:E.service_type)||"PLUG IN & MONITORING SUHU";let k="-";if(t.plug_duration_minutes!==null&&t.plug_duration_minutes!==void 0){const p=Math.floor(t.plug_duration_minutes/60),w=t.plug_duration_minutes%60;k=`${p}j ${w}m (${t.plug_duration_minutes} mnt)`}else t.start_plug_in&&!t.plug_out&&(k="Sedang berjalan...");const N=async()=>{i(!0);try{await V(t,l)}catch(p){console.error("Print failed:",p)}finally{i(!1)}};return e.jsx(F,{open:a,onOpenChange:p=>!p&&n(),children:e.jsxs(U,{className:"max-w-4xl max-h-[92vh] flex flex-col p-0 overflow-hidden",children:[e.jsx(B,{className:"p-4 sm:p-5 border-b border-gray-100 bg-gray-50/75 shrink-0",children:e.jsxs("div",{className:"flex flex-col sm:flex-row sm:items-center justify-between gap-3 pr-6",children:[e.jsxs("div",{className:"flex items-center gap-2.5",children:[e.jsx("div",{className:"h-9 w-9 rounded-lg bg-orange-100 flex items-center justify-center text-orange-700",children:e.jsx(G,{className:"h-5 w-5"})}),e.jsxs("div",{children:[e.jsx(L,{className:"text-base sm:text-lg font-bold text-gray-900",children:"Cetak Lembar Pemantauan Suhu & Plugging"}),e.jsxs("p",{className:"text-xs text-gray-500 mt-0.5",children:["Kontainer ",e.jsx("span",{className:"font-bold text-gray-800",children:s})," • ",r]})]})]}),e.jsx("div",{className:"flex items-center gap-2",children:e.jsxs(z,{size:"sm",onClick:N,disabled:x,className:"bg-gray-900 hover:bg-black text-white font-semibold text-xs h-9 px-4 gap-1.5 shadow-sm",children:[e.jsx(I,{className:"h-4 w-4"}),x?"Menyiapkan...":"Cetak / Simpan PDF"]})})]})}),e.jsxs("div",{className:"flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-100/60 space-y-4",children:[e.jsxs("div",{className:"max-w-[780px] mx-auto bg-white rounded-lg shadow-md border border-gray-200 p-5 sm:p-8 space-y-4 text-gray-900",children:[e.jsxs("div",{className:"flex items-center justify-between border-b-2 border-black pb-3",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("img",{src:"/logo.png",alt:"Logo Depo",className:"h-11 w-auto max-w-[50px] object-contain filter grayscale contrast-150 shrink-0"}),e.jsxs("div",{children:[e.jsx("h2",{className:"text-base sm:text-lg font-black tracking-tight leading-tight",children:"PT. DEPO SURABAYA SEJAHTERA"}),e.jsx("p",{className:"text-[10px] font-bold text-gray-700 tracking-wide uppercase mt-0.5",children:"DEPO CONTAINER & REEFER COLD STORAGE SERVICES"}),e.jsx("p",{className:"text-[9px] text-gray-600 leading-tight",children:"Jl. Tanjung Sadari No. 90 (Tanjung Batu No. 1), Surabaya • Telp. 031-353 9484 • Fax. 031-3539482"})]})]}),e.jsxs("div",{className:"text-right border-l-2 border-black pl-3 hidden sm:block",children:[e.jsx("div",{className:"text-xs font-black tracking-wider uppercase",children:"LEMBAR PEMANTAUAN SUHU"}),e.jsx("div",{className:"text-[9px] font-bold text-gray-600 uppercase",children:"REEFER TEMPERATURE LOG SHEET"}),e.jsx("div",{className:"text-[8px] text-gray-500 mt-1",children:"Format: A4 Portrait"})]})]}),e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-3 border border-black text-xs divide-y sm:divide-y-0 sm:divide-x divide-black",children:[e.jsxs("div",{className:"p-2.5 space-y-1",children:[e.jsx("span",{className:"text-[10px] font-bold text-gray-500 uppercase block",children:"No. Kontainer"}),e.jsx("div",{className:"text-base font-black tracking-wide",children:s}),e.jsxs("div",{className:"text-[11px] text-gray-700",children:["Size: ",e.jsx("strong",{children:c})," • ",h]})]}),e.jsxs("div",{className:"p-2.5 space-y-1",children:[e.jsx("span",{className:"text-[10px] font-bold text-gray-500 uppercase block",children:"Order & Layanan"}),e.jsxs("div",{className:"font-bold",children:["Order ID: ",v]}),d!=="-"&&e.jsxs("div",{className:"text-[11px] text-gray-700",children:["AJU: ",d]}),e.jsx("div",{className:"text-[11px] text-gray-800 font-semibold",children:f})]}),e.jsxs("div",{className:"p-2.5 space-y-1",children:[e.jsx("span",{className:"text-[10px] font-bold text-gray-500 uppercase block",children:"Customer & Gate"}),e.jsx("div",{className:"font-bold truncate",children:r}),b!=="-"&&e.jsx("div",{className:"text-[11px] text-gray-600 truncate",children:b}),e.jsxs("div",{className:"text-[10px] text-gray-600",children:["In: ",j(t.entry_date)]})]})]}),e.jsxs("div",{className:"grid grid-cols-2 sm:grid-cols-4 border border-black bg-slate-50/80 divide-x divide-black text-center text-xs",children:[e.jsxs("div",{className:"p-2",children:[e.jsx("span",{className:"text-[9px] font-bold text-gray-500 uppercase block",children:"Start Plug In"}),e.jsx("span",{className:"font-bold text-[11px] mt-0.5 block",children:j(t.start_plug_in)})]}),e.jsxs("div",{className:"p-2",children:[e.jsx("span",{className:"text-[9px] font-bold text-gray-500 uppercase block",children:"Plug Out"}),e.jsx("span",{className:"font-bold text-[11px] mt-0.5 block",children:t.plug_out?j(t.plug_out):t.start_plug_in?"AKTIF PLUGGED IN":"-"})]}),e.jsxs("div",{className:"p-2",children:[e.jsx("span",{className:"text-[9px] font-bold text-gray-500 uppercase block",children:"Total Durasi"}),e.jsx("span",{className:"font-bold text-[11px] mt-0.5 block",children:k})]}),e.jsxs("div",{className:"p-2 bg-slate-100",children:[e.jsx("span",{className:"text-[9px] font-bold text-gray-500 uppercase block",children:"Total Tagihan Shift"}),e.jsx("span",{className:"font-black text-sm text-gray-900 mt-0.5 block",children:t.total_shifts!==null&&t.total_shifts!==void 0?`${t.total_shifts} Shift`:"-"}),e.jsx("span",{className:"text-[8px] text-gray-500 block",children:"(1 Shift = 8j 45m)"})]})]}),e.jsxs("div",{className:"space-y-3 pt-1",children:[e.jsxs("div",{className:"text-xs font-black uppercase tracking-wider flex items-center justify-between border-b pb-1",children:[e.jsxs("span",{children:["Pencatatan Suhu 24 Jam (",g.length," Hari)"]}),e.jsx("span",{className:"text-[10px] text-gray-500 font-semibold",children:"Satuan: Derajat Celcius (°C)"})]}),g.length===0?e.jsx("div",{className:"p-6 text-center text-xs text-gray-500 italic border border-dashed rounded",children:"Belum ada data rekaman suhu yang tercatat."}):g.map((p,w)=>e.jsxs("div",{className:"border border-black rounded-xs overflow-hidden",children:[e.jsxs("div",{className:"bg-slate-200/80 px-2.5 py-1 text-[11px] font-bold flex items-center justify-between border-b border-black",children:[e.jsxs("span",{children:["Tanggal: ",p.tanggalFormatted]}),e.jsxs("span",{className:"text-[10px] text-gray-700",children:["Min: ",p.minTemp!==null?`${p.minTemp}°C`:"-"," • Max:"," ",p.maxTemp!==null?`${p.maxTemp}°C`:"-"," • Avg:"," ",p.avgTemp!==null?`${p.avgTemp}°C`:"-"]})]}),e.jsxs("table",{className:"w-full text-center border-collapse text-[10px]",children:[e.jsx("thead",{children:e.jsx("tr",{className:"bg-slate-50 border-b border-black text-[9px] text-gray-600",children:p.row1.map(u=>e.jsx("th",{className:"border-r border-black last:border-r-0 py-0.5",children:u.label},u.hour))})}),e.jsx("tbody",{children:e.jsx("tr",{className:"border-b border-black",children:p.row1.map(u=>e.jsx("td",{className:`border-r border-black last:border-r-0 py-1 font-semibold ${u.value!==null?"font-bold text-gray-900 bg-orange-50/40":"text-gray-400"}`,children:u.value!==null?`${u.value}°`:"-"},u.hour))})})]}),e.jsxs("table",{className:"w-full text-center border-collapse text-[10px]",children:[e.jsx("thead",{children:e.jsx("tr",{className:"bg-slate-50 border-b border-black text-[9px] text-gray-600",children:p.row2.map(u=>e.jsx("th",{className:"border-r border-black last:border-r-0 py-0.5",children:u.label},u.hour))})}),e.jsx("tbody",{children:e.jsx("tr",{children:p.row2.map(u=>e.jsx("td",{className:`border-r border-black last:border-r-0 py-1 font-semibold ${u.value!==null?"font-bold text-gray-900 bg-orange-50/40":"text-gray-400"}`,children:u.value!==null?`${u.value}°`:"-"},u.hour))})})]}),p.customEntries.length>0&&e.jsxs("div",{className:"bg-white px-2 py-1 border-t border-black text-[10px] flex items-center gap-1.5 flex-wrap",children:[e.jsx("span",{className:"font-bold text-gray-700",children:"Waktu Khusus:"}),p.customEntries.map((u,m)=>e.jsxs("span",{className:"px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded text-[9px] font-bold",children:[u.time,": ",u.value,"°C"]},m))]})]},w))]}),e.jsxs("div",{className:"grid grid-cols-3 border border-black divide-x divide-black text-center text-xs mt-3 pt-1",children:[e.jsxs("div",{className:"p-2",children:[e.jsx("div",{className:"font-bold uppercase text-[10px]",children:"Petugas Reefer"}),e.jsx("div",{className:"text-[9px] text-gray-500",children:"Pencatat Suhu"}),e.jsx("div",{className:"h-12"}),e.jsx("div",{className:"font-bold text-[10px]",children:"( ................................ )"})]}),e.jsxs("div",{className:"p-2",children:[e.jsx("div",{className:"font-bold uppercase text-[10px]",children:"Supervisor / Admin"}),e.jsx("div",{className:"text-[9px] text-gray-500",children:"Verifikasi Shift"}),e.jsx("div",{className:"h-12"}),e.jsx("div",{className:"font-bold text-[10px]",children:"( ................................ )"})]}),e.jsxs("div",{className:"p-2",children:[e.jsx("div",{className:"font-bold uppercase text-[10px]",children:"Driver / Penerima"}),e.jsx("div",{className:"text-[9px] text-gray-500",children:"Serah Terima"}),e.jsx("div",{className:"h-12"}),e.jsx("div",{className:"font-bold text-[10px]",children:"( ................................ )"})]})]})]}),e.jsxs("div",{className:"max-w-[780px] mx-auto bg-white rounded-lg border border-gray-200 p-4 space-y-2",children:[e.jsxs(J,{htmlFor:"print-notes",className:"text-xs font-bold text-gray-800 uppercase tracking-wide flex items-center gap-1.5",children:[e.jsx(K,{className:"h-3.5 w-3.5"}),"Sesuaikan Catatan Keterangan Lapangan (Opsional):"]}),e.jsx("textarea",{id:"print-notes",value:l,onChange:p=>o(p.target.value),rows:3,className:"w-full rounded-md border border-gray-300 p-2 text-xs focus:ring-1 focus:ring-black focus:outline-none",placeholder:"Tulis catatan operasional yang akan tercetak pada lembar pemantauan suhu..."})]})]}),e.jsxs(H,{className:"p-3.5 sm:p-4 border-t border-gray-200 bg-white shrink-0 flex flex-row justify-between items-center",children:[e.jsxs("div",{className:"text-xs text-gray-500",children:["Tips: Pilih ",e.jsx("strong",{children:'"Save as PDF"'})," / ",e.jsx("strong",{children:'"Simpan sebagai PDF"'})," pada dialog print browser."]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(z,{variant:"outline",size:"sm",onClick:n,className:"h-8 text-xs",children:"Tutup"}),e.jsxs(z,{size:"sm",onClick:N,disabled:x,className:"h-8 text-xs bg-gray-900 hover:bg-black text-white font-semibold gap-1.5",children:[e.jsx(I,{className:"h-3.5 w-3.5"}),x?"Memproses...":"Cetak / Simpan PDF"]})]})]})]})})}export{ne as T,ie as e};
