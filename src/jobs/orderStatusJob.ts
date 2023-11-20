import { CronJob } from "cron";
import orderService from "../modules/order/order.service";

const orderStatusJob = CronJob.from({
  cronTime: "0 0 0 * * *", // Runs at midnight every day,
  onTick: orderService.makeUnConfirmedOrderToSpamStatus,
  timeZone: "America/Los_Angeles",
});

export default orderStatusJob;
