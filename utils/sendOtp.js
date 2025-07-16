const nodemailer = require("nodemailer");

const sendOtp = async (email, otp) => {
  console.log("📧 Preparing to send OTP email to:", email);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP is: ${otp}`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    
  } catch (error) {
    return res.status(500).json({message:"internal server error"});
  }
};

module.exports = sendOtp;