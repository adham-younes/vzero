# المعمارية: تشغيل حالي وتصميم مستقبلي

## التشغيل الموجود

- [API-STATUS.md](API-STATUS.md): ما يعمل وحدود السلوك والأمثلة.
- [current-api.openapi.json](current-api.openapi.json): عقد OpenAPI 3.1 يوثق عشر عمليات HTTP الحالية، بما فيها الحسابات والموجزات والفحص.
- [الخطة التقنية](../TECHNICAL-PLAN.md): الملفات والمسارات والمكونات.

## وثائق المرحلة 3 — مقترحات غير مطبقة

| الوثيقة | حالتها |
|---|---|
| [openapi.yaml](openapi.yaml) | 11 عملية و14 مخططًا مقترحًا. عقد الكتالوج داخلها ليس شكل الاستجابة المنشورة؛ راجع العقد الحالي أعلاه |
| [contracts.zod.ts.example](contracts.zod.ts.example) | مثال تصميم غير مستورد داخل التطبيق؛ ليست مكتبة تحقق منشورة |
| [data-model.md](data-model.md) | نموذج 20 جدولًا وERD وخطة عزل وأدوار |
| [schema-review.sql](schema-review.sql) | SQL للمراجعة فقط، لم يطبق على قاعدة بيانات |
| [integration-matrix.csv](integration-matrix.csv) | 20 مزودًا مرشحًا، وليست قائمة تكاملات موصلة |
| [provider-source-checks.json](provider-source-checks.json) | نتيجة الوصول للمراجع وقت البحث؛ لا تثبت صحة كل endpoint أو حساب |
| [workflow-contracts.md](workflow-contracts.md) | تصميم حالات التشغيل والموافقات والتكرار والأخطاء |
| [threat-model.md](threat-model.md) | تهديدات وضوابط مقترحة تحتاج تنفيذًا واختبارًا |

احتفظ بالعقود المقترحة كسجل قرار. عند اختيار قدرة للتنفيذ، حدّد فروق العقد وخطة الترحيل ثم حدّث الحالة والدليل. لا تضع عنوان الإنتاج فوق كل عمليات العقد المقترح وتوحي أنها تعمل.
