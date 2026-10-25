import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalPage } from '@/components/legal/LegalPage';
import { LEGAL } from '@/lib/legal';
import { NIGHT_CHARGE } from '@/lib/pricing';
import { commissionPercent } from '@/lib/liveDb';

export const metadata: Metadata = {
  title: `Terms of Service | ${LEGAL.brand}`,
  description: `The terms for booking and providing services on ${LEGAL.brand}.`,
};

const contact = <a href="/contact">request a callback</a>;

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      intro={
        <p>
          These terms apply when you use the {LEGAL.brand} website or app, whether you book a service (“customer”) or provide one (“professional”). By
          creating an account or making a booking you agree to them. Please also read our <Link href="/privacy">Privacy Policy</Link>.
        </p>
      }
      sections={[
        {
          id: 'about',
          title: 'What HomeFix does',
          body: (
            <p>
              {LEGAL.brand} is run by {LEGAL.entity}. We connect customers in {LEGAL.serviceArea} with verified, independent professionals for plumbing,
              electrical, carpentry and related home repairs. The professional who accepts your booking carries out the work. We verify professionals,
              arrange the booking, show live tracking, and handle support and warranty claims.
            </p>
          ),
        },
        {
          id: 'accounts',
          title: 'Your account',
          body: (
            <ul>
              <li>You must be at least 18 years old.</li>
              <li>Give accurate details, including your phone number, address and map pin.</li>
              <li>Keep your login safe. You are responsible for bookings made from your account.</li>
            </ul>
          ),
        },
        {
          id: 'booking',
          title: 'Bookings and arrival times',
          body: (
            <ul>
              <li>You can book “right now” or schedule a visit. We offer your booking to verified professionals near your address, and the first to accept is assigned.</li>
              <li>If no professional accepts within 30 minutes, the booking closes and you can try again or ask for a callback.</li>
              <li>
                Arrival times, including our 15-minute target, are estimates based on distance and traffic. We work hard to meet them but cannot
                guarantee them.
              </li>
            </ul>
          ),
        },
        {
          id: 'prices',
          title: 'Prices and charges',
          body: (
            <ul>
              <li>The visit charge for each service is shown before you book. It covers the inspection and standard work for that service.</li>
              <li>If a part needs replacing, the professional tells you its price first. Nothing is added without your approval.</li>
              <li>
                Plumbing and electrical visits booked for “right now” between 8 PM and 6 AM, and electrical visits in the night slot (8 PM to 12 AM), have
                a flat ₹{NIGHT_CHARGE} night charge, shown before you book.
              </li>
              <li>The professional confirms the final amount with you before collecting it.</li>
            </ul>
          ),
        },
        {
          id: 'payment',
          title: 'Payment',
          body: (
            <p>
              You pay the professional directly after the work is done, by UPI, card or cash. The professional records the amount and payment method in the
              app, and you can see it on your booking. Please do not pay more than the agreed amount. If anyone asks you to, please {contact} and let us know.
            </p>
          ),
        },
        {
          id: 'cancel',
          title: 'Cancellations',
          body: (
            <ul>
              <li>Customers can cancel free of charge from the app while we are finding a professional, or while the professional is on the way.</li>
              <li>Once the professional has arrived, please settle any visit charge with them if you decide not to go ahead.</li>
              <li>If a professional cannot attend after accepting, we offer the booking to another professional nearby.</li>
            </ul>
          ),
        },
        {
          id: 'warranty',
          title: '7-day warranty',
          body: (
            <>
              <p>
                Every completed job has a 7-day workmanship warranty from the day it is completed. If the same problem returns within 7 days, we send a
                professional to fix it at no extra labour charge. To claim, {contact} and share your booking number.
              </p>
              <p>
                The warranty does not cover new or different problems, damage caused by misuse or accidents, or parts that you supplied. Replacement parts
                are covered by their manufacturer’s warranty, where one exists.
              </p>
            </>
          ),
        },
        {
          id: 'customer',
          title: 'Customer responsibilities',
          body: (
            <ul>
              <li>Make sure someone is at the address to let the professional in, and that the contact number you give is reachable.</li>
              <li>Give safe access to the work area and tell the professional about any hazards.</li>
              <li>Treat professionals with respect. Abuse, harassment or unsafe behaviour can lead to your account being closed.</li>
            </ul>
          ),
        },
        {
          id: 'professional',
          title: 'Professionals',
          body: (
            <ul>
              <li>You must complete identity, police and skill verification before going online, and keep your details up to date.</li>
              <li>You work as an independent service provider. You decide when to go online and which jobs to accept.</li>
              <li>
                Only accept jobs you can attend promptly. Charge only the visit charge, approved parts and any night charge shown in the app, and record
                the correct amount and payment method when you complete a job.
              </li>
              <li>
                {LEGAL.brand} charges a commission on each completed job, shown in your partner app (currently {commissionPercent()}% of the amount collected). Commission is
                settled with us as agreed with your onboarding team.
              </li>
              <li>Your live location is shared while you are online or on a job. Keep customer details private and use them only for that job.</li>
              <li>We may suspend or remove professionals for poor quality, overcharging, misconduct or unsafe behaviour.</li>
            </ul>
          ),
        },
        {
          id: 'misuse',
          title: 'What you must not do',
          body: (
            <ul>
              <li>Make fake bookings, use someone else’s phone number without permission, or give a false address.</li>
              <li>Arrange to take bookings found on {LEGAL.brand} off the platform to avoid commission.</li>
              <li>Try to break, overload, copy or misuse the website, app or other people’s data.</li>
            </ul>
          ),
        },
        {
          id: 'liability',
          title: 'Liability',
          body: (
            <>
              <p>
                We take care to verify professionals and to resolve problems quickly. If something goes wrong with a job, {contact} within 7 days and we will investigate and work with you and the professional to put it right.
              </p>
              <p>
                To the extent the law allows, our total liability for any booking is limited to the amount you paid for that booking, and we are not
                liable for indirect losses. Nothing in these terms limits rights you have under the Consumer Protection Act, 2019 or other laws that
                cannot be excluded.
              </p>
            </>
          ),
        },
        {
          id: 'suspension',
          title: 'Suspension and closing your account',
          body: (
            <p>
              You can stop using {LEGAL.brand} and ask us to delete your account at any time. We may suspend or close accounts that break these terms, put
              others at risk, or are used for fraud.
            </p>
          ),
        },
        {
          id: 'law',
          title: 'Changes, law and disputes',
          body: (
            <p>
              We may update these terms. If the change is significant, we will tell you in the app before it applies. These terms are governed by the laws
              of India, and the courts at {LEGAL.jurisdiction} have jurisdiction. We always try to resolve complaints directly first, so please {contact} first.
            </p>
          ),
        },
      ]}
    />
  );
}
