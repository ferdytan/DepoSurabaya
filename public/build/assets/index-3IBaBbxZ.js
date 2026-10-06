import{r as x,K as xe,j as e,L as he,S as _,$ as ue}from"./app-D9mbpRZ1.js";import{A as ge,D as fe,d as ye,e as be,a as je,X as z}from"./app-layout-CgR8i68l.js";import{D as Ne,a as ve,b as Se,c as ke,e as _e}from"./dialog-Ce9LGERt.js";import{B as g}from"./button-BmfGQuF5.js";import{C as X}from"./checkbox-DrM_OalY.js";import{I as H}from"./input-yNy5d7rR.js";import{L as D}from"./label-ShWuU6a2.js";import{T as De,a as we,b as I,c as f,d as Te,e as h}from"./table-BrTkDIez.js";import{D as Ce}from"./date-range-picker-BeugJ4vq.js";import{D as $e}from"./date-time-picker-OMfOXR60.js";import{P as Ae}from"./printer-CcQutskM.js";import{C as Ke}from"./chevron-down-CYTzyHtU.js";import{C as Me}from"./circle-plus-CuARtNK7.js";import{A as Le,a as Ee,b as Re}from"./arrow-up-DlcjWxcq.js";import"./index--BM6qgvE.js";import"./Combination-CNnN7fKH.js";import"./index-BNGc3ogh.js";import"./index--f6htmmt.js";import"./app-logo-icon-DqKYsChy.js";import"./index-BO4zt6y5.js";import"./check-DAb8J6AF.js";import"./rotate-ccw--MGMkLC2.js";import"./chevron-left-BnWJ2s-K.js";import"./clock-Ci4LElkT.js";const F=["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];function B(l){if(!l)return e.jsx("span",{className:"text-gray-400",children:"–"});const i=new Date(l);if(isNaN(i.getTime()))return e.jsx("span",{className:"text-gray-400",children:"–"});const s=String(i.getDate()).padStart(2,"0"),o=F[i.getMonth()],u=i.getFullYear(),j=String(i.getHours()).padStart(2,"0"),m=String(i.getMinutes()).padStart(2,"0");return e.jsxs("div",{className:"flex flex-col leading-tight whitespace-nowrap",children:[e.jsxs("span",{className:"font-medium text-slate-800 text-[13px]",children:[s," ",o]}),e.jsxs("span",{className:"text-[12px] text-slate-500 font-normal",children:[u,", ",j,":",m]})]})}function V(l){if(!l)return"–";const i=new Date(l);if(isNaN(i.getTime()))return"–";const s=String(i.getDate()).padStart(2,"0"),o=F[i.getMonth()],u=i.getFullYear(),j=String(i.getHours()).padStart(2,"0"),m=String(i.getMinutes()).padStart(2,"0");return`${s} ${o} ${u}, ${j}:${m}`}const Pe=[{title:"Karantina",href:"/karantina"}];function Z(l,i){if(!l)return i||"-";const s=String(l).trim();return s.toLowerCase().endsWith("ft")?s:s==="20"||s==="40"?`${s}ft`:s||i||"-"}function ct({orders:l,products:i=[],filters:s}){var G,Q,W;const o=s||{},[u,j]=x.useState(o.search??""),[m,w]=x.useState(o.start_date??""),[N,T]=x.useState(o.end_date??""),ee=Array.isArray(s==null?void 0:s.product_ids)?s.product_ids.map(Number).filter(t=>!isNaN(t)):[],[d,y]=x.useState(ee);x.useEffect(()=>{j((s==null?void 0:s.search)??""),w((s==null?void 0:s.start_date)??""),T((s==null?void 0:s.end_date)??"");const t=Array.isArray(s==null?void 0:s.product_ids)?s.product_ids.map(Number).filter(a=>!isNaN(a)):[];y(t)},[s==null?void 0:s.search,s==null?void 0:s.start_date,s==null?void 0:s.end_date,s==null?void 0:s.product_ids]);const[te,A]=x.useState(!1),[U,ae]=x.useState(null),[K,S]=x.useState([]),k=l.data,se=(t,a)=>{S(n=>{const r=[...n];return r[t].date=a,r})},ne=(t,a,n)=>{S(r=>{const p=[...r];return p[t].temps={...p[t].temps||{},[a.toString().padStart(2,"0")]:n},p})},re=()=>{S(t=>[...t,{date:"",temps:{}}])},ie=t=>{S(a=>a.filter((n,r)=>r!==t))},oe=()=>{if(!U)return;const t={};K.forEach(a=>{a.date&&(t[a.date]=a.temps)}),console.log("Data yang dikirim ke backend:",t),_.patch(route("orders.update-temperature",U.id),{temperature:t},{onSuccess:()=>{A(!1),ae(null),S([]),_.reload({only:["orders"]})},onError:a=>{alert("Terjadi error saat menyimpan data suhu."),console.error(a)}})};x.useEffect(()=>{console.log("Semua data orders:",l.data)},[l.data]);const[M,J]=x.useState(!1),le=async()=>{const t=window.open("","_blank");if(!t){alert("Gagal membuka jendela cetak. Pastikan popup tidak diblokir.");return}t.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Menyiapkan Billing Statement...</title>
                <style>
                    body {
                        font-family: 'Segoe UI', Arial, sans-serif;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        height: 70vh;
                        color: #334155;
                        margin: 0;
                    }
                    .spinner {
                        width: 36px;
                        height: 36px;
                        border: 3px solid #e2e8f0;
                        border-top-color: #059669;
                        border-radius: 50%;
                        animation: spin 0.8s linear infinite;
                        margin-bottom: 14px;
                    }
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                </style>
            </head>
            <body>
                <div class="spinner"></div>
                <div style="font-size: 15px; font-weight: 600;">Memuat semua data kontainer untuk dicetak...</div>
                <div style="font-size: 12px; color: #64748b; margin-top: 5px;">Total data: ${l.total??k.length} kontainer</div>
            </body>
            </html>
        `),t.document.close(),J(!0);try{const a=new URLSearchParams;u&&a.append("search",u),m&&a.append("start_date",m),N&&a.append("end_date",N),o.trashed&&a.append("trashed",o.trashed),o.sort_by&&a.append("sort_by",o.sort_by),o.sort_dir&&a.append("sort_dir",o.sort_dir),d.length>0&&d.forEach(c=>a.append("product_ids[]",c.toString()));const n=await fetch(`/karantina/print-data?${a.toString()}`);if(!n.ok)throw new Error("Gagal mengambil data dari server");const p=(await n.json()).data||[];if(p.length===0){t.document.body.innerHTML=`
                    <div style="text-align: center; margin-top: 50px; font-family: Arial, sans-serif;">
                        <p style="color: #ef4444; font-weight: 600;">Tidak ada data yang sesuai filter untuk dicetak.</p>
                        <button onclick="window.close()" style="padding: 6px 12px; cursor: pointer;">Tutup</button>
                    </div>
                `;return}const $=m?new Date(m).toLocaleDateString("id-ID"):"Semua",ce=N?new Date(N).toLocaleDateString("id-ID"):"Semua",pe=`
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
                        object-fit: contain;
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
                        display: flex;
                        justify-content: space-between;
                        align-items: flex-end;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 15px;
                        font-size: 12px;
                    }
                    th, td {
                        border: 1px solid #000;
                        padding: 7px 8px;
                        text-align: left;
                    }
                    th {
                        background-color: #f0f0f0;
                        font-weight: 600;
                    }
                    .text-gray-400 {
                        color: #9ca3af;
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
                    <img src="/logo.png" alt="Logo" class="logo">
                    <div class="company-info">
                        <strong>PT. DEPO SURABAYA SEJAHTERA</strong><br>
                        Tanjung Sadari No. 90<br>
                        Surabaya<br>
                        Jawa Timur - Indonesia
                    </div>
                </div>

                <div class="customer-info">
                    <div>
                        <strong>Periode:</strong> ${`${$} s/d ${ce}`}
                    </div>
                    <div style="font-size: 12px; color: #555;">
                        Total: <strong>${p.length}</strong> Kontainer
                    </div>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th style="width: 35px; text-align: center;">No</th>
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
                        ${p.map((c,me)=>`
                            <tr>
                                <td style="text-align: center;">${me+1}</td>
                                <td style="font-weight: 600;">${c.container_number}</td>
                                <td>${c.shipper_name??"-"}</td>
                                <td>${Z(c.price_type)}</td>
                                <td>${c.entry_date?V(c.entry_date):'<span class="text-gray-400">–</span>'}</td>
                                <td>${c.exit_date?V(c.exit_date):'<span class="text-gray-400">–</span>'}</td>
                                <td>${c.commodity??"-"}</td>
                                <td>${c.country??"-"}</td>
                                <td>
                                    ${c.fumigasi?c.fumigasi.length>50?c.fumigasi.substring(0,50)+"...":c.fumigasi:"–"}
                                </td>
                            </tr>
                        `).join("")}
                    </tbody>
                </table>
            </body>
            </html>
            `;t.document.open(),t.document.write(pe),t.document.close(),setTimeout(()=>{t.focus(),t.print()},300)}catch(a){console.error("Error saat cetak billing statement:",a),t.document.body.innerHTML=`
                <div style="text-align: center; margin-top: 50px; font-family: Arial, sans-serif;">
                    <p style="color: #ef4444; font-weight: 600;">Terjadi kesalahan saat memuat seluruh data kontainer.</p>
                    <button onclick="window.close()" style="padding: 6px 12px; cursor: pointer;">Tutup</button>
                </div>
            `}finally{J(!1)}},{props:C}=xe(),[v,L]=x.useState(""),E=t=>{y(a=>a.includes(t)?a.filter(n=>n!==t):[...a,t])},b=i.filter(t=>t.service_type.toLowerCase().includes(v.toLowerCase())),Y=b.length>0&&b.every(t=>d.includes(t.id)),q=()=>{const t=b.map(a=>a.id);if(Y){const a=new Set(t);y(n=>n.filter(r=>!a.has(r)))}else y(a=>Array.from(new Set([...a,...t])))},R=t=>{const a=(t==null?void 0:t.search)!==void 0?t.search:u,n=(t==null?void 0:t.start_date)!==void 0?t.start_date:m,r=(t==null?void 0:t.end_date)!==void 0?t.end_date:N,p=(t==null?void 0:t.product_ids)!==void 0?t.product_ids:d;_.get("/karantina",{search:a||void 0,trashed:o.trashed||void 0,start_date:n||void 0,end_date:r||void 0,product_ids:p.length>0?p:void 0,sort_by:o.sort_by||void 0,sort_dir:o.sort_dir||void 0},{preserveState:!0,preserveScroll:!0})},de=()=>{j(""),w(""),T(""),y([]),L(""),_.get("/karantina")},P=({label:t,field:a,currentSort:n,currentDir:r,routeName:p="index_karantina"})=>{const $=n===a&&r==="asc"?"desc":"asc";return e.jsxs(ue,{href:route(p,{sort_by:a,sort_dir:$,search:u||void 0,start_date:m||void 0,end_date:N||void 0,product_ids:d.length>0?d:void 0}),preserveState:!0,preserveScroll:!0,className:"flex items-center gap-1 font-semibold text-gray-700 hover:text-black",children:[t,n===a?$==="asc"?e.jsx(Le,{className:"h-4 w-4"}):e.jsx(Ee,{className:"h-4 w-4"}):e.jsx(Re,{className:"h-4 w-4 text-gray-400"})]})},O={};for(const t of k){const a=t.no_aju??t.order_id;O[a]||(O[a]=[]),O[a].push(t)}return e.jsxs(ge,{breadcrumbs:Pe,children:[e.jsx(he,{title:"Karantina & Fumigasi - Depo Surabaya"}),e.jsxs("div",{className:"flex flex-1 flex-col gap-6 bg-[#f8fafc] p-4 md:p-6 min-h-screen",children:[((G=C.flash)==null?void 0:G.success)&&e.jsx("div",{className:"rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 shadow-sm",children:C.flash.success}),((Q=C.flash)==null?void 0:Q.error)&&e.jsx("div",{className:"rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 shadow-sm",children:C.flash.error}),e.jsxs("div",{className:"flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between",children:[e.jsxs("div",{children:[e.jsxs("div",{className:"flex items-center gap-2.5",children:[e.jsx("h1",{className:"text-2xl font-bold tracking-tight text-gray-800",children:"Karantina & Fumigasi"}),e.jsx("span",{className:"inline-flex items-center rounded-full bg-rose-50 px-3 py-0.5 text-xs font-semibold text-rose-700 border border-rose-200",children:"Petugas Karantina"})]}),e.jsx("p",{className:"mt-1 text-sm text-gray-500",children:"Kelola data kontainer karantina, filter pencarian per periode, dan cetak billing statement resmi."})]}),e.jsx("div",{className:"flex flex-wrap items-center gap-2",children:e.jsxs(g,{type:"button",disabled:M,onClick:le,className:"bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-sm disabled:opacity-75",children:[e.jsx(Ae,{className:`mr-2 h-4 w-4 ${M?"animate-spin":""}`}),M?"Menyiapkan Data...":"Cetak Billing Statement"]})})]}),e.jsxs("div",{className:"rounded-xl border border-gray-200 bg-white p-5 shadow-sm",children:[e.jsx("div",{className:"mb-3 flex items-center justify-between",children:e.jsx("h2",{className:"text-sm font-bold text-gray-800 uppercase tracking-wide",children:"Filter & Pencarian Kontainer"})}),e.jsxs("div",{className:"grid grid-cols-1 gap-4 md:grid-cols-12",children:[e.jsxs("div",{className:"md:col-span-5 space-y-1",children:[e.jsx(D,{htmlFor:"search",className:"text-xs font-medium text-gray-600",children:"Cari (Fumigator, Shipper, Customer, Kontainer)"}),e.jsx(H,{id:"search",type:"text",value:u,onChange:t=>j(t.target.value),onKeyDown:t=>{t.key==="Enter"&&(t.preventDefault(),R())},placeholder:"Cari fumigator, shipper, customer, atau nomor kontainer...",className:"w-full rounded-lg border-gray-300 py-2 text-sm text-gray-800 shadow-sm focus:border-blue-500"})]}),e.jsxs("div",{className:"md:col-span-3 space-y-1",children:[e.jsxs(D,{className:"text-xs font-medium text-gray-600 flex items-center justify-between",children:[e.jsx("span",{children:"Filter Produk"}),d.length>0&&e.jsxs("span",{className:"text-[11px] text-blue-600 font-semibold",children:[d.length," dipilih"]})]}),e.jsxs(fe,{children:[e.jsx(ye,{asChild:!0,children:e.jsxs(g,{variant:"outline",type:"button",className:"w-full justify-between border-gray-300 py-2 text-sm font-normal text-gray-800 shadow-sm hover:bg-gray-50 focus:border-blue-500 h-9",children:[e.jsx("span",{className:"truncate",children:d.length===0?"Semua Produk":d.length===1?((W=i.find(t=>t.id===d[0]))==null?void 0:W.service_type)||"1 Produk":`${d.length} Produk Dipilih`}),e.jsx(Ke,{className:"ml-2 h-4 w-4 shrink-0 opacity-50"})]})}),e.jsxs(be,{className:"w-80 p-2 shadow-lg",align:"start",children:[e.jsxs("div",{className:"flex items-center justify-between px-2 py-1.5 border-b border-gray-100 mb-2",children:[e.jsx("span",{className:"text-xs font-semibold text-gray-700",children:"Pilih Produk"}),e.jsxs("div",{className:"flex gap-2 text-[11px]",children:[e.jsxs("button",{type:"button",onClick:t=>{t.preventDefault(),y(i.map(a=>a.id))},className:"text-blue-600 hover:underline font-medium",children:["Pilih Semua (",i.length,")"]}),e.jsx("span",{className:"text-gray-300",children:"|"}),e.jsx("button",{type:"button",onClick:t=>{t.preventDefault(),y([])},className:"text-gray-500 hover:underline",children:"Reset"})]})]}),e.jsxs("div",{className:"relative mb-2 px-1",children:[e.jsx(je,{className:"absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400"}),e.jsx(H,{type:"text",placeholder:"Cari produk (misal: fumigasi)...",value:v,onChange:t=>L(t.target.value),onKeyDown:t=>t.stopPropagation(),className:"h-8 pl-8 pr-7 text-xs rounded-md border-gray-200 focus:border-blue-500"}),v&&e.jsx("button",{type:"button",onClick:()=>L(""),className:"absolute right-3 top-2.5 text-gray-400 hover:text-gray-600",children:e.jsx(z,{className:"h-3.5 w-3.5"})})]}),b.length>0&&e.jsxs("div",{onClick:t=>{t.preventDefault(),q()},className:"flex items-center gap-2 px-2 py-1.5 mb-1.5 rounded bg-slate-50 hover:bg-slate-100 cursor-pointer text-xs font-medium text-slate-700 border border-slate-200 transition-colors",children:[e.jsx(X,{checked:Y,onCheckedChange:q,className:"h-3.5 w-3.5"}),e.jsx("span",{className:"truncate",children:v?`Centang Semua Hasil ("${v}") (${b.length})`:`Centang Semua (${b.length})`})]}),e.jsx("div",{className:"space-y-0.5 max-h-56 overflow-y-auto",children:b.length===0?e.jsxs("div",{className:"py-4 text-center text-xs text-gray-400",children:['Tidak ada produk cocok dengan "',v,'"']}):b.map(t=>{const a=d.includes(t.id);return e.jsxs("div",{onClick:n=>{n.preventDefault(),E(t.id)},className:`flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer text-xs transition-colors ${a?"bg-blue-50 text-blue-900 font-medium":"hover:bg-gray-100 text-gray-700"}`,children:[e.jsx(X,{checked:a,onCheckedChange:()=>E(t.id),className:"h-3.5 w-3.5"}),e.jsx("span",{className:"truncate",children:t.service_type})]},t.id)})})]})]})]}),e.jsxs("div",{className:"md:col-span-4 space-y-1",children:[e.jsx(D,{className:"text-xs font-medium text-gray-600",children:"Rentang Tanggal"}),e.jsx(Ce,{startDate:m,endDate:N,onChange:({startDate:t,endDate:a})=>{w(t),T(a)},onApply:({startDate:t,endDate:a})=>{w(t),T(a),R({start_date:t,end_date:a})},placeholder:"Pilih rentang tanggal filter...",className:"w-full",align:"right"})]})]}),d.length>0&&e.jsxs("div",{className:"mt-3 flex flex-wrap items-center gap-1.5 border-t border-gray-100 pt-2.5",children:[e.jsx("span",{className:"text-[11px] text-gray-500 font-medium",children:"Produk Terpilih:"}),d.map(t=>{const a=i.find(n=>n.id===t);return a?e.jsxs("span",{className:"inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 border border-blue-200",children:[a.service_type,e.jsx("button",{type:"button",onClick:()=>E(t),className:"hover:text-blue-900 focus:outline-none",children:e.jsx(z,{className:"h-3 w-3"})})]},t):null}),e.jsx("button",{type:"button",onClick:()=>y([]),className:"text-[11px] text-gray-500 hover:text-rose-600 underline ml-1",children:"Hapus Semua"})]}),e.jsxs("div",{className:"mt-4 flex items-center justify-end gap-2 border-t border-gray-100 pt-3",children:[e.jsx(g,{variant:"outline",onClick:de,className:"text-xs font-medium",children:"Reset"}),e.jsx(g,{onClick:()=>R(),className:"text-xs font-semibold bg-gray-900 hover:bg-black text-white",children:"Terapkan Filter"})]})]}),e.jsxs("div",{className:"rounded-xl border border-gray-200 bg-white shadow-sm p-5",children:[e.jsxs("div",{className:"mb-4",children:[e.jsx("h2",{className:"text-lg font-bold text-gray-800",children:"Daftar Kontainer Karantina & Fumigasi"}),e.jsxs("p",{className:"text-xs text-gray-500",children:["Total ",e.jsx("span",{className:"font-semibold text-gray-700",children:l.total??k.length})," kontainer sesuai kriteria filter."]})]}),e.jsx("div",{className:"overflow-x-auto rounded-lg border border-gray-200",children:e.jsxs(De,{children:[e.jsx(we,{className:"bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-600 border-b border-gray-200",children:e.jsxs(I,{children:[e.jsx(f,{className:"px-4 py-3",children:e.jsx(P,{label:"Nomor Kontainer",field:"container_number",currentSort:o.sort_by,currentDir:o.sort_dir})}),e.jsx(f,{className:"px-4 py-3",children:e.jsx(P,{label:"Nama Shipper",field:"shippers.name",currentSort:o.sort_by,currentDir:o.sort_dir})}),e.jsx(f,{className:"px-4 py-3",children:"Size"}),e.jsx(f,{className:"px-4 py-3",children:"Tanggal Masuk"}),e.jsx(f,{className:"px-4 py-3",children:"Tanggal EIR"}),e.jsx(f,{className:"px-4 py-3",children:"Tanggal Keluar"}),e.jsx(f,{className:"px-4 py-3",children:"Komoditi"}),e.jsx(f,{className:"px-4 py-3",children:"Negara Tujuan"}),e.jsx(f,{className:"px-4 py-3",children:e.jsx(P,{label:"Fumigasi",field:"fumigasi",currentSort:o.sort_by,currentDir:o.sort_dir})})]})}),e.jsx(Te,{className:"divide-y divide-gray-100 bg-white",children:k.length===0?e.jsx(I,{children:e.jsx(h,{colSpan:9,className:"py-10 text-center text-sm text-gray-400",children:"Tidak ada data yang sesuai filter."})}):k.map(t=>{var a,n,r;return e.jsxs(I,{className:"hover:bg-slate-50/80 transition-colors",children:[e.jsx(h,{className:"px-4 py-3 text-sm font-semibold text-slate-900",children:t.container_number}),e.jsx(h,{className:"px-4 py-3 text-sm text-slate-800 font-normal",children:((n=(a=t.order)==null?void 0:a.shipper)==null?void 0:n.name)??"-"}),e.jsx(h,{className:"px-4 py-3 text-sm",children:e.jsx("span",{className:"inline-flex rounded bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700 border border-slate-200",children:Z(t.price_type)})}),e.jsx(h,{className:"px-4 py-3 text-sm text-slate-800 font-normal",children:B(t.entry_date)}),e.jsx(h,{className:"px-4 py-3 text-sm text-slate-800 font-normal",children:B(t.eir_date)}),e.jsx(h,{className:"px-4 py-3 text-sm text-slate-800 font-normal",children:B(t.exit_date)}),e.jsx(h,{className:"px-4 py-3 text-sm text-slate-800 font-normal",children:t.commodity??"-"}),e.jsx(h,{className:"px-4 py-3 text-sm text-slate-800 font-normal",children:t.country??"-"}),e.jsx(h,{className:"px-4 py-3 text-sm",children:(r=t.order)!=null&&r.fumigasi?e.jsx("span",{className:"inline-flex items-center rounded-md bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800 border border-amber-200",children:t.order.fumigasi}):e.jsx("span",{className:"text-gray-400",children:"–"})})]},t.id)})})]})}),e.jsxs("div",{className:"mt-4 flex flex-col sm:flex-row items-center justify-between gap-3",children:[e.jsxs("p",{className:"text-xs text-gray-500",children:["Menampilkan ",e.jsx("span",{className:"font-semibold text-gray-700",children:l.from??0})," sampai"," ",e.jsx("span",{className:"font-semibold text-gray-700",children:l.to??0})," dari"," ",e.jsx("span",{className:"font-semibold text-gray-700",children:l.total??l.data.length})," kontainer"]}),e.jsx("div",{className:"flex flex-wrap justify-center gap-1",children:l.links.map((t,a)=>t.url?e.jsx(g,{variant:t.active?"default":"outline",disabled:!t.url,onClick:()=>_.get(t.url,{},{preserveState:!0,preserveScroll:!0}),className:"px-3 py-1 whitespace-nowrap text-xs font-medium",children:t.label.replace(/&laquo; Previous|Next &raquo;/,n=>n.includes("Previous")?"← Prev":n.includes("Next")?"Next →":n)},a):e.jsx("span",{className:"px-3 py-1 text-xs text-gray-400",children:"..."},a))})]})]}),e.jsx(Ne,{open:te,onOpenChange:A,children:e.jsxs(ve,{className:"max-w-3xl",children:[e.jsx(Se,{children:e.jsx(ke,{children:"Rekam Suhu Kontainer"})}),e.jsxs("div",{className:"max-h-[60vh] space-y-6 overflow-y-auto pr-2",children:[K.map((t,a)=>e.jsxs("div",{className:"space-y-2 rounded border p-4",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(D,{htmlFor:`date_${a}`,children:"Tanggal"}),e.jsx($e,{id:`date_${a}`,value:t.date,onChange:n=>se(a,n),withTime:!1,inModal:!0,placeholder:"Pilih tanggal...",className:"w-[180px]"}),K.length>1&&e.jsx(g,{type:"button",size:"icon",variant:"destructive",className:"ml-auto",onClick:()=>ie(a),children:e.jsx(z,{className:"h-4 w-4"})})]}),e.jsx("div",{className:"grid max-h-64 grid-cols-2 gap-2 overflow-y-auto",children:[...Array(24)].map((n,r)=>e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsxs(D,{htmlFor:`temp_${a}_${r}`,children:[r.toString().padStart(2,"0"),":00"]}),e.jsx(H,{id:`temp_${a}_${r}`,type:"number",step:"0.1",value:t.temps[r.toString().padStart(2,"0")]||"",onChange:p=>ne(a,r,p.target.value),className:"w-24"})]},r))})]},a)),e.jsxs(g,{type:"button",variant:"outline",onClick:re,className:"flex items-center gap-2",children:[e.jsx(Me,{className:"h-4 w-4"})," Tambah Tanggal"]})]}),e.jsxs(_e,{className:"gap-2",children:[e.jsx(g,{variant:"outline",onClick:()=>A(!1),children:"Batal"}),e.jsx(g,{onClick:oe,children:"Simpan"})]})]})})]})]})}export{ct as default};
