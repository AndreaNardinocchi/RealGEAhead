/**
 * Email utility using Resend.
 *
 * We will be using Resend which provides a simple API based approach
 * that works well with serverless and traditional backends like node.js and express.js.
 * This function will eventually send transactional email notifications for booking confirmations,
 * updates, and cancellations.
 *
 * https://resend.com/docs
 */

/**
 * Send an email
 */
export async function sendEmail({ to, subject, html }) {
  // ToDo: Implement email sending using Resend
  console.log("Email", { to, subject });
}
