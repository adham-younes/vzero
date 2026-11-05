export type Copy = [string, string]
export const nav: [string,string,string][] = [['solutions','Solutions','الحلول'],['services','Capabilities','القدرات'],['architecture','Architecture','البنية'],['methodology','How to build','طريقة البناء'],['integrations','Integrations','التكاملات'],['industries','Industries','القطاعات'],['resources','Resources','الموارد'],['about','About','من نحن'],['security','Security','الأمان']]
export const solutions = [
  {
    "slug": "knowledge",
    "name": [
      "Company knowledge",
      "المعرفة المؤسسية"
    ],
    "audience": [
      "Knowledge owners, service teams and employees",
      "مسؤولو المعرفة وفرق الخدمة والموظفون"
    ],
    "problem": [
      "Operational answers depend on company information spread across procedures, agreements and recorded exceptions.",
      "تعتمد إجابة الموظف على معلومات موزعة بين الإجراءات والاتفاقيات والاستثناءات المسجلة."
    ],
    "input": [
      "The question, its business context and the approved company material relevant to it.",
      "السؤال وسياق الحالة والمادة المعرفية المعتمدة التي تتصل بها."
    ],
    "flow": [
      "Locate the applicable material, interpret it for the case and retain the source. Route conflicting or unanswered points to the knowledge owner.",
      "الوصول إلى المادة المناسبة وتفسيرها في سياق الحالة مع الاحتفاظ بمرجعها، وإحالة التعارض أو الغموض إلى مسؤول المعرفة."
    ],
    "output": [
      "An answer with relevant sources, open questions and a clear route to the knowledge owner.",
      "إجابة بمصادر مرتبطة وأسئلة مفتوحة ومسار واضح إلى مسؤول المعرفة."
    ],
    "accept": [
      "Evaluate case relevance, source support and the correction required, using ordinary questions and genuine exceptions.",
      "تقييم انطباق الإجابة وسلامة الاستشهاد وحجم التصحيح المطلوب، على أسئلة معتادة وحالات استثنائية فعلية."
    ]
  },
  {
    "slug": "documents",
    "name": [
      "Business document workflows",
      "مسارات مستندات الأعمال"
    ],
    "audience": [
      "Operations teams, project owners and document reviewers",
      "فرق العمليات ومسؤولو المشاريع ومراجعو المستندات"
    ],
    "problem": [
      "Documents arrive in different forms and revisions, while the next task depends on knowing which facts are reliable and which issues remain open.",
      "تصل المستندات في صور ونسخ مختلفة، وتعتمد الخطوة التالية على تحديد المعلومات الموثوقة والمسائل التي لم تُحسم."
    ],
    "input": [
      "Document content, the case or project context, required information and the rules for resolving revisions or conflicts.",
      "محتوى المستند وسياق الحالة أو المشروع والمعلومات المطلوبة وقواعد التعامل مع التعديلات والتعارض."
    ],
    "flow": [
      "Identify the document, extract the relevant facts, compare them with process requirements and send unresolved issues to the responsible person.",
      "تحديد المستند واستخلاص حقائقه ومقارنتها بمتطلبات العملية وإحالة المسائل المفتوحة إلى المسؤول المختص."
    ],
    "output": [
      "A structured document brief with extracted facts, source references and missing information.",
      "موجز منظم للمستند بالحقائق المستخلصة ومراجعها والمعلومات الناقصة."
    ],
    "accept": [
      "Check factual accuracy, version handling, exception ownership and the receiving team’s ability to continue the work.",
      "مراجعة دقة الحقائق والتعامل مع النسخ ومسؤولية الاستثناءات وقدرة الفريق المستلم على استكمال العمل."
    ]
  },
  {
    "slug": "sales",
    "name": [
      "Sales operations",
      "عمليات المبيعات"
    ],
    "audience": [
      "Sales owners, product specialists and delivery teams",
      "مسؤولو المبيعات ومختصو المنتج وفرق التسليم"
    ],
    "problem": [
      "Customer requirements lose context as an opportunity moves between discovery, technical assessment and commercial preparation.",
      "تفقد متطلبات العميل بعض سياقها عند انتقال الفرصة بين فهم الاحتياج والتقييم الفني وإعداد العرض التجاري."
    ],
    "input": [
      "The customer inquiry, discovery notes, approved offer information and the facts needed to assess fit.",
      "استفسار العميل ونتائج الاجتماعات ومعلومات العرض المعتمدة والحقائق اللازمة لتقييم الملاءمة."
    ],
    "flow": [
      "Clarify the need, assess it against the offer, resolve delivery questions and prepare the next sales step for the responsible owner.",
      "توضيح الاحتياج وتقييمه أمام العرض المتاح وحسم متطلبات التسليم ثم تجهيز الخطوة التالية لمسؤول الفرصة."
    ],
    "output": [
      "A qualification brief or proposal draft with assumptions and a proposed next step for the sales owner.",
      "موجز لتأهيل الفرصة أو مسودة عرض، بافتراضات وخطوة تالية مقترحة لمسؤول المبيعات."
    ],
    "accept": [
      "Review requirement accuracy, the basis of commercial promises and the quality of handovers between sales and delivery.",
      "مراجعة دقة المتطلبات وأساس الالتزامات التجارية وجودة انتقال المعلومات بين المبيعات والتسليم."
    ]
  },
  {
    "slug": "service",
    "name": [
      "Customer service workflows",
      "مسارات خدمة العملاء"
    ],
    "audience": [
      "Service teams, support specialists and service owners",
      "فرق خدمة العملاء والمختصون ومسؤولو الخدمة"
    ],
    "problem": [
      "Customer issues stall when guidance, operational ownership and case history are separated.",
      "تتعطل مشكلات العملاء عندما تنفصل الإرشادات عن الفريق المسؤول وتاريخ الحالة."
    ],
    "input": [
      "The customer’s issue, relevant case history, approved service guidance and the information required for the next step.",
      "مشكلة العميل وتاريخ الحالة والإرشادات المعتمدة والمعلومات المطلوبة للخطوة التالية."
    ],
    "flow": [
      "Understand the issue, apply the relevant guidance and coordinate resolution or an accepted escalation with its context intact.",
      "فهم المشكلة وتطبيق الإرشاد المناسب، ثم تنسيق الحل أو التصعيد إلى مسؤول يقبل الحالة مع سياقها الكامل."
    ],
    "output": [
      "A supported response draft or an escalation brief with the information the receiving team needs.",
      "مسودة رد مدعومة أو ملف تصعيد بالمعلومات التي يحتاجها الفريق المستلم."
    ],
    "accept": [
      "Assess correct policy use, case progress, repeated questions and the receiving team’s ability to continue.",
      "تقييم صحة تطبيق السياسة وتقدم الحالة وتكرار الأسئلة وقدرة الفريق المستلم على استكمال المعالجة."
    ]
  },
  {
    "slug": "finance",
    "name": [
      "Finance operations",
      "العمليات المالية"
    ],
    "audience": [
      "Finance operations teams, account owners and financial reviewers",
      "فرق العمليات المالية ومسؤولو الحسابات والمراجعون الماليون"
    ],
    "problem": [
      "Financial discrepancies require several records and owners, while calculation, explanation and accounting treatment can become mixed together.",
      "تحتاج الفروق المالية إلى سجلات ومسؤولين مختلفين، وقد تختلط نتائج الحساب بتفسير الفرق وقرار معالجته."
    ],
    "input": [
      "Relevant financial records, matching and calculation rules, reporting context and supporting evidence.",
      "السجلات المالية ذات الصلة وقواعد المطابقة والحساب وسياق الفترة والأدلة المؤيدة."
    ],
    "flow": [
      "Establish the discrepancy, investigate its supported causes and present the case to the finance owner for the authorized treatment.",
      "تحديد الفرق والتحقيق في أسبابه المدعومة، ثم عرض الحالة على المسؤول المالي لاعتماد المعالجة."
    ],
    "output": [
      "An analysis of the discrepancy, supporting records and a proposed treatment for financial review.",
      "تحليل للفروق والسجلات المؤيدة ومعالجة مقترحة للمراجعة المالية."
    ],
    "accept": [
      "Verify arithmetic independently, assess explanations against records and track unresolved cases and correction effort.",
      "التحقق المستقل من الحسابات ومراجعة التفسيرات أمام السجلات وتتبع الحالات المفتوحة وجهد التصحيح."
    ]
  },
  {
    "slug": "logistics",
    "name": [
      "Logistics coordination",
      "تنسيق العمليات اللوجستية"
    ],
    "audience": [
      "Transport operations, warehouse coordinators and customer service teams",
      "فرق النقل وتنسيق المستودعات وخدمة العملاء"
    ],
    "problem": [
      "Shipment events, operational plans and customer commitments change across separate teams and sources.",
      "تتغير أحداث الشحن وخطط التشغيل والتزامات العملاء بين فرق ومصادر منفصلة."
    ],
    "input": [
      "Shipment identifiers, recorded events, the movement plan, relevant documents and service commitments.",
      "معرفات الشحنة والأحداث المسجلة وخطة الحركة والمستندات والالتزامات ذات الصلة."
    ],
    "flow": [
      "Establish the event sequence, identify affected dependencies and coordinate an authorized response with the responsible teams.",
      "تحديد تسلسل الأحداث وآثارها على الأعمال المرتبطة، ثم تنسيق استجابة مخولة مع الفرق المسؤولة."
    ],
    "output": [
      "An exception brief with confirmed events, affected commitments and response options for operations.",
      "موجز للاستثناء بالأحداث المؤكدة والالتزامات المتأثرة وخيارات الاستجابة للعمليات."
    ],
    "accept": [
      "Review event accuracy, conflicting updates, exception ownership and confirmation of the resulting action.",
      "مراجعة دقة الأحداث والتحديثات المتعارضة ومسؤولية الاستثناء وتأكيد الإجراء الناتج."
    ]
  },
  {
    "slug": "procurement",
    "name": [
      "Procurement coordination",
      "تنسيق المشتريات"
    ],
    "audience": [
      "Requesting departments, technical owners, buyers and budget owners",
      "الأقسام الطالبة والمختصون الفنيون والمشترون ومسؤولو الميزانية"
    ],
    "problem": [
      "Purchasing decisions span operational requirements, technical suitability, supplier terms and separate approval responsibilities.",
      "تتوزع قرارات الشراء بين الاحتياج التشغيلي والملاءمة الفنية وشروط المورد ومسؤوليات الاعتماد."
    ],
    "input": [
      "The internal requirement, essential specifications, supplier offers, comparison rules and approval conditions.",
      "الاحتياج الداخلي والمواصفات الأساسية وعروض الموردين وقواعد المقارنة وشروط الاعتماد."
    ],
    "flow": [
      "Clarify the requirement, compare supported terms, resolve technical and commercial exceptions and obtain the authorized purchasing decision.",
      "توضيح الاحتياج ومقارنة الشروط المعروفة وحسم الاستثناءات الفنية والتجارية وصولًا إلى قرار شراء مخول."
    ],
    "output": [
      "A source-backed offer comparison with missing terms and decisions reserved for the authorized buyer.",
      "مقارنة عروض بمراجع وشروط ناقصة وقرارات متروكة لمسؤول الشراء المخول."
    ],
    "accept": [
      "Check specification coverage, consistent calculations, unresolved terms and the authority behind each commitment.",
      "مراجعة تغطية المواصفات واتساق الحسابات والشروط المفتوحة والصلاحية التي يستند إليها كل التزام."
    ]
  },
  {
    "slug": "receivables",
    "name": [
      "Receivables follow-up",
      "متابعة المستحقات"
    ],
    "audience": [
      "Accounts receivable teams, finance owners and customer account teams",
      "فرق المستحقات ومسؤولو المالية وفرق حسابات العملاء"
    ],
    "problem": [
      "A delayed balance can involve a dispute, missing evidence or an unallocated payment, each requiring a different response.",
      "قد يتأخر الرصيد بسبب اعتراض أو دليل ناقص أو سداد لم يُخصص، ولكل سبب معالجة مختلفة."
    ],
    "input": [
      "Invoices, adjustments, payment evidence, agreed terms and the history of any dispute or payment commitment.",
      "الفواتير والتسويات وأدلة السداد والشروط المتفق عليها وتاريخ الاعتراضات أو تعهدات السداد."
    ],
    "flow": [
      "Verify the balance, identify the unresolved dependency and coordinate the appropriate finance decision and follow-up.",
      "التحقق من الرصيد وتحديد ما يعطل حسمه ثم تنسيق القرار المالي والمتابعة المناسبة."
    ],
    "output": [
      "An account follow-up brief and message drafts for the responsible finance reviewer.",
      "موجز لمتابعة الحساب ومسودات تواصل للمراجع المالي المسؤول."
    ],
    "accept": [
      "Check balance correctness, payment matching, dispute handling and whether customer contact addresses the actual issue.",
      "مراجعة صحة الرصيد ومطابقة السداد ومعالجة الاعتراض وارتباط التواصل بالمشكلة الفعلية."
    ]
  },
  {
    "slug": "customer-operations",
    "name": [
      "Customer lifecycle operations",
      "عمليات دورة حياة العميل"
    ],
    "audience": [
      "Account owners, onboarding, delivery and service teams",
      "مسؤولو الحسابات وفرق استقبال العملاء والتسليم والخدمة"
    ],
    "problem": [
      "Customer commitments cross departments, while dependencies and ownership can disappear during handovers.",
      "تمر التزامات العميل بين أقسام متعددة، وقد تضيع الاعتمادات والمسؤوليات أثناء انتقال العمل."
    ],
    "input": [
      "The agreed scope, customer information, starting conditions and the responsibilities of the teams serving the account.",
      "النطاق المتفق عليه ومعلومات العميل وشروط البدء ومسؤوليات الفرق التي تخدم الحساب."
    ],
    "flow": [
      "Coordinate onboarding dependencies, confirm readiness and carry the account context into service and later change decisions.",
      "تنسيق شروط التجهيز وتأكيد الجاهزية، ثم استمرار سياق الحساب في الخدمة وقرارات التغيير اللاحقة."
    ],
    "output": [
      "A handover brief with agreed obligations, unresolved dependencies and the proposed next owner.",
      "ملف تسليم بالالتزامات المتفق عليها والاعتمادات المفتوحة والمسؤول المقترح للخطوة التالية."
    ],
    "accept": [
      "Review handoff continuity, missed dependencies, repeated requests and consistency between customer and internal information.",
      "مراجعة استمرارية السياق والاعتمادات المفقودة والطلبات المتكررة واتساق معلومات العميل مع الفرق الداخلية."
    ]
  }
] as const

export const headings: Record<string, Copy> = {
  "services": [
    "The capabilities behind your agent.",
    "القدرات التي تدعم وكيلك."
  ],
  "solutions": [
    "Choose the work your agent will support.",
    "اختر العمل الذي سيساعدك فيه الوكيل."
  ],
  "methodology": [
    "Build, test and activate your agent",
    "ابنِ الوكيل واختبره ثم فعّله"
  ],
  "architecture": [
    "How your agent’s workspace works",
    "كيف تعمل مساحة الوكيل؟"
  ],
  "integrations": [
    "Give each connection a clear job",
    "حدّد مهمة كل اتصال"
  ],
  "security": [
    "Keep control of data and decisions",
    "احتفظ بالسيطرة على البيانات والقرارات"
  ],
  "resources": [
    "Practical guides for your first agent",
    "إرشادات عملية لوكيلك الأول"
  ],
  "about": [
    "One platform. Built around your work.",
    "منصة واحدة تتشكل حول عملك."
  ],
  "agentnexos": [
    "AgentNexOS: a shared model for agent work",
    "AgentNexOS: تصور مشترك لعمل الوكلاء"
  ],
  "start": [
    "Bring your first task into Studio.",
    "ابدأ بمهمتك الأولى داخل الاستوديو."
  ],
  "contact": [
    "Let’s agree how your agent goes live.",
    "لنتفق على تشغيل وكيلك."
  ],
  "industries": [
    "Build agents for the way your industry works",
    "ابنِ وكلاء يفهمون طريقة العمل في قطاعك"
  ]
}

export const summary: Copy = ["AGYNEXA is an Agent Builder Studio for business. Configure a role, add company knowledge and test its work with OpenAI reasoning, web research and code analysis. Agree the scope and terms by email before production activation.", "AGYNEXA استوديو لبناء وكلاء الأعمال. اضبط الدور وأضف معرفة الشركة واختبر العمل باستدلال OpenAI والبحث وتحليل الكود. اتفق على النطاق والشروط عبر البريد قبل التفعيل الإنتاجي."]
