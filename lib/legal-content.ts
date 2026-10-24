import {createElement as h} from 'react'
import Link from 'next/link'

type Bilingual = readonly [string,string]
type Notice = {title:Bilingual;intro:Bilingual;sections:{title:Bilingual;body:Bilingual}[]}

// Operational information grounded in the current application. This is not a
// substitute for an approved controller identity or a client processing contract.
export const legalContent:Record<'privacy'|'terms',Notice> = {
  "privacy": {
    "title": [
      "How the current service handles your information",
      "كيف تتعامل الخدمة الحالية مع معلوماتك"
    ],
    "intro": [
      "This notice describes the website and private Studio as they operate today. Before using information that requires specific safeguards, confirm the legal operator, jurisdiction and processing terms.",
      "يصف هذا الإشعار الموقع وStudio الخاص في وضعهما الحالي. قبل استخدام معلومات تتطلب ضوابط خاصة، أكّد بيانات المشغّل القانوني والاختصاص وشروط المعالجة."
    ],
    "sections": [
      {
        "title": [
          "Information you provide",
          "المعلومات التي تقدمها"
        ],
        "body": [
          "Registration uses a display name, email address and password through the authentication service. Studio stores configured agents, instructions, sources, questions, generated responses, references, usage records and internal decisions. A workflow brief you choose to save includes organization, contact email, selected service, problem, sources, acceptance criteria and its consent record.",
          "يستخدم التسجيل اسم العرض والبريد وكلمة المرور عبر خدمة المصادقة. يحفظ Studio الوكلاء المضبوطين والتعليمات والمصادر والأسئلة والردود المولدة والمراجع وسجلات الاستخدام والقرارات الداخلية. ويشمل موجز سير العمل الذي تختار حفظه المؤسسة وبريد التواصل والخدمة والمشكلة والمصادر ومعايير القبول وسجل الموافقة."
        ]
      },
      {
        "title": [
          "Providers and technical data",
          "المزودون والبيانات التقنية"
        ],
        "body": [
          "Vercel hosts the application. Supabase provides authentication and application storage. Model requests are sent from the server to Groq and may include your question, relevant conversation turns, permitted source excerpts and assistant instructions. Providers process information needed to provide their services. The notice does not promise a processing country, provider retention period or model-training exclusion.\n\nSign-in uses HttpOnly session cookies. Authentication abuse controls use keyed hashes of email and request network identifiers with attempt counters. Vercel Analytics and Speed Insights provide website and performance measurements. Providers may also process technical request and error information. No billing checkout collects payment details in the current application.",
          "تستضيف Vercel التطبيق. وتوفر Supabase المصادقة وتخزين بياناته. تُرسل طلبات النماذج من الخادم إلى Groq، وقد تشمل السؤال وأجزاء المحادثة المناسبة ومقتطفات المصادر المسموحة وتعليمات الوكيل. يعالج المزودون المعلومات اللازمة لتقديم خدماتهم. ولا يعد الإشعار ببلد معالجة أو مدة احتفاظ لدى المزود أو استثناء من تدريب النماذج.\n\nيستخدم الدخول ملفات جلسة من نوع HttpOnly. وتستخدم ضوابط إساءة المصادقة بصمات محمية بمفتاح للبريد ومعرّفات شبكة الطلب مع عدادات المحاولات. توفر Vercel Analytics وSpeed Insights قياسات الموقع والأداء. وقد يعالج المزودون معلومات تقنية للطلبات والأخطاء. لا توجد صفحة دفع في التطبيق الحالي تجمع بيانات الدفع."
        ]
      },
      {
        "title": [
          "Private saving and public use",
          "الحفظ الخاص والاستخدام العام"
        ],
        "body": [
          "A saved brief is private to the account; saving does not notify staff or create an inbox receipt. Adding a source, allowing public use and publishing are separate actions. A public widget uses explicitly published public knowledge. Do not publish private or case-specific information.",
          "الموجز المحفوظ خاص بالحساب؛ ولا يُشعر الحفظ الموظفين أو ينشئ إيصال صندوق بريد. إضافة المصدر والسماح باستخدامه علنًا والنشر إجراءات منفصلة. تستخدم النافذة العامة معرفة عامة منشورة صراحة. لا تنشر معلومات خاصة أو متعلقة بحالة بعينها."
        ]
      },
      {
        "title": [
          "Deletion and retention",
          "الحذف والاحتفاظ"
        ],
        "body": [
          "Supported records such as briefs, sources and private conversations can be deleted through their controls. Source removal stops further use through supported retrieval and linked-history paths. Separately published snapshots require their own publication controls. Downloads, shared copies and independently saved records remain separate. There is no promised automatic 90-day deletion, immediate erasure from every provider backup or removal from a recipient's device. Whole-account deletion is not available through the current interface.",
          "يمكن حذف السجلات المدعومة مثل الموجزات والمصادر والمحادثات الخاصة من ضوابطها. تمنع إزالة المصدر استخدامه لاحقًا عبر مسارات الاسترجاع والسجل المرتبط المدعومة. وتحتاج النسخ المنشورة المستقلة ضوابط النشر الخاصة بها. تبقى التنزيلات والنسخ المشتركة والسجلات المحفوظة بصورة مستقلة منفصلة. لا يوجد وعد بحذف تلقائي بعد 90 يومًا أو محو فوري من كل نسخ المزودين الاحتياطية أو إزالة من جهاز المستلم. حذف الحساب بالكامل غير متاح من الواجهة الحالية."
        ]
      },
      {
        "title": [
          "Account limits and questions",
          "حدود الحساب والاستفسارات"
        ],
        "body": [
          "Use authorized, non-sensitive information. Do not add passwords, payment credentials, patient records or sensitive finance, employment or claim files. The workspace has one signed-in owner. Email ownership is not verified during registration and password recovery is unavailable.\n\nThe published contact is adham@agynexa.si. A manually sent email is separate from a saved brief. This notice does not establish a monitored privacy desk or response deadline. Confirm registered operator details, jurisdiction, rights-request handling and provider processing arrangements before relying on the service for regulated or sensitive work.",
          "استخدم معلومات مسموحة وغير حساسة. لا تضف كلمات مرور أو بيانات دفع أو سجلات مرضى أو ملفات مالية أو وظيفية أو مطالبات حساسة. للمساحة مالك واحد يسجل الدخول. لا يُتحقق من ملكية البريد عند التسجيل واستعادة كلمة المرور غير متاحة.\n\nعنوان التواصل المنشور adham@agynexa.si. الرسالة المرسلة يدويًا منفصلة عن الموجز المحفوظ. ولا يثبت الإشعار وجود مكتب خصوصية يتابع الطلبات أو موعد للرد. أكّد بيانات المشغّل المسجل والاختصاص ومعالجة طلبات الحقوق وترتيبات المزودين قبل الاعتماد على الخدمة في عمل حساس أو خاضع للتنظيم."
        ]
      }
    ]
  },
  "terms": {
    "title": [
      "Understand the scope before using Studio",
      "افهم النطاق قبل استخدام الاستوديو"
    ],
    "intro": [
      "These operational terms describe the current service and your review responsibilities. They are not a subscription offer, price quote, signed project agreement or statement of legal jurisdiction. Any paid service needs its own commercial and legal terms.",
      "تصف هذه الشروط التشغيلية الخدمة الحالية ومسؤوليات المراجعة. ليست عرض اشتراك أو سعر أو اتفاق مشروع موقّعًا أو تحديدًا للاختصاص القانوني. تحتاج أي خدمة مدفوعة إلى شروط تجارية وقانونية خاصة بها."
    ],
    "sections": [
      {
        "title": [
          "What the current workspace does",
          "ما تفعله المساحة الحالية"
        ],
        "body": [
          "You can configure a private agent, work with short text and prepare drafts. KnowledgeGrid supports answers with source references. ServiceFlow supports issue preparation; only a confirmed saved request has a stored review state. Agent creation saves configuration, rather than training a model or deploying a standalone software agent. The capability pages explain roles and operating requirements; solution pages describe business tasks. They do not establish that every connection or workflow is installed in the workspace.",
          "يمكنك ضبط وكيل خاص والعمل بنصوص قصيرة وتجهيز مسودات. يدعم KnowledgeGrid إجابات بمراجع المصادر. ويساعد ServiceFlow في تجهيز المشكلات؛ ولا يحمل حالة مراجعة محفوظة إلا طلب تأكد حفظه. يحفظ إنشاء الوكيل ضبطه، ولا يدرب نموذجًا أو ينشر برنامج وكيل مستقلًا. تشرح صفحات القدرات الأدوار ومتطلبات التشغيل، وتصف صفحات الحلول مهام العمل. ولا يعني ذلك إتاحة كل اتصال أو سير عمل داخل المساحة."
        ]
      },
      {
        "title": [
          "Information and review",
          "المعلومات والمراجعة"
        ],
        "body": [
          "Use only information you are authorized to provide. Check generated facts, figures, references and proposed actions before relying on them. A citation supports inspection and does not guarantee correctness. Demonstrations using synthetic data are examples, not client results.",
          "استخدم فقط معلومات يحق لك تقديمها. افحص الحقائق والأرقام والمراجع والإجراءات المولدة قبل الاعتماد عليها. يساعد الاستشهاد في الفحص ولا يضمن الصحة. الأمثلة التي تستخدم بيانات افتراضية ليست نتائج عملاء."
        ]
      },
      {
        "title": [
          "Inputs and external actions",
          "المدخلات والإجراءات الخارجية"
        ],
        "body": [
          "Knowledge sources are pasted text or UTF-8 TXT/MD, currently up to 12,000 bytes and 12,000 characters per source. Retrieval matches words. Current Studio has no PDF/OCR, live CRM/ERP/helpdesk connection, external messaging, payments, purchasing, Linux execution or autonomous regulated decisions. A vendor name or written instruction creates neither access nor authorization.",
          "مصادر المعرفة نص ملصق أو TXT/MD بترميز UTF-8، حاليًا حتى 12,000 بايت و12,000 حرف للمصدر. يطابق الاسترجاع الكلمات. لا يتيح Studio الحالي قراءة PDF أو الصور، أو اتصالًا حيًا بـCRM أو ERP أو الدعم، أو مراسلة خارجية أو دفعًا أو شراءً أو تشغيل Linux أو قرارات آلية في مجالات خاضعة للتنظيم. لا ينشئ اسم مزود أو تعليمة مكتوبة وصولًا أو تفويضًا."
        ]
      },
      {
        "title": [
          "Approval and saving",
          "الاعتماد والحفظ"
        ],
        "body": [
          "Inspect the exact stored request before approval or rejection. A pending internal request approval expires after 15 minutes. Internal approval does not establish external assignment, delivery or completion. A saved brief does not reach a staff inbox. Copy or download a draft and choose any external handoff yourself; opening an email draft is not sending it.",
          "افحص الطلب المحفوظ نفسه قبل الاعتماد أو الرفض. تنتهي صلاحية الاعتماد المعلّق للطلب الداخلي بعد 15 دقيقة. لا يثبت الاعتماد الداخلي إسنادًا أو تسليمًا أو إتمامًا خارجيًا. لا يصل الموجز المحفوظ إلى صندوق يتابعه موظفون. انسخ المسودة أو نزّلها واختر الإحالة الخارجية بنفسك؛ فتح مسودة البريد ليس إرسالًا."
        ]
      },
      {
        "title": [
          "Accounts and availability",
          "الحسابات والتوفر"
        ],
        "body": [
          "Protect credentials and do not share a private agent URL as if it granted access. Email ownership verification and password recovery are unavailable. Provider availability, request size, concurrency and rate limits can affect use. These terms offer no unlimited capacity, uptime, response-time or support guarantee. Keep copies of work you need.",
          "احمِ بيانات الدخول ولا تشارك رابط وكيل خاص باعتباره يمنح الوصول. التحقق من ملكية البريد واستعادة كلمة المرور غير متاحين. وقد تتأثر الخدمة بإتاحة المزود وحجم الطلب والتزامن وحدود المعدل. لا تقدم الشروط ضمانًا لسعة غير محدودة أو التوفر أو زمن الرد أو الدعم. احتفظ بنسخ العمل الذي تحتاجه."
        ]
      },
      {
        "title": [
          "Safe use and operating requirements",
          "الاستخدام الآمن ومتطلبات التشغيل"
        ],
        "body": [
          "Keep personal and sensitive cases out of demonstrations and public knowledge. Publication is explicit and separate; published snapshots need their own management. Do not access another workspace, extract credentials or bypass permission checks. The service does not replace qualified medical, financial, legal or safety review.\n\nBefore any paid or business-critical use, confirm the available functions, authorized data, review responsibilities, operating limits, price and provider costs, support and failure handling. Confirm the legal operator, jurisdiction and processing arrangements separately. Contact: adham@agynexa.si. Saving a brief alone does not start a contract, place an order or establish receipt at that address.",
          "أبقِ البيانات الشخصية والحالات الحساسة خارج الأمثلة والمعرفة العامة. النشر صريح ومستقل، وتحتاج النسخ المنشورة إدارة خاصة بها. لا تدخل مساحة أخرى أو تستخرج بيانات دخول أو تتجاوز فحص الصلاحيات. لا تغني الخدمة عن مراجعة مؤهلة طبية أو مالية أو قانونية أو متعلقة بالسلامة.\n\nقبل أي استخدام مدفوع أو حرج للعمل، تأكد من الوظائف المتاحة والبيانات المسموحة ومسؤوليات المراجعة وحدود التشغيل والسعر وتكاليف المزود والدعم ومعالجة الإخفاق. وأكّد المشغّل القانوني والاختصاص وترتيبات المعالجة بصورة مستقلة. التواصل: adham@agynexa.si. لا يبدأ حفظ الموجز وحده عقدًا أو طلب شراء أو يثبت استلام ذلك العنوان له."
        ]
      }
    ]
  }
}

export function LegalContent({kind,ar}:{kind:'privacy'|'terms';ar:boolean}){
 const data=legalContent[kind],i=ar?1:0,local=(path:string)=>`${ar?'/ar':''}${path}`
 return h('main',{id:'main'},
  h('section',{className:'container page-intro'},
   h(Link,{href:local('/security'),className:'text-link'},ar?'الأمان وحدود الاستخدام':'Security and usage boundaries'),
   h('h1',{className:'text-4xl md:text-6xl max-w-4xl tracking-tight mt-6'},data.title[i]),
   h('p',{className:'muted mt-6 max-w-3xl text-lg'},data.intro[i]),
   h('p',{className:'text-sm muted mt-4'},ar?'وصف نطاق الخدمة: 24 أكتوبر 2026':'Service scope described: 24 October 2026')),
  h('section',{className:'container pb-24 max-w-4xl'},
   ...data.sections.map(s=>h('article',{key:s.title[0],className:'border-t pt-8 pb-10'},h('h2',{className:'text-2xl'},s.title[i]),h('p',{className:'muted mt-5 whitespace-pre-line'},s.body[i]))),
   h('nav',{className:'related-links mt-8','aria-label':ar?'روابط الخصوصية والاستخدام':'Privacy and usage links'},
    h(Link,{href:local(kind==='privacy'?'/terms':'/privacy')},kind==='privacy'?(ar?'شروط الاستخدام':'Usage terms'):(ar?'إشعار الخصوصية':'Privacy notice')),
    h(Link,{href:local('/studio')},ar?'فتح Studio الخاص':'Open private Studio'))))
}
