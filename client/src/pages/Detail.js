import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import Calendar from '../components/Calendar';
import { useDispatch, useSelector } from "react-redux";
// import { useStoreContext } from '../utils/GlobalState';
import {
  REMOVE_FROM_CALENDAR,
  UPDATE_CALENDAR_QUANTITY,
  ADD_TO_CALENDAR,
  UPDATE_SHIFTS,
} from '../utils/actions';
import { QUERY_SHIFTS } from '../utils/queries';
import { idbPromise } from '../utils/helpers';
import spinner from '../assets/spinner.gif';

function Detail() {
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const { id } = useParams();

  const [currentShift, setCurrentShift] = useState({});

  const { loading, data } = useQuery(QUERY_SHIFTS);

  const { shifts, calendar } = state;

  useEffect(() => {
    // already in global store
    if (shifts.length) {
      setCurrentShift(shifts.find((shift) => shift._id === id));
    }
    // retrieved from server
    else if (data) {
      dispatch({
        type: UPDATE_SHIFTS,
        shifts: data.Shifts,
      });

      data.shifts.forEach((shift) => {
        idbPromise('shifts', 'put', shift);
      });
    }
    // get cache from idb
    else if (!loading) {
      idbPromise('shifts', 'get').then((indexedShifts) => {
        dispatch({
          type: UPDATE_SHIFTS,
          shifts: indexedShifts,
        });
      });
    }
  }, [shifts, data, loading, dispatch, id]);

  const addToCalendar = () => {
    const shiftOnCalendar = calendar.find((calendarItem) => calendarItem._id === id);
    if (shiftOnCalendar) {
      dispatch({
        type: UPDATE_CALENDAR_QUANTITY,
        _id: id,
        shiftQuantity: parseInt(shiftOnCalendar.shiftQuantity) + 1,
      });
      idbPromise('calendar', 'put', {
        ...itemInCalendar,
        shiftQuantity: parseInt(shiftOnCalendar.shiftQuantity) + 1,
      });
    } else {
      dispatch({
        type: ADD_TO_CALENDAR,
        shift: { ...currentShift, shiftQuantity: 1 },
      });
      idbPromise('calendar', 'put', { ...currentShift, shiftQuantity: 1 });
    }
  };

  const removeFromCalendar = () => {
    dispatch({
      type: REMOVE_FROM_CALENDAR,
      _id: currentShift._id,
    });

    idbPromise('calendar', 'delete', { ...currentShift });
  };

  return (
    <>
      {currentShift && calendar ? (
        <div className="container my-1">
          <Link to="/">← Back to Shifts</Link>

          <h2>{currentshift.name}</h2>

          <p>{currentshift.description}</p>

          <p>
            <strong>Price:</strong>${currentshift.price}{' '}
            <button onClick={addToCalendar}>Add to Calendar</button>
            <button
              disabled={!calendar.find((p) => p._id === currentshift._id)}
              onClick={removeFromCalendar}
            >
              Remove from Calendar
            </button>
          </p>

          <img
            src={`/images/${currentshift.image}`}
            alt={currentshift.name}
          />
        </div>
      ) : null}
      {loading ? <img src={spinner} alt="loading" /> : null}
      <Calendar />
    </>
  );
}

export default Detail;
