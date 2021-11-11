import { createSchedule } from "redux";
import reducers  from "./reducers";
export default createSchedule(reducers)