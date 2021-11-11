import React, { useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useLazyQuery } from '@apollo/client';
import { QUERY_CHECKOUT } from '../../utils/queries';
import { idbPromise } from '../../utils/helpers';
import CalendarItem from '../CalendarItem';
import Auth from '../../utils/auth';
//import { useStoreContext } from '../../utils/GlobalState';
import { TOGGLE_CALENDAR, ADD_MULTIPLE_TO_CALENDAR } from '../../utils/actions';
import './style.css';
import {useDispatch, useSelector} from 'react-redux';

const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');

const Calendar = () => {
  const [getCheckout, { data }] = useLazyQuery(QUERY_CHECKOUT);
  const dispatch = useDispatch();
  const state = useSelector((state) => state);

  useEffect(() => {
    if (data) {
      stripePromise.then((res) => {
        res.redirectToCheckout({ sessionId: data.checkout.session });
      });
    }
  }, [data]);

  useEffect(() => {
    async function getCalendar() {
      const calendar = await idbPromise('calendar', 'get');
      dispatch({ type: ADD_MULTIPLE_TO_CALENDAR, products: [...calendar] });
    }

    if (!state.calendar.length) {
      getCalendar();
    }
  }, [state.calendar.length, dispatch]);

  function toggleCalendar() {
    dispatch({ type: TOGGLE_CALENDAR });
  }

  function calculateTotal() {
    let sum = 0;
    state.calendar.forEach((item) => {
      sum += item.price * item.purchaseQuantity;
    });
    return sum.toFixed(2);
  }

  function submitCheckout() {
    const productIds = [];

    state.Calendar.forEach((item) => {
      for (let i = 0; i < item.purchaseQuantity; i++) {
        productIds.push(item._id);
      }
    });

    getCheckout({
      variables: { products: productIds },
    });
  }

  if (!state.calendarOpen) {
    return (
      <div className="calendar-closed" onClick={toggleCalendar}>
        <span role="img" aria-label="trash">
          🛒
        </span>
      </div>
    );
  }

  return (
    <div className="calendar">
      <div className="close" onClick={toggleCalendar}>
        [close]
      </div>
      <h2>ShiftSelect</h2>
      {state.calendar.length ? (
        <div>
          {state.calendar.map((item) => (
            <CalendarItem key={item._id} item={item} />
          ))}

          <div className="flex-row space-between">
            <strong>Total: ${calculateTotal()}</strong>

            {Auth.loggedIn() ? (
              <button onClick={submitCheckout}>Checkout</button>
            ) : (
              <span>(log in to check out)</span>
            )}
          </div>
        </div>
      ) : (
        <h3>
          <span role="img" aria-label="shocked">
            😱
          </span>
          You haven't added anything to your Calendar yet!
        </h3>
      )}
    </div>
  );
};

export default Calendar;
