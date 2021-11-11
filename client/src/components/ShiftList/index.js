import React, { useEffect } from 'react';
import ShiftItem from '../shiftItem';
import { useDispatch, useSelector } from "react-redux";
import { UPDATE_SHIFTS } from '../../utils/actions';
import { useQuery } from '@apollo/client';
import { QUERY_SHIFTS } from '../../utils/queries';
import { idbPromise } from '../../utils/helpers';
import spinner from '../../assets/spinner.gif';

function ShiftList() {
  const dispatch = useDispatch();
  const state = useSelector((state) => state);

  const { currentLocation } = state;

  const { loading, data } = useQuery(QUERY_SHIFTS);

  useEffect(() => {
    if (data) {
      dispatch({
        type: UPDATE_SHIFTS,
        shifts: data.shifts,
      });
      data.shifts.forEach((shift) => {
        idbPromise('shifts', 'put', shift);
      });
    } else if (!loading) {
      idbPromise('shifts', 'get').then((shifts) => {
        dispatch({
          type: UPDATE_SHIFTS,
          shifts: shifts,
        });
      });
    }
  }, [data, loading, dispatch]);

  function filterShifts() {
    if (!currentLocation) {
      return state.shifts;
    }

    return state.shifts.filter(
      (shift) => shift.location._id === currentLocation
    );
  }

  return (
    <div className="my-2">
      <h2>Our shifts:</h2>
      {state.shifts.length ? (
        <div className="flex-row">
          {filterShifts().map((shift) => (
            <shiftItem
              key={shift._id}
              _id={shift._id}
              image={shift.image}
              name={shift.name}
              rate={shift.rate}
              quantity={shift.quantity}
            />
          ))}
        </div>
      ) : (
        <h3>You haven't added any shifts yet!</h3>
      )}
      {loading ? <img src={spinner} alt="loading" /> : null}
    </div>
  );
}

export default ShiftList;
