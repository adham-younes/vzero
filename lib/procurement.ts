export type ReviewInput={quantity:number;budget:number;warrantyMonths:number|null}
export class ReviewInputError extends Error {}
export function parseReviewInput(value:unknown):ReviewInput{
 if(!value||typeof value!=='object'||Array.isArray(value))throw new ReviewInputError('Expected an object.')
 const data=value as Record<string,unknown>
 if(Object.keys(data).some(k=>!['quantity','budget','warrantyMonths'].includes(k)))throw new ReviewInputError('Unexpected field.')
 if(typeof data.quantity!=='number'||!Number.isInteger(data.quantity)||data.quantity<1||data.quantity>1000)throw new ReviewInputError('Quantity must be an integer from 1 to 1000.')
 if(typeof data.budget!=='number'||!Number.isInteger(data.budget)||data.budget<1||data.budget>10000000)throw new ReviewInputError('Budget must be whole USD from 1 to 10000000.')
 if(data.warrantyMonths!==null&&(typeof data.warrantyMonths!=='number'||!Number.isInteger(data.warrantyMonths)||data.warrantyMonths<0||data.warrantyMonths>120))throw new ReviewInputError('Warranty must be null or whole months from 0 to 120.')
 return {quantity:data.quantity,budget:data.budget,warrantyMonths:data.warrantyMonths as number|null}
}
export function reviewProcurement(input:ReviewInput){
 const quotes=[{id:'A',unitPrice:1200,warrantyMonths:24},{id:'B',unitPrice:1180,warrantyMonths:input.warrantyMonths}].map(q=>({...q,total:q.unitPrice*input.quantity,withinBudget:q.unitPrice*input.quantity<=input.budget,complete:q.warrantyMonths!==null}))
 const issues=quotes.flatMap(q=>[...(q.complete?[]:[{supplier:q.id,code:'MISSING_WARRANTY' as const}]),...(q.withinBudget?[]:[{supplier:q.id,code:'OVER_BUDGET' as const}])])
 return {mode:'ILLUSTRATIVE' as const,currency:'USD',input,quotes,issues,status:issues.length?'CLARIFICATION_REQUIRED':'READY_FOR_HUMAN_REVIEW',orderCreated:false,policy:'Compare prices only after warranty and budget checks; a responsible person must decide.'}
}
