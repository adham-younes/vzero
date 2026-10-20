# حالة APIs وسلوك الوظائف الفعلي

تحديث 20 أكتوبر 2026: أضيف `GET /api/health/supabase`؛ فحص اتصال خادمي للقراءة فقط، لا وظيفة استقبال أو معرفة. يقرأ متغيرات Vercel الثلاثة ويختبر العام عبر `/auth/v1/settings` والسري عبر `/rest/v1/`. يرد 200 مع `{"status":"ok"}` فقط عند نجاح الاثنين، وإلا 503 مع `{"status":"unavailable"}`. مهلة 5 ثوانٍ ومنع تحويلات URL وتثبيت المشروع المحدد؛ أضيفت checks بحالات تشخيص ثابتة دون قيم المتغيرات؛ لا أسرار أو محتوى مزود في الرد ولا SQL أو بيانات مكتوبة. [إيصال الفحص](../releases/SUPABASE-CONNECTION-2026-10-20.md).

ما يلي يوثق واجهتي الأعمال الأصليتين وحدودهما:


الحالة مستمدة من handlers في إصدار `991deca` ومن تحقق إنتاج المراحل 4–6 بتاريخ 19 أكتوبر 2026. العقد المقروء آليًا: [current-api.openapi.json](current-api.openapi.json). مضيف الإنتاج العام: `https://vzero-nine-beryl.vercel.app`.

## جرد التنفيذ مقابل خطة المرحلة 3

| العملية | الحالة | ملاحظة |
|---|---|---|
| `GET /api/v1/catalog/services` | `IMPLEMENTED / VERIFIED` | استجابة منشورة تختلف عن اقتراح المرحلة 3 |
| `POST /api/v1/procurement/review` | `IMPLEMENTED / VERIFIED` | أضيف لاحقًا؛ مثال حسابات عديم الحالة |
| `POST /api/v1/project-briefs` | `SPECIFIED` | واجهة الموجز المحلية لا تستدعيه |
| `GET /api/v1/integrations` | `SPECIFIED` | الدليل المرئي يأتي من محتوى محلي |
| `POST /api/v1/connectors/{provider}/connect` | `SPECIFIED / REQUIRES_ACCESS` | لا OAuth متصل |
| `GET /api/v1/connectors/{provider}/callback` | `SPECIFIED / REQUIRES_ACCESS` | لا callback منشور |
| `POST /api/v1/knowledge/search` | `SPECIFIED / REQUIRES_ACCESS` | بحث الخدمات المحلي ليس RAG |
| `POST /api/v1/agents/{id}/runs` | `SPECIFIED / REQUIRES_ACCESS` | لا تنفيذ وكلاء حي |
| `GET /api/v1/runs/{runId}` | `SPECIFIED` | لا حالة تشغيل دائمة |
| `POST /api/v1/approvals/{id}/decision` | `SPECIFIED` | إقرار الزائر لا يستدعيه |
| `POST /api/v1/webhooks/{provider}` | `SPECIFIED / REQUIRES_ACCESS` | لا اشتراك أحداث خارجي |
| `GET /api/v1/observability/runs` | `SPECIFIED` | أدوات قياس الموقع ليست observability لتشغيل وكلاء |

قبل فحص الاتصال كانت توجد واجهتان فعليتان: واحدة من العمليات الـ11 المقترحة، وأخرى جديدة. باقي **10 عمليات مقترحة** بلا handlers؛ لا تستخدمها باعتبارها API متاحًا.

## كتالوج الخدمات

`GET /api/v1/catalog/services?lang=ar`؛ اللغة `en` افتراضيًا، و`ar` للعربية. قيمة لغة أخرى تعيد 400. الاستجابة:

```json
{
  "locale": "ar",
  "services": [
    {"slug": "…", "title": "…", "description": "…", "url": "/ar/services/…"}
  ]
}
```

القائمة الفعلية 10 خدمات، والاختصار أعلاه لتوضيح الشكل فقط. `Cache-Control: public, max-age=300` و`X-Content-Type-Options: nosniff`. لا مصادقة مطلوبة، ولا بيانات مستأجرين أو بيانات خاصة. مسار المصدر `app/api/v1/catalog/services/route.ts`.

**فرق العقد:** اقتراح المرحلة 3 كان array لعناصر `{slug,name,description}` مع سياسة rate limit مقترحة. التنفيذ الحالي envelope باسم `locale/services` وعناصر `{slug,title,description,url}`، ولا يطبق حصة موزعة مخصصة. لا تُنسخ حالات 401/429 أو حدود الاقتراح إلى وصف التنفيذ.

## مثال مراجعة المشتريات

`POST /api/v1/procurement/review` مع `Content-Type: application/json`:

```json
{"quantity":12,"budget":15000,"warrantyMonths":null}
```

| المدخل | القيد |
|---|---|
| `quantity` | عدد صحيح من 1 إلى 1,000 |
| `budget` | عدد صحيح بالدولار من 1 إلى 10,000,000 |
| `warrantyMonths` | مطلوب: `null` عند غياب المعلومة، أو عدد صحيح 0–120 |
| حقول إضافية | مرفوضة |
| الجسم | 2,048 بايت كحد أقصى، بما في ذلك القراءة المتدفقة |

المورد A افتراضي: سعر الوحدة 1,200 وضمان 24 شهرًا. المورد B افتراضي: سعر الوحدة 1,180 والضمان من المدخل. لا أسعار سوق حية أو تقييم لجودة موردين. مثال الاستجابة للمدخل السابق:

```json
{
  "mode": "ILLUSTRATIVE",
  "currency": "USD",
  "input": {"quantity":12,"budget":15000,"warrantyMonths":null},
  "quotes": [
    {"id":"A","unitPrice":1200,"warrantyMonths":24,"total":14400,"withinBudget":true,"complete":true},
    {"id":"B","unitPrice":1180,"warrantyMonths":null,"total":14160,"withinBudget":true,"complete":false}
  ],
  "issues": [{"supplier":"B","code":"MISSING_WARRANTY"}],
  "status": "CLARIFICATION_REQUIRED",
  "orderCreated": false,
  "policy": "Compare prices only after warranty and budget checks; a responsible person must decide."
}
```

غياب الضمان أو تجاوز الميزانية ينتج `CLARIFICATION_REQUIRED`. عدم وجود هذه الملاحظات ينتج `READY_FOR_HUMAN_REVIEW`، وهو جاهزية لمراجعة بشرية وليس أمر شراء أو قرار توصية مستقلًا. حقول receipt المحمّل تشمل `reviewedByVisitor:true` و`authorizationGranted:false`.

| الحالة | المعنى الفعلي |
|---|---|
| 200 | حساب مثال صالح، وقد تظل به ملاحظات تحتاج استكمالًا |
| 400 | جسم غائب/JSON غير صالح/مخطط غير مقبول أو تعذر قراءة الطلب |
| 403 | وجود ترويسة `Origin` مختلفة عن origin الطلب |
| 413 | تجاوز الحجم |
| 415 | نوع محتوى غير JSON |
| 405 | طريقة غير مدعومة، ومنها GET؛ يرد بها Next.js |

أخطاء handler بشكل `{ "error": "…" }` وليست مخطط خطأ المرحلة 3 الذي يحتوي requestId. الاستجابات التي ينتجها handler تحمل `no-store` و`nosniff`. لا نضمن مخططًا مخصصًا لـ405 الصادر من الإطار.

فحص Origin ليس مصادقة؛ الطلب دون Origin يُقبل إذا صحت مدخلاته. لا يغيّر هذا endpoint حالة خارجية أو يخزن بيانات ولا يستدعي نموذجًا. لا توجد حصة موزعة مخصصة أو ضمان تحمّل أحمال؛ حماية Vercel لم تُغيّر. المصدر: `lib/procurement.ts` و`app/api/v1/procurement/review/route.ts`.

## الموجز والموافقة المحلية

نموذج `@components/project-brief.tsx` يجمع وصفًا عامًا، يعرضه للمراجعة، ويطلب إقرار صلاحية المشاركة قبل التنزيل وإظهار رابط البريد. ملف TXT يُنشأ في المتصفح. `mailto` يفتح مسودة إلى عنوان التواصل الموجود؛ لا يرفق الملف آليًا ولا يثبت إرسال الرسالة. لا API أو قاعدة بيانات أو خدمة بريد تستقبل الموجز حاليًا. إعادة تحميل الصفحة تفقد الحالة المحلية غير المنزلة.

## أدلة التحقق وحدودها

4 اختبارات وحدات للحساب/المدخلات، و28 فحص HTTP تشمل 15 صفحة ممثلة والواجهتين وأخطاء الإدخال و404 وsitemap/robots. انظر [فهرس الأدلة](../evidence/README.md). وجود 64 عنوانًا في sitemap لا يعني فحص 64 صفحة إنتاجيًا في الإصدار الأخير. لم تختبر RLS أو تسجيل الدخول أو التسليم البريدي لأنها غير منفذة.

## الحسابات والموجزات — 20 أكتوبر 2026

أضيفت 7 عمليات: POST register/login/logout، GET account، GET/POST/DELETE project-briefs. الجلسات HttpOnly؛ getUser يتحقق خادميًا وRLS يقيّد المستخدم والجلسة. التسجيل وحده يستخدم المفتاح السري لإنشاء مستخدم مؤكد تلقائيًا؛ CRUD الموجز يستخدم جلسة المستخدم. لا إرسال بريد. عقد التفاصيل في current-api.openapi.json. المجموع الحالي 10 عمليات؛ التقارير السابقة تصف إصداراتها التاريخية.

إصلاح الحساب D-25: GET /api/account يرجع 401 إذا لم يكن profile مرئيًا بعد Auth، وتبقى أخطاء قاعدة البيانات الفعلية 503. واجهة الموجزات تعالج فشل التحميل مستقلة عن الحساب؛ لا API جديد. [التسليم](../releases/ACCOUNT-HOTFIX-2026-10-20.md).
