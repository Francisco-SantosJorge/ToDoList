import './Footer.css';

export default function Footer({ onAddTask, onAddFolder }) {
  return (
    <footer className="app-footer">
      <button type="button" className="fab" onClick={onAddTask} aria-label="Ajouter une tache">
        +
      </button>
      <button type="button" className="small" onClick={onAddFolder}>
        + Dossier
      </button>
    </footer>
  );
}

