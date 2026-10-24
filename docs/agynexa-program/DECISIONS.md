# القرارات والتفويضات والملاحظات

هذه خلاصة توجيهات المالك وقرارات التنفيذ المسجلة حتى 19 أكتوبر 2026. [الخطة الأصلية](MASTER-PLAN.md) محفوظة كما وردت؛ لم يُعد تحريرها لتبدو كأنها قالت شيئًا مختلفًا.

| القرار | السبب والتوجيه | النتيجة |
|---|---|---|
| D-01 — المرجع والهوية | المالك يريد اتساع الخدمات والتفاصيل على مثال Kore.ai مع اسم وألوان وقالب مشروعه | فهم تصنيف الوظائف والعرض ثم كتابة محتوى ورسومات أصلية لـAGYNEXA؛ لا نسخ هوية Kore.ai أو شهاداته أو عملائه |
| D-02 — مصدر التنفيذ | المالك حدد `adham-younes/vzero` | العمل في نسخة المشروع وفرع مستقل؛ `agynexa.si` مرجع قراءة وهوية ومحتوى، وليس هدف نشر هذه المهمة |
| D-03 — حماية المقدمة | تكرار طلب الحفاظ على الفيديو والرئيسية | تثبيت SHA-256 للفيديو ومكوّني Hero. بقية الأقسام قابلة لإعادة البناء |
| D-04 — الاستثناء المحدد للحماية | طلب لاحق: تصحيح درجات الأخضر وكون الرئيسية غامقة/مطفية | السماح بتوحيد اللون وتخفيف overlay في CSS فقط ضمن النطاق؛ الملف والنص والحركة وتركيب Hero الأصلي محفوظة |
| D-05 — تنفيذ المراحل والنشر | المالك طلب ثلاث خطوات ثم نشر إنتاجي، وكرر التفويض للمجموعة التالية | توقفات الخطة ومنع الإنتاج استُبدلت لهذه التسليمات بتوجيه مباشر. ليس تفويضًا مفتوحًا لكل تغيير لاحق أو لكل حساب |
| D-06 — الحلول القديمة | الخطة نصت على حفظ المعرفة والمشتريات والمستحقات وعمليات العملاء؛ المالك أكد الحفظ | الحلول الستة السابقة باقية؛ أضيفت المشتريات والمستحقات وعمليات العملاء. القطاعات تصنيف مستقل عن الأقسام الوظيفية |
| D-07 — صورة السيرفرات | المالك طلب إزالتها | أزيلت الصورة والملف، ثم أضيف رسم SVG أصلي يشرح البنية. لا صورة مدفوعة أو رسم منسوخ |
| D-08 — تنظيم المحتوى | المالك منح حرية التنسيق ثم رفض تكرار صناديق النص | مكونات مختلفة حسب الوظيفة مع بقاء النصوص والتفاصيل، وعرض كامل للخلفيات مع حدود قراءة للمحتوى |
| D-09 — اللغة البشرية | طلب صريح لمهارة Humanizer | استُخدمت نسخة 3.0.0 لتحرير النصوص دون تغيير المعنى أو الحدود؛ نص Hero المجمد مستثنى |
| D-10 — حد التشغيل | لا حسابات أو أسرار أو خدمات مدفوعة مفوضة لبناء backend | مثال مشتريات حتمي بلا بيانات حقيقية؛ نموذج محلي ومشاركة يتحكم فيها الزائر؛ تصميم المؤسسات موثق منفصلًا |
| D-11 — اللغة وSEO | مرحلة SEO تتطلب عناوين قابلة للفهرسة لكل لغة | `/ar` للعربية وHTML من الخادم، روابط متكافئة وعناوين canonical، 64 URL بعد استبعاد alias الكتالوج |
| D-12 — القياس | طلب فحص فائدة Speed Insights ثم متابعة التنفيذ | دمج SDK 2.0.0 مرة واحدة، إثبات أحداث بعينة صغيرة، دون ترقية Plus أو ادعاء أداء شامل |
| D-13 — حالة المستودع | المالك أعلن جعله عامًا وتفعيل Allow auto-merge | التوثيق عام؛ لا أسرار أو بيانات عميل. تفعيل الخاصية لا يعني أن كل PR يُدمج تلقائيًا |
| D-14 — أولوية التوثيق | الطلب الحالي: توثيق الخطة والتنفيذ والمتبقي والملاحظات وسير العمل في السحابة | مدخل README وحالة موحدة ومصفوفة مراحل وعقود حالية وأدلة داخل GitHub؛ تحديثها مع كل تسليم |

## D-15 — موارد التصميم المتصلة

بعد تسليم حزمة التوثيق، أكد المالك اتصال جميع الموارد الـ11 الواردة من صفحة Vercel Connect وطلب توثيقها لإعادة تنظيم التصميم وإثرائه بالصور والمكونات واحتياجات واجهات المستخدم. [القائمة الكاملة](CONNECTED-DESIGN-TOOLS.md) تحفظ أسماء الاتصالات ومواردها وتواريخها. حالة الاتصال مبنية على تأكيد المالك؛ لا يدعي هذا التحديث اختبار أدواتها أو استدعاءها من كود المنتج.

## ما لا تمنحه هذه القرارات

لا إذن ضمنيًا بتغيير قاعدة Supabase قائمة، أو شراء رصيد أو اشتراك، أو إرسال بريد/حملة للغير، أو نشر أسرار، أو تعديل حماية Vercel، أو ادعاء موافقات شراء موثقة من checkbox محلي. تنفيذ المرحلة 5 محدود بما لا يتطلب هذه الصلاحيات؛ الامتداد القادم يحددها صراحةً.

## ملاحظات عملية من التنفيذ

- فشل النشر الأول ارتبط بنسبة commit إلى `adhamyoune` بدل المستخدم المتصل `adham-younes`. التصحيح كان لهوية Git محلية للمستودع، دون إعادة كتابة تاريخ أو تغيير وصول الحساب. [التقرير](releases/DEPLOYMENT-TEST.md).
- قياس CSS وDOM حسم الألوان؛ لقطات الفيديو تختلف حسب الإطار ولا تثبت وحدها تغيير ملف الفيديو.
- أُصلح تعارض اعتبار `/architecture` مسارًا عربيًا بسبب prefix `/ar`؛ التحقق الحالي يطابق `/ar` أو `/ar/` فقط.
- أُصلحت أيقونة كبيرة في شريط الأدوات وروابط متزاحمة أثناء المراجعة؛ لا تُستخدم لقطة قبل التصحيح كصورة نهائية دون وصفها.
- أداة المتصفح البعيدة لم تطبق 390px؛ لا تُقدّم الاختبارات المحلية على أنها اختبارات هاتف إنتاج.
- لم تتوفر مراجعة تصميم مستقلة ناجحة؛ كانت مراجعة المصدر واللقطات داخل المهمة. حفظ التحفظ جزء من الدليل.
- `READY` أو HTTP 200 لا يكفيان لإثبات تفاعل المستخدم؛ الإصدار الأخير اختُبر باختيار قطاع وإرسال مثال مشتريات فعلي في المتصفح.

التقارير القديمة تصف زمنها. جملة «لا توجد APIs منفذة» صحيحة لمرحلة 3 آنذاك، لكنها لا تصف الواجهتين المضافتين في مرحلة 5. أضيفت إحالات للحالة الحالية مع الاحتفاظ بالسجل التاريخي.

## D-16 — مراجعة السوق قبل استكمال المراحل، بأولوية قصوى

طلب المالك رفع الوثيقة المرفقة وتذكيرًا ملزمًا بمراجعتها قبل استكمال المراحل المتبقية. حُفظت [الوثيقة الأصلية](reviews/AGYNEXA_Market_Review_and_Action_Plan_2026-10-19.md) دون تعديل، وأضيفت إحالات واضحة في تعليمات العمل وREADME وRESUME وسير العمل والمراحل والمتبقي وSTATUS.

التفويض الحالي للإيداع والتذكير فقط. التوصيات التجارية والمراحل A–D والتكليف البديل داخل الوثيقة مادة للمراجعة، وليست أمر تنفيذ تلقائيًا. لم تستبدل MASTER-PLAN أو تتغير حالة المراحل السابقة أو وظائف المنتج. المراجعة الموضوعية المطلوبة ما زالت مسجلة `PENDING_BEFORE_NEXT_IMPLEMENTATION`.

## D-17 — نطاق التصحيح بعد مراجعة السوق

طلب المالك إلغاء العمل الأخير والعودة للخطة الأصلية ومراحلها حرفيًا. أُعيد الفرع إلى أحدث main `b20420d` قبل التنفيذ الجديد. لا اعتماد للتموضع كخدمة RFQ أو قطاع المسامير أو الصورة المكتبية أو الرسم البديل؛ [المطابقة](reviews/MARKET-REVIEW-RECONCILIATION-2026-10-19.md) تفصل التوصيات عن التفويض.

## D-18 — إصلاحات قبول المرحلة 4

تفويض مباشر: حفظ الفيديو الافتتاحي، علاج انخفاض الإضاءة، توحيد الأخضر، استخدام أدوات التصميم المتاحة أو MagicPath، والاستفادة من مكونات جاهزة وصورة شبيهة باتجاه مرجع المخ كخلفية للمحتوى. حُددت AgentNexOS لأنها صفحة اتجاه مساحة الوكلاء القائمة. لا نص تسويقي أو خدمة جديدة. استُخدمت مكونات shadcn القائمة المبنية على Base UI؛ لم تضاف مكتبة Radix أخرى أو theme بديل. تخفيف overlay في CSS وحده استثناء مفوض؛ ملفات Hero والفيديو ثابتة. يظل قبول المالك والموافقة على الإنتاج منفصلين.

## D-19 — فريق التنفيذ المذكور

حدد المالك Codex وdot الخاص به باسم NEXA Agent للتنفيذ والدعم. هذا تكليف تعاون، وليس إثبات تكامل NEXA Agent أو وجود تشغيل دائم في الجلسة. لم تُحدد ميزانية أو ساعات أو علاقات تجارية؛ لا تُختلق افتراضات مؤكدة عنها.

## D-20 — تنفيذ التسلسل المعتمد، 20 أكتوبر 2026

بعد عرض تسلسل إقفال الواجهة ثم استقبال موجز المشروع ثم مسار معرفة واحد وصلاحياته، وجّه المالك «نفذ». يشمل ذلك تسليم تصحيحات الواجهة الحالية ودمجها ونشرها؛ دُمج PR #9 عند HEAD الذي اجتاز الفحوص، دون تغيير الهوية أو إعادة المراحل السابقة. لا يثبت التفويض وجود صلاحيات أو ميزانية تشغيل؛ يحدد المصدر الفعلي قبل الكتابة.

حدد المالك لاحقًا مشروع Supabase الجديد agynexa بالعنوان `https://xsyxvswbiptbyxyqhdim.supabase.co` وطلب اختبار اتصاله. فحص القراءة للمشروع أعاد رفض صلاحية عبر موصل الجلسة، رغم استجابة عنوان الشبكة 401 لغياب API key. لا SQL أو جداول أو بيانات أُنشئت. [دليل الوصول](evidence/stage4-production-2026-10-20/supabase-access.json).

## D-21 — فصل الحسابات وفحص الربط الفعلي

أكد المالك adham-younes/vzero، واختار المشروع xsyxvswbiptbyxyqhdim وأضاف متغيرات Vercel يدويًا ثم طلب اختبار الاتصال. ظهر اتصال MCP باسم agynexa وأعيد اختبار المشروع المحدد بنجاح وSQL قراءة فقط. اختبار Vercel يتطلب استدعاء خادميًا لأن الموقع لم يكن يستعمل المتغيرات؛ أضيف health endpoint محدود ضمن طلب التحقق. لا كتابة DB أو تثبيت SDK أو تغيير حماية أو استعمال مشاريع أخرى.

## D22 — حسابات مباشرة وموجزات دائمة بتفويض المالك

في 20 أكتوبر فوّض المالك إنشاء قاعدة بيانات ومستخدمين وتسجيلًا تلقائيًا بلا تأكيد بريد. نطبق نطاقًا محدودًا من المرحلة 5 لا المسودة المؤسسية كلها. لغياب قدرة تعديل Auth config في MCP، مسار التطبيق يستخدم إنشاء حساب خادميًا مع تأكيد تلقائي ثم كلمة مرور وجلسة، دون إرسال بريد. لا صلاحيات بحسب البريد أو metadata. RLS يتحقق من المستخدم والجلسة النشطة. تبقى ملكية البريد غير مثبتة، ولا استرجاع بريدي/دعوات في هذا التسليم. قاعدة المشروع المحدد كانت خالية من جداول التطبيق؛ المخطط الجديد غير مدمر. اختبارات المستخدمين مصطنعة وتُحذف بعد إبطال جلساتها.

## D-23: برنامج Agent Studio والمرحلة A فقط

أصدر المالك تكليفًا جديدًا في 20 أكتوبر 2026، محفوظًا في [EXECUTION-PLAN](agent-studio/EXECUTION-PLAN.md). يعتمد التدقيق السابق ويطلب فحص الفروق التالية له فقط. النطاق الجاري: تصحيح التوثيق المؤثر وتشخيص وإصلاح تعتيم Hero بأقل CSS مع نفس الإطار والمقاس، دون تعديل العنوان أو الفيديو أو playback أو crop أو أبعاد المقدمة. إصلاح CSS له commit مستقل. لا تصبح لقطاته baseline معتمدة حتى قبول المالك.

يعمل البرنامج على فرع مستقل، دون main أو دمج أو Production. migrations جديدة للمراجعة/البيئة المعزولة فقط؛ القاعدة القائمة وإعدادات Auth تحتاج موافقة مستقلة محددة. التسجيل والدخول بلا بريد ثابتان؛ لا OAuth أو SMTP أو استعادة مصطنعة. Groq المدفوع مفوض للعمل الوظيفي في مرحلته؛ لا تشغيل نماذج في A. قالبا KnowledgeGrid وServiceFlow فوق Runtime واحد؛ لا بناء الخدمات العشر معًا. يتوقف كل تسليم لاعتماد التالي.

ملف المرفق يحتوي بعد التكليف على بقايا تصدير واجهة متصفح. حفظ النص التنفيذي وحده، ولم تنقل البقايا إلى المستودع.

## D-24 — متابعة B وإصلاح الحساب وحذف مصادر الأصول الظاهرة

بعد تسليم A طلب المالك: «صلح الاولي والغي التانية من مصادر الاصول-كمل المراحل المرفقة في التقرير». وحدد النشر المتأثر على main عند `d030a60`. يُعامل التوجيه كإذن بالانتقال إلى المرحلة التالية B مع إصلاحي الحساب والواجهة؛ لا إلغاء لنقاط التوقف ولا لتفويض الإنتاج وقاعدة قائمة المنفصل. لا يُدّعى اعتماد بصري تفصيلي لم يقله المالك، ولا تعاد المقدمة أثناء B.

حُذفت فقرة مصادر الأصول ورابطها من واجهة اللغتين، مع حفظ سجل الأصل داخليًا. عولج اعتماد شاشة الحساب كلها على نجاح قائمة الموجزات، وعودة 503 بدل 401 عند غياب profile بعد نجاح Auth. السبب المحدد لشكوى الإنتاج غير محسوم؛ سجلات القراءة المتاحة لم تثبت فشلًا مطابقًا. التحقق والتطبيق الفعليان لأساس Studio جريا محليًا فقط، دون حسابات أو بيانات اختبار في الإنتاج. [التسليم والحدود](agent-studio/STAGE-B.md).

التوسع محدود إلى organizations/memberships/agents وقالبين محفوظين؛ لا تغيير تموضع RFQ أو المحتوى المعتمد. النموذج محفوظ كإعداد لا اتصال حي، والاستعادة عائق إطلاق. بعد قبول B تأتي C، ثم D وE وفق نقاط التوقف الأصلية.

## D-25 — نشر إصلاح الحساب وتخفيف الاختبارات

20 أكتوبر 2026: قال المالك «الاختبارات فقط عند النشر الانتاجي-انشر نشر انتاجي سريعا لكي نكمل باقي الاجزاء»، ردًا على طلب نشر إصلاح الحساب وحذف مصادر الأصول فقط. هذا تفويض دمج ونشر ذلك الإصلاح على vzero، من commit المصدر `5dc609b`، دون تفعيل Studio أو تطبيق SQL أو تعديل Auth حي. يُنقل الإصلاح وحده إلى فرع من أحدث main؛ PR #18 يبقى منفصلًا لبرنامج Studio.

تُجمع الاختبارات عند التسليم الإنتاجي، ولا تتكرر بعد كل تعديل. لهذا الإصلاح تُستخدم أدلة المرحلة B القائمة، مع بناء Vercel وفحص إنتاج مختصر للصفحات المتأثرة والمصادقة دون جلسة. لا تسجيل مستخدمين أو بريد اختبار جديد.

## D-26 — إكمال Studio والنشر الإنتاجي، 20 أكتوبر 2026

التوجيه المباشر: «تمام المفاتيح الثلاثة اتحطت في متغيرات البيئة واعدت النشر-كمل مراحل التنفيذ بالكامل ثم انشر نشر انتاجي». يعتمد استكمال C/D/E فوق A/B ثم دمج ونشر vzero، بما يلزم من migrations إضافية على مشروع AGYNEXA `xsyxvswbiptbyxyqhdim`. لا تغيير Auth/SMTP أو إرسال بريد أو شراء موارد. توجيه الاختبارات عند التسليم الإنتاجي فقط باقٍ. GROQ_API_KEY و_2 و_3 خادمية؛ لا نقل أسرار إلى المستودع أو المتصفح.

مراجعة السوق كاملة قورنت مجددًا بالمصدر: الموقع والحسابات منشورة، وB حفظ وعزل محلي فقط. التوصيات المطبقة: قالبان ومحرك واحد، موافقة مربوطة بالفعل، تكرار آمن، استشهادات حقيقية وعزل قبل الاسترجاع، وصدق الحالة. لا تحويل RFQ ولا إعادة تصميم/بحث Kore.ai. التالي معرفة وتشغيل ثم نشر الوكيل، لا عشر خدمات مستقلة.

نماذج الإنتاج: GPT-OSS 120B على slot 1 وGPT-OSS 20B على slot 2، مع مقارنة متزامنة اختيارية. Qwen3.8-27B على slot 3 للتقييم الداخلي وفق حالة Preview الحالية؛ لا fallback تلقائي أو محاولة تجاوز حدود المؤسسة بالمفاتيح. التوثيق الرسمي يدرج النماذج، والتحقق من وصول الحساب الفعلي منفصل عند النشر.

## D-27 — إصلاح تجربة محادثة الوكيل

طلب المالك إصلاح غياب دردشة واضحة ورفض «من أنت» وإخفاء أسماء النماذج التقنية. النطاق: واجهة محادثة أساسية، تعريف/تحية ثابتان بلا مصدر، لغة حسب الرسالة، وأسماء أنماط للمستخدم. حفظ قيود المعرفة والأسئلة الواقعية والعزل، ونشر الإصلاح تحت تفويض التسليم الإنتاجي المستمر. لا Auth/SQL أو إعادة تصميم الموقع.

## D-28 — حذف قسم مفاتيح API من Studio

المالك طلب حذف النص وحقل المفتاح وزر الإنشاء ومثال POST/Authorization. يزال القسم الكامل من الواجهة باللغتين ويصبح التبويب «النشر». لا يتضمن الطلب إلغاء مفاتيح أو تعطيل API الخلفية. نشر محدود وفق التفويض القائم، مع بناء النشر فقط وفحص مصدر منشور.

## D-29 — توثيق جميع التحديثات والإصلاحات والحالة الفعلية

20 أكتوبر 2026: طلب المالك «وثق جميع التحديثات والاصلاحات وما نفذ فعليا وما لم ينفذ بعد». يجمع التسليم الحالة من أحدث main عند `4799a2e` والكود والإيصالات، ويزيل تعارض الفقرات الجارية التي بقيت عند B رغم نشر A–E. لا تغيير للخطة الأصلية أو الأدلة التاريخية أو المنتج أو قاعدة البيانات. يُفصل بين الإصدار التشغيلي الأخير #26 وتوثيقه #27، وبين التحقق المحلي والإنتاجي والفجوات. يُحدث فاحص الوثائق ليقارن عقد API بجميع route handlers الحالية بدل قائمة الحسابات القديمة فقط؛ لا تعطيل لضوابطه ولا تشغيل اختبارات التطبيق.

## D-29 — تحسين الواجهة وتصحيح تشغيل الفيديو

وافق المالك على مقترحات الفحص البصري وطلب تكبير اسم المنصة وتصغير تبديل اللغة إلى AR/EN وتوحيد الخطوط وألوان النص وسيمترية الصفحات. لاحقًا صحّح صراحةً: «الفيديو يشتغل اتوماتيك من غير زر تشغيل او ايقاف». أزيل التحكم الإضافي وأُعيد مكون الفيديو الأصلي دون تعديل. هذا التوجيه يتقدم على اقتراح pause السابق. [النطاق والمطابقة](reviews/VISUAL-UPGRADE-SCOPE-2026-10-20.md)، [التسليم](releases/VISUAL-UPGRADE-2026-10-20.md).

البريد الذي حدده المالك للاستعادة: adham@agynexa.si، Spacemail / Spaceship. لا يكفي اسم المورد وعنوان البريد لإثبات تهيئة SMTP؛ لا إرسال أو تعديل Auth في مرشح الواجهة. دمج main ونشر الإنتاج يحتاجان قرار التسليم النهائي بعد المعاينة. لا حذف لمحتوى الخدمات أو تحويلها إلى منتجات مستقلة.

## متابعة النشر والحسابات

D-30 — طلب المالك «سيب البريد دلوقتي وكمل الشغل»: تأجيل SMTP والاستعادة، استكمال نشر الواجهة والتحقق منها، ثم تصحيح تصنيف أعطال الحسابات المثبت باختبار. لا يعد ذكر Spacemail السابق تفويضًا لربط صندوق المالك. [الدليل](releases/CONTINUATION-2026-10-20.md).


## D-32 — Customer release, 22 October 2026

Owner authorizes implementation/local preparation/push/production, exactly three Sol High execution workers and continuous repository traceability. Latest instruction: each coherent completed product phase ends in production deployment/documentation; coupled schema/runtime/UI/content ship together, not unfinished internal checkboxes. Existing home/template/video unchanged. Three intended Groq slots with provider-supported maximum output; no artificial response deadline/message count. Preserve current security/abuse/hosting constraints. No domain/DNS, paid upgrades, outreach/email or destructive live cleanup. Full accepted documents and current decisions: [execution ledger](../launch/2026-10-22/EXECUTION.md), [complete plan](../launch/2026-10-22/implementation-plan.md), [newer overrides](../launch/2026-10-22/coordinator-review-addendum.md). No 90-day purge/legal identity/commercial terms invented. Status remains NOT VERIFIED until final integrated evidence.


## D-33 — استكمال حالات القبول الناقصة فقط

22 أكتوبر2026: التوجيه الأحدث يجيز تشغيل البيئة المحلية المعزولة مرة للحالات غير المنفذة، والحقن المحدد لأخطاء النقل، وعينة إنتاجية خاصة اصطناعية دون بيانات حقيقية. كشف الفحص رفضًا آمنًا لكنه غير مفيد لسؤال مختلط، وقبولfalse كغياب لثلاثة حقول اختيارية؛ يصلحان جراحيًا ثم بناء النشر وفحص المتأثر فقط. لا تكرار للـ38اختبارًا الناجحة، ولا تغيير للرئيسية أو الخطة الكاملة. [الإيصال](../launch/2026-10-22/REMAINING-ACCEPTANCE.md). تبقى بوابات الفهم والحقائق القانونية والتجارية والاحتفاظ والاستعادة بشرية؛ النطاق لا يشملDNS أوSMTP أو رسائل خارجية.


## D-34 — الهوية الرسمية وملف Google ووقف النشر

أحدث توجيه مباشر من المالك يوقف النشر حتى الموافقة النهائية، متقدمًا على تفويض النشر المرحلي السابق. PR38/ceeb7af أُنجز قبل التوجيه ويُحفظ كما هو. جُهزت الهوية الرسمية About/Founder/Contact وملف Google53بايت محليًا فقط على فرع مستقل قابل للمراجعة. لا ادعاء بالتسجيل القانوني؛ التسجيل غير مكتمل بحسب المالك. بيانات التواصل لا تعني اختبار تسليم البريد. تبقى الرئيسية وكل تبعياتها محمية؛ التذييل العام واسم المؤسس المختصر فيJSON-LD لم يتغيرا. [التفاصيل والبوابة](../launch/2026-10-22/OWNER-IDENTITY-REVIEW.md). لا نطاق/DNS أو تحقق حي للدومين المستقبلي.


## D-35 — موافقة نشر المرشح المحدد

22 أكتوبر 2026: أجاب المالك مباشرةً «موافق-نفذ» على حزمة الهوية والتواصل وGoogle وبوابة النشر النهائية. ينسخ هذا وقف D-34 لهذا الإصدار المحدد فقط: About/Founder/Contact EN/AR وملف Google المطابق53بايت، مع push/PR/دمج main ونشر المشروع القائم والتحقق الحي. الكود الموافق عليه لم يتغير منذ build/TypeScript و8عينات محلية ناجحة؛ يعاد استخدام هذه الأدلة ويقتصر التحقق الجديد على بناء Vercel والصفحات المتأثرة والملف. لا تغيير للرئيسية أو Hero أو الفيديو أو الألوان والخطوط أو التذييل وJSON-LD العام، ولا حساب/SMTP/بريد/قاعدة أو DNS أو نقل دومين. الموافقة ليست إجابة عن المعالجة القانونية والاحتفاظ والتكلفة والدعم والاستعادة أو فهم مستخدم حقيقي. [الإصدار](../launch/2026-10-22/OWNER-IDENTITY-RELEASE.md).


## D-36 — ربط الدومين بالمشروع الحالي مع حفظ البريد

22 أكتوبر 2026: قال المالك «نفذ» بعد شرح نقل agynexa.si وwww من المشروع القديم إلى vzero واستبدال الموقع المعروض، مع إبقاء nameservers وسجلات البريد. يجيز التفويض نقل الارتباط والتحقق من HTTPS والتحويل وGoogle وإعداد host الضروري فقط؛ لا شراء أو نقل تسجيل أو تغيير DNS أو MX/TXT/SMTP أو تصميم الرئيسية. عملية Move الرسمية نقلت الاسمين مع www308 في طلب واحد، وDNS قبل/بعد مطابق. تعديل siteUrl في سطر واحد يلزم لتصحيح canonical وsitemap والروابط البديلة؛ [الإيصال](../launch/2026-10-22/DOMAIN-CUTOVER.md). طلب NEXA email اللاحق مرحلة مستقلة محلية حتى توضيح القيد المبتور؛ لا خلط بين التفويضين.


## 2026-10-22 essential workspace work package

See [essential workspace and NEXA release](../launch/2026-10-22/ESSENTIAL-WORKSPACE-RELEASE.md). Latest owner priority is Studio-first, sole primary execution and minimal affected checks. Real reviewed agents/projects/tasks and safe private mail foundation are additive; larger operating, mailbox migration, ChatGPT and campaign requirements remain open. Production status is governed by the dated release receipt, not by candidate code.


## Latest local review — Studio corrective candidate, 2026-10-22

Owner rejected PR41's marketing wrapper, duplicate navigation and mixed interface labels. [Corrective local UI review](../launch/2026-10-22/STUDIO-CHAT-UI-REVIEW.md) now contains actual desktop/mobile EN/AR screenshots. Dedicated full-height chat uses existing tokens and real compact management entry points. Build/types and 15 targeted browser groups passed with synthetic browser API data. Production remains PR41; no commit/push/deploy. MagicPath project creation was blocked by external-agent quota50/50; no canvas was created. [NEXA routing checkpoint](../launch/2026-10-22/NEXA-INBOUND-ROUTING-REVIEW.md) remains preserved/uncommitted. Owner explicitly requires review before DNS or deployment. Full plans and post-PR41 receipts remain intact.


## Reviewed Studio UI release authorized — 2026-10-22

Owner explicitly approved the displayed dedicated Studio composition and said نعم-نفذ. Release only that reviewed UI; keep the separate local NEXA routing/config/test/docs candidate unpublished. No DNS, mailbox, provider, webhook, environment or mail-send changes. Preserve PR41 receipt and full master plan. See [UI release](../launch/2026-10-22/STUDIO-CHAT-UI-RELEASE.md).


## Studio UI PR42 production receipt — 2026-10-22

[Owner-approved dedicated chat release](../launch/2026-10-22/STUDIO-CHAT-UI-RELEASE.md) published: source `25b89709c3a65ef499c998a179ce3f2ef30deaad`, READY `dpl_9LoGYjBSSzjj3A1Lt14xSeypnPCG`. Existing-owner saved response, locale navigation and reload plus scoped EN/AR layout/HTTP checks passed. This closes the displayed composition release only; larger operating/comprehension and independent email gates remain open. Local NEXA routing candidate is excluded from Git release.


## Preserved unpublished NEXA local checkpoint

The separate [email routing candidate](../launch/2026-10-22/NEXA-INBOUND-ROUTING-REVIEW.md) and its code/config/tests remain local and unpublished after Studio PR42. Original shared routing notes are preserved in the verified task-local snapshot; this reapplication retains the new Studio receipt instead of overwriting it. No email/DNS/MX/provider/mailbox/webhook/env mutation or real send is authorized. Latest owner facts identify an already-created Resend NEXA inbox; do not create a duplicate. Dedicated Spacemail NEXA-recipient forwarding still needs isolated local preparation and later review. The full next-task facts are saved privately in work/nexa-email-next-scope.json.


## NEXA cloud mail infrastructure authorized — 22 October 2026

The owner's explicit functional cloud-email instruction supersedes the previous local-only email hold for necessary scoped mail infrastructure, provider webhook/server configuration, additive checked database migration and deployment. Reuse the existing inbox/key and exact managed target. Existing human approval/send guards remain. Actual agent identity/transport awaits NEXA's reply; no personal mailbox, MX/DNS, purchase or real send/campaign is authorized. [Current cloud record and limits](../launch/2026-10-22/NEXA-CLOUD-MAIL.md). Historical no-deploy notes above describe their earlier scope only.


## NEXA cloud Inbox PR43 published — 22 October 2026

[Cloud increment and remaining limits](../launch/2026-10-22/NEXA-CLOUD-MAIL.md): PR43 source `8bea79dfd3d57efb866f9f11485ad73043bcd549`, READY `dpl_8FawJhwpVkvQd23jwbk4CcYBbQCc`; existing-owner private metadata views and server-key Inbox binding passed. Same webhook ENABLED for `inbox.email.received` only. Sending OFF; no real email test, forwarding/delivery proof or automatic assistant wake. Dedicated upstream NEXA forwarding remains unverified. Original home/Studio/mail UI/master plan unchanged. No personal mailbox/DNS/MX changes.


## Immutable native Inbox reply corrective scope — 22 October 2026

The owner directs completion of independently fixable manual reply functionality within existing authorization. Replace mutable provider-draft ID sending with a native Inbox reply POST carrying the exact approved snapshot and immutable-original Reply-To binding. Standalone send has no established immutable Inbox contract and remains unsupported. No new permission request, actual send, wake runtime, DNS/personal forwarding or paid service. [Scope and affected proof](../launch/2026-10-22/NEXA-IMMUTABLE-REPLIES.md).

## D-2026-10-24 — Agent Builder positioning and preview-only content

Direct owner direction supersedes the bespoke implementation positioning: AGYNEXA is a shared Agent Builder Studio with user-specific configurations and private work. Apply the reviewed bilingual copy to all public pages and truthful account notices. Keep ten capability families and nine workflow routes; do not add runtime functions, connectors or billing. Hero wording and destination labels may change as part of the explicit complete-copy request; its layout and original video remain protected. Publish a preview only, with no main merge or production promotion. The historical market review remains intact; its bespoke RFQ-first offer is not the current product brief. Retain its evidence, reviewer and permission requirements. See the [preview implementation plan](../superpowers/plans/2026-10-24-agent-builder-content-preview.md).


## Global content rebuild and Preview authorization

Owner direction: one reusable global Agent Builder platform, English primary with independently authored Arabic; explain company processes, multi-agent responsibilities and human decisions. The earlier Preview is rejected. Full rewritten pages and ONE Preview are authorized; no production promotion. Ruling: retain meaningful technical mechanisms, remove irrelevant encoding/byte/date/infrastructure dumps and the rejected acquisition phrases. Provider categories and data flow remain disclosed in privacy, following the owner’s explicit request to remove public vendor names. Fresh review found no material blocker; three wording/navigation polish items corrected.


## Owner production authorization — 24 October 2026

Owner approved the replacement Arabic homepage and requested production publication plus alignment with the prior dedicated Studio design. Publish the global bilingual content Preview with this homepage and independently authored English equivalent. Preserve Studio behavior and layout; display wording alone changes. No automatic orchestration, enterprise integration, cloud provisioning or billing implementation is implied. [Release scope](releases/approved-home-production-2026-10-24/README.md).


## Security closeout and deferred Studio plan — 24 October 2026

Owner requested necessary security updates, bounded tests and complete documentation before starting a fresh Studio discussion. Apply the minimal Next16.4.1/body-parser2.4.0/fast-uri3.1.9 patches; preserve all first-party source, content and saved data. Do not implement Studio redesign/orchestration or resume HeronSignal installation. [Scope and evidence](releases/security-closeout-2026-10-24/README.md).


## D-2026-10-24 — Minimal HeronSignal browser installation

The owner explicitly requests the exact public browser snippet site-wide and end-to-end verification. Install only the global layout configuration plus async tracker; no SDK/backend/provider/dependency change. This supersedes the earlier Heron deferral only for this scope. Existing PR45/46 are left unchanged because their scope is broader. Verify official-origin acceptance separately from script loading; MCP is not currently connected. [Receipt](releases/heronsignal-sitewide-2026-10-24/README.md).
