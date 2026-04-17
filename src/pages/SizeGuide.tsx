import Layout from '@/components/layout/Layout';
import SEO from '@/components/SEO';

const sizes = [
  { size: 'S', chest: '88-92', waist: '72-76', hips: '88-92', length: '68' },
  { size: 'M', chest: '96-100', waist: '80-84', hips: '96-100', length: '70' },
  { size: 'L', chest: '104-108', waist: '88-92', hips: '104-108', length: '72' },
  { size: 'XL', chest: '112-116', waist: '96-100', hips: '112-116', length: '74' },
];

const SizeGuide = () => (
  <Layout>
    <SEO
      title="Size Guide"
      description="Find your perfect fit. Detailed measurements for all Mancini Milano luxury streetwear pieces."
    />
    <section className="max-w-site mx-auto px-4 lg:px-8 py-16 lg:py-24">
      <h1 className="font-heading text-3xl lg:text-[42px] tracking-heading uppercase text-foreground mb-4 text-center">
        Size Guide
      </h1>
      <p className="text-sm text-muted-foreground text-center mb-12 max-w-md mx-auto">
        All measurements are in centimeters. If you're between sizes, we recommend sizing up.
      </p>

      {/* Size table */}
      <div className="max-w-2xl mx-auto mb-16 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {['Size', 'Chest (cm)', 'Waist (cm)', 'Hips (cm)', 'Length (cm)'].map(h => (
                <th key={h} className="py-3 px-4 text-xs uppercase tracking-button font-medium text-foreground text-left">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sizes.map((row) => (
              <tr key={row.size} className="border-b border-border">
                <td className="py-3 px-4 text-sm font-medium text-primary">{row.size}</td>
                <td className="py-3 px-4 text-sm text-muted-foreground">{row.chest}</td>
                <td className="py-3 px-4 text-sm text-muted-foreground">{row.waist}</td>
                <td className="py-3 px-4 text-sm text-muted-foreground">{row.hips}</td>
                <td className="py-3 px-4 text-sm text-muted-foreground">{row.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* How to measure */}
      <div className="max-w-2xl mx-auto">
        <h2 className="font-heading text-xl tracking-heading uppercase text-foreground mb-6">How to Measure</h2>
        <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
          <div>
            <h3 className="text-foreground font-medium mb-1">Chest</h3>
            <p>Measure around the fullest part of your chest, keeping the tape horizontal.</p>
          </div>
          <div>
            <h3 className="text-foreground font-medium mb-1">Waist</h3>
            <p>Measure around your natural waistline, the narrowest part of your torso.</p>
          </div>
          <div>
            <h3 className="text-foreground font-medium mb-1">Hips</h3>
            <p>Measure around the fullest part of your hips, approximately 20cm below your waistline.</p>
          </div>
          <div>
            <h3 className="text-foreground font-medium mb-1">Length</h3>
            <p>Measure from the highest point of the shoulder to the bottom hem of the garment.</p>
          </div>
        </div>
      </div>
    </section>
  </Layout>
);

export default SizeGuide;
