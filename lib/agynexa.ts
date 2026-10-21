export type Copy = [string, string]
export const nav: [string,string,string][] = [['solutions','Solutions','الحلول'],['services','Services','الخدمات'],['architecture','Architecture','الهندسة'],['methodology','Methodology','المنهجية'],['integrations','Integrations','التكاملات'],['industries','Industries','القطاعات'],['resources','Resources','الموارد'],['about','About','من نحن'],['security','Security','الأمان']]
export const solutions = [
  {
    "slug": "knowledge",
    "name": [
      "Enterprise knowledge",
      "المعرفة المؤسسية"
    ],
    "audience": [
      "Knowledge and operations owners",
      "مسؤولو المعرفة والعمليات"
    ],
    "problem": [
      "Staff need an answer tied to the approved version of a company instruction. This is a proposed knowledge task to scope.",
      "يحتاج الموظف إجابة مرتبطة بالنسخة المعتمدة من تعليمات الشركة. هذه مهمة معرفية مقترحة لتحديد نطاقها."
    ],
    "input": [
      "Approved short policy text, the question and the responsible knowledge owner. Current Studio accepts pasted text or UTF-8 TXT/MD up to 12,000 bytes and 12,000 characters.",
      "نص سياسة قصير معتمد والسؤال ومسؤول المعرفة. يقبل Studio الحالي نصًا ملصقًا أو TXT/MD بترميز UTF-8 حتى 12,000 بايت و12,000 حرف."
    ],
    "flow": [
      "Review supplied facts → identify missing evidence → prepare a draft → owner decides",
      "مراجعة الحقائق المقدمة ← تحديد الأدلة الناقصة ← تجهيز مسودة ← قرار المسؤول"
    ],
    "output": [
      "An answer with original source excerpts, or a clear statement of the missing evidence. KnowledgeGrid is the bounded starting template.",
      "إجابة بمقتطفات المصدر الأصلية أو توضيح صريح للدليل الناقص. KnowledgeGrid هو قالب البداية المحدد."
    ],
    "accept": [
      "The knowledge owner checks the answer and source version. Word matching can miss relevant material; no semantic search or repository connection is included.",
      "يفحص مسؤول المعرفة الإجابة وإصدار المصدر. قد تفوت مطابقة الكلمات مادة ذات صلة؛ ولا يشمل النطاق بحثًا بالمعنى أو اتصالًا بمستودع."
    ]
  },
  {
    "slug": "documents",
    "name": [
      "Document operations",
      "عمليات المستندات"
    ],
    "audience": [
      "Operations staff reviewing forms and records",
      "موظفو العمليات الذين يراجعون النماذج والسجلات"
    ],
    "problem": [
      "A document reaches a reviewer with missing or ambiguous fields. This proposed task prepares the questions that must be resolved.",
      "يصل المستند إلى المراجع بحقول ناقصة أو ملتبسة. تجهز المهمة المقترحة الأسئلة التي يجب حسمها."
    ],
    "input": [
      "Manually supplied document text and an approved field checklist. PDF/OCR, image and spreadsheet extraction need separate implementation.",
      "نص مستند يقدمه المستخدم وقائمة حقول معتمدة. يحتاج استخراج PDF أو الصور أو جداول البيانات تنفيذًا مستقلًا."
    ],
    "flow": [
      "Review supplied facts → identify missing evidence → prepare a draft → owner decides",
      "مراجعة الحقائق المقدمة ← تحديد الأدلة الناقصة ← تجهيز مسودة ← قرار المسؤول"
    ],
    "output": [
      "A structured field draft and a list of missing details linked to the supplied text.",
      "مسودة حقول منظمة وقائمة تفاصيل ناقصة مرتبطة بالنص المقدم."
    ],
    "accept": [
      "The operations reviewer checks every value before use. No document authenticity check or automatic record creation is implied.",
      "يفحص مراجع العمليات كل قيمة قبل استخدامها. لا يشمل المثال التحقق من أصالة المستند أو إنشاء سجل تلقائيًا."
    ]
  },
  {
    "slug": "sales",
    "name": [
      "Sales enablement",
      "تمكين المبيعات"
    ],
    "audience": [
      "Sales owners preparing for an account conversation",
      "مسؤولو المبيعات الذين يستعدون لمحادثة مع عميل"
    ],
    "problem": [
      "Sales notes and product guidance need a clear brief that separates recorded facts from questions. This is a proposed preparation task.",
      "تحتاج ملاحظات المبيعات وإرشادات المنتجات موجزًا يميز الحقائق المسجلة عن الأسئلة. هذه مهمة مقترحة للتحضير."
    ],
    "input": [
      "Approved product text and non-sensitive account facts supplied manually. No live CRM access or external research is available in Studio.",
      "نص منتجات معتمد وحقائق حساب غير حساسة يقدمها المستخدم يدويًا. لا يتيح Studio وصولًا حيًا إلى CRM أو بحثًا خارجيًا."
    ],
    "flow": [
      "Review supplied facts → identify missing evidence → prepare a draft → owner decides",
      "مراجعة الحقائق المقدمة ← تحديد الأدلة الناقصة ← تجهيز مسودة ← قرار المسؤول"
    ],
    "output": [
      "A draft account brief with supplied facts, source references where available and questions to verify.",
      "مسودة موجز عميل بالحقائق المقدمة والمراجع عند توفرها والأسئلة المطلوب التحقق منها."
    ],
    "accept": [
      "The sales owner validates account facts, pricing and any message. The assistant does not infer purchase intent or contact a prospect.",
      "يتحقق مسؤول المبيعات من حقائق الحساب والأسعار وأي رسالة. لا يستنتج المساعد نية شراء أو يتواصل مع عميل محتمل."
    ]
  },
  {
    "slug": "service",
    "name": [
      "Customer service",
      "خدمة العملاء"
    ],
    "audience": [
      "Support leads and staff handling repeat questions",
      "مسؤولو الدعم والموظفون الذين يعالجون أسئلة متكررة"
    ],
    "problem": [
      "A recurring service request needs a policy-based reply and a clear handoff when the case is unclear. This is a proposed support task.",
      "يحتاج طلب الخدمة المتكرر ردًا يستند إلى السياسة وإحالة واضحة عندما تكون الحالة غير محسومة. هذه مهمة دعم مقترحة."
    ],
    "input": [
      "Approved service policy and a synthetic or non-sensitive request description.",
      "سياسة خدمة معتمدة ووصف طلب افتراضي أو غير حساس."
    ],
    "flow": [
      "Review supplied facts → identify missing evidence → prepare a draft → owner decides",
      "مراجعة الحقائق المقدمة ← تحديد الأدلة الناقصة ← تجهيز مسودة ← قرار المسؤول"
    ],
    "output": [
      "A cited response draft and a handoff brief with missing facts. ServiceFlow can prepare an exact internal request for owner review.",
      "مسودة رد بمراجعها وموجز إحالة بالحقائق الناقصة. يمكن لـServiceFlow تجهيز طلب داخلي محدد يراجعه المالك."
    ],
    "accept": [
      "The support owner checks policy and sends any customer reply manually. Internal approval is not external delivery or a completed service.",
      "يفحص مسؤول الدعم السياسة ويرسل أي رد للعميل يدويًا. الاعتماد الداخلي ليس تسليمًا خارجيًا أو خدمة مكتملة."
    ]
  },
  {
    "slug": "finance",
    "name": [
      "Finance operations",
      "العمليات المالية"
    ],
    "audience": [
      "Accounts-payable and finance reviewers",
      "مراجعو الحسابات الدائنة والمالية"
    ],
    "problem": [
      "An invoice and purchase record show different dates, values or references. This proposed task explains the visible differences for review.",
      "تختلف تواريخ أو قيم أو مراجع فاتورة وسجل شراء. تشرح المهمة المقترحة الفروق الظاهرة للمراجعة."
    ],
    "input": [
      "Synthetic invoice and order text, field definitions, currency and approved comparison rules. No finance-system connection.",
      "نص فاتورة وطلب افتراضي وتعريفات الحقول والعملة وقواعد مقارنة معتمدة. لا اتصال بنظام مالي."
    ],
    "flow": [
      "Review supplied facts → identify missing evidence → prepare a draft → owner decides",
      "مراجعة الحقائق المقدمة ← تحديد الأدلة الناقصة ← تجهيز مسودة ← قرار المسؤول"
    ],
    "output": [
      "A review brief listing each difference and its supplied record reference, with unknowns left visible.",
      "موجز مراجعة بكل فرق ومرجع سجله المقدم، مع إظهار المعلومات المجهولة."
    ],
    "accept": [
      "Finance staff verify figures and accounting treatment. This is not a payment, tax calculation or approval to change financial records.",
      "يتحقق موظفو المالية من الأرقام والمعالجة المحاسبية. ليس هذا دفعًا أو حساب ضريبة أو اعتمادًا لتغيير سجلات مالية."
    ]
  },
  {
    "slug": "logistics",
    "name": [
      "Logistics coordination",
      "تنسيق اللوجستيات"
    ],
    "audience": [
      "Dispatch and shipment operations owners",
      "مسؤولو الإرسال وعمليات الشحن"
    ],
    "problem": [
      "A shipment note lacks the update needed for a customer commitment. This proposed task prepares an exception chronology.",
      "تخلو ملاحظة الشحنة من تحديث يلزم قبل الالتزام للعميل. تجهز المهمة المقترحة تسلسلًا زمنيًا للاستثناء."
    ],
    "input": [
      "Manually supplied shipment milestones, dates and an approved service checklist. Current Studio has no live carrier or customs access.",
      "مراحل شحن وتواريخ يقدمها المستخدم وقائمة خدمة معتمدة. لا يتيح Studio الحالي وصولًا حيًا إلى ناقل أو جمارك."
    ],
    "flow": [
      "Review supplied facts → identify missing evidence → prepare a draft → owner decides",
      "مراجعة الحقائق المقدمة ← تحديد الأدلة الناقصة ← تجهيز مسودة ← قرار المسؤول"
    ],
    "output": [
      "A dated exception brief with known updates, missing information and questions for the operations owner.",
      "موجز استثناء مؤرخ بالتحديثات المتاحة والمعلومات الناقصة والأسئلة لمسؤول العمليات."
    ],
    "accept": [
      "The operations owner verifies current status and approves commitments. No tracking lookup, filing, delivery promise or carrier message is executed.",
      "يتحقق مسؤول العمليات من الحالة الحالية ويعتمد الالتزامات. لا يُنفذ استعلام تتبع أو تقديم رسمي أو وعد تسليم أو رسالة للناقل."
    ]
  },
  {
    "slug": "procurement",
    "name": [
      "Procurement operations",
      "عمليات المشتريات"
    ],
    "audience": [
      "Purchasing owners comparing a proposed purchase",
      "مسؤولو المشتريات الذين يقارنون شراءً مقترحًا"
    ],
    "problem": [
      "A quote can appear cheaper while its warranty or budget fit is unresolved. This proposed purchase-review task keeps those gaps visible.",
      "قد يبدو العرض أقل سعرًا مع بقاء الضمان أو ملاءمة الميزانية غير محسومين. تُظهر مهمة مراجعة الشراء المقترحة هذه النواقص."
    ],
    "input": [
      "A purchase request, supplied quote terms and approved budget rules. The interactive example below uses fictional supplier values, not live quotes.",
      "طلب شراء وشروط عروض يقدمها المستخدم وقواعد ميزانية معتمدة. يستخدم المثال التفاعلي التالي قيم موردين افتراضية لا عروضًا حية."
    ],
    "flow": [
      "Review supplied facts → identify missing evidence → prepare a draft → owner decides",
      "مراجعة الحقائق المقدمة ← تحديد الأدلة الناقصة ← تجهيز مسودة ← قرار المسؤول"
    ],
    "output": [
      "A comparison and missing-information checklist for an authorized buyer. The example calculates its entered assumptions without creating an order.",
      "مقارنة وقائمة معلومات ناقصة لمشترٍ مخوّل. يحسب المثال الافتراضات المدخلة دون إنشاء أمر شراء."
    ],
    "accept": [
      "The buyer verifies supplier evidence, warranty and totals and decides separately. A downloaded review is not authorization or a purchase receipt.",
      "يتحقق المشتري من أدلة المورد والضمان والإجماليات ويتخذ القرار بصورة مستقلة. المراجعة المنزلة ليست تفويضًا أو إيصال شراء."
    ]
  },
  {
    "slug": "receivables",
    "name": [
      "Receivables and collection follow-up",
      "المستحقات ومتابعة التحصيل"
    ],
    "audience": [
      "Finance owners reviewing overdue balances",
      "مسؤولو المالية الذين يراجعون الأرصدة المتأخرة"
    ],
    "problem": [
      "A balance needs checking against recorded payments and disputes before follow-up. This is a proposed review task.",
      "يحتاج الرصيد مراجعة السداد والمنازعات المسجلة قبل المتابعة. هذه مهمة مراجعة مقترحة."
    ],
    "input": [
      "Synthetic invoice, payment and dispute notes with an approved follow-up policy. No live ledger or payment lookup.",
      "ملاحظات فواتير وسداد ومنازعات افتراضية وسياسة متابعة معتمدة. لا استعلام حي عن دفتر أستاذ أو دفع."
    ],
    "flow": [
      "Review supplied facts → identify missing evidence → prepare a draft → owner decides",
      "مراجعة الحقائق المقدمة ← تحديد الأدلة الناقصة ← تجهيز مسودة ← قرار المسؤول"
    ],
    "output": [
      "A draft aging and dispute brief with source references and questions to resolve before contact.",
      "مسودة موجز لأعمار المستحقات والمنازعات بمراجعها وأسئلة تُحسم قبل التواصل."
    ],
    "accept": [
      "Finance staff verify balances and approve any message, write-off or collection step. No communication or financial change occurs in Studio.",
      "يتحقق موظفو المالية من الأرصدة ويعتمدون أي رسالة أو شطب أو خطوة تحصيل. لا يحدث تواصل أو تغيير مالي داخل Studio."
    ]
  },
  {
    "slug": "customer-operations",
    "name": [
      "Customer operations",
      "عمليات العملاء"
    ],
    "audience": [
      "Customer operations owners triaging an issue",
      "مسؤولو عمليات العملاء الذين يفرزون مشكلة"
    ],
    "problem": [
      "An enquiry, change request and complaint need different next steps. This proposed task prepares the context for a responsible person.",
      "يحتاج الاستفسار وطلب التغيير والشكوى خطوات تالية مختلفة. تجهز المهمة المقترحة السياق لشخص مسؤول."
    ],
    "input": [
      "A non-sensitive request, manually supplied order reference and approved routing procedure.",
      "طلب غير حساس ومرجع طلب يقدمه المستخدم يدويًا وإجراء توجيه معتمد."
    ],
    "flow": [
      "Review supplied facts → identify missing evidence → prepare a draft → owner decides",
      "مراجعة الحقائق المقدمة ← تحديد الأدلة الناقصة ← تجهيز مسودة ← قرار المسؤول"
    ],
    "output": [
      "A request summary, missing-information question and proposed handoff owner. An internal request can be reviewed in ServiceFlow.",
      "ملخص طلب وسؤال عن المعلومة الناقصة ومسؤول إحالة مقترح. يمكن مراجعة طلب داخلي في ServiceFlow."
    ],
    "accept": [
      "The operations owner checks facts, identity needs and any commitment. No account lookup, refund, schedule change or external notification is performed.",
      "يفحص مسؤول العمليات الحقائق ومتطلبات الهوية وأي التزام. لا يُنفذ استعلام حساب أو رد أموال أو تغيير موعد أو إشعار خارجي."
    ]
  }
] as const
export const headings: Record<string, Copy> = {
 security:['Control access. Explain every action.','اضبط الوصول. ووثّق كل إجراء.'],contact:['Tell us about your workflow.','حدّثنا عن سير عملك.'],services:['Build an agent system around your business problem.','نصمّم نظام الوكلاء حول مشكلة عملك.'], architecture:['Knowledge. Tools. Decisions. Bound together.','المعرفة والأدوات والقرارات، ضمن نظام واحد.'],methodology:['Clear scope. Evidence at every step.','نطاق واضح. وأدلة في كل خطوة.'],integrations:['Connect deliberately. Control every permission.','اربط بعناية. واضبط كل صلاحية.'],industries:['Built around how your organization works.','أنظمة تنطلق من طريقة عمل مؤسستك.'],resources:['Practical notes for better system decisions.','أدلة عملية لقرارات تقنية أفضل.'],about:['Engineering agents with clear boundaries.','هندسة الوكلاء بحدود واضحة.'],solutions:['Real problems. Defined outputs.','مشكلات حقيقية. ومخرجات محددة.'],start:['Start with the problem worth solving.','ابدأ بالمشكلة التي تستحق الحل.'],agentnexos:['A workspace for accountable agent tasks.','مساحة لمهام وكلاء قابلة للمراجعة.']}
export const summary: Copy = ['AGYNEXA designs and develops enterprise agent systems that connect knowledge, tools and decisions, with explicit permissions and acceptance criteria.','تصمّم AGYNEXA وتطوّر أنظمة وكلاء للمؤسسات تربط المعرفة والأدوات والقرارات بصلاحيات ومعايير قبول واضحة.']
