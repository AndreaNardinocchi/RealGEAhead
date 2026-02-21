export function bookingCreatedTemplate({
  profile,
  room,
  check_in,
  check_out,
  total_price,
  logoUrl,
  booking_id,
  total_nights,
}) {
  const formattedId = `#${String(booking_id).slice(-12)}`;

  return `
  <div style="background:#f4f4f4; padding:20px; font-family:Arial, sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
           style="max-width:600px; margin:auto; background:#ffffff; border-radius:10px; border:1px solid #472d3020; overflow:hidden;">

      <!-- Logo on dark background -->
      <tr>
        <td style="padding:25px; text-align:center; background:#472d30;">
          <img src="${logoUrl}" alt="GuestEase Logo" width="150" style="margin-bottom:0;" />
        </td>
      </tr>

      <!-- Header -->
      <tr>
        <td style="padding:20px; text-align:center; background:#E26D5C;">
          <h2 style="margin:0; font-weight:600; font-size:22px; color:#fff;">
            Booking Confirmed 🎉
          </h2>
          <p style="margin:8px 0 0; font-size:14px; color:#fff; opacity:0.9;">
            Booking ID: <strong>${formattedId}</strong>
          </p>
        </td>
      </tr>

      <!-- Body -->
      <tr>
        <td style="padding:26px; color:#472d30; font-size:15px; line-height:1.6;">
          <p>Hello <strong>${profile.first_name ?? profile.email}</strong>,</p>

          <p>We're absolutely thrilled to welcome you 🧡 Your stay is officially confirmed, and we can't wait to host you. Whether you're here to unwind, explore, or simply enjoy a change of scenery, we're committed to making your experience smooth and memorable.</p>

          <p>Here are the details of your upcoming stay:</p>

          <!-- Room Details -->
          <div style="background:#fff3ef; border-left:4px solid #E26D5C; padding:16px; margin:20px 0; border-radius:6px;">
            <p><strong>Room:</strong> ${room.name}</p>
            ${room.type ? `<p><strong>Type:</strong> ${room.type}</p>` : ""}
            ${room.capacity ? `<p><strong>Capacity:</strong> ${room.capacity} guests</p>` : ""}
            ${room.location ? `<p><strong>Location:</strong> ${room.location}</p>` : ""}
            ${room.description ? `<p><strong>Description:</strong> ${room.description}</p>` : ""}
            <p><strong>Check-in:</strong> ${check_in}</p>
            <p><strong>Check-out:</strong> ${check_out}</p>
             <p><strong>Total Nights:</strong> ${total_nights}</p>
            <p><strong>Total Price:</strong> €${total_price.toFixed(2)}</p>
          </div>

          <p>If you need anything before your arrival, just let us know — we're here to help every step of the way 🤝</p>

          <div style="text-align:center; margin:28px 0;">
            <a href="http://localhost:5173/account/mytrips"
              style="background:#E26D5C; color:#fff; padding:12px 24px;
              text-decoration:none; border-radius:6px; font-size:16px; font-weight:600;">
              View My Trips
            </a>
          </div>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="text-align:center; padding:18px; font-size:12px; color:#472d30;">
          © ${new Date().getFullYear()} GuestEase. All rights reserved.
        </td>
      </tr>

    </table>
  </div>
  `;
}

export function bookingUpdatedTemplate({
  profile,
  room,
  check_in,
  check_out,
  total_price,
  logoUrl,
  booking_id,
  guests,
  total_nights,
}) {
  const formattedId = `#${String(booking_id).slice(-12)}`;
  const guestName = profile.first_name ?? profile.email;

  return `
  <div style="background:#f4f4f4; padding:20px; font-family:Arial, sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
      style="max-width:600px; margin:auto; background:#ffffff; border-radius:10px; border:1px solid #472d3020; overflow:hidden;">

      <!-- Logo -->
      <tr>
        <td style="padding:25px; text-align:center; background:#472d30;">
          <img src="${logoUrl}" alt="GuestEase Logo" width="150" />
        </td>
      </tr>

      <!-- Header -->
      <tr>
        <td style="padding:20px; text-align:center; background:#E26D5C;">
          <h2 style="margin:0; font-weight:600; font-size:22px; color:#fff;">
            Your Booking Has Been Updated ✨
          </h2>
          <p style="margin:8px 0 0; font-size:14px; color:#fff; opacity:0.9;">
            Booking ID: <strong>${formattedId}</strong>
          </p>
        </td>
      </tr>

      <!-- Body -->
      <tr>
        <td style="padding:26px; color:#472d30; font-size:15px; line-height:1.6;">
          <p>Hello <strong>${guestName}</strong>,</p>

          <p>We wanted to let you know that your booking has been successfully updated. Below you’ll find the latest details of your stay.</p>

     

          <!-- Room Details -->
          <div style="background:#fff3ef; border-left:4px solid #E26D5C; padding:16px; margin:20px 0; border-radius:6px;">
            <p><strong>Room:</strong> ${room.name}</p>
            ${room.type ? `<p><strong>Type:</strong> ${room.type}</p>` : ""}
            ${room.capacity ? `<p><strong>Capacity:</strong> ${room.capacity} guests</p>` : ""}
            <p><strong>Check-in:</strong> ${check_in}</p>
            <p><strong>Check-out:</strong> ${check_out}</p>
            <p><strong>Guests:</strong> ${guests}</p>
                     <p><strong>Total Nights:</strong> ${total_nights}</p>
            <p><strong>Total Price:</strong> €${Number(total_price).toFixed(2)}</p>
          </div>

          <p>If you have any questions or need further adjustments, we're always here to help 🤝</p>

          <div style="text-align:center; margin:28px 0;">
            <a href="http://localhost:5173/account/mytrips"
              style="background:#E26D5C; color:#fff; padding:12px 24px;
              text-decoration:none; border-radius:6px; font-size:16px; font-weight:600;">
              View My Updated Booking
            </a>
          </div>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="text-align:center; padding:18px; font-size:12px; color:#472d30;">
          © ${new Date().getFullYear()} GuestEase. All rights reserved.
        </td>
      </tr>

    </table>
  </div>
  `;
}

export function bookingCancelledTemplate({
  profile,
  room,
  check_in,
  check_out,
  logoUrl,
  booking_id,
  total_nights,
  total_price,
}) {
  const formattedId = `#${String(booking_id).slice(-12)}`;
  const guestName = profile.first_name ?? profile.email;

  return `
  <div style="background:#f4f4f4; padding:20px; font-family:Arial, sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
      style="max-width:600px; margin:auto; background:#ffffff; border-radius:10px; border:1px solid #472d3020; overflow:hidden;">

      <!-- Logo -->
      <tr>
        <td style="padding:25px; text-align:center; background:#472d30;">
          <img src="${logoUrl}" alt="GuestEase Logo" width="150" />
        </td>
      </tr>

      <!-- Header -->
      <tr>
        <td style="padding:20px; text-align:center; background:#E26D5C;">
          <h2 style="margin:0; font-weight:600; font-size:22px; color:#fff;">
            Your Booking Has Been Cancelled 😔
          </h2>
          <p style="margin:8px 0 0; font-size:14px; color:#fff; opacity:0.9;">
            Booking ID: <strong>${formattedId}</strong>
          </p>
        </td>
      </tr>

      <!-- Body -->
      <tr>
        <td style="padding:26px; color:#472d30; font-size:15px; line-height:1.6;">
          <p>Hello <strong>${guestName}</strong>,</p>

          <p>We’re writing to confirm that your booking has been successfully cancelled 😔 Below are the details of the reservation that has been removed from your account.</p>

          <!-- Room Details -->
          <div style="background:#fff3ef; border-left:4px solid #E26D5C; padding:16px; margin:20px 0; border-radius:6px;">
            <p><strong>Room:</strong> ${room.name}</p>
            ${room.type ? `<p><strong>Type:</strong> ${room.type}</p>` : ""}
            ${room.capacity ? `<p><strong>Capacity:</strong> ${room.capacity} guests</p>` : ""}
            <p><strong>Original Check-in:</strong> ${check_in}</p>
            <p><strong>Original Check-out:</strong> ${check_out}</p>
                         <p><strong>Total Nights:</strong> ${total_nights}</p>
             <p><strong>Total Price:</strong> €${total_price.toFixed(2)}</p>
          </div>
          <p>Your credit card won't be charged!<br/>
          If this cancellation was made in error or you’d like to book again, we’d be happy to welcome you back anytime.</p>
          <div style="text-align:center; margin:28px 0;">
            <a href="http://localhost:5173/"
              style="background:#E26D5C; color:#fff; padding:12px 24px;
              text-decoration:none; border-radius:6px; font-size:16px; font-weight:600;">
              Book Again
            </a>
          </div>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="text-align:center; padding:18px; font-size:12px; color:#472d30;">
          © ${new Date().getFullYear()} GuestEase. All rights reserved.
        </td>
      </tr>

    </table>
  </div>
  `;
}

export function userCreatedTemplate({ authUser, logoUrl, tokenizedLink }) {
  const displayName = authUser.user_metadata.first_name ?? user.email;

  return `
  <div style="background:#f4f4f4; padding:20px; font-family:Arial, sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
      style="max-width:600px; margin:auto; background:#ffffff; border-radius:10px; border:1px solid #472d3020; overflow:hidden;">

      <!-- Logo -->
      <tr>
        <td style="padding:25px; text-align:center; background:#472d30;">
          <img src="${logoUrl}" alt="GuestEase Logo" width="150" />
        </td>
      </tr>

      <!-- Header -->
      <tr>
        <td style="padding:20px; text-align:center; background:#E26D5C;">
          <h2 style="margin:0; font-weight:600; font-size:22px; color:#fff;">
            Welcome to GuestEase 🎉
          </h2>
          <p style="margin:8px 0 0; font-size:14px; color:#fff; opacity:0.9;">
            Your account has been created successfully
          </p>
        </td>
      </tr>

      <!-- Body -->
      <tr>
        <td style="padding:26px; color:#472d30; font-size:15px; line-height:1.6;">
          <p>Hello <strong>${displayName}</strong>,</p>

          <p>We're excited to welcome you to <strong>GuestEase</strong> 🧡  
          Your profile has been created by an administrator, and you're all set to start managing your bookings with ease.</p>

          <p>Before you get started, please take a moment to set your password using the link below:</p>

          <div style="text-align:center; margin:28px 0;">
            <a href="${tokenizedLink}"
              style="background:#E26D5C; color:#fff; padding:12px 24px;
              text-decoration:none; border-radius:6px; font-size:16px; font-weight:600;">
              Set Your Password
            </a>
          </div>

          <p>If you ever need help or have questions, our team is always here to support you 🤝</p>
        </td>
      </tr>
      

      <!-- Footer -->
      <tr>
        <td style="text-align:center; padding:18px; font-size:12px; color:#472d30;">
          © ${new Date().getFullYear()} GuestEase. All rights reserved.
        </td>
      </tr>

    </table>
  </div>
  `;
}

export function adminCancelledBookingTemplate({
  profile,
  booking,
  logoUrl,
  refundableNights,
  amountToRefund,
  room,
}) {
  const displayName = profile.first_name ?? profile.email ?? "Guest";
  const formattedRefund = (amountToRefund / 100).toFixed(2);

  const refundSection =
    refundableNights === 0
      ? `
        <h3 style="margin-top:24px; font-size:17px; color:#472d30;">Refund Details</h3>
        <p>
          No refund was issued for this cancellation.
          Because your stay begins today and is only one night long,
          there are no refundable nights remaining under our policy.
        </p>
      `
      : `
        <h3 style="margin-top:24px; font-size:17px; color:#472d30;">Refund Details</h3>
        <p>
          As per our refund policy, refunds apply only to nights starting from the day
          after cancellation. The night of cancellation is non‑refundable.
        </p>
        <p>
          <strong>Nights refunded:</strong> ${refundableNights}<br/>
          <strong>Refund amount:</strong> €${formattedRefund}
        </p>
      `;

  return `
  <div style="background:#f4f4f4; padding:20px; font-family:Arial, sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
      style="max-width:600px; margin:auto; background:#ffffff; border-radius:10px; border:1px solid #472d3020; overflow:hidden;">

      <!-- Logo -->
      <tr>
        <td style="padding:25px; text-align:center; background:#472d30;">
          <img src="${logoUrl}" alt="GuestEase Logo" width="150" />
        </td>
      </tr>

      <!-- Header -->
      <tr>
        <td style="padding:20px; text-align:center; background:#E26D5C;">
          <h2 style="margin:0; font-weight:600; font-size:22px; color:#fff;">
            Your Booking Has Been Cancelled
          </h2>
          <p style="margin:8px 0 0; font-size:14px; color:#fff; opacity:0.9;">
            This cancellation was performed by an administrator
          </p>
        </td>
      </tr>

      <!-- Body -->
      <tr>
        <td style="padding:26px; color:#472d30; font-size:15px; line-height:1.6;">
          <p>Hello <strong>${displayName}</strong>,</p>

          <p>Your booking <strong>#${booking.id.slice(-8)}</strong> for 
          <strong>${room.name}</strong> has been cancelled by an administrator.</p>

          ${refundSection}

          <p>
            If you have any questions or need help with a new booking,
            our team is always here to assist you.
          </p>

          <!-- Button -->
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:28px auto;">
            <tr>
              <td style="background:#E26D5C; padding:12px 24px; border-radius:6px; text-align:center;">
                <a href="http://localhost:5173/"
                  style="color:#fff; font-size:16px; font-weight:600; text-decoration:none; display:inline-block;">
                  Contact Us
                </a>
              </td>
            </tr>
          </table>

        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="text-align:center; padding:18px; font-size:12px; color:#472d30;">
          © ${new Date().getFullYear()} GuestEase. All rights reserved.
        </td>
      </tr>

    </table>
  </div>
  `;
}
