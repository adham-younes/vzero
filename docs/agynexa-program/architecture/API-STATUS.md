# Current API contract — document import and response progress

Source inventory: **68 operations in 52 route files**, including one new document-import operation. [Current OpenAPI](current-api.openapi.json), [route inventory](../current-routes.json) and the [runtime/activation contract](../releases/platform-upgrade-2026-11-05/BACKEND.md) supersede historical counts below. The document/progress changes are implemented release candidates until production acceptance is recorded. Existing surfaces cover configured ChatGPT OIDC, encrypted customer provider connections, activation requests, operator activation and authenticated provider artifacts. Publication/invoke/key issuance require activation and customer billing; revocation remains available. Mailbox UI/archive removal from main PR64 is retained.

## Corrective contract addendum — 2026-11-05

`POST /api/v1/agents/{agentId}/sources/import` accepts exactly one multipart field named `file`, after same-origin and authenticated workspace-owner checks. It returns `{title,content,format,notices}` for an editable preview. It does not save agent knowledge, transmit the document to an external extraction service, execute macros/formulas, or retain the original file. The separate existing source POST is the explicit save step and retains its request-key idempotency, ownership/RLS and public-approval choice. Import is limited to 6 requests per user/minute and 20 globally/minute, with access rechecked before returning the result.

| Input | Actual extraction scope |
|---|---|
| TXT, MD, CSV, JSON | UTF-8 text; JSON syntax checked; CSV remains readable CSV text |
| PDF | Text layer, at most 200 pages and 100,000 text items; no OCR or image rendering |
| DOCX | Raw document text using Mammoth; layout, images and document features require review |
| XLSX | Visible sheets as tab-separated cell values, with sheet labels; cached formula results only, no calculation; hidden sheets omitted with a notice |

Each file may contain at most **4,194,304 bytes (4 MiB)**. Extracted or pasted source content may contain at most **1,048,576 UTF-8 bytes (1 MiB)**. The import body allows an additional 65,536 bytes for multipart framing. Only source-save JSON receives a larger streamed body limit of 3,162,112 bytes for escaping/metadata; unrelated mutation bodies retain their existing limits. Extension, binary signature, package structure and UTF-8 are checked rather than trusting the supplied MIME type.

Office preflight bounds ZIP entries (512), total expanded data (24 MiB), each expanded member (8 MiB), compression ratio (200× with a 1 KiB denominator floor), XML depth (128) and element count (300,000). It rejects encrypted archives, duplicate paths, mismatched local/central headers, DTD declarations and invalid XML. Spreadsheet bounds include 20 sheets, 50,000 cells, row coordinate 10,000, 256 columns, 20,000 row elements, and bounded sparse rectangles. Extraction has a 25-second cooperative deadline. PDF loading is destroyed on abort; Office preflight receives the request/deadline abort signal, checks it between entries and chunks, destroys its active decompression stream and closes the ZIP, with listeners removed on completion. This is resource-bounded document parsing, not a dedicated process sandbox: synchronous Mammoth/XLSX conversion is not hard-preempted by the JavaScript timer. No assertion of comprehensive malformed-document testing is made before the production acceptance record.

Errors are sanitized codes: `source_file_required`, `source_file_unsupported`, `source_file_too_large`, `source_text_too_large`, `source_file_encrypted`, `source_file_unreadable`, `source_file_empty`, `source_pdf_scanned`, `source_file_complex` and `source_import_timeout`. Notices are `pdf_layout_review`, `docx_layout_review`, `xlsx_values_only` and `xlsx_hidden_sheets_omitted`. Raw parser warnings, file contents and provider credentials are not returned as errors or written by the import handler to logs. A PDF with no text layer needs OCR outside this import path.

Locked parser versions are [unpdf 2.1.0](https://github.com/unjs/unpdf) (bundled PDF.js; Node 24 required), [Mammoth 1.13.0](https://github.com/mwilliamson/mammoth.js), [read-excel-file 9.3.14](https://github.com/catamphetamine/read-excel-file), [yauzl 3.4.0](https://github.com/thejoshwolfe/yauzl) and [sax 1.6.1](https://github.com/isaacs/sax-js). The implementations use their documented binary-buffer/raw-text, ZIP-entry and XML-event APIs. Original file data stays in the server request process; saving later stores reviewed text in the existing tenant-scoped knowledge tables.

`POST /api/v1/agents/{agentId}/test-runs` additionally accepts `Accept: text/event-stream`; it remains the same operation and keeps JSON behavior for existing clients. The SSE contract is `status` with `{phase}` (`preparing`, `thinking`, `searching`, `coding`, `checking`), then `result` with `{run}`, or `error` with a sanitized `{error}`. Keepalive comments are emitted about every 15 seconds. Tool phases come from provider events; partial model JSON, hidden reasoning and unchecked answers are not exposed. Only the finalized authorized/persisted run is returned as a result. Pre-stream failures keep their ordinary JSON HTTP errors; HTTP 200 starting a stream is not proof of a successful run.

---

Current essential candidate inventory: 41 route files / 52 HTTP operations (derive exact counts from STATUS/OpenAPI). See [release](../../launch/2026-10-22/ESSENTIAL-WORKSPACE-RELEASE.md). Earlier counts below are historical.

# حالة APIs وسلوك الوظائف الفعلي

إصدار 22 أكتوبر منشور: [عقود تجربة العميل](../../launch/2026-10-22/API-CHANGES.md) و[إيصال النشر](../../launch/2026-10-22/RELEASE.md). الجرد الحالي38 عملية HTTP في29 ملف route؛ الجدول التاريخي أدناه يحتفظ بسياقه السابق، والعقد JSON الحالي مصدر الجرد الكامل.

الجرد الحالي عند كود المنتج `4b7b5a2`: **34 عملية HTTP في 26 ملف route**. [العقد الحالي](current-api.openapi.json) يصف التنفيذ؛ [openapi.yaml](openapi.yaml) مسودة المرحلة 3 التاريخية وليس عقد التشغيل. [تقرير التنفيذ](../CURRENT-IMPLEMENTATION-2026-10-20.md) يحدد بيئات الأدلة وحدودها.

## الجرد المنشور

| المسار | الطرق |
|---|---|
| `/api/v1/catalog/services` | GET |
| `/api/v1/procurement/review` | POST |
| `/api/health/supabase` | GET |
| `/api/auth/register` | POST |
| `/api/auth/login` | POST |
| `/api/auth/logout` | POST |
| `/api/account` | GET |
| `/api/v1/project-briefs` | GET, POST, DELETE |
| `/api/v1/workspace` | POST |
| `/api/v1/agents` | GET, POST |
| `/api/v1/agents/{agentId}` | GET, PATCH |
| `/api/v1/agents/{agentId}/sources` | GET, POST |
| `/api/v1/agents/{agentId}/sources/{sourceId}` | GET, DELETE |
| `/api/v1/agents/{agentId}/test-runs` | POST |
| `/api/v1/agents/{agentId}/publish` | POST |
| `/api/v1/agents/{agentId}/unpublish` | POST |
| `/api/v1/agents/{agentId}/activity` | GET |
| `/api/v1/agents/{agentId}/keys` | POST, DELETE |
| `/api/v1/agents/{agentId}/invoke` | POST |
| `/api/v1/runs/{runId}` | GET |
| `/api/v1/runs/{runId}/cancel` | POST |
| `/api/v1/approvals/{approvalId}/decision` | POST |
| `/api/v1/usage` | GET |
| `/api/v1/studio/models` | GET, POST |
| `/api/v1/widget/{publicId}/session` | POST |
| `/api/v1/widget/{publicId}/invoke` | POST |

ليست هذه كلها واجهات عامة بلا مصادقة. الحسابات والوكلاء والمصادر والتشغيل والموافقات تعتمد الجلسة وعضوية المساحة؛ invoke الخاص يعتمد مفتاح الوكيل، وwidget يعتمد جلسة قصيرة ومعرفة مصرحًا بنشرها. POST studio/models للتقييم الداخلي المصرح به، وليس اختيارًا عامًا لنموذج Preview. راجع security والحدود لكل عملية في العقد.

إزالة قسم مفاتيح API من الواجهة في PR #26 لم تحذف POST/DELETE keys أو invoke ولم تلغِ مفاتيح موجودة. لا توثق إنشاء المفاتيح من واجهة Studio كقدرة متاحة حاليًا. POST widget/{publicId}/invoke يستخدم معرّف الوكيل وفق عقده الحالي؛ اسم placeholder وحده ليس وصفًا كافيًا للمدخل.

## العلاقة بالتصميم الأصلي

الكتالوج والموجزات وقراءة runs والموافقة لها تنفيذ فعلي، مع فروق عقد موثقة. مسارات connectors/connect/callback وwebhooks والتكاملات العامة وknowledge/search وagents/{id}/runs وobservability/runs المقترحة لم تنفذ بتلك العقود. وظائف المعرفة والتشغيل الحالية عبر sources وtest-runs وinvoke وactivity وusage. غياب endpoint المقترح لا يعني غياب كل وظيفة مشابهة، ووجود وظيفة محدودة لا يعني تنفيذ المنصة المؤسسية كاملة.

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

نموذج `@components/project-brief.tsx` يجمع وصفًا عامًا، يعرضه للمراجعة، ويطلب إقرار صلاحية المشاركة قبل التنزيل وإظهار رابط البريد. ملف TXT يُنشأ في المتصفح. `mailto` يفتح مسودة إلى عنوان التواصل الموجود؛ لا يرفق الملف آليًا ولا يثبت إرسال الرسالة. زر الحفظ يستدعي POST /api/v1/project-briefs مع جلسة وموافقة صريحة، ويحفظ الموجز في Supabase. إعادة تحميل الصفحة تفقد المسودة غير المحفوظة؛ الموجز المحفوظ يبقى في الحساب. لا إرسال بريد خادمي.


## الحسابات والموجزات والصحة

GET health/supabase قراءة فقط؛ يثبت المشروع والمفتاح العام عبر Auth settings والسري عبر Data API، دون قراءة جداول المستخدم أو إظهار القيم. HTTP200 عند نجاح checks، و503 عند عدم التوفر؛ مهلة 5 ثوانٍ ومنع تحويلات URL وتثبيت المشروع. [الإيصال وتصحيح الفحص](../releases/SUPABASE-CONNECTION-2026-10-20.md).

POST register/login/logout وGET account وGET/POST/DELETE project-briefs منفذة. التسجيل ينشئ حسابًا مؤكدًا خادميًا دون بريد؛ لا يثبت ملكية عنوان البريد. الجلسة HttpOnly وRLS يتحققان من المالك والجلسة النشطة. عميل الخدمة يستخدم لإنشاء الحساب وعدادات محاولات Auth الخاصة؛ CRUD المستخدم بجلسة المستخدم. لا صلاحية بحسب بريد أو user_metadata.

GET account والموجزات تتطلب جلسة صالحة. logout ينهي الجلسة الحالية ولا يستدعي getUser قبل signOut؛ لا تفترض له تحقق عضوية أو حصة تسجيل/دخول. طلبات الحسابات المغيرة للحالة تتطلب Origin مطابقًا وJSON بحد 20KB. profile غير المرئي يعيد401؛ أخطاء قاعدة البيانات الفعلية تبقى503. خطأ تحميل الموجزات لا يسقط شاشة الحساب كلها. السبب الأصلي لبلاغ المالك والتقطع اللاحق غير محسومين.

موافقة حفظ الموجز مفروضة في API؛ consent_at الافتراضي لا يثبت مرور الإدراج المباشر بها. السقف يعد السجلات الموجودة المنشأة خلال24 ساعة، وحذفها يحرر الحصة. [المتبقي](../BACKLOG.md).

## Studio وضوابطه

POST workspace ينشئ/يعيد مساحة المالك دون user_id/org_id من المتصفح؛ الوكلاء بحفظ idempotent وrevision، و404 للغائب أو الأجنبي. الردود الخاصة no-store؛ الجلسة والعضوية وRLS مستقلة. AGYNEXA_STUDIO_ENABLED=false يعطل Studio، وهو مفعّل افتراضيًا.

المصادر نصية بحد12000 بايت؛ الاسترجاع بالكلمات، وليس embeddings. التشغيل يحفظ snapshot وusage، ويحصر الاستشهادات في المقاطع المسترجعة ويلحق نصها الأصلي؛ لا نقل reasoning خام أو أدوات خارجية. المصادر الخاصة لا تظهر في widget. إصدارات النشر ثابتة، وموافقة الدعم ذرية ومحددة بالفعل والصلاحية، ولا تنشئ تذكرة خارجية.

إصلاح المحادثة لا يضيف endpoint. الرسائل الكاملة للتعريف/التحية/الشكر تعيد نص منتج ثابتًا بلغة الرسالة داخل run محفوظ، citations=[] وusage.response_kind=conversation وتكلفة صفر دون Groq. بقية الأسئلة تخضع للمعرفة. أسماء الأنماط مرئية؛ معرفات الخادم في العقد ثابتة.

## أدلة وحدود التحقق

[إنتاج الحسابات](../releases/ACCOUNTS-AND-BRIEFS-2026-10-20.md)، [C/D/E](../agent-studio/STAGES-CDE.md)، [المحادثة](../agent-studio/CHAT-FIX.md)، [إزالة قسم API](../agent-studio/API-UI-REMOVAL.md). لا تستنتج نجاح كل عملية من HTTP200 لصفحة أو فحص ملف JS. لا فوترة أو استعادة حساب أو CRM/ERP أو OAuth خارجي أو مهام طويلة منفذة. لا إعادة لاختبارات التطبيق في تسليم توثيق.

## متابعة أخطاء المصادقة

تصحيح scoped: فشل خدمة Auth أو الشبكة يعيد 503، وحد المعدل 429، ورفض الجلسة/بيانات الدخول الحقيقي 401. لا عمليات HTTP جديدة أو تغييرات schema. [الدليل](../releases/CONTINUATION-2026-10-20.md).
