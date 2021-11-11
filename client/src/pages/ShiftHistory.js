import React from 'react';
import { Link } from 'react-router-dom';

import { useQuery } from '@apollo/client';
import { QUERY_USER } from '../utils/queries';

function ShiftHistory() {
  const { data } = useQuery(QUERY_USER);
  let user;

  if (data) {
    user = data.user;
  }

  return (
    <>
      <div className="container my-1">
        <Link to="/">← Back to Shifts</Link>

        {user ? (
          <>
            <h2>
              Shift History for {user.firstName} {user.lastName}
            </h2>
            {user.shift.map((shift) => (
              <div key={shifts._id} className="my-2">
                <h3>
                  {new Date(parseInt(shift.shiftDate)).toLocaleDateString()}
                </h3>
                <div className="flex-row">
                  {shift.shifts.map(({ _id, image, name, rate }, index) => (
                    <div key={index} className="card px-1 py-1">
                      <Link to={`/shifts/${_id}`}>
                        <img alt={name} src={`/images/${image}`} />
                        <p>{name}</p>
                      </Link>
                      <div>
                        <span>${rate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </>
        ) : null}
      </div>
    </>
  );
}

export default ShiftHistory;
