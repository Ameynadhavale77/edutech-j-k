// Common UI translations that are used across the site
export const translations = {
  // Navigation
  dashboard: {
    en: "Dashboard",
    hi: "डैशबोर्ड",
    mr: "डॅशबोर्ड",
    ur: "ڈیش بورڈ",
    pa: "ਡੈਸ਼ਬੋਰਡ",
    ks: "ڈیش بورڈ",
    doi: "डैशबोर्ड"
  },
  colleges: {
    en: "Colleges",
    hi: "कॉलेज",
    mr: "महाविद्यालये",
    ur: "کالجز",
    pa: "ਕਾਲਜ",
    ks: "کالج",
    doi: "कॉलेज"
  },
  courses: {
    en: "Courses",
    hi: "कोर्स",
    mr: "अभ्यासक्रम",
    ur: "کورسز",
    pa: "ਕੋਰਸ",
    ks: "کورس",
    doi: "कोर्स"
  },
  assessment: {
    en: "Assessment",
    hi: "मूल्यांकन",
    mr: "मूल्यमापन",
    ur: "تشخیص",
    pa: "ਮੁਲਾਂਕਣ",
    ks: "جانچ",
    doi: "मूल्यांकन"
  },
  profile: {
    en: "Profile",
    hi: "प्रोफ़ाइल",
    mr: "प्रोफाइल",
    ur: "پروفائل",
    pa: "ਪ੍ਰੋਫਾਈਲ",
    ks: "پروفائل",
    doi: "प्रोफ़ाइल"
  },
  logout: {
    en: "Logout",
    hi: "लॉगआउट",
    mr: "लॉगआउट",
    ur: "لاگ آؤٹ",
    pa: "ਲਾਗਆਉਟ",
    ks: "لاگ آؤٹ",
    doi: "लॉगआउट"
  },

  // Common actions
  save: {
    en: "Save",
    hi: "सेव करें",
    mr: "जतन करा",
    ur: "محفوظ کریں",
    pa: "ਸੇਵ ਕਰੋ",
    ks: "محفوظ کریں",
    doi: "सेव करें"
  },
  cancel: {
    en: "Cancel",
    hi: "रद्द करें",
    mr: "रद्द करा",
    ur: "منسوخ کریں",
    pa: "ਰੱਦ ਕਰੋ",
    ks: "منسوخ کریں",
    doi: "रद्द करें"
  },
  submit: {
    en: "Submit",
    hi: "जमा करें",
    mr: "सबमिट करा",
    ur: "جمع کریں",
    pa: "ਜਮ੍ਹਾਂ ਕਰੋ",
    ks: "جمع کریں",
    doi: "जमा करें"
  },
  loading: {
    en: "Loading...",
    hi: "लोड हो रहा है...",
    mr: "लोड होत आहे...",
    ur: "لوڈ ہو رہا ہے...",
    pa: "ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...",
    ks: "لوڈ ہو رہا ہے...",
    doi: "लोड हो रहा है..."
  },

  // Quiz specific
  startAssessment: {
    en: "Start Assessment",
    hi: "मूल्यांकन शुरू करें",
    mr: "मूल्यमापन सुरू करा",
    ur: "تشخیص شروع کریں",
    pa: "ਮੁਲਾਂਕਣ ਸ਼ੁਰੂ ਕਰੋ",
    ks: "جانچ شروع کریں",
    doi: "मूल्यांकन शुरू करें"
  },
  previous: {
    en: "Previous",
    hi: "पिछला",
    mr: "मागील",
    ur: "پچھلا",
    pa: "ਪਿਛਲਾ",
    ks: "پہلے",
    doi: "पिछला"
  },
  next: {
    en: "Next",
    hi: "अगला",
    mr: "पुढील",
    ur: "اگلا",
    pa: "ਅਗਲਾ",
    ks: "اگلا",
    doi: "अगला"
  },
  completeAssessment: {
    en: "Complete Assessment",
    hi: "मूल्यांकन पूरा करें",
    mr: "मूल्यमापन पूर्ण करा",
    ur: "تشخیص مکمل کریں",
    pa: "ਮੁਲਾਂਕਣ ਪੂਰਾ ਕਰੋ",
    ks: "جانچ مکمل کریں",
    doi: "मूल्यांकन पूरा करें"
  },

  // General messages
  welcome: {
    en: "Welcome",
    hi: "स्वागत है",
    mr: "स्वागत आहे",
    ur: "خوش آمدید",
    pa: "ਸਵਾਗਤ ਹੈ",
    ks: "خوش آمدید",
    doi: "स्वागत है"
  },
  error: {
    en: "Error",
    hi: "त्रुटि",
    mr: "त्रुटी",
    ur: "خرابی",
    pa: "ਗਲਤੀ",
    ks: "خرابی",
    doi: "त्रुटि"
  },
  success: {
    en: "Success",
    hi: "सफलता",
    mr: "यश",
    ur: "کامیابی",
    pa: "ਸਫਲਤਾ",
    ks: "کامیابی",
    doi: "सफलता"
  }
};

export function getTranslation(key: string, language: string = 'en'): string {
  const translation = translations[key as keyof typeof translations];
  if (!translation) return key;
  
  // Try the requested language, fallback to English
  return translation[language as keyof typeof translation] || translation.en || key;
}