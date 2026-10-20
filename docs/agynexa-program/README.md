# مركز توثيق AGYNEXA

أحدث مرشح واجهة: [تحسين الواجهة الثنائية](releases/VISUAL-UPGRADE-2026-10-20.md)، [PR #30](https://github.com/adham-younes/vzero/pull/30). كود ومعاينة للمراجعة؛ لا نشر إنتاجي بعد. الفيديو تلقائي دون أزرار تحكم وفق المالك.

ابدأ من [تقرير التنفيذ والإصلاحات والمتبقي — 20 أكتوبر 2026](CURRENT-IMPLEMENTATION-2026-10-20.md). يوحد الحالة الفعلية بدل الفقرات التاريخية المتعارضة، ويفصل التنفيذ عن التحقق المحلي والإنتاجي.

الموقع والحسابات وAgent Studio A–E منشورة ضمن نطاقها المحدود. آخر تغيير منتج: إزالة قسم API من واجهة الوكيل، PR #26 / `4b7b5a2`. آخر إيصال قبل هذا التجميع: PR #27 / `4799a2e`، توثيق فقط. [الموقع](https://vzero-nine-beryl.vercel.app) · [إيصال المنتج](agent-studio/evidence/api-ui-removal/production.json).

| السؤال | المرجع |
|---|---|
| ما نُفذ وأُصلح وما بقي؟ | [التقرير الشامل](CURRENT-IMPLEMENTATION-2026-10-20.md) |
| كم مرحلة وما حالتها؟ | [مصفوفة المراحل](STAGE-MATRIX.md)؛ الأصل 0–6، وStudio A–E امتداد مستقل |
| ما الخطة المعتمدة؟ | [الخطة الأصلية](MASTER-PLAN.md)، [خطة Studio](agent-studio/EXECUTION-PLAN.md)، [القرارات اللاحقة](DECISIONS.md) |
| ما العمل المتبقي؟ | [BACKLOG](BACKLOG.md) |
| أين الكود وما العقود؟ | [الخطة التقنية](TECHNICAL-PLAN.md)، [حالة API](architecture/API-STATUS.md)، [العقد الحالي](architecture/current-api.openapi.json)، [المسارات](current-routes.json) |
| كيف أستأنف وأسلم؟ | [RESUME](RESUME.md)، [WORKFLOW](WORKFLOW.md)، [STATUS الآلي](STATUS.json) |
| ما دليل النشر؟ | [سجل الإصدارات](RELEASES.md)، [فهرس الأدلة](evidence/README.md) |
| ما أثر السوق والموصلات؟ | [مطابقة السوق](reviews/MARKET-REVIEW-RECONCILIATION-2026-10-19.md)، [موصلات التصميم](CONNECTED-DESIGN-TOOLS.md) |

10 خدمات و9 حلول و64 عنوانًا تسويقيًا ثنائي اللغة، و34 عملية HTTP فعلية. الخدمات ليست عشرة منتجات مستقلة؛ AgentNexOS صفحة تعريفية، وStudio محرك محدود بقالبين. استعادة الحساب والفوترة والتكاملات الخارجية غير منفذة. تقطع الدخول والجلسات ملاحظة مفتوحة.

`IMPLEMENTED` يعني وجود كود؛ `VERIFIED` فحصًا محددًا على بيئة وإصدار معلومين؛ `SPECIFIED` تصميمًا فقط؛ `REQUIRES_ACCESS` حاجة إلى وصول ونطاق؛ `BLOCKED` عائقًا معلومًا؛ `UNKNOWN` غير مثبت. اتصال أكد المالك وجوده لا يعني اختبار قدراته أو دمجه في المنتج.

توجيهات المالك الأحدث تتقدم على الخطة التاريخية. الحالة التشغيلية تستند إلى الكود والإيصالات المؤرخة. ملفات baseline وsource-map وroutes وdependencies وcontent-inventory وtool-inventory تحفظ جرد المرحلة 0؛ لا تستخدمها لوصف الحاضر. التقارير التاريخية تصف وقتها فقط، والخطة الأصلية ومراجعة السوق محفوظتان دون تعديل.
