export const employeeFields = [
    {
        name: "id",
        title: "popupFields.employee.id",
        type: "hidden"
    },
    {
        name: "firstName",
        title: "popupFields.employee.firstName",
        type: "text",
        required: true
    },
    {
        name: "lastName",
        title: "popupFields.employee.lastName",
        type: "text",
        required: true
    },
    {
        name: "age",
        title: "popupFields.employee.age",
        type: "number",
        min: 18,
        max: 100,
        required: true
    },
    {
        name: "phone",
        title: "popupFields.employee.phone",
        type: "tel",
        required: true
    },
    {
        name: "email",
        title: "popupFields.employee.email",
        type: "email"
    },
    {
        name: "position",
        title: "popupFields.employee.position",
        type: "select",
        options: [
            { value: "manager", label: "popupFields.options.position.manager" },
            { value: "developer", label: "popupFields.options.position.developer" },
            { value: "designer", label: "popupFields.options.position.designer" },
            { value: "analyst", label: "popupFields.options.position.analyst" }
        ]
    },
    {
        name: "serviceDuration",
        title: "popupFields.employee.serviceDuration",
        type: "number",
        suffix: "popupFields.suffix.years"
    },
    {
        name: "salary",
        title: "popupFields.employee.salary",
        type: "number",
        prefix: "$"
    },
    {
        name: "address",
        title: "popupFields.employee.address",
        type: "textarea"
    },
    {
        name: "description",
        title: "popupFields.employee.description",
        type: "textarea"
    },
    {
        name: "profileImage",
        title: "popupFields.employee.profileImage",
        type: "file",
        accept: "image/*"
    },
    {
        name: "isPresent",
        title: "popupFields.employee.isPresent",
        type: "checkbox",
        default: true
    },
];

export const clientFields = [
    {
        name: "id",
        title: "popupFields.client.id",
        type: "hidden"
    },
    {
        name: "customerName",
        title: "popupFields.client.name",
        type: "text",
        required: true
    },
    {
        name: "phone",
        title: "popupFields.client.phone",
        type: "tel",
        required: true
    },
    {
        name: "email",
        title: "popupFields.client.email",
        type: "email",
    },
    {
        name: "industry",
        title: "popupFields.client.industry",
        type: "select",
        options: [
            { value: "technology", label: "popupFields.options.industry.technology" },
            { value: "healthcare", label: "popupFields.options.industry.healthcare" },
            { value: "finance", label: "popupFields.options.industry.finance" },
            { value: "education", label: "popupFields.options.industry.education" }
        ],
    },
    {
        name: "customerAddress",
        title: "popupFields.client.address",
        type: "textarea",
        required: true
    },
    {
        name: "companyDescription",
        title: "popupFields.client.companyDescription",
        type: "textarea",
        required: true
    },
    {
        name: "serviceProvided",
        title: "popupFields.client.serviceProvided",
        type: "text"
    },
    {
        name: "serviceProvidedCompany",
        title: "popupFields.client.serviceProvidedCompany",
        type: "text"
    },
    {
        name: "startDuration",
        title: "popupFields.client.startDuration",
        type: "text"
    },
    {
        name: "endDuration",
        title: "popupFields.client.endDuration",
        type: "text"
    },
];

export const projectFields = [
    {
        name: "id",
        title: "popupFields.project.id",
        type: "hidden"
    },
    {
        name: "title",
        title: "popupFields.project.title",
        type: "text",
        required: true
    },
    {
        name: "description",
        title: "popupFields.project.description",
        type: "textarea"
    },
    {
        name: "clientId",
        title: "popupFields.project.clientId",
        type: "select",
        options: [1, 2, 3]
    },
    {
        name: "startDate",
        title: "popupFields.project.startDate",
        type: "date",
        required: true
    },
    {
        name: "endDate",
        title: "popupFields.project.endDate",
        type: "date",
        required: true
    },
    {
        name: "status",
        title: "popupFields.project.status",
        type: "select",
        options: [
            { value: "planned", label: "popupFields.options.status.planned" },
            { value: "inProgress", label: "popupFields.options.status.inProgress" },
            { value: "completed", label: "popupFields.options.status.completed" },
            { value: "cancelled", label: "popupFields.options.status.cancelled" }
        ]
    },
    {
        name: "price",
        title: "popupFields.project.price",
        type: "text",
    },
    {
        name: "fileName",
        title: "popupFields.project.fileName",
        type: "text",
    },
    {
        name: "filePath",
        title: "popupFields.project.filePath",
        type: "text",
    },
    {
        name: "fileType",
        title: "popupFields.project.fileType",
        type: "text",
    },
];

export const logFields = [
    {
        name: "id",
        title: "popupFields.log.id",
        type: "hidden"
    },
    {
        name: "actionType",
        title: "popupFields.log.actionType",
        type: "select",
        options: [
            { value: "create", label: "popupFields.options.actionType.create" },
            { value: "update", label: "popupFields.options.actionType.update" },
            { value: "delete", label: "popupFields.options.actionType.delete" },
            { value: "view", label: "popupFields.options.actionType.view" }
        ]
    },
    {
        name: "targetTable",
        title: "popupFields.log.targetTable",
        type: "select",
        options: [
            { value: "employees", label: "popupFields.options.targetTable.employees" },
            { value: "clients", label: "popupFields.options.targetTable.clients" },
            { value: "projects", label: "popupFields.options.targetTable.projects" },
            { value: "products", label: "popupFields.options.targetTable.products" }
        ]
    },
    {
        name: "targetId",
        title: "popupFields.log.targetId",
        type: "number"
    },
    {
        name: "userId",
        title: "popupFields.log.userId",
        type: "number"
    },
    {
        name: "actionDescription",
        title: "popupFields.log.actionDescription",
        type: "textarea"
    },
];

export const productFields = [
    {
        name: "id",
        title: "popupFields.product.id",
        type: "hidden"
    },
    {
        name: "productName",
        title: "popupFields.product.name",
        type: "text",
        required: true
    },
    {
        name: "price",
        title: "popupFields.product.price",
        type: "number",
        prefix: "$",
        step: 0.01
    },
    {
        name: "isActive",
        title: "popupFields.product.isActive",
        type: "checkbox",
        default: true
    },
    {
        name: "monthlysubscription",
        title: "popupFields.product.monthlySubscription",
        type: "number",
        prefix: "$",
        step: 0.01
    },
    {
        name: "productDescription",
        title: "popupFields.product.description",
        type: "textarea",
        required: true
    },
];

export const invoiceFields = [
    {
        name: "id",
        title: "popupFields.invoice.id",
        type: "hidden",
        readOnly: true
    },
    {
        name: "clientId",
        title: "popupFields.invoice.clientId",
        type: "select",
        options: []
    },
    {
        name: "projectId",
        title: "popupFields.invoice.projectId",
        type: "select",
        options: []
    },
    {
        name: "amount",
        title: "popupFields.invoice.amount",
        type: "number",
        prefix: "$",
        step: 0.01,
        required: true
    },
    {
        name: "issueDate",
        title: "popupFields.invoice.issueDate",
        type: "date",
        required: true
    },
    {
        name: "dueDate",
        title: "popupFields.invoice.dueDate",
        type: "date",
        required: true
    },
    {
        name: "status",
        title: "popupFields.invoice.status",
        type: "select",
        options: [
            { value: "draft", label: "popupFields.options.invoiceStatus.draft" },
            { value: "sent", label: "popupFields.options.invoiceStatus.sent" },
            { value: "paid", label: "popupFields.options.invoiceStatus.paid" },
            { value: "overdue", label: "popupFields.options.invoiceStatus.overdue" }
        ]
    },
];

export const relationFields = [
    {
        name: "id",
        title: "popupFields.relation.id",
        type: "hidden"
    },
    {
        name: "projectId",
        title: "popupFields.relation.projectId",
        type: "select",
        options: []
    },
    {
        name: "employeeId",
        title: "popupFields.relation.employeeId",
        type: "select",
        options: []
    },
    {
        name: "roleOnProject",
        title: "popupFields.relation.roleOnProject",
        type: "select",
        options: [
            { value: "manager", label: "popupFields.options.role.manager" },
            { value: "developer", label: "popupFields.options.role.developer" },
            { value: "designer", label: "popupFields.options.role.designer" },
            { value: "tester", label: "popupFields.options.role.tester" }
        ]
    },
    {
        name: "joinedAt",
        title: "popupFields.relation.joinedAt",
        type: "date"
    }
];

export const userFields = [
    {
        name: "id",
        title: "popupFields.user.id",
        type: "hidden"
    },
    {
        name: "name",
        title: "popupFields.user.name",
        type: "text",
        required: true
    },
    {
        name: "email",
        title: "popupFields.user.email",
        type: "email",
        required: true
    },
    {
        name: "role",
        title: "popupFields.user.role",
        type: "select",
        options: [
            { value: "admin", label: "popupFields.options.userRole.admin" },
            { value: "user", label: "popupFields.options.userRole.user" },
            { value: "viewer", label: "popupFields.options.userRole.viewer" }
        ],
        required: true
    },
];