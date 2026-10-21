import {InputError} from '../account-validation'
// Vercel buffered Functions cap request/response payloads at 4.5 MB.
// Keep the entire JSON envelope below 4 MiB with metadata reserve, not a text-character quota.
export const responseBudgetBytes=4*1024*1024-8192
export function outputFits(value:unknown){return new TextEncoder().encode(JSON.stringify(value)).byteLength<=responseBudgetBytes}
export function assertOutputCapacity(value:unknown){if(!outputFits(value))throw new InputError('response_too_large',413)}
export function fitResponseItems<T>(items:T[],base:Record<string,unknown>,key:string){
 const kept:T[]=[]
 for(const item of items){if(!outputFits({...base,[key]:[...kept,item]}))break;kept.push(item)}
 if(items.length&&!kept.length)throw new InputError('response_too_large',413)
 return {items:kept,truncated:kept.length<items.length}
}
