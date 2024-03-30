// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from "react";
import ReactDatePicker from "react-datepicker";

import styles from "./Form.module.css";
import "react-datepicker/dist/react-datepicker.css";

import Button from "./Button";
import BackButton from "./BackButton";
import Message from "./Message";
import Spinner from "./Spinner";

import { useURLCoordinates } from "../hooks/useURLCoordinates";
import { useCities } from "../hooks/useCities";
import { useNavigate } from "react-router-dom";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";
function Form() {
  const [cityLat, cityLng] = useURLCoordinates();
  const { createCity, isLoading } = useCities();
  const navigate = useNavigate();

  const [isLoadingGeoCoding, setIsLoadingGeoCoding] = useState(false);
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [emoji, setEmoji] = useState("");
  const [geocodingError, setGeocodingError] = useState("");

  useEffect(
    function () {
      if (!cityLat && !cityLng) return;

      async function fetchCityData() {
        try {
          setIsLoadingGeoCoding(true);
          setGeocodingError("");
          const res = await fetch(
            `${BASE_URL}?latitude=${cityLat}&longitude=${cityLng}`
          );
          const data = await res.json();
          console.log(data);

          if (!data.countryCode)
            throw new Error(
              "That doesn't appear to be a valid location, please click somewhere else on the map 👆"
            );

          setCityName(data.city || data.locality || "");
          setCountry(data.countryName);
          setEmoji(convertToEmoji(data.countryCode));
        } catch (err) {
          setGeocodingError(err.message);
        } finally {
          setIsLoadingGeoCoding(false);
        }
      }
      fetchCityData();
    },
    [cityLat, cityLng]
  );

  async function handleSubmit(e) {
    e.preventDefault();

    if (!cityName || !date) return;

    const newCity = {
      cityName,
      country,
      emoji,
      date,
      notes,
      position: { lat: cityLat, lng: cityLng },
    };

    await createCity(newCity);
    setCityName("");
    setDate(new Date());
    setNotes("");

    navigate("/app/cities");
  }

  if (geocodingError) return <Message message={geocodingError} />;

  if (isLoadingGeoCoding) return <Spinner />;

  if (!cityLat && !cityLng)
    return <Message message="Start by clicking on a city on the map 👆" />;
  return (
    <form
      className={`${styles.form} ${isLoading ? styles.loading : ""}`}
      onSubmit={handleSubmit}
      autoComplete="off"
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        {<span className={styles.flag}>{emoji}</span>}
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        <ReactDatePicker
          id="date"
          selected={date}
          onChange={(date) => setDate(date)}
          isClearable
          closeOnScroll={true}
          dateFormat="dd/MM/yyyy"
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <BackButton />
      </div>
    </form>
  );
}

export default Form;
