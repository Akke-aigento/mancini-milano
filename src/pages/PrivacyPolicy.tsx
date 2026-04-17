import Layout from '@/components/layout/Layout';
import SEO from '@/components/SEO';

const PrivacyPolicy = () => (
  <Layout>
    <SEO
      title="Privacy Policy"
      description="How Mancini Milano handles your personal data in accordance with GDPR."
    />
    <section className="max-w-site mx-auto px-4 lg:px-8 py-16 lg:py-24">
      <h1 className="font-heading text-3xl lg:text-[42px] tracking-heading uppercase text-foreground mb-4 text-center">
        Privacy Policy
      </h1>
      <p className="text-sm text-muted-foreground text-center mb-12">Last updated: January 2026</p>

      <div className="max-w-2xl mx-auto space-y-8 text-sm text-muted-foreground leading-relaxed">
        <div>
          <h2 className="text-foreground font-medium text-base mb-3">1. Data Controller</h2>
          <p>Mancini Milano, registered in Belgium, is the data controller responsible for the processing of your personal data in accordance with the General Data Protection Regulation (GDPR — EU 2016/679).</p>
          <p className="mt-2">Contact: info@mancinimilano.com</p>
        </div>

        <div>
          <h2 className="text-foreground font-medium text-base mb-3">2. Data We Collect</h2>
          <p>We collect the following categories of personal data:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Identity data: name, email address</li>
            <li>Contact data: shipping address, billing address, phone number</li>
            <li>Transaction data: order history, payment details (processed securely by third-party payment providers)</li>
            <li>Technical data: IP address, browser type, device information, cookies</li>
            <li>Communication data: messages sent through our contact form or email</li>
          </ul>
        </div>

        <div>
          <h2 className="text-foreground font-medium text-base mb-3">3. Purpose & Legal Basis</h2>
          <p>We process your data for the following purposes:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Order fulfillment and delivery (contractual necessity)</li>
            <li>Customer communication and support (legitimate interest)</li>
            <li>Newsletter and marketing communications (consent)</li>
            <li>Website analytics and improvement (legitimate interest)</li>
            <li>Legal compliance and fraud prevention (legal obligation)</li>
          </ul>
        </div>

        <div>
          <h2 className="text-foreground font-medium text-base mb-3">4. Data Sharing</h2>
          <p>We may share your data with trusted third parties solely for the purposes outlined above:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Payment processors (for secure transaction handling)</li>
            <li>Shipping carriers (for order delivery)</li>
            <li>Email marketing platforms (with your consent)</li>
            <li>Analytics providers (anonymized data)</li>
          </ul>
          <p className="mt-2">We never sell your personal data to third parties.</p>
        </div>

        <div>
          <h2 className="text-foreground font-medium text-base mb-3">5. Data Retention</h2>
          <p>We retain your personal data only for as long as necessary to fulfill the purposes for which it was collected, or as required by applicable law. Order data is retained for 7 years for accounting purposes in accordance with Belgian law.</p>
        </div>

        <div>
          <h2 className="text-foreground font-medium text-base mb-3">6. Your Rights</h2>
          <p>Under the GDPR, you have the following rights:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Right of access — request a copy of your personal data</li>
            <li>Right to rectification — correct inaccurate data</li>
            <li>Right to erasure — request deletion of your data</li>
            <li>Right to restrict processing</li>
            <li>Right to data portability</li>
            <li>Right to object to processing</li>
            <li>Right to withdraw consent at any time</li>
          </ul>
          <p className="mt-2">To exercise any of these rights, please contact us at info@mancinimilano.com.</p>
        </div>

        <div>
          <h2 className="text-foreground font-medium text-base mb-3">7. Cookies</h2>
          <p>Our website uses essential cookies to ensure proper functionality (e.g., cart session). We may also use analytics cookies with your consent to understand how visitors interact with our site. You can manage cookie preferences through your browser settings.</p>
        </div>

        <div>
          <h2 className="text-foreground font-medium text-base mb-3">8. Data Security</h2>
          <p>We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. All payment transactions are encrypted using SSL/TLS technology.</p>
        </div>

        <div>
          <h2 className="text-foreground font-medium text-base mb-3">9. Supervisory Authority</h2>
          <p>If you believe your data protection rights have been violated, you have the right to lodge a complaint with the Belgian Data Protection Authority (Gegevensbeschermingsautoriteit): <a href="https://www.gegevensbeschermingsautoriteit.be" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-gold-hover transition-colors">www.gegevensbeschermingsautoriteit.be</a></p>
        </div>

        <div>
          <h2 className="text-foreground font-medium text-base mb-3">10. Changes</h2>
          <p>We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date. We encourage you to review this policy periodically.</p>
        </div>
      </div>
    </section>
  </Layout>
);

export default PrivacyPolicy;
