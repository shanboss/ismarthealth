"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function PhysicianEULA() {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!agreed) return;
    router.push("/Physician_Register");
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="mb-6 flex items-center gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Go back"
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-foreground/20 bg-background text-foreground transition hover:opacity-80 active:scale-95"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-semibold tracking-tight">
          Physician EULA
        </h1>
      </div>

      <div className="mt-4 rounded-lg border border-foreground/10 bg-background p-4 shadow-sm">
        <div className="max-h-112 overflow-y-auto pr-2 space-y-4 leading-7 text-foreground">
          <p className="text-sm text-foreground/70">Last updated: Oct-6-2017</p>

          <p>
            Please read this End-User License Agreement ("Agreement") carefully
            before clicking the "I Agree" button and using ismarthealth.in
            ("Application").
          </p>
          <p>
            This End-User License Agreement (EULA) is a legal agreement between
            you (either as an individual or on behalf of an entity) and
            iNetFrame Technologies Pvt Ltd. IF YOU DO NOT AGREE TO ALL OF THE
            TERMS OF THIS EULA, DO NOT INSTALL, USE OR COPY THE SOFTWARE.
          </p>

          <h2 className="mt-6 text-lg font-semibold">SUMMARY</h2>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              This Software is provided "as-is" with no warranties, and you
              agree that iNetFrame Technologies Pvt Ltd. is not liable for
              anything you do with it.
            </li>
            <li>
              If so, you may use the Software for free and for any lawful
              purpose.
            </li>
            <li>
              You must agree to all of the terms of this EULA to use this
              Software.
            </li>
            <li>
              This Software automatically communicates with iNetFrame servers.
            </li>
          </ul>

          <h2 className="mt-6 text-lg font-semibold">The Agreement</h2>
          <p>
            By downloading, installing, using, or copying the Software, you
            accept and agree to be bound by the terms of this EULA. If you do
            not agree to all of the terms of this EULA, you may not download,
            install, use or copy the Software.
          </p>

          <h2 className="mt-6 text-lg font-semibold">License</h2>
          <p>
            INetFrame Technologies grants you a revocable, non-exclusive,
            non-transferable, limited license to download, install and use the
            Application solely for your personal, non-commercial purposes
            strictly in accordance with the terms of this Agreement.
          </p>

          <h2 className="mt-6 text-lg font-semibold">Restriction</h2>
          <p>You agree not to, and you will not permit others to:</p>
          <p>
            License, sell, rent, lease, assign, distribute, transmit, host,
            outsource, disclose or otherwise commercially exploit the
            Application or make the Application available to any third party.
          </p>
          <p>
            When using the Software you must use it in a manner that complies
            with the applicable laws in the jurisdiction(s) in which you use the
            Software.
          </p>

          <h2 className="mt-6 text-lg font-semibold">Privacy Policy</h2>
          <p>You agree not to, and you will not permit others to:</p>

          <h3 className="mt-4 font-semibold">Introduction</h3>
          <p>
            ismarthealth.in ("us" "we" or "INetFrame Technologies") is committed
            to respecting the privacy rights of our customers, visitors, and
            other users of the ismarthealth.in services ("Services") provided
            via the ismarthealth.in website (collectively, "Site"). We created
            this Site Privacy Policy ("Privacy Policy") to give you confidence
            as you visit and use the Site, and to demonstrate our commitment to
            fair information practices and the protection of privacy. This
            Privacy Policy is only applicable to the Site, and not to any other
            websites that you may be able to access from the Site or any website
            of ismarthealth.in's partners, each of which may have data
            collection, storage, and use practices and policies that differ
            materially from this Privacy Policy. Your use of the Site is
            governed by this Privacy Policy and the Terms of Use. If you are
            registering an account or using the Site on behalf of an individual
            or entity other than yourself, you represent that you are authorized
            by such individual or entity to accept this Privacy Policy on such
            individual's or entity's behalf.
          </p>

          <h3 className="mt-4 font-semibold">Traffic Data Collected</h3>
          <p>
            We automatically track and collect the following categories of
            information when you visit our Site: (1) IP addresses; (2) domain
            servers; (3) types of computers accessing the Site; (4) types of web
            browsers used to access the Site; (5) referring source which may
            have sent you to the Site; and (6) other information associated with
            the interaction of your browser and the Site (collectively "Traffic
            Data").
          </p>

          <h3 className="mt-4 font-semibold">Personal Information Collected</h3>
          <p>
            In order for you to access certain areas of the Site, we may require
            you to provide us with certain information that personally
            identifies you ("Personal Information"). Personal Information
            includes the following categories of information: (1) Contact Data
            (such as your e-mail address, phone number and ismarthealth.in
            password); (2) Demographic Data (such as your gender, your date of
            birth and your zip code); and (3) Medical Data (such as your
            previous doctors visited, your reason for visit and your date of
            visit, your medical history, and other medical and protected health
            information you choose to share with us). If you communicate with us
            by, for example, e-mail or letter, any information provided in such
            communication may be collected as Personal Information.
          </p>

          <h3 className="mt-4 font-semibold">Cookies</h3>
          <p>
            "Cookies" are small computer files that are transferred to your
            computer's hard drive that contain information such as user ID, user
            preferences, lists of pages visited and activities conducted while
            browsing the Site. At your option, expense and responsibility, you
            may block cookies or delete cookies from your hard drive. However,
            by disabling cookies, you may not have access to the entire set of
            features of the Site.
          </p>
          <p>
            Generally, we use "cookies" to customize your experience on our Site
            and to store your password so you do not have to re-enter it each
            time you visit the Site.
          </p>
          <p>
            In addition, our business partners may use cookies to provide us
            with anonymous data and information regarding the use of our Site.
            Specifically, some of our business partners use cookies to show
            ismarthealth.in ads on other sites on the internet as a result of
            you using the Site. Such cookies do not contain any Personal
            Information. You may opt out of receiving cookies placed by such
            third party vendors by visiting the Network Advertising Initiative
            opt out page.
          </p>
          <p>
            Other cookies used by our business partners may collect other
            non-personally identifying information, such as the computer's IP
            address, type of operating system, type of internet browsing
            software, what web pages were viewed at what time, the geographic
            location of your internet service provider and demographic
            information, such as gender and age range. This information is used
            to provide ismarthealth.in with more information about our users'
            demographics and internet behaviors. You may find out more about the
            information collected and how to opt-out of receiving these cookies
            by visiting our partner's website.
          </p>
          <p>
            We do not link the information stored in these cookies directly to
            any of your Personal Information you submit while on the Site,
            however.
          </p>

          <h3 className="mt-4 font-semibold">Website Analytics</h3>
          <p>
            We may use third party website analytics services in connection with
            the Site. These website analytics services do not collect Personal
            Information that you do not voluntarily enter into the Site. These
            services do not track your browsing habits across websites which do
            not use their services. We are using the information collected from
            these services to find usability problems to make the Site easier to
            use. The recordings will never identify you or your account.
          </p>

          <h3 className="mt-4 font-semibold">Storage</h3>
          <p>
            We store all Traffic Data and review postings indefinitely, even
            after "deletion," and may archive such information elsewhere. We
            store all Personal Information until you request that we modify or
            delete it, in which case we may still wind up retaining some of that
            information for the reasons described in Section below.
          </p>

          <h3 className="mt-4 font-semibold">
            ismarthealth.in's Use of Your Information
          </h3>
          <p>
            We may use your Personal Information to recommend certain resources.
            We may use your Contact Data to send you information about
            ismarthealth.in or our products or Services, to contact you when
            necessary, including to remind you of upcoming or follow-up
            appointments. We may use your Demographic Data, your Traffic Data,
            or your Medical Data to customize and tailor your experience on the
            Site, in emails and in other communications, displaying content that
            we think you might be interested in and according to your
            preferences. You agree that ismarthealth.in may use Personal
            Information to allow your doctors to make appointments with other
            doctors on your behalf through the Services. We may also use your
            de-identified Personal Information to run (or authorize third
            parties to run) statistical research on individual or aggregate
            health or medical trends. Such research would only use your Personal
            Information in an anonymous manner that cannot be tied directly back
            to you.
          </p>

          <h3 className="mt-4 font-semibold">Sharing of Information</h3>
          <p>
            We share certain categories of information we collect from you in
            the ways described in this Privacy Policy, including as described
            below:
          </p>
          <p>
            We may share your Contact Data, Demographic Data and Medical Data
            with Providers you choose to schedule on the Site.
          </p>
          <p>
            In order to customize your advertising interactions, we may share
            Personal Information with advertisers and other third parties only
            on an aggregate (i.e., non-personally-identifiable) basis.
          </p>
          <p>
            We may share your de-identified Personal Information with third
            parties to enable them to run statistical research on individual or
            aggregate health or medical trends.
          </p>
          <p>
            We share Personal Information and Traffic Data with our business
            partners who assist us by performing core services (such as hosting,
            fulfillment, or data storage and security) related to our operation
            of the Site and/or by making certain Interactive Tools available to
            our users. Those business partners shall be bound to uphold the same
            standards of security and confidentiality that we have promised to
            you in this Privacy Policy, and they will only use your Contact Data
            and other Personal Information to carry out their specific business
            obligations to ismarthealth.in and to provide your requested medical
            care and services.
          </p>
          <p>
            We may transfer information about you to another company in
            connection with a merger, sale or acquisition by or of
            ismarthealth.in. In this event, we will use reasonable efforts to
            notify you before information about you are transferred and becomes
            subject to a different privacy policy. ismarthealth.in does not
            share, sell, rent or trade your Personal Information with any third
            parties for their promotional purposes.
          </p>

          <h3 className="mt-4 font-semibold">User Choice</h3>
          <p>
            You may choose not to provide us with any Personal Information. In
            such an event, you can still access and use much of the Site;
            however you will not be able to access and use those portions of the
            Site that require your Personal Information.
          </p>

          <h3 className="mt-4 font-semibold">Confidentiality and Security</h3>
          <p>
            Except as otherwise provided in this Privacy Policy, we will keep
            your Personal Information private and will not share it with third
            parties, unless we believe in good faith that disclosure of your
            Personal Information or any other information we collect about you
            is necessary to: (1) comply with a court order or other legal
            process; (2) protect the rights, property or safety of
            ismarthealth.in or another party; (3) enforce our Terms of Use; or
            (4) respond to claims that any posting or other content violates the
            rights of third-parties.
          </p>

          <h3 className="mt-4 font-semibold">Doctors & Laboratories</h3>
          <p>
            Doctors, Laboratories, their employees, and their agents should be
            particularly aware of their obligations of patient confidentiality,
            including without limitation their obligations under the related
            law, both in communicating with ismarthealth.in and in responding to
            a review of their services posted on our Site. ismarthealth.in does
            not have, and will not accept, any obligations of confidentiality
            with respect to any communications other than those expressly stated
            in this Privacy Policy and ismarthealth.in's Terms of Use.
          </p>

          <h3 className="mt-4 font-semibold">Public Information</h3>
          <p>
            Any information that you may reveal in a review posting or other
            online discussion or forum is intentionally open to the public and
            is not in any way private. You should think carefully before
            disclosing any personally identifiable information in any public
            forum. What you have written may be seen and/or collected by third
            parties and may be used by others in ways we are unable to control
            or predict.
          </p>

          <h3 className="mt-4 font-semibold">Security</h3>
          <p>
            The security of your Personal Information is important to us. We
            follow generally accepted industry standards to protect the Personal
            Information submitted to us, both during transmission and once we
            receive it. For example, when you enter sensitive information on our
            Site, we encrypt that information using secure socket layer
            technology (SSL).
          </p>
          <p>
            Although we make good faith efforts to store Personal Information in
            a secure operating environment that is not open to the public, you
            should understand that there is no such thing as complete security,
            and we do not guarantee that there will be no unintended disclosures
            of your Personal Information. If we become aware that your Personal
            Information has been disclosed in a manner not in accordance with
            this Privacy Policy, we will use reasonable efforts to notify you of
            the nature and extent of the disclosure (to the extent we know that
            information) as soon as reasonably possible and as permitted by law.
          </p>

          <h3 className="mt-4 font-semibold">Lost or Stolen Information</h3>
          <p>
            You must promptly notify us if your Contact Data is lost, stolen, or
            used without permission. In such an event, we will remove that
            Contact Data from your account and update our records accordingly.
          </p>

          <h3 className="mt-4 font-semibold">
            Updates and Changes to Privacy Policy
          </h3>
          <p>
            We reserve the right, at any time, to add to, change, update, or
            modify this Privacy Policy so please review it frequently. If we do,
            then we will notify you here, as well as by posting a notice on our
            Site and, where appropriate, a link to the modified policy so that
            you can review it. In all cases, use of information we collect is
            subject to the Privacy Policy in effect at the time such information
            is collected.
          </p>

          <h3 className="mt-4 font-semibold">
            Controlling Your Personal Information
          </h3>
          <p>
            As a registered user of the Site, you can modify some of the
            Personal Information you have included in your profile or change
            your username by logging in and accessing your account. Upon your
            request, ismarthealth.in will use commercially reasonable efforts to
            delete your account and the Personal Information in your profile;
            however, it may be impossible to remove your account without some
            residual information being retained by ismarthealth.in.
            ismarthealth.in has no obligation to delete any data or information
            you provide on a Medical History Form following termination of your
            account or the account of any medical professional to whom your
            Medical History Form was submitted through the Site. Registered
            users who wish to close their account should contact
            support@ismarthealth.in.
          </p>

          <h3 className="mt-4 font-semibold">Links to Other Websites</h3>
          <p>
            The Site contains links to third party websites to which
            ismarthealth.in has no affiliation. ismarthealth.in does not share
            your personal information with those websites and is not responsible
            for their privacy practices. Some web sites may have the look and
            feel of our Site. Please be aware that you may be on a different
            site and that this Privacy Policy only covers our Site. Should you
            decide to visit one of these third party websites, we suggest that
            you read its privacy policy.
          </p>

          <h3 className="mt-4 font-semibold">Open-Source Notices</h3>
          <p>
            Certain items of software code provided with the Software may be
            subject to "open source" or "free software" licenses ("Open Source
            Software"). Any such Open Source Software is provided under the
            terms of the open source license agreement or copyright notice
            accompanying such Open Source Software or as described in the Open
            Source License Notice accompanying the Software. The Software
            includes certain Open Source Software originating from third
            parties, which is subject to different and/or additional licenses,
            disclaimers and notices. Nothing in this EULA limits your rights
            under, or grants you rights that supersede, the terms and conditions
            of any applicable license for the Open Source Software, including
            any rights to copy, modify, or distribute the Open Source Software
            under the applicable license. If iNetFrame Technologies makes any
            modifications to the Open Source Software and if the applicable
            license requires that such modifications be made available, then
            same will be available with its modifications on the website.
          </p>

          <h3 className="mt-4 font-semibold">Modifications to Application</h3>
          <p>
            INetFrame Technologies reserves the right to modify, suspend or
            discontinue, temporarily or permanently, the Application or any
            service to which it connects, with or without notice and without
            liability to you.
          </p>
          <p>
            THE SOFTWARE IS PROVIDED "AS IS," WITHOUT WARRANTY OF ANY KIND,
            EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
            MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
            NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
            BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
            ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
            CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
            SOFTWARE.
          </p>

          <h3 className="mt-4 font-semibold">Term and Termination</h3>
          <p>
            This Agreement shall remain in effect until terminated by you or
            INetFrame Technologies.
          </p>
          <p>
            INetFrame Technologies may, in its sole discretion, at any time and
            for any or no reason, suspend or terminate this Agreement with or
            without prior notice.
          </p>
          <p>
            This Agreement will terminate immediately, without prior notice from
            INetFrame Technologies, in the event that you fail to comply with
            any provision of this Agreement. You may also terminate this
            Agreement by deleting the Application and all copies thereof from
            your desktop.
          </p>
          <p>
            Upon termination of this Agreement, you shall cease all use of the
            Application and delete all copies of the Application from your
            desktop.
          </p>

          <h3 className="mt-4 font-semibold">Severability</h3>
          <p>
            If any provision of this Agreement is held to be unenforceable or
            invalid, such provision will be changed and interpreted to
            accomplish the objectives of such provision to the greatest extent
            possible under applicable law and the remaining provisions will
            continue in full force and effect.
          </p>

          <h3 className="mt-4 font-semibold">Amendments to this Agreement</h3>
          <p>
            INetFrame Technologies reserves the right, at its sole discretion,
            to modify or replace this Agreement at any time. If a revision is
            material we will provide at least 30 (changes this) days' notice
            prior to any new terms taking effect. What constitutes a material
            change will be determined at our sole discretion.
          </p>

          <h3 className="mt-4 font-semibold">Contact Information</h3>
          <p>
            If you have any questions about this Agreement, please contact us
            via email at support@ismarthealth.in or INetFrame Technologies, #185
            "ISHTA" – 1st floor, 17TH Main Road, Banashankari II Stage,
            Bangalore – 560 070, India.
          </p>

          <p>Copyright ismarthealth.in © 2017-2018. All Rights Reserved.</p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <label className="inline-flex items-center gap-2 text-foreground">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="h-4 w-4 rounded border-foreground/30 bg-background text-foreground focus:ring-foreground"
          />
          I agree
        </label>
        <div>
          <button
            type="submit"
            disabled={!agreed}
            className="inline-flex items-center justify-center rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition hover:opacity-80 disabled:opacity-50"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
}
