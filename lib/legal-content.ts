import {createElement as h} from 'react'
import Link from 'next/link'

type Bilingual = readonly [string,string]
type Notice = {title:Bilingual;intro:Bilingual;sections:{title:Bilingual;body:Bilingual}[]}

// Operational information grounded in the current application. This is not a
// substitute for an approved controller identity or a client processing contract.
export const legalContent:Record<'privacy'|'terms',Notice> = {
  "privacy": {
    "title": [
      "Privacy notice",
      "إشعار الخصوصية"
    ],
    "intro": [
      "This notice explains the information used by the AGYNEXA website and Studio. Choose information appropriate to your purpose and the service’s data handling before you add it to a workspace.",
      "يوضح هذا الإشعار المعلومات التي يستخدمها موقع AGYNEXA والاستوديو. اختر المعلومات المناسبة لغرضك ولطريقة معالجتها قبل إضافتها إلى مساحة العمل."
    ],
    "sections": [
      {
        "title": [
          "Information you provide",
          "المعلومات التي تقدمها"
        ],
        "body": [
          "Account registration uses your display name, email address and password. The workspace can hold agent instructions, knowledge sources, conversations, generated responses, source references and usage records. If you save a planning record, it includes the company and process details you choose to enter.",
          "يستخدم إنشاء الحساب اسم العرض والبريد الإلكتروني وكلمة المرور. وقد تحتوي المساحة على تعليمات الوكلاء ومصادر المعرفة والمحادثات والإجابات المولدة ومراجعها وسجلات الاستخدام. وإذا حفظت سجل تخطيط، فإنه يتضمن بيانات الشركة والعملية التي تختار إدخالها."
        ]
      },
      {
        "title": [
          "How information is used",
          "أغراض الاستخدام"
        ],
        "body": [
          "Account information supports sign-in and access to your workspace. Agent instructions, relevant conversation context and source excerpts may be processed by the model service to generate a response. Application records support saving, retrieval and the controls available in the workspace.\n\nService providers perform hosting, authentication, storage, model processing and website measurements. Session cookies support sign-in; technical request information also supports performance and abuse prevention. Processing location, provider retention and any restrictions on further use should be confirmed before introducing information that requires specific contractual safeguards. Questions about those arrangements can be sent to adham@agynexa.si.",
          "تُستخدم معلومات الحساب لتسجيل الدخول والوصول إلى مساحتك. وقد تعالج خدمة النموذج تعليمات الوكيل وسياق المحادثة المناسب ومقتطفات المصادر لتوليد الإجابة. وتتيح سجلات التطبيق الحفظ والاسترجاع والضوابط المتاحة في المساحة.\n\nيتولى مزودو الخدمات الاستضافة والمصادقة والتخزين ومعالجة النماذج وقياسات الموقع. وتدعم ملفات الجلسة تسجيل الدخول، بينما تساعد معلومات الطلبات التقنية في متابعة الأداء ومنع الإساءة. قبل إضافة بيانات تتطلب ضمانات تعاقدية خاصة، تأكد من بلد المعالجة ومدد الاحتفاظ لدى المزودين وقيود الاستخدام اللاحق. ويمكن الاستفسار عن هذه الترتيبات عبر adham@agynexa.si."
        ]
      },
      {
        "title": [
          "Private work and public content",
          "العمل الخاص والمحتوى العام"
        ],
        "body": [
          "Saving a private record does not send a message to AGYNEXA staff. Adding information to an agent and approving it for public use are separate actions. Review the material included in a published version before making it available to others. Do not publish private company information or personal case records.",
          "لا يؤدي حفظ سجل خاص إلى إرسال رسالة لفريق AGYNEXA. وإضافة المعلومات للوكيل تختلف عن السماح باستخدامها علنًا. راجع ما تتضمنه النسخة المنشورة قبل إتاحتها للآخرين، ولا تنشر معلومات الشركة الخاصة أو سجلات الحالات الشخصية."
        ]
      },
      {
        "title": [
          "Your choices and deletion",
          "خيارات الحذف"
        ],
        "body": [
          "Use the available controls to delete supported records such as planning records, sources and conversations. Published versions, downloaded files and copies shared outside the workspace require separate attention. Deletion in the interface does not establish immediate removal from every provider backup or from a recipient’s device. Whole-account deletion is not offered through the interface; contact us about a request affecting your account.",
          "استخدم الضوابط المتاحة لحذف السجلات المدعومة، مثل سجلات التخطيط والمصادر والمحادثات. تحتاج النسخ المنشورة والملفات المنزلة والمعلومات المشتركة خارج المساحة إلى إدارة منفصلة. والحذف من الواجهة لا يثبت المحو الفوري من جميع نسخ المزودين الاحتياطية أو أجهزة المستلمين. لا تتيح الواجهة حذف الحساب بالكامل؛ تواصل معنا بشأن الطلبات المتعلقة بحسابك."
        ]
      },
      {
        "title": [
          "Account and information responsibilities",
          "مسؤوليات الحساب والمعلومات"
        ],
        "body": [
          "The workspace has one account owner. Registration does not verify ownership of the email address, and password recovery is not available. Keep your credentials safe and use information you are authorized to provide. Do not submit passwords, access keys, payment credentials or sensitive patient, employment, financial or insurance case records.",
          "للمساحة مالك حساب واحد. لا يتحقق التسجيل من ملكية البريد الإلكتروني، واستعادة كلمة المرور غير متاحة. احمِ بيانات الدخول واستخدم معلومات يحق لك تقديمها. ولا تضف كلمات مرور أو مفاتيح وصول أو بيانات دفع أو سجلات حساسة للمرضى أو الموظفين أو المعاملات المالية أو المطالبات التأمينية."
        ]
      },
      {
        "title": [
          "Privacy questions",
          "الاستفسارات المتعلقة بالخصوصية"
        ],
        "body": [
          "Email adham@agynexa.si with the question or request and enough context to identify the relevant record. Avoid including sensitive material in the initial message. A saved planning record is separate from email contact. Where your organization requires a data-processing agreement or confirmed legal and jurisdictional details, establish those arrangements before using the service for that information. No fixed response deadline is stated in this notice.",
          "راسل adham@agynexa.si موضحًا السؤال أو الطلب وما يكفي لتحديد السجل المقصود. لا ترسل مادة حساسة في الرسالة الأولى. وحفظ سجل تخطيط مستقل عن التواصل بالبريد. إذا احتاجت مؤسستك إلى اتفاق معالجة بيانات أو معلومات قانونية واختصاص محدد، فأكّد هذه الترتيبات قبل استخدام الخدمة لهذه البيانات. لا يحدد الإشعار مدة ثابتة للرد."
        ]
      }
    ]
  },
  "terms": {
    "title": [
      "Usage terms",
      "شروط الاستخدام"
    ],
    "intro": [
      "These terms describe use of the AGYNEXA website and Studio, including your responsibilities for the information you provide and the results you use. Any separately agreed paid service requires its own commercial and processing arrangements.",
      "توضح هذه الشروط استخدام موقع AGYNEXA والاستوديو، ومسؤوليتك عن المعلومات التي تقدمها والنتائج التي تعتمد عليها. وتحتاج أي خدمة مدفوعة يُتفق عليها بصورة مستقلة إلى ترتيباتها التجارية وشروط معالجة بياناتها."
    ],
    "sections": [
      {
        "title": [
          "Using the workspace",
          "استخدام مساحة العمل"
        ],
        "body": [
          "Studio lets you configure private agents, provide supported company knowledge and work with conversations and generated results. Agent creation saves a configuration; it does not train a new model. Capability and solution pages explain system components and workflow designs. A described system action requires its own supported connection and authorization.",
          "يتيح الاستوديو إعداد وكلاء خاصين وإضافة معرفة الشركة المدعومة والعمل بالمحادثات والنتائج المولدة. يحفظ إنشاء الوكيل إعداداته، ولا يدرب نموذجًا جديدًا. وتشرح صفحات القدرات والحلول مكونات الأنظمة وتصميمات سير العمل؛ أما الإجراءات داخل أنظمة أخرى فتحتاج إلى اتصال مدعوم وتفويض مناسب."
        ]
      },
      {
        "title": [
          "Your information and account",
          "معلوماتك وحسابك"
        ],
        "body": [
          "Provide only information you are permitted to use. Keep credentials private and do not attempt to access another person’s workspace. Email ownership is not verified at registration and password recovery is not available. Keep copies of work you need and contact us about account issues.",
          "قدّم فقط المعلومات التي يحق لك استخدامها. احمِ بيانات الدخول ولا تحاول الوصول إلى مساحة تخص شخصًا آخر. لا يتحقق التسجيل من ملكية البريد، واستعادة كلمة المرور غير متاحة. احتفظ بنسخ العمل الذي تحتاجه وتواصل معنا بشأن مشكلات الحساب."
        ]
      },
      {
        "title": [
          "Reviewing AI-generated work",
          "مراجعة نتائج الذكاء الاصطناعي"
        ],
        "body": [
          "Generated answers and proposed actions can be incomplete or incorrect. Check important facts, figures, source references and business commitments before relying on them. A source reference makes the basis of a response inspectable; it is not a guarantee of correctness. Medical, legal, financial and safety decisions require the appropriate qualified person.",
          "قد تكون الإجابات والإجراءات المقترحة ناقصة أو غير صحيحة. تحقّق من الحقائق والأرقام والمراجع والالتزامات قبل الاعتماد عليها. يتيح الاستشهاد فحص أساس الإجابة، ولا يضمن صحتها. وتحتاج القرارات الطبية والقانونية والمالية والمتعلقة بالسلامة إلى المختص المؤهل."
        ]
      },
      {
        "title": [
          "Decisions, actions and saving",
          "القرارات والإجراءات والحفظ"
        ],
        "body": [
          "Review the exact proposed request before an available approval or rejection action. Internal approval records a decision inside the workspace; external execution needs its own confirmation. Saving a planning record does not send it to a staff inbox, start a contract or place an order. Opening an email draft does not send the message.",
          "افحص الطلب المقترح نفسه قبل استخدام إجراء الاعتماد أو الرفض المتاح. يسجل الاعتماد الداخلي قرارًا داخل المساحة، ويحتاج التنفيذ الخارجي إلى تأكيد مستقل. ولا يؤدي حفظ سجل تخطيط إلى إرساله لصندوق موظفين أو بدء عقد أو إنشاء طلب شراء. وفتح مسودة بريد لا يرسل الرسالة."
        ]
      },
      {
        "title": [
          "Publication and access",
          "النشر والوصول"
        ],
        "body": [
          "Private configuration and public publication are separate. Review the knowledge approved for public use and manage published versions through their own controls. Do not include confidential company information or sensitive personal records in public content. A private agent link does not itself grant another user access.",
          "الإعداد الخاص والنشر العام إجراءان منفصلان. راجع المعرفة المسموح باستخدامها علنًا، وأدر النسخ المنشورة من ضوابطها. لا تضف معلومات الشركة السرية أو السجلات الشخصية الحساسة إلى المحتوى العام. ورابط الوكيل الخاص لا يمنح شخصًا آخر صلاحية الدخول بمفرده."
        ]
      },
      {
        "title": [
          "Availability and usage",
          "الإتاحة والاستخدام"
        ],
        "body": [
          "Service availability and provider limits can affect requests. Use the inputs and actions supported by the interface, and do not bypass access or abuse controls. Usage estimates are not invoices or a guaranteed spending limit. These terms do not offer unlimited capacity, a fixed uptime level or a support response guarantee.",
          "قد تؤثر إتاحة الخدمة وحدود المزودين في تنفيذ الطلبات. استخدم المدخلات والإجراءات التي تدعمها الواجهة، ولا تتجاوز ضوابط الوصول أو منع الإساءة. تقديرات الاستخدام ليست فواتير أو حدًا مضمونًا للإنفاق. ولا تقدم هذه الشروط سعة غير محدودة أو مستوى ثابتًا للتوفر أو موعدًا مضمونًا للدعم."
        ]
      },
      {
        "title": [
          "Questions and specific business requirements",
          "الاستفسارات ومتطلبات الأعمال"
        ],
        "body": [
          "Contact adham@agynexa.si about the service or a particular requirement. Confirm the available functions, permitted data, responsibility for decisions and any required processing agreement before using a workflow for business-critical work. Pricing, support commitments, legal operator details and governing jurisdiction are not established by saving a record or using a demonstration.",
          "تواصل عبر adham@agynexa.si بشأن الخدمة أو احتياج محدد. قبل الاعتماد على سير عمل حرج للمؤسسة، أكّد الوظائف المتاحة والبيانات المسموحة ومسؤوليات القرار واتفاق معالجة البيانات عند الحاجة. لا يحدد حفظ السجل أو استخدام المثال سعرًا أو التزام دعم أو بيانات المشغّل القانوني أو القانون الواجب التطبيق."
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
   h('p',{className:'muted mt-6 max-w-3xl text-lg'},data.intro[i])),
  h('section',{className:'container pb-24 max-w-4xl'},
   ...data.sections.map(s=>h('article',{key:s.title[0],className:'border-t pt-8 pb-10'},h('h2',{className:'text-2xl'},s.title[i]),h('p',{className:'muted mt-5 whitespace-pre-line'},s.body[i]))),
   h('nav',{className:'related-links mt-8','aria-label':ar?'روابط الخصوصية والاستخدام':'Privacy and usage links'},
    h(Link,{href:local(kind==='privacy'?'/terms':'/privacy')},kind==='privacy'?(ar?'شروط الاستخدام':'Usage terms'):(ar?'إشعار الخصوصية':'Privacy notice')),
    h(Link,{href:local('/studio')},ar?'فتح Studio الخاص':'Open private Studio'))))
}
