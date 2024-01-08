import httpStatus from "http-status";
import nodemailer, { SendMailOptions } from "nodemailer";
import config from "../config";
import AppError from "./customError.util";

const sendEmail = async (options: Omit<SendMailOptions, "from">) => {
  try {
    const nodeMailerOptions = {
      host: config.mailtrap.host,
      port: parseInt(config.mailtrap.port),
      auth: {
        user: config.mailtrap.auth.user,
        pass: config.mailtrap.auth.pass,
      },
      domain: config.mailtrap.domain,
    };

    // 1. create transporter
    const transporter = nodemailer.createTransport(nodeMailerOptions);

    // 2. define email options
    const mailOptions = {
      from: config.mailtrap.sendingEmail,
      ...options,
    };

    // 3. send email
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new AppError(
      "There was an error sending the email. Try again later!",
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

export default sendEmail;
