// Shared upload and reviewed-text limits. Other API request limits stay unchanged.
export const sourceMaxBytes=1024*1024
export const uploadMaxBytes=4*1024*1024
export const acceptedSourceExtensions=['.txt','.md','.csv','.json','.pdf','.docx','.xlsx'] as const
export type SourceFormat=typeof acceptedSourceExtensions[number] extends `.${infer Format}`?Format:never
