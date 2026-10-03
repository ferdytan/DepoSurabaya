import{r as p,K as X,j as e,L as Q,S as u,$ as V}from"./app-CK_Fgqi_.js";import{A as Z,X as F}from"./app-layout-C9hFuenY.js";import{D as ee,a as te,b as ae,c as se,d as re}from"./dialog-Ddx60xyo.js";import{B as h}from"./button-1QKEolEz.js";import{I as z}from"./input-XEL1YKC0.js";import{L as _}from"./label-B8I6U6iV.js";import{T as ne,a as ie,b as $,c as x,d as oe,e as m}from"./table-Tw4Z8HHt.js";import{D as le}from"./date-range-picker-WdoI-ZJT.js";import{D as de}from"./date-time-picker-yj3iCsrj.js";import{P as ce}from"./printer-Bbu-AeGm.js";import{C as me}from"./circle-plus-CWYSCBoC.js";import{A as xe,a as pe,b as he}from"./arrow-up-DgfNu4pa.js";/* empty css            */import"./index-CYVyKVNt.js";import"./Combination-5H8pilPQ.js";import"./index-QkfMPQwo.js";import"./index-B1LTpVyA.js";import"./app-logo-icon-CA0QwX3J.js";import"./calendar-BsNPdXvA.js";import"./chevron-down-BEX8o3rN.js";import"./rotate-ccw-DPY1xFjg.js";import"./chevron-left-BGPI4hn8.js";import"./check-B_degHFQ.js";import"./clock-CsO14KH6.js";const ge=[{title:"Karantina",href:"/karantina"}];function B(l,s){if(!l)return s||"-";const r=String(l).trim();return r.toLowerCase().endsWith("ft")?r:r==="20"||r==="40"?`${r}ft`:r||s||"-"}function Ie({orders:l,filters:s}){var L,A;const r=s||{},[j,D]=p.useState(r.search??""),[f,N]=p.useState(r.start_date??""),[b,v]=p.useState(r.end_date??"");p.useEffect(()=>{D((s==null?void 0:s.search)??""),N((s==null?void 0:s.start_date)??""),v((s==null?void 0:s.end_date)??"")},[s==null?void 0:s.search,s==null?void 0:s.start_date,s==null?void 0:s.end_date]);const[I,k]=p.useState(!1),[K,M]=p.useState(null),[w,y]=p.useState([]),g=l.data,U=(t,a)=>{y(i=>{const n=[...i];return n[t].date=a,n})},H=(t,a,i)=>{y(n=>{const d=[...n];return d[t].temps={...d[t].temps||{},[a.toString().padStart(2,"0")]:i},d})},q=()=>{y(t=>[...t,{date:"",temps:{}}])},G=t=>{y(a=>a.filter((i,n)=>n!==t))},J=()=>{if(!K)return;const t={};w.forEach(a=>{a.date&&(t[a.date]=a.temps)}),console.log("Data yang dikirim ke backend:",t),u.patch(route("orders.update-temperature",K.id),{temperature:t},{onSuccess:()=>{k(!1),M(null),y([]),u.reload({only:["orders"]})},onError:a=>{alert("Terjadi error saat menyimpan data suhu."),console.error(a)}})};p.useEffect(()=>{console.log("Semua data orders:",l.data)},[l.data]);const W=()=>{if(g.length===0){alert("Tidak ada data yang sesuai filter untuk dicetak.");return}const t=f?new Date(f).toLocaleDateString("id-ID"):"Semua",a=b?new Date(b).toLocaleDateString("id-ID"):"Semua",i=`${t} s/d ${a}`,n="/logo.png",d=new Image;d.src=n;const c=window.open("","_blank");if(!c){alert("Gagal membuka jendela cetak. Pastikan popup tidak diblokir.");return}c.document.write(`
        <div style="text-align: center; margin-top: 50px; font-family: Arial, sans-serif;">
            Memuat logo...
        </div>
    `),c.document.close(),d.onload=()=>{const Y=`
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
                    <img src="${n}" alt="Logo" class="logo">
                    <div class="company-info">
                        <strong>PT. DEPO SURABAYA SEJAHTERA</strong><br>
                        Tanjung Sadari No. 90<br>
                        Surabaya<br>
                        Jawa Timur - Indonesia
                    </div>
                </div>

                <div class="customer-info">
                    <strong>Periode:</strong> ${i}<br>
                  
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>Nomor Kontainer</th>
                            <th>Nama Shipper</th>
                            <th>Size</th>
                            <th>Tanggal Masuk</th>
                            <th>Tanggal Keluar</th>
                            <th>Komoditi</th>
                            <th>Negara Tujuan</th>
                            <th>Fumigator</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${g.map(o=>{var E,R,O;return`
                            <tr>
                                <td>${o.container_number}</td>
                                <td>${((R=(E=o.order)==null?void 0:E.shipper)==null?void 0:R.name)??"-"}</td>
                                <td>${B(o.price_type)}</td>
                                <td>${o.entry_date?new Date(o.entry_date).toLocaleString("id-ID"):'<span class="text-gray-400">–</span>'}</td>
                                <td>${o.exit_date?new Date(o.exit_date).toLocaleString("id-ID"):'<span class="text-gray-400">–</span>'}</td>
                                <td>${o.commodity??"-"}</td>
                                <td>${o.country??"-"}</td>
                                <td>
    ${(O=o.order)!=null&&O.fumigasi?o.order.fumigasi.length>50?o.order.fumigasi.substring(0,50)+"...":o.order.fumigasi:"–"}
</td>
                            </tr>
                        `}).join("")}
                    </tbody>
                </table>

            </body>
            </html>
        `;c.document.write(Y),c.document.close(),c.focus(),setTimeout(()=>c.print(),300)},d.onerror=()=>{alert("Gagal memuat logo. Pastikan file /logo.png ada di folder public."),c.close()}},{props:S}=X(),P=()=>{u.get("/karantina",{search:j||void 0,trashed:r.trashed||void 0,start_date:f||void 0,end_date:b||void 0,sort_by:r.sort_by||void 0,sort_dir:r.sort_dir||void 0},{preserveState:!0,preserveScroll:!0})},T=({label:t,field:a,currentSort:i,currentDir:n,routeName:d="index_karantina"})=>{const c=i===a&&n==="asc"?"desc":"asc";return e.jsxs(V,{href:route(d,{sort_by:a,sort_dir:c,search:j||void 0,start_date:f||void 0,end_date:b||void 0}),preserveState:!0,preserveScroll:!0,className:"flex items-center gap-1 font-semibold text-gray-700 hover:text-black",children:[t,i===a?c==="asc"?e.jsx(xe,{className:"h-4 w-4"}):e.jsx(pe,{className:"h-4 w-4"}):e.jsx(he,{className:"h-4 w-4 text-gray-400"})]})},C={};for(const t of g){const a=t.no_aju??t.order_id;C[a]||(C[a]=[]),C[a].push(t)}return e.jsxs(Z,{breadcrumbs:ge,children:[e.jsx(Q,{title:"Karantina & Fumigasi - Depo Surabaya"}),e.jsxs("div",{className:"flex flex-1 flex-col gap-6 bg-[#f8fafc] p-4 md:p-6 min-h-screen",children:[((L=S.flash)==null?void 0:L.success)&&e.jsx("div",{className:"rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 shadow-sm",children:S.flash.success}),((A=S.flash)==null?void 0:A.error)&&e.jsx("div",{className:"rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 shadow-sm",children:S.flash.error}),e.jsxs("div",{className:"flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between",children:[e.jsxs("div",{children:[e.jsxs("div",{className:"flex items-center gap-2.5",children:[e.jsx("h1",{className:"text-2xl font-bold tracking-tight text-gray-800",children:"Karantina & Fumigasi"}),e.jsx("span",{className:"inline-flex items-center rounded-full bg-rose-50 px-3 py-0.5 text-xs font-semibold text-rose-700 border border-rose-200",children:"Petugas Karantina"})]}),e.jsx("p",{className:"mt-1 text-sm text-gray-500",children:"Kelola data kontainer karantina, filter pencarian per periode, dan cetak billing statement resmi."})]}),e.jsx("div",{className:"flex flex-wrap items-center gap-2",children:e.jsxs(h,{type:"button",onClick:W,className:"bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-sm",children:[e.jsx(ce,{className:"mr-2 h-4 w-4"}),"Cetak Billing Statement"]})})]}),e.jsxs("div",{className:"rounded-xl border border-gray-200 bg-white p-5 shadow-sm",children:[e.jsx("div",{className:"mb-3 flex items-center justify-between",children:e.jsx("h2",{className:"text-sm font-bold text-gray-800 uppercase tracking-wide",children:"Filter & Pencarian Kontainer"})}),e.jsxs("div",{className:"grid grid-cols-1 gap-4 md:grid-cols-4",children:[e.jsxs("div",{className:"md:col-span-2 space-y-1",children:[e.jsx(_,{htmlFor:"search",className:"text-xs font-medium text-gray-600",children:"Cari (Fumigator, Shipper, Kontainer)"}),e.jsx(z,{id:"search",type:"text",value:j,onChange:t=>D(t.target.value),onKeyDown:t=>{t.key==="Enter"&&(t.preventDefault(),P())},placeholder:"Cari fumigator, shipper, atau nomor kontainer...",className:"w-full rounded-lg border-gray-300 py-2 text-sm text-gray-800 shadow-sm focus:border-blue-500"})]}),e.jsxs("div",{className:"md:col-span-2 space-y-1",children:[e.jsx(_,{className:"text-xs font-medium text-gray-600",children:"Rentang Tanggal"}),e.jsx(le,{startDate:f,endDate:b,onChange:({startDate:t,endDate:a})=>{N(t),v(a)},onApply:({startDate:t,endDate:a})=>{N(t),v(a),u.get("/karantina",{search:j||void 0,trashed:r.trashed||void 0,start_date:t||void 0,end_date:a||void 0,sort_by:r.sort_by||void 0,sort_dir:r.sort_dir||void 0},{preserveState:!0,preserveScroll:!0})},placeholder:"Pilih rentang tanggal filter...",className:"w-full",align:"right"})]})]}),e.jsxs("div",{className:"mt-4 flex items-center justify-end gap-2 border-t border-gray-100 pt-3",children:[e.jsx(h,{variant:"outline",onClick:()=>{D(""),N(""),v(""),u.get("/karantina")},className:"text-xs font-medium",children:"Reset"}),e.jsx(h,{onClick:P,className:"text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white",children:"Terapkan Filter"})]})]}),e.jsxs("div",{className:"rounded-xl border border-gray-200 bg-white shadow-sm p-5",children:[e.jsxs("div",{className:"mb-4",children:[e.jsx("h2",{className:"text-lg font-bold text-gray-800",children:"Daftar Kontainer Karantina & Fumigasi"}),e.jsxs("p",{className:"text-xs text-gray-500",children:["Total ",e.jsx("span",{className:"font-semibold text-gray-700",children:l.total??g.length})," kontainer sesuai kriteria filter."]})]}),e.jsx("div",{className:"overflow-x-auto rounded-lg border border-gray-200",children:e.jsxs(ne,{children:[e.jsx(ie,{className:"bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-600 border-b border-gray-200",children:e.jsxs($,{children:[e.jsx(x,{className:"px-4 py-3",children:e.jsx(T,{label:"Nomor Kontainer",field:"container_number",currentSort:r.sort_by,currentDir:r.sort_dir})}),e.jsx(x,{className:"px-4 py-3",children:e.jsx(T,{label:"Nama Shipper",field:"shippers.name",currentSort:r.sort_by,currentDir:r.sort_dir})}),e.jsx(x,{className:"px-4 py-3",children:"Size"}),e.jsx(x,{className:"px-4 py-3",children:"Tanggal Masuk"}),e.jsx(x,{className:"px-4 py-3",children:"Tanggal EIR"}),e.jsx(x,{className:"px-4 py-3",children:"Tanggal Keluar"}),e.jsx(x,{className:"px-4 py-3",children:"Komoditi"}),e.jsx(x,{className:"px-4 py-3",children:"Negara Tujuan"}),e.jsx(x,{className:"px-4 py-3",children:e.jsx(T,{label:"Fumigasi",field:"fumigasi",currentSort:r.sort_by,currentDir:r.sort_dir})})]})}),e.jsx(oe,{className:"divide-y divide-gray-100 bg-white",children:g.length===0?e.jsx($,{children:e.jsx(m,{colSpan:9,className:"py-10 text-center text-sm text-gray-400",children:"Tidak ada data yang sesuai filter."})}):g.map(t=>{var a,i,n;return e.jsxs($,{className:"hover:bg-slate-50/80 transition-colors",children:[e.jsx(m,{className:"px-4 py-3 text-sm font-semibold text-slate-900",children:t.container_number}),e.jsx(m,{className:"px-4 py-3 text-sm text-slate-800 font-normal",children:((i=(a=t.order)==null?void 0:a.shipper)==null?void 0:i.name)??"-"}),e.jsx(m,{className:"px-4 py-3 text-sm",children:e.jsx("span",{className:"inline-flex rounded bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700 border border-slate-200",children:B(t.price_type)})}),e.jsx(m,{className:"px-4 py-3 text-sm text-slate-800 font-normal",children:t.entry_date?new Date(t.entry_date).toLocaleString("id-ID"):e.jsx("span",{className:"text-gray-400",children:"-"})}),e.jsx(m,{className:"px-4 py-3 text-sm text-slate-800 font-normal",children:t.eir_date?new Date(t.eir_date).toLocaleString("id-ID"):e.jsx("span",{className:"text-gray-400",children:"-"})}),e.jsx(m,{className:"px-4 py-3 text-sm text-slate-800 font-normal",children:t.exit_date?new Date(t.exit_date).toLocaleString("id-ID"):e.jsx("span",{className:"text-gray-400",children:"-"})}),e.jsx(m,{className:"px-4 py-3 text-sm text-slate-800 font-normal",children:t.commodity??"-"}),e.jsx(m,{className:"px-4 py-3 text-sm text-slate-800 font-normal",children:t.country??"-"}),e.jsx(m,{className:"px-4 py-3 text-sm",children:(n=t.order)!=null&&n.fumigasi?e.jsx("span",{className:"inline-flex items-center rounded-md bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800 border border-amber-200",children:t.order.fumigasi}):e.jsx("span",{className:"text-gray-400",children:"–"})})]},t.id)})})]})}),e.jsxs("div",{className:"mt-4 flex flex-col sm:flex-row items-center justify-between gap-3",children:[e.jsxs("p",{className:"text-xs text-gray-500",children:["Menampilkan ",e.jsx("span",{className:"font-semibold text-gray-700",children:l.from??0})," sampai"," ",e.jsx("span",{className:"font-semibold text-gray-700",children:l.to??0})," dari"," ",e.jsx("span",{className:"font-semibold text-gray-700",children:l.total??l.data.length})," kontainer"]}),e.jsx("div",{className:"flex flex-wrap justify-center gap-1",children:l.links.map((t,a)=>t.url?e.jsx(h,{variant:t.active?"default":"outline",disabled:!t.url,onClick:()=>u.get(t.url,{},{preserveState:!0,preserveScroll:!0}),className:"px-3 py-1 whitespace-nowrap text-xs font-medium",children:t.label.replace(/&laquo; Previous|Next &raquo;/,i=>i.includes("Previous")?"← Prev":i.includes("Next")?"Next →":i)},a):e.jsx("span",{className:"px-3 py-1 text-xs text-gray-400",children:"..."},a))})]})]}),e.jsx(ee,{open:I,onOpenChange:k,children:e.jsxs(te,{className:"max-w-3xl",children:[e.jsx(ae,{children:e.jsx(se,{children:"Rekam Suhu Kontainer"})}),e.jsxs("div",{className:"max-h-[60vh] space-y-6 overflow-y-auto pr-2",children:[w.map((t,a)=>e.jsxs("div",{className:"space-y-2 rounded border p-4",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(_,{htmlFor:`date_${a}`,children:"Tanggal"}),e.jsx(de,{id:`date_${a}`,value:t.date,onChange:i=>U(a,i),withTime:!1,inModal:!0,placeholder:"Pilih tanggal...",className:"w-[180px]"}),w.length>1&&e.jsx(h,{type:"button",size:"icon",variant:"destructive",className:"ml-auto",onClick:()=>G(a),children:e.jsx(F,{className:"h-4 w-4"})})]}),e.jsx("div",{className:"grid max-h-64 grid-cols-2 gap-2 overflow-y-auto",children:[...Array(24)].map((i,n)=>e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsxs(_,{htmlFor:`temp_${a}_${n}`,children:[n.toString().padStart(2,"0"),":00"]}),e.jsx(z,{id:`temp_${a}_${n}`,type:"number",step:"0.1",value:t.temps[n.toString().padStart(2,"0")]||"",onChange:d=>H(a,n,d.target.value),className:"w-24"})]},n))})]},a)),e.jsxs(h,{type:"button",variant:"outline",onClick:q,className:"flex items-center gap-2",children:[e.jsx(me,{className:"h-4 w-4"})," Tambah Tanggal"]})]}),e.jsxs(re,{className:"gap-2",children:[e.jsx(h,{variant:"outline",onClick:()=>k(!1),children:"Batal"}),e.jsx(h,{onClick:J,children:"Simpan"})]})]})})]})]})}export{Ie as default};
