import { useContext, useEffect, useState } from "react";
import axios from "axios";
import DashTable from "./DashTable";
import { employeeFields as popUpFields } from "../popUpFields";
import { employeeFields } from "../fields";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../Context/AuthContext";

const Employees = () => {
  const { t } = useTranslation();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [refreshTotal, setRefreshTotal] = useState(false);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(10);
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState(0);
  const {
    user: { token },
  } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!token) {
          setError("Authentication token not found");
          return;
        }

        if (search) {
          const response = await axios
            .get(
              `http://loujico.somee.com/Api/Emp/Search?page=${page}&count=${count}&name=${search}`,
              {
                // //timeout: 5000,
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            )
            .then((res) => res.data);

          setEmployees(response.data || []);
        } else {
          const response = await axios
            .get(
              `http://loujico.somee.com/Api/Emp/GetAll?page=${page}&count=${count}`,
              {
                //timeout: 5000,
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            )
            .then((res) => res.data);

          setEmployees(response.data || []);
        }
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

  useEffect(() => {
    const fetchCount = async () => {
      try {
        if (!token) {
          setError("Authentication token not found");
          return;
        }

        const response = await axios
          .get(`http://loujico.somee.com/Api/Emp/GetCount`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          })
          .then((res) => res.data);

        setTotal(response.data);
        return response.data;
      } catch (err) {
        console.error(
          t("dashTable.errors.updateFailed", { item: t("employee.search") }),
          err
        );
      }
    };

    fetchCount();
  }, [refreshTotal]);

  return (
    <DashTable
      title={t("employee.title")}
      searchPlaceHolder={t("employee.search")}
      name={"employee"}
      url="/Emp"
      fields={employeeFields}
      data={employees}
      popUpFields={popUpFields}
      loading={loading}
      setRefresh={setRefresh}
      setRefreshTotal={setRefreshTotal}
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
