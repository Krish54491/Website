export default function Tos() {
  return (
    <div className="max-w-2xl mx-auto p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md mt-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        Terms of Service
      </h2>

      <div className="space-y-4 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
        <p>
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          1. Acceptance of Terms
        </h3>
        <p>
          By creating an account on krish544.com, you agree to these Terms of
          Service. If you do not agree, do not create an account.
        </p>

        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          2. Account Registration
        </h3>
        <p>
          You must provide a valid email address and a password with at least 8
          characters. You may optionally provide a username. You are responsible
          for maintaining the security of your account credentials.
        </p>

        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          3. User Data
        </h3>
        <p>
          We collect your email address, hashed password, and optional username.
          We do not sell or share your personal data with third parties. Your
          password is stored using bcrypt, a one-way hashing algorithm.
        </p>

        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          4. Account Deletion
        </h3>
        <p>
          You may delete your account at any time from the account settings
          page. Deleting your account will permanently remove all associated data,
          including your comments.
        </p>

        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          5. Acceptable Use
        </h3>
        <p>
          You may not use this service to post spam, offensive content, or
          content that violates applicable laws. We reserve the right to suspend
          or terminate accounts that violate these terms.
        </p>

        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          6. Disclaimer
        </h3>
        <p>
          This service is provided &quot;as is&quot; without warranties of any
          kind. We are not responsible for any loss of data or service
          interruptions.
        </p>

        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          7. Changes to Terms
        </h3>
        <p>
          We may update these terms from time to time. Continued use of the
          service after changes constitutes acceptance of the new terms.
        </p>
      </div>
    </div>
  );
}
