export default function Tos() {
  return (
    <section className="section-home">
      <div className="max-w-2xl mx-auto p-4 bg-home-light-card dark:bg-home-dark-card text-home-light-card-foreground dark:text-home-dark-card-foreground  rounded-lg shadow-md mt-8">
        <h2 className="text-2xl font-bold text-home-light-foreground dark:text-home-dark-foreground  mb-4">
          Terms of Service
        </h2>

        <div className="space-y-4 text-home-light-muted-foreground dark:text-home-dark-muted-foreground  text-sm leading-relaxed">
          <p>Last updated: 9/2/2026</p>

          <h3 className="text-lg font-semibold text-home-light-foreground dark:text-home-dark-foreground ">
            1. Acceptance of Terms
          </h3>
          <p>
            By creating an account on krish544.com, you agree to these Terms of
            Service. If you do not agree, do not create an account.
          </p>

          <h3 className="text-lg font-semibold text-home-light-foreground dark:text-home-dark-foreground ">
            2. Account Registration
          </h3>
          <p>
            You must provide a valid email address and a password with at least
            8 characters. You may optionally provide a username. You are
            responsible for maintaining the security of your account
            credentials.
          </p>

          <h3 className="text-lg font-semibold text-home-light-foreground dark:text-home-dark-foreground ">
            3. User Data
          </h3>
          <p>
            We collect your email address, hashed password, and optional
            username. We do not sell or share your personal data with third
            parties. Your password is stored using bcrypt, a one-way hashing
            algorithm.
          </p>

          <h3 className="text-lg font-semibold text-home-light-foreground dark:text-home-dark-foreground ">
            4. Account Deletion
          </h3>
          <p>
            You may delete your account at any time from the account settings
            page. Deleting your account will permanently remove all associated
            data, including your comments.
          </p>

          <h3 className="text-lg font-semibold text-home-light-foreground dark:text-home-dark-foreground ">
            5. Acceptable Use
          </h3>
          <p>
            You may not use this service to post spam, offensive content, or
            content that violates applicable laws. We reserve the right to
            suspend or terminate accounts that violate these terms.
          </p>

          <h3 className="text-lg font-semibold text-home-light-foreground dark:text-home-dark-foreground ">
            6. Disclaimer
          </h3>
          <p>
            This service is provided &quot;as is&quot; without warranties of any
            kind. We are not responsible for any loss of data or service
            interruptions.
          </p>

          <h3 className="text-lg font-semibold text-home-light-foreground dark:text-home-dark-foreground ">
            7. Changes to Terms
          </h3>
          <p>
            We may update these terms from time to time. Continued use of the
            service after changes constitutes acceptance of the new terms.
          </p>
        </div>
      </div>
    </section>
  );
}
