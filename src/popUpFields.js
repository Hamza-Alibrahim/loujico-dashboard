export const employeeFields = [
  {
    name: "id",
    title: "popupFields.employee.id",
    type: "hidden",
  },
  {
    name: "firstName",
    title: "popupFields.employee.firstName",
    type: "text",
    required: true,
  },
  {
    name: "lastName",
    title: "popupFields.employee.lastName",
    type: "text",
    required: true,
  },
  {
    name: "age",
    title: "popupFields.employee.age",
    type: "number",
    min: 18,
    max: 100,
    required: true,
  },
  {
    name: "phone",
    title: "popupFields.employee.phone",
    type: "tel",
    required: true,
  },
  {
    name: "email",
    title: "popupFields.employee.email",
    type: "email",
  },
  {
    name: "position",
    title: "popupFields.employee.position",
    type: "select",
    options: [
      { value: "manager", label: "popupFields.options.position.manager" },
      { value: "developer", label: "popupFields.options.position.developer" },
      { value: "designer", label: "popupFields.options.position.designer" },
      { value: "analyst", label: "popupFields.options.position.analyst" },
    ],
  },
  {
    name: "serviceDuration",
    title: "popupFields.employee.serviceDuration",
    type: "number",
    suffix: "popupFields.suffix.years",
  },
  {
    name: "salary",
    title: "popupFields.employee.salary",
    type: "number",
    prefix: "$",
  },
  {
    name: "employeesAddress",
    title: "popupFields.employee.address",
    type: "textarea",
  },
  {
    name: "employeesDescription",
    title: "popupFields.employee.description",
    type: "textarea",
  },
  {
    name: "profileImage",
    title: "popupFields.employee.profileImage",
    type: "hidden",
    accept: "image/*",
  },
  {
    name: "isPresent",
    title: "popupFields.employee.isPresent",
    type: "checkbox",
    default: true,
  },
  {
    type: "file",
  },
];

export const clientFields = [
  {
    name: "id",
    title: "popupFields.client.id",
    type: "hidden",
  },
  {
    name: "customerName",
    title: "popupFields.client.name",
    type: "text",
    required: true,
  },
  {
    name: "phone",
    title: "popupFields.client.phone",
    type: "tel",
    required: true,
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
      { value: "education", label: "popupFields.options.industry.education" },
    ],
  },
  {
    name: "customerAddress",
    title: "popupFields.client.address",
    type: "textarea",
    required: true,
  },
  {
    name: "companyDescription",
    title: "popupFields.client.companyDescription",
    type: "textarea",
    required: true,
  },
  {
    name: "serviceProvided",
    title: "popupFields.client.serviceProvided",
    type: "text",
  },
  {
    name: "inquiry",
    title: "popupFields.client.serviceProvidedCompany",
    type: "text",
  },
  {
    name: "workDuration",
    title: "popupFields.client.workDuration",
    type: "text",
  },
  {
    name: "workDate",
    title: "popupFields.client.workDate",
    type: "date",
  },
];

// export const companyDetailFields = [
//   {
//     name: "name",
//     title: "fields.companyDetailFields.company.name",
//     type: "text",
//     // required: true
//   },
//   {
//     name: "comm_No",
//     title: "fields.companyDetailFields.company.commNo",
//     type: "number",
//     // required: true
//   },
//   {
//     name: "tax_No",
//     title: "fields.companyDetailFields.company.taxNo",
//     type: "number",
//     // required: true
//   },
//   {
//     name: "found_Date",
//     title: "fields.companyDetailFields.company.foundDate",
//     type: "date",
//     // required: true
//   },
//   {
//     name: "companyDescription",
//     title: "fields.companyDetailFields.company.description",
//     type: "text",
//     // required: true
//   },
//   {
//     name: "legalId",
//     title: "fields.companyContactFields.legal.id",
//     type: "text",
//   },
// ];
// export const companyAddressesFields = [
//   {
//     name: "countryId",
//     title: "fields.companyAddressFields.address.country",
//     type: "select",
//   },
//   {
//     name: "stateId",
//     title: "fields.companyAddressFields.address.state",
//     type: "select",
//   },
//   {
//     name: "cityId",
//     title: "fields.companyAddressFields.address.city",
//     type: "select",
//   },
//   {
//     name: "addressLine",
//     title: "fields.companyAddressFields.address.addressLine",
//     type: "text",
//   },
// ];
// export const companyContactFields = [
//   {
//     name: "contactTypeId",
//     title: "fields.companyContactFields.contact.type",
//     type: "select",
//   },
//   {
//     name: "name",
//     title: "fields.companyContactFields.contact.name",
//     type: "text",
//   },
// ];
// export const companyLegalFields = [

// ];
// export const companyActivitiesFields = [
//   {
//     name: "name",
//     title: "fields.companyActivityFields.activity.name",
//     type: "text",
//   },
//   {
//     name: "industryId",
//     title: "fields.companyActivityFields.activity.industry",
//     type: "select",
//   },
// ];
// export const companyEmployeesFields = [
//   {
//     name: "firstName",
//     title: "fields.companyEmployeeFields.employee.firstName",
//     type: "text",
//   },
//   {
//     name: "lastName",
//     title: "fields.companyEmployeeFields.employee.lastName",
//     type: "text",
//   },
//   {
//     name: "position",
//     title: "fields.companyEmployeeFields.employee.position",
//     type: "text",
//   },
//   {
//     name: "phone",
//     title: "fields.companyEmployeeFields.employee.phone",
//     type: "text",
//   },
//   {
//     name: "email",
//     title: "fields.companyEmployeeFields.employee.email",
//     type: "email",
//   },
//   {
//     name: "notes",
//     title: "fields.companyEmployeeFields.employee.notes",
//     type: "text",
//   },
//   {
//     name: "department",
//     title: "fields.companyEmployeeFields.employee.department",
//     type: "text",
//   },
// ];
export const companyFields = [
  {
    name: "name",
    title: "fields.companyDetailFields.company.name",
    type: "text",
    required: true,
  },
  {
    name: "comm_No",
    title: "fields.companyDetailFields.company.commNo",
    type: "text",
    required: true,
  },
  {
    name: "tax_No",
    title: "fields.companyDetailFields.company.taxNo",
    type: "text",
    required: true,
  },
  {
    name: "found_Date",
    title: "fields.companyDetailFields.company.foundDate",
    type: "date",
    required: true,
  },
  {
    name: "companyDescription",
    title: "fields.companyDetailFields.company.description",
    type: "textarea",
    required: true,
  },
  {
    name: "legalId",
    title: "fields.companyContactFields.legal.id",
    type: "select",
    api: "http://192.168.1.105:8080/api/Settings/GetAllLegalType",
  },
  // company: companyDetailFields,
  // addresses: companyAddressesFields,
  // activities: companyActivitiesFields,
  // contacts: companyContactFields,
  // legals: companyLegalFields,
  // employees: companyEmployeesFields,
];

export const projectFields = [
  {
    name: "id",
    title: "popupFields.project.id",
    type: "hidden",
  },
  {
    name: "companyId",
    title: "popupFields.project.companyId",
    type: "select",
    api: "http://192.168.1.105:8080/api/Company/GetAllId",
  },
  {
    name: "title",
    title: "popupFields.project.title",
    type: "text",
    required: true,
  },
  {
    name: "startDate",
    title: "popupFields.project.startDate",
    type: "date",
    required: true,
  },
  {
    name: "endDate",
    title: "popupFields.project.endDate",
    type: "date",
    required: true,
  },
  {
    name: "status",
    title: "popupFields.project.status",
    type: "select",
    options: [
      { value: "planned", label: "popupFields.options.status.planned" },
      { value: "inProgress", label: "popupFields.options.status.inProgress" },
      { value: "completed", label: "popupFields.options.status.completed" },
      { value: "cancelled", label: "popupFields.options.status.cancelled" },
    ],
  },
  {
    name: "price",
    title: "popupFields.project.price",
    type: "text",
  },
  {
    name: "progress",
    title: "popupFields.project.progress",
    type: "number",
    max: 100,
    min: 1
  },
  {
    type: "employee",
  },
  {
    type: "file",
  },
];

export const productFields = [
  {
    name: "id",
    title: "popupFields.product.id",
    type: "hidden",
  },
  {
    name: "productName",
    title: "popupFields.product.name",
    type: "text",
    required: true,
  },
  {
    name: "price",
    title: "popupFields.product.price",
    type: "number",
    prefix: "$",
    step: 0.01,
  },
  {
    name: "isActive",
    title: "popupFields.product.isActive",
    type: "checkbox",
    default: true,
  },
  {
    name: "billingCycle",
    title: "popupFields.product.billingCycle",
    type: "select",
    options: [
      { value: "Monthly", label: "popupFields.options.billingCycle.monthly" },
      {
        value: "Quarterly",
        label: "popupFields.options.billingCycle.quarterly",
      },
      { value: "Yearly", label: "popupFields.options.billingCycle.yearly" },
      { value: "OneTime", label: "popupFields.options.billingCycle.oneTime" },
    ],
  },
  {
    name: "productDescription",
    title: "popupFields.product.description",
    type: "textarea",
    required: true,
  },
  {
    type: "employee",
  },
  {
    type: "file",
  },
];

export const invoiceFields = [
  {
    name: "id",
    title: "popupFields.invoice.id",
    type: "hidden",
    readOnly: true,
  },
  {
    name: "title",
    title: "popupFields.invoice.title",
    type: "text",
  },
  {
    name: "clientId",
    title: "popupFields.invoice.clientId",
    type: "select",
    api: "http://192.168.1.105:8080/api/Customer/GetAllId",
  },
  {
    name: "projectId",
    title: "popupFields.invoice.projectId",
    type: "select",
    api: "http://192.168.1.105:8080/api/Project/GetAllId",
  },
  {
    name: "amount",
    title: "popupFields.invoice.amount",
    type: "number",
    prefix: "$",
    step: 0.01,
    required: true,
  },
  {
    name: "issueDate",
    title: "popupFields.invoice.issueDate",
    type: "date",
    required: true,
  },
  {
    name: "dueDate",
    title: "popupFields.invoice.dueDate",
    type: "date",
    required: true,
  },
  {
    name: "status",
    title: "popupFields.invoice.status",
    type: "select",
    options: [
      { value: "draft", label: "popupFields.options.invoiceStatus.draft" },
      { value: "sent", label: "popupFields.options.invoiceStatus.sent" },
      { value: "paid", label: "popupFields.options.invoiceStatus.paid" },
      { value: "overdue", label: "popupFields.options.invoiceStatus.overdue" },
    ],
  },
];

export const userFields = [
  {
    name: "userid",
    title: "popupFields.user.id",
    type: "hidden",
  },
  {
    name: "username",
    title: "popupFields.user.name",
    type: "text",
    required: true,
  },
  {
    name: "email",
    title: "popupFields.user.email",
    type: "email",
    required: true,
  },
  {
    name: "password",
    title: "popupFields.user.passWord",
    type: "text",
    required: true,
  },
  {
    name: "roles",
    title: "popupFields.user.role",
    type: "select",
    options: [
      { value: "Admin", label: "popupFields.options.userRole.admin" },
      // { value: "User", label: "popupFields.options.userRole.user" },
      // { value: "Viewer", label: "popupFields.options.userRole.viewer" },
    ],
    required: true,
  },
];

export const industryFields = [
  {
    name: "Name",
    title: "fields.industry.name",
    type: "text",
    required: true,
  },
];

export const legalFields = [
  {
    name: "Name",
    title: "fields.legal.name",
    type: "text",
    required: true,
  },
];

export const contactFields = [
  {
    name: "Name",
    title: "fields.contact.name",
    type: "text",
    required: true,
  },
];

export const activityFields = [
  {
    name: "Name",
    title: "fields.activity.name",
    type: "text",
    required: true,
  },
  {
    name: "IndustryId",
    title: "fields.activity.industryName",
    type: "select",
    api: "http://192.168.1.105:8080/api/Settings/GetAllIndustryType",
    required: true,
  },
];

export const addCompanyFields = {
  employee: [
    {
      name: "firstName",
      title: "fields.employee.firstName",
      type: "text",
      required: true,
    },
    {
      name: "lastName",
      title: "fields.employee.lastName",
      type: "text",
      required: true,
    },
    {
      name: "position",
      title: "fields.employee.position",
      type: "text",
      required: true,
    },
    {
      name: "department",
      title: "fields.employee.department",
      type: "text",
    },
    {
      name: "notes",
      title: "fields.employee.notes",
      type: "textarea",
    },
    {
      type: "contact",
    },
  ],
  contact: [
    {
      type: "contact",
    },
  ],
  activity: [
    {
      type: "activity",
    },
  ],
  address: [
    {
      type: "address"
    }
  ]
  ,
  file: [
    {
      type: "file",
    },
  ],
  company: [
    {
      type: "company",
    },
  ],
};

export const countryFields = [
  {
    name: "name",
    title: "fields.country.name",
    type: "text",
    required: true,
  },
];

export const stateFields = [
  {
    name: "id",
    title: "fields.state.countryId",
    type: "select",
    api: "http://192.168.1.105:8080/api/Location/GetAllCountry",
    required: true,
  },
  {
    name: "name",
    title: "fields.state.name",
    type: "text",
    required: true,
  },
];

export const cityFields = [
  {
    name: "id",
    title: "fields.city.stateId",
    type: "select",
    api: "http://192.168.1.105:8080/api/Location/GetAllState",
    required: true,
  },
  {
    name: "name",
    title: "fields.city.name",
    type: "text",
    required: true,
  },
];
