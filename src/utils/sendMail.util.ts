import nodemailer, { SendMailOptions } from "nodemailer";

const sendEmail = async (options: SendMailOptions) => {
  const nodeMailerOptions = {
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "1e6163b2567141",
      pass: "337ff57f9a511d",
    },
    // domain: "domain.com",
  };

  // 1. create transporter
  const transporter = nodemailer.createTransport(nodeMailerOptions);

  // 2. define email options
  const mailOptions = {
    from: "siam@tigotek.net",
    ...options,
  };

  // 3. send email
  await transporter.sendMail(mailOptions);
};

export default sendEmail;
