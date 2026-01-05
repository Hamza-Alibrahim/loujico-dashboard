import DashTable from "./DashTable";
import { industryFields } from "../fields";
import { industryFields as popUpFields } from "../popUpFields";
import { useTranslation } from "react-i18next";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../Context/AuthContext";

const Industries = () => {
  const { t } = useTranslation();
  const [industries, setIndustries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(10);
  const [search, setSearch] = useState("");
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

        const response = await axios
          .get(`http://212.85.25.41:7176/Settings/GetAllIndustryType`, {
            //timeout: 5000,
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          })
          .then((res) => res.data);

        setIndustries(response.data || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(
          err.response?.data?.message || "Failed to fetch industry data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refresh, page, count, search]);

  return (
    <DashTable
      title={t("industry.title")}
      searchPlaceHolder={t("industry.search")}
      url="/Settings"
      name="Industry"
      fields={industryFields}
      data={industries}
      popUpFields={popUpFields}
      loading={loading}
      setRefresh={setRefresh}
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
export default Industries;
