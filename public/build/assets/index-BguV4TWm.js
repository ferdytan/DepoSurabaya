import{r as u,K as G,j as e,L as J,S as w,$ as Y}from"./app-BDj2hI3e.js";import{A as V,X}from"./app-layout-4MT63Djw.js";import{O as Q}from"./layout-DE7aYo7l.js";import{D as Z,a as ee,b as ae,c as te,d as se}from"./dialog-ZYb1DTTU.js";import{H as re}from"./heading-CJ5PL6AF.js";import{a as ne,B as h}from"./app-logo-icon-Cx3HhxG1.js";import{I as f}from"./input-DFl64L3X.js";import{L as j}from"./label-BOGwGkn5.js";import{T as ie,a as le,b as k,c as p,d as oe,e as d}from"./table-C94nOi4p.js";import{C as de}from"./circle-plus-Bq2bGBal.js";import{A as ce,a as me,b as pe}from"./arrow-up-D12d31fI.js";import"./index-CUZy19RV.js";import"./Combination-CZwD_nMo.js";import"./index-CZh6V1hJ.js";import"./index-Q45a6phs.js";/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ue=[["path",{d:"M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2",key:"143wyd"}],["path",{d:"M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6",key:"1itne7"}],["rect",{x:"6",y:"14",width:"12",height:"8",rx:"1",key:"1ue0tg"}]],he=ne("Printer",ue),ge=[{title:"Order Management",href:"/karantina"}];function Le({orders:y,filters:A}){var $;const o=A||{},[N,E]=u.useState(o.search??""),[c,R]=u.useState(o.start_date??""),[m,K]=u.useState(o.end_date??""),[F,v]=u.useState(!1),[T,M]=u.useState(null),[_,g]=u.useState([]),x=y.data.filter(a=>!c&&!m?!0:[a.entry_date,a.eir_date,a.exit_date].some(s=>{if(!s)return!1;const n=new Date(s),i=c?new Date(c):null,b=m?new Date(m):null;return!(i&&n<i||b&&n>b)})),z=(a,t)=>{g(r=>{const s=[...r];return s[a].date=t,s})},B=(a,t,r)=>{g(s=>{const n=[...s];return n[a].temps={...n[a].temps||{},[t.toString().padStart(2,"0")]:r},n})},H=()=>{g(a=>[...a,{date:"",temps:{}}])},I=a=>{g(t=>t.filter((r,s)=>s!==a))},U=()=>{if(!T)return;const a={};_.forEach(t=>{t.date&&(a[t.date]=t.temps)}),console.log("Data yang dikirim ke backend:",a),w.patch(route("orders.update-temperature",T.id),{temperature:a},{onSuccess:()=>{v(!1),M(null),g([]),w.reload({only:["orders"]})},onError:t=>{alert("Terjadi error saat menyimpan data suhu."),console.error(t)}})};u.useEffect(()=>{console.log("Semua data orders:",y.data)},[y.data]);const W=()=>{if(x.length===0){alert("Tidak ada data yang sesuai filter untuk dicetak.");return}const a=c?new Date(c).toLocaleDateString("id-ID"):"Semua",t=m?new Date(m).toLocaleDateString("id-ID"):"Semua",r=`${a} s/d ${t}`,s="/logo.png",n=new Image;n.src=s;const i=window.open("","_blank");if(!i){alert("Gagal membuka jendela cetak. Pastikan popup tidak diblokir.");return}i.document.write(`
        <div style="text-align: center; margin-top: 50px; font-family: Arial, sans-serif;">
            Memuat logo...
        </div>
    `),i.document.close(),n.onload=()=>{const b=`
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
                        ${x.map(l=>{var L,P,O;return`
                            <tr>
                                <td>${l.container_number}</td>
                                <td>${((P=(L=l.order)==null?void 0:L.shipper)==null?void 0:P.name)??"-"}</td>
                                <td>${l.price_type??"-"}</td>
                                <td>${l.entry_date?new Date(l.entry_date).toLocaleString("id-ID"):'<span class="text-gray-400">–</span>'}</td>
                                <td>${l.eir_date?new Date(l.eir_date).toLocaleString("id-ID"):'<span class="text-gray-400">–</span>'}</td>
                                <td>${l.exit_date?new Date(l.exit_date).toLocaleString("id-ID"):'<span class="text-gray-400">–</span>'}</td>
                                <td>${l.commodity??"-"}</td>
                                <td>
    ${(O=l.order)!=null&&O.fumigasi?l.order.fumigasi.length>50?l.order.fumigasi.substring(0,50)+"...":l.order.fumigasi:"–"}
</td>
                            </tr>
                        `}).join("")}
                    </tbody>
                </table>

            </body>
            </html>
        `;i.document.write(b),i.document.close(),i.focus(),setTimeout(()=>i.print(),300)},n.onerror=()=>{alert("Gagal memuat logo. Pastikan file /logo.png ada di folder public."),i.close()}},{props:C}=G(),q=()=>{const t=(window.location.pathname.startsWith("/karantina"),"/karantina");w.get(t,{search:N,trashed:o.trashed,start_date:c,end_date:m})},S=({label:a,field:t,currentSort:r,currentDir:s,routeName:n="index_karantina"})=>{const i=r===t&&s==="asc"?"desc":"asc";return e.jsxs(Y,{href:route(n,{sort_by:t,sort_dir:i,search:N,start_date:c,end_date:m}),className:"flex items-center gap-1 font-semibold text-gray-700 hover:text-black",children:[a," ",r===t?i==="asc"?e.jsx(ce,{className:"h-4 w-4"}):e.jsx(me,{className:"h-4 w-4"}):e.jsx(pe,{className:"h-4 w-4 text-gray-400"})]})},D={};for(const a of x){const t=a.no_aju??a.order_id;D[t]||(D[t]=[]),D[t].push(a)}return e.jsxs(V,{breadcrumbs:ge,children:[e.jsx(J,{title:"Order Management"}),e.jsxs(Q,{children:[e.jsxs("div",{className:"space-y-6",children:[(($=C.flash)==null?void 0:$.success)&&e.jsx("div",{className:"rounded-md bg-green-50 p-4 text-sm text-green-700",children:C.flash.success}),e.jsx(re,{title:"Order List",description:"Manage all registered orders and their statuses."}),e.jsxs("div",{className:"space-y-4 rounded-lg border p-4",children:[e.jsxs("div",{className:"grid grid-cols-1 gap-4 md:grid-cols-3",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx(j,{htmlFor:"search",children:"Cari (Fumigator, Shipper, Kontainer)"}),e.jsx(f,{id:"search",type:"text",value:N,onChange:a=>E(a.target.value),placeholder:"Cari fumigator, shipper, atau nomor kontainer",className:"w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(j,{htmlFor:"start-date",children:"Tanggal Mulai"}),e.jsx(f,{id:"start-date",type:"date",value:c,onChange:a=>R(a.target.value),className:"w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(j,{htmlFor:"end-date",children:"Tanggal Selesai"}),e.jsx(f,{id:"end-date",type:"date",value:m,onChange:a=>K(a.target.value),className:"w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"})]})]}),e.jsx("div",{className:"flex justify-end",children:e.jsx(h,{onClick:q,className:"w-full sm:w-auto",children:"Cari"})})]}),e.jsx("div",{className:"space-y-2",children:e.jsxs(h,{onClick:W,className:"mb-2",children:[e.jsx(he,{className:"mr-2 h-4 w-4"}),"Cetak Billing Statement"]})}),e.jsxs("div",{className:"w-full rounded-md border",children:[e.jsx("div",{className:"overflow-x-auto",style:{maxWidth:"100vw"}}),e.jsxs(ie,{children:[e.jsx(le,{children:e.jsxs(k,{children:[e.jsx(p,{children:e.jsx(S,{label:"Nomor Kontainer",field:"container_number",currentSort:o.sort_by,currentDir:o.sort_dir})}),e.jsx(p,{children:e.jsx(S,{label:"Nama Shipper",field:"shippers.name",currentSort:o.sort_by,currentDir:o.sort_dir})}),e.jsx(p,{children:"Size"}),e.jsx(p,{children:"Tanggal Masuk"}),e.jsx(p,{children:"Tanggal EIR"}),e.jsx(p,{children:"Tanggal Keluar"}),e.jsx(p,{children:"Komoditi"}),e.jsx(p,{children:e.jsx(S,{label:"Fumigasi",field:"fumigasi",currentSort:o.sort_by,currentDir:o.sort_dir})})]})}),e.jsx(oe,{children:x.length===0?e.jsx(k,{children:e.jsx(d,{className:"py-8 text-center text-sm text-muted-foreground",children:"Tidak ada data yang sesuai filter."})}):x.map(a=>{var t,r,s;return e.jsxs(k,{className:"group",children:[e.jsx(d,{className:"py-3",children:a.container_number}),e.jsx(d,{className:"py-3",children:((r=(t=a.order)==null?void 0:t.shipper)==null?void 0:r.name)??"-"}),e.jsx(d,{className:"py-3",children:a.price_type??"-"}),e.jsx(d,{className:"py-3",children:a.entry_date?new Date(a.entry_date).toLocaleString():e.jsx("span",{children:"-"})}),e.jsx(d,{className:"py-3",children:a.eir_date?new Date(a.eir_date).toLocaleString():e.jsx("span",{children:"-"})}),e.jsx(d,{className:"py-3",children:a.exit_date?new Date(a.exit_date).toLocaleString():e.jsx("span",{children:"-"})}),e.jsx(d,{className:"py-3",children:a.commodity??"-"}),e.jsx(d,{className:"py-3",children:(s=a.order)!=null&&s.fumigasi?e.jsx("span",{className:"rounded bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800",children:a.order.fumigasi.length>50?`${a.order.fumigasi.substring(0,50)}...`:a.order.fumigasi}):e.jsx("span",{className:"text-gray-400",children:"–"})})]},a.id)})})]})]})]}),e.jsx("div",{className:"flex flex-wrap justify-center gap-1",children:y.links.map((a,t)=>a.url?e.jsx(h,{variant:a.active?"default":"outline",disabled:!a.url,onClick:()=>w.get(a.url),className:"px-3 py-1 whitespace-nowrap",children:a.label.replace(/&laquo; Previous|Next &raquo;/,r=>r.includes("Previous")?"← Prev":r.includes("Next")?"Next →":r)},t):e.jsx("span",{className:"px-3 py-1",children:"..."},t))}),e.jsx(Z,{open:F,onOpenChange:v,children:e.jsxs(ee,{className:"max-w-3xl",children:[e.jsx(ae,{children:e.jsx(te,{children:"Rekam Suhu Kontainer"})}),e.jsxs("div",{className:"max-h-[60vh] space-y-6 overflow-y-auto pr-2",children:[_.map((a,t)=>e.jsxs("div",{className:"space-y-2 rounded border p-4",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(j,{htmlFor:`date_${t}`,children:"Tanggal"}),e.jsx(f,{id:`date_${t}`,type:"date",value:a.date,onChange:r=>z(t,r.target.value),className:"max-w-[180px]"}),_.length>1&&e.jsx(h,{type:"button",size:"icon",variant:"destructive",className:"ml-auto",onClick:()=>I(t),children:e.jsx(X,{className:"h-4 w-4"})})]}),e.jsx("div",{className:"grid max-h-64 grid-cols-2 gap-2 overflow-y-auto",children:[...Array(24)].map((r,s)=>e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsxs(j,{htmlFor:`temp_${t}_${s}`,children:[s.toString().padStart(2,"0"),":00"]}),e.jsx(f,{id:`temp_${t}_${s}`,type:"number",step:"0.1",value:a.temps[s.toString().padStart(2,"0")]||"",onChange:n=>B(t,s,n.target.value),className:"w-24"})]},s))})]},t)),e.jsxs(h,{type:"button",variant:"outline",onClick:H,className:"flex items-center gap-2",children:[e.jsx(de,{className:"h-4 w-4"})," Tambah Tanggal"]})]}),e.jsxs(se,{className:"gap-2",children:[e.jsx(h,{variant:"outline",onClick:()=>v(!1),children:"Batal"}),e.jsx(h,{onClick:U,children:"Simpan"})]})]})})]})]})}export{Le as default};
