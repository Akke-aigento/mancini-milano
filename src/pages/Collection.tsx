import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';

const Collection = () => {
  const { slug } = useParams();

  return (
    <Layout>
      <section className="max-w-site mx-auto px-4 lg:px-8 py-20 text-center">
        <h1 className="font-heading text-3xl lg:text-5xl tracking-heading uppercase text-foreground mb-4">
          {slug?.replace(/-/g, ' ')}
        </h1>
        <p className="text-muted-foreground">Collection page — coming soon</p>
      </section>
    </Layout>
  );
};

export default Collection;
