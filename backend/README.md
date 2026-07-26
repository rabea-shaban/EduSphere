# 🌐 EduSphere Backend API Documentation & Collection Specifications

> **دليل وتوثيق واجهات برمجة التطبيقات (Postman API Collection)**
> 
> يوضح هذا المستند جميع النقاط النهائية (Endpoints)، الرؤوس المطلوب إرسالها (Headers)، ونماذج المدخلات والمخرجات (Payload Schemas) لربط واجهة المستخدم بالخلفية.

---

## 📌 1. إعدادات الاتصال والبيئة (Environment Settings)

- **Base URL**: `http://localhost:5000/api/v1`
- **Default Headers**:
  - `Content-Type: application/json`
  - `Accept-Language: ar-EG`
  - `Authorization: Bearer <JWT_ACCESS_TOKEN>`

---

## 🔐 2. نظام المصادقة والحسابات (`/auth`)

| Endpoint | Method | Description | Body Required | Auth |
| :--- | :--- | :--- | :--- | :--- |
| `/auth/register` | `POST` | إنشاء حساب جديد | `fullName`, `email`, `phone`, `password`, `system`, `stage` | ❌ |
| `/auth/login` | `POST` | تسجيل الدخول | `identifier`, `password`, `rememberMe` | ❌ |
| `/auth/forgot-password` | `POST` | طلب رمز استعادة كلمة المرور | `identifier` | ❌ |
| `/auth/reset-password` | `POST` | تغيير كلمة المرور بواسطة OTP | `code`, `newPassword`, `confirmNewPassword` | ❌ |
| `/auth/refresh-token` | `POST` | تجديد Access Token | `refreshToken` | ❌ |

---

## 🎓 3. واجهات الطالب (`/student`)

| Endpoint | Method | Description | Body Required | Auth |
| :--- | :--- | :--- | :--- | :--- |
| `/student/dashboard` | `GET` | إحصائيات ونشاط الطالب | - | 🔑 Student |
| `/student/courses` | `GET` | قائمة الكورسات المسجل بها | - | 🔑 Student |
| `/student/lessons/:id` | `GET` | تفاصيل الدرس ورابط الفيديو | - | 🔑 Student |
| `/student/quizzes/:id/submit` | `POST` | تسليم إجابات الاختبار الفوري | `quizId`, `answers[]` | 🔑 Student |
| `/student/assignments/:id/submit` | `POST` | رفع ملف الواجب الدراسي | Multipart Form (`file`) | 🔑 Student |

---

## 👨‍🏫 4. واجهات المعلم والمحاضر (`/teacher`)

| Endpoint | Method | Description | Body Required | Auth |
| :--- | :--- | :--- | :--- | :--- |
| `/teacher/dashboard` | `GET` | إحصائيات المعلم والإيرادات | - | 🔑 Teacher |
| `/teacher/courses` | `POST` | إنشاء وتصنيع كورس جديد | `title`, `category`, `price`, `description`, `sections[]` | 🔑 Teacher |
| `/teacher/lessons` | `POST` | إضافة درس مرئي جديد | `courseId`, `title`, `videoUrl` | 🔑 Teacher |
| `/teacher/withdraw` | `POST` | طلب سحب الأرباح | `amount`, `payoutMethod`, `accountDetails` | 🔑 Teacher |

---

## 👑 5. واجهات الإدارة العليا (`/admin`)

| Endpoint | Method | Description | Body Required | Auth |
| :--- | :--- | :--- | :--- | :--- |
| `/admin/payments/:id/approve` | `POST` | اعتماد إيصال الدفع وتفعيل الكورس | - | 👑 Admin |
| `/admin/teachers/:id/approve` | `POST` | تفعيل حساب المعلم بالمناصة | - | 👑 Admin |
| `/admin/notifications/broadcast` | `POST` | إرسال إشعار شامل لكافة الطلاب | `targetGroup`, `title`, `message` | 👑 Admin |
| `/admin/coupons` | `POST` | إنشاء كوبون خصم جديد | `code`, `type`, `value`, `maxUsage` | 👑 Admin |

---

## 📄 توثيق كامل متوفر في الجذر:
للحصول على توثيق Postman المكتمل وكود الاستيراد JSON المباشر، راجع الملف القياسي: [`API_DOCUMENTATION.md`](../API_DOCUMENTATION.md)
