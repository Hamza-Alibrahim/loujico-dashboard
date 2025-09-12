export const employeeFields = [
    { name: "id", title: "fields.employee.id", width: 80 },
    { name: "firstName", title: "fields.employee.firstName", width: 120 },
    { name: "lastName", title: "fields.employee.lastName", width: 120 },
    { name: "phone", title: "fields.employee.phone", width: 140 },
    { name: "email", title: "fields.employee.email", width: 180 },
    { name: "employeesAddress", title: "fields.employee.address", width: 200 },
    { name: "position", title: "fields.employee.position", width: 150 },
    { name: "age", title: "fields.employee.age", width: 80 },
    { name: "profileImage", title: "fields.employee.profileImage", width: 150 },
    { name: "isPresent", title: "fields.employee.isPresent", width: 120 },
    { name: "employeesDescription", title: "fields.employee.description", width: 200 },
    { name: "serviceDuration", title: "fields.employee.serviceDuration", width: 120 },
    { name: "salary", title: "fields.employee.salary", width: 120 },
    { name: "createdAt", title: "fields.common.createdAt", width: 150 },
    { name: "updatedAt", title: "fields.common.updatedAt", width: 150 },
    { name: "lastVisit", title: "fields.common.lastVisit", width: 150 },
    { name: "isDeleted", title: "fields.common.isDeleted", width: 120 },
    { name: "createdBy", title: "fields.common.createdBy", width: 150 },
    { name: "updatedBy", title: "fields.common.updatedBy", width: 150 },
];

export const clientFields = [
    {
        name: "id",
        title: "fields.client.id",
        width: 80,
    },
    {
        name: "name",
        title: "fields.client.name",
        width: 150,
    },
    {
        name: "phone",
        title: "fields.client.phone",
        width: 130,
    },
    {
        name: "email",
        title: "fields.client.email",
        width: 180,
    },
    {
        name: "address",
        title: "fields.client.address",
        width: 200,
    },
    {
        name: "companyDescription",
        title: "fields.client.companyDescription",
        width: 200,
    },
    {
        name: "industry",
        title: "fields.client.industry",
        width: 150,
    },
    {
        name: "serviceprovided",
        title: "fields.client.serviceProvided",
        width: 150,
    },
    {
        name: "inquiry",
        title: "fields.client.inquiry",
        width: 200,
    },
    {
        name: "workDate",
        title: "fields.client.workDate",
        width: 120
    },
    {
        name: "createdAt",
        title: "fields.common.createdAt",
        width: 140,
    },
    {
        name: "updatedAt",
        title: "fields.common.updatedAt",
        width: 140,
    },
    {
        name: "lastVisit",
        title: "fields.common.lastVisit",
        width: 140,
    },
    {
        name: "isDeleted",
        title: "fields.common.isDeleted",
        width: 120,
    },
    {
        name: "createdBy",
        title: "fields.common.createdBy",
        width: 150,
    },
    {
        name: "updatedBy",
        title: "fields.common.updatedBy",
        width: 150,
    },
];

export const projectFields = [
    {
        name: "id",
        title: "fields.project.id",
        width: 80
    },
    {
        name: "title",
        title: "fields.project.title",
        width: 180
    },
    {
        name: "description",
        title: "fields.project.description",
        width: 250
    },
    {
        name: "clientId",
        title: "fields.project.clientId",
        width: 150
    },
    {
        name: "startDate",
        title: "fields.project.startDate",
        width: 120
    },
    {
        name: "endDate",
        title: "fields.project.endDate",
        width: 120
    },
    {
        name: "status",
        title: "fields.project.status",
        width: 130
    },
    {
        name: "createdAt",
        title: "fields.common.createdAt",
        width: 140
    },
    {
        name: "updatedAt",
        title: "fields.common.updatedAt",
        width: 140
    },
    {
        name: "lastVisit",
        title: "fields.common.lastVisit",
        width: 140
    },
    {
        name: "isDeleted",
        title: "fields.common.isDeleted",
        width: 120
    },
    {
        name: "createdBy",
        title: "fields.common.createdBy",
        width: 150
    },
    {
        name: "updatedBy",
        title: "fields.common.updatedBy",
        width: 150
    },
    {
        name: "fileName",
        title: "fields.project.fileName",
        width: 180
    },
    {
        name: "filepath",
        title: "fields.project.filePath",
        width: 200
    },
    {
        name: "fileType",
        title: "fields.project.fileType",
        width: 120
    },
    {
        name: "uploadedAt",
        title: "fields.project.uploadedAt",
        width: 140
    },
    {
        name: "uploadedBy",
        title: "fields.project.uploadedBy",
        width: 150
    }
];

export const logFields = [
    {
        name: "id",
        title: "fields.log.id",
        width: 80
    },
    {
        name: "actionType",
        title: "fields.log.actionType",
        width: 120
    },
    {
        name: "actionDescription",
        title: "fields.log.actionDescription",
        width: 200
    },
    {
        name: "targetTable",
        title: "fields.log.targetTable",
        width: 150
    },
    {
        name: "targetId",
        title: "fields.log.targetId",
        width: 150
    },
    {
        name: "userId",
        title: "fields.log.userId",
        width: 120
    },
    {
        name: "timestamp",
        title: "fields.log.timestamp",
        width: 160
    }
];

export const invoiceFields = [
    {
        name: "id",
        title: "fields.invoice.id",
        width: 100
    },
    {
        name: "clientId",
        title: "fields.invoice.clientId",
        width: 150
    },
    {
        name: "projectId",
        title: "fields.invoice.projectId",
        width: 180
    },
    {
        name: "amount",
        title: "fields.invoice.amount",
        width: 120
    },
    {
        name: "issueDate",
        title: "fields.invoice.issueDate",
        width: 120
    },
    {
        name: "dueDate",
        title: "fields.invoice.dueDate",
        width: 120
    },
    {
        name: "status",
        title: "fields.invoice.status",
        width: 120
    },
    {
        name: "createdAt",
        title: "fields.common.createdAt",
        width: 120
    },
    {
        name: "updatedAt",
        title: "fields.common.updatedAt",
        width: 120
    },
    {
        name: "lastViewed",
        title: "fields.invoice.lastViewed",
        width: 120
    },
    {
        name: "isDeleted",
        title: "fields.common.isDeleted",
        width: 100
    },
    {
        name: "createdBy",
        title: "fields.common.createdBy",
        width: 150
    },
    {
        name: "updatedBy",
        title: "fields.common.updatedBy",
        width: 150
    }
];

export const relationFields = [
    {
        name: "id",
        title: "fields.relation.id",
        width: 80
    },
    {
        name: "projectId",
        title: "fields.relation.projectId",
        width: 120
    },
    {
        name: "employeeId",
        title: "fields.relation.employeeId",
        width: 120
    },
    {
        name: "roleOnproject",
        title: "fields.relation.roleOnProject",
        width: 150
    },
    {
        name: "joinedAt",
        title: "fields.relation.joinedAt",
        width: 120
    }
];

export const userFields = [
    {
        name: "id",
        title: "fields.user.id",
        width: 80
    },
    {
        name: "first name",
        title: "fields.user.firstName",
        width: 80
    },
    {
        name: "last name",
        title: "fields.user.lastName",
        width: 80
    },
    {
        name: "name",
        title: "fields.user.name",
        width: 150
    },
    {
        name: "email",
        title: "fields.user.email",
        width: 180
    },
    {
        name: "role",
        title: "fields.user.role",
        width: 120
    },
    // {
    //     name: "createdAt",
    //     title: "fields.common.createdAt",
    //     width: 140
    // },
    // {
    //     name: "updatedAt",
    //     title: "fields.common.updatedAt",
    //     width: 140
    // },
    // {
    //     name: "lastVisit",
    //     title: "fields.common.lastVisit",
    //     width: 140
    // },
    // {
    //     name: "isDeleted",
    //     title: "fields.common.isDeleted",
    //     width: 120
    // },
    // {
    //     name: "createdBy",
    //     title: "fields.common.createdBy",
    //     width: 150
    // },
    // {
    //     name: "updatedBy",
    //     title: "fields.common.updatedBy",
    //     width: 150
    // }
];

export const productFields = [
    {
        name: "id",
        title: "fields.product.id",
        width: 80
    },
    {
        name: "name",
        title: "fields.product.name",
        width: 150
    },
    {
        name: "description",
        title: "fields.product.description",
        width: 200
    },
    {
        name: "price",
        title: "fields.product.price",
        width: 120
    },
    {
        name: "monthlysubscription",
        title: "fields.product.monthlySubscription",
        width: 150
    },
    {
        name: "isActive",
        title: "fields.product.isActive",
        width: 100
    },
    {
        name: "createdAt",
        title: "fields.common.createdAt",
        width: 140
    },
    {
        name: "updatedAt",
        title: "fields.common.updatedAt",
        width: 140
    },
    {
        name: "createdBy",
        title: "fields.common.createdBy",
        width: 150
    },
    {
        name: "updatedBy",
        title: "fields.common.updatedBy",
        width: 150
    }
];