import { useRef, useState } from 'react';

const CAPTURE_WIDTH = 640;
const CAPTURE_HEIGHT = 480;

function App() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [streaming, setStreaming] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [measurements, setMeasurements] = useState([]);
  const [notes, setNotes] = useState('');
  const [activeTool, setActiveTool] = useState('line');
  const [pendingPoint, setPendingPoint] = useState(null);

  const handleStartCamera = async () => {
    if (streaming) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setStreaming(true);
      }
    } catch (error) {
      console.error('Impossibile accedere alla fotocamera:', error);
      alert('Impossibile avviare la fotocamera. Controlla i permessi del browser.');
    }
  };

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const context = canvasRef.current.getContext('2d');
    canvasRef.current.width = CAPTURE_WIDTH;
    canvasRef.current.height = CAPTURE_HEIGHT;
    context.drawImage(videoRef.current, 0, 0, CAPTURE_WIDTH, CAPTURE_HEIGHT);
    setCapturedImage(canvasRef.current.toDataURL('image/png'));
  };

  const handleCanvasClick = (event) => {
    if (!capturedImage) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (activeTool === 'line') {
      if (!pendingPoint) {
        setPendingPoint({ x, y });
      } else {
        const measurementName = prompt('Nome della misura (es. Larghezza, Altezza, ecc.)');
        const measurementValue = prompt('Valore della misura (es. 120 cm)');
        if (measurementName && measurementValue) {
          setMeasurements((current) => [
            ...current,
            {
              id: crypto.randomUUID(),
              type: 'line',
              start: pendingPoint,
              end: { x, y },
              label: `${measurementName}: ${measurementValue}`
            }
          ]);
        }
        setPendingPoint(null);
      }
    }
  };

  const handleClearMeasurements = () => {
    setMeasurements([]);
    setPendingPoint(null);
  };

  const handleSaveProject = () => {
    if (!capturedImage) {
      alert('Scatta prima una foto per salvare il rilievo.');
      return;
    }

    const project = {
      timestamp: new Date().toISOString(),
      image: capturedImage,
      measurements,
      notes
    };

    const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(project, null, 2))}`;
    const downloadLink = document.createElement('a');
    downloadLink.href = dataStr;
    downloadLink.download = `rilievo-${Date.now()}.json`;
    downloadLink.click();
  };

  return (
    <div className="app">
      <header className="app__header">
        <h1>APP Rilievi Serramenti</h1>
        <p>
          Scatta una foto, aggiungi le misurazioni grafiche e annota note vocali o testuali per avere
          un rilievo completo e ordinato.
        </p>
      </header>

      <main className="app__layout">
        <section className="panel panel--capture">
          <h2>1. Acquisizione foto</h2>
          <div className="camera">
            <video ref={videoRef} width={CAPTURE_WIDTH} height={CAPTURE_HEIGHT} playsInline muted />
            <canvas ref={canvasRef} className="hidden-canvas" />
            {capturedImage && <img src={capturedImage} alt="Rilievo" className="captured-image" />}
          </div>
          <div className="actions">
            <button type="button" onClick={handleStartCamera}>
              Avvia fotocamera
            </button>
            <button type="button" onClick={handleCapture} disabled={!streaming}>
              Scatta foto
            </button>
          </div>
        </section>

        <section className="panel panel--measure">
          <h2>2. Misurazioni sulla foto</h2>
          <p className="panel__hint">
            Seleziona lo strumento e clicca due volte sull&apos;immagine per tracciare una misura con la sua etichetta.
          </p>
          <div className="tools">
            <label>
              <input
                type="radio"
                name="tool"
                value="line"
                checked={activeTool === 'line'}
                onChange={() => setActiveTool('line')}
              />
              Linea di misura
            </label>
          </div>
          <div className="canvas-wrapper">
            {capturedImage ? (
              <svg
                className="measurement-canvas"
                viewBox={`0 0 ${CAPTURE_WIDTH} ${CAPTURE_HEIGHT}`}
                onClick={handleCanvasClick}
              >
                <image href={capturedImage} width={CAPTURE_WIDTH} height={CAPTURE_HEIGHT} />
                {pendingPoint && (
                  <circle cx={pendingPoint.x} cy={pendingPoint.y} r="6" className="pending-point" />
                )}
                {measurements.map((measurement) => (
                  <g key={measurement.id} className="measurement">
                    <line
                      x1={measurement.start.x}
                      y1={measurement.start.y}
                      x2={measurement.end.x}
                      y2={measurement.end.y}
                    />
                    <text
                      x={(measurement.start.x + measurement.end.x) / 2}
                      y={(measurement.start.y + measurement.end.y) / 2 - 8}
                    >
                      {measurement.label}
                    </text>
                  </g>
                ))}
              </svg>
            ) : (
              <div className="placeholder">
                Scatta una foto per iniziare ad aggiungere le misurazioni.
              </div>
            )}
          </div>
          <button type="button" className="secondary" onClick={handleClearMeasurements}>
            Svuota misurazioni
          </button>
        </section>

        <section className="panel panel--notes">
          <h2>3. Note vocali e testuali</h2>
          <p className="panel__hint">
            Puoi trascrivere manualmente le note oppure registrare un promemoria audio usando strumenti esterni
            finché non sarà disponibile il registratore integrato.
          </p>
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            rows={10}
            placeholder="Annota materiali, problemi riscontrati, esigenze del cliente..."
          />
          <button type="button" onClick={handleSaveProject}>
            Esporta rilievo (.json)
          </button>
        </section>
      </main>
    </div>
  );
}

export default App;
