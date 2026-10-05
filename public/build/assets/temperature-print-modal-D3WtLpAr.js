import"./app-CUBp0OED.js";function x(t){if(!t)return"-";const n=String(t).match(/^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2}))?/);if(n){const d=["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"],v=n[3],c=d[parseInt(n[2],10)-1]||n[2],o=n[1],u=n[4]&&n[5]?`, ${n[4]}:${n[5]} WIB`:"";return`${v} ${c} ${o}${u}`}const i=new Date(t);if(isNaN(i.getTime()))return String(t);const r=["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"],s=i.getDate().toString().padStart(2,"0"),h=r[i.getMonth()],a=i.getFullYear(),p=i.getHours().toString().padStart(2,"0"),e=i.getMinutes().toString().padStart(2,"0");return`${s} ${h} ${a}, ${p}:${e} WIB`}function M(t){try{const n=t.split("-");if(n.length===3){const i=parseInt(n[0],10),r=parseInt(n[1],10)-1,s=parseInt(n[2],10),h=new Date(i,r,s),a=["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"],p=["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"],e=a[h.getDay()]||"",d=p[r]||n[1];return`${e}, ${s.toString().padStart(2,"0")} ${d} ${i}`}}catch{}return t}function j(t){if(!t)return[];const n=[];return Array.isArray(t.rekam_suhu)&&t.rekam_suhu.length>0?t.rekam_suhu.forEach(i=>{i&&i.tanggal&&n.push({tanggal:i.tanggal,jam_data:i.jam_data||{}})}):t.temperature&&typeof t.temperature=="object"&&Object.entries(t.temperature).forEach(([i,r])=>{n.push({tanggal:i,jam_data:r||{}})}),n.sort((i,r)=>i.tanggal.localeCompare(r.tanggal)),n.map(i=>{const r=i.jam_data||{},s=[],h=Array.from({length:12}).map((c,o)=>{const u=o.toString().padStart(2,"0"),m=r[u]??r[`${u}:00`]??null;if(m!=null&&m!==""){const g=parseFloat(String(m).replace(",","."));isNaN(g)||s.push(g)}return{hour:u,label:`${u}:00`,value:m!=null&&m!==""?String(m):null}}),a=Array.from({length:12}).map((c,o)=>{const m=(o+12).toString().padStart(2,"0"),g=r[m]??r[`${m}:00`]??null;if(g!=null&&g!==""){const y=parseFloat(String(g).replace(",","."));isNaN(y)||s.push(y)}return{hour:m,label:`${m}:00`,value:g!=null&&g!==""?String(g):null}}),p=[];Object.entries(r).forEach(([c,o])=>{if(c.includes(":")&&!c.endsWith(":00")&&o!==""&&o!==null&&o!==void 0){p.push({time:c,value:String(o)});const u=parseFloat(String(o).replace(",","."));isNaN(u)||s.push(u)}}),p.sort((c,o)=>c.time.localeCompare(o.time));const e=s.length>0?Math.min(...s):null,d=s.length>0?Math.max(...s):null,v=s.length>0?Number((s.reduce((c,o)=>c+o,0)/s.length).toFixed(1)):null;return{tanggal:i.tanggal,tanggalFormatted:M(i.tanggal),jamData:r,row1:h,row2:a,customEntries:p,minTemp:e,maxTemp:d,avgTemp:v,count:s.length}})}function C(t,n="",i="LEMBAR PEMANTAUAN SUHU & PLUG IN/OUT REEFER"){var _,A,E,z,D,P,R;const r=j(t),s=t.container_number||"-",h=t.size||t.price_type||"20ft / 40ft",a=t.order_id||((_=t.order)==null?void 0:_.order_id)||"-",p=t.no_aju||((A=t.order)==null?void 0:A.no_aju)||"-",e=t.customer_name||((z=(E=t.order)==null?void 0:E.customer)==null?void 0:z.name)||"-",d=t.shipper_name||((P=(D=t.order)==null?void 0:D.shipper)==null?void 0:P.name)||"-",v=t.commodity||"REEFER COMMODITY",c=t.service_type||((R=t.product)==null?void 0:R.service_type)||"PLUG IN & MONITORING SUHU",o=[];Array.isArray(t.additional_services)&&o.push(...t.additional_services),Array.isArray(t.additional_products)&&t.additional_products.forEach(l=>{l!=null&&l.service_type&&!o.includes(l.service_type)&&o.push(l.service_type)});const u=x(t.entry_date),m=t.exit_date?x(t.exit_date):"Sedang di Depo",g=x(t.start_plug_in),y=t.plug_out?x(t.plug_out):t.start_plug_in?"SEDANG MENYALA / AKTIF":"Belum Plug In";let $="-",b=t.total_shifts??null;if(t.plug_duration_minutes!==null&&t.plug_duration_minutes!==void 0){const l=Math.floor(t.plug_duration_minutes/60),w=t.plug_duration_minutes%60;$=`${l} Jam ${w} Menit (${t.plug_duration_minutes} mnt)`,(!b||b<1)&&(b=Math.max(1,Math.ceil(t.plug_duration_minutes/(8*60))))}else if(t.start_plug_in&&!t.plug_out)try{const l=new Date(t.start_plug_in.replace(" ","T")).getTime(),w=new Date().getTime(),S=Math.max(0,Math.floor((w-l)/(1e3*60))),k=Math.floor(S/60),f=S%60;$=`${k} Jam ${f} Menit (Sedang berjalan)`,(!b||b<1)&&(b=Math.max(1,Math.ceil(S/(8*60))))}catch{$="Sedang berjalan..."}t.start_plug_in&&(!b||b<1)&&(b=1);const I=b!=null&&b>0?`${b} Shift`:"-",T=new Date().toLocaleString("id-ID",{dateStyle:"medium",timeStyle:"short"}),N=`${window.location.origin}/logo.png`;return`<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <title>Lembar Suhu - ${s}</title>
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
                <img src="${N}" alt="Logo PT. Depo Surabaya Sejahtera" class="kop-logo" />
                <div class="kop-company">
                    <div class="company-name">PT. DEPO SURABAYA SEJAHTERA</div>
                    <div class="company-sub">DEPO CONTAINER & REEFER COLD STORAGE SERVICES</div>
                    <div class="company-address">
                        Jl. Tanjung Sadari No. 90 (Tanjung Batu No. 1), Surabaya &bull; Telp. 031-353 9484, 031-3539485 &bull; Fax. 031-3539482
                    </div>
                </div>
            </div>
            <div class="kop-doc-box">
                <div class="doc-title">${i}</div>
                <div class="doc-subtitle">REEFER TEMPERATURE LOG SHEET</div>
                <div class="doc-meta">Tgl Cetak: ${T} WIB</div>
            </div>
        </div>

        <!-- 3-Column Info Card Kontainer & Order -->
        <table class="info-card">
            <tbody>
                <tr>
                    <td style="width: 36%;">
                        <div class="info-label">Nomor Kontainer</div>
                        <div class="cont-num-hero">${s}</div>
                        <div style="margin-top: 1.5mm; display: flex; gap: 2mm;">
                            <div>
                                <span class="info-label">Ukuran / Tipe:</span>
                                <span class="info-value" style="display: block;">${h}</span>
                            </div>
                            <div style="margin-left: 2mm;">
                                <span class="info-label">Komoditi:</span>
                                <span class="info-value" style="display: block;">${v}</span>
                            </div>
                        </div>
                    </td>
                    <td style="width: 32%;">
                        <div class="info-label">Order & Registrasi</div>
                        <div class="info-value">Order ID: ${a}</div>
                        ${p!=="-"?`<div class="info-value" style="margin-top: 1px;">No. AJU: ${p}</div>`:""}
                        <div style="margin-top: 1.5mm;">
                            <span class="info-label">Layanan Operasional:</span>
                            <span class="info-value" style="display: block;">${c}</span>
                            ${o.length>0?`<div style="font-size: 7pt; color: #444; margin-top: 1px;">+ ${o.join(", ")}</div>`:""}
                        </div>
                    </td>
                    <td style="width: 32%;">
                        <div class="info-label">Pihak Terkait & Status Gate</div>
                        <div class="info-value">Cust: ${e}</div>
                        ${d!=="-"?`<div style="font-size: 7.5pt; color: #333; font-weight: 700;">Shipper: ${d}</div>`:""}
                        <div style="margin-top: 1.5mm; font-size: 7.5pt; line-height: 1.25;">
                            <div><strong style="color: #444;">Gate In:</strong> ${u}</div>
                            <div><strong style="color: #444;">Gate Out:</strong> ${m}</div>
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
                        <div class="plug-val">${g}</div>
                    </td>
                    <td style="width: 25%;">
                        <div class="plug-title">Plug Out</div>
                        <div class="plug-val">${y}</div>
                    </td>
                    <td style="width: 25%;">
                        <div class="plug-title">Total Durasi Plug In</div>
                        <div class="plug-val">${$}</div>
                    </td>
                    <td style="width: 25%; background-color: #f1f5f9;">
                        <div class="plug-title">Total Tagihan Shift</div>
                        <div class="plug-shift-highlight">${I}</div>
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- Header Section Catatan Rekaman Suhu -->
        <div class="section-bar">
            <span>RIWAYAT PENCATATAN SUHU 24 JAM PER HARI (&deg;C)</span>
            <span>Total: ${r.length} Hari Pencatatan</span>
        </div>

        <!-- Render Tiap Hari -->
        ${r.length===0?`<div style="border: 1px dashed #999; padding: 6mm; text-align: center; font-size: 8.5pt; color: #666; margin-bottom: 4mm;">
                    Belum ada riwayat pencatatan suhu 24 jam yang tersimpan untuk kontainer ini.
                </div>`:r.map(l=>{const w=l.minTemp!==null?`${l.minTemp}&deg;C`:"-",S=l.maxTemp!==null?`${l.maxTemp}&deg;C`:"-",k=l.avgTemp!==null?`${l.avgTemp}&deg;C`:"-";return`
            <div class="day-block">
                <!-- Baris Tanggal & Stats -->
                <div class="day-header">
                    <span class="day-date">TANGGAL: ${l.tanggalFormatted.toUpperCase()}</span>
                    <span class="day-stats">Statistik Suhu: Min: ${w} | Max: ${S} | Rata-rata: ${k} | ${l.count} Jam Tercatat</span>
                </div>

                <!-- Baris 1: Jam 00:00 s/d 11:00 -->
                <table class="matrix-table">
                    <thead>
                        <tr>
                            ${l.row1.map(f=>`<th>${f.label}</th>`).join("")}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            ${l.row1.map(f=>f.value!==null?`<td class="temp-has-val">${f.value}&deg;C</td>`:'<td class="temp-empty">-</td>').join("")}
                        </tr>
                    </tbody>
                </table>

                <!-- Baris 2: Jam 12:00 s/d 23:00 -->
                <table class="matrix-table" style="border-top: none;">
                    <thead>
                        <tr>
                            ${l.row2.map(f=>`<th>${f.label}</th>`).join("")}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            ${l.row2.map(f=>f.value!==null?`<td class="temp-has-val">${f.value}&deg;C</td>`:'<td class="temp-empty">-</td>').join("")}
                        </tr>
                    </tbody>
                </table>

                <!-- Entri Khusus Non-Jam Bulat (jika ada) -->
                ${l.customEntries.length>0?`
                <div class="custom-entries-row">
                    <strong>Pencatatan Waktu Khusus:</strong>
                    ${l.customEntries.map(f=>`<span class="custom-chip">${f.time} WIB: ${f.value}&deg;C</span>`).join(" ")}
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
            <span>Halaman 1 dari 1 (Dokumen Dicetak Sistem: ${T} WIB)</span>
        </div>
    </div>
</body>
</html>`}function B(t,n="",i){return new Promise((r,s)=>{var h;try{const a=C(t,n,i),p=document.getElementById("temp-print-iframe");p&&p.remove();const e=document.createElement("iframe");e.id="temp-print-iframe",e.style.position="fixed",e.style.right="0",e.style.bottom="0",e.style.width="0",e.style.height="0",e.style.border="0",e.style.visibility="hidden",document.body.appendChild(e);const d=((h=e.contentWindow)==null?void 0:h.document)||e.contentDocument;if(!d){alert("Gagal menyiapkan pencetakan. Silakan coba lagi."),e.remove(),s(new Error("Cannot access iframe document"));return}d.open(),d.write(a),d.close(),setTimeout(()=>{var v,c;try{(v=e.contentWindow)==null||v.focus(),(c=e.contentWindow)==null||c.print(),r()}catch(o){console.error("Print error:",o),s(o)}finally{setTimeout(()=>{document.body.contains(e)&&e.remove()},1e3)}},300)}catch(a){s(a)}})}function O(t,n="active",i){const r=n==="active"?"Sedang di Depo":n==="out"?"Sudah Keluar Depo":"Semua Kontainer",s=new Date().toLocaleString("id-ID",{dateStyle:"medium",timeStyle:"short"});return`<!DOCTYPE html>
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
            <div style="font-size: 7pt; color: #555;">Dicetak pada: ${s} WIB</div>
        </div>
    </div>

    <div class="meta-bar">
        <span>Status Kontainer: <strong>${r}</strong> ${i?`(Pencarian: "${i}")`:""}</span>
        <span>Total Kontainer: <strong>${t.length} Unit</strong></span>
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
            ${t.length===0?'<tr><td colspan="10" class="text-center" style="padding: 6mm;">Tidak ada data kontainer yang sesuai.</td></tr>':t.map((a,p)=>{var o,u,m,g,y;const e=a.customer_name||((u=(o=a.order)==null?void 0:o.customer)==null?void 0:u.name)||"-",d=a.shipper_name||((g=(m=a.order)==null?void 0:m.shipper)==null?void 0:g.name)||"",v=!a.exit_date,c=a.total_shifts&&a.total_shifts>0?a.total_shifts:a.start_plug_in?1:null;return`
                <tr>
                    <td class="text-center">${p+1}</td>
                    <td class="font-bold font-mono" style="font-size: 8.5pt;">${a.container_number}</td>
                    <td class="text-center">${a.price_type||a.size||"-"}</td>
                    <td>
                        <div class="font-bold">${e}</div>
                        ${d&&d!=="-"?`<div style="font-size: 6.5pt; color: #444;">${d}</div>`:""}
                    </td>
                    <td>${a.order_id||((y=a.order)==null?void 0:y.order_id)||"-"}</td>
                    <td class="text-center">${a.entry_date?x(a.entry_date):"-"}</td>
                    <td class="text-center">${a.start_plug_in?x(a.start_plug_in):'<span style="color:#888;">Belum Plug In</span>'}</td>
                    <td class="text-center">${a.plug_out?x(a.plug_out):a.start_plug_in?"<strong>Aktif (In)</strong>":"-"}</td>
                    <td class="text-center font-bold">${c?`${c} Shift`:"-"}</td>
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
</html>`}function F(t,n="active",i){return new Promise((r,s)=>{var h;try{const a=O(t,n,i),p=document.getElementById("temp-rekap-print-iframe");p&&p.remove();const e=document.createElement("iframe");e.id="temp-rekap-print-iframe",e.style.position="fixed",e.style.right="0",e.style.bottom="0",e.style.width="0",e.style.height="0",e.style.border="0",e.style.visibility="hidden",document.body.appendChild(e);const d=((h=e.contentWindow)==null?void 0:h.document)||e.contentDocument;if(!d){alert("Gagal menyiapkan pencetakan rekap."),e.remove(),s(new Error("Cannot access iframe"));return}d.open(),d.write(a),d.close(),setTimeout(()=>{var v,c;try{(v=e.contentWindow)==null||v.focus(),(c=e.contentWindow)==null||c.print(),r()}catch(o){console.error("Rekap print error:",o),s(o)}finally{setTimeout(()=>{document.body.contains(e)&&e.remove()},1e3)}},300)}catch(a){s(a)}})}export{F as a,B as e};
