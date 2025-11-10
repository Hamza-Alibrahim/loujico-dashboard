export const employeeFields = [
  { name: "id", title: "fields.employee.id", width: 80 },
  { name: "firstName", title: "fields.employee.firstName", width: 120 },
  { name: "lastName", title: "fields.employee.lastName", width: 120 },
  { name: "position", title: "fields.employee.position", width: 150 },
  { name: "salary", title: "fields.employee.salary", width: 120 },
];
export const companyFields = [
  {
    name: "id",
    title: "fields.company.id",
    width: 80,
  },
  {
    name: "name",
    title: "fields.company.Name",
    width: 150,
  },
  {
    name: "comm_No",
    title: "fields.company.Comm_No",
    width: 150,
  },
  {
    name: "tax_No",
    title: "fields.company.Tax_No",
    width: 150,
  },
  {
    name: "found_Date",
    title: "fields.company.Found_Date",
    width: 180,
  },
];
export const clientFields = [
  {
    name: "id",
    title: "fields.client.id",
    width: 80,
  },
  {
    name: "customerName",
    title: "fields.client.name",
    width: 150,
  },
  {
    name: "industry",
    title: "fields.client.industry",
    width: 150,
  },
  {
    name: "workDate",
    title: "fields.client.workDate",
    width: 120,
  },
];
export const projectFields = [
  {
    name: "id",
    title: "fields.project.id",
    width: 80,
  },
  {
    name: "title",
    title: "fields.project.title",
    width: 180,
  },
  {
    name: "startDate",
    title: "fields.project.startDate",
    width: 120,
  },
  {
    name: "endDate",
    title: "fields.project.endDate",
    width: 120,
  },
];

export const logFields = [
  {
    name: "id",
    title: "fields.log.id",
    width: 80,
  },
  {
    name: "actionType",
    title: "fields.log.actionType",
    width: 120,
  },
  {
    name: "action",
    title: "fields.log.actionDescription",
    width: 200,
  },
];
export const invoiceFields = [
  {
    name: "id",
    title: "fields.invoice.id",
    width: 100,
  },
  {
    name: "title",
    title: "fields.invoice.title",
    width: 120,
  },
  {
    name: "amount",
    title: "fields.invoice.amount",
    width: 120,
  },
  {
    name: "invoicesDate",
    title: "fields.invoice.issueDate",
    width: 120,
  },
  {
    name: "dueDate",
    title: "fields.invoice.dueDate",
    width: 120,
  },
];

export const relationFields = [
  {
    name: "id",
    title: "fields.relation.id",
    width: 80,
  },
  {
    name: "projectId",
    title: "fields.relation.projectId",
    width: 120,
  },
  {
    name: "employeeId",
    title: "fields.relation.employeeId",
    width: 120,
  },
  {
    name: "roleOnproject",
    title: "fields.relation.roleOnProject",
    width: 150,
  },
  {
    name: "joinedAt",
    title: "fields.relation.joinedAt",
    width: 120,
  },
];

export const userFields = [
  {
    name: "userid",
    title: "fields.user.id",
    width: 80,
  },
  {
    name: "username",
    title: "fields.user.name",
    width: 150,
  },
  {
    name: "email",
    title: "fields.user.email",
    width: 180,
  },
  {
    name: "roles",
    title: "fields.user.role",
    width: 120,
  },
];

export const productFields = [
  {
    name: "id",
    title: "fields.product.id",
    width: 80,
  },
  {
    name: "productName",
    title: "fields.product.name",
    width: 150,
  },
  {
    name: "price",
    title: "fields.product.price",
    width: 120,
  },
  {
    name: "billingCycle",
    title: "fields.product.monthlySubscription",
    width: 150,
  },
];

export const historyFields = [
  {
    name: "id",
    title: "fields.history.id",
    width: 80,
  },
  {
    name: "tableName",
    title: "fields.history.tableName",
    width: 150,
  },
  {
    name: "recordId",
    title: "fields.history.recordId",
    width: 100,
  },
  {
    name: "columnName",
    title: "fields.history.columnName",
    width: 150,
  },
  {
    name: "oldValue",
    title: "fields.history.oldValue",
    width: 180,
  },
  {
    name: "newValue",
    title: "fields.history.newValue",
    width: 180,
  },
  {
    name: "actionType",
    title: "fields.history.actionType",
    width: 120,
  },
  {
    name: "actionTime",
    title: "fields.history.actionTime",
    width: 160,
  },
];

export const industryFields = [
  {
    name: "id",
    title: "fields.industry.id",
    width: 80,
  },
  {
    name: "name",
    title: "fields.industry.name",
    width: 150,
  },
]

export const legalFields = [
  {
    name: "id",
    title: "fields.legal.id",
    width: 80,
  },
  {
    name: "legalInfo",
    title: "fields.legal.name",
    width: 150,
  },
]

export const contactFields = [
  {
    name: "id",
    title: "fields.contact.id",
    width: 80,
  },
  {
    name: "name",
    title: "fields.contact.name",
    width: 150,
  },
]

export const activityFields = [
  {
    name: "id",
    title: "fields.activity.id",
    width: 80,
  },
  {
    name: "name",
    title: "fields.activity.name",
    width: 150,
  },
  // {
  //   name: "industryId",
  //   title: "fields.activity.industryId",
  //   width: 80,
  // },
  {
    name: "industry",
    title: "fields.activity.industryName",
    width: 80,
  },
]

export const countryFields = [
  {
    name: "id",
    title: "fields.country.id",
    width: 80,
  },
  {
    name: "name",
    title: "fields.country.name",
    width: 80,
  },
]

export const stateFields = [
  {
    name: "id",
    title: "fields.state.id",
    width: 80,
  },
  {
    name: "name",
    title: "fields.state.name",
    width: 80,
  },
]

export const cityFields = [
  {
    name: "id",
    title: "fields.city.id",
    width: 80,
  },
  {
    name: "name",
    title: "fields.city.name",
    width: 80,
  },
]