import nodemailer from "nodemailer"

// copy paste from nodemailer huh!!
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});


// try {
//   const info = await transporter.sendMail({
//     from: '"Example Team" <team@example.com>', // sender address
//     to: "alice@example.com, bob@example.com", // list of recipients
//     subject: "Hello", // subject line
//     text: "Hello world?", // plain text body
//     html: "<b>Hello world?</b>", // HTML body
//   });

//   console.log("Message sent: %s", info.messageId);
//   // Preview URL is only available when using an Ethereal test account
//   console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
// } catch (err) {
//   console.error("Error while sending mail:", err);
// }

const sendMail = async (to, subject, html) => {

    await transporter.sendMail({
        from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
        to,
        subject,
        html,
    })
};

const sendVerificationEmail = async (email, token) => {

    const url = `${process.env.CLIENT_URL}/verify-email/${token}`
    await sendMail(
        email,
        "verify your email",
        `<h2>welcome!</h2><p>Click<a href="${url}">here</a>to verify your email.</p>`,
    );
};

const sendOrderConfirmationEmail = async (email, order) => {
    const items = order.items
        .map((i) => `<li>${i.title} x ${i.quantity} - ${i.price}</li>`)
        .join("");

    await sendMail(
        email,
        `Order Confirmed - ${order.orderNumber}`,
        `<h2>Order confirmed</h2>
        <p>Order: ${order.orderNumber}</p>`
    );
};

const sendResetPasswordEmail = async (email, token) => {
    const url = `${process.env.CLIENT_URL}/reset-password/${token}`;

    await sendMail(
        email,
        "Reset your password",
        `
        <h2>Password Reset</h2>

        <p>Click the button below to reset your password.</p>

        <a href="${url}">
            Reset Password
        </a>
        `
    );
};

export {
    sendMail,
    sendVerificationEmail,
    sendOrderConfirmationEmail,
    sendResetPasswordEmail
}