import DashTable from "./DashTable";
import { historyFields } from "../fields";
import { useTranslation } from "react-i18next";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../Context/AuthContext";

const History = ({ url, id }) => {
  const { t } = useTranslation();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {
    user: { token, role },
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
          .get(
            `http://212.85.25.41:7176/${url}/EditHistory?page=${1}&count=${10}&id=${id}`,
            {
              //timeout: 5000,
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          )
          .then((res) => res.data);

        setHistory(response.data || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.response?.data?.message || "Failed to fetch history data");
      } finally {
        setLoading(false);
      }
    };

    if (role === "Admin") {
      fetchData();
    }
  }, []);

  if (!history.length) {
    return null;
  }

  return (
    <DashTable
      title={t("history.title")}
      searchPlaceHolder={""}
      url="/History"
      fields={historyFields}
      data={history}
      popUpFields={[]}
      loading={false}
      setRefresh={() => {}}
      setRefreshTotal={() => {}}
      total={0}
      page={1}
      count={10}
      search={""}
      setPage={() => {}}
      setCount={() => {}}
      setSearch={() => {}}
      error={error}
    />
  );
};

export default History;
