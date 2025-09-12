import { useEffect, useState } from "react";
import axios from "axios";
import DashTable from "./DashTable";
import { employeeFields as popUpFields } from "../popUpFields";
import { employeeFields } from "../fields";
import { useTranslation } from "react-i18next";

const Employees = () => {
  const { t } = useTranslation();
  const [employees, setEmployees] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(10);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("authToken");

        if (!token) {
          setError("Authentication token not found");
          return;
        }

        const response = await axios
          .get(
            `http://192.168.1.10:7176/api/Emp/GetAll?Page=${page}&Count=${count}&search=${search}`,
            {
              timeout: 5000,
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          )
          .then((res) => res.data);

        setEmployees(response.data || []);
        setTotal(response.total || response.data?.length || 0);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(
          err.response?.data?.message || "Failed to fetch employee data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refresh, page, count, search]);

  return (
    <DashTable
      title={t("employee.title")}
      searchPlaceHolder={t("employee.search")}
      url="/Emp"
      fields={employeeFields}
      data={employees}
      popUpFields={popUpFields}
      loading={loading}
      setRefresh={setRefresh}
      total={total}
      page={page}
      count={count}
      search={search}
      setPage={setPage}
      setCount={setCount}
      setSearch={setSearch}
      error={error}
    />
  );
};

export default Employees;
