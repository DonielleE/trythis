import { gql } from '@apollo/client';

export const QUERY_SHIFTS = gql`
  query getShifts($location: ID) {
    shifts(location: $location) {
      _id
      name
      description
      rate
      quantity
      image
      location {
        _id
      }
    }
  }
`;

export const QUERY_CHECKOUT = gql`
  query getCheckout($Shifts: [ID]!) {
    checkout(Shifts: $Shifts) {
      session
    }
  }
`;

export const QUERY_ALL_SHIFTS = gql`
  {
    shifts {
      _id
      name
      description
      rate
      quantity
      location {
        name
      }
    }
  }
`;

export const QUERY_LOCATIONS = gql`
  {
   locations {
      _id
      name
    }
  }
`;

export const QUERY_USER = gql`
  {
    user {
      firstName
      lastName
      shift {
        _id
        shiftDate
        shifts {
          _id
          name
          description
          rate
          quantity
          image
        }
      }
    }
  }
`;
