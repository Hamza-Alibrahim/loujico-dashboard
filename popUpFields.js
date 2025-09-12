export const employeeFields = [
    {
        name: "id",
        title: "المعرف",
        type: "hidden" // Usually not editable in forms
    },
    {
        name: "first_name",
        title: "الاسم الأول",
        type: "text",
        required: true
    },
    {
        name: "last_name",
        title: "الاسم الأخير",
        type: "text",
        required: true
    },
    {
        name: "age",
        title: "العمر",
        type: "number",
        min: 18,
        max: 100
    },
    {
        name: "phone",
        title: "رقم الهاتف",
        type: "tel",
        required: true
    },
    {
        name: "email",
        title: "البريد الإلكتروني",
        type: "email"
    },
    {
        name: "position",
        title: "المنصب",
        type: "select",
        options: [
            { value: "manager", label: "مدير" },
            { value: "developer", label: "مطور" },
            { value: "designer", label: "مصمم" },
            { value: "analyst", label: "محلل" }
        ]
    },
    {
        name: "service_duration",
        title: "مدة الخدمة",
        type: "number",
        suffix: "سنوات"
    },
    {
        name: "salary",
        title: "الراتب",
        type: "number",
        prefix: "$"
    },
    {
        name: "address",
        title: "العنوان",
        type: "textarea"
    },
    {
        name: "description",
        title: "الوصف",
        type: "textarea"
    },
    {
        name: "profile_image",
        title: "الصورة الشخصية",
        type: "file",
        accept: "image/*"
    },
    {
        name: "is_present",
        title: "حالة التواجد",
        type: "checkbox",
        default: true
    },
    // {
    //     name: "created_at",
    //     title: "تاريخ الإنشاء",
    //     type: "date",
    //     readOnly: true // Usually auto-generated
    // },
    // {
    //     name: "updated_at",
    //     title: "تاريخ التحديث",
    //     type: "date",
    //     readOnly: true // Usually auto-generated
    // },
    // {
    //     name: "last_visit",
    //     title: "آخر زيارة",
    //     type: "datetime"
    // },
    // {
    //     name: "is_deleted",
    //     title: "حالة الحذف",
    //     type: "checkbox"
    // },
    // {
    //     name: "created_by",
    //     title: "تم الإنشاء بواسطة",
    //     type: "text",
    //     readOnly: true // Usually auto-filled
    // },
    // {
    //     name: "updated_by",
    //     title: "تم التحديث بواسطة",
    //     type: "text",
    //     readOnly: true // Usually auto-filled
    // }
];

export const clientFields = [
    {
        name: "id",
        title: "المعرف",
        type: "hidden"
    },
    {
        name: "name",
        title: "اسم العميل",
        type: "text",
        required: true
    },
    {
        name: "phone",
        title: "رقم الهاتف",
        type: "tel",
        required: true
    },
    {
        name: "email",
        title: "البريد الإلكتروني",
        type: "email"
    },
    {
        name: "industry",
        title: "نوع الصناعة",
        type: "select",
        options: [
            { value: "technology", label: "تكنولوجيا" },
            { value: "healthcare", label: "رعاية صحية" },
            { value: "finance", label: "مالية" },
            { value: "education", label: "تعليم" }
        ]
    },
    {
        name: "address",
        title: "العنوان",
        type: "textarea",
        required: true
    },
    {
        name: "company_description",
        title: "وصف الشركة",
        type: "textarea",
        required: true
    },
    // {
    //     name: "is_deleted",
    //     title: "حالة الحذف",
    //     type: "checkbox"
    // },
    {
        name: "service_provided",
        title: "الخدمة المقدمة",
        type: "text"
    },
    {
        name: "service_provided",
        title: "الخدمة المقدمة من قبل الشركة",
        type: "text"
    },
    {
        name: "start duration",
        title: "مدة العمل",
        type: "text"
    },
    {
        name: "end duration",
        title: "تاريخ الانتهاء",
        type: "text"
    },
    // {
    //     name: "created_at",
    //     title: "تاريخ الإنشاء",
    //     type: "date",
    //     readOnly: true
    // },
    // {
    //     name: "updated_at",
    //     title: "تاريخ التحديث",
    //     type: "date",
    //     readOnly: true
    // },
    // {
    //     name: "last_visit",
    //     title: "آخر زيارة",
    //     type: "datetime"
    // },
    // {
    //     name: "created_by",
    //     title: "تم الإنشاء بواسطة",
    //     type: "text",
    //     readOnly: true
    // },
    // {
    //     name: "updated_by",
    //     title: "تم التحديث بواسطة",
    //     type: "text",
    //     readOnly: true
    // }
];

export const projectFields = [
    {
        name: "id",
        title: "المعرف",
        type: "hidden"
    },
    {
        name: "title",
        title: "عنوان المشروع",
        type: "text",
        required: true
    },
    {
        name: "description",
        title: "وصف المشروع",
        type: "textarea"
    },
    {
        name: "client_id",
        title: "العميل المرتبط",
        type: "select",
        // You would need to fetch clients for options
        options: [1, 2, 3] // Will be populated dynamically
    },
    {
        name: "start_date",
        title: "تاريخ البدء",
        type: "date",
        required: true
    },
    {
        name: "end_date",
        title: "تاريخ الانتهاء",
        type: "date",
        required: true
    },
    {
        name: "status",
        title: "حالة المشروع",
        type: "select",
        options: [
            { value: "planned", label: "مخطط" },
            { value: "in_progress", label: "قيد التنفيذ" },
            { value: "completed", label: "مكتمل" },
            { value: "cancelled", label: "ملغي" }
        ]
    },
    {
        name: "price",
        title: "سعر المشروع",
        type: "text",
    },
    // {
    //     name: "created_at",
    //     title: "تاريخ الإنشاء",
    //     type: "date",
    //     readOnly: true
    // },
    // {
    //     name: "updated_at",
    //     title: "تاريخ التحديث",
    //     type: "date",
    //     readOnly: true
    // },
    // {
    //     name: "last_visit",
    //     title: "آخر زيارة",
    //     type: "datetime"
    // },
    // {
    //     name: "is_deleted",
    //     title: "حالة الحذف",
    //     type: "checkbox"
    // },
    // {
    //     name: "created_by",
    //     title: "تم الإنشاء بواسطة",
    //     type: "text",
    //     readOnly: true
    // },
    // {
    //     name: "updated_by",
    //     title: "تم التحديث بواسطة",
    //     type: "text",
    //     readOnly: true
    // },
    {
        name: "file_name",
        title: "اسم الملف",
        type: "text",
        // readOnly: true // Usually auto-generated from file upload
    },
    {
        name: "file_path",
        title: "مسار الملف",
        type: "text",
        // readOnly: true // Usually auto-generated from file upload
    },
    {
        name: "file_type",
        title: "نوع الملف",
        type: "text",
        // readOnly: true // Usually auto-generated from file upload
    },
    // {
    //     name: "uploaded_at",
    //     title: "تاريخ الرفع",
    //     type: "date",
    //     readOnly: true
    // },
    // {
    //     name: "uploaded_by",
    //     title: "تم الرفع بواسطة",
    //     type: "text",
    //     readOnly: true
    // }
];

export const recordFields = [
    {
        name: "id",
        title: "المعرف",
        type: "hidden"
    },
    {
        name: "action_type",
        title: "نوع الإجراء",
        type: "select",
        options: [
            { value: "create", label: "إنشاء" },
            { value: "update", label: "تحديث" },
            { value: "delete", label: "حذف" },
            { value: "view", label: "عرض" }
        ]
    },
    {
        name: "target_table",
        title: "الجدول المستهدف",
        type: "select",
        options: [
            { value: "employees", label: "الموظفين" },
            { value: "clients", label: "العملاء" },
            { value: "projects", label: "المشاريع" },
            { value: "products", label: "المنتجات" }
        ]
    },
    {
        name: "target_id",
        title: "معرف السجل المستهدف",
        type: "number"
    },
    {
        name: "user_id",
        title: "معرف المستخدم",
        type: "number"
    },
    {
        name: "action_description",
        title: "وصف الإجراء",
        type: "textarea"
    },
    // {
    //     name: "timestamp",
    //     title: "تاريخ ووقت الإجراء",
    //     type: "datetime",
    //     readOnly: true
    // }
];

export const productFields = [
    {
        name: "id",
        title: "المعرف",
        type: "hidden"
    },
    {
        name: "name",
        title: "اسم المنتج",
        type: "text",
        required: true
    },
    {
        name: "price",
        title: "السعر",
        type: "number",
        prefix: "$",
        step: 0.01
    },
    {
        name: "is_active",
        title: "الحالة",
        type: "checkbox",
        default: true
    },
    {
        name: "monthlysubscription",
        title: "الاشتراك الشهري",
        type: "number",
        prefix: "$",
        step: 0.01
    },
    {
        name: "description",
        title: "الوصف",
        type: "textarea",
        required: true
    },
    // {
    //     name: "created_at",
    //     title: "تاريخ الإنشاء",
    //     type: "date",
    //     readOnly: true
    // },
    // {
    //     name: "updated_at",
    //     title: "تاريخ التحديث",
    //     type: "date",
    //     readOnly: true
    // }
];

export const invoiceFields = [
    {
        name: "id",
        title: "رقم الفاتورة",
        type: "hidden",
        readOnly: true // Usually auto-generated
    },
    {
        name: "client_id",
        title: "معرف العميل",
        type: "select",
        // You would need to fetch clients for options
        options: []
    },
    {
        name: "project_id",
        title: "معرف المشروع",
        type: "select",
        // You would need to fetch projects for options
        options: []
    },
    {
        name: "amount",
        title: "المبلغ",
        type: "number",
        prefix: "$",
        step: 0.01,
        required: true
    },
    {
        name: "issue_date",
        title: "تاريخ الإصدار",
        type: "date",
        required: true
    },
    {
        name: "due_date",
        title: "تاريخ الاستحقاق",
        type: "date",
        required: true
    },
    {
        name: "status",
        title: "الحالة",
        type: "select",
        options: [
            { value: "draft", label: "مسودة" },
            { value: "sent", label: "مرسلة" },
            { value: "paid", label: "مدفوعة" },
            { value: "overdue", label: "متأخرة" }
        ]
    },
    // {
    //     name: "created_at",
    //     title: "تاريخ الإنشاء",
    //     type: "date",
    //     readOnly: true
    // },
    // {
    //     name: "updated_at",
    //     title: "تاريخ التحديث",
    //     type: "date",
    //     readOnly: true
    // },
    // {
    //     name: "last_viewed",
    //     title: "آخر زيارة",
    //     type: "datetime"
    // },
    // {
    //     name: "is_deleted",
    //     title: "حالة الحذف",
    //     type: "checkbox"
    // },
    // {
    //     name: "created_by",
    //     title: "تم الإنشاء بواسطة",
    //     type: "text",
    //     readOnly: true
    // },
    // {
    //     name: "updated_by",
    //     title: "تم التحديث بواسطة",
    //     type: "text",
    //     readOnly: true
    // }
];

export const relationFields = [
    {
        name: "id",
        title: "المعرف",
        type: "hidden"
    },
    {
        name: "project_id",
        title: "معرف المشروع",
        type: "select",
        // You would need to fetch projects for options
        options: []
    },
    {
        name: "employee_id",
        title: "معرف الموظف",
        type: "select",
        // You would need to fetch employees for options
        options: []
    },
    {
        name: "role_on_project",
        title: "الدور في المشروع",
        type: "select",
        options: [
            { value: "manager", label: "مدير" },
            { value: "developer", label: "مطور" },
            { value: "designer", label: "مصمم" },
            { value: "tester", label: "مختبر" }
        ]
    },
    {
        name: "joined_at",
        title: "تاريخ الانضمام",
        type: "date"
    }
];

export const userFields = [
    {
        name: "id",
        title: "المعرف",
        type: "hidden"
    },
    {
        name: "name",
        title: "الاسم",
        type: "text",
        required: true
    },
    {
        name: "email",
        title: "البريد الإلكتروني",
        type: "email",
        required: true
    },
    {
        name: "role",
        title: "الدور",
        type: "select",
        options: [
            { value: "admin", label: "مدير النظام" },
            { value: "user", label: "مستخدم" },
            { value: "viewer", label: "مشاهد" }
        ],
        required: true
    },
    // {
    //     name: "created_at",
    //     title: "تاريخ الإنشاء",
    //     type: "date",
    //     readOnly: true
    // },
    // {
    //     name: "updated_at",
    //     title: "تاريخ التحديث",
    //     type: "date",
    //     readOnly: true
    // },
    // {
    //     name: "last_visit",
    //     title: "آخر زيارة",
    //     type: "datetime"
    // },
    // {
    //     name: "created_by",
    //     title: "تم الإنشاء بواسطة",
    //     type: "text",
    //     readOnly: true
    // },
    // {
    //     name: "updated_by",
    //     title: "تم التحديث بواسطة",
    //     type: "text",
    //     readOnly: true
    // }
];