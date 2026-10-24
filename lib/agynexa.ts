export type Copy = [string, string]
export const nav: [string,string,string][] = [['solutions','Solutions','الحلول'],['services','Capabilities','قدرات المنصة'],['architecture','Architecture','البنية التقنية'],['methodology','Working with agents','العمل مع الوكلاء'],['integrations','Integrations','التكاملات'],['industries','Industries','القطاعات'],['resources','Resources','الموارد'],['about','About','من نحن'],['security','Security','الأمان']]
export const solutions = [
  {
    "slug": "knowledge",
    "name": [
      "Find the instruction that answers the question",
      "اعثر على التعليمات التي تجيب عن السؤال"
    ],
    "audience": [
      "Process owner and authorized reviewer",
      "مسؤول العمل والمراجع المخوّل"
    ],
    "problem": [
      "Employees may find a related document without finding the approved instruction. Define the question set, source owner and information that should govern the answer.",
      "قد يجد الموظف مستندًا ذا صلة دون الوصول إلى التعليمات المعتمدة. حدّد الأسئلة ومسؤول المصدر والمعلومات التي يجب أن تحكم الإجابة."
    ],
    "input": [
      "The approved sources need to contain the passages that support an answer. With the text-based assistant, inspect the response against the approved material. Record access and update requirements separately when the task depends on a repository or shared information.",
      "تحتاج المصادر المعتمدة إلى المقاطع التي تدعم الإجابة. ومع المساعد النصي، افحص الرد مقابل المادة المعتمدة. ووثّق متطلبات الوصول والتحديث بصورة مستقلة إذا اعتمدت المهمة على مستودع أو معلومات مشتركة."
    ],
    "flow": [
      "The approved sources need to contain the passages that support an answer. With the text-based assistant, inspect the response against the approved material. Record access and update requirements separately when the task depends on a repository or shared information.",
      "تحتاج المصادر المعتمدة إلى المقاطع التي تدعم الإجابة. ومع المساعد النصي، افحص الرد مقابل المادة المعتمدة. ووثّق متطلبات الوصول والتحديث بصورة مستقلة إذا اعتمدت المهمة على مستودع أو معلومات مشتركة."
    ],
    "output": [
      "A useful response includes supporting excerpts and unresolved points. The knowledge owner approves source use and important interpretations. A source reference helps inspection; it does not guarantee correct reasoning.",
      "يتضمن الرد المفيد مقتطفاته الداعمة ونقاطه غير المحسومة. ويعتمد مسؤول المعرفة استخدام المصدر والتفسيرات المؤثرة. يتيح المرجع الفحص، لكنه لا يضمن صحة الاستنتاج."
    ],
    "accept": [
      "Acceptance: compare answers against approved examples, check citations and include an unanswered question. Measure factual corrections and verification time. For a repository-based design, also specify tests for outdated guidance and unauthorized sources. Current inputs are pasted text or UTF-8 TXT/MD, up to 12,000 bytes and 12,000 characters per source; retrieval matches words.",
      "القبول: قارن الإجابات بأمثلة معتمدة وافحص الاستشهادات، واستخدم سؤالًا بلا إجابة. قِس التصحيحات ووقت التحقق. وأضف للتصميم المعتمد على مستودع اختبارات النص القديم والمصدر غير المسموح. المدخل الحالي نص ملصق أو TXT/MD بترميز UTF-8، بحد 12,000 بايت و12,000 حرف للمصدر، ويطابق الاسترجاع الكلمات."
    ]
  },
  {
    "slug": "documents",
    "name": [
      "Prepare a document record without hiding the missing detail",
      "جهّز سجل المستند مع إبقاء التفاصيل الناقصة ظاهرة"
    ],
    "audience": [
      "Process owner and authorized reviewer",
      "مسؤول العمل والمراجع المخوّل"
    ],
    "problem": [
      "A form can look complete while a reference is missing or a value is ambiguous. Specify the document type, required fields and evidence needed for each value.",
      "قد يبدو النموذج مكتملًا رغم غياب مرجع أو التباس قيمة. حدّد نوع المستند والحقول المطلوبة والدليل اللازم لكل قيمة."
    ],
    "input": [
      "The field map needs validation rules and a clear treatment of unknown or conflicting values. A review record needs each value's source context. Start with document text you can supply directly, and list any extraction format as a requirement rather than assuming support.",
      "تحتاج خريطة الحقول إلى قواعد تحقق وطريقة واضحة للقيم المجهولة أو المتعارضة. يحتاج سجل المراجعة إلى سياق مصدر كل قيمة. ابدأ بنص مستند تستطيع تقديمه مباشرةً، ووثّق أي صيغة استخراج كمتطلب دون افتراض دعمها."
    ],
    "flow": [
      "The field map needs validation rules and a clear treatment of unknown or conflicting values. A review record needs each value's source context. Start with document text you can supply directly, and list any extraction format as a requirement rather than assuming support.",
      "تحتاج خريطة الحقول إلى قواعد تحقق وطريقة واضحة للقيم المجهولة أو المتعارضة. يحتاج سجل المراجعة إلى سياق مصدر كل قيمة. ابدأ بنص مستند تستطيع تقديمه مباشرةً، ووثّق أي صيغة استخراج كمتطلب دون افتراض دعمها."
    ],
    "output": [
      "Specify a field draft and exception list for the operations reviewer. A permitted downstream record update requires separate configured authorization. Authenticity and specialist interpretation remain with qualified people.",
      "حدّد مسودة حقول وقائمة استثناءات لمراجع العمليات كمخرج مطلوب. ويحتاج التحديث في نظام تالٍ إلى تفويض مستقل ضمن الإعداد. وتبقى أصالة المستند وتفسيره المتخصص للمؤهلين."
    ],
    "accept": [
      "Acceptance: check representative text, missing fields and conflicting values. Measure field correctness, missed gaps and correction time. A complete-looking record containing an invented value fails the test. Current Studio accepts short text and TXT/MD; it does not extract PDF, images or spreadsheets.",
      "القبول: نصوص تمثل العمل وحقول ناقصة وقيم متعارضة. قِس صحة الحقول والنواقص التي لم تُكتشف ووقت التصحيح. يفشل السجل المكتمل ظاهريًا إذا احتوى قيمة مختلقة. يقبل الاستوديو الحالي نصوصًا قصيرة وTXT/MD، ولا يستخرج PDF أو الصور أو الجداول."
    ]
  },
  {
    "slug": "sales",
    "name": [
      "Understand what you can offer before preparing the proposal",
      "اعرف ما تستطيع تقديمه قبل تجهيز العرض"
    ],
    "audience": [
      "Process owner and authorized reviewer",
      "مسؤول العمل والمراجع المخوّل"
    ],
    "problem": [
      "Sales notes and product guidance can be scattered. Identify the customer facts you are authorized to use, approved capabilities and the questions the meeting should resolve.",
      "قد تتفرق ملاحظات المبيعات وإرشادات المنتجات. حدّد حقائق العميل المسموح باستخدامها والقدرات المعتمدة والأسئلة التي يحتاج الاجتماع إلى حسمها."
    ],
    "input": [
      "A preparation flow should organize recorded facts, relevant capabilities and gaps. A requirement matrix should distinguish supported needs, configuration dependencies, unknowns and unavailable capabilities. Check the evidence and assessment rules against representative requirements.",
      "ينبغي أن ينظم مسار التحضير الحقائق والقدرات المناسبة والفجوات. وينبغي أن تميز مصفوفة المتطلبات الاحتياج المدعوم ومتطلبات الإعداد والمجهول والقدرات غير المتاحة. افحص الأدلة وقواعد التقييم على متطلبات تمثل الاستخدام."
    ],
    "flow": [
      "A preparation flow should organize recorded facts, relevant capabilities and gaps. A requirement matrix should distinguish supported needs, configuration dependencies, unknowns and unavailable capabilities. Check the evidence and assessment rules against representative requirements.",
      "ينبغي أن ينظم مسار التحضير الحقائق والقدرات المناسبة والفجوات. وينبغي أن تميز مصفوفة المتطلبات الاحتياج المدعوم ومتطلبات الإعداد والمجهول والقدرات غير المتاحة. افحص الأدلة وقواعد التقييم على متطلبات تمثل الاستخدام."
    ],
    "output": [
      "The output should include an account brief, meeting questions and a requirement assessment. The sales owner verifies prices, dates and commercial promises. The workflow must not invent purchase intent or claim a product can meet a requirement without support.",
      "المخرج المطلوب موجز عميل وأسئلة اجتماع وتقييم متطلبات. يتحقق مسؤول المبيعات من الأسعار والمواعيد والوعود التجارية. ولا يجوز اختلاق نية شراء أو قدرة منتج على تلبية متطلب دون سند."
    ],
    "accept": [
      "Acceptance: check unsupported matches, factual corrections and the usefulness of the questions. A numeric score requires a visible rubric. Preparation time can be measured; improved conversion or contract wins cannot be inferred from a generated brief.",
      "القبول: المطابقات غير المدعومة وتصحيحات الحقائق وفائدة الأسئلة. تحتاج الدرجة الرقمية إلى معيار ظاهر. يمكن قياس وقت التحضير، ولا يثبت الموجز المولد تحسن التحويل أو الفوز بالعقود."
    ]
  },
  {
    "slug": "service",
    "name": [
      "Give a service request a useful next step",
      "حدّد خطوة مفيدة لطلب الخدمة"
    ],
    "audience": [
      "Process owner and authorized reviewer",
      "مسؤول العمل والمراجع المخوّل"
    ],
    "problem": [
      "A written policy question and an exception need different handling. Define the approved guidance, request types and facts needed before staff decide.",
      "يحتاج السؤال عن قاعدة مكتوبة إلى معالجة تختلف عن الاستثناء. حدّد الإرشادات المعتمدة وأنواع الطلبات والحقائق اللازمة قبل قرار الموظف."
    ],
    "input": [
      "Answer conditions, clarification steps and handoff rules give the request a usable path. Separate a supported reply from a case that needs human judgment. For a text-based draft, provide the approved policy and the case facts so that the reviewer can inspect the response's basis.",
      "تمنح شروط الإجابة وخطوات الاستيضاح وقواعد الإحالة الطلب مسارًا مفهومًا. افصل الرد المدعوم عن الحالة التي تحتاج إلى حكم بشري. وللمسودة النصية، قدّم السياسة المعتمدة وحقائق الحالة حتى يفحص المراجع سند الرد."
    ],
    "flow": [
      "Answer conditions, clarification steps and handoff rules give the request a usable path. Separate a supported reply from a case that needs human judgment. For a text-based draft, provide the approved policy and the case facts so that the reviewer can inspect the response's basis.",
      "تمنح شروط الإجابة وخطوات الاستيضاح وقواعد الإحالة الطلب مسارًا مفهومًا. افصل الرد المدعوم عن الحالة التي تحتاج إلى حكم بشري. وللمسودة النصية، قدّم السياسة المعتمدة وحقائق الحالة حتى يفحص المراجع سند الرد."
    ],
    "output": [
      "The requested output should be a referenced response draft or a handoff showing known facts, missing details and the next decision. Staff control exceptions and customer commitments. Sending through an authorized communication channel remains distinct from saving or approving an internal item.",
      "يُحدّد المخرج المطلوب كمسودة رد بمراجعها أو إحالة تبين الحقائق والنواقص والقرار التالي. يتحكم الموظفون في الاستثناءات والالتزامات للعميل. ويظل الإرسال عبر قناة متاحة ومصرح بها منفصلًا عن حفظ عنصر داخلي أو اعتماده."
    ],
    "accept": [
      "Acceptance: test an ordinary question, an ambiguous case and a request the workflow must leave to staff. Check policy interpretation, repeated questions and routing. Only a confirmed saved record can be described as stored or approved.",
      "القبول: سؤال معتاد وحالة ملتبسة وطلب يجب تركه للموظف. افحص تفسير السياسة وتكرار الأسئلة والتوجيه. ولا يوصف الطلب بالمحفوظ أو المعتمد دون سجل مؤكد."
    ]
  },
  {
    "slug": "finance",
    "name": [
      "Show the invoice difference and the evidence behind it",
      "أظهر فرق الفاتورة والدليل الذي يوضحه"
    ],
    "audience": [
      "Process owner and authorized reviewer",
      "مسؤول العمل والمراجع المخوّل"
    ],
    "problem": [
      "An invoice can disagree with its order in quantity, date or reference. Specify the records, units, currency, matching fields and tolerance rules needed for the review.",
      "قد تختلف الفاتورة عن طلبها في كمية أو تاريخ أو مرجع. حدّد السجلات والوحدات والعملة وحقول المطابقة وحدود الفروق المقبولة."
    ],
    "input": [
      "The review needs alignment, calculation and exception rules, including a clear treatment of ambiguous matches. The comparison requirements should retain supplied values and their references and leave unsupported figures unresolved. A language draft must not stand in for a verified calculation.",
      "تحتاج المراجعة إلى قواعد مطابقة وحساب واستثناءات، مع معالجة واضحة للمطابقات الملتبسة. وتحفظ متطلبات المقارنة القيم المقدمة ومراجعها وتترك الرقم غير المدعوم غير محسوم. ولا تحل المسودة اللغوية محل حساب جرى التحقق منه."
    ],
    "flow": [
      "The review needs alignment, calculation and exception rules, including a clear treatment of ambiguous matches. The comparison requirements should retain supplied values and their references and leave unsupported figures unresolved. A language draft must not stand in for a verified calculation.",
      "تحتاج المراجعة إلى قواعد مطابقة وحساب واستثناءات، مع معالجة واضحة للمطابقات الملتبسة. وتحفظ متطلبات المقارنة القيم المقدمة ومراجعها وتترك الرقم غير المدعوم غير محسوم. ولا تحل المسودة اللغوية محل حساب جرى التحقق منه."
    ],
    "output": [
      "Specify a comparison and exception brief for review. Finance staff verify accounting treatment and authorize any record change. A summary does not authorize payment, tax filing or ledger updates; those require an available permitted action.",
      "حدّد مقارنة وموجز استثناءات للمراجعة. يتحقق موظف المالية من المعالجة المحاسبية ويفوّض أي تغيير. لا يعتمد الملخص دفعًا أو تقديمًا ضريبيًا أو تحديثًا لدفتر الأستاذ؛ فهذه تحتاج إلى إجراء متاح ومسموح."
    ],
    "accept": [
      "Acceptance: test calculations independently of the language summary. Measure missed differences, false alarms, correction time and retained source evidence. A general explanation of a financial trend is not its proven cause.",
      "القبول: افحص الحسابات بصورة مستقلة عن الملخص اللغوي. قِس الفروق التي لم تُكتشف والإنذارات الخاطئة ووقت التصحيح وحفظ الأدلة. والتفسير العام للاتجاه المالي ليس سببًا مثبتًا له."
    ]
  },
  {
    "slug": "logistics",
    "name": [
      "Bring shipment updates into a clear operational account",
      "اجمع تحديثات الشحنة في وصف تشغيلي واضح"
    ],
    "audience": [
      "Process owner and authorized reviewer",
      "مسؤول العمل والمراجع المخوّل"
    ],
    "problem": [
      "Scattered or contradictory updates make a delivery commitment difficult to assess. Define the shipment identifiers, milestones, timestamps and information needed by operations.",
      "يصعب تقييم التزام التسليم عندما تتفرق التحديثات أو تتعارض. حدّد معرفات الشحنة ومراحلها وتوقيتها والمعلومات التي يحتاجها التشغيل."
    ],
    "input": [
      "The event record needs collection, chronology and exception rules. Distinguish recorded events from expectations, retain the source of each update and identify contradictions. The review brief should ask for the specific missing update before a commitment is made.",
      "يحتاج سجل الأحداث إلى قواعد للجمع والترتيب والاستثناء. ميّز الحدث المسجل عن المتوقع واحتفظ بمصدر كل تحديث وأظهر التعارض. ويحدد موجز المراجعة التحديث الناقص المطلوب قبل تقديم التزام."
    ],
    "flow": [
      "The event record needs collection, chronology and exception rules. Distinguish recorded events from expectations, retain the source of each update and identify contradictions. The review brief should ask for the specific missing update before a commitment is made.",
      "يحتاج سجل الأحداث إلى قواعد للجمع والترتيب والاستثناء. ميّز الحدث المسجل عن المتوقع واحتفظ بمصدر كل تحديث وأظهر التعارض. ويحدد موجز المراجعة التحديث الناقص المطلوب قبل تقديم التزام."
    ],
    "output": [
      "The reviewer needs a dated exception brief and proposed handoff. The operations owner confirms current status and any customer commitment. A carrier lookup, customs submission or message requires an available authorized connection and explicit authority.",
      "يحتاج المراجع إلى موجز استثناء مؤرخ وإحالة مقترحة. يؤكد مسؤول العمليات الحالة الفعلية وأي التزام للعميل. ويحتاج استعلام الناقل أو التقديم الجمركي أو الرسالة إلى اتصال متاح ومصرح به."
    ],
    "accept": [
      "Acceptance: delayed events, conflicting updates and an unavailable source. Measure chronology accuracy, missed exceptions and preparation time. An estimated arrival must remain an estimate until a responsible source confirms the commitment.",
      "القبول: أحداث متأخرة وتحديثات متعارضة ومصدر غير متاح. قِس صحة التسلسل والاستثناءات المفقودة وزمن التجهيز. ويظل الوصول التقديري تقديرًا حتى يؤكد مصدر مسؤول الالتزام."
    ]
  },
  {
    "slug": "procurement",
    "name": [
      "Compare the terms that matter to the purchase",
      "قارن الشروط المؤثرة في قرار الشراء"
    ],
    "audience": [
      "Process owner and authorized reviewer",
      "مسؤول العمل والمراجع المخوّل"
    ],
    "problem": [
      "The lowest price may come with different units, delivery terms or warranty. Define the required items, offers, comparison fields and rules for comparable totals.",
      "قد يصاحب السعر الأقل اختلاف في الوحدات أو التسليم أو الضمان. حدّد الأصناف والعروض وحقول المقارنة وقواعد الإجماليات المتكافئة."
    ],
    "input": [
      "A useful comparison starts with extraction, normalization and comparison requirements. Check units, calculations and the fields essential to a decision. The comparison should retain useful known values when a term is missing and identify the specific evidence needed to complete it.",
      "تبدأ المقارنة المفيدة بمتطلبات الاستخراج وتوحيد القيم والمطابقة. افحص الوحدات والحسابات والحقول الأساسية للقرار. وينبغي أن تحتفظ المقارنة بالقيم المفيدة المعروفة عند غياب شرط وتحدد الدليل اللازم لاستكمالها."
    ],
    "flow": [
      "A useful comparison starts with extraction, normalization and comparison requirements. Check units, calculations and the fields essential to a decision. The comparison should retain useful known values when a term is missing and identify the specific evidence needed to complete it.",
      "تبدأ المقارنة المفيدة بمتطلبات الاستخراج وتوحيد القيم والمطابقة. افحص الوحدات والحسابات والحقول الأساسية للقرار. وينبغي أن تحتفظ المقارنة بالقيم المفيدة المعروفة عند غياب شرط وتحدد الدليل اللازم لاستكمالها."
    ],
    "output": [
      "A reviewable comparison needs references, unresolved terms and questions for the buyer. Purchasing staff approve commercial commitments; technical suitability stays with an authorized specialist. Contacting suppliers or issuing an order requires a configured permitted action.",
      "تحتاج المقارنة القابلة للمراجعة إلى مراجعها والشروط غير المحسومة وأسئلة المشتري. يعتمد مسؤول المشتريات الالتزامات التجارية، وتبقى الملاءمة الفنية للمختص المخوّل. ويحتاج التواصل مع المورد أو إصدار أمر إلى إجراء مضبوط ومسموح."
    ],
    "accept": [
      "Acceptance: check transcription, consistent units and missing-term detection. Add the missing evidence and reassess the same comparison. Do not label an offer best while an essential decision field remains unknown. Measure total review time, including corrections.",
      "القبول: صحة نقل القيم واتساق الوحدات وكشف الشروط الناقصة. أضف الدليل الناقص وأعد تقييم المقارنة نفسها. لا تُسمّ عرضًا الأفضل إذا بقي حقل أساسي مجهولًا. وقِس زمن المراجعة شاملًا التصحيحات."
    ]
  },
  {
    "slug": "receivables",
    "name": [
      "Check the balance before preparing the follow-up",
      "راجع الرصيد قبل تجهيز المتابعة"
    ],
    "audience": [
      "Process owner and authorized reviewer",
      "مسؤول العمل والمراجع المخوّل"
    ],
    "problem": [
      "An overdue invoice may be unpaid, disputed or awaiting a recorded payment update. Identify the source records, aging rules and evidence needed to distinguish those states.",
      "قد تكون الفاتورة المتأخرة غير مدفوعة أو محل نزاع أو تنتظر تسجيل تحديث للسداد. حدّد السجلات وقواعد أعمار المستحقات والأدلة اللازمة لتمييز هذه الحالات."
    ],
    "input": [
      "The balance review needs record-matching, classification and follow-up rules. Specify the handling of disputed and unknown items. An aging summary or worklist must not treat missing payment evidence as proof of nonpayment.",
      "تحتاج مراجعة الرصيد إلى مطابقة السجلات وتصنيف الأرصدة وقواعد للمتابعة والتعامل مع البنود المتنازع عليها والمجهولة. ويجب ألا يعتبر ملخص الأعمار أو قائمة العمل غياب دليل السداد إثباتًا لعدم الدفع."
    ],
    "flow": [
      "The balance review needs record-matching, classification and follow-up rules. Specify the handling of disputed and unknown items. An aging summary or worklist must not treat missing payment evidence as proof of nonpayment.",
      "تحتاج مراجعة الرصيد إلى مطابقة السجلات وتصنيف الأرصدة وقواعد للمتابعة والتعامل مع البنود المتنازع عليها والمجهولة. ويجب ألا يعتبر ملخص الأعمار أو قائمة العمل غياب دليل السداد إثباتًا لعدم الدفع."
    ],
    "output": [
      "Specify a referenced balance-review list and any communication drafts the reviewer needs. Finance staff verify amounts and decide whether to contact the customer. Live payment lookup, ledger synchronization and delivery need available authorized connections.",
      "حدّد قائمة مراجعة أرصدة بمراجعها وما يحتاجه الموظف من مسودات تواصل. يتحقق موظف المالية من المبلغ ويقرر التواصل. ويحتاج الاستعلام الحي والمزامنة والتسليم إلى اتصالات متاحة ومصرح بها."
    ],
    "accept": [
      "Acceptance: incorrect classifications, stale records and conflicting payment evidence. Measure evidence coverage and review time. Administrative preparation does not guarantee collection or establish improved cash flow.",
      "القبول: تصنيف خاطئ وسجل قديم وأدلة سداد متعارضة. قِس تغطية الأدلة ووقت المراجعة. ولا يضمن التجهيز الإداري تحصيلًا أو يثبت تحسن التدفق النقدي."
    ]
  },
  {
    "slug": "customer-operations",
    "name": [
      "Route the request with the context its owner needs",
      "وجّه الطلب بالسياق الذي يحتاجه المسؤول عنه"
    ],
    "audience": [
      "Process owner and authorized reviewer",
      "مسؤول العمل والمراجع المخوّل"
    ],
    "problem": [
      "A question, account change and complaint have different requirements. Define categories, required facts, urgency rules and the person responsible for each decision.",
      "للسؤال وتغيير الحساب والشكوى متطلبات مختلفة. حدّد التصنيفات والحقائق المطلوبة وقواعد الاستعجال وصاحب كل قرار."
    ],
    "input": [
      "Classification and handoff rules should explain ambiguous cases and the actions allowed for each route. A useful case brief records the stated need, relevant context and the proposed route. The responsible person checks that route before any operational assignment.",
      "توضح قواعد التصنيف والإحالة الحالات الملتبسة والإجراءات المسموحة لكل مسار. يسجل موجز الحالة المفيد الاحتياج المذكور والسياق المناسب وجهة الإحالة المقترحة. ويفحص المسؤول المسار قبل أي إسناد تشغيلي."
    ],
    "flow": [
      "Classification and handoff rules should explain ambiguous cases and the actions allowed for each route. A useful case brief records the stated need, relevant context and the proposed route. The responsible person checks that route before any operational assignment.",
      "توضح قواعد التصنيف والإحالة الحالات الملتبسة والإجراءات المسموحة لكل مسار. يسجل موجز الحالة المفيد الاحتياج المذكور والسياق المناسب وجهة الإحالة المقترحة. ويفحص المسؤول المسار قبل أي إسناد تشغيلي."
    ],
    "output": [
      "A useful review output identifies the case category and includes a response or handoff draft. The receiving employee confirms the route and any consequential action. A recommendation alone cannot authorize a refund or account change. Record queue, notification and business-system needs as connection requirements.",
      "يوضح المخرج المفيد للمراجعة تصنيف الحالة ويشمل مسودة رد أو إحالة. يؤكد الموظف المستلم المسار وأي إجراء مؤثر. ولا تفوّض التوصية وحدها رد مال أو تعديل حساب. ووثّق القوائم والإشعارات وتحديث أنظمة العمل كمتطلبات اتصال."
    ],
    "accept": [
      "Acceptance: correct categories, missed urgent cases and complete handoffs. Record why a reviewer changes the route. Measure whether the receiving person can act without repeating intake, alongside the time spent correcting the result.",
      "القبول: صحة التصنيف والحالات العاجلة التي لم تُكتشف واكتمال الإحالة. سجّل سبب تغيير المراجع للمسار، وقِس قدرة المستلم على التصرف دون إعادة استقبال الطلب، مع وقت تصحيح النتيجة."
    ]
  }
] as const

export const headings: Record<string, Copy> = {
  methodology:[
    "Give the agent a job you can evaluate",
    "حدّد مهمة تستطيع تقييم الوكيل عليها"
  ],
  about:[
    "One platform for agents with different jobs",
    "منصة واحدة لوكلاء تختلف مهامهم"
  ],
  industries:[
    "Different industries. Specific work to understand.",
    "افهم المهمة داخل سياق قطاعك"
  ],
  start:[
    "Put the workflow requirements in writing",
    "اكتب متطلبات سير العمل"
  ],
  contact:[
    "Questions about AGYNEXA?",
    "لديك سؤال عن AGYNEXA؟"
  ],
  services:[
    "The capabilities behind a business workflow",
    "القدرات التي يتكوّن منها سير عملك"
  ],
  solutions:[
    "Start with the work your company needs to complete",
    "ابدأ بالعمل الذي تحتاج شركتك إلى إنجازه"
  ],
  architecture:[
    "Understand the system around the agent",
    "افهم ما يحيط بالوكيل داخل النظام"
  ],
  integrations:[
    "Define what the agent needs from each system",
    "حدّد ما يحتاجه الوكيل من كل نظام"
  ],
  security:[
    "Know what is private and what a decision authorizes",
    "اعرف ما يبقى خاصًا وما الذي يسمح به قرارك"
  ],
  resources:[
    "Prepare the work before writing the instructions",
    "وضّح المهمة قبل كتابة التعليمات"
  ],
  agentnexos:[
    "Keep the task and its review in context",
    "اجمع المهمة ومعلومات مراجعتها"
  ]
}
export const summary: Copy = ["AGYNEXA is an Agent Builder Studio for company knowledge and business workflows. Define an agent's role, add approved information and work with its responses in your private workspace.", "AGYNEXA استوديو لبناء الوكلاء حول معرفة المؤسسة وسير العمل. حدّد دور الوكيل، وأضف المعلومات المعتمدة، وتابع إجاباته في مساحة عملك الخاصة."]
