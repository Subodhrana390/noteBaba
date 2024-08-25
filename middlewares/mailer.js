const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "subodhrana390@gmail.com",
    pass: "yylc rfxm ejqr udup",
  },
});

module.exports = transporter;
