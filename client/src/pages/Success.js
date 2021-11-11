import React, { useEffect } from 'react';
import { useMutation } from '@apollo/client';
import Jumbotron from '../components/Jumbotron';
import { ADD_SHIFT } from '../utils/mutations';
import { idbPromise } from '../utils/helpers';

function Success() {
  const [addShift] = useMutation(ADD_SHIFT);

  useEffect(() => {
    async function saveShift() {
      const calendar = await idbPromise('calendar', 'get');
      const products = cart.map((item) => item._id);

      if (products.length) {
        const { data } = await addShift({ variables: { shifts } });
        const shiftData = data.addShift.shifts;

        productData.forEach((item) => {
          idbPromise('calendar', 'delete', item);
        });
      }

      setTimeout(() => {
        window.location.assign('/');
      }, 3000);
    }

    saveShift();
  }, [addShift]);

  return (
    <div>
      <Jumbotron>
        <h1>Success!</h1>
        <h2>Thank you for your purchase!</h2>
        <h2>You will now be redirected to the home page</h2>
      </Jumbotron>
    </div>
  );
}

export default Success;
