import Layout from '@/components/layout/Layout';

const About = () => (
  <Layout>
    <section className="max-w-site mx-auto px-4 lg:px-8 py-16 lg:py-24">
      <h1 className="font-heading text-3xl lg:text-[42px] tracking-heading uppercase text-foreground mb-12 text-center">
        About Us
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-20">
        {/* Image */}
        <div className="aspect-[4/5] overflow-hidden bg-card">
          <img
            src="https://mancinimilano.com/cdn/shop/files/WhatsApp_Image_2026-02-21_at_16.18.43_1x1.jpg?v=1771687166"
            alt="Mancini Milano"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Text */}
        <div>
          <span className="text-primary text-xs uppercase tracking-button font-medium mb-4 block">Our Story</span>
          <h2 className="font-heading text-2xl lg:text-3xl tracking-heading text-foreground mb-6 italic">
            Where Italian elegance meets street authority
          </h2>
          <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <p>
              At Mancini Milano, fashion is more than clothing — it is a statement of individuality, confidence, and timeless style. Founded with the vision of blending contemporary streetwear with Italian elegance, our brand represents a lifestyle where luxury meets authenticity.
            </p>
            <p>
              Every piece is crafted with attention to detail, combining bold designs, premium materials, and a modern edge. From the streets of Milano to the world stage, we create for those who refuse to blend in.
            </p>
            <p>
              Our collections are designed for the modern individual who values quality, self-expression, and the pursuit of greatness. We believe that what you wear is an extension of who you are — and at Mancini Milano, we make sure you stand out.
            </p>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
        {[
          { title: 'Craftsmanship', desc: 'Every piece is meticulously crafted using premium materials sourced from the finest suppliers. Quality is never compromised.' },
          { title: 'Authenticity', desc: 'We stay true to our roots. Our designs reflect a genuine blend of Italian heritage and contemporary street culture.' },
          { title: 'Innovation', desc: 'We push boundaries. Each collection introduces new silhouettes, techniques, and perspectives that redefine luxury streetwear.' },
        ].map((v) => (
          <div key={v.title} className="text-center">
            <div className="w-10 h-px bg-primary mx-auto mb-5" />
            <h3 className="font-heading text-lg tracking-heading uppercase text-foreground mb-3">{v.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
          </div>
        ))}
      </div>
    </section>
  </Layout>
);

export default About;
