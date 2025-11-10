import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import axios from "axios";

const ToDoAddress = ({ formData, setFormData }) => {
  const { t } = useTranslation();
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [allStates, setAllStates] = useState([]); // Store all fetched states
  const [allCities, setAllCities] = useState([]); // Store all fetched cities
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [error, setError] = useState("");

  const commonProps = {
    className: `px-3 py-2 bg-gray-200 rounded-md transition-colors hover:bg-gray-100 focus:bg-white focus-visible:outline-[var(--main-color)] w-full`,
  };

  // Fetch countries on component mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setError(null);
        const token = localStorage.getItem("authToken");

        if (!token) {
          setError("Authentication token not found");
          return;
        }

        const response = await axios
          .get("http://192.168.1.105:8080/api/Location/GetAllCountry", {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          })
          .then((res) => res.data);

        setCountries(response.data || []);
      } catch (err) {
        console.error("Failed to fetch countries:", err);
        setError(t("home.dashboardError"));
      }
    };

    fetchCountries();
  }, []);

  // Fetch states when country is selected
  useEffect(() => {
    const fetchStates = async () => {
      if (!selectedCountry) {
        setStates([]);
        setSelectedState("");
        return;
      }

      try {
        setError(null);
        const token = localStorage.getItem("authToken");

        if (!token) {
          setError("Authentication token not found");
          return;
        }

        const response = await axios
          .get(
            `http://192.168.1.105:8080/api/Location/GetStateByCountry/${selectedCountry}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          )
          .then((res) => res.data);

        const fetchedStates = response.data || [];
        setStates(fetchedStates);
        // Add to allStates for later reference
        setAllStates((prev) => [
          ...prev,
          ...fetchedStates.filter(
            (newState) =>
              !prev.some((existingState) => existingState.id === newState.id)
          ),
        ]);
        setSelectedState(""); // Reset state when country changes
        setCities([]); // Reset cities dropdown
        setSelectedCity(""); // Reset city
        setAddressLine(""); // Reset address line
      } catch (err) {
        console.error("Failed to fetch states:", err);
        setError(t("home.dashboardError"));
      }
    };

    fetchStates();
  }, [selectedCountry]);

  // Fetch cities when state is selected
  useEffect(() => {
    const fetchCities = async () => {
      if (!selectedState) {
        setCities([]);
        setSelectedCity("");
        return;
      }

      try {
        setError(null);
        const token = localStorage.getItem("authToken");

        if (!token) {
          setError("Authentication token not found");
          return;
        }

        const response = await axios
          .get(
            `http://192.168.1.105:8080/api/Location/GetCityByState/${selectedState}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          )
          .then((res) => res.data);

        const fetchedCities = response.data || [];
        setCities(fetchedCities);
        // Add to allCities for later reference
        setAllCities((prev) => [
          ...prev,
          ...fetchedCities.filter(
            (newCity) =>
              !prev.some((existingCity) => existingCity.id === newCity.id)
          ),
        ]);
        setSelectedCity(""); // Reset city when state changes
        setAddressLine(""); // Reset address line
      } catch (err) {
        console.error("Failed to fetch cities:", err);
        setError(t("home.dashboardError"));
      }
    };

    fetchCities();
  }, [selectedState]);

  // Get name by ID helper functions - now using allStates and allCities
  const getCountryName = (countryId) => {
    const country = countries.find((c) => c.id == countryId);
    return country ? country.name : "Unknown Country";
  };

  const getStateName = (stateId) => {
    const state = allStates.find((s) => s.id == stateId);
    return state ? state.name : "Unknown State";
  };

  const getCityName = (cityId) => {
    const city = allCities.find((c) => c.id == cityId);
    return city ? city.name : "Unknown City";
  };

  const handleAddAddress = () => {
    if (selectedCountry && selectedState && selectedCity && addressLine) {
      const newAddress = {
        countryId: parseInt(selectedCountry),
        stateId: parseInt(selectedState),
        cityId: parseInt(selectedCity),
        addressLine: addressLine,
      };

      setFormData({
        ...formData,
        addresses: [...(formData.addresses || []), newAddress],
      });

      // Reset only the form inputs, but keep the allStates and allCities data
      setSelectedCountry("");
      setSelectedState("");
      setSelectedCity("");
      setAddressLine("");
      setStates([]); // Reset dropdown states
      setCities([]); // Reset dropdown cities
    }
  };

  const handleRemoveAddress = (index) => {
    setFormData({
      ...formData,
      addresses: formData.addresses.filter((_, i) => i !== index),
    });
  };

  // Check if add button should be disabled
  const isAddButtonDisabled = () => {
    return !selectedCountry || !selectedState || !selectedCity || !addressLine;
  };

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-sm font-medium">
        {t("todoAddress.associatedAddresses")}
      </h1>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          {/* Country Select */}
          <div className="flex flex-col gap-2 flex-1">
            <label className="text-sm font-medium">
              {t("fields.address.country")}
            </label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              {...commonProps}
            >
              <option value="">{t("todoAddress.chooseCountry")}</option>
              {countries.map((country) => (
                <option key={crypto.randomUUID()} value={country.id}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>

          {/* State Select */}
          <div className="flex flex-col gap-2 flex-1">
            <label className="text-sm font-medium">
              {t("fields.address.state")}
            </label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              {...commonProps}
              disabled={!selectedCountry}
            >
              <option value="">{t("todoAddress.chooseState")}</option>
              {states.map((state) => (
                <option key={crypto.randomUUID()} value={state.id}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          {/* City Select */}
          <div className="flex flex-col gap-2 flex-1">
            <label className="text-sm font-medium">
              {t("fields.address.city")}
            </label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              {...commonProps}
              disabled={!selectedState}
            >
              <option value="">{t("todoAddress.chooseCity")}</option>
              {cities.map((city) => (
                <option key={crypto.randomUUID()} value={city.id}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>

          {/* Address Line Input */}
          <div className="flex flex-col gap-2 flex-1">
            <label className="text-sm font-medium">
              {t("fields.address.addressLine")}
            </label>
            <input
              type="text"
              value={addressLine}
              onChange={(e) => setAddressLine(e.target.value)}
              placeholder={t("todoAddress.enterAddressLine")}
              {...commonProps}
            />
          </div>
        </div>

        {/* Add Button */}
        <button
          type="button"
          onClick={handleAddAddress}
          disabled={isAddButtonDisabled()}
          className="px-4 py-2 text-white bg-[var(--main-color)] rounded-md hover:bg-[var(--main-color-darker)] cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed self-start"
        >
          {t("todoAddress.addButton")}
        </button>
      </div>

      {/* Display Added Addresses */}
      <div className="flex flex-col gap-2 mt-2">
        {(formData.addresses || []).map((address, index) => {
          return (
            <div
              key={crypto.randomUUID()}
              className="flex justify-between items-center bg-gray-200 p-2 rounded-md"
            >
              <span>
                {getCountryName(address.countryId)} /{" "}
                {getStateName(address.stateId)} / {getCityName(address.cityId)}{" "}
                / {address.addressLine}
              </span>
              <FaTrash
                className="cursor-pointer hover:text-red-500"
                onClick={() => handleRemoveAddress(index)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ToDoAddress;
