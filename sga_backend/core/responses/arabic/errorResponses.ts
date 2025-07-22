export const ErrorHttpStatusCode = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  CONFLICT: 409,
  GONE: 410,
};

export const ErrorTitle = {
  AUTHENTICATION_ERROR: "مشكلة متعلقة بالمصادقة",
  INVALID_CREDENTIALS: "بيانات اعتماد غير صحيحة",
  LACK_OF_CREDENTIALS: "نقص بيانات الاعتماد",
  TOKEN_EXPIRED: "انتهت صلاحية رمز الوصول",
  INVALID_SIGNUP_DATA: "بيانات تسجيل غير صحيحة",
  INVALID_SIGNIN_DATA: "بيانات تسجيل الدخول غير صحيحة",
  INTERNAL_SERVER_ERROR: "خطأ داخلي في الخادم",
  NOT_FOUND: "المورد غير موجود",
  FORBIDDEN: "الوصول ممنوع",
  USER_ALREADY_EXISTS: "المستخدم موجود مسبقًا",
  INVALID_EMAIL: "البريد الإلكتروني غير صالح",
  INVALID_PASSWORD: "كلمة المرور غير صحيحة",

  // Visitor-related
  VISITOR_ALREADY_EXISTS: "الزائر موجود مسبقًا",
  VISITOR_DELETED: "تم حذف الزائر بنجاح",
  VISITOR_DELETED_PREVIOUSLY: "تم حذف هذا الزائر مسبقًا",
  VISITOR_NAME_MISMATCH: "معلومات اسم الزائر غير متطابقة",

  // Visit-related
  VISIT_NOT_FOUND: "الزيارة غير موجودة",
  INVALID_VISIT_DATA: "بيانات زيارة غير صحيحة",
};

export const ErrorMessage = {
  AUTHENTICATION_ERROR: "خطأ في المصادقة. يرجى تقديم بيانات اعتماد صحيحة.",
  INVALID_CREDENTIALS: "تم تقديم بيانات اعتماد غير صحيحة. حاول مرة أخرى.",
  LACK_OF_CREDENTIALS: "الطلب يفتقر إلى بيانات الاعتماد للمورد المطلوب.",
  TOKEN_EXPIRED:
    "انتهت صلاحية الرمز المقدم. يرجى الحصول على رمز جديد لمتابعة الوصول.",
  INVALID_SIGNUP_DATA:
    "بيانات التسجيل غير صحيحة. يرجى تقديم معلومات صحيحة للتسجيل.",
  INVALID_SIGNIN_DATA:
    "بيانات تسجيل الدخول غير صحيحة. يرجى تقديم معلومات صحيحة للدخول.",
  NOT_FOUND: "المورد المطلوب غير موجود على الخادم.",
  FORBIDDEN: "ليس لديك الصلاحيات اللازمة للوصول إلى هذا المورد.",
  USER_ALREADY_EXISTS:
    "مستخدم بهذا البريد الإلكتروني أو معرف طرف ثالث موجود مسبقًا.",
  INVALID_EMAIL:
    "تم تقديم بريد إلكتروني غير صالح. يرجى تقديم عنوان بريد إلكتروني صحيح.",
  INTERNAL_ERROR: "حدث خطأ داخلي. يرجى المحاولة لاحقًا أو التواصل مع الدعم.",

  INVALID_PASSWORD:
    "تم تقديم كلمة مرور غير صحيحة. يجب أن تكون كلمة المرور مكونة من 8 أحرف على الأقل وتحتوي على أحرف وأرقام.",
  INTERNAL_SERVER_ERROR:
    "حدث خطأ غير متوقع في الخادم. يرجى المحاولة لاحقًا أو التواصل مع الدعم للمساعدة.",

  // Visitor-related
  VISITOR_ALREADY_EXISTS: "الزائر بمعلومات المقدمة موجود مسبقًا في النظام.",
  VISITOR_DELETED: "تم حذف الزائر من النظام بنجاح.",
  VISITOR_DELETED_PREVIOUSLY:
    "تم حذف هذا الزائر مسبقًا. يرجى التواصل مع الدعم لمزيد من المساعدة.",
  VISITOR_NAME_MISMATCH:
    "معلومات الاسم المقدمة للزائر لا تطابق السجل الحالي. يرجى التحقق من البيانات.",

  // Visit-related
  VISIT_NOT_FOUND:
    "لم يتم العثور على الزيارة المطلوبة. يرجى التحقق من معرف الزيارة.",
  INVALID_VISIT_DATA:
    "تم تقديم بيانات زيارة غير صحيحة. يرجى مراجعة المدخلات والمحاولة مرة أخرى.",
};
