# المتبقي الفعلي — 20 أكتوبر 2026

إصدار العميل منشور عبر PR #33: [الإيصال والأدلة والحدود](../launch/2026-10-22/RELEASE.md). المحادثة والإنشاء والسجل الآمن منفذة ومختبرة محليًا، مع تحقق النماذج الحقيقي منفصلًا. المتبقي المحدد: مراجعة فهم مستخدم، واستكمال الحالات السلبية المحددة المتبقية، والقرارات القانونية والتجارية والاستعادة والاحتفاظ. البنود التاريخية أدناه لا تعني إلغاء الإصلاحات المسلمة.

الموقع والحسابات والموجزات وStudio A–E وإصلاح المحادثة وإزالة قسم API منشورة. [التقرير الشامل](CURRENT-IMPLEMENTATION-2026-10-20.md) يصف المنفذ وحدود الإثبات؛ الجدول التالي لا يعيد فتحه. الأولوية المقترحة ليست تفويضًا لتغيير Auth/SMTP أو حسابات خارجية.

## عيوب وملاحظات على السلوك القائم

| المعرف | الحالة | المتبقي ومعيار الإغلاق |
|---|---|---|
| AUTH-TRANSIENT | OPEN_OBSERVATION | تشخيص 401 جلسة وlogin503 المتقطعين؛ ربطهما بسجلات منقحة، وإثبات سبب وإصلاح أو حدود موثقة. نجح الدخول والمسار النهائي سابقًا، لكن السبب لم يثبت |
| DATA-CONSENT | OPEN | consent_at الافتراضي لا يثبت المرور بموافقة API؛ تحديد حدود الإثبات المطلوبة وتطبيقها على طرق الإدراج المسموحة |
| DATA-QUOTA | OPEN | حذف موجز يحرر حصة العدد اليومي؛ تحديد هل المطلوب سقف للسجلات أم لعمليات الإنشاء، ثم تعديل العداد إن لزم |

## وظائف غير منفذة أو منفذة جزئيًا

| المعرف | الحالة | ما بقي ومعيار الإغلاق |
|---|---|---|
| AUTH-RECOVERY | DEFERRED_BY_OWNER | استعادة حساب آمنة قبل الإطلاق التجاري العام؛ مسار مزود معتمد أو بريد بعلامة معتمدة، منع الاستيلاء والتعداد وإبطال الجلسات حسب السياسة. لا إرسال افتراضي تلقائي |
| AUTH-01 | PARTIAL | الموجود مالك واحد لكل مساحة؛ المتبقي دعوات وأدوار وعضويات متعددة وإبطال وصول واختبار عزلها |
| DATA-01 | PARTIAL | قاعدة وRLS مطبقتان؛ المتبقي سياسة احتفاظ وحذف ونسخ احتياطي وتجربة استعادة كاملة موثقة |
| BILLING-01 | NOT_IMPLEMENTED | تحديد العرض والمزود والنطاق ثم اشتراك/دفع/فواتير وأحداث موثقة؛ تقدير tokens ليس تحصيلًا أو فاتورة |
| CONN-01 | SPECIFIED / REQUIRES_ACCESS | اختيار CRM/ERP/helpdesk أو موصل معرفة واحد وحساب مفوض؛ scopes وrevocation وretry وwebhook؛ لا اتصال أعمال خارجي منفذ |
| RUN-01 | PARTIAL | التشغيل المحدود بمهلة وإلغاء موجود؛ queue/outbox واستئناف مهام طويلة غير منفذة |
| APPROVAL-01 | PARTIAL | موافقة المالك على سجل دعم داخلي منفذة؛ المتبقي فصل واجبات وصلاحيات فريق وأفعال خارجية معتمدة إن اختيرت |
| RAG-01 | PARTIAL | نصوص واسترجاع بالكلمات منفذة؛ المتبقي embeddings/PDF/صور/زحف روابط ومصادر خارجية مع ACL وإبطال الوصول |
| PROC-01 | SPECIFIED / REQUIRES_ACCESS | عروض مورّدين فعلية وعملة/ضرائب/شحن وربط ERP واعتماد شراء وإصدار أمر؛ الموجود مثال افتراضي عديم الحالة |
| OBS-01 | PARTIAL | سجل تشغيل واستهلاك منفذ؛ المتبقي traces منقحة وتنبيهات وتشخيص أخطاء وتكلفة على مستوى التشغيل |

## تحقق لم يكتمل

| المعرف | الحالة | الحد والمتابعة |
|---|---|---|
| QA-03 | OPEN | مراجعة أوسع للوحة المفاتيح وقارئ الشاشة وfocus والتباين وreduced motion؛ العينات السابقة ليست شهادة وصول |
| QA-CHAT-PROD | NOT_REPEATED | إصلاح المحادثة تحقق تفاعليًا محليًا؛ عند تسليم منتج يستدعي ذلك، تحقق من رحلة مصادقة إنتاجية محددة. لا إنشاء حسابات أو إعادة حزم لمجرد توثيق |
| PERF-01 | OPEN | عينات أداء وأحمال ممثلة؛ 3 أحداث وRES100 لا تثبت أداء عامًا أو SLA |
| AUTH-CONFIG | OBSERVED_UNCHANGED | حماية كلمات المرور المسربة معطلة وفق رصد التسليم؛ راجع الإعداد ضمن نطاق أمان مفوض، دون تغيير Auth تلقائيًا |
| TOOL-NEXA | NOT_VERIFIED | اتصال NEXA Agent الذي حدده المالك لم يتحقق؛ لا تنسب إليه تنفيذًا أو دعمًا فعليًا |

## محتوى وتجهيز تجاري

| المعرف | المتبقي |
|---|---|
| CONTENT-01 | فحص التوافر التجاري لأسماء العائلات؛ لم ينفذ |
| CONTENT-02 | صفحات SEO مستقلة لكل قطاع؛ الموجود محدد تفاعلي داخل industries |
| CONTENT-03 | نصوص خصوصية وشروط معتمدة وصفحاتها؛ لا صفحات قانونية مستقلة حاليًا |
| CONTENT-04 | دراسات حالات عملاء بوقائع وأذونات حقيقية؛ لا اختلاق نتائج |
| CONTENT-05 | عرض وأسعار وعقود ومواعيد؛ نظام الدفع ضمن BILLING-01 |
| CONTENT-06 | تحقق B2B ووصول عملاء فعلي؛ لا حملة أو رسائل مرسلة. المساعد وNEXA Agent فريق التنفيذ المسمى؛ الوقت والميزانية والوصول غير محسومة |
| CONTENT-07 | CMS ومنصة ترجمة؛ المحتوى حاليًا JSON/TS ثابت |

## بنود مغلقة ضمن نطاقها

QA-01/QA-02 تصحيح الواجهة وعينة الجوال، REVIEW-01 مطابقة السوق، LEAD-01 حفظ الموجز، Studio A–E، CHAT-UX، API-UI: مسلمة كما في [مصفوفة المراحل](STAGE-MATRIX.md) و[الإصدارات](RELEASES.md). DOC-01 مستمر مع كل تسليم. إغلاقها لا يغلق الفجوات الموسعة أعلاه.

الحدود المقصودة ليست أعطالًا: Qwen داخلي Preview؛ التسجيل بلا بريد؛ قسم API محذوف من الواجهة والخادم باقٍ؛ الأسئلة الواقعية تحتاج مصادر؛ AgentNexOS صفحة تعريفية والخدمات العشر ليست منتجات مستقلة.

## قيود مراجع وأدوات محفوظة

11 whitepaper لم تتاح وقت البحث، وSalesforce أعاد 403. يعاد فحص ما يحتاجه النطاق فقط. Vercel MCP أعاد 404 سابقًا ثم نجحت قراءة المشروع والنشر مباشرةً؛ [إيصال الوصول](releases/VERCEL-ACCESS-2026-10-20.md). صلاحيات الكتابة وقدرات كل مورد تصميم لم تختبر بهذا الفحص؛ MagicPath نجح في البناء والعرض، وRefero تعذر بسبب الاشتراك. [قائمة التصميم](CONNECTED-DESIGN-TOOLS.md) تضم 11 اتصالًا أكدها المالك، وليست إثبات تكامل runtime.

`siteUrl` مثبت في lib/site-routes.ts؛ تغيير النطاق يستدعي تحديث SEO معًا. القفل مرجع نسخ الحزم، ولا ترقيات ضمن توثيق. لا مهمة ESLint معرفة. التفاصيل التاريخية محفوظة في تقارير التسليم وGit، وليست عوائق جارية إلا إذا سجلت أعلاه.

## مرشح واجهة قيد المراجعة

UI-REFINE: DEPLOYED_VERIFIED_SCOPE؛ اسم أكبر وAR/EN وخطوط ومحاذاة ونموذج ومثال أوضح. [الدليل](releases/VISUAL-UPGRADE-2026-10-20.md). AUTH-RECOVERY مؤجل بطلب المالك؛ لم يعتمد ربط صندوق بريده، ولم ينفذ SMTP أو الاستعادة. CLIENT-PORTAL: SPECIFIED، مشروع/مراحل/ملفات/موافقات فريق يتطلب نطاق بيانات مستقلًا.

AUTH-CLASSIFICATION: DEPLOYED_VERIFIED_SCOPE؛ إصلاح تحويل أعطال الشبكة/الخادم وحدود المعدل إلى 401؛ اختبارات المعالجات والبناء ناجحة. [التقرير](releases/CONTINUATION-2026-10-20.md). لا يغلق AUTH-TRANSIENT التاريخي.


## 2026-10-22 essential workspace work package

See [essential workspace and NEXA release](../launch/2026-10-22/ESSENTIAL-WORKSPACE-RELEASE.md). Latest owner priority is Studio-first, sole primary execution and minimal affected checks. Real reviewed agents/projects/tasks and safe private mail foundation are additive; larger operating, mailbox migration, ChatGPT and campaign requirements remain open. Production status is governed by the dated release receipt, not by candidate code.




## Reviewed Studio UI release authorized — 2026-10-22

Owner explicitly approved the displayed dedicated Studio composition and said نعم-نفذ. Release only that reviewed UI; keep the separate local NEXA routing/config/test/docs candidate unpublished. No DNS, mailbox, provider, webhook, environment or mail-send changes. Preserve PR41 receipt and full master plan. See [UI release](../launch/2026-10-22/STUDIO-CHAT-UI-RELEASE.md).


## Studio UI PR42 production receipt — 2026-10-22

[Owner-approved dedicated chat release](../launch/2026-10-22/STUDIO-CHAT-UI-RELEASE.md) published: source `25b89709c3a65ef499c998a179ce3f2ef30deaad`, READY `dpl_9LoGYjBSSzjj3A1Lt14xSeypnPCG`. Existing-owner saved response, locale navigation and reload plus scoped EN/AR layout/HTTP checks passed. This closes the displayed composition release only; larger operating/comprehension and independent email gates remain open. Local NEXA routing candidate is excluded from Git release.
