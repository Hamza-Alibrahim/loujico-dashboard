// import DashTable from "./DashTable";
// import { invoiceFields as popUpFields } from "../popUpFields";
// import { invoiceFields } from "../fields";
// import { useTranslation } from "react-i18next";
// import { useState, useEffect } from "react";
// import axios from "axios";

// const Invoices = () => {
//   const { t } = useTranslation();
//   const [invoices, setInvoices] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [refresh, setRefresh] = useState(false);
//   const [refreshTotal, setRefreshTotal] = useState(false);
//   const [page, setPage] = useState(1);
//   const [count, setCount] = useState(10);
//   const [search, setSearch] = useState("");
//   const [total, setTotal] = useState(0);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         setError(null);
//         const token = localStorage.getItem("authToken");

//         if (!token) {
//           setError("Authentication token not found");
//           return;
//         }

//         if (search) {
//           const response = await axios
//             .get(
//               `http://loujico.somee.com/Api/Invoices/Search?page=${page}&count=${count}&name=${search}`,
//               {
//                 //timeout: 5000,
//                 headers: {
//                   Authorization: `Bearer ${token}`,
//                   "Content-Type": "application/json",
//                 },
//               }
//             )
//             .then((res) => res.data);

//           setInvoices(response.data || []);
//         } else {
//           const response = await axios
//             .get(
//               `http://loujico.somee.com/Api/Invoices/GetAll?page=${page}&count=${count}`,
//               {
//                 //timeout: 5000,
//                 headers: {
//                   Authorization: `Bearer ${token}`,
//                   "Content-Type": "application/json",
//                 },
//               }
//             )
//             .then((res) => res.data);

//           setInvoices(response.data || []);
//         }
//       } catch (err) {
//         console.error("Error fetching data:", err);
//         setError(err.response?.data?.message || "Failed to fetch invoice data");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [refresh, page, count, search]);

//   useEffect(() => {
//     const fetchCount = async () => {
//       try {
//         const token = localStorage.getItem("authToken");

//         if (!token) {
//           setError("Authentication token not found");
//           return;
//         }

//         const response = await axios
//           .get(`http://loujico.somee.com/Api/Invoices/GetCount`, {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           })
//           .then((res) => res.data);

//         setTotal(response.data);
//         return response.data;
//       } catch (err) {
//         console.error(
//           t("dashTable.errors.updateFailed", { item: t("invoice.search") }),
//           err
//         );
//       }
//     };

//     fetchCount();
//   }, [refreshTotal]);

//   return (
//     <DashTable
//       title={t("invoice.title")}
//       searchPlaceHolder={t("invoice.search")}
//       name={"invoice"}
//       url="/Invoices"
//       fields={invoiceFields}
//       data={invoices}
//       popUpFields={popUpFields}
//       loading={loading}
//       setRefresh={setRefresh}
//       setRefreshTotal={setRefreshTotal}
//       total={total}
//       page={page}
//       count={count}
//       search={search}
//       setPage={setPage}
//       setCount={setCount}
//       setSearch={setSearch}
//       error={error}
//     />
//   );
// };

// export default Invoices;
