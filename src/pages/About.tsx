import Layout from '@/components/layout/Layout';

const About = () => (
  <Layout>
    <section className="max-w-site mx-auto px-4 lg:px-8 py-16 lg:py-24">
      <h1 className="font-heading text-3xl lg:text-[42px] tracking-heading uppercase text-foreground mb-12 text-center">
        About Us
      </h1>

      <div className="max-w-2xl mx-auto mb-20">
        <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
          <p>
            At Mancini Milano, fashion is more than clothing – it is a statement of individuality, confidence, and timeless style. Founded with the vision of blending contemporary streetwear with Italian elegance, our brand represents a lifestyle where luxury meets authenticity.
          </p>
          <p>
            Every piece is crafted with attention to detail, combining bold designs, premium materials, and a modern edge. From iconic hoodies to refined fragrances, we create collections that celebrate self-expression and empower those who wear them.
          </p>
          <p>
            Inspired by Milan's vibrant energy and global fashion culture, Mancini Milano is not just a brand – it's a community. A community of people who dare to stand out, embrace creativity, and set their own trends.
          </p>
          <p>
            Welcome to Mancini Milano. Wear it with pride.
          </p>
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
