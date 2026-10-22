"use client";
import { useEffect, useState, useSyncExternalStore } from "react";
const rateCache = new Map<string, Promise<number | null>>();
function fetchRate(base: string, target: string) {
 const key=`${base}:${target}`;
 const cached=rateCache.get(key);
 if(cached)return cached;
 const request=fetch(`https://api.frankfurter.dev/v2/rate/${encodeURIComponent(base)}/${encodeURIComponent(target)}`)
  .then(r=>{if(!r.ok)throw Error();return r.json()})
  .then(d=>typeof d.rate==="number"&&Number.isFinite(d.rate)&&d.rate>0?d.rate:null)
  .catch(()=>{rateCache.delete(key);return null;});
 rateCache.set(key,request);
 return request;
}
export default function CurrencyPrice({amount,baseCurrency,targetCurrency}:{amount:number;baseCurrency:string;targetCurrency?:string}) {
 const base=baseCurrency.toUpperCase();
 const defaultCurrency=(targetCurrency||base).toUpperCase();
 const target=useSyncExternalStore(
  (notify)=>{
   window.addEventListener("bp-market-change",notify);
   window.addEventListener("storage",notify);
   return()=>{window.removeEventListener("bp-market-change",notify);window.removeEventListener("storage",notify)};
  },
  ()=>{const saved=localStorage.getItem("bp-currency");return (saved&&/^[A-Z]{3}$/i.test(saved)?saved:defaultCurrency).toUpperCase()},
  ()=>defaultCurrency,
 );
 const rateKey=`${base}:${target}`;
 const [loadedRate,setLoadedRate]=useState<{key:string;value:number|null}|null>(null);
 useEffect(()=>{if(base===target)return;let active=true;fetchRate(base,target).then(value=>{if(active)setLoadedRate({key:rateKey,value})});return()=>{active=false}},[base,target,rateKey]);
 const rate=base===target?1:loadedRate?.key===rateKey?loadedRate.value:null;
 const shown=rate===null?amount:amount*rate, shownCurrency=rate===null?base:target;
 let formatted:string;try{formatted=new Intl.NumberFormat(undefined,{style:"currency",currency:shownCurrency,maximumFractionDigits:2}).format(shown)}catch{formatted=shown.toFixed(2)+" "+shownCurrency}
 return <span title={rate===null&&base!==target?"Conversion rate unavailable; showing the product's listed currency":undefined}>{formatted}{rate===null&&base!==target?<small className="ml-1 text-[10px] font-semibold text-slate-500">listed</small>:null}</span>;
}
