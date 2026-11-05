export const platformFaq = [
  {
    question: ['What can I build in AGYNEXA?', 'ما الذي يمكنني بناؤه في AGYNEXA؟'],
    answer: ['Build a private agent for a defined business responsibility. Set its instructions, add relevant company knowledge and test its responses. Optional web search and code analysis help with research and calculations. Connecting the agent to a business system requires a separately configured connection and permission.', 'يمكنك بناء وكيل خاص لمسؤولية محددة في العمل، وضبط تعليماته وإضافة معرفة الشركة واختبار استجاباته. يساعد البحث على الويب وتحليل البيانات بالكود عند تفعيلهما. أما استخدام أنظمة الشركة فيحتاج إلى ربط وصلاحيات تُجهّز لكل نظام.'],
  },
  {
    question: ['How do I move from testing to production?', 'كيف أنتقل من التجربة إلى التشغيل الفعلي؟'],
    answer: ['Test your agent on representative tasks, review its outputs and note the connections it will need. Then email adham@agynexa.si with the agent and intended scope. Pricing, payment arrangements, operating terms and activation are agreed by email. A test conversation does not activate a production service.', 'جرّب الوكيل على مهام ممثلة للعمل، وراجع مخرجاته وحدد الاتصالات التي سيحتاجها. ثم راسل adham@agynexa.si باسم الوكيل ونطاق التشغيل المطلوب. يجري الاتفاق على السعر وطريقة الدفع والشروط والتفعيل عبر البريد، ولا تؤدي محادثة التجربة وحدها إلى تشغيل خدمة إنتاجية.'],
  },
  {
    question: ['Does my ChatGPT subscription cover the agent?', 'هل يغطي اشتراك ChatGPT تشغيل الوكيل؟'],
    answer: ['Studio uses the OpenAI connection configured for the platform. Using a customer’s ChatGPT plan requires a supported and authorized OpenAI integration, with account eligibility and usage limits checked separately. A ChatGPT subscription does not automatically pay for every API request or activate an AGYNEXA production agent.', 'يستخدم الاستوديو اتصال OpenAI المجهّز للمنصة. ويتطلب استخدام خطة ChatGPT الخاصة بالعميل تكاملًا مدعومًا ومصرحًا به، مع التحقق من أهلية الحساب وحدود الاستخدام. لا يغطي الاشتراك تلقائيًا كل طلبات API، ولا يفعّل وكيل AGYNEXA الإنتاجي تلقائيًا.'],
  },
  {
    question: ['Can an agent send messages or change company records?', 'هل يستطيع الوكيل إرسال رسائل أو تعديل سجلات الشركة؟'],
    answer: ['Only when the exact operation has an available connection, the required permission and the agreed approval controls. Preparing a draft or recommendation is separate from sending it or updating a system. The workflow must record the confirmed result of an external action.', 'عندما يتوفر اتصال يدعم الإجراء المحدد وصلاحية تسمح به وضوابط الاعتماد المتفق عليها. إعداد مسودة أو توصية يختلف عن إرسالها أو تعديل سجل، ويحتاج سير العمل إلى تأكيد من النظام المعني بأن الإجراء نجح.'],
  },
]

export const activationEmail = 'mailto:adham@agynexa.si?subject=AGYNEXA%20agent%20production%20activation'

export const workflowExamples = [
  {slug:'knowledge', name:['Company knowledge','معرفة الشركة'], input:['A question about an internal policy','سؤال عن سياسة داخلية'], result:['A source-backed answer with unresolved points','إجابة بمراجع توضح النقاط غير المحسومة'], review:['Check the applicable policy and its version.','راجع السياسة المنطبقة ونسختها.']},
  {slug:'documents', name:['Document review','مراجعة المستندات'], input:['A document and the facts you need to extract','مستند والحقائق المطلوب استخلاصها'], result:['A structured brief with missing information','موجز منظم والمعلومات التي تحتاج إلى استكمال'], review:['Compare extracted facts with the original.','طابق الحقائق المستخرجة مع الأصل.']},
  {slug:'sales', name:['Sales operations','عمليات المبيعات'], input:['An enquiry and approved offer information','استفسار عميل ومعلومات العرض المعتمدة'], result:['A qualification brief and proposed next step','موجز لتأهيل الفرصة والخطوة التالية'], review:['Confirm the promises before a proposal is sent.','اعتمد الالتزامات قبل إرسال العرض.']},
  {slug:'service', name:['Customer service','خدمة العملاء'], input:['A customer issue and the service policy','مشكلة عميل وسياسة الخدمة'], result:['A response draft or a prepared escalation','مسودة رد أو ملف تصعيد مكتمل'], review:['Keep refunds and commitments with their owner.','اترك رد المبالغ والالتزامات للمسؤول المخوّل.']},
  {slug:'finance', name:['Finance operations','العمليات المالية'], input:['Financial records and matching rules','سجلات مالية وقواعد المطابقة'], result:['A discrepancy analysis with supporting records','تحليل للفروق والسجلات التي يستند إليها'], review:['Verify calculations before accounting action.','تحقق من الحسابات قبل المعالجة المحاسبية.']},
  {slug:'logistics', name:['Logistics','اللوجستيات'], input:['Shipment milestones and an exception','مراحل شحنة وحالة استثنائية'], result:['An exception brief and coordination options','موجز للاستثناء وخيارات التنسيق'], review:['Confirm live status with the transport system.','أكد الحالة الحية من نظام النقل.']},
  {slug:'procurement', name:['Procurement','المشتريات'], input:['Supplier offers and the purchasing requirement','عروض الموردين ومتطلبات الشراء'], result:['A comparison with differences and missing terms','مقارنة توضح الفروق والشروط الناقصة'], review:['A buyer approves price, specification and award.','يعتمد مسؤول الشراء السعر والمواصفات والترسية.']},
  {slug:'receivables', name:['Receivables','المستحقات'], input:['Approved balances and the account history','أرصدة معتمدة وتاريخ الحساب'], result:['A follow-up plan and contextual message drafts','خطة متابعة ومسودات تناسب موقف الحساب'], review:['Confirm disputes and authority before contact.','راجع النزاعات والصلاحية قبل التواصل.']},
  {slug:'customer-operations', name:['Customer operations','عمليات العملاء'], input:['An account request across several teams','طلب يخص العميل ويمر بأكثر من فريق'], result:['A handover brief with a clear next owner','ملف تسليم يحدد المسؤول عن الخطوة التالية'], review:['Check that the receiving team can continue.','تأكد من قدرة الفريق المستلم على الاستكمال.']},
] as const

export const capabilityScope:Record<string,{now:readonly string[];production:readonly string[]}> = {
  'customer-service': {now:['Test policy-grounded responses and escalation drafts.','اختبر الردود المستندة إلى السياسة ومسودات التصعيد.'],production:['Customer channels and case updates need a configured connection.','تحتاج قنوات العملاء وتحديث الحالات إلى اتصال مجهّز.']},
  'employee-operations': {now:['Prepare answers and request checklists from approved procedures.','جهّز الإجابات وقوائم متطلبات الطلب من الإجراءات المعتمدة.'],production:['HR and IT actions require the relevant system permissions.','تحتاج إجراءات الموارد البشرية والدعم التقني إلى صلاحيات الأنظمة المعنية.']},
  'process-automation': {now:['Define the task, test the reasoning and inspect the proposed output.','حدّد المهمة واختبر الاستدلال وافحص المخرج المقترح.'],production:['Triggers and system writes are scoped before activation.','تُحدد محفزات التشغيل وتعديلات الأنظمة قبل التفعيل.']},
  'enterprise-knowledge': {now:['Use private text and Markdown sources in agent conversations.','استخدم مصادر نصية وMarkdown خاصة في محادثات الوكيل.'],production:['Live document repositories need their own access and update rules.','تحتاج مستودعات المستندات الحية إلى قواعد وصول وتحديث خاصة بها.']},
  'agent-orchestration': {now:['Create distinct agent roles and evaluate each responsibility.','أنشئ أدوارًا مختلفة للوكلاء وقيّم كل مسؤولية.'],production:['Automatic handoffs between agents require a separate execution workflow.','يتطلب الانتقال التلقائي بين الوكلاء سير تنفيذ مستقلًا.']},
  'enterprise-integrations': {now:['Define which records and operations the agent needs.','حدّد السجلات والعمليات التي يحتاجها الوكيل.'],production:['Each external system is connected and verified for the agreed scope.','يُجهّز كل نظام خارجي ويُتحقق منه وفق النطاق المتفق عليه.']},
  'voice-agents': {now:['Design conversation instructions and test their text responses.','صمّم تعليمات الحوار واختبر استجاباتها نصيًا.'],production:['Telephony, voice runtime and customer channels require a separate setup.','تحتاج الاتصالات الهاتفية والتشغيل الصوتي وقنوات العملاء إلى إعداد مستقل.']},
  'agent-assist': {now:['Prepare research, summaries and response drafts for a person to review.','جهّز الأبحاث والملخصات ومسودات الرد لمراجعة الموظف.'],production:['Embedding assistance inside a team tool depends on its supported interface.','يعتمد دمج المساعد داخل أدوات الفريق على الواجهة التي تدعمها.']},
  'governance-security': {now:['Set the agent’s scope and inspect private run history.','اضبط نطاق الوكيل وراجع سجل التشغيل الخاص.'],production:['Agree the reviewers, data permissions and operational responsibilities.','اتفق على المراجعين وصلاحيات البيانات ومسؤوليات التشغيل.']},
  'evaluation-observability': {now:['Compare responses with representative tasks and review activity.','قارن الاستجابات بمهام ممثلة وراجع النشاط.'],production:['Agree acceptance criteria and monitoring for the activated workflow.','اتفق على معايير القبول والمتابعة لسير العمل المفعّل.']},
}
