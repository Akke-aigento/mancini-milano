import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import QRCode from 'qrcode';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { CheckCircle, Smartphone, ScanLine, CreditCard } from 'lucide-react';

const QRPayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [qrError, setQrError] = useState(false);

  const state = location.state as {
    orderNumber?: string;
    total?: number;
    currency?: string;
    qrData?: { payload?: string; image_url?: string; qr_image_url?: string };
    bankDetails?: { iban?: string; account_holder?: string; bic?: string; reference?: string };
    paymentType?: string;
  } | null;

  useEffect(() => {
    if (!state?.paymentType) {
      navigate('/', { replace: true });
    }
  }, [state, navigate]);

  useEffect(() => {
    console.log('QR Payment page state:', { orderNumber: state?.orderNumber, total: state?.total, currency: state?.currency, qrData: state?.qrData, bankDetails: state?.bankDetails });
  }, [state]);

  useEffect(() => {
    const payload = state?.qrData?.payload;
    if (payload && canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, payload, {
        width: 280,
        margin: 2,
        color: { dark: '#000000', light: '#ffffff' },
      }).catch(() => setQrError(true));
    } else {
      setQrError(true);
    }
  }, [state?.qrData?.payload]);

  if (!state?.paymentType) return null;

  const fallbackImageUrl = state.qrData?.image_url || state.qrData?.qr_image_url;
  const formattedTotal = Number(state.total || 0).toFixed(2);
  const currency = state.currency || 'EUR';

  const handleConfirm = () => {
    navigate('/checkout/success', {
      state: {
        orderNumber: state.orderNumber,
        total: state.total,
        currency: state.currency,
        paymentType: 'qr',
      },
    });
  };

  return (
    <Layout>
      <div className="min-h-[70vh] flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md text-center space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Scan & Betaal</h1>
            <p className="text-muted-foreground">
              Bestelling #{state.orderNumber}
            </p>
          </div>

          {/* QR Code */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-border inline-block mx-auto">
            {!qrError ? (
              <canvas ref={canvasRef} className="mx-auto" />
            ) : fallbackImageUrl ? (
              <img
                src={fallbackImageUrl}
                alt="Betaal QR code"
                className="w-64 h-64 mx-auto"
              />
            ) : (
              <div className="w-64 h-64 flex items-center justify-center text-muted-foreground text-sm">
                QR code kon niet geladen worden
              </div>
            )}
          </div>

          {/* Amount */}
          <div className="text-3xl font-bold text-foreground">
            €{formattedTotal}
          </div>

          {/* Steps */}
          <div className="text-left space-y-4 bg-muted/50 rounded-xl p-6">
            <h3 className="font-semibold text-foreground text-sm uppercase tracking-wide mb-3">
              Zo betaal je
            </h3>
            <div className="flex items-start gap-3">
              <Smartphone className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <p className="text-sm text-foreground">Open je bankapp (bijv. KBC, Belfius, ING…)</p>
            </div>
            <div className="flex items-start gap-3">
              <ScanLine className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <p className="text-sm text-foreground">Kies "QR code scannen" en richt je camera op de code</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <p className="text-sm text-foreground">Bevestig de betaling in je app</p>
            </div>
          </div>

          {/* Bank details fallback */}
          {state.bankDetails?.iban && (
            <div className="text-left bg-muted/30 rounded-xl p-6 border border-border">
              <div className="flex items-center gap-2 mb-3">
                <CreditCard className="w-4 h-4 text-muted-foreground" />
                <h3 className="font-semibold text-foreground text-sm">
                  Of maak handmatig over
                </h3>
              </div>
              <div className="space-y-1.5 text-sm">
                {state.bankDetails.account_holder && (
                  <p><span className="text-muted-foreground">Naam:</span> <span className="font-medium">{state.bankDetails.account_holder}</span></p>
                )}
                <p><span className="text-muted-foreground">IBAN:</span> <span className="font-mono font-medium">{state.bankDetails.iban}</span></p>
                {state.bankDetails.bic && (
                  <p><span className="text-muted-foreground">BIC:</span> <span className="font-mono font-medium">{state.bankDetails.bic}</span></p>
                )}
                <p><span className="text-muted-foreground">Bedrag:</span> <span className="font-medium">€{formattedTotal}</span></p>
                <p><span className="text-muted-foreground">Mededeling:</span> <span className="font-mono font-medium">{state.bankDetails?.reference || state.orderNumber}</span></p>
              </div>
            </div>
          )}

          {/* Confirm button */}
          <Button
            onClick={handleConfirm}
            className="w-full h-12 text-base font-semibold"
            size="lg"
          >
            Ik heb betaald
          </Button>

          <p className="text-xs text-muted-foreground">
            Je ontvangt een bevestiging per e-mail zodra we de betaling ontvangen.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default QRPayment;
