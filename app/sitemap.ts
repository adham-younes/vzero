import type {MetadataRoute} from 'next'
import {sitePaths,siteUrl} from '@/lib/site-routes'
export default function sitemap():MetadataRoute.Sitemap{return sitePaths.filter(p=>p!=='services/solutions').flatMap(path=>{const en=`${siteUrl}/${path}`;const ar=`${siteUrl}/ar${path?'/'+path:''}`;return [en,ar].map(url=>({url,changeFrequency:'monthly' as const,priority:path?0.7:1,alternates:{languages:{en,ar}}}))})}
