import smtplib
import random
import string
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import re
import time

# ─────────────────────────────────────────────
#  CONFIGURATION — update these before running
# ─────────────────────────────────────────────
SENDER_EMAIL    = "your_email@gmail.com"   # Your Gmail address
SENDER_PASSWORD = "your_app_password"      # Gmail App Password (not your login password)
SMTP_HOST       = "smtp.gmail.com"
SMTP_PORT       = 587
OTP_LENGTH      = 6
OTP_EXPIRY_SECS = 300   # OTP valid for 5 minutes


def is_valid_email(email: str) -> bool:
    """Basic email format validation."""
    pattern = r"^[\w\.-]+@[\w\.-]+\.\w{2,}$"
    return bool(re.match(pattern, email))


def generate_otp(length: int = OTP_LENGTH) -> str:
    """Generate a numeric OTP of the given length."""
    return "".join(random.choices(string.digits, k=length))


def send_otp_email(receiver_email: str, otp: str) -> bool:
    """
    Send the OTP to the receiver's email address.
    Returns True on success, False on failure.
    """
    subject = "Your One-Time Password (OTP)"

    # ── HTML body ──────────────────────────────────────────────────────────
    html_body = f"""
    <html>
      <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 480px; margin: auto; background: #ffffff;
                    border-radius: 10px; padding: 30px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          <h2 style="color: #4F46E5; text-align: center;">OTP Verification</h2>
          <p style="color: #555;">Hello,</p>
          <p style="color: #555;">
            Use the OTP below to complete your verification.
            It is valid for <strong>{OTP_EXPIRY_SECS // 60} minutes</strong>.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 36px; font-weight: bold; letter-spacing: 12px;
                         color: #4F46E5; background: #EEF2FF; padding: 12px 24px;
                         border-radius: 8px;">{otp}</span>
          </div>
          <p style="color: #888; font-size: 13px;">
            If you did not request this OTP, please ignore this email.
          </p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin-top: 20px;">
          <p style="color: #aaa; font-size: 12px; text-align: center;">
            This is an automated message — please do not reply.
          </p>
        </div>
      </body>
    </html>
    """

    # ── Plain-text fallback ────────────────────────────────────────────────
    plain_body = (
        f"Your OTP is: {otp}\n"
        f"It is valid for {OTP_EXPIRY_SECS // 60} minutes.\n"
        "If you did not request this, please ignore this email."
    )

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"]    = SENDER_EMAIL
        msg["To"]      = receiver_email

        msg.attach(MIMEText(plain_body, "plain"))
        msg.attach(MIMEText(html_body,  "html"))

        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.ehlo()
            server.starttls()
            server.login(SENDER_EMAIL, SENDER_PASSWORD)
            server.sendmail(SENDER_EMAIL, receiver_email, msg.as_string())

        return True

    except smtplib.SMTPAuthenticationError:
        print("\n[ERROR] Authentication failed.")
        print("  → Make sure you are using a Gmail App Password, not your account password.")
        print("  → See: https://myaccount.google.com/apppasswords")
        return False
    except smtplib.SMTPException as e:
        print(f"\n[ERROR] SMTP error: {e}")
        return False
    except Exception as e:
        print(f"\n[ERROR] Unexpected error: {e}")
        return False


def verify_otp(real_otp: str, otp_generated_at: float, max_attempts: int = 3) -> bool:
    """Prompt the user to enter the OTP and verify it."""
    for attempt in range(1, max_attempts + 1):
        entered = input(f"\nEnter OTP (attempt {attempt}/{max_attempts}): ").strip()

        # Check expiry first
        if time.time() - otp_generated_at > OTP_EXPIRY_SECS:
            print("[ERROR] OTP has expired. Please request a new one.")
            return False

        if entered == real_otp:
            return True
        else:
            remaining = max_attempts - attempt
            if remaining > 0:
                print(f"[ERROR] Incorrect OTP. {remaining} attempt(s) remaining.")
            else:
                print("[ERROR] Too many incorrect attempts.")

    return False


def main():
    print("=" * 50)
    print("       Email OTP Verification System")
    print("=" * 50)

    # ── Step 1: Get email ──────────────────────────────────────────────────
    while True:
        email = input("\nEnter your email address: ").strip()
        if not email:
            print("[ERROR] Email cannot be empty.")
        elif not is_valid_email(email):
            print("[ERROR] Invalid email format. Please try again.")
        else:
            break

    # ── Step 2: Generate & send OTP ───────────────────────────────────────
    otp = generate_otp()
    print(f"\nSending OTP to {email} …")

    sent_at = time.time()
    success = send_otp_email(email, otp)

    if not success:
        print("\n[FAILED] Could not send OTP. Check your configuration and try again.")
        return

    print(f"[OK] OTP sent successfully! It will expire in {OTP_EXPIRY_SECS // 60} minutes.")

    # ── Step 3: Verify OTP ────────────────────────────────────────────────
    if verify_otp(otp, sent_at):
        print("\n✅  OTP verified successfully! You are now authenticated.")
    else:
        print("\n❌  OTP verification failed.")


if __name__ == "__main__":
    main()
