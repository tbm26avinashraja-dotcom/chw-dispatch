export type RequestRow={id:string; company:string; hana:string; period:string; amount:number; activity:string; misUrl:string; sourceRow:number};
export type Invoice={id:string; fileName:string; file?:File; client:string; customerCode:string; period:string; amount:number|null; type:string};
export type Match={invoice:Invoice; candidates:RequestRow[]; selected:string|null; status:'matched'|'ambiguous'|'missing'|'manual'};
export const norm=(v:unknown)=>String(v??'').toUpperCase().replace(/[^A-Z0-9]/g,'');
export const money=(v:number|null)=>v==null?'Unknown':'₹'+v.toLocaleString('en-IN',{maximumFractionDigits:2});
export function parseAmount(v:unknown){if(typeof v==='number')return v; const n=Number(String(v??'').replace(/[₹,\s]/g,''));return Number.isFinite(n)?n:0}
export function deriveMatches(invoices:Invoice[],requests:RequestRow[]):Match[]{return invoices.map(invoice=>{
 const name=norm(invoice.client),code=norm(invoice.customerCode);
 const scored=requests.map(r=>{let s=0;if(name&&norm(r.company)===name)s+=5;else if(name&&norm(r.company).includes(name)&&name.length>5)s+=3;
 // HANA in request and SAP customer code can be different namespaces: only use when equal, never force a mismatch.
 if(code&&norm(r.hana)===code)s+=5;
 if(invoice.amount!==null&&Math.abs(r.amount-invoice.amount)<0.02)s+=4;
 if(invoice.period&&norm(r.period)===norm(invoice.period))s+=2;
 return {r,s};}).filter(x=>x.s>=7).sort((a,b)=>b.s-a.s);
 const top=scored[0]?.s??0;const candidates=scored.filter(x=>x.s===top).map(x=>x.r);
 return {invoice,candidates,selected:candidates.length===1?candidates[0].id:null,status:candidates.length===1?'matched':candidates.length>1?'ambiguous':'missing'};
 });}
export function bundleMatches(matches:Match[],rows:RequestRow[]){const map=new Map<string,{client:string; invoices:Invoice[]; misUrls:string[]; incomplete:boolean}>();for(const m of matches){const r=rows.find(x=>x.id===m.selected);const key=r?norm(r.company):'UNMATCHED';if(!map.has(key))map.set(key,{client:r?.company||'Unmatched invoices',invoices:[],misUrls:[],incomplete:false});const b=map.get(key)!;b.invoices.push(m.invoice);if(!r)b.incomplete=true;else if(r.misUrl&&!b.misUrls.includes(r.misUrl))b.misUrls.push(r.misUrl);else if(!r.misUrl)b.incomplete=true;}return [...map.entries()].map(([key,...rest])=>({key,...rest[0]}));}
