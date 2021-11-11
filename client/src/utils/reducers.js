
import {
  UPDATE_SHIFTS,
  ADD_TO_CALENDAR,
  UPDATE_CALENDAR_QUANTITY,
  REMOVE_FROM_CALENDAR,
  ADD_MULTIPLE_TO_CALENDAR,
  UPDATE_LOCATIONS,
  UPDATE_CURRENT_LOCATION,
  CLEAR_CALENDAR,
  TOGGLE_CALENDAR
} from "./actions";
const initialState = {
  shifts: [],
  locations: [],
  currentLocation: '',
  calendar: [],
  caldenarOpen: false
};
export const reducers = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_SHIFTS:
      return {
        ...state,
        shifts: [...action.shifts],
      };

    case ADD_TO_CALENDAR:
      return {
        ...state,
        calendarOpen: true,
        calendar: [...state.calendar, action.shift],
      };

    case ADD_MULTIPLE_TO_CALENDAR:
      return {
        ...state,
        calendar: [...state.calendar, ...action.shifts],
      };

    case UPDATE_CALENDAR_QUANTITY:
      return {
        ...state,
        calendarOpen: true,
        calendar: state.calendar.map(shift => {
          if (action._id === shift._id) {
            shift.shiftQuantity = action.shiftQuantity
          }
          return shift
        })
      };

    case REMOVE_FROM_CALENDAR:
      let newState = state.calendar.filter(shift => {
        return shift._id !== action._id;
      });

      return {
        ...state,
        calendarOpen: newState.length > 0,
        calendar: newState
      };

    case CLEAR_CALENDAR:
      return {
        ...state,
        calendarOpen: false,
        calendar: []
      };

    case TOGGLE_CALENDAR:
      return {
        ...state,
        calendarOpen: !state.calendarOpen,
      };

    case UPDATE_LOCATIONS:
      return {
        ...state,
        locations: [...action.locations],
      };

    case UPDATE_CURRENT_LOCATION:
      return {
        ...state,
        currentLocation: action.currentLocation
      }

    default:
      return state;
  }
};

export default reducers