const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const url = "http://192.168.1.121:3000";

const sendEmail = async (token, name, surname, email) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAILER_USER,
        pass: process.env.MAILER_PASS,
      },
    });

    const mailOptions = {
      from: `"comms-rltn" <comms.rltn@gmail.com>`,
      to: email,
      subject: "Account Verification - comms",
      text: "Click the link to verify your account.",
      html: `<h3>Click the link to verify your account.</h3>
              <p>
                Dear <b>${name} ${surname}</b>,
                <br /><br />
                This message is to confirm your registered email account <b>${email}</b> for comms-by-rltn.
                Please click the link to proceed.
                <br /><br />
                <a href="${url}/auth/v/${token}">
                  comms-by-rltn account verification
                </a>
                <br /><br />
                This link will expire in 24 hours. If you did not sign up for a comms account,
                you can safely ignore this email.
                <br /><br />
                Best,
                <br /><br />
                The comms-by-rltn developers
              </p>`,
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.log(error);
  }
};

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

const createToken = (id, name, surname, email) => {
  const token = jwt.sign({ id, name, surname, email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_TTL,
  });

  return token;
};

const verifyPassword = async (candidate_password, password) => {
  const isMatch = await bcrypt.compare(candidate_password, password);
  return isMatch;
};

module.exports = { hashPassword, createToken, verifyPassword, sendEmail };
