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
      "Find the relevant passage, explain it for the question and list any point the source does not resolve.",
      "استرجاع النص المناسب وشرح علاقته بالسؤال وتحديد النقاط التي لا يحسمها المصدر."
    ],
    "output": [
      "An answer with the relevant source passages and questions still needing a decision.",
      "إجابة بنصوص المصادر المرتبطة بها والأسئلة التي تنتظر قرارًا."
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
      "Extract the requested facts, compare them with your checklist and flag conflicting or missing information.",
      "استخراج البيانات المطلوبة ومقارنتها بقائمة المتطلبات وتوضيح التعارض والنواقص."
    ],
    "output": [
      "A summary of the extracted facts, their sources and missing information.",
      "ملخص بالبيانات المستخرجة ومصادرها والمعلومات الناقصة."
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
      "Summarize the customer’s requirements, compare them with confirmed capabilities and prepare questions for the sales owner.",
      "تلخيص متطلبات العميل ومقارنتها بالإمكانات المؤكدة وتجهيز أسئلة لمسؤول المبيعات."
    ],
    "output": [
      "A customer needs summary or proposal draft with assumptions for the sales owner to review.",
      "ملخص لاحتياج العميل أو مسودة عرض بافتراضاتها، يراجعها مسؤول المبيعات."
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
      "Review the case against the policy and prepare a reply or a summary for the responsible specialist.",
      "مراجعة الحالة وفق السياسة وتجهيز رد أو ملخص للمختص المسؤول."
    ],
    "output": [
      "A reply draft or a case summary for the specialist handling the issue.",
      "مسودة رد أو ملخص حالة للمختص الذي يتولى المشكلة."
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
      "Compare the records using your matching rules, calculate differences and list the evidence for possible causes.",
      "مقارنة السجلات وفق قواعد المطابقة وحساب الفروق وتحديد الأدلة للأسباب المحتملة."
    ],
    "output": [
      "A report of financial differences, supporting records and unresolved questions.",
      "تقرير بالفروق المالية والسجلات المؤيدة والأسئلة غير المحسومة."
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
      "Put shipment updates in order, identify affected commitments and prepare follow-up options.",
      "ترتيب تحديثات الشحنة وتحديد الالتزامات المتأثرة وتجهيز خيارات المتابعة."
    ],
    "output": [
      "A summary of confirmed shipment events, affected commitments and follow-up options.",
      "ملخص بأحداث الشحنة المؤكدة والالتزامات المتأثرة وخيارات المتابعة."
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
      "Compare equivalent items, calculate totals and identify missing terms for the buyer to review.",
      "مقارنة البنود المتكافئة وحساب الإجماليات وتحديد الشروط الناقصة لمراجعة مسؤول الشراء."
    ],
    "output": [
      "A supplier comparison with source references and missing terms for the buyer.",
      "مقارنة للموردين بمراجعها والشروط الناقصة التي يراجعها مسؤول الشراء."
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
      "Review supplied balances and disputes, then prepare a follow-up list and draft messages.",
      "مراجعة الأرصدة والنزاعات المقدمة، ثم تجهيز قائمة متابعة ومسودات رسائل."
    ],
    "output": [
      "A follow-up list and message drafts for the account owner to review.",
      "قائمة متابعة ومسودات رسائل يراجعها مسؤول الحساب."
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
      "Summarize the agreed scope, conditions for starting and outstanding tasks for the receiving team.",
      "تلخيص النطاق المتفق عليه وشروط البدء والمهام المتبقية للفريق المستلم."
    ],
    "output": [
      "A handover summary of agreed obligations, remaining requirements and the next person responsible.",
      "ملخص تسليم بالالتزامات المتفق عليها والمتطلبات المتبقية والمسؤول عن الخطوة التالية."
    ],
    "accept": [
      "Review handoff continuity, missed dependencies, repeated requests and consistency between customer and internal information.",
      "مراجعة استمرارية السياق والاعتمادات المفقودة والطلبات المتكررة واتساق معلومات العميل مع الفرق الداخلية."
    ]
  }
] as const

export const headings: Record<string, Copy> = {
  "services": [
    "AI agent capabilities",
    "قدرات وكلاء الذكاء الاصطناعي"
  ],
  "solutions": [
    "Choose a task for your agent",
    "اختر مهمة لوكيلك"
  ],
  "methodology": [
    "Build and test your first agent",
    "جهّز وكيلك الأول واختبره"
  ],
  "architecture": [
    "How AGYNEXA Studio works",
    "كيف يعمل استوديو AGYNEXA؟"
  ],
  "integrations": [
    "Available tools and connection requirements",
    "الأدوات المتاحة ومتطلبات ربط الأنظمة"
  ],
  "security": [
    "Your data and access in Studio",
    "بياناتك وصلاحيات الوصول في الاستوديو"
  ],
  "resources": [
    "A practical guide to setting up your agent",
    "دليل عملي لإعداد الوكيل"
  ],
  "about": [
    "About AGYNEXA",
    "عن AGYNEXA"
  ],
  "agentnexos": [
    "AgentNexOS: planning agent responsibilities",
    "AgentNexOS: تخطيط أدوار الوكلاء"
  ],
  "start": [
    "Set up your first agent",
    "جهّز وكيلك الأول"
  ],
  "contact": [
    "Contact AGYNEXA",
    "تواصل مع AGYNEXA"
  ],
  "industries": [
    "AI agent examples by industry",
    "أمثلة لوكلاء الذكاء الاصطناعي في قطاعك"
  ]
}

export const summary: Copy = ["Build AI agents for recurring business tasks. Add your instructions and company sources, test the answers in Studio, and agree production use with AGYNEXA.", "ابنِ وكلاء للمهام المتكررة في شركتك. أضف تعليماتك ومراجعك وجرّب الإجابات في الاستوديو، ثم اتفق مع AGYNEXA على التشغيل الفعلي."]
