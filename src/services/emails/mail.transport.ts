import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import Logger from 'bunyan';
import sendGridMail from '@sendgrid/mail';
import { config } from '@root/config';
import { BadRequestError } from '@utils/error-handler';

interface IMailOptions {
    from: string;
    to: string;
    subject: string;
    html: string;
}

const log: Logger = config.createLogger('mailOption');
sendGridMail.setApiKey(config.SENDGRID_API_KEY!);
class MailTransport {

    public async sendEmail(receiverEmail: string, subject: string, body: string): Promise<void> {
        if (config.NODE_ENV === 'test' || config.NODE_ENV === 'development') {
            this.developmentEmailSender(receiverEmail, subject, body)
        } else {
            this.productionEmailSender(receiverEmail, subject, body)
        }
    }
    private async developmentEmailSender(receiverEmail: string, subject: string, body: string): Promise<void> {
        console.log(receiverEmail);
        
        const transporter:Mail= nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false,
            auth: {
                user: config.SENDER_EMAIL!,
                pass: config.SENDER_EMAIL_PASSWORD!
            },
        });

        const mailOptions: IMailOptions = {
            from: `Wecare <${config.SENDER_EMAIL!}>`,
            to: receiverEmail,
            subject,
            html: body,
        }

        try {
    
            
            await transporter.sendMail(mailOptions)
            log.info('dev email send successfully')
        } catch (error) {
            log.error('Error sending email', error)
            throw new BadRequestError('Error sending email')

        }
    }


    private async productionEmailSender(receiverEmail: string, subject: string, body: string): Promise<void> {
        const mailOptions: IMailOptions = {
            from: `Wecare <${config.SENDER_EMAIL!}>`,
            to: receiverEmail,
            subject,
            html: body,
        }
        try {
            await sendGridMail.send(mailOptions);
            log.info('Prod email send successfully')
        } catch (error) {
            log.error('Error sending email', error)
            throw new BadRequestError('Error sending email')
        }
    }
}

export const mailTransport:MailTransport=new MailTransport();