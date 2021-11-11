import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import { REMOVE_FROM_CALENDAR, UPDATE_CALENDAR_QUANTITY } from "../../utils/actions";
import { idbPromise } from "../../utils/helpers";

const CalendarItem = ({ item }) => {
  const dispatch = useDispatch();
 
  const removeFromCalendar = item => {
    dispatch({
      type: REMOVE_FROM_CALENDAR,
      _id: item._id
    });
    idbPromise('calendar', 'delete', { ...item });

  };

  const onChange = (e) => {
    const value = e.target.value;
    if (value === '0') {
      dispatch({
        type: REMOVE_FROM_CALENDAR,
        _id: item._id
      });
      idbPromise('calendar', 'delete', { ...item });

    } else {
      dispatch({
        type: UPDATE_CALENDAR_QUANTITY,
        _id: item._id,
        shiftQuantity: parseInt(value)
      });
      idbPromise('calendar', 'put', { ...item, shiftQuantity: parseInt(value) });

    }
  }

  return (
    <div className="flex-row">
      <div>
        <img
          src={`/images/${item.image}`}
          alt=""
        />
      </div>
      <div>
        <div>{item.name}, ${item.rate}</div>
        <div>
          <span>Avalible Shifts:</span>
          <input
            type="number"
            placeholder="1"
            value={item.shiftQuantity}
            onChange={onChange}
          />
          <span
            role="img"
            aria-label="trash"
            onClick={() => removeFromCalendar(item)}
          >
            🗑️
          </span>
        </div>
      </div>
    </div>
  );
}

export default CalendarItem;