const nodmailer = require("nodemailer");

const sendEMail = async (option) => {
  try {
    var transport = nodmailer.createTransport({
      host: process.env.HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    const emailOptions = {
      from: "Cineflex support<durgeshmore809@gmail.com>",
      to: option.email,
      subject: option.subject,
      text: option.message,
    };

    await transport.sendMail(emailOptions);
  } catch (exception) {
    console.log("error message  " + exception.message);
  }
};

module.exports = { sendEMail };
