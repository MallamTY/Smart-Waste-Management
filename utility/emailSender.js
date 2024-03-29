import nodemailer from 'nodemailer';
import { MAIL_USERNAME, MAIL_PASSWORD,
    OAUTH_CLIENTID,
    OAUTH_CLIENT_SECRET,
    OAUTH_REFRESH_TOKEN 
} from '../configuration/configuration.js';
import { Templates } from '../templates/index.js';



export const sendEmail = async(to,
    subject, html
    ) =>  {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                //type: 'OAuth2',
                user: MAIL_USERNAME,
                pass: MAIL_PASSWORD,
                clientId: OAUTH_CLIENTID,
                clientSecret: OAUTH_CLIENT_SECRET,
                refreshToken: OAUTH_REFRESH_TOKEN
            }
            });
            
            const mailOptions = { 
                from: `Smart-Waste-Management aderogbalilian@gmail.com`,
                to,
                subject,
                html,
            }
            
            return await transporter.sendMail(mailOptions)
            .catch((error) => new Error("Unable to send otp"));
}


export const sendOTP = async(to, username, otp) => {
  
    const otpTemplateValues = Templates.emailOTPTemplate(otp, username);
    const email = to;
    const html = otpTemplateValues.html;
    const subject = 'Your verification OTP';

    await sendEmail(email, subject, html);
};

export const sendFilledContainer = async(leaderName, location, link, to) => {
  
    const otpTemplateValues = Templates.filledContainerTemplate(leaderName, location, link)
    const email = to;
    const html = otpTemplateValues.html;
    const subject = 'Filled Container Notification';

    return await sendEmail(email, subject, html);
};



export const sendResetPasswordLink = async(to, username, token) => {

    const url = `http://localhost:7000/api/v1/auth/reset-password/${token}`;
    const subject = 'Reset Password';
    const tokenTemplateValues = Templates.passwordResetTemplate(url, username);
    const html = tokenTemplateValues.html;

    return await sendEmail(to,subject, html);
}