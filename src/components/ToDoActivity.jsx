import { useContext, useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { AuthContext } from "../Context/AuthContext";

const ToDoActivity = ({ formData, setFormData }) => {
  const { t } = useTranslation();
  const [industries, setIndustries] = useState([]);
  const [activities, setActivities] = useState([]);
  const [selectedIndustryId, setSelectedIndustryId] = useState("");
  const [selectedActivityId, setSelectedActivityId] = useState("");
  const [error, setError] = useState("");
  const {
    user: { token },
  } = useContext(AuthContext);

  const commonProps = {
    className: `px-3 py-2 bg-gray-200 rounded-md transition-colors hover:bg-gray-100 focus:bg-white focus-visible:outline-[var(--main-color)] w-full`,
  };

  // Fetch industries on component mount
  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        setError(null);

        if (!token) {
          setError("Authentication token not found");
          return;
        }

        const response = await axios
          .get("http://loujico.somee.com/Api/Settings/GetAllIndustryType", {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          })
          .then((res) => res.data);

        setIndustries(response.data || []);
      } catch (err) {
        console.error("Failed to fetch industries data:", err);
        setError(t("home.dashboardError"));
      }
    };

    fetchIndustries();
  }, []);

  // Fetch activities when industry is selected
  useEffect(() => {
    const fetchActivities = async () => {
      if (!selectedIndustryId) {
        setActivities([]);
        return;
      }

      try {
        setError(null);

        if (!token) {
          setError("Authentication token not found");
          return;
        }

        const response = await axios
          .get(
            `http://loujico.somee.com/Api/Settings/GetActivityByIndustry/${selectedIndustryId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          )
          .then((res) => res.data);

        setActivities(response.data || []);
      } catch (err) {
        console.error("Failed to fetch activities data:", err);
        setError(t("home.dashboardError"));
      }
    };

    fetchActivities();
  }, [selectedIndustryId]);

  // Get industry name by ID
  const getIndustryName = (industryId) => {
    const industry = industries.find((ind) => ind.id == industryId); // Use == for loose comparison
    return industry ? industry.name : "Unknown Industry";
  };

  // Get activity name by ID
  const getActivityName = (activityId) => {
    const activity = activities.find((act) => act.id == activityId); // Use == for loose comparison
    return activity ? activity.name : "Unknown Activity";
  };

  const handleAddActivity = () => {
    if (selectedActivityId && selectedIndustryId) {
      // Get the current activity and industry names
      const activityName = getActivityName(selectedActivityId);
      const industryName = getIndustryName(selectedIndustryId);

      const newActivity = {
        activityId: selectedActivityId,
        activityName: activityName,
        industryId: selectedIndustryId,
        industryName: industryName,
      };

      console.log(newActivity);

      setFormData({
        ...formData,
        activities: [...(formData.activities || []), newActivity],
      });

      // Reset form
      setSelectedIndustryId("");
      setSelectedActivityId("");
      setActivities([]);
    }
  };

  const handleRemoveActivity = (index) => {
    setFormData({
      ...formData,
      activities: formData.activities.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-sm font-medium">
        {t("todoActivity.associatedActivities")}
      </h1>

      <div className="flex justify-between items-center flex-col sm:flex-row gap-2 sm:gap-4">
        {/* Industry Select */}
        <select
          value={selectedIndustryId}
          onChange={(e) => {
            setSelectedIndustryId(e.target.value);
            setSelectedActivityId(""); // Reset activity when industry changes
          }}
          {...commonProps}
        >
          <option value="">{t("todoActivity.chooseIndustry")}</option>
          {industries.map((industry) => (
            <option key={JSON.stringify(industry)} value={industry.id}>
              {industry.name}
            </option>
          ))}
        </select>

        {/* Activity Select */}
        <select
          value={selectedActivityId}
          onChange={(e) => setSelectedActivityId(e.target.value)}
          {...commonProps}
          disabled={!selectedIndustryId}
        >
          <option value="">{t("todoActivity.chooseActivity")}</option>
          {activities.map((activity) => (
            <option key={JSON.stringify(activity)} value={activity.id}>
              {activity.name}
            </option>
          ))}
        </select>
      </div>
      <button
        type="button"
        onClick={handleAddActivity}
        disabled={!selectedActivityId}
        className="px-4 py-2 text-white bg-[var(--main-color)] rounded-md hover:bg-[var(--main-color-darker)] cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {t("todoActivity.addButton")}
      </button>

      {/* Display Added Activities */}
      <div className="flex flex-col gap-2 mt-2">
        {(formData.activities || []).map((activity, index) => {
          return (
            <div
              key={JSON.stringify(activity)}
              className="flex justify-between items-center bg-gray-200 p-2 rounded-md"
            >
              <span>
                {activity.industryName} / {activity.activityName}
              </span>
              <FaTrash
                className="cursor-pointer hover:text-red-500"
                onClick={() => handleRemoveActivity(index)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ToDoActivity;
