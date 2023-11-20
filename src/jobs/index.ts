import AppError from "../utils/customError.util";
import orderStatusJob from "./orderStatusJob";

const subscribeToJobs = async () => {
  try {
    orderStatusJob.start();
  } catch (e) {
    throw new AppError("Error subscribing to jobs", 500);
  }
};

export default subscribeToJobs;
