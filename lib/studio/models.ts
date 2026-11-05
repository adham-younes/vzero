// Account access is checked separately from documented model capabilities.
export const modelRegistry = {
 'gpt-6.1-terra': {slot:1,stage:'production',text:true,images:true,tools:true,structured:true,context:1050000,maxOutput:8192,inputPrice:1,outputPrice:5,reasoningEffort:'high'},
} as const
export type ModelId=keyof typeof modelRegistry
export const defaultModel:ModelId='gpt-6.1-terra'
export const pricingDate='2026-11-05'
export const pricingSource='https://developers.openai.com/api/docs/models/gpt-6.1-terra'
export const productionModels:ModelId[]=[defaultModel]
