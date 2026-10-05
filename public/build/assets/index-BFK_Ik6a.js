import{r as p,K as xe,j as e,L as pe,S as D,$ as he}from"./app-Cgu03niO.js";import{A as ue,D as ge,d as fe,e as be,a as ye,X as P}from"./app-layout-DfGuNDX-.js";import{D as je,a as Ne,b as ve,c as Se,e as ke}from"./dialog-CGPhmqtd.js";import{B as g}from"./button-D8fypwmx.js";import{C as V}from"./checkbox-DHxMWWZo.js";import{I as z}from"./input-BdQVCI0M.js";import{L as C}from"./label-CoAEU7N2.js";import{T as _e,a as De,b as H,c as f,d as Ce,e as h}from"./table-Bwn_AWi7.js";import{D as Te}from"./date-range-picker-CI-xVbaK.js";import{D as we}from"./date-time-picker-Bm7z4-ai.js";import{P as $e}from"./printer-Bq7nkbVe.js";import{C as Ae}from"./chevron-down-Vg5o5-5M.js";import{C as Ke}from"./circle-plus-D0aBW0Vx.js";import{A as Me,a as Le,b as Re}from"./arrow-up-Dhcmj1-k.js";/* empty css            */import"./index-C-NHsM_K.js";import"./Combination-DQKr_Ho3.js";import"./index-GBLHgH_V.js";import"./index-kCU8ENg1.js";import"./app-logo-icon-02WPjxNd.js";import"./index-DiM8MLqg.js";import"./check-yKRG3DSI.js";import"./rotate-ccw-BDsPad0b.js";import"./chevron-left-D3c88B6N.js";import"./clock-PYh1_9Fb.js";const ee=["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];function I(i){if(!i)return e.jsx("span",{className:"text-gray-400",children:"–"});const l=new Date(i);if(isNaN(l.getTime()))return e.jsx("span",{className:"text-gray-400",children:"–"});const s=String(l.getDate()).padStart(2,"0"),o=ee[l.getMonth()],j=l.getFullYear(),N=String(l.getHours()).padStart(2,"0"),u=String(l.getMinutes()).padStart(2,"0");return e.jsxs("div",{className:"flex flex-col leading-tight whitespace-nowrap",children:[e.jsxs("span",{className:"font-medium text-slate-800 text-[13px]",children:[s," ",o]}),e.jsxs("span",{className:"text-[12px] text-slate-500 font-normal",children:[j,", ",N,":",u]})]})}function Z(i){if(!i)return"–";const l=new Date(i);if(isNaN(l.getTime()))return"–";const s=String(l.getDate()).padStart(2,"0"),o=ee[l.getMonth()],j=l.getFullYear(),N=String(l.getHours()).padStart(2,"0"),u=String(l.getMinutes()).padStart(2,"0");return`${s} ${o} ${j}, ${N}:${u}`}const Ee=[{title:"Karantina",href:"/karantina"}];function F(i,l){if(!i)return l||"-";const s=String(i).trim();return s.toLowerCase().endsWith("ft")?s:s==="20"||s==="40"?`${s}ft`:s||l||"-"}function ot({orders:i,products:l=[],filters:s}){var Y,q,G;const o=s||{},[j,N]=p.useState(o.search??""),[u,T]=p.useState(o.start_date??""),[k,w]=p.useState(o.end_date??""),te=Array.isArray(s==null?void 0:s.product_ids)?s.product_ids.map(Number).filter(t=>!isNaN(t)):[],[c,b]=p.useState(te);p.useEffect(()=>{N((s==null?void 0:s.search)??""),T((s==null?void 0:s.start_date)??""),w((s==null?void 0:s.end_date)??"");const t=Array.isArray(s==null?void 0:s.product_ids)?s.product_ids.map(Number).filter(a=>!isNaN(a)):[];b(t)},[s==null?void 0:s.search,s==null?void 0:s.start_date,s==null?void 0:s.end_date,s==null?void 0:s.product_ids]);const[ae,A]=p.useState(!1),[B,se]=p.useState(null),[K,_]=p.useState([]),v=i.data,ne=(t,a)=>{_(n=>{const r=[...n];return r[t].date=a,r})},re=(t,a,n)=>{_(r=>{const d=[...r];return d[t].temps={...d[t].temps||{},[a.toString().padStart(2,"0")]:n},d})},le=()=>{_(t=>[...t,{date:"",temps:{}}])},ie=t=>{_(a=>a.filter((n,r)=>r!==t))},oe=()=>{if(!B)return;const t={};K.forEach(a=>{a.date&&(t[a.date]=a.temps)}),console.log("Data yang dikirim ke backend:",t),D.patch(route("orders.update-temperature",B.id),{temperature:t},{onSuccess:()=>{A(!1),se(null),_([]),D.reload({only:["orders"]})},onError:a=>{alert("Terjadi error saat menyimpan data suhu."),console.error(a)}})};p.useEffect(()=>{console.log("Semua data orders:",i.data)},[i.data]);const de=()=>{if(v.length===0){alert("Tidak ada data yang sesuai filter untuk dicetak.");return}const t=u?new Date(u).toLocaleDateString("id-ID"):"Semua",a=k?new Date(k).toLocaleDateString("id-ID"):"Semua",n=`${t} s/d ${a}`,r="/logo.png",d=new Image;d.src=r;const x=window.open("","_blank");if(!x){alert("Gagal membuka jendela cetak. Pastikan popup tidak diblokir.");return}x.document.write(`
        <div style="text-align: center; margin-top: 50px; font-family: Arial, sans-serif;">
            Memuat logo...
        </div>
    `),x.document.close(),d.onload=()=>{const me=`
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
                        ${v.map(m=>{var Q,W,X;return`
                            <tr>
                                <td>${m.container_number}</td>
                                <td>${((W=(Q=m.order)==null?void 0:Q.shipper)==null?void 0:W.name)??"-"}</td>
                                <td>${F(m.price_type)}</td>
                                <td>${m.entry_date?Z(m.entry_date):'<span class="text-gray-400">–</span>'}</td>
                                <td>${m.exit_date?Z(m.exit_date):'<span class="text-gray-400">–</span>'}</td>
                                <td>${m.commodity??"-"}</td>
                                <td>${m.country??"-"}</td>
                                <td>
    ${(X=m.order)!=null&&X.fumigasi?m.order.fumigasi.length>50?m.order.fumigasi.substring(0,50)+"...":m.order.fumigasi:"–"}
</td>
                            </tr>
                        `}).join("")}
                    </tbody>
                </table>

            </body>
            </html>
        `;x.document.write(me),x.document.close(),x.focus(),setTimeout(()=>x.print(),300)},d.onerror=()=>{alert("Gagal memuat logo. Pastikan file /logo.png ada di folder public."),x.close()}},{props:$}=xe(),[S,M]=p.useState(""),L=t=>{b(a=>a.includes(t)?a.filter(n=>n!==t):[...a,t])},y=l.filter(t=>t.service_type.toLowerCase().includes(S.toLowerCase())),J=y.length>0&&y.every(t=>c.includes(t.id)),U=()=>{const t=y.map(a=>a.id);if(J){const a=new Set(t);b(n=>n.filter(r=>!a.has(r)))}else b(a=>Array.from(new Set([...a,...t])))},R=t=>{const a=(t==null?void 0:t.search)!==void 0?t.search:j,n=(t==null?void 0:t.start_date)!==void 0?t.start_date:u,r=(t==null?void 0:t.end_date)!==void 0?t.end_date:k,d=(t==null?void 0:t.product_ids)!==void 0?t.product_ids:c;D.get("/karantina",{search:a||void 0,trashed:o.trashed||void 0,start_date:n||void 0,end_date:r||void 0,product_ids:d.length>0?d:void 0,sort_by:o.sort_by||void 0,sort_dir:o.sort_dir||void 0},{preserveState:!0,preserveScroll:!0})},ce=()=>{N(""),T(""),w(""),b([]),M(""),D.get("/karantina")},E=({label:t,field:a,currentSort:n,currentDir:r,routeName:d="index_karantina"})=>{const x=n===a&&r==="asc"?"desc":"asc";return e.jsxs(he,{href:route(d,{sort_by:a,sort_dir:x,search:j||void 0,start_date:u||void 0,end_date:k||void 0,product_ids:c.length>0?c:void 0}),preserveState:!0,preserveScroll:!0,className:"flex items-center gap-1 font-semibold text-gray-700 hover:text-black",children:[t,n===a?x==="asc"?e.jsx(Me,{className:"h-4 w-4"}):e.jsx(Le,{className:"h-4 w-4"}):e.jsx(Re,{className:"h-4 w-4 text-gray-400"})]})},O={};for(const t of v){const a=t.no_aju??t.order_id;O[a]||(O[a]=[]),O[a].push(t)}return e.jsxs(ue,{breadcrumbs:Ee,children:[e.jsx(pe,{title:"Karantina & Fumigasi - Depo Surabaya"}),e.jsxs("div",{className:"flex flex-1 flex-col gap-6 bg-[#f8fafc] p-4 md:p-6 min-h-screen",children:[((Y=$.flash)==null?void 0:Y.success)&&e.jsx("div",{className:"rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 shadow-sm",children:$.flash.success}),((q=$.flash)==null?void 0:q.error)&&e.jsx("div",{className:"rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 shadow-sm",children:$.flash.error}),e.jsxs("div",{className:"flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between",children:[e.jsxs("div",{children:[e.jsxs("div",{className:"flex items-center gap-2.5",children:[e.jsx("h1",{className:"text-2xl font-bold tracking-tight text-gray-800",children:"Karantina & Fumigasi"}),e.jsx("span",{className:"inline-flex items-center rounded-full bg-rose-50 px-3 py-0.5 text-xs font-semibold text-rose-700 border border-rose-200",children:"Petugas Karantina"})]}),e.jsx("p",{className:"mt-1 text-sm text-gray-500",children:"Kelola data kontainer karantina, filter pencarian per periode, dan cetak billing statement resmi."})]}),e.jsx("div",{className:"flex flex-wrap items-center gap-2",children:e.jsxs(g,{type:"button",onClick:de,className:"bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-sm",children:[e.jsx($e,{className:"mr-2 h-4 w-4"}),"Cetak Billing Statement"]})})]}),e.jsxs("div",{className:"rounded-xl border border-gray-200 bg-white p-5 shadow-sm",children:[e.jsx("div",{className:"mb-3 flex items-center justify-between",children:e.jsx("h2",{className:"text-sm font-bold text-gray-800 uppercase tracking-wide",children:"Filter & Pencarian Kontainer"})}),e.jsxs("div",{className:"grid grid-cols-1 gap-4 md:grid-cols-12",children:[e.jsxs("div",{className:"md:col-span-5 space-y-1",children:[e.jsx(C,{htmlFor:"search",className:"text-xs font-medium text-gray-600",children:"Cari (Fumigator, Shipper, Customer, Kontainer)"}),e.jsx(z,{id:"search",type:"text",value:j,onChange:t=>N(t.target.value),onKeyDown:t=>{t.key==="Enter"&&(t.preventDefault(),R())},placeholder:"Cari fumigator, shipper, customer, atau nomor kontainer...",className:"w-full rounded-lg border-gray-300 py-2 text-sm text-gray-800 shadow-sm focus:border-blue-500"})]}),e.jsxs("div",{className:"md:col-span-3 space-y-1",children:[e.jsxs(C,{className:"text-xs font-medium text-gray-600 flex items-center justify-between",children:[e.jsx("span",{children:"Filter Produk"}),c.length>0&&e.jsxs("span",{className:"text-[11px] text-blue-600 font-semibold",children:[c.length," dipilih"]})]}),e.jsxs(ge,{children:[e.jsx(fe,{asChild:!0,children:e.jsxs(g,{variant:"outline",type:"button",className:"w-full justify-between border-gray-300 py-2 text-sm font-normal text-gray-800 shadow-sm hover:bg-gray-50 focus:border-blue-500 h-9",children:[e.jsx("span",{className:"truncate",children:c.length===0?"Semua Produk":c.length===1?((G=l.find(t=>t.id===c[0]))==null?void 0:G.service_type)||"1 Produk":`${c.length} Produk Dipilih`}),e.jsx(Ae,{className:"ml-2 h-4 w-4 shrink-0 opacity-50"})]})}),e.jsxs(be,{className:"w-80 p-2 shadow-lg",align:"start",children:[e.jsxs("div",{className:"flex items-center justify-between px-2 py-1.5 border-b border-gray-100 mb-2",children:[e.jsx("span",{className:"text-xs font-semibold text-gray-700",children:"Pilih Produk"}),e.jsxs("div",{className:"flex gap-2 text-[11px]",children:[e.jsxs("button",{type:"button",onClick:t=>{t.preventDefault(),b(l.map(a=>a.id))},className:"text-blue-600 hover:underline font-medium",children:["Pilih Semua (",l.length,")"]}),e.jsx("span",{className:"text-gray-300",children:"|"}),e.jsx("button",{type:"button",onClick:t=>{t.preventDefault(),b([])},className:"text-gray-500 hover:underline",children:"Reset"})]})]}),e.jsxs("div",{className:"relative mb-2 px-1",children:[e.jsx(ye,{className:"absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400"}),e.jsx(z,{type:"text",placeholder:"Cari produk (misal: fumigasi)...",value:S,onChange:t=>M(t.target.value),onKeyDown:t=>t.stopPropagation(),className:"h-8 pl-8 pr-7 text-xs rounded-md border-gray-200 focus:border-blue-500"}),S&&e.jsx("button",{type:"button",onClick:()=>M(""),className:"absolute right-3 top-2.5 text-gray-400 hover:text-gray-600",children:e.jsx(P,{className:"h-3.5 w-3.5"})})]}),y.length>0&&e.jsxs("div",{onClick:t=>{t.preventDefault(),U()},className:"flex items-center gap-2 px-2 py-1.5 mb-1.5 rounded bg-slate-50 hover:bg-slate-100 cursor-pointer text-xs font-medium text-slate-700 border border-slate-200 transition-colors",children:[e.jsx(V,{checked:J,onCheckedChange:U,className:"h-3.5 w-3.5"}),e.jsx("span",{className:"truncate",children:S?`Centang Semua Hasil ("${S}") (${y.length})`:`Centang Semua (${y.length})`})]}),e.jsx("div",{className:"space-y-0.5 max-h-56 overflow-y-auto",children:y.length===0?e.jsxs("div",{className:"py-4 text-center text-xs text-gray-400",children:['Tidak ada produk cocok dengan "',S,'"']}):y.map(t=>{const a=c.includes(t.id);return e.jsxs("div",{onClick:n=>{n.preventDefault(),L(t.id)},className:`flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer text-xs transition-colors ${a?"bg-blue-50 text-blue-900 font-medium":"hover:bg-gray-100 text-gray-700"}`,children:[e.jsx(V,{checked:a,onCheckedChange:()=>L(t.id),className:"h-3.5 w-3.5"}),e.jsx("span",{className:"truncate",children:t.service_type})]},t.id)})})]})]})]}),e.jsxs("div",{className:"md:col-span-4 space-y-1",children:[e.jsx(C,{className:"text-xs font-medium text-gray-600",children:"Rentang Tanggal"}),e.jsx(Te,{startDate:u,endDate:k,onChange:({startDate:t,endDate:a})=>{T(t),w(a)},onApply:({startDate:t,endDate:a})=>{T(t),w(a),R({start_date:t,end_date:a})},placeholder:"Pilih rentang tanggal filter...",className:"w-full",align:"right"})]})]}),c.length>0&&e.jsxs("div",{className:"mt-3 flex flex-wrap items-center gap-1.5 border-t border-gray-100 pt-2.5",children:[e.jsx("span",{className:"text-[11px] text-gray-500 font-medium",children:"Produk Terpilih:"}),c.map(t=>{const a=l.find(n=>n.id===t);return a?e.jsxs("span",{className:"inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 border border-blue-200",children:[a.service_type,e.jsx("button",{type:"button",onClick:()=>L(t),className:"hover:text-blue-900 focus:outline-none",children:e.jsx(P,{className:"h-3 w-3"})})]},t):null}),e.jsx("button",{type:"button",onClick:()=>b([]),className:"text-[11px] text-gray-500 hover:text-rose-600 underline ml-1",children:"Hapus Semua"})]}),e.jsxs("div",{className:"mt-4 flex items-center justify-end gap-2 border-t border-gray-100 pt-3",children:[e.jsx(g,{variant:"outline",onClick:ce,className:"text-xs font-medium",children:"Reset"}),e.jsx(g,{onClick:()=>R(),className:"text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white",children:"Terapkan Filter"})]})]}),e.jsxs("div",{className:"rounded-xl border border-gray-200 bg-white shadow-sm p-5",children:[e.jsxs("div",{className:"mb-4",children:[e.jsx("h2",{className:"text-lg font-bold text-gray-800",children:"Daftar Kontainer Karantina & Fumigasi"}),e.jsxs("p",{className:"text-xs text-gray-500",children:["Total ",e.jsx("span",{className:"font-semibold text-gray-700",children:i.total??v.length})," kontainer sesuai kriteria filter."]})]}),e.jsx("div",{className:"overflow-x-auto rounded-lg border border-gray-200",children:e.jsxs(_e,{children:[e.jsx(De,{className:"bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-600 border-b border-gray-200",children:e.jsxs(H,{children:[e.jsx(f,{className:"px-4 py-3",children:e.jsx(E,{label:"Nomor Kontainer",field:"container_number",currentSort:o.sort_by,currentDir:o.sort_dir})}),e.jsx(f,{className:"px-4 py-3",children:e.jsx(E,{label:"Nama Shipper",field:"shippers.name",currentSort:o.sort_by,currentDir:o.sort_dir})}),e.jsx(f,{className:"px-4 py-3",children:"Size"}),e.jsx(f,{className:"px-4 py-3",children:"Tanggal Masuk"}),e.jsx(f,{className:"px-4 py-3",children:"Tanggal EIR"}),e.jsx(f,{className:"px-4 py-3",children:"Tanggal Keluar"}),e.jsx(f,{className:"px-4 py-3",children:"Komoditi"}),e.jsx(f,{className:"px-4 py-3",children:"Negara Tujuan"}),e.jsx(f,{className:"px-4 py-3",children:e.jsx(E,{label:"Fumigasi",field:"fumigasi",currentSort:o.sort_by,currentDir:o.sort_dir})})]})}),e.jsx(Ce,{className:"divide-y divide-gray-100 bg-white",children:v.length===0?e.jsx(H,{children:e.jsx(h,{colSpan:9,className:"py-10 text-center text-sm text-gray-400",children:"Tidak ada data yang sesuai filter."})}):v.map(t=>{var a,n,r;return e.jsxs(H,{className:"hover:bg-slate-50/80 transition-colors",children:[e.jsx(h,{className:"px-4 py-3 text-sm font-semibold text-slate-900",children:t.container_number}),e.jsx(h,{className:"px-4 py-3 text-sm text-slate-800 font-normal",children:((n=(a=t.order)==null?void 0:a.shipper)==null?void 0:n.name)??"-"}),e.jsx(h,{className:"px-4 py-3 text-sm",children:e.jsx("span",{className:"inline-flex rounded bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700 border border-slate-200",children:F(t.price_type)})}),e.jsx(h,{className:"px-4 py-3 text-sm text-slate-800 font-normal",children:I(t.entry_date)}),e.jsx(h,{className:"px-4 py-3 text-sm text-slate-800 font-normal",children:I(t.eir_date)}),e.jsx(h,{className:"px-4 py-3 text-sm text-slate-800 font-normal",children:I(t.exit_date)}),e.jsx(h,{className:"px-4 py-3 text-sm text-slate-800 font-normal",children:t.commodity??"-"}),e.jsx(h,{className:"px-4 py-3 text-sm text-slate-800 font-normal",children:t.country??"-"}),e.jsx(h,{className:"px-4 py-3 text-sm",children:(r=t.order)!=null&&r.fumigasi?e.jsx("span",{className:"inline-flex items-center rounded-md bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800 border border-amber-200",children:t.order.fumigasi}):e.jsx("span",{className:"text-gray-400",children:"–"})})]},t.id)})})]})}),e.jsxs("div",{className:"mt-4 flex flex-col sm:flex-row items-center justify-between gap-3",children:[e.jsxs("p",{className:"text-xs text-gray-500",children:["Menampilkan ",e.jsx("span",{className:"font-semibold text-gray-700",children:i.from??0})," sampai"," ",e.jsx("span",{className:"font-semibold text-gray-700",children:i.to??0})," dari"," ",e.jsx("span",{className:"font-semibold text-gray-700",children:i.total??i.data.length})," kontainer"]}),e.jsx("div",{className:"flex flex-wrap justify-center gap-1",children:i.links.map((t,a)=>t.url?e.jsx(g,{variant:t.active?"default":"outline",disabled:!t.url,onClick:()=>D.get(t.url,{},{preserveState:!0,preserveScroll:!0}),className:"px-3 py-1 whitespace-nowrap text-xs font-medium",children:t.label.replace(/&laquo; Previous|Next &raquo;/,n=>n.includes("Previous")?"← Prev":n.includes("Next")?"Next →":n)},a):e.jsx("span",{className:"px-3 py-1 text-xs text-gray-400",children:"..."},a))})]})]}),e.jsx(je,{open:ae,onOpenChange:A,children:e.jsxs(Ne,{className:"max-w-3xl",children:[e.jsx(ve,{children:e.jsx(Se,{children:"Rekam Suhu Kontainer"})}),e.jsxs("div",{className:"max-h-[60vh] space-y-6 overflow-y-auto pr-2",children:[K.map((t,a)=>e.jsxs("div",{className:"space-y-2 rounded border p-4",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(C,{htmlFor:`date_${a}`,children:"Tanggal"}),e.jsx(we,{id:`date_${a}`,value:t.date,onChange:n=>ne(a,n),withTime:!1,inModal:!0,placeholder:"Pilih tanggal...",className:"w-[180px]"}),K.length>1&&e.jsx(g,{type:"button",size:"icon",variant:"destructive",className:"ml-auto",onClick:()=>ie(a),children:e.jsx(P,{className:"h-4 w-4"})})]}),e.jsx("div",{className:"grid max-h-64 grid-cols-2 gap-2 overflow-y-auto",children:[...Array(24)].map((n,r)=>e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsxs(C,{htmlFor:`temp_${a}_${r}`,children:[r.toString().padStart(2,"0"),":00"]}),e.jsx(z,{id:`temp_${a}_${r}`,type:"number",step:"0.1",value:t.temps[r.toString().padStart(2,"0")]||"",onChange:d=>re(a,r,d.target.value),className:"w-24"})]},r))})]},a)),e.jsxs(g,{type:"button",variant:"outline",onClick:le,className:"flex items-center gap-2",children:[e.jsx(Ke,{className:"h-4 w-4"})," Tambah Tanggal"]})]}),e.jsxs(ke,{className:"gap-2",children:[e.jsx(g,{variant:"outline",onClick:()=>A(!1),children:"Batal"}),e.jsx(g,{onClick:oe,children:"Simpan"})]})]})})]})]})}export{ot as default};
