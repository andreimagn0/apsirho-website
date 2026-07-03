import { useEffect, useState } from 'react';
import './BrotherPhotoEditor.css';

export default function BrotherPhotoEditor({
  imageSrc,
  x,
  y,
  scale,
  onChange,
  onClose,
}) {
  const [draftX, setDraftX] = useState(x ?? 50);
  const [draftY, setDraftY] = useState(y ?? 50);
  const [draftScale, setDraftScale] = useState(scale ?? 1);

  useEffect(() => {
    setDraftX(x ?? 50);
    setDraftY(y ?? 50);
    setDraftScale(scale ?? 1);
  }, [x, y, scale]);

  if (!imageSrc) return null;

  function handleSave() {
    onChange({
      x: draftX,
      y: draftY,
      scale: draftScale,
    });

    onClose();
  }

  return (
    <div className="photo-editor">
      <div className="photo-editor__backdrop" onClick={onClose} />

      <div className="photo-editor__modal">
        <header className="photo-editor__header">
          <h2>Edit image</h2>
          <button type="button" onClick={onClose}>
            ×
          </button>
        </header>

        <div className="photo-editor__body">
          <div className="photo-editor__stage">
            <div className="photo-editor__frame">
              <img
                src={imageSrc}
                alt="Profile preview"
                style={{
                  transform: `translate(${draftX - 50}%, ${
                    draftY - 50
                  }%) scale(${draftScale})`,
                }}
              />
              <div className="photo-editor__circle" />
            </div>
          </div>

          <aside className="photo-editor__controls">
            <div className="photo-editor__tabs">
              <span className="photo-editor__tab photo-editor__tab--active">
                Crop
              </span>
              <span className="photo-editor__tab">Adjust</span>
            </div>

            <label>
              Zoom
              <input
                type="range"
                min="1"
                max="2"
                step="0.05"
                value={draftScale}
                onChange={(e) => setDraftScale(Number(e.target.value))}
              />
            </label>

            <label>
              Horizontal
              <input
                type="range"
                min="0"
                max="100"
                value={draftX}
                onChange={(e) => setDraftX(Number(e.target.value))}
              />
            </label>

            <label>
              Vertical
              <input
                type="range"
                min="0"
                max="100"
                value={draftY}
                onChange={(e) => setDraftY(Number(e.target.value))}
              />
            </label>
          </aside>
        </div>

        <footer className="photo-editor__footer">
          <button type="button" onClick={handleSave}>
            Save changes
          </button>
        </footer>
      </div>
    </div>
  );
}