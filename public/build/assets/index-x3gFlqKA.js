import{r as u,K as ie,j as e,L as le,S as _,$ as oe}from"./app-C4LvCaFy.js";import{A as de,D as ce,d as me,e as xe,X as U}from"./app-layout-CRX1xQ6h.js";import{D as pe,a as he,b as ue,c as ge,e as fe}from"./dialog-BMaKhGOU.js";import{B as g}from"./button-_WU4K9NQ.js";import{C as be}from"./checkbox-BaXiqgnF.js";import{I as Y}from"./input-TatI-dV4.js";import{L as k}from"./label-BTU6GXi1.js";import{T as ye,a as je,b as E,c as f,d as Ne,e as p}from"./table-CEOxuUyj.js";import{D as ve}from"./date-range-picker-B3IPsm8j.js";import{D as Se}from"./date-time-picker-CyktASZU.js";import{P as _e}from"./printer-CEpjfM2H.js";import{C as ke}from"./chevron-down-DTM3xsHK.js";import{C as De}from"./circle-plus-DmqPRZ4-.js";import{A as Te,a as Ce,b as we}from"./arrow-up-DoxFbJ_u.js";/* empty css            */import"./index-C5mESXdx.js";import"./Combination-R-c124ES.js";import"./index-BHc0Ge_H.js";import"./index-B6aJr3Cg.js";import"./app-logo-icon-BLJ9w_8P.js";import"./index-DfNzj6Po.js";import"./check-BDHrIMU-.js";import"./rotate-ccw-DflwRK3f.js";import"./chevron-left-B688mCPu.js";import"./clock-C--VTsYb.js";const W=["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];function L(l){if(!l)return e.jsx("span",{className:"text-gray-400",children:"–"});const i=new Date(l);if(isNaN(i.getTime()))return e.jsx("span",{className:"text-gray-400",children:"–"});const s=String(i.getDate()).padStart(2,"0"),o=W[i.getMonth()],b=i.getFullYear(),y=String(i.getHours()).padStart(2,"0"),h=String(i.getMinutes()).padStart(2,"0");return e.jsxs("div",{className:"flex flex-col leading-tight whitespace-nowrap",children:[e.jsxs("span",{className:"font-medium text-slate-800 text-[13px]",children:[s," ",o]}),e.jsxs("span",{className:"text-[12px] text-slate-500 font-normal",children:[b,", ",y,":",h]})]})}function q(l){if(!l)return"–";const i=new Date(l);if(isNaN(i.getTime()))return"–";const s=String(i.getDate()).padStart(2,"0"),o=W[i.getMonth()],b=i.getFullYear(),y=String(i.getHours()).padStart(2,"0"),h=String(i.getMinutes()).padStart(2,"0");return`${s} ${o} ${b}, ${y}:${h}`}const $e=[{title:"Karantina",href:"/karantina"}];function G(l,i){if(!l)return i||"-";const s=String(l).trim();return s.toLowerCase().endsWith("ft")?s:s==="20"||s==="40"?`${s}ft`:s||i||"-"}function at({orders:l,products:i=[],filters:s}){var z,B,H;const o=s||{},[b,y]=u.useState(o.search??""),[h,D]=u.useState(o.start_date??""),[v,T]=u.useState(o.end_date??""),X=Array.isArray(s==null?void 0:s.product_ids)?s.product_ids.map(Number).filter(t=>!isNaN(t)):[],[m,j]=u.useState(X);u.useEffect(()=>{y((s==null?void 0:s.search)??""),D((s==null?void 0:s.start_date)??""),T((s==null?void 0:s.end_date)??"");const t=Array.isArray(s==null?void 0:s.product_ids)?s.product_ids.map(Number).filter(a=>!isNaN(a)):[];j(t)},[s==null?void 0:s.search,s==null?void 0:s.start_date,s==null?void 0:s.end_date,s==null?void 0:s.product_ids]);const[Q,w]=u.useState(!1),[O,V]=u.useState(null),[$,S]=u.useState([]),N=l.data,Z=(t,a)=>{S(n=>{const r=[...n];return r[t].date=a,r})},F=(t,a,n)=>{S(r=>{const d=[...r];return d[t].temps={...d[t].temps||{},[a.toString().padStart(2,"0")]:n},d})},ee=()=>{S(t=>[...t,{date:"",temps:{}}])},te=t=>{S(a=>a.filter((n,r)=>r!==t))},ae=()=>{if(!O)return;const t={};$.forEach(a=>{a.date&&(t[a.date]=a.temps)}),console.log("Data yang dikirim ke backend:",t),_.patch(route("orders.update-temperature",O.id),{temperature:t},{onSuccess:()=>{w(!1),V(null),S([]),_.reload({only:["orders"]})},onError:a=>{alert("Terjadi error saat menyimpan data suhu."),console.error(a)}})};u.useEffect(()=>{console.log("Semua data orders:",l.data)},[l.data]);const se=()=>{if(N.length===0){alert("Tidak ada data yang sesuai filter untuk dicetak.");return}const t=h?new Date(h).toLocaleDateString("id-ID"):"Semua",a=v?new Date(v).toLocaleDateString("id-ID"):"Semua",n=`${t} s/d ${a}`,r="/logo.png",d=new Image;d.src=r;const x=window.open("","_blank");if(!x){alert("Gagal membuka jendela cetak. Pastikan popup tidak diblokir.");return}x.document.write(`
        <div style="text-align: center; margin-top: 50px; font-family: Arial, sans-serif;">
            Memuat logo...
        </div>
    `),x.document.close(),d.onload=()=>{const re=`
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
                    <img src="${r}" alt="Logo" class="logo">
                    <div class="company-info">
                        <strong>PT. DEPO SURABAYA SEJAHTERA</strong><br>
                        Tanjung Sadari No. 90<br>
                        Surabaya<br>
                        Jawa Timur - Indonesia
                    </div>
                </div>

                <div class="customer-info">
                    <strong>Periode:</strong> ${n}<br>
                  
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
                        ${N.map(c=>{var I,P,J;return`
                            <tr>
                                <td>${c.container_number}</td>
                                <td>${((P=(I=c.order)==null?void 0:I.shipper)==null?void 0:P.name)??"-"}</td>
                                <td>${G(c.price_type)}</td>
                                <td>${c.entry_date?q(c.entry_date):'<span class="text-gray-400">–</span>'}</td>
                                <td>${c.exit_date?q(c.exit_date):'<span class="text-gray-400">–</span>'}</td>
                                <td>${c.commodity??"-"}</td>
                                <td>${c.country??"-"}</td>
                                <td>
    ${(J=c.order)!=null&&J.fumigasi?c.order.fumigasi.length>50?c.order.fumigasi.substring(0,50)+"...":c.order.fumigasi:"–"}
</td>
                            </tr>
                        `}).join("")}
                    </tbody>
                </table>

            </body>
            </html>
        `;x.document.write(re),x.document.close(),x.focus(),setTimeout(()=>x.print(),300)},d.onerror=()=>{alert("Gagal memuat logo. Pastikan file /logo.png ada di folder public."),x.close()}},{props:C}=ie(),A=t=>{j(a=>a.includes(t)?a.filter(n=>n!==t):[...a,t])},K=t=>{const a=(t==null?void 0:t.search)!==void 0?t.search:b,n=(t==null?void 0:t.start_date)!==void 0?t.start_date:h,r=(t==null?void 0:t.end_date)!==void 0?t.end_date:v,d=(t==null?void 0:t.product_ids)!==void 0?t.product_ids:m;_.get("/karantina",{search:a||void 0,trashed:o.trashed||void 0,start_date:n||void 0,end_date:r||void 0,product_ids:d.length>0?d:void 0,sort_by:o.sort_by||void 0,sort_dir:o.sort_dir||void 0},{preserveState:!0,preserveScroll:!0})},ne=()=>{y(""),D(""),T(""),j([]),_.get("/karantina")},M=({label:t,field:a,currentSort:n,currentDir:r,routeName:d="index_karantina"})=>{const x=n===a&&r==="asc"?"desc":"asc";return e.jsxs(oe,{href:route(d,{sort_by:a,sort_dir:x,search:b||void 0,start_date:h||void 0,end_date:v||void 0,product_ids:m.length>0?m:void 0}),preserveState:!0,preserveScroll:!0,className:"flex items-center gap-1 font-semibold text-gray-700 hover:text-black",children:[t,n===a?x==="asc"?e.jsx(Te,{className:"h-4 w-4"}):e.jsx(Ce,{className:"h-4 w-4"}):e.jsx(we,{className:"h-4 w-4 text-gray-400"})]})},R={};for(const t of N){const a=t.no_aju??t.order_id;R[a]||(R[a]=[]),R[a].push(t)}return e.jsxs(de,{breadcrumbs:$e,children:[e.jsx(le,{title:"Karantina & Fumigasi - Depo Surabaya"}),e.jsxs("div",{className:"flex flex-1 flex-col gap-6 bg-[#f8fafc] p-4 md:p-6 min-h-screen",children:[((z=C.flash)==null?void 0:z.success)&&e.jsx("div",{className:"rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 shadow-sm",children:C.flash.success}),((B=C.flash)==null?void 0:B.error)&&e.jsx("div",{className:"rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 shadow-sm",children:C.flash.error}),e.jsxs("div",{className:"flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between",children:[e.jsxs("div",{children:[e.jsxs("div",{className:"flex items-center gap-2.5",children:[e.jsx("h1",{className:"text-2xl font-bold tracking-tight text-gray-800",children:"Karantina & Fumigasi"}),e.jsx("span",{className:"inline-flex items-center rounded-full bg-rose-50 px-3 py-0.5 text-xs font-semibold text-rose-700 border border-rose-200",children:"Petugas Karantina"})]}),e.jsx("p",{className:"mt-1 text-sm text-gray-500",children:"Kelola data kontainer karantina, filter pencarian per periode, dan cetak billing statement resmi."})]}),e.jsx("div",{className:"flex flex-wrap items-center gap-2",children:e.jsxs(g,{type:"button",onClick:se,className:"bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-sm",children:[e.jsx(_e,{className:"mr-2 h-4 w-4"}),"Cetak Billing Statement"]})})]}),e.jsxs("div",{className:"rounded-xl border border-gray-200 bg-white p-5 shadow-sm",children:[e.jsx("div",{className:"mb-3 flex items-center justify-between",children:e.jsx("h2",{className:"text-sm font-bold text-gray-800 uppercase tracking-wide",children:"Filter & Pencarian Kontainer"})}),e.jsxs("div",{className:"grid grid-cols-1 gap-4 md:grid-cols-12",children:[e.jsxs("div",{className:"md:col-span-5 space-y-1",children:[e.jsx(k,{htmlFor:"search",className:"text-xs font-medium text-gray-600",children:"Cari (Fumigator, Shipper, Customer, Kontainer)"}),e.jsx(Y,{id:"search",type:"text",value:b,onChange:t=>y(t.target.value),onKeyDown:t=>{t.key==="Enter"&&(t.preventDefault(),K())},placeholder:"Cari fumigator, shipper, customer, atau nomor kontainer...",className:"w-full rounded-lg border-gray-300 py-2 text-sm text-gray-800 shadow-sm focus:border-blue-500"})]}),e.jsxs("div",{className:"md:col-span-3 space-y-1",children:[e.jsxs(k,{className:"text-xs font-medium text-gray-600 flex items-center justify-between",children:[e.jsx("span",{children:"Filter Produk"}),m.length>0&&e.jsxs("span",{className:"text-[11px] text-blue-600 font-semibold",children:[m.length," dipilih"]})]}),e.jsxs(ce,{children:[e.jsx(me,{asChild:!0,children:e.jsxs(g,{variant:"outline",type:"button",className:"w-full justify-between border-gray-300 py-2 text-sm font-normal text-gray-800 shadow-sm hover:bg-gray-50 focus:border-blue-500 h-9",children:[e.jsx("span",{className:"truncate",children:m.length===0?"Semua Produk":m.length===1?((H=i.find(t=>t.id===m[0]))==null?void 0:H.service_type)||"1 Produk":`${m.length} Produk Dipilih`}),e.jsx(ke,{className:"ml-2 h-4 w-4 shrink-0 opacity-50"})]})}),e.jsxs(xe,{className:"w-64 max-h-72 overflow-y-auto p-2",align:"start",children:[e.jsxs("div",{className:"flex items-center justify-between px-2 py-1.5 border-b border-gray-100 mb-1",children:[e.jsx("span",{className:"text-xs font-semibold text-gray-700",children:"Pilih Produk"}),e.jsxs("div",{className:"flex gap-2 text-[11px]",children:[e.jsx("button",{type:"button",onClick:t=>{t.preventDefault(),j(i.map(a=>a.id))},className:"text-blue-600 hover:underline font-medium",children:"Pilih Semua"}),e.jsx("span",{className:"text-gray-300",children:"|"}),e.jsx("button",{type:"button",onClick:t=>{t.preventDefault(),j([])},className:"text-gray-500 hover:underline",children:"Reset"})]})]}),e.jsx("div",{className:"space-y-0.5",children:i.length===0?e.jsx("div",{className:"p-2 text-center text-xs text-gray-400",children:"Tidak ada produk"}):i.map(t=>{const a=m.includes(t.id);return e.jsxs("div",{onClick:n=>{n.preventDefault(),A(t.id)},className:`flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer text-xs transition-colors ${a?"bg-blue-50 text-blue-900 font-medium":"hover:bg-gray-100 text-gray-700"}`,children:[e.jsx(be,{checked:a,onCheckedChange:()=>A(t.id),className:"h-3.5 w-3.5"}),e.jsx("span",{className:"truncate",children:t.service_type})]},t.id)})})]})]})]}),e.jsxs("div",{className:"md:col-span-4 space-y-1",children:[e.jsx(k,{className:"text-xs font-medium text-gray-600",children:"Rentang Tanggal"}),e.jsx(ve,{startDate:h,endDate:v,onChange:({startDate:t,endDate:a})=>{D(t),T(a)},onApply:({startDate:t,endDate:a})=>{D(t),T(a),K({start_date:t,end_date:a})},placeholder:"Pilih rentang tanggal filter...",className:"w-full",align:"right"})]})]}),m.length>0&&e.jsxs("div",{className:"mt-3 flex flex-wrap items-center gap-1.5 border-t border-gray-100 pt-2.5",children:[e.jsx("span",{className:"text-[11px] text-gray-500 font-medium",children:"Produk Terpilih:"}),m.map(t=>{const a=i.find(n=>n.id===t);return a?e.jsxs("span",{className:"inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 border border-blue-200",children:[a.service_type,e.jsx("button",{type:"button",onClick:()=>A(t),className:"hover:text-blue-900 focus:outline-none",children:e.jsx(U,{className:"h-3 w-3"})})]},t):null}),e.jsx("button",{type:"button",onClick:()=>j([]),className:"text-[11px] text-gray-500 hover:text-rose-600 underline ml-1",children:"Hapus Semua"})]}),e.jsxs("div",{className:"mt-4 flex items-center justify-end gap-2 border-t border-gray-100 pt-3",children:[e.jsx(g,{variant:"outline",onClick:ne,className:"text-xs font-medium",children:"Reset"}),e.jsx(g,{onClick:()=>K(),className:"text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white",children:"Terapkan Filter"})]})]}),e.jsxs("div",{className:"rounded-xl border border-gray-200 bg-white shadow-sm p-5",children:[e.jsxs("div",{className:"mb-4",children:[e.jsx("h2",{className:"text-lg font-bold text-gray-800",children:"Daftar Kontainer Karantina & Fumigasi"}),e.jsxs("p",{className:"text-xs text-gray-500",children:["Total ",e.jsx("span",{className:"font-semibold text-gray-700",children:l.total??N.length})," kontainer sesuai kriteria filter."]})]}),e.jsx("div",{className:"overflow-x-auto rounded-lg border border-gray-200",children:e.jsxs(ye,{children:[e.jsx(je,{className:"bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-600 border-b border-gray-200",children:e.jsxs(E,{children:[e.jsx(f,{className:"px-4 py-3",children:e.jsx(M,{label:"Nomor Kontainer",field:"container_number",currentSort:o.sort_by,currentDir:o.sort_dir})}),e.jsx(f,{className:"px-4 py-3",children:e.jsx(M,{label:"Nama Shipper",field:"shippers.name",currentSort:o.sort_by,currentDir:o.sort_dir})}),e.jsx(f,{className:"px-4 py-3",children:"Size"}),e.jsx(f,{className:"px-4 py-3",children:"Tanggal Masuk"}),e.jsx(f,{className:"px-4 py-3",children:"Tanggal EIR"}),e.jsx(f,{className:"px-4 py-3",children:"Tanggal Keluar"}),e.jsx(f,{className:"px-4 py-3",children:"Komoditi"}),e.jsx(f,{className:"px-4 py-3",children:"Negara Tujuan"}),e.jsx(f,{className:"px-4 py-3",children:e.jsx(M,{label:"Fumigasi",field:"fumigasi",currentSort:o.sort_by,currentDir:o.sort_dir})})]})}),e.jsx(Ne,{className:"divide-y divide-gray-100 bg-white",children:N.length===0?e.jsx(E,{children:e.jsx(p,{colSpan:9,className:"py-10 text-center text-sm text-gray-400",children:"Tidak ada data yang sesuai filter."})}):N.map(t=>{var a,n,r;return e.jsxs(E,{className:"hover:bg-slate-50/80 transition-colors",children:[e.jsx(p,{className:"px-4 py-3 text-sm font-semibold text-slate-900",children:t.container_number}),e.jsx(p,{className:"px-4 py-3 text-sm text-slate-800 font-normal",children:((n=(a=t.order)==null?void 0:a.shipper)==null?void 0:n.name)??"-"}),e.jsx(p,{className:"px-4 py-3 text-sm",children:e.jsx("span",{className:"inline-flex rounded bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700 border border-slate-200",children:G(t.price_type)})}),e.jsx(p,{className:"px-4 py-3 text-sm text-slate-800 font-normal",children:L(t.entry_date)}),e.jsx(p,{className:"px-4 py-3 text-sm text-slate-800 font-normal",children:L(t.eir_date)}),e.jsx(p,{className:"px-4 py-3 text-sm text-slate-800 font-normal",children:L(t.exit_date)}),e.jsx(p,{className:"px-4 py-3 text-sm text-slate-800 font-normal",children:t.commodity??"-"}),e.jsx(p,{className:"px-4 py-3 text-sm text-slate-800 font-normal",children:t.country??"-"}),e.jsx(p,{className:"px-4 py-3 text-sm",children:(r=t.order)!=null&&r.fumigasi?e.jsx("span",{className:"inline-flex items-center rounded-md bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800 border border-amber-200",children:t.order.fumigasi}):e.jsx("span",{className:"text-gray-400",children:"–"})})]},t.id)})})]})}),e.jsxs("div",{className:"mt-4 flex flex-col sm:flex-row items-center justify-between gap-3",children:[e.jsxs("p",{className:"text-xs text-gray-500",children:["Menampilkan ",e.jsx("span",{className:"font-semibold text-gray-700",children:l.from??0})," sampai"," ",e.jsx("span",{className:"font-semibold text-gray-700",children:l.to??0})," dari"," ",e.jsx("span",{className:"font-semibold text-gray-700",children:l.total??l.data.length})," kontainer"]}),e.jsx("div",{className:"flex flex-wrap justify-center gap-1",children:l.links.map((t,a)=>t.url?e.jsx(g,{variant:t.active?"default":"outline",disabled:!t.url,onClick:()=>_.get(t.url,{},{preserveState:!0,preserveScroll:!0}),className:"px-3 py-1 whitespace-nowrap text-xs font-medium",children:t.label.replace(/&laquo; Previous|Next &raquo;/,n=>n.includes("Previous")?"← Prev":n.includes("Next")?"Next →":n)},a):e.jsx("span",{className:"px-3 py-1 text-xs text-gray-400",children:"..."},a))})]})]}),e.jsx(pe,{open:Q,onOpenChange:w,children:e.jsxs(he,{className:"max-w-3xl",children:[e.jsx(ue,{children:e.jsx(ge,{children:"Rekam Suhu Kontainer"})}),e.jsxs("div",{className:"max-h-[60vh] space-y-6 overflow-y-auto pr-2",children:[$.map((t,a)=>e.jsxs("div",{className:"space-y-2 rounded border p-4",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(k,{htmlFor:`date_${a}`,children:"Tanggal"}),e.jsx(Se,{id:`date_${a}`,value:t.date,onChange:n=>Z(a,n),withTime:!1,inModal:!0,placeholder:"Pilih tanggal...",className:"w-[180px]"}),$.length>1&&e.jsx(g,{type:"button",size:"icon",variant:"destructive",className:"ml-auto",onClick:()=>te(a),children:e.jsx(U,{className:"h-4 w-4"})})]}),e.jsx("div",{className:"grid max-h-64 grid-cols-2 gap-2 overflow-y-auto",children:[...Array(24)].map((n,r)=>e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsxs(k,{htmlFor:`temp_${a}_${r}`,children:[r.toString().padStart(2,"0"),":00"]}),e.jsx(Y,{id:`temp_${a}_${r}`,type:"number",step:"0.1",value:t.temps[r.toString().padStart(2,"0")]||"",onChange:d=>F(a,r,d.target.value),className:"w-24"})]},r))})]},a)),e.jsxs(g,{type:"button",variant:"outline",onClick:ee,className:"flex items-center gap-2",children:[e.jsx(De,{className:"h-4 w-4"})," Tambah Tanggal"]})]}),e.jsxs(fe,{className:"gap-2",children:[e.jsx(g,{variant:"outline",onClick:()=>w(!1),children:"Batal"}),e.jsx(g,{onClick:ae,children:"Simpan"})]})]})})]})]})}export{at as default};
