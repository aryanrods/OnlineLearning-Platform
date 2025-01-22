import nodemailer, { Transporter, SendMailOptions } from "nodemailer";


export const Sendmail = async function(
  email: string,
  subject: string,
  message: string
): Promise<{ success: boolean; message?: string; error?: string }> {

  
  const transporter: Transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    secure: true,
    port: 465,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASS,
    },
  });

  
  const receiver: SendMailOptions = {
    from: process.env.SMTP_EMAIL, 
    to: email,
    subject: subject, // Subject line 
    html: message // html body
  };

  console.log(email, subject, message);
  
  try {
    // Send the email
    const info = await transporter.sendMail(receiver);
    console.log('Email sent:', info.response);
    return { success: true, message: 'Forget password email sent successfully' };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: 'Error sending email' };
  }
}