import { AccountRequest } from "@prisma/client";
import { Request, RequestHandler, Response } from "express";
import httpStatus from "http-status";
import config from "../../config";
import catchAsyncErrors from "../../utils/catchAsyncError.util";
import sendEmail from "../../utils/sendMail.util";
import sendResponse from "../../utils/sendResponse.util";

const sendContactMail: RequestHandler = catchAsyncErrors(
  async (req: Request, res: Response) => {
    await sendEmail({
      to: req?.body?.email,
      subject: "Thanks for contacting us",
      html: `
  <h3>Thanks for contacting us</h3>
  <p>Hi, ${req?.body?.name}</p>
  <p>Thanks for contacting us</p>
  <p>We will contact you soon</p>
  <p>Regards,</p>
  <p>Team</p>
  `,
    });

    await sendEmail({
      to: config.adminEmail,
      subject: "Contact Email from " + req?.body?.name,
      html: `
  <h3>Contact Email from ${req?.body?.name}</h3>
  <p>Hi, Admin</p>
  <p>You have received a contact email from ${req?.body?.name}</p>
  <p>Company Name: ${req?.body?.companyName}</p>
  <p>Email: ${req?.body?.email}</p>
  <p>Phone: ${req?.body?.phone}</p>
  <p>Message: ${req?.body?.message}</p>
  <p>Regards,</p>
  <p>Team</p>
  `,
    });

    sendResponse<AccountRequest>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Contact Email sent successfully",
    });
  }
);

const contactController = {
  sendContactMail,
};
export default contactController;
