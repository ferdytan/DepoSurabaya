import{r as h,K as Y,j as e,L as X,S as b,$ as Q}from"./app-CJoe0UB7.js";import{A as V,X as Z}from"./app-layout-CFmxW-_-.js";import{D as ee,a as te,b as ae,c as se,d as re}from"./dialog-Cj5AeGJL.js";import{B as x}from"./button-CvrRbSDQ.js";import{I as O}from"./input-GWYwBxtS.js";import{L as w}from"./label-B1X3PDBX.js";import{T as ne,a as ie,b as T,c as p,d as le,e as d}from"./table-gxkr7FGO.js";import{D as oe}from"./date-range-picker-D9ntgWHl.js";import{D as de}from"./date-time-picker-dIWX9Hks.js";import{P as ce}from"./printer-Qb-uH6mq.js";import{C as me}from"./circle-plus-TsMlBv7u.js";import{A as xe,a as pe,b as ge}from"./arrow-up-BaiHniaJ.js";/* empty css            */import"./index-dm1p9TeM.js";import"./Combination-90IdoMim.js";import"./index-B2PyUe8S.js";import"./index-CGbT4QDs.js";import"./app-logo-icon-CZwuAP0y.js";import"./clock-BQdDIMBG.js";import"./chevron-down-B96bAFst.js";import"./rotate-ccw-w7lkFeYo.js";import"./chevron-left-BUpJU3tP.js";import"./check-Dsm7_8_e.js";const he=[{title:"Karantina",href:"/karantina"}];function z(g,y){if(!g)return y||"-";const n=String(g).trim();return n.toLowerCase().endsWith("ft")?n:n==="20"||n==="40"?`${n}ft`:n||y||"-"}function ze({orders:g,filters:y}){var L,A;const n=y||{},[v,C]=h.useState(n.search??""),[c,P]=h.useState(n.start_date??""),[m,$]=h.useState(n.end_date??""),[I,D]=h.useState(!1),[K,B]=h.useState(null),[S,f]=h.useState([]),u=g.data.filter(t=>!c&&!m?!0:[t.entry_date,t.eir_date,t.exit_date].some(s=>{if(!s)return!1;const i=new Date(s),l=c?new Date(c):null,N=m?new Date(m):null;return!(l&&i<l||N&&i>N)})),U=(t,a)=>{f(r=>{const s=[...r];return s[t].date=a,s})},H=(t,a,r)=>{f(s=>{const i=[...s];return i[t].temps={...i[t].temps||{},[a.toString().padStart(2,"0")]:r},i})},M=()=>{f(t=>[...t,{date:"",temps:{}}])},W=t=>{f(a=>a.filter((r,s)=>s!==t))},q=()=>{if(!K)return;const t={};S.forEach(a=>{a.date&&(t[a.date]=a.temps)}),console.log("Data yang dikirim ke backend:",t),b.patch(route("orders.update-temperature",K.id),{temperature:t},{onSuccess:()=>{D(!1),B(null),f([]),b.reload({only:["orders"]})},onError:a=>{alert("Terjadi error saat menyimpan data suhu."),console.error(a)}})};h.useEffect(()=>{console.log("Semua data orders:",g.data)},[g.data]);const G=()=>{if(u.length===0){alert("Tidak ada data yang sesuai filter untuk dicetak.");return}const t=c?new Date(c).toLocaleDateString("id-ID"):"Semua",a=m?new Date(m).toLocaleDateString("id-ID"):"Semua",r=`${t} s/d ${a}`,s="/logo.png",i=new Image;i.src=s;const l=window.open("","_blank");if(!l){alert("Gagal membuka jendela cetak. Pastikan popup tidak diblokir.");return}l.document.write(`
        <div style="text-align: center; margin-top: 50px; font-family: Arial, sans-serif;">
            Memuat logo...
        </div>
    `),l.document.close(),i.onload=()=>{const N=`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Billing Statement</title>
                <style>
                    body {
                        font-family: 'Segoe UI', Arial, sans-serif;
                        margin: 20px;
                        color: #333;
                    }
                    .header {
                        display: flex;
                        align-items: center;
                        gap: 15px;
                        margin-bottom: 20px;
                    }
                    .logo {
                        width: 70px;
                        height: 70px;
                    }
                    .company-info {
                        font-size: 14px;
                    }
                    .company-info strong {
                        font-size: 16px;
                    }
                    .customer-info {
                        margin-top: 10px;
                        font-size: 14px;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 20px;
                        font-size: 12px;
                    }
                    th, td {
                        border: 1px solid #000;
                        padding: 8px 10px;
                        text-align: left;
                    }
                    th {
                        background-color: #f0f0f0;
                        font-weight: 600;
                    }
                    .text-gray-400 {
                        color: #9ca3af;
                    }
                    .bg-yellow-100 {
                        background-color: #fef3c7;
                        padding: 4px 6px;
                        border-radius: 4px;
                        font-size: 11px;
                    }
                    .text-yellow-800 {
                        color: #854d0e;
                    }
                    @media print {
                        @page {
                            margin: 1cm;
                        }
                        body {
                            -webkit-print-color-adjust: exact;
                            print-color-adjust: exact;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <img src="${s}" alt="Logo" class="logo">
                    <div class="company-info">
                        <strong>PT. DEPO SUBARAYA SEJAHTERA</strong><br>
                        Tanjung Sadari No. 90<br>
                        Surabaya<br>
                        Jawa Timur - Indonesia
                    </div>
                </div>

                <div class="customer-info">
                    <strong>Periode:</strong> ${r}<br>
                  
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>Nomor Kontainer</th>
                            <th>Nama Shipper</th>
                            <th>Size</th>
                            <th>Tanggal Masuk</th>
                            <th>Tanggal EIR</th>
                            <th>Tanggal Keluar</th>
                            <th>Komoditi</th>
                            <th>Fumigator</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${u.map(o=>{var R,E,F;return`
                            <tr>
                                <td>${o.container_number}</td>
                                <td>${((E=(R=o.order)==null?void 0:R.shipper)==null?void 0:E.name)??"-"}</td>
                                <td>${z(o.price_type)}</td>
                                <td>${o.entry_date?new Date(o.entry_date).toLocaleString("id-ID"):'<span class="text-gray-400">–</span>'}</td>
                                <td>${o.eir_date?new Date(o.eir_date).toLocaleString("id-ID"):'<span class="text-gray-400">–</span>'}</td>
                                <td>${o.exit_date?new Date(o.exit_date).toLocaleString("id-ID"):'<span class="text-gray-400">–</span>'}</td>
                                <td>${o.commodity??"-"}</td>
                                <td>
    ${(F=o.order)!=null&&F.fumigasi?o.order.fumigasi.length>50?o.order.fumigasi.substring(0,50)+"...":o.order.fumigasi:"–"}
</td>
                            </tr>
                        `}).join("")}
                    </tbody>
                </table>

            </body>
            </html>
        `;l.document.write(N),l.document.close(),l.focus(),setTimeout(()=>l.print(),300)},i.onerror=()=>{alert("Gagal memuat logo. Pastikan file /logo.png ada di folder public."),l.close()}},{props:j}=Y(),J=()=>{const a=(window.location.pathname.startsWith("/karantina"),"/karantina");b.get(a,{search:v,trashed:n.trashed,start_date:c,end_date:m})},k=({label:t,field:a,currentSort:r,currentDir:s,routeName:i="index_karantina"})=>{const l=r===a&&s==="asc"?"desc":"asc";return e.jsxs(Q,{href:route(i,{sort_by:a,sort_dir:l,search:v,start_date:c,end_date:m}),className:"flex items-center gap-1 font-semibold text-gray-700 hover:text-black",children:[t," ",r===a?l==="asc"?e.jsx(xe,{className:"h-4 w-4"}):e.jsx(pe,{className:"h-4 w-4"}):e.jsx(ge,{className:"h-4 w-4 text-gray-400"})]})},_={};for(const t of u){const a=t.no_aju??t.order_id;_[a]||(_[a]=[]),_[a].push(t)}return e.jsxs(V,{breadcrumbs:he,children:[e.jsx(X,{title:"Karantina & Fumigasi - Depo Surabaya"}),e.jsxs("div",{className:"flex flex-1 flex-col gap-6 bg-[#f8fafc] p-4 md:p-6 min-h-screen",children:[((L=j.flash)==null?void 0:L.success)&&e.jsx("div",{className:"rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 shadow-sm",children:j.flash.success}),((A=j.flash)==null?void 0:A.error)&&e.jsx("div",{className:"rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 shadow-sm",children:j.flash.error}),e.jsxs("div",{className:"flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between",children:[e.jsxs("div",{children:[e.jsxs("div",{className:"flex items-center gap-2.5",children:[e.jsx("h1",{className:"text-2xl font-bold tracking-tight text-gray-800",children:"Karantina & Fumigasi"}),e.jsx("span",{className:"inline-flex items-center rounded-full bg-rose-50 px-3 py-0.5 text-xs font-semibold text-rose-700 border border-rose-200",children:"Petugas Karantina"})]}),e.jsx("p",{className:"mt-1 text-sm text-gray-500",children:"Kelola data kontainer karantina, filter pencarian per periode, dan cetak billing statement resmi."})]}),e.jsx("div",{className:"flex flex-wrap items-center gap-2",children:e.jsxs(x,{type:"button",onClick:G,className:"bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-sm",children:[e.jsx(ce,{className:"mr-2 h-4 w-4"}),"Cetak Billing Statement"]})})]}),e.jsxs("div",{className:"rounded-xl border border-gray-200 bg-white p-5 shadow-sm",children:[e.jsx("div",{className:"mb-3 flex items-center justify-between",children:e.jsx("h2",{className:"text-sm font-bold text-gray-800 uppercase tracking-wide",children:"Filter & Pencarian Kontainer"})}),e.jsxs("div",{className:"grid grid-cols-1 gap-4 md:grid-cols-4",children:[e.jsxs("div",{className:"md:col-span-2 space-y-1",children:[e.jsx(w,{htmlFor:"search",className:"text-xs font-medium text-gray-600",children:"Cari (Fumigator, Shipper, Kontainer)"}),e.jsx(O,{id:"search",type:"text",value:v,onChange:t=>C(t.target.value),placeholder:"Cari fumigator, shipper, atau nomor kontainer...",className:"w-full rounded-lg border-gray-300 py-2 text-sm text-gray-800 shadow-sm focus:border-blue-500"})]}),e.jsxs("div",{className:"md:col-span-2 space-y-1",children:[e.jsx(w,{className:"text-xs font-medium text-gray-600",children:"Rentang Tanggal"}),e.jsx(oe,{startDate:c,endDate:m,onChange:({startDate:t,endDate:a})=>{P(t),$(a)},placeholder:"Pilih rentang tanggal filter...",className:"w-full",align:"right"})]})]}),e.jsxs("div",{className:"mt-4 flex items-center justify-end gap-2 border-t border-gray-100 pt-3",children:[e.jsx(x,{variant:"outline",onClick:()=>{C(""),P(""),$(""),b.get("/karantina")},className:"text-xs font-medium",children:"Reset"}),e.jsx(x,{onClick:J,className:"text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white",children:"Terapkan Filter"})]})]}),e.jsxs("div",{className:"rounded-xl border border-gray-200 bg-white shadow-sm p-5",children:[e.jsxs("div",{className:"mb-4",children:[e.jsx("h2",{className:"text-lg font-bold text-gray-800",children:"Daftar Kontainer Karantina & Fumigasi"}),e.jsxs("p",{className:"text-xs text-gray-500",children:["Menampilkan ",e.jsx("span",{className:"font-semibold text-gray-700",children:u.length})," kontainer sesuai kriteria filter."]})]}),e.jsx("div",{className:"overflow-x-auto rounded-lg border border-gray-200",children:e.jsxs(ne,{children:[e.jsx(ie,{className:"bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-600 border-b border-gray-200",children:e.jsxs(T,{children:[e.jsx(p,{className:"px-4 py-3",children:e.jsx(k,{label:"Nomor Kontainer",field:"container_number",currentSort:n.sort_by,currentDir:n.sort_dir})}),e.jsx(p,{className:"px-4 py-3",children:e.jsx(k,{label:"Nama Shipper",field:"shippers.name",currentSort:n.sort_by,currentDir:n.sort_dir})}),e.jsx(p,{className:"px-4 py-3",children:"Size"}),e.jsx(p,{className:"px-4 py-3",children:"Tanggal Masuk"}),e.jsx(p,{className:"px-4 py-3",children:"Tanggal EIR"}),e.jsx(p,{className:"px-4 py-3",children:"Tanggal Keluar"}),e.jsx(p,{className:"px-4 py-3",children:"Komoditi"}),e.jsx(p,{className:"px-4 py-3",children:e.jsx(k,{label:"Fumigasi",field:"fumigasi",currentSort:n.sort_by,currentDir:n.sort_dir})})]})}),e.jsx(le,{className:"divide-y divide-gray-100 bg-white",children:u.length===0?e.jsx(T,{children:e.jsx(d,{colSpan:8,className:"py-10 text-center text-sm text-gray-400",children:"Tidak ada data yang sesuai filter."})}):u.map(t=>{var a,r,s;return e.jsxs(T,{className:"hover:bg-slate-50/80 transition-colors",children:[e.jsx(d,{className:"px-4 py-3 font-mono text-sm font-semibold text-slate-900 tracking-tight",children:t.container_number}),e.jsx(d,{className:"px-4 py-3 text-sm text-slate-800 font-normal",children:((r=(a=t.order)==null?void 0:a.shipper)==null?void 0:r.name)??"-"}),e.jsx(d,{className:"px-4 py-3 text-sm",children:e.jsx("span",{className:"inline-flex rounded bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700 border border-slate-200",children:z(t.price_type)})}),e.jsx(d,{className:"px-4 py-3 text-sm text-slate-800 font-normal",children:t.entry_date?new Date(t.entry_date).toLocaleString("id-ID"):e.jsx("span",{className:"text-gray-400",children:"-"})}),e.jsx(d,{className:"px-4 py-3 text-sm text-slate-800 font-normal",children:t.eir_date?new Date(t.eir_date).toLocaleString("id-ID"):e.jsx("span",{className:"text-gray-400",children:"-"})}),e.jsx(d,{className:"px-4 py-3 text-sm text-slate-800 font-normal",children:t.exit_date?new Date(t.exit_date).toLocaleString("id-ID"):e.jsx("span",{className:"text-gray-400",children:"-"})}),e.jsx(d,{className:"px-4 py-3 text-sm text-slate-800 font-normal",children:t.commodity??"-"}),e.jsx(d,{className:"px-4 py-3 text-sm",children:(s=t.order)!=null&&s.fumigasi?e.jsx("span",{className:"inline-flex items-center rounded-md bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800 border border-amber-200",children:t.order.fumigasi}):e.jsx("span",{className:"text-gray-400",children:"–"})})]},t.id)})})]})}),e.jsx("div",{className:"mt-4 flex flex-wrap justify-center gap-1",children:g.links.map((t,a)=>t.url?e.jsx(x,{variant:t.active?"default":"outline",disabled:!t.url,onClick:()=>b.get(t.url),className:"px-3 py-1 whitespace-nowrap text-xs font-medium",children:t.label.replace(/&laquo; Previous|Next &raquo;/,r=>r.includes("Previous")?"← Prev":r.includes("Next")?"Next →":r)},a):e.jsx("span",{className:"px-3 py-1 text-xs text-gray-400",children:"..."},a))})]}),e.jsx(ee,{open:I,onOpenChange:D,children:e.jsxs(te,{className:"max-w-3xl",children:[e.jsx(ae,{children:e.jsx(se,{children:"Rekam Suhu Kontainer"})}),e.jsxs("div",{className:"max-h-[60vh] space-y-6 overflow-y-auto pr-2",children:[S.map((t,a)=>e.jsxs("div",{className:"space-y-2 rounded border p-4",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(w,{htmlFor:`date_${a}`,children:"Tanggal"}),e.jsx(de,{id:`date_${a}`,value:t.date,onChange:r=>U(a,r),withTime:!1,placeholder:"Pilih tanggal...",className:"w-[180px]"}),S.length>1&&e.jsx(x,{type:"button",size:"icon",variant:"destructive",className:"ml-auto",onClick:()=>W(a),children:e.jsx(Z,{className:"h-4 w-4"})})]}),e.jsx("div",{className:"grid max-h-64 grid-cols-2 gap-2 overflow-y-auto",children:[...Array(24)].map((r,s)=>e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsxs(w,{htmlFor:`temp_${a}_${s}`,children:[s.toString().padStart(2,"0"),":00"]}),e.jsx(O,{id:`temp_${a}_${s}`,type:"number",step:"0.1",value:t.temps[s.toString().padStart(2,"0")]||"",onChange:i=>H(a,s,i.target.value),className:"w-24"})]},s))})]},a)),e.jsxs(x,{type:"button",variant:"outline",onClick:M,className:"flex items-center gap-2",children:[e.jsx(me,{className:"h-4 w-4"})," Tambah Tanggal"]})]}),e.jsxs(re,{className:"gap-2",children:[e.jsx(x,{variant:"outline",onClick:()=>D(!1),children:"Batal"}),e.jsx(x,{onClick:q,children:"Simpan"})]})]})})]})]})}export{ze as default};
