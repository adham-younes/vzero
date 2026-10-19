# سجل الإصدارات والأدلة

التحقق الأخير من alias الإنتاج أثناء تجميع التوثيق في 19 أكتوبر 2026 أعاد الإصدار أدناه. النطاق المتحرك قد يتقدم لاحقًا؛ معرّف النشر وSHA هما المرجع التاريخي الثابت.

## آخر إصدار غيّر المنتج وتم التحقق منه

| الحقل | القيمة |
|---|---|
| الموقع | https://vzero-nine-beryl.vercel.app/ |
| كود التنفيذ | `991deca5805636b090a7098c8f999ed162eb72de` |
| دمج main | `f6e92b3169be1dd96e7a9af197baf65c85957c16` |
| PR | [#5 — MERGED](https://github.com/adham-younes/vzero/pull/5) |
| وقت الدمج | 2026-10-19 02:14:11 UTC / 05:14:11 القاهرة |
| الإنتاج | `dpl_DDycdDNvYHZp831drKdsFuFsmMYP` — Ready، production |
| رابط النشر | https://vzero-aitmxp0td-adhamlouxors-projects.vercel.app |
| Preview | `dpl_7XcvmYr1Bq41sUhTvqrK4sAL6ir1` — https://vzero-gl3sb5hcu-adhamlouxors-projects.vercel.app |
| التقرير | [تسليم المراحل 4–6](releases/STAGES-4-6-DELIVERY.md) |
| الدليل | [فهرس الأدلة](evidence/README.md)، [production-verification.json](evidence/stages-4-6/production-verification.json) |

## التسلسل السابق

| الحدث | المصدر/النشر | ما يثبته |
|---|---|---|
| تثبيت المصدر | `a4a8a5daf00c36074f9db0e43184fe84d64a9f7a` | baseline؛ SHA النشر القديم لم يثبت. [المرحلة 0](releases/STAGE-0.md) |
| تجربة الربط ثم نشر مفوض | `2330c961df914e7b3f9b2762ae3577767248345f` / `dpl_D4MhV7Lgdj7Fxa8Bpfca5sfz5wGp` | عولجت مشكلة نسبة مؤلف commit ثم تحقق النشر. [التجربة](releases/DEPLOYMENT-TEST.md) |
| تسليم 1–3 | `95e0efec7a6117e12631877d0bcf80dbdc53b6d8` / `dpl_26bRUbwQYStofkVuEwCLd8zFsHEo` | 33 مسارًا وقتها ومحتوى وتصميم تقني؛ قبل فصل URLs للغتين. [التقرير](releases/STAGES-1-3-DELIVERY.md) |
| Speed Insights | `2a761aed107d83be5230ca656a89954c63c38302` / `dpl_BmTLpb3Q7V9jH9y83kctz3y6m17T` | main وSDK وأحداث فعلية بعينة صغيرة. [التقرير](releases/SPEED-INSIGHTS-VERIFICATION.md) |
| توثيق متابعة القياس | `cb6ec38`، دمج PR #4 | تغيير توثيق قبل تسليم 4–6؛ لا إصدار وظائف جديد |
| تسليم 4–6 | `f6e92b3`، دمج PR #5 | UI ووظيفتان API وSEO ونشر متحقق |

التقارير الكاملة: [0](releases/STAGE-0.md)، [1](releases/STAGE-1.md)، [2](releases/STAGE-2.md)، [3](releases/STAGE-3.md)، [4](releases/STAGE-4.md)، [5](releases/STAGE-5.md)، [6](releases/STAGE-6.md). [نسخة STATUS قبل تنظيم التوثيق](history/status-before-documentation-2026-10-19.json) تحفظ الحقول التاريخية التي كانت متداخلة؛ الحالة الجارية في [STATUS.json](STATUS.json).

## مرجع تراجع معروف

إصدار Speed Insights المتحقق منه: `dpl_BmTLpb3Q7V9jH9y83kctz3y6m17T`، [رابطه](https://vzero-lbud5jgsv-adhamlouxors-projects.vercel.app)، مصدره `2a761aed107d83be5230ca656a89954c63c38302`. هو **مرجع منتج سابق متحقق منه**، وليس بالضرورة النشر السابق مباشرة؛ وقع نشر توثيق بعده. التراجع إليه يزيل تغييرات وظائف وواجهة وSEO المراحل 4–6. [إجراء التراجع](WORKFLOW.md) يحدد التحقق المطلوب؛ لم يُنفذ تراجع أثناء إعداد التوثيق.

## حزمة التوثيق الحالية

التغيير الحالي يضيف تنظيمًا وأدلة وعقد تشغيل حاليًا دون تغيير ملفات المنتج. يحدد تاريخ Git وPR الخاص بهذه الحزمة SHA توثيقها ووقت دمجها. لا تغيّر هذه الحزمة حقيقة أن إصدار المنتج المتحقق منه هو إصدار PR #5، حتى لو أنتج دمج الوثائق نشرًا تلقائيًا جديدًا.

[تقرير تجميع التوثيق](releases/DOCUMENTATION-HANDOVER.md) يوضح الملفات والأدلة وحدود التحقق لهذه الحزمة.

[تحديث قائمة موصلات التصميم](releases/DESIGN-CONNECTORS-DOCUMENTATION.md): 11 اتصالًا أكدها المالك؛ توثيق موارد فقط دون تعديل المنتج.

[إيداع مراجعة السوق والتنبيه بأولوية قصوى](releases/MARKET-REVIEW-DOCUMENTATION.md): مرجع يجب مراجعته قبل استكمال المراحل؛ لم تنفذ توصياته في هذا التحديث.
