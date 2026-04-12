import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Copy, Check } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { formatPrice } from '@/components/ProductCard';

const Bedankt = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);

  const state = location.state as {
    orderNumber?: string;
    total?: number;
    currency?: string;
    bankDetails?: Record<string, string>;
    qrData?: { payload?: string; image_url?: string };
  } | null;

  useEffect(() => {
    if (!state?.orderNumber) {
      navigate('/', { replace: true });
    }
  }, [state, navigate]);

  // Generate QR code if payload available
  useEffect(() => {
    const generateQR = async () => {
      const payload = state?.qrData?.payload;
      if (payload && canvasRef.current) {
        try {
          const QRCode = (await import('qrcode')).default;
          await QRCode.toCanvas(canvasRef.current, payload, {
            width: 240,
            margin: 2,
            color: { dark: '#000000', light: '#ffffff' },
          });
        } catch (e) {
          console.error('QR generation error:', e);
        }
      }
    };
    generateQR();
  }, [state?.qrData?.payload]);

  if (!state?.orderNumber) return null;

  const reference = state.bankDetails?.reference || state.orderNumber;

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Layout>
      <section className="max-w-2xl mx-auto px-4 lg:px-8 py-20 lg:py-32">
        <div className="text-center mb-12">
          <CheckCircle className="h-16 w-16 text-primary mx-auto mb-6" />
          <h1 className="font-heading text-3xl lg:text-4xl tracking-heading uppercase text-foreground mb-4">
            Bedankt voor je bestelling
          </h1>
          <p className="text-sm text-muted-foreground">
            Bestelnummer: <span className="font-medium text-foreground">{state.orderNumber}</span>
          </p>
        </div>

        {/* Payment instructions */}
        {state.bankDetails && (
          <div className="border border-border p-6 lg:p-8 mb-8">
            <h2 className="text-sm uppercase tracking-button font-medium text-foreground mb-6">
              Betaalinstructies
            </h2>
            <div className="space-y-4 text-sm">
              {state.bankDetails.iban && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">IBAN</span>
                  <span className="font-mono font-medium text-foreground">{state.bankDetails.iban}</span>
                </div>
              )}
              {state.bankDetails.account_holder && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Begunstigde</span>
                  <span className="font-medium text-foreground">{state.bankDetails.account_holder}</span>
                </div>
              )}
              {state.bankDetails.bic && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">BIC</span>
                  <span className="font-mono font-medium text-foreground">{state.bankDetails.bic}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Bedrag</span>
                <span className="font-medium text-foreground">{formatPrice(state.total || 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Mededeling</span>
                <button
                  onClick={() => handleCopy(reference)}
                  className="flex items-center gap-2 font-mono font-medium text-foreground hover:text-primary transition-colors group"
                >
                  <span>{reference}</span>
                  {copied ? (
                    <Check className="h-4 w-4 text-primary" />
                  ) : (
                    <Copy className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* QR Code */}
        {(state.qrData?.payload || state.qrData?.image_url) && (
          <div className="flex justify-center mb-8">
            <div className="bg-white p-6 inline-block">
              {state.qrData?.payload ? (
                <canvas ref={canvasRef} />
              ) : state.qrData?.image_url ? (
                <img src={state.qrData.image_url} alt="Betaal QR code" className="w-60 h-60" />
              ) : null}
            </div>
          </div>
        )}

        <p className="text-sm text-muted-foreground text-center mb-10">
          Je ontvangt een bevestiging per e-mail. Zodra wij je betaling hebben ontvangen, sturen we je bestelling op.
        </p>

        <div className="text-center">
          <Link
            to="/"
            className="inline-block border border-foreground text-foreground px-8 py-3 text-xs uppercase tracking-button font-medium hover:bg-foreground hover:text-background transition-colors"
          >
            Terug naar shop
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Bedankt;
