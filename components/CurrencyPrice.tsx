"use client";
import { useEffect, useState } from "react";
export default function CurrencyPrice({amount,baseCurrency,targetCurrency}:{amount:number;baseCurrency:string;targetCurrency?:string}) {
 const base=(baseCurrency||"AED").toUpperCase(), target=(targetCurrency||base).toUpperCase();
 const [rate,setRate]=useState<number|null>(base===target?1:null);
 useEffect(()=>{if(base===target){setRate(1);return}let active=true;setRate(null);fetch("https://api.frankfurter.dev/v1/latest?from="+encodeURIComponent(base)+"&to="+encodeURIComponent(target)).then(r=>{if(!r.ok)throw Error();return r.json()}).then(d=>{if(active)setRate(Number(d.rates?.[target])||null)}).catch(()=>active&&setRate(null));return()=>{active=false}},[base,target]);
 const shown=rate===null?amount:amount*rate, shownCurrency=rate===null?base:target;
 let formatted:string;try{formatted=new Intl.NumberFormat(undefined,{style:"currency",currency:shownCurrency,maximumFractionDigits:2}).format(shown)}catch{formatted=shown.toFixed(2)+" "+shownCurrency}
 return <span title={rate===null&&base!==target?"Conversion rate unavailable; showing the product's listed currency":undefined}>{formatted}{rate===null&&base!==target?<small className="ml-1 text-[10px] font-semibold text-slate-500">listed</small>:null}</span>;
}
