import { relationFields } from "../fields";
import DashTable from "./DashTable";

const Relations = () => {
  const relations = [
    {
      id: 1,
      project_id: 1,
      employee_id: 101,
      role_on_project: "مدير المشروع",
      joined_at: "2024-06-01T08:00:00Z",
    },
    {
      id: 2,
      project_id: 1,
      employee_id: 102,
      role_on_project: "مصممة واجهات",
      joined_at: "2024-06-01T08:00:00Z",
    },
    {
      id: 3,
      project_id: 1,
      employee_id: 103,
      role_on_project: "مطور back-end",
      joined_at: "2024-06-05T09:30:00Z",
    },
    {
      id: 4,
      project_id: 2,
      employee_id: 101,
      role_on_project: "مدير المشروع",
      joined_at: "2024-07-15T08:00:00Z",
    },
    {
      id: 5,
      project_id: 2,
      employee_id: 104,
      role_on_project: "مطورة تطبيقات",
      joined_at: "2024-07-15T08:00:00Z",
    },
    {
      id: 6,
      project_id: 2,
      employee_id: 105,
      role_on_project: "مصمم UX/UI",
      joined_at: "2024-07-16T10:15:00Z",
    },
    {
      id: 7,
      project_id: 3,
      employee_id: 102,
      role_on_project: "مديرة المشروع",
      joined_at: "2024-08-01T08:00:00Z",
    },
    {
      id: 8,
      project_id: 3,
      employee_id: 103,
      role_on_project: "مطور full-stack",
      joined_at: "2024-08-01T08:00:00Z",
    },
    {
      id: 9,
      project_id: 5,
      employee_id: 101,
      role_on_project: "مدير المشروع",
      joined_at: "2024-08-20T08:00:00Z",
    },
    {
      id: 10,
      project_id: 5,
      employee_id: 105,
      role_on_project: "مصمم جرافيك",
      joined_at: "2024-08-20T08:00:00Z",
    },
  ];
  return (
    <DashTable
      title={"ارتباطات الموظفين"}
      search={"ارتباط موظف"}
      fields={relationFields}
      data={relations}
    />
  );
};
export default Relations;
