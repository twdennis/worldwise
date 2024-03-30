import Spinner from "./Spinner";
import CityItem from "./CityItem";
import Message from "./Message";

import styles from "./CityList.module.css";
import { useCities } from "../hooks/useCities";

function CityList() {
  const { cities, isLoading } = useCities();

  if (isLoading) return <Spinner />;

  if (!cities.length)
    return <Message message="Add cities to the list by clicking on the map" />;

  return (
    <ul className={styles.cityList}>
      {cities.map((city) => (
        <CityItem city={city} key={city.id} />
      ))}
    </ul>
  );
}

export default CityList;
