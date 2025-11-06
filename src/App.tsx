import { useEffect, useMemo, useRef, useState } from 'react';

type Prize = { id: string; name: string; imageUrl: string };

function Ball({ digit, reveal }: { digit: string; reveal?: boolean }) {
  return (
    <div
      className={`ball ${reveal ? 'reveal' : ''}`}
      style={{
        width: 90,
        height: 90,
        borderRadius: '50%',
        display: 'grid',
        placeItems: 'center',
        fontSize: '2.5rem',
        fontWeight: 800,
        color: '#000',
        border: '3px solid #333',
        background: '#fff',
        boxShadow: '0 4px 12px rgba(0,0,0,.3)',
        transform: reveal ? 'scale(1)' : 'scale(.9)',
        transition: 'transform .18s ease'
      }}
    >
      {digit}
    </div>
  );
}

function Pedestal({ currentDigit }: { currentDigit: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      {/* Balota grande sobre pedestal */}
      <div
        className="pedestal-ball"
        style={{
          width: 160,
          height: 160,
          borderRadius: '50%',
          display: 'grid',
          placeItems: 'center',
          fontSize: '5rem',
          fontWeight: 800,
          color: '#000',
          border: '4px solid #333',
          background: '#fff',
          boxShadow: '0 6px 24px rgba(0,0,0,.4)',
          animation: currentDigit ? 'popIn 0.4s ease-out' : 'none'
        }}
      >
        {currentDigit}
      </div>
      {/* Cajón/base del pedestal */}
      <div
        style={{
          width: 180,
          height: 80,
          background: 'linear-gradient(to bottom, #8b4513, #654321)',
          borderRadius: '10px',
          boxShadow: '0 6px 12px rgba(0,0,0,.5)',
          border: '3px solid #5c3317'
        }}
      />
    </div>
  );
}

function WinnerScreen({
  digits,
  prize,
  onClose
}: {
  digits: string[];
  prize: Prize;
  onClose: () => void;
}) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: '#1f1f1f',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        zIndex: 1000,
        animation: 'fadeIn 0.5s ease-out'
      }}
    >
      {/* Logo superior izquierdo */}
      <div style={{ position: 'absolute', top: 30, left: 30 }}>
        <div
          style={{
            width: 80,
            height: 80,
            background: '#444',
            borderRadius: '50%',
            display: 'grid',
            placeItems: 'center',
            fontSize: '0.8rem',
            color: '#fff'
          }}
        >
          LOGO
        </div>
      </div>

      {/* Contenido central */}
      <div style={{ textAlign: 'center', maxWidth: 600 }}>
        <h1 style={{ fontSize: '4rem', margin: '0 0 2rem 0', color: '#ffd700' }}>GANADOR</h1>

        {/* Números ganadores */}
        <div style={{ display: 'flex', gap: 20, justifyContent: 'center', marginBottom: '2rem' }}>
          {digits.map((d, i) => (
            <div
              key={i}
              style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                display: 'grid',
                placeItems: 'center',
                fontSize: '2.5rem',
                fontWeight: 800,
                color: '#000',
                background: '#fff',
                boxShadow: '0 4px 16px rgba(255,215,0,.4)',
                border: '3px solid #ffd700'
              }}
            >
              {d}
            </div>
          ))}
        </div>

        {/* Premio */}
        <div style={{ marginBottom: '1.5rem' }}>
          <img
            src={prize.imageUrl}
            onError={(e) => (e.currentTarget.src = '/placeholder.png')}
            alt={prize.name}
            style={{
              maxWidth: 400,
              width: '100%',
              borderRadius: 12,
              boxShadow: '0 8px 24px rgba(0,0,0,.3)'
            }}
          />
        </div>
        <h2 style={{ fontSize: '2rem', color: '#fff', margin: 0 }}>{prize.name}</h2>
      </div>

      {/* Logo inferior derecho */}
      <div style={{ position: 'absolute', bottom: 30, right: 30 }}>
        <div
          style={{
            width: 100,
            height: 100,
            background: '#444',
            borderRadius: '50%',
            display: 'grid',
            placeItems: 'center',
            fontSize: '0.9rem',
            color: '#fff'
          }}
        >
          LOGO
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '']);
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [prizeId, setPrizeId] = useState<string>('');
  const [phase, setPhase] = useState<'editing' | 'ready' | 'running' | 'done' | 'winner'>(
    'editing'
  );
  const [revealed, setRevealed] = useState<string[]>([]);
  const [currentDigit, setCurrentDigit] = useState<string>('');
  const [showWinner, setShowWinner] = useState(false);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const selectedPrize = useMemo(
    () => prizes.find((p) => p.id === prizeId) || null,
    [prizes, prizeId]
  );

  useEffect(() => {
    fetch('/data/prizes.json')
      .then((r) => r.json())
      .then(setPrizes)
      .catch(() => setPrizes([]));
  }, []);

  const allDigitsFilled = digits.every((d) => d !== '');
  const canOk = allDigitsFilled && !!prizeId;
  const canStart = phase === 'ready';

  function handleDigitChange(value: string, idx: number) {
    const v = value.slice(-1);
    if (!/^[0-9]$/.test(v)) return;
    const next = [...digits];
    next[idx] = v;
    setDigits(next);
    inputsRef.current[idx + 1]?.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>, idx: number) {
    if (e.key === 'Backspace' && !e.currentTarget.value) {
      inputsRef.current[idx - 1]?.focus();
    }
    if (e.key.length === 1 && !/[0-9]/.test(e.key)) e.preventDefault();
  }

  function onOk() {
    if (!canOk) return;
    setPhase('ready');
  }

  function onStart() {
    if (!canStart) return;
    setPhase('running');
    setRevealed([]);
    setCurrentDigit('');

    digits.forEach((d, i) => {
      setTimeout(() => {
        // Mostrar en pedestal
        setCurrentDigit(d);

        // Después de 1200ms, pasar a balotas reveladas
        setTimeout(() => {
          setRevealed((prev) => {
            const cur = [...prev, d];
            if (cur.length === 3) {
              // Al terminar, esperar 3 segundos y mostrar pantalla ganador
              setTimeout(() => {
                setPhase('done');
                setTimeout(() => setShowWinner(true), 3000);
              }, 500);
            }
            return cur;
          });
          setCurrentDigit('');
        }, 1200);
      }, 2800 * i);
    });
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Enter' && phase === 'editing' && canOk) onOk();
      else if ((e.key === ' ' || e.key === 'Enter') && phase === 'ready') {
        e.preventDefault();
        onStart();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase, canOk]);

  return (
    <div
      style={{
        background: '#1f1f1f',
        color: '#eee',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16
      }}
    >
      {/* Pantalla de ganador - overlay completo */}
      {showWinner && selectedPrize && (
        <WinnerScreen
          digits={revealed}
          prize={selectedPrize}
          onClose={() => setShowWinner(false)}
        />
      )}

      <main
        style={{
          width: '100%',
          maxWidth: phase === 'editing' ? 820 : '100%',
          textAlign: 'center',
          padding: phase === 'editing' ? 0 : '2rem'
        }}
      >
        <h1 style={{ marginBottom: 24, fontSize: '2.6rem' }}>Tómbola</h1>

        {/* ======= FASE: INGRESO DATOS ======= */}
        {phase === 'editing' && (
          <>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 8 }}>
              {digits.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => (inputsRef.current[i] = el)}
                  value={d}
                  onChange={(e) => handleDigitChange(e.target.value, i)}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                  maxLength={1}
                  inputMode="numeric"
                  aria-label={`Dígito ${i + 1}`}
                  style={{
                    width: '3.2rem',
                    height: '3.2rem',
                    textAlign: 'center',
                    fontSize: '1.8rem',
                    background: '#111',
                    color: '#fff',
                    border: '1px solid #444',
                    borderRadius: 8
                  }}
                />
              ))}
            </div>

            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 18 }}>
              <label style={{ alignSelf: 'center' }}>Premio:</label>
              <select
                value={prizeId}
                onChange={(e) => setPrizeId(e.target.value)}
                aria-label="Seleccionar premio"
                style={{
                  padding: '6px 10px',
                  background: '#111',
                  color: '#fff',
                  border: '1px solid #555'
                }}
              >
                <option value="" disabled>
                  -- Selecciona --
                </option>
                {prizes.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={onOk}
              disabled={!canOk}
              style={{
                marginTop: 22,
                padding: '10px 18px',
                borderRadius: 8,
                border: '1px solid #444',
                background: canOk ? '#0ea5e9' : '#555',
                color: '#fff'
              }}
            >
              OK
            </button>
          </>
        )}

        {/* ======= FASE TÓMBOLA / ANIMACIÓN ======= */}
        {phase !== 'editing' && (
          <>
            {phase === 'ready' && (
              <button
                onClick={onStart}
                style={{
                  padding: '10px 18px',
                  borderRadius: 8,
                  background: '#22c55e',
                  border: '1px solid #333',
                  color: '#0a1e0d',
                  fontWeight: 700,
                  marginBottom: 18
                }}
              >
                Iniciar (Enter / Espacio)
              </button>
            )}

            {/* Layout: Tómbola y Pedestal lado a lado en la parte superior */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start',
                gap: 80,
                marginBottom: 60,
                marginTop: 40
              }}
            >
              {/* Tómbola giratoria */}
              <div
                className={`tombola ${phase === 'running' ? 'running' : ''}`}
                style={{
                  height: 200,
                  display: 'grid',
                  placeItems: 'center'
                }}
              >
                <div
                  className="drum"
                  style={{
                    width: 180,
                    height: 180,
                    borderRadius: '50%',
                    border: '12px solid #777',
                    borderTopColor: 'transparent',
                    position: 'relative',
                    boxShadow: '0 6px 20px rgba(0,0,0,.4)'
                  }}
                />
              </div>

              {/* Pedestal con dígito actual */}
              <Pedestal currentDigit={currentDigit} />
            </div>

            {/* Logo debajo del pedestal (centrado) y balotas lado a lado */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 60,
                marginBottom: 50
              }}
            >
              {/* Balotas reveladas */}
              <div style={{ display: 'flex', gap: 20, justifyContent: 'center' }}>
                {revealed.map((d, i) => (
                  <Ball key={`r-${i}`} digit={d} reveal />
                ))}
                {Array.from({ length: Math.max(0, 5 - revealed.length) }).map((_, i) => (
                  <Ball key={`e-${i}`} digit="" />
                ))}
              </div>

              {/* Logo al lado de las balotas */}
              <div
                style={{
                  width: 120,
                  height: 120,
                  background: '#444',
                  borderRadius: '50%',
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: '1rem',
                  color: '#fff',
                  boxShadow: '0 4px 8px rgba(0,0,0,.3)'
                }}
              >
                LOGO
              </div>
            </div>

            {/* Resultado final (antes de mostrar pantalla ganador) */}
            {phase === 'done' && selectedPrize && !showWinner && (
              <div
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}
              >
                <img
                  src={selectedPrize.imageUrl}
                  onError={(e) => (e.currentTarget.src = '/placeholder.png')}
                  alt="Premio"
                  style={{ maxWidth: 520, width: '100%', borderRadius: 10 }}
                />
                <h2 style={{ margin: 0, color: '#fff' }}>{selectedPrize.name}</h2>
              </div>
            )}
          </>
        )}

        <style>{`
          .running .drum { animation: spin .9s linear infinite; }
          @keyframes spin { to { transform: rotate(360deg); } }
          @keyframes popIn {
            0% { transform: scale(0.5); opacity: 0; }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); opacity: 1; }
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}</style>
      </main>
    </div>
  );
}
