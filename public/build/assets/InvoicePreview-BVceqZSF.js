import{K as B,r as I,j as e,L as H,$ as Q,S as J}from"./app-lFUscwV6.js";import{B as N}from"./app-logo-icon-B6jpgC0G.js";import{A as O}from"./app-layout-BxaPGe4X.js";import{I as F}from"./layout-BysV461X.js";import"./index-DMKYWiRp.js";import"./Combination-DH-F5nhF.js";import"./index-DZISgcuH.js";import"./index-DLbQvTSb.js";function te(){const A=B(),{preview:m,company:s}=A.props,{customer:w,invoice_number:b,order:p,period_start:_,period_end:j,status:D,terbilang:g,show_period:P=!0,discount:k=0}=m,S=t=>t?new Date(t).toLocaleDateString("id-ID"):"-",d=t=>Number(t||0).toLocaleString("id-ID"),[$,T]=I.useState(()=>{var i;const t={};for(const n of p.order_items)for(const o of n.additional_products??[])t[`${n.id}:${o.id}`]=Number(((i=o.pivot)==null?void 0:i.quantity)??0);return t}),C=()=>{const t=document.getElementById("invoice-content");if(!t)return;const i=window.open("","_blank","width=800,height=600");if(!i){alert("Pop-up diblokir. Mohon izinkan pop-up untuk fitur print.");return}const n=Array.from(document.styleSheets).reduce((l,r)=>{try{const a=r.cssRules?Array.from(r.cssRules).map(c=>c.cssText).join(""):"";return l+`<style>${a}</style>`}catch{return l+`<link rel="stylesheet" href="${r.href}">`}},""),o=t.outerHTML;i.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Invoice ${b}</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        ${n}
        <style>
          /* Reset untuk cetakan */
          body {
            margin: 0;
            padding: 1cm;
            font-size: 10pt;
            color: black;
            font-family: Arial, sans-serif;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          @page {
            margin: 1.5cm;
            size: A4 portrait;
          }

          /* Hilangkan border, shadow, dan tambahan visual yang tidak perlu */
          #invoice-content {
            border: none !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            background: white !important;
            margin: 0 auto !important;
            max-width: 100% !important;
            width: 100% !important;
            padding: 0 !important;
          }

          #invoice-content * {
            box-shadow: none !important;
            background: transparent !important;
          }

          /* Border tabel untuk cetakan */
          #invoice-content table,
          #invoice-content th,
          #invoice-content td {
            border: 1px solid #000 !important;
            border-collapse: collapse;
          }
          #invoice-content th,
          #invoice-content td {
            padding: 4px;
            vertical-align: top;
          }
          #invoice-content thead {
            background-color: #f3f4f6 !important;
          }
        </style>
      </head>
      <body>
        ${o}
      </body>
    </html>
  `),i.document.close(),i.onload=()=>{i.print()}},x=(t,i)=>$[`${t}:${i}`]??0,E=(t,i,n)=>{const o=Number.isFinite(n)&&n>=0?Math.floor(n):0;T(l=>({...l,[`${t}:${i}`]:o}))},v=Number(m.materai??0),y=(()=>{var o;let t=0;for(const l of p.order_items){t+=Number(l.price_value??0);for(const r of l.additional_products??[]){const a=Number(((o=r.pivot)==null?void 0:o.price_value)??r.price_value??0),c=x(l.id,r.id);t+=a*c}}const i=Math.round(t*.11),n=t+i+v;return{subtotal:t,ppn:i,grand_total:n}})(),[R,f]=I.useState(!1),L=p.order_items.flatMap(t=>(t.additional_products??[]).map(i=>({order_item_id:t.id,additional_product_id:i.id,quantity:x(t.id,i.id)}))),M={invoice_number:b,customer_id:w.id,order_id:p.id,period_start:_,period_end:j,subtotal:y.subtotal,ppn:y.ppn,materai:v,grand_total:y.grand_total,terbilang:g,order_item_ids:p.order_items.map(t=>t.id),additional_product_quantities:L},q=t=>{t.preventDefault(),f(!0),J.post("/invoices/store",M,{onSuccess:()=>f(!1),onError:()=>f(!1)})};return e.jsxs(O,{children:[e.jsx(H,{title:"Preview Invoice"}),e.jsx("style",{children:`
                @media print {
                    body { font-size: 10pt; color: black; }
                    .print\\:hidden { display: none !important; }
                    .no-break-inside { break-inside: avoid; }
                    table { width: 100% !important; table-layout: auto; page-break-inside: avoid; }
                    th, td { white-space: normal; word-wrap: break-word; padding: 4px; }
                    .bg-gray-50, .bg-gray-100 { background-color: transparent !important; }
                    .border { border: 1px solid #000 !important; }
                    .h-16 { height: 3rem; }
                    .text-sm { font-size: 9pt; }
                    .text-xs { font-size: 8pt; }
                    .tracking-wide { letter-spacing: normal; }
                    .mt-6, .mb-4, .py-1 { margin-top: 0.25rem; margin-bottom: 0.25rem; }
                }

                @media screen {
                    .print\\:hidden { display: inherit; }
                }

                .md\\:flex-row { display: flex !important; flex-direction: row !important; }
                .md\\:justify-between { justify-content: space-between !important; }
                .md\\:items-end { align-items: flex-end !important; }
                .w-full { width: 100% !important; }
                .md\\:w-1\\/2 { width: 48% !important; display: inline-block; vertical-align: top; }
                .no-break-inside { break-inside: avoid; page-break-inside: avoid; }
                .payment-and-signature { break-inside: avoid; page-break-inside: avoid; }
            `}),e.jsx(F,{children:e.jsx("form",{onSubmit:q,children:e.jsxs("div",{id:"invoice-content",className:"mx-auto max-w-5xl space-y-6 rounded-xl border bg-white p-8 shadow",children:[e.jsxs("div",{className:"flex items-start justify-between",children:[e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx("img",{src:"/logo.png",alt:"Company Logo",className:"h-16 w-auto object-contain"}),e.jsxs("div",{children:[e.jsx("h2",{className:"mb-1 text-2xl font-semibold",children:(s==null?void 0:s.name)??"PT. DEPO SURABAYA SEJAHTERA"}),e.jsx("div",{children:(s==null?void 0:s.address)??"Jl. Tanjung Sadari No. 90"}),e.jsx("div",{children:(s==null?void 0:s.phone)??"031-353 9484, 031-3539485"})]})]}),e.jsxs("div",{className:"text-right",children:[P&&e.jsxs("div",{className:"font-semibold",children:["Periode:"," ",e.jsxs("span",{className:"font-normal",children:[S(_)," – ",S(j)]})]}),e.jsxs("div",{className:"font-semibold print:hidden",children:["Status: ",e.jsx("span",{className:"text-yellow-500",children:D})]})]})]}),e.jsxs("div",{className:"mt-6",children:[e.jsxs("div",{className:"mb-1",children:[e.jsx("span",{className:"font-bold",children:"Customer:"})," ",w.name]}),e.jsxs("div",{className:"mb-1",children:[e.jsx("span",{className:"font-bold",children:"Invoice No:"})," ",b]}),e.jsxs("div",{className:"mb-3",children:[e.jsx("span",{className:"font-bold",children:"No Order/AJU:"})," ",p.order_id]})]}),e.jsxs("table",{className:"mt-2 mb-4 w-full table-fixed border text-sm",children:[e.jsx("thead",{className:"bg-gray-100",children:e.jsxs("tr",{children:[e.jsx("th",{className:"border px-2 py-1",children:"No"}),e.jsx("th",{className:"border px-2 py-1",children:"Container"}),e.jsx("th",{className:"border px-2 py-1",children:"Service"}),e.jsx("th",{className:"border px-2 py-1",children:"Harga"}),e.jsx("th",{className:"border px-2 py-1",children:"Additional Product"}),e.jsx("th",{className:"border px-2 py-1",children:"Total"})]})}),e.jsx("tbody",{children:p.order_items.map((t,i)=>{var l;const n=Number(t.price_value??0),o=(t.additional_products??[]).reduce((r,a)=>{var h;const c=Number(((h=a.pivot)==null?void 0:h.price_value)??a.price_value??0),u=x(t.id,a.id);return r+c*u},0);return e.jsxs("tr",{children:[e.jsx("td",{className:"border px-2 py-1 text-center",children:i+1}),e.jsx("td",{className:"border px-2 py-1 text-center",children:t.container_number}),e.jsx("td",{className:"border px-2 py-1 text-center",children:(l=t.product)!=null&&l.service_type?`${t.product.service_type} (${t.price_type??"-"})`:t.price_type??"-"}),e.jsxs("td",{className:"border px-2 py-1 text-right",children:["Rp ",d(n)]}),e.jsx("td",{className:"border px-2 py-1",children:t.additional_products&&t.additional_products.length>0?e.jsx("ul",{className:"space-y-1",children:t.additional_products.filter(r=>x(t.id,r.id)>0).map(r=>{var h;const a=Number(((h=r.pivot)==null?void 0:h.price_value)??r.price_value??0),c=x(t.id,r.id),u=a*c;return e.jsxs("li",{className:"text-xs leading-tight",children:[e.jsxs("span",{className:"hidden print:hidden",children:[r.service_type," (",e.jsx("input",{type:"number",min:"0",step:"1",value:c,onChange:z=>E(t.id,r.id,Number(z.target.value)),className:"inline w-12 rounded border px-1 py-0.5 text-center text-xs"})," ","× Rp ",d(a)," = ",e.jsxs("strong",{children:["Rp ",d(u)]}),")"]}),e.jsxs("span",{className:"screen:block hidden print:inline",children:[r.service_type," (",c," × Rp ",d(a)," ="," ",e.jsxs("strong",{children:["Rp ",d(u)]}),")"]})]},r.id)})}):"-"}),e.jsxs("td",{className:"border px-2 py-1 text-right",children:["Rp ",d(n+o)]})]},t.id)})})]}),e.jsx("div",{className:"flex justify-end",children:e.jsx("table",{className:"text-sm",children:e.jsxs("tbody",{children:[e.jsxs("tr",{children:[e.jsx("td",{className:"py-1 pr-4 text-gray-700",children:"Total sebelum PPN"}),e.jsxs("td",{className:"text-right",children:["Rp ",d(m.subtotal)]})]}),k>0&&e.jsxs("tr",{children:[e.jsx("td",{className:"py-1 pr-4 text-orange-600",children:"Diskon"}),e.jsxs("td",{className:"text-right text-orange-600",children:["- Rp ",d(k)]})]}),e.jsxs("tr",{children:[e.jsx("td",{className:"py-1 pr-4 text-gray-700",children:"PPN"}),e.jsxs("td",{className:"text-right",children:["Rp ",d(m.ppn)]})]}),e.jsxs("tr",{children:[e.jsx("td",{className:"py-1 pr-4 text-gray-700",children:"Materai"}),e.jsxs("td",{className:"text-right",children:["Rp ",d(v)]})]}),e.jsxs("tr",{children:[e.jsx("td",{className:"py-1 pr-4 font-bold",children:"Grand Total"}),e.jsxs("td",{className:"text-right font-bold",children:["Rp ",d(m.grand_total)]})]}),g&&e.jsx("tr",{children:e.jsxs("td",{colSpan:2,className:"pt-2 text-xs text-gray-500 italic",children:["*** ",g," ***"]})})]})})}),e.jsxs("div",{className:"no-break-inside mt-8 flex flex-col gap-8 md:flex-row md:items-end md:justify-between",children:[e.jsxs("div",{className:"w-full rounded-md bg-gray-50 p-4 text-xs md:w-1/2",children:[e.jsxs("div",{className:"font-semibold",children:["Pembayaran ke Rekening ",(s==null?void 0:s.bank_name)??"BCA",":"]}),e.jsx("div",{className:"text-base tracking-wide",children:(s==null?void 0:s.bank_account)??"463 521 9999"}),e.jsx("div",{className:"mt-1 text-gray-700",children:(s==null?void 0:s.bank_holder)??"Depo Surabaya Sejahtera"})]}),e.jsxs("div",{className:"w-full text-center text-xs md:w-1/2 md:text-right",children:[e.jsxs("div",{children:["Surabaya, ",new Intl.DateTimeFormat("id-ID",{day:"2-digit",month:"long",year:"numeric"}).format(new Date(j))]}),e.jsx("div",{className:"mt-4",style:{minHeight:"5rem",marginTop:"0.5rem"}}),e.jsx("div",{className:"font-semibold",children:"(PT. Depo Surabaya Sejahtera)"})]})]}),e.jsxs("div",{className:"mt-6 flex justify-end gap-3 print:hidden",children:[e.jsx(N,{asChild:!0,variant:"outline",children:e.jsx(Q,{href:"/invoices/create",children:"Kembali"})}),e.jsx(N,{type:"button",variant:"outline",onClick:C,children:"Print"}),e.jsx(N,{type:"submit",disabled:R,children:R?"Menyimpan...":"Simpan Invoice"})]})]})})})]})}export{te as default};
