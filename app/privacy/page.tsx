import type { Metadata } from 'next';
import { LegalPage } from '@/components/legal/LegalPage';
import { LEGAL } from '@/lib/legal';

export const metadata: Metadata = {
  title: `Privacy Policy | ${LEGAL.brand}`,
  description: `How ${LEGAL.brand} collects, uses and protects your personal data.`,
};

const mail = <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a>;

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro={
        <>
          <p>
            {LEGAL.entity} (“{LEGAL.brand}”, “we”, “us”) runs the {LEGAL.brand} website and app, which connect customers in {LEGAL.serviceArea} with
            verified home-repair professionals. This policy explains what personal data we collect, why, who we share it with, and the rights you have
            under India’s Digital Personal Data Protection Act, 2023 and the Information Technology Act, 2000.
          </p>
          <p>
            By creating an account or booking a service, you agree to us handling your data as described here. You can withdraw that consent at any
            time (see section 9).
          </p>
        </>
      }
      sections={[
        {
          id: 'collect',
          title: 'What we collect',
          body: (
            <>
              <p><strong>If you book services (customers):</strong></p>
              <ul>
                <li>Your name and email address, from Google sign-in or the email you sign up with.</li>
                <li>Phone numbers: yours, and any other contact person you add for a visit. Please only add someone else’s number with their permission.</li>
                <li>Saved addresses and the exact map pin for each address.</li>
                <li>Your device location, only when you allow it, to find your address.</li>
                <li>Booking details: the service, your description of the problem, date and time, and its status.</li>
                <li>Job records: the amount charged and how you paid (cash, UPI or card). We never collect card numbers, UPI PINs or bank details.</li>
              </ul>
              <p><strong>If you work with us (professionals):</strong></p>
              <ul>
                <li>Name, phone number, trade, area, years of experience, and the identity, police and skill verification you complete with us.</li>
                <li>Your live location while you are online or on a job, so we can offer you nearby requests and show customers your arrival.</li>
                <li>Jobs you accept, amounts collected, commission and earnings.</li>
              </ul>
              <p><strong>From everyone:</strong></p>
              <ul>
                <li>Messages you send us, such as callback requests (your phone number) and notes to our team (name, email and message).</li>
                <li>Basic technical data such as your IP address and browser, used to keep the service secure and to block abuse.</li>
              </ul>
            </>
          ),
        },
        {
          id: 'use',
          title: 'How we use it',
          body: (
            <ul>
              <li>To take your booking and offer it to verified professionals near your address (within about 10 km).</li>
              <li>To let you and your professional contact each other, and to show live tracking while they are on the way.</li>
              <li>To record the work done, the amount paid, and your 7-day warranty.</li>
              <li>To call you back when you ask us to, and to handle support requests and complaints.</li>
              <li>To verify professionals, calculate their earnings and commission, and keep the platform safe.</li>
              <li>To prevent fraud, spam and misuse, and to meet our legal obligations.</li>
            </ul>
          ),
        },
        {
          id: 'share',
          title: 'Who we share it with',
          body: (
            <>
              <p>We do not sell your personal data, and we do not use it for advertising.</p>
              <ul>
                <li>
                  <strong>Your professional</strong> receives your name, the contact person and phone number for the visit, your address and map pin, and
                  your problem description, once they accept your booking.
                </li>
                <li>
                  <strong>You</strong> see your professional’s name, phone number, trade, experience and live location while they are on the way.
                </li>
                <li>
                  <strong>Service providers</strong> who run parts of {LEGAL.brand} for us: Google Firebase (sign-in), Neon (database), Vercel (hosting),
                  Upstash (security and rate limiting, using your IP address), OpenStreetMap’s Nominatim service (turning a map pin into an address),
                  OSRM (road routes and travel times) and OpenFreeMap (map images). When a professional taps “Navigate”, Google Maps opens with your
                  address as the destination.
                </li>
                <li><strong>Authorities</strong>, when the law requires it or to protect someone’s safety.</li>
              </ul>
              <p>Some of these providers store data on servers outside India. They may only use it to provide their service to us.</p>
            </>
          ),
        },
        {
          id: 'location',
          title: 'Location data',
          body: (
            <ul>
              <li>Customers: we use your device location only when you allow it, to place the pin on your address. You can always set the pin by hand instead.</li>
              <li>Professionals: your location is shared while you are online or on a job, and stops when you go offline.</li>
              <li>Customers see a professional’s live location only between the professional accepting the job and arriving.</li>
            </ul>
          ),
        },
        {
          id: 'cookies',
          title: 'Cookies',
          body: (
            <p>
              We only use cookies that are needed to keep you signed in: a customer login cookie that lasts up to 30 days, and an admin login cookie that
              lasts up to 12 hours. We do not use advertising or analytics cookies.
            </p>
          ),
        },
        {
          id: 'retention',
          title: 'How long we keep it',
          body: (
            <p>
              We keep your account data while your account is active. Booking and payment records are kept for as long as needed for warranty claims,
              disputes, and our tax and legal obligations. When data is no longer needed, or you ask us to delete it and we have no legal reason to keep
              it, we delete or anonymise it.
            </p>
          ),
        },
        {
          id: 'security',
          title: 'How we protect it',
          body: (
            <p>
              All traffic is encrypted (HTTPS). Login cookies cannot be read by other scripts on the page, only authorised team members can access the
              admin tools, and we limit repeated login and form attempts. No system is perfectly secure, but we will tell you and the authorities as the
              law requires if a breach affects your data.
            </p>
          ),
        },
        {
          id: 'children',
          title: 'Children',
          body: <p>{LEGAL.brand} is for people aged 18 and over. We do not knowingly collect data from children.</p>,
        },
        {
          id: 'rights',
          title: 'Your rights',
          body: (
            <>
              <p>Under the Digital Personal Data Protection Act, 2023 you can:</p>
              <ul>
                <li>ask for a summary of the personal data we hold about you and who we have shared it with;</li>
                <li>correct or update your data (you can edit your profile and addresses in the app at any time);</li>
                <li>ask us to delete your data and account;</li>
                <li>withdraw your consent (this may mean we can no longer provide the service);</li>
                <li>nominate someone to exercise these rights for you in case of death or incapacity;</li>
                <li>raise a complaint with our Grievance Officer, and then with the Data Protection Board of India.</li>
              </ul>
              <p>To use any of these rights, email {mail}. We will reply within 30 days.</p>
            </>
          ),
        },
        {
          id: 'changes',
          title: 'Changes to this policy',
          body: (
            <p>
              If we change this policy, we will update the date at the top. If the change is significant, we will tell you in the app before it applies.
            </p>
          ),
        },
        {
          id: 'contact',
          title: 'Grievance Officer and contact',
          body: (
            <p>
              {LEGAL.grievanceOfficer}
              <br />
              {LEGAL.entity}, {LEGAL.jurisdiction}
              <br />
              Email: {mail}
            </p>
          ),
        },
      ]}
    />
  );
}
