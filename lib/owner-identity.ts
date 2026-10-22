import pages from './program-pages.json'

export const ownerIdentity = {
 fullName: ['Eng. Adham Younes Mohamed', 'المهندس أدهم يونس محمد'],
 position: ['Founder and CEO, AGYNEXA', 'المؤسس والرئيس التنفيذي لـAGYNEXA'],
 professionalTitle: ['Expert in Enterprise Agentic AI Systems Architecture & Development', 'خبير في هندسة وتطوير أنظمة الذكاء الاصطناعي القائمة على الوكلاء للمؤسسات'],
 bio: pages.about.sections[0].body,
 email: 'adham@agynexa.si',
 phone: '+201110093730',
 contactIntro: ['Contact Eng. Adham Younes Mohamed, Founder and CEO of AGYNEXA, to discuss a business task or implementation requirement.', 'تواصل مع المهندس أدهم يونس محمد، المؤسس والرئيس التنفيذي لـAGYNEXA، لمناقشة مهمة عمل أو متطلبات تنفيذ.'],
} as const
