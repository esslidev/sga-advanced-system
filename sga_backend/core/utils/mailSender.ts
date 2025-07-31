export const mailSender = (
  mailTo: string,
  subject: string,
  text?: string,
  templatePath?: string,
  templateProps?: any,
  attachments?: any
) =>
  new Promise<boolean>(async (resolve, reject) => {
    const nodemailer = require('nodemailer')
    const fs = require('fs')
    const hbs = require('handlebars')
    let emailTemplateSource
    let template
    let htmlToSend

    if (templatePath) {
      emailTemplateSource = fs.readFileSync(templatePath, 'utf8')
      template = hbs.compile(emailTemplateSource)
      htmlToSend = template(templateProps)
    }

    try {
      // create reusable transporter object using the default SMTP transport
      let transporter = nodemailer.createTransport({
        /*host: 'smtp.titan.email',
        secure: true,
        secureConnection: false,
        tls: {
					ciphers: "SSLv3",
				},
        requireTLS: true,
        port: 465,
        debug: false,
        connectionTimeout: 10000,
        auth: {
          user: process.env.MAIL_USERNAME,
          pass: process.env.MAIL_PASSWORD,
        },*/
        host: 'smtp.hostinger.com',
        secure: true,
        secureConnection: false,
        tls: {
          ciphers: 'SSLv3',
        },
        requireTLS: true,
        port: 465,
        debug: false,
        connectionTimeout: 10000,
        auth: {
          user: process.env.MAIL_USERNAME,
          pass: process.env.MAIL_PASSWORD,
        },
      })
      // send mail with defined transport object
      let info = await transporter.sendMail({
        from: `"LIBRAIRIE ALFIA" <${process.env.MAIL_USERNAME}>`, // sender address
        to: mailTo, // list of receivers
        subject: subject, // Subject line
        text,
        html: htmlToSend && htmlToSend,
        attachments: attachments,
      })

      // console.log("Message sent: %s", info.messageId);
      // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      resolve(true)
    } catch (err) {
      reject(err)
    }
  })
