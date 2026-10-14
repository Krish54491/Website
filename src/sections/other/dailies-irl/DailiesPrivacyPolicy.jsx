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

function PolicySection({ title, children }) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold text-foreground">{title}</h2>
      {children}
    </section>
  );
}

// a) b) c) style lists used throughout the policy
function LetteredList({ children }) {
  return (
    <ol className="list-[lower-alpha] space-y-3 pl-6 marker:text-foreground">
      {children}
    </ol>
  );
}

function BulletList({ children }) {
  return <ul className="list-disc space-y-1 pl-6">{children}</ul>;
}

function StoredIn({ children }) {
  return (
    <p className="mt-1">
      <span className="font-semibold text-foreground">Stored in:</span>{" "}
      {children}
    </p>
  );
}

function Scope({ url }) {
  return <code className="block break-all text-xs">{url}</code>;
}

export default function DailiesPrivacyPolicy() {
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
          Dailies IRL - Privacy Policy
        </h1>
        <p className="text-sm">
          Effective date: October 14, 2026
          <br />
          Last updated: October 14, 2026
        </p>
      </header>

      <div className="space-y-4">
        <p>
          Dailies IRL (&quot;Dailies IRL&quot;, &quot;the extension&quot;,
          &quot;we&quot;, &quot;us&quot;) is a Chrome extension made by Krish
          Bharal, an independent developer. It adds tasks that you write, picked
          at random, to a &quot;Dailies IRL&quot; list in your Google Tasks on a
          daily, weekly or monthly schedule.
        </p>
        <p>
          This policy explains what data Dailies IRL accesses, how it is used,
          where it is stored, who it is shared with, and how you can delete it.
          It covers the Dailies IRL Chrome extension and the Google Apps Script
          project that runs its schedule. The same policy is linked from the
          Dailies IRL homepage (
          <ExternalLink href="https://krish544.com/dailies-irl" />
          ), the Google sign-in (consent) screen, and the Chrome Web Store
          listing.
        </p>
        <p className="font-semibold text-foreground">The short version:</p>
        <BulletList>
          <li>
            We have no servers of our own. Everything Dailies IRL stores stays
            in your own Google account.
          </li>
          <li>
            We do not collect analytics, use cookies for tracking, show ads, or
            sell or share your data with anyone.
          </li>
          <li>
            We, the developer, cannot see your tasks, your settings, or your
            email address.
          </li>
          <li>You can delete everything at any time (see section 8).</li>
        </BulletList>
      </div>

      <PolicySection title="1. Google permissions (scopes) we request and why">
        <p>
          When you first use Dailies IRL, Google asks you to sign in and allow
          these permissions. Each one is used only for the purpose listed.
        </p>
        <LetteredList>
          <li>
            <p className="font-semibold text-foreground">Google Tasks</p>
            <Scope url="https://www.googleapis.com/auth/tasks" />
            <p className="mt-1">
              &quot;Create, edit, organize, and delete all your tasks.&quot;
            </p>
            <p className="mt-1">Used to:</p>
            <BulletList>
              <li>
                read the names of your task lists, only to find the list called
                &quot;Dailies IRL&quot; (or create it if it doesn&apos;t exist);
              </li>
              <li>
                add the tasks Dailies IRL picks for you to that list, with a due
                date;
              </li>
              <li>
                if, and only if, you turn on &quot;Auto delete unfinished
                tasks&quot; for a category, delete unfinished tasks that Dailies
                IRL created in that list once their period has ended.
              </li>
            </BulletList>
            <p className="mt-1">
              Dailies IRL does not read, change or delete tasks in any of your
              other task lists, and it does not delete tasks you have completed.
            </p>
          </li>
          <li>
            <p className="font-semibold text-foreground">
              Run when you are not present
            </p>
            <Scope url="https://www.googleapis.com/auth/script.scriptapp" />
            <p className="mt-1">
              Used to create one hourly timer (an Apps Script
              &quot;trigger&quot;) in your own Google account. The timer lets
              your tasks be added on schedule even when Chrome is closed. It
              runs as you, only works on your own data, and is created when you
              first save your settings.
            </p>
          </li>
          <li>
            <p className="font-semibold text-foreground">Your email address</p>
            <Scope url="https://www.googleapis.com/auth/userinfo.email" />
            <p className="mt-1">
              Used only to show which Google account you are signed in with on
              the settings page (&quot;Signed in as ...&quot;). It is not
              stored, logged or sent anywhere else.
            </p>
          </li>
        </LetteredList>
      </PolicySection>

      <PolicySection title="2. Information Dailies IRL accesses and stores">
        <LetteredList>
          <li>
            <span className="font-semibold text-foreground">
              Your settings.
            </span>{" "}
            These are the things you type into the settings page: your time
            zone, your &quot;day off&quot; and &quot;double tasks&quot; chances,
            your category names, schedules and counts, the task names you write,
            and which tasks are marked &quot;Big&quot;.
            <StoredIn>
              Google Apps Script &quot;user properties&quot; in your own Google
              account. Only your account can read them. We cannot.
            </StoredIn>
          </li>
          <li>
            <span className="font-semibold text-foreground">
              Schedule records.
            </span>{" "}
            A small record of when each category last added tasks (for example
            &quot;2026-10-13&quot;), so tasks are never added twice for the same
            day, week or month.
            <StoredIn>
              the same Apps Script user properties in your account.
            </StoredIn>
          </li>
          <li>
            <span className="font-semibold text-foreground">
              Your agreement.
            </span>{" "}
            Which version of the data use notice on the settings page you agreed
            to, and when. Nothing is saved until you agree.
            <StoredIn>
              the same Apps Script user properties in your account, and in your
              browser&apos;s local storage on your own computer.
            </StoredIn>
          </li>
          <li>
            <span className="font-semibold text-foreground">
              The tasks Dailies IRL creates.
            </span>{" "}
            These are task names from your settings, with due dates. Each
            task&apos;s notes say which category it came from (for example
            &quot;Dailies IRL · Chores&quot;) plus a short tag, so that Auto
            delete can find it later.
            <StoredIn>
              your Google Tasks, in the &quot;Dailies IRL&quot; list, like any
              other task.
            </StoredIn>
          </li>
          <li>
            <span className="font-semibold text-foreground">
              Your unfinished Dailies IRL tasks.
            </span>{" "}
            Only if you turn on Auto delete, the unfinished tasks in the
            &quot;Dailies IRL&quot; list are read when a new period starts, to
            find the ones from that category&apos;s earlier periods and delete
            them. They are not stored or sent anywhere.
          </li>
          <li>
            <span className="font-semibold text-foreground">
              Your task list names.
            </span>{" "}
            Read each time the schedule runs, only to find the &quot;Dailies
            IRL&quot; list. They are not stored or sent anywhere.
          </li>
          <li>
            <span className="font-semibold text-foreground">
              Your email address.
            </span>{" "}
            See section 1(c). It is not stored.
          </li>
          <li>
            <span className="font-semibold text-foreground">
              Sign-in tokens.
            </span>{" "}
            Chrome&apos;s built-in sign-in system (the chrome.identity API) gets
            and manages the access token that lets the extension talk to Google.
            Chrome keeps it in memory. Dailies IRL does not save it, log it or
            send it anywhere except to Google.
          </li>
          <li>
            <span className="font-semibold text-foreground">Theme choice.</span>{" "}
            Your System/Light/Dark choice is saved in your browser&apos;s local
            storage on your own computer. It is not sent anywhere.
          </li>
        </LetteredList>
        <p className="font-semibold text-foreground">
          Dailies IRL does NOT collect:
        </p>
        <BulletList>
          <li>
            your browsing history, web page content or the tabs you visit;
          </li>
          <li>analytics, tracking data, cookies or advertising IDs;</li>
          <li>
            your name, contacts, location, payment details or any other personal
            information;
          </li>
          <li>any Google data besides what is listed above.</li>
        </BulletList>
      </PolicySection>

      <PolicySection title="3. How your information is used">
        <p>
          Your information is used only to provide Dailies IRL&apos;s single
          purpose: adding randomly picked tasks that you wrote to your Google
          Tasks on the schedule you set, and showing you your settings so you
          can change them.
        </p>
        <p>
          It is never used for advertising, for building profiles about you, to
          decide credit or lending, to train or improve any artificial
          intelligence or machine learning model, or for any purpose unrelated
          to the feature described above.
        </p>
      </PolicySection>

      <PolicySection title="4. How your information moves">
        <p>Dailies IRL has no backend server. Data only moves between:</p>
        <BulletList>
          <li>the Dailies IRL extension in your Chrome browser, and</li>
          <li>
            Google&apos;s own services, running as you: the Google Apps Script
            API (script.googleapis.com), Google Apps Script, and the Google
            Tasks API.
          </li>
        </BulletList>
        <p>
          All of these connections use HTTPS (encrypted in transit). The
          extension does not load or run code from the internet; the Apps Script
          project only sends back data such as your settings.
        </p>
      </PolicySection>

      <PolicySection title="5. Who we share your information with">
        <p>
          We do not sell, rent, trade, transfer or disclose your Google user
          data or any other information to anyone. There are no advertising
          networks, data brokers, analytics providers or other third parties
          involved.
        </p>
        <p>
          The only company that handles your data is Google, because Dailies IRL
          runs entirely on Google&apos;s services in your own account.
          Google&apos;s handling of that data is covered by the{" "}
          <ExternalLink href="https://policies.google.com/privacy">
            Google Privacy Policy
          </ExternalLink>
          .
        </p>
        <p>
          We would only ever disclose information if it is required by law, and
          as explained in section 6, we do not have access to your settings or
          tasks in the first place.
        </p>
      </PolicySection>

      <PolicySection title="6. What the developer can see">
        <p>
          Because the scheduler is a Google Apps Script project owned by the
          developer, Google provides the developer with limited technical
          information about how the project runs, the same as for any Apps
          Script project:
        </p>
        <BulletList>
          <li>
            when a function ran, how long it took, and whether it succeeded or
            failed;
          </li>
          <li>
            error messages from failed runs. These are written by Dailies IRL
            itself, and some can include the name of one of your categories (for
            example &quot;Chores needs at least one task&quot;);
          </li>
          <li>
            the total number of accounts that used the project. Google
            identifies users in these logs with temporary anonymous keys, not
            names or email addresses.
          </li>
        </BulletList>
        <p>
          The developer uses this information only to find and fix bugs. Google
          keeps these logs for a limited time set by Google, and they are not
          copied or kept anywhere else. The developer cannot see your task
          names, your other settings, your Google Tasks or your email address.
        </p>
        <p>No person reads your data, except you.</p>
      </PolicySection>

      <PolicySection title="7. Data protection and security">
        <BulletList>
          <li>
            Your data stays inside your own Google account, protected by your
            Google sign-in. Only your account can read your Apps Script user
            properties and your Google Tasks.
          </li>
          <li>Google encrypts this data in transit (HTTPS) and at rest.</li>
          <li>
            Access tokens are handled by Chrome&apos;s identity API and never
            saved by Dailies IRL.
          </li>
          <li>
            We request only the permissions Dailies IRL needs to work (section
            1).
          </li>
          <li>
            The extension contains all of its own code, follows Chrome&apos;s
            Manifest V3 rules, and does not run code downloaded from the
            internet.
          </li>
          <li>
            Everything you send is checked by the Apps Script project before it
            is saved.
          </li>
        </BulletList>
        <p>
          No system is perfectly secure, but because we don&apos;t run our own
          servers or keep copies of your data, there is no Dailies IRL database
          to be breached.
        </p>
      </PolicySection>

      <PolicySection title="8. How long data is kept and how to delete it">
        <p>
          Your settings and schedule records are kept in your Google account
          until you delete them. The tasks Dailies IRL created stay in your
          Google Tasks until you (or &quot;Auto delete&quot;, if you turn it on)
          delete them.
        </p>
        <p>To delete your data:</p>
        <ol className="list-decimal space-y-2 pl-6">
          <li>
            Open the Dailies IRL settings page and click &quot;Delete my
            data&quot;. This removes all your settings, schedule records and
            agreement record from your Google account and turns off the hourly
            timer.
          </li>
          <li>
            To also remove the tasks it created, tick &quot;Also delete the
            Dailies IRL list&quot; before clicking &quot;Delete my data&quot;,
            or delete the &quot;Dailies IRL&quot; list yourself in{" "}
            <ExternalLink href="https://tasks.google.com/">
              Google Tasks
            </ExternalLink>
            .
          </li>
          <li>
            Remove Dailies IRL&apos;s access to your Google account at{" "}
            <ExternalLink href="https://myaccount.google.com/connections" />.
          </li>
          <li>
            Uninstall the extension from <code>chrome://extensions</code>. This
            also removes your theme choice.
          </li>
        </ol>
        <p>
          You can also see and delete the hourly timer yourself under &quot;My
          Triggers&quot; at{" "}
          <ExternalLink href="https://script.google.com/home/triggers" />.
        </p>
        <p>
          If you would like help deleting your data, email <SupportEmail /> and
          we will explain how. Since we cannot access your data ourselves, the
          steps above are how it is deleted.
        </p>
        <p>
          You can view all of your settings at any time on the settings page,
          and all created tasks in Google Tasks.
        </p>
      </PolicySection>

      <PolicySection title="9. Google API Services User Data Policy (Limited Use)">
        <p>
          Dailies IRL&apos;s use and transfer to any other app of information
          received from Google APIs will adhere to the{" "}
          <ExternalLink href="https://developers.google.com/terms/api-services-user-data-policy">
            Google API Services User Data Policy
          </ExternalLink>
          , including the Limited Use requirements.
        </p>
        <p>
          The use of information received from Google APIs will also adhere to
          the{" "}
          <ExternalLink href="https://developer.chrome.com/docs/webstore/program-policies">
            Chrome Web Store User Data Policy
          </ExternalLink>
          , including the Limited Use requirements.
        </p>
      </PolicySection>

      <PolicySection title="10. Children's privacy">
        <p>
          Dailies IRL is not directed to children under 13 (or the minimum age
          to have a Google account in your country) and does not knowingly
          collect data from them. Using it requires your own Google account. If
          you believe a child has used Dailies IRL, contact <SupportEmail /> and
          we will help remove the data.
        </p>
      </PolicySection>

      <PolicySection title="11. Your rights">
        <p>
          Depending on where you live (for example, in the EU, UK or
          California), you may have the right to access, correct, delete or move
          your data, or to object to how it is used. With Dailies IRL you can do
          all of this yourself: view and change everything on the settings page,
          delete it as described in section 8, and keep your tasks in Google
          Tasks. We do not sell or &quot;share&quot; personal information for
          advertising. For any request or question, contact <SupportEmail />.
        </p>
      </PolicySection>

      <PolicySection title="12. Changes to this policy">
        <p>
          If this policy changes, the new version will be posted at this address
          with a new &quot;Last updated&quot; date. If Dailies IRL ever starts
          to use your data in a new way or to request a new Google permission,
          we will tell you inside the extension and ask for your permission
          before it does.
        </p>
      </PolicySection>

      <PolicySection title="13. Contact">
        <address className="not-italic">
          Krish Bharal
          <br />
          Email: <SupportEmail />
          <br />
          Website: <ExternalLink href="https://krish544.com/dailies-irl" />
        </address>
      </PolicySection>

      <p className="border-t border-border pt-6 text-sm">
        Dailies IRL is not made, endorsed or sponsored by Google. Google, Google
        Tasks, Chrome and Google Apps Script are trademarks of Google LLC.
      </p>
    </article>
  );
}
