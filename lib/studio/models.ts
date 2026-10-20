// Documented provider capabilities; actual account availability is checked separately.
export const modelRegistry = {
 'openai/gpt-oss-120b': {slot:1,stage:'production',text:true,images:false,tools:true,structured:true,context:131072,maxOutput:65536,inputPrice:0.15,outputPrice:0.60},
 'openai/gpt-oss-20b': {slot:2,stage:'production',text:true,images:false,tools:true,structured:true,context:131072,maxOutput:65536,inputPrice:0.075,outputPrice:0.30},
 'qwen/qwen3.8-27b': {slot:3,stage:'preview',text:true,images:true,tools:true,structured:true,context:131072,maxOutput:16384,inputPrice:0.80,outputPrice:4.00},
} as const
export type ModelId=keyof typeof modelRegistry
export const pricingDate='2026-10-20'
export const pricingSource='https://console.groq.com/docs/models'
export const productionModels:ModelId[]=['openai/gpt-oss-120b','openai/gpt-oss-20b']
