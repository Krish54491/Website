import { Link } from "react-router-dom";

const SUPPORT_EMAIL = "support@krish544.com";

function ExternalLink({ href, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary underline underline-offset-2 wrap-break-word"
    >
      {children ?? href}
    </a>
  );
}

function SupportEmail() {
  return (
    <a
      href={`mailto:${SUPPORT_EMAIL}`}
      className="text-primary underline underline-offset-2"
    >
      {SUPPORT_EMAIL}
    </a>
  );
}

function TermsSection({ title, children }) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold text-foreground">{title}</h2>
      {children}
    </section>
  );
}

function BulletList({ children }) {
  return <ul className="list-disc space-y-1 pl-6">{children}</ul>;
}

export default function DailiesTOS() {
  return (
    <article className="mx-auto my-8 w-11/12 max-w-3xl space-y-8 leading-relaxed text-muted-foreground">
      <Link
        to="/dailies-irl"
        className="inline-block rounded-md bg-primary p-2 text-primary-foreground hover:bg-accent hover:text-accent-foreground"
      >
        &larr; Back to Dailies IRL
      </Link>

      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          Dailies IRL - Terms of Service
        </h1>
        <p className="text-sm">
          Effective date: October 14, 2026
          <br />
          Last updated: October 14, 2026
        </p>
      </header>

      <p>
        These terms are an agreement between you and Krish Bharal (&quot;we&quot;,
        &quot;us&quot;), the developer of Dailies IRL. By installing or using
        the Dailies IRL Chrome extension (together with the Google Apps Script
        project that runs its schedule, &quot;Dailies IRL&quot; or &quot;the
        service&quot;), you agree to these terms. If you do not agree, do not
        install or use Dailies IRL.
      </p>

      <TermsSection title="1. What Dailies IRL does">
        <p>
          Dailies IRL lets you write categories of tasks and adds tasks picked at
          random from them to a &quot;Dailies IRL&quot; list in your Google
          Tasks, on a daily, weekly or monthly schedule that you choose. It runs
          in your own Google account using Google&apos;s services.
        </p>
      </TermsSection>

      <TermsSection title="2. Who can use it">
        <p>
          You must be at least 13 years old, or the minimum age to have a Google
          account in your country if that is higher, and you must have your own
          Google account. You may only connect a Google account that you own or
          are allowed to use.
        </p>
      </TermsSection>

      <TermsSection title="3. Your Google account and Google's terms">
        <p>
          Dailies IRL works through your Google account and Google services,
          including Google Tasks, Google Apps Script and Google sign-in. Your use
          of those services is also covered by{" "}
          <ExternalLink href="https://policies.google.com/terms">
            Google&apos;s Terms of Service
          </ExternalLink>{" "}
          and{" "}
          <ExternalLink href="https://policies.google.com/privacy">
            Google&apos;s Privacy Policy
          </ExternalLink>
          . You must follow those terms and all laws that apply to you when you
          use Dailies IRL.
        </p>
        <p>You are responsible for keeping your Google account secure.</p>
      </TermsSection>

      <TermsSection title="4. Permissions and what Dailies IRL does in your account">
        <p>When you sign in, you allow Dailies IRL to:</p>
        <BulletList>
          <li>
            create a &quot;Dailies IRL&quot; list in your Google Tasks and add
            tasks to it;
          </li>
          <li>
            delete unfinished tasks it created in that list, only if you turn on
            &quot;Auto delete unfinished tasks&quot; for a category;
          </li>
          <li>
            create one hourly timer (an Apps Script trigger) in your account so
            tasks are added on schedule;
          </li>
          <li>show your email address on the settings page.</li>
        </BulletList>
        <p>
          How your data is handled is explained in the{" "}
          <Link
            to="/dailies-irl/privacy-policy"
            className="text-primary underline underline-offset-2"
          >
            Dailies IRL Privacy Policy
          </Link>
          , which is part of these terms.
        </p>
        <p>
          You can stop all of this at any time: delete your data from the
          settings page, remove Dailies IRL&apos;s access at{" "}
          <ExternalLink href="https://myaccount.google.com/connections" />, and
          uninstall the extension.
        </p>
      </TermsSection>

      <TermsSection title="5. Your content">
        <p>
          The categories and task names you write belong to you. You give us
          only the permission needed to store them in your own Google account
          and add them to your Google Tasks, so that Dailies IRL can work. We do
          not claim any ownership of them.
        </p>
        <p>Do not use Dailies IRL to store or create anything illegal.</p>
      </TermsSection>

      <TermsSection title="6. Acceptable use">
        <p>You agree not to:</p>
        <BulletList>
          <li>use Dailies IRL in a way that breaks any law or Google&apos;s terms;</li>
          <li>try to get into another person&apos;s account or data;</li>
          <li>
            overload, attack, disrupt or try to get around the limits of Dailies
            IRL or the Google services it uses;
          </li>
          <li>
            call the Dailies IRL Apps Script project from anything other than
            the official extension, or copy its OAuth client credentials;
          </li>
          <li>
            copy, sell or publish Dailies IRL, or a changed version of it, as
            your own product, except as allowed by any open-source license we
            publish the code under.
          </li>
        </BulletList>
      </TermsSection>

      <TermsSection title="7. It's free, and it can change">
        <p>
          Dailies IRL is currently free. We may add, change or remove features,
          or stop offering Dailies IRL, at any time and without notice. Dailies
          IRL also depends on Google services and their limits (for example,
          Apps Script quotas and the timing of triggers), which we do not
          control. Tasks may sometimes be added late, be skipped, or not be
          added at all.
        </p>
      </TermsSection>

      <TermsSection title="8. No warranty">
        <p>
          Dailies IRL is a hobby project provided &quot;AS IS&quot; and &quot;AS
          AVAILABLE&quot;, without warranties of any kind, express or implied,
          including any warranties of merchantability, fitness for a particular
          purpose, and non-infringement. We do not promise that Dailies IRL will
          be uninterrupted, error-free or secure, or that it will keep or add
          any task correctly.
        </p>
        <p>
          Dailies IRL is a tool to help you build habits. It is not medical,
          health, fitness, financial or other professional advice. You choose the
          tasks you write, and you decide whether and how to do them. Use your
          own judgment and do only what is safe for you.
        </p>
        <p>
          Keep your own copy of anything important. We are not responsible for
          lost tasks or settings.
        </p>
      </TermsSection>

      <TermsSection title="9. Limitation of liability">
        <p>
          To the fullest extent allowed by law, Krish Bharal will not be liable
          for any indirect, incidental, special, consequential or punitive
          damages, or any loss of data, tasks, time, profits or goodwill, arising
          from or related to your use of, or inability to use, Dailies IRL. In
          any case, our total liability for any claim related to Dailies IRL
          will not be more than the amount you paid us to use it in the 12
          months before the claim, which is zero if you have not paid anything.
        </p>
        <p>
          Some places do not allow some of these limits, so they may not all
          apply to you. Nothing in these terms limits any rights you have under
          the law that cannot be waived.
        </p>
      </TermsSection>

      <TermsSection title="10. Ending use">
        <p>
          You can stop using Dailies IRL at any time by following the steps in
          section 4. We may stop providing Dailies IRL to you, or block access,
          if you break these terms or if we have to for legal or security
          reasons. Sections 5, 8, 9, 11 and 13 still apply after you stop using
          Dailies IRL.
        </p>
      </TermsSection>

      <TermsSection title="11. Governing law">
        <p>
          These terms are governed by the laws of State of Texas, United States,
          without regard to its conflict-of-law rules, except where the law where
          you live gives you the right to use your local laws or courts.
        </p>
      </TermsSection>

      <TermsSection title="12. Changes to these terms">
        <p>
          We may update these terms. The new version will be posted at this
          address with a new &quot;Last updated&quot; date. If a change is
          important, we will also tell you inside the extension. If you keep
          using Dailies IRL after the change takes effect, you accept the new
          terms.
        </p>
      </TermsSection>

      <TermsSection title="13. General">
        <p>
          If any part of these terms can&apos;t be enforced, the rest still
          applies. If we don&apos;t enforce a part of these terms, that
          doesn&apos;t mean we give up the right to enforce it later. These
          terms and the Privacy Policy are the whole agreement between you and
          us about Dailies IRL.
        </p>
      </TermsSection>

      <TermsSection title="14. Contact">
        <address className="not-italic">
          Krish Bharal
          <br />
          Email: <SupportEmail />
          <br />
          Website: <ExternalLink href="https://krish544.com/dailies-irl" />
        </address>
      </TermsSection>

      <p className="border-t border-border pt-6 text-sm">
        Dailies IRL is not made, endorsed or sponsored by Google. Google, Google
        Tasks, Chrome and Google Apps Script are trademarks of Google LLC.
      </p>
    </article>
  );
}
