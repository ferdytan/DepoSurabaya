import{r as p,K as X,j as e,L as Q,S as _,$ as Z}from"./app-Bw5_X8C_.js";import{A as ee,X as ae}from"./app-layout-DhkEty53.js";import{O as te}from"./layout-DWFonPkQ.js";import{D as se,a as re,b as ne,c as ie,d as oe}from"./dialog-nkFOSbN8.js";import{H as le}from"./heading-D8KozIKo.js";import{a as de,B as x}from"./app-logo-icon-DcjX3EQz.js";import{I as N}from"./input-U_kruAqK.js";import{L as f}from"./label-CpQYvM52.js";import{T as ce,a as me,b as L,c as h,d as ue,e as c}from"./table-Bql2JKNd.js";import{C as pe}from"./circle-plus-DHIMTtG2.js";import{A as he,a as ge,b as xe}from"./arrow-up-BmVpb9y0.js";import"./index-jcl7UHS3.js";import"./Combination--a72MVdn.js";import"./index-Dy5gNttV.js";import"./index-EpOxYfGr.js";/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const fe=[["path",{d:"M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2",key:"143wyd"}],["path",{d:"M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6",key:"1itne7"}],["rect",{x:"6",y:"14",width:"12",height:"8",rx:"1",key:"1ue0tg"}]],je=de("Printer",fe),ye=[{title:"Order Management",href:"/karantina"}];function Fe({orders:v,customers:E,filters:R}){var A;const o=R||{},[D,K]=p.useState(o.search??""),[g,M]=p.useState(o.customer??""),[m,z]=p.useState(o.start_date??""),[u,B]=p.useState(o.end_date??""),[H,k]=p.useState(!1),[P,I]=p.useState(null),[T,j]=p.useState([]),y=v.data.filter(a=>{var i,l;const t=((l=(i=a.order)==null?void 0:i.customer)==null?void 0:l.name)??"";return(!g||t===g)&&(!m&&!u?!0:[a.entry_date,a.eir_date,a.exit_date].some(S=>{if(!S)return!1;const n=new Date(S),b=m?new Date(m):null,w=u?new Date(u):null;return!(b&&n<b||w&&n>w)}))}),U=(a,t)=>{j(r=>{const s=[...r];return s[a].date=t,s})},W=(a,t,r)=>{j(s=>{const i=[...s];return i[a].temps={...i[a].temps||{},[t.toString().padStart(2,"0")]:r},i})},q=()=>{j(a=>[...a,{date:"",temps:{}}])},G=a=>{j(t=>t.filter((r,s)=>s!==a))},J=()=>{if(!P)return;const a={};T.forEach(t=>{t.date&&(a[t.date]=t.temps)}),console.log("Data yang dikirim ke backend:",a),_.patch(route("orders.update-temperature",P.id),{temperature:a},{onSuccess:()=>{k(!1),I(null),j([]),_.reload({only:["orders"]})},onError:t=>{alert("Terjadi error saat menyimpan data suhu."),console.error(t)}})};p.useEffect(()=>{console.log("Semua data orders:",v.data)},[v.data]);const Y=()=>{if(y.length===0){alert("Tidak ada data yang sesuai filter untuk dicetak.");return}const a=m?new Date(m).toLocaleDateString("id-ID"):"Semua",t=u?new Date(u).toLocaleDateString("id-ID"):"Semua",r=`${a} s/d ${t}`,s=g?`Customer: ${g}`:"Semua Customer",i="/logo.png",l=new Image;l.src=i;const d=window.open("","_blank");if(!d){alert("Gagal membuka jendela cetak. Pastikan popup tidak diblokir.");return}d.document.write(`
        <div style="text-align: center; margin-top: 50px; font-family: Arial, sans-serif;">
            Memuat logo...
        </div>
    `),d.document.close(),l.onload=()=>{const S=`
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
                    <img src="${i}" alt="Logo" class="logo">
                    <div class="company-info">
                        <strong>PT. DEPO SUBARAYA SEJAHTERA</strong><br>
                        Tanjung Sadari No. 90<br>
                        Surabaya<br>
                        Jawa Timur - Indonesia
                    </div>
                </div>

                <div class="customer-info">
                    <strong>${s}</strong><br>
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
                        ${y.map(n=>{var b,w,F;return`
                            <tr>
                                <td>${n.container_number}</td>
                                <td>${((w=(b=n.order)==null?void 0:b.shipper)==null?void 0:w.name)??"-"}</td>
                                <td>${n.price_type??"-"}</td>
                                <td>${n.entry_date?new Date(n.entry_date).toLocaleString("id-ID"):'<span class="text-gray-400">–</span>'}</td>
                                <td>${n.eir_date?new Date(n.eir_date).toLocaleString("id-ID"):'<span class="text-gray-400">–</span>'}</td>
                                <td>${n.exit_date?new Date(n.exit_date).toLocaleString("id-ID"):'<span class="text-gray-400">–</span>'}</td>
                                <td>${n.commodity??"-"}</td>
                                <td>
    ${(F=n.order)!=null&&F.fumigasi?n.order.fumigasi.length>50?n.order.fumigasi.substring(0,50)+"...":n.order.fumigasi:"–"}
</td>
                            </tr>
                        `}).join("")}
                    </tbody>
                </table>

            </body>
            </html>
        `;d.document.write(S),d.document.close(),d.focus(),setTimeout(()=>d.print(),300)},l.onerror=()=>{alert("Gagal memuat logo. Pastikan file /logo.png ada di folder public."),d.close()}},{props:O}=X(),V=()=>{const t=(window.location.pathname.startsWith("/karantina"),"/karantina");_.get(t,{search:D,trashed:o.trashed,start_date:m,end_date:u,customer:g})},C=({label:a,field:t,currentSort:r,currentDir:s,routeName:i="index_karantina"})=>{const l=r===t&&s==="asc"?"desc":"asc";return e.jsxs(Z,{href:route(i,{sort_by:t,sort_dir:l,search:D,customer:g,start_date:m,end_date:u}),className:"flex items-center gap-1 font-semibold text-gray-700 hover:text-black",children:[a," ",r===t?l==="asc"?e.jsx(he,{className:"h-4 w-4"}):e.jsx(ge,{className:"h-4 w-4"}):e.jsx(xe,{className:"h-4 w-4 text-gray-400"})]})},$={};for(const a of y){const t=a.no_aju??a.order_id;$[t]||($[t]=[]),$[t].push(a)}return e.jsxs(ee,{breadcrumbs:ye,children:[e.jsx(Q,{title:"Order Management"}),e.jsxs(te,{children:[e.jsxs("div",{className:"space-y-6",children:[((A=O.flash)==null?void 0:A.success)&&e.jsx("div",{className:"rounded-md bg-green-50 p-4 text-sm text-green-700",children:O.flash.success}),e.jsx(le,{title:"Order List",description:"Manage all registered orders and their statuses."}),e.jsxs("div",{className:"space-y-4 rounded-lg border p-4",children:[e.jsxs("div",{className:"grid grid-cols-1 gap-4 md:grid-cols-4",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx(f,{htmlFor:"search",children:"Cari (Fumigator, Shipper, Kontainer)"}),e.jsx(N,{id:"search",type:"text",value:D,onChange:a=>K(a.target.value),placeholder:"Cari fumigator, shipper, atau nomor kontainer",className:"w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(f,{htmlFor:"customer-filter",children:"Filter Customer"}),e.jsxs("select",{id:"customer-filter",value:g,onChange:a=>M(a.target.value),className:"w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500",children:[e.jsx("option",{value:"",children:"Semua Customer"}),E.map(a=>e.jsx("option",{value:a.name,children:a.name},a.id))]})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(f,{htmlFor:"start-date",children:"Tanggal Mulai"}),e.jsx(N,{id:"start-date",type:"date",value:m,onChange:a=>z(a.target.value),className:"w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(f,{htmlFor:"end-date",children:"Tanggal Selesai"}),e.jsx(N,{id:"end-date",type:"date",value:u,onChange:a=>B(a.target.value),className:"w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"})]})]}),e.jsx("div",{className:"flex justify-end",children:e.jsx(x,{onClick:V,className:"w-full sm:w-auto",children:"Cari"})})]}),e.jsx("div",{className:"space-y-2",children:e.jsxs(x,{onClick:Y,className:"mb-2",children:[e.jsx(je,{className:"mr-2 h-4 w-4"}),"Cetak Billing Statement"]})}),e.jsxs("div",{className:"w-full rounded-md border",children:[e.jsx("div",{className:"overflow-x-auto",style:{maxWidth:"100vw"}}),e.jsxs(ce,{children:[e.jsx(me,{children:e.jsxs(L,{children:[e.jsx(h,{children:e.jsx(C,{label:"Nomor Kontainer",field:"container_number",currentSort:o.sort_by,currentDir:o.sort_dir})}),e.jsx(h,{children:e.jsx(C,{label:"Nama Shipper",field:"shippers.name",currentSort:o.sort_by,currentDir:o.sort_dir})}),e.jsx(h,{children:"Size"}),e.jsx(h,{children:"Tanggal Masuk"}),e.jsx(h,{children:"Tanggal EIR"}),e.jsx(h,{children:"Tanggal Keluar"}),e.jsx(h,{children:"Komoditi"}),e.jsx(h,{children:e.jsx(C,{label:"Fumigasi",field:"fumigasi",currentSort:o.sort_by,currentDir:o.sort_dir})})]})}),e.jsx(ue,{children:y.length===0?e.jsx(L,{children:e.jsx(c,{className:"py-8 text-center text-sm text-muted-foreground",children:"Tidak ada data yang sesuai filter."})}):y.map(a=>{var t,r,s;return e.jsxs(L,{className:"group",children:[e.jsx(c,{className:"py-3",children:a.container_number}),e.jsx(c,{className:"py-3",children:((r=(t=a.order)==null?void 0:t.shipper)==null?void 0:r.name)??"-"}),e.jsx(c,{className:"py-3",children:a.price_type??"-"}),e.jsx(c,{className:"py-3",children:a.entry_date?new Date(a.entry_date).toLocaleString():e.jsx("span",{children:"-"})}),e.jsx(c,{className:"py-3",children:a.eir_date?new Date(a.eir_date).toLocaleString():e.jsx("span",{children:"-"})}),e.jsx(c,{className:"py-3",children:a.exit_date?new Date(a.exit_date).toLocaleString():e.jsx("span",{children:"-"})}),e.jsx(c,{className:"py-3",children:a.commodity??"-"}),e.jsx(c,{className:"py-3",children:(s=a.order)!=null&&s.fumigasi?e.jsx("span",{className:"rounded bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800",children:a.order.fumigasi.length>50?`${a.order.fumigasi.substring(0,50)}...`:a.order.fumigasi}):e.jsx("span",{className:"text-gray-400",children:"–"})})]},a.id)})})]})]})]}),e.jsx("div",{className:"flex flex-wrap justify-center gap-1",children:v.links.map((a,t)=>a.url?e.jsx(x,{variant:a.active?"default":"outline",disabled:!a.url,onClick:()=>_.get(a.url),className:"px-3 py-1 whitespace-nowrap",children:a.label.replace(/&laquo; Previous|Next &raquo;/,r=>r.includes("Previous")?"← Prev":r.includes("Next")?"Next →":r)},t):e.jsx("span",{className:"px-3 py-1",children:"..."},t))}),e.jsx(se,{open:H,onOpenChange:k,children:e.jsxs(re,{className:"max-w-3xl",children:[e.jsx(ne,{children:e.jsx(ie,{children:"Rekam Suhu Kontainer"})}),e.jsxs("div",{className:"max-h-[60vh] space-y-6 overflow-y-auto pr-2",children:[T.map((a,t)=>e.jsxs("div",{className:"space-y-2 rounded border p-4",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(f,{htmlFor:`date_${t}`,children:"Tanggal"}),e.jsx(N,{id:`date_${t}`,type:"date",value:a.date,onChange:r=>U(t,r.target.value),className:"max-w-[180px]"}),T.length>1&&e.jsx(x,{type:"button",size:"icon",variant:"destructive",className:"ml-auto",onClick:()=>G(t),children:e.jsx(ae,{className:"h-4 w-4"})})]}),e.jsx("div",{className:"grid max-h-64 grid-cols-2 gap-2 overflow-y-auto",children:[...Array(24)].map((r,s)=>e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsxs(f,{htmlFor:`temp_${t}_${s}`,children:[s.toString().padStart(2,"0"),":00"]}),e.jsx(N,{id:`temp_${t}_${s}`,type:"number",step:"0.1",value:a.temps[s.toString().padStart(2,"0")]||"",onChange:i=>W(t,s,i.target.value),className:"w-24"})]},s))})]},t)),e.jsxs(x,{type:"button",variant:"outline",onClick:q,className:"flex items-center gap-2",children:[e.jsx(pe,{className:"h-4 w-4"})," Tambah Tanggal"]})]}),e.jsxs(oe,{className:"gap-2",children:[e.jsx(x,{variant:"outline",onClick:()=>k(!1),children:"Batal"}),e.jsx(x,{onClick:J,children:"Simpan"})]})]})})]})]})}export{Fe as default};
