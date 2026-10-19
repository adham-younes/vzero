import type {MetadataRoute} from 'next'
import {headings,solutions} from '@/lib/agynexa'
import services from '@/lib/service-catalog.json'
export default function sitemap():MetadataRoute.Sitemap{return ['',...Object.keys(headings),...solutions.map(s=>`solutions/${s.slug}`),...services.map(s=>`services/${s.slug}`),'services/solutions'].map(path=>({url:`https://vzero-nine-beryl.vercel.app/${path}`,changeFrequency:'monthly',priority:path?0.7:1}))}
