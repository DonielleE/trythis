import React from "react";
import { Link } from "react-router-dom";
import { pluralize } from "../../utils/helpers"
import { useDispatch, useSelector } from "react-redux";
import { ADD_TO_CALENDAR, ADD_TO_C, UPDATE_CART_QUANTITY } from "../../utils/actions";
import { idbPromise } from "../../utils/helpers";

function ShiftItem(item) {
  const dispatch = useDispatch();
  const state = useSelector((state) => state);

  const {
    image,
    name,
    _id,
    price,
    quantity
  } = item;

  const { calendar } = state

  const addToCalendar = () => {
    const shiftOnClander = cart.find((ClanderItem) => ClanderItem._id === _id)
    if (shiftOnClander) {
      dispatch({
        type: UPDATE_CALENDAR_QUANTITY,
        _id: _id,
        ShiftQuantity: parseInt(shiftOnClander.ShiftQuantity) + 1
      });
      idbPromise('cart', 'put', {
        ...shiftOnClander,
        ShiftQuantity: parseInt(shiftOnClander.ShiftQuantity) + 1
      });
    } else {
      dispatch({
        type: ADD_TO_CALENDAR,
        shift: { ...item, ShiftQuantity: 1 }
      });
      idbPromise('calendar', 'put', { ...item, ShiftQuantity: 1 });
    }
  }

  return (
    <div className="card px-1 py-1">
      <Link to={`/shifts/${_id}`}>
        <img
          alt={name}
          src={`/images/${image}`}
        />
        <p>{name}</p>
      </Link>
      <div>
        <div>{quantity} {pluralize("item", quantity)} in stock</div>
        <span>${rate}</span>
      </div>
      <button onClick={addToCalendar}>Add to schedule</button>
    </div>
  );
}

export default ShiftItem;
