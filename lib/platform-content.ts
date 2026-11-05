export const platformFaq = [
  {
    question: ['What can I use an agent for?', 'في أي مهام أستطيع استخدام الوكيل؟'],
    answer: ['Start with a task such as comparing supplier offers, drafting a customer reply or answering questions from company policies. Add your instructions and sources, then test the result in Studio. You can enable web research and Python when the task needs them.', 'يمكنك البدء بمقارنة عروض الموردين، أو صياغة رد على عميل، أو الإجابة عن أسئلة من سياسات الشركة. أضف التعليمات والمراجع ثم جرّب النتيجة في الاستوديو. ويمكنك تفعيل البحث وPython إذا احتاجت المهمة إليهما.'],
  },
  {
    question: ['How do I activate an agent for production?', 'كيف أطلب تشغيل الوكيل فعليًا؟'],
    answer: ['Test the agent on examples you can check, then email adham@agynexa.si with its name and intended use. We agree the price, payment and operating terms by email. Production requires your own OpenAI API key and activation by AGYNEXA.', 'اختبر الوكيل على أمثلة تستطيع مراجعتها، ثم راسل adham@agynexa.si باسمه والاستخدام المطلوب. نتفق عبر البريد على السعر والدفع وشروط التشغيل. وتحتاج إلى مفتاح OpenAI API الخاص بك وتفعيل من AGYNEXA.'],
  },
  {
    question: ['Can I use my ChatGPT subscription?', 'هل يمكنني استخدام اشتراك ChatGPT؟'],
    answer: ['AGYNEXA currently uses the OpenAI API. Tests use the platform connection by default; once you connect your API key, tests use that connection. Production requires a customer API key. ChatGPT subscription billing is not available in AGYNEXA.', 'يعمل AGYNEXA حاليًا من خلال OpenAI API. تستخدم التجارب اتصال المنصة افتراضيًا، وتستخدم مفتاحك إذا أضفته. ويتطلب التشغيل الفعلي مفتاح API خاصًا بالعميل. لا تتوفر حاليًا إمكانية احتساب التشغيل على اشتراك ChatGPT.'],
  },
  {
    question: ['Can the agent send emails or update our CRM?', 'هل يرسل الوكيل رسائل أو يعدّل بيانات CRM؟'],
    answer: ['The current Studio prepares answers, drafts, analyses and files. Sending messages or changing records in another system requires a separate integration, permissions and operating agreement. Tell us the system and action you need when discussing activation.', 'يجهّز الاستوديو الحالي إجابات ومسودات وتحليلات وملفات. أما إرسال الرسائل أو تعديل سجلات نظام آخر فيحتاج إلى ربط مستقل وصلاحيات واتفاق على التشغيل. اذكر النظام والإجراء المطلوب عند مناقشة التفعيل.'],
  },
]

export const activationEmail = 'mailto:adham@agynexa.si?subject=AGYNEXA%20agent%20production%20activation'

export const workflowExamples = [
  {slug:'knowledge', name:['Company knowledge','معرفة الشركة'], input:['A question about an internal policy','سؤال عن سياسة داخلية'], result:['An answer with source references and missing information','إجابة بمراجعها والمعلومات التي تحتاج إلى استكمال'], review:['Check the applicable policy and its version.','راجع السياسة المنطبقة ونسختها.']},
  {slug:'documents', name:['Document review','مراجعة المستندات'], input:['A document and the facts you need to extract','مستند والحقائق المطلوب استخلاصها'], result:['A summary of the requested facts and any gaps','ملخص بالبيانات المطلوبة وما ينقصها'], review:['Compare extracted facts with the original.','طابق الحقائق المستخرجة مع الأصل.']},
  {slug:'sales', name:['Sales operations','عمليات المبيعات'], input:['An enquiry and approved offer information','استفسار عميل ومعلومات العرض المعتمدة'], result:['A summary of the customer’s needs and a proposed next step','ملخص لاحتياج العميل وخطوة تالية مقترحة'], review:['Confirm the promises before a proposal is sent.','اعتمد الالتزامات قبل إرسال العرض.']},
  {slug:'service', name:['Customer service','خدمة العملاء'], input:['A customer issue and the service policy','مشكلة عميل وسياسة الخدمة'], result:['A reply draft or a case summary for a specialist','مسودة رد أو ملخص للحالة يراجعه المختص'], review:['Keep refunds and commitments with their owner.','اترك رد المبالغ والالتزامات للمسؤول المخوّل.']},
  {slug:'finance', name:['Finance operations','العمليات المالية'], input:['Financial records and matching rules','سجلات مالية وقواعد المطابقة'], result:['A discrepancy analysis with supporting records','تحليل للفروق والسجلات التي يستند إليها'], review:['Verify calculations before accounting action.','تحقق من الحسابات قبل المعالجة المحاسبية.']},
  {slug:'logistics', name:['Logistics','اللوجستيات'], input:['Shipment milestones and an exception','تحديثات شحنة ومشكلة في التسليم'], result:['A summary of the delay and follow-up options','ملخص للمشكلة وخيارات المتابعة'], review:['Check the current status with the carrier.','تحقق من الحالة الحالية لدى شركة الشحن.']},
  {slug:'procurement', name:['Procurement','المشتريات'], input:['Supplier offers and the purchasing requirement','عروض الموردين ومتطلبات الشراء'], result:['A comparison with differences and missing terms','مقارنة توضح الفروق والشروط الناقصة'], review:['A buyer approves price, specification and award.','يعتمد مسؤول الشراء السعر والمواصفات والترسية.']},
  {slug:'receivables', name:['Receivables','المستحقات'], input:['Approved balances and the account history','أرصدة معتمدة وتاريخ الحساب'], result:['A follow-up plan and contextual message drafts','خطة متابعة ومسودات تناسب موقف الحساب'], review:['Confirm disputes and authority before contact.','راجع النزاعات والصلاحية قبل التواصل.']},
  {slug:'customer-operations', name:['Customer operations','عمليات العملاء'], input:['An account request across several teams','طلب يخص العميل ويمر بأكثر من فريق'], result:['A handover summary naming the next person responsible','ملخص تسليم يحدد المسؤول عن الخطوة التالية'], review:['Check that the receiving team can continue.','تأكد من قدرة الفريق المستلم على الاستكمال.']},
] as const

export const capabilityScope:Record<string,{now:readonly string[];production:readonly string[]}> = {
  'customer-service': {now:['Test policy-grounded responses and escalation drafts.','اختبر الردود المستندة إلى السياسة ومسودات التصعيد.'],production:['Customer channels and case updates need a configured connection.','تحتاج قنوات العملاء وتحديث الحالات إلى اتصال مجهّز.']},
  'employee-operations': {now:['Prepare answers and request checklists from approved procedures.','جهّز الإجابات وقوائم متطلبات الطلب من الإجراءات المعتمدة.'],production:['HR and IT actions require the relevant system permissions.','تحتاج إجراءات الموارد البشرية والدعم التقني إلى صلاحيات الأنظمة المعنية.']},
  'process-automation': {now:['Test how the agent organizes a request and prepares the next step.','اختبر كيف ينظم الوكيل الطلب ويجهز الخطوة التالية.'],production:['Automatic triggers and system updates need additional implementation.','يحتاج التشغيل التلقائي وتعديل الأنظمة إلى تنفيذ إضافي.']},
  'enterprise-knowledge': {now:['Use company sources in private agent conversations.','استخدم مراجع شركتك داخل محادثات خاصة مع الوكيل.'],production:['Live document repositories need their own access and update rules.','تحتاج مستودعات المستندات الحية إلى قواعد وصول وتحديث خاصة بها.']},
  'agent-orchestration': {now:['Create separate agents and test each task individually.','أنشئ وكلاء مستقلين واختبر مهمة كل منهم.'],production:['Automatic handovers between agents are not included in Studio.','الانتقال التلقائي بين الوكلاء غير متاح داخل الاستوديو.']},
  'enterprise-integrations': {now:['Define which records and operations the agent needs.','حدّد السجلات والعمليات التي يحتاجها الوكيل.'],production:['A connection must be assessed, implemented and tested for the required operation.','يحتاج الربط إلى تقييم وتنفيذ واختبار للإجراء المطلوب.']},
  'voice-agents': {now:['Design conversation instructions and test their text responses.','صمّم تعليمات الحوار واختبر استجاباتها نصيًا.'],production:['Telephony, voice runtime and customer channels require a separate setup.','تحتاج الاتصالات الهاتفية والتشغيل الصوتي وقنوات العملاء إلى إعداد مستقل.']},
  'agent-assist': {now:['Prepare research, summaries and response drafts for a person to review.','جهّز الأبحاث والملخصات ومسودات الرد لمراجعة الموظف.'],production:['Embedding assistance inside a team tool depends on its supported interface.','يعتمد دمج المساعد داخل أدوات الفريق على الواجهة التي تدعمها.']},
  'governance-security': {now:['Set the agent’s instructions and review saved conversations and tool activity.','اضبط تعليمات الوكيل وراجع المحادثات المحفوظة ونشاط الأدوات.'],production:['Agree the reviewers, data permissions and operational responsibilities.','اتفق على المراجعين وصلاحيات البيانات ومسؤوليات التشغيل.']},
  'evaluation-observability': {now:['Compare responses with representative tasks and review activity.','قارن الاستجابات بمهام ممثلة وراجع النشاط.'],production:['Agree acceptance criteria and monitoring for the activated workflow.','اتفق على معايير القبول والمتابعة لسير العمل المفعّل.']},
}
