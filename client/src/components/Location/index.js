import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { useDispatch, useSelector } from "react-redux";
import {
  UPDATE_LOCATIONS,
  UPDATE_CURRENT_LOCATION,
} from '../../utils/actions';
import { QUERY_LOCATIONS } from '../../utils/queries';
import { idbPromise } from '../../utils/helpers';

function LocationMenu() {
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const { locations } = state;
  const { loading, data: locationData } = useQuery(QUERY_LOCATIONS);

  useEffect(() => {
    if (locationData) {
      dispatch({
        type: UPDATE_LOCATIONS,
        locations: locationData.locations,
      });
      locationData.locations.forEach((location) => {
        idbPromise('locations', 'put', location);
      });
    } else if (!loading) {
      idbPromise('locations', 'get').then((locations) => {
        dispatch({
          type: UPDATE_LOCATIONS,
          locations: locations,
        });
      });
    }
  }, [locationData, loading, dispatch]);

  const handleClick = (id) => {
    dispatch({
      type: UPDATE_CURRENT_LOCATION,
      currentLocation: id,
    });
  };

  return (
    <div>
      <h2>Choose a Location</h2>
      {locations.map((item) => (
        <button
          key={item._id}
          onClick={() => {
            handleClick(item._id);
          }}
        >
          {item.name}
        </button>
      ))}
    </div>
  );
}

export default LocationMenu;
