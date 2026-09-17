// هذا الرابط يأخذ عنوان السيرفر المباشر في بيئة الإنتاج، ويعود لـ localhost أثناء التجربة المحلية
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';