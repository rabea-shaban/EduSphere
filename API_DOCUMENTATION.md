# 🌐 EduSphere Platform — Complete API Collection & Integration Specification

> **تخاطب واجهات برمجة التطبيقات (API Documentation & Postman Collection)**
> 
> هذا المستند يحتوي على كولكشن كامل بأسلوب **Postman** لربط واجهة المستخدم (Next.js Frontend) بالخلفية (Node.js/Express Backend) لمنصة **EduSphere**.

---

## 📌 1. البيئة والعناوين الأساسية (Base URLs & Environment)

- **Development Server**: `http://localhost:5000/api/v1`
- **Production Server**: `https://api.edusphere.edu.eg/api/v1`
- **Content-Type**: `application/json`
- **Language Header**: `Accept-Language: ar-EG`
- **Authentication**: `Authorization: Bearer <JWT_ACCESS_TOKEN>`

---

## 🔐 2. هيكل الاستجابات النمطية (Standard Response Schemas)

### استجابة النجاح (Success Response 200/201 OK)
```json
{
  "success": true,
  "message": "تمت العملية بنجاح",
  "data": {},
  "meta": {
    "timestamp": "2026-07-26T11:45:00Z"
  }
}
```

### استجابة الخطأ (Error Response 400/401/403/404/500)
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED_ACCESS",
    "message": "بيانات الدخول غير صحيحة أو منتهية الصلاحية",
    "details": []
  }
}
```

---

## 🔑 3. نظام المصادقة والحسابات (Authentication & Account APIs)

### 3.1 إنشاء حساب جديد (Register)
- **POST** `/auth/register`
- **Headers**: `Content-Type: application/json`
- **Body**:
```json
{
  "fullName": "ربيع شعبان",
  "email": "rabie@example.com",
  "phone": "01012345678",
  "system": "general", // "general" | "azhari" | "baccalaureate"
  "stage": "cs_track", // "cs_track" | "secondary3" | "prep" | "primary"
  "password": "Password123!",
  "confirmPassword": "Password123!",
  "termsAgreed": true
}
```
- **Response 201 Created**:
```json
{
  "success": true,
  "message": "تم إنشاء الحساب بنجاح",
  "data": {
    "user": {
      "id": "usr_9981",
      "fullName": "ربيع شعبان",
      "email": "rabie@example.com",
      "role": "student"
    },
    "tokens": {
      "accessToken": "eyJhbGciOi...",
      "refreshToken": "d8a7c6b5..."
    }
  }
}
```

### 3.2 تسجيل الدخول (Login)
- **POST** `/auth/login`
- **Body**:
```json
{
  "identifier": "rabie@example.com", // أو رقم الهاتف 01012345678
  "password": "Password123!",
  "rememberMe": true
}
```
- **Response 200 OK**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "usr_9981",
      "fullName": "ربيع شعبان",
      "email": "rabie@example.com",
      "role": "student", // "student" | "teacher" | "admin"
      "avatar": "https://images.unsplash.com/photo-1534528741775"
    },
    "tokens": {
      "accessToken": "eyJhbGciOi...",
      "refreshToken": "d8a7c6b5..."
    }
  }
}
```

### 3.3 طلب إعادة تعيين كلمة المرور (Forgot Password)
- **POST** `/auth/forgot-password`
- **Body**:
```json
{
  "identifier": "rabie@example.com"
}
```
- **Response 200 OK**:
```json
{
  "success": true,
  "message": "تم إرسال رمز OTP مكون من 6 أرقام إلى البريد/الهاتف"
}
```

### 3.4 حفظ كلمة المرور الجديدة (Reset Password)
- **POST** `/auth/reset-password`
- **Body**:
```json
{
  "code": "123456",
  "newPassword": "NewPassword123!",
  "confirmNewPassword": "NewPassword123!"
}
```

---

## 🎓 4. واجهات الطالب (Student Dashboard APIs)

### 4.1 بيانات لوحة التحكم الرئيسية للطالب
- **GET** `/student/dashboard`
- **Headers**: `Authorization: Bearer <TOKEN>`
- **Response 200 OK**:
```json
{
  "success": true,
  "data": {
    "profile": {
      "name": "ربيع شعبان",
      "stage": "علوم الحاسب والبكالوريا",
      "streakDays": 14,
      "xpPoints": 3450
    },
    "stats": {
      "enrolledCoursesCount": 4,
      "completedLessonsCount": 38,
      "averageQuizScore": 92.5,
      "certificatesEarned": 2
    },
    "weeklyActivity": [
      { "day": "السبت", "hours": 3.5 },
      { "day": "الأحد", "hours": 4.0 },
      { "day": "الإثنين", "hours": 2.5 }
    ]
  }
}
```

### 4.2 استعراض وقراءة درس تفاعلي
- **GET** `/student/lessons/:id`
- **Response 200 OK**:
```json
{
  "success": true,
  "data": {
    "id": "les_101",
    "title": "الدرس 26: تعقيد الخوارزميات Big-O Notation",
    "courseTitle": "أساسيات علوم الحاسب والتفكير الخوارزمي",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    "duration": "24:15",
    "attachments": [
      { "id": "att_1", "title": "ملف شفرات C++ المصدرية.zip", "fileSize": "4.2 MB", "downloadUrl": "/files/att1.zip" }
    ],
    "notes": "ملاحظات الطالب المسجلة هنا..."
  }
}
```

### 4.3 تسليم واجب دراسي
- **POST** `/student/assignments/:id/submit`
- **Headers**: `Authorization: Bearer <TOKEN>`
- **Body (Multipart FormData)**:
  - `file`: `file_solution.pdf`
- **Response 200 OK**:
```json
{
  "success": true,
  "message": "تم تسليم الملف بنجاح وإرساله للمعلم لمراجعته"
}
```

### 4.4 تقديم إجابات اختبار تفاعلي (Submit Quiz)
- **POST** `/student/quizzes/:id/submit`
- **Body**:
```json
{
  "quizId": "quiz_501",
  "answers": [
    { "questionId": "q1", "selectedOption": 1 },
    { "questionId": "q2", "selectedOption": 0 }
  ]
}
```
- **Response 200 OK**:
```json
{
  "success": true,
  "data": {
    "score": 95,
    "passed": true,
    "certificateEarned": true,
    "certificateCode": "EDU-2026-CS-9981"
  }
}
```

---

## 👨‍🏫 5. واجهات المعلم (Teacher Workspace APIs)

### 5.1 إنشاء وتطوير كورس جديد (Create Course)
- **POST** `/teacher/courses`
- **Headers**: `Authorization: Bearer <TOKEN>`
- **Body**:
```json
{
  "title": "أسس البرمجة الهيكلية والتطبيقات التفاعلية بلغة C++",
  "category": "cs", // "cs" | "general" | "azhari" | "baccalaureate"
  "stage": "جميع المراحل",
  "price": 450,
  "description": "اكتسب مهارات كتابة الكود النظيف وتصميم الخوارزميات الكفؤة...",
  "sections": [
    { "title": "الوحدة الأولى: أساسيات التفكير الخوارزمي" },
    { "title": "الوحدة الثانية: البرمجة بلغة C++ وتطبيقاتها" }
  ]
}
```

### 5.2 تقديم طلب سحب أرباح (Withdraw Payout)
- **POST** `/teacher/withdraw`
- **Body**:
```json
{
  "amount": 5000,
  "payoutMethod": "vodafone_cash", // "vodafone_cash" | "instapay" | "bank_account"
  "accountDetails": "01012345678"
}
```
- **Response 200 OK**:
```json
{
  "success": true,
  "message": "تم إرسال طلب السحب بنجاح إلى الإدارة المالية"
}
```

---

## 👑 6. واجهات الإدارة العليا (Super Admin APIs)

### 6.1 اعتماد عملية دفع واشتراك (Approve Payment)
- **POST** `/admin/payments/:id/approve`
- **Headers**: `Authorization: Bearer <ADMIN_TOKEN>`
- **Response 200 OK**:
```json
{
  "success": true,
  "message": "تم اعتماد الشحنة المالية وتفعيل الكورس للطالب فوراً"
}
```

### 6.2 اعتماد وانضمام معلم جديد (Approve Instructor)
- **POST** `/admin/teachers/:id/approve`
- **Response 200 OK**:
```json
{
  "success": true,
  "message": "تم اعتماد المعلم وتفعيل صلاحيات المعلم وصانع المحتوى"
}
```

### 6.3 إرسال إشعار شامل جماعي (Broadcast Notification)
- **POST** `/admin/notifications/broadcast`
- **Body**:
```json
{
  "targetGroup": "all", // "all" | "students" | "teachers"
  "title": "🎉 خصم 25% على كافة كورسات علوم الحاسب",
  "message": "بمناسبة بدء الفصل الدراسي الجديد، احصل على خصم 25% بجميع المسارات."
}
```

### 6.4 إنشاء كوبون خصم جديد (Create Coupon)
- **POST** `/admin/coupons`
- **Body**:
```json
{
  "code": "EDUSPHERE2026",
  "type": "percentage", // "percentage" | "fixed"
  "value": 20,
  "maxUsage": 500
}
```

---

## 🚀 7. كولكشن جاهز للاستيراد في Postman (Postman v2.1 Collection JSON)

يمكنك نسخ وتصدير الكود البرمجي أدناه واستيراده مباشرة في تطبيق **Postman** (`File -> Import`):

```json
{
  "info": {
    "name": "EduSphere Smart Platform API Collection",
    "description": "مجموعة API الشاملة لمنصة EduSphere المتكاملة",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Auth - Register",
      "request": {
        "method": "POST",
        "header": [
          { "key": "Content-Type", "value": "application/json" }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"fullName\": \"ربيع شعبان\",\n  \"email\": \"rabie@example.com\",\n  \"phone\": \"01012345678\",\n  \"system\": \"general\",\n  \"stage\": \"cs_track\",\n  \"password\": \"Password123!\",\n  \"confirmPassword\": \"Password123!\",\n  \"termsAgreed\": true\n}"
        },
        "url": {
          "raw": "{{base_url}}/auth/register",
          "host": ["{{base_url}}"],
          "path": ["auth", "register"]
        }
      }
    },
    {
      "name": "Auth - Login",
      "request": {
        "method": "POST",
        "header": [
          { "key": "Content-Type", "value": "application/json" }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"identifier\": \"rabie@example.com\",\n  \"password\": \"Password123!\",\n  \"rememberMe\": true\n}"
        },
        "url": {
          "raw": "{{base_url}}/auth/login",
          "host": ["{{base_url}}"],
          "path": ["auth", "login"]
        }
      }
    },
    {
      "name": "Admin - Broadcast Notification",
      "request": {
        "method": "POST",
        "header": [
          { "key": "Authorization", "value": "Bearer {{admin_token}}" },
          { "key": "Content-Type", "value": "application/json" }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"targetGroup\": \"all\",\n  \"title\": \"تخصيص خصومات جديدة\",\n  \"message\": \"تم إضافة خصم 25% على مسار علوم الحاسب\"\n}"
        },
        "url": {
          "raw": "{{base_url}}/admin/notifications/broadcast",
          "host": ["{{base_url}}"],
          "path": ["admin", "notifications", "broadcast"]
        }
      }
    }
  ]
}
```
