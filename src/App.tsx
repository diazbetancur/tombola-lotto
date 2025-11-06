import { useEffect, useMemo, useRef, useState } from 'react';

type Prize = { id: string; name: string; imageUrl: string };

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
        backgroundImage: 'url(/FONDO.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        zIndex: 1000,
        animation: 'fadeIn 0.5s ease-out'
      }}
    >
      {/* Logo superior derecho - logo.png */}
      <div style={{ position: 'absolute', top: 30, left: 30 }}>
        <img
          src="/loto.png"
          alt="Loto"
          style={{
            width: '500px',
            height: 'auto'
          }}
        />
      </div>

      {/* Contenido central */}
      <div style={{ textAlign: 'center', maxWidth: 800 }}>
        {/* Imagen winner.png en lugar de texto GANADOR */}
        <div style={{ marginBottom: '2rem' }}>
          <img
            src="/winner.png"
            alt="Winner"
            style={{
              maxWidth: '500px',
              width: '100%',
              height: 'auto'
            }}
          />
        </div>

        {/* Números ganadores con esferas */}
        <div style={{ display: 'flex', gap: 20, justifyContent: 'center', marginBottom: '3rem' }}>
          {digits.map((d, i) => (
            <div
              key={i}
              style={{
                position: 'relative',
                display: 'inline-block'
              }}
            >
              <img
                src="/Esfera.png"
                alt={`Esfera ${i + 1}`}
                style={{
                  width: '150px',
                  height: '150px',
                  display: 'block'
                }}
              />
              {/* Número encima de la esfera */}
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  fontSize: '4rem',
                  fontWeight: 'bold',
                  color: '#000',
                  textShadow: '0 0 4px rgba(255,255,255,0.8)'
                }}
              >
                {d}
              </div>
            </div>
          ))}
        </div>

        {/* Rectángulo con Premio.png (30%) e imagen del premio (70%) */}
        <div
          style={{
            position: 'relative',
            display: 'inline-block',
            width: '100%',
            maxWidth: '900px'
          }}
        >
          <img
            src="/rectangulo.png"
            alt="Rectángulo"
            style={{
              width: '100%',
              height: 'auto',
              display: 'block'
            }}
          />
          {/* Contenido sobre el rectángulo */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '90%',
              height: '80%',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1rem'
            }}
          >
            {/* Premio.png - 30% */}
            <div
              style={{
                width: '30%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <img
                src="/Premio.png"
                alt="Premio"
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  width: 'auto',
                  height: 'auto'
                }}
              />
            </div>
            {/* Imagen del premio ganado - 70% */}
            <div
              style={{
                width: '80%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <img
                src={prize.imageUrl}
                onError={(e) => (e.currentTarget.src = '/placeholder.png')}
                alt={prize.name}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  width: 'auto',
                  height: 'auto',
                  borderRadius: '8px'
                }}
              />
            </div>
          </div>
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

    digits.forEach((d, i) => {
      setTimeout(() => {
        setRevealed((prev) => {
          const cur = [...prev, d];
          if (cur.length === 5) {
            // Al completar todos los números, esperar 5 segundos y mostrar pantalla final
            setTimeout(() => {
              setPhase('done');
              // Después de otros 5 segundos, mostrar pantalla ganador
              setTimeout(() => setShowWinner(true), 5000);
            }, 500);
          }
          return cur;
        });
      }, 2000 + 1000 * i); // Delay inicial de 2 segundos + 1 segundo entre cada número
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
        background: '#000',
        color: '#eee',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 0,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Fondo con tombola.gif */}
      {phase !== 'editing' && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundImage: 'url(/tombola.gif)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            zIndex: 0
          }}
        />
      )}

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
              <div
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  width: '100vw',
                  height: '100vh',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#1f1f1f',
                  zIndex: 100
                }}
              >
                <img
                  src="/start.png"
                  alt="Presiona para iniciar"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    cursor: 'pointer'
                  }}
                  onClick={onStart}
                />
              </div>
            )}

            {/* Layout: Lado derecho con elementos centrados */}
            {(phase === 'running' || phase === 'done') && (
              <div
                style={{
                  position: 'fixed',
                  right: 0,
                  top: 0,
                  width: '50vw',
                  height: '100vh',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '2rem',
                  zIndex: 10,
                  padding: '2rem'
                }}
              >
                {/* Logo loto.png */}
                <img
                  src="/loto.png"
                  alt="Loto"
                  style={{
                    maxWidth: '450px',
                    width: '90%',
                    height: 'auto'
                  }}
                />

                {/* Imagen winner.png */}
                <img
                  src="/winner.png"
                  alt="Winner"
                  style={{
                    maxWidth: '300px',
                    width: '70%',
                    height: 'auto'
                  }}
                />

                {/* 5 Esferas con números */}
                <div
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexWrap: 'wrap'
                  }}
                >
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      style={{
                        position: 'relative',
                        display: 'inline-block'
                      }}
                    >
                      <img
                        src="/Esfera.png"
                        alt={`Esfera ${i + 1}`}
                        style={{
                          width: '110px',
                          height: '110px',
                          display: 'block'
                        }}
                      />
                      {/* Número encima de la esfera */}
                      {revealed[i] && (
                        <div
                          style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            fontSize: '3rem',
                            fontWeight: 'bold',
                            color: '#000',
                            textShadow: '0 0 4px rgba(255,255,255,0.8)'
                          }}
                        >
                          {revealed[i]}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Cuadrado.png - Mostrar cuando termine */}
                {(phase === 'done' || phase === 'running') && (
                  <div
                    style={{
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '1rem'
                    }}
                  >
                    <img
                      src="/Cuadrado.png"
                      alt="Cuadrado"
                      style={{
                        maxWidth: '600px',
                        width: '100%',
                        height: '180px'
                      }}
                    />
                    {/* Premio.png arriba del cuadrado */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '0%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        textAlign: 'center',
                        width: '80%'
                      }}
                    >
                      <img
                        src="/Premio.png"
                        alt="Premio"
                        style={{
                          maxWidth: '150px',
                          width: '90%',
                          height: 'auto'
                        }}
                      />
                    </div>
                    {/* Imagen del premio seleccionado en el centro del cuadrado */}
                    {selectedPrize && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          textAlign: 'center',
                          width: '70%',
                          height: '60%',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center'
                        }}
                      >
                        <img
                          src={selectedPrize.imageUrl}
                          onError={(e) => (e.currentTarget.src = '/placeholder.png')}
                          alt="Premio ganado"
                          style={{
                            width: '600px',
                            height: '300px'
                          }}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </>
        )}

        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}</style>
      </main>
    </div>
  );
}
