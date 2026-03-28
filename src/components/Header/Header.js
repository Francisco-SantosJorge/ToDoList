import PieChart from '../PieChart/PieChart.js';
import './Header.css';

export default function Header({
  totalCount,
  openCount,
  pieData,
  mode,
  onSwitchMode,
  onResetBackup,
  onResetEmpty
}) {
  return (
    <header className="app-header">
      <div className="header-top-row">
        <h1>TodoList</h1>
        <div className="header-stats">
          <span>Total: {totalCount}</span>
          <span>Non finis: {openCount}</span>
        </div>
      </div>

      <div className="header-actions">
        <button type="button" className={mode === 'task' ? 'active' : ''} onClick={() => onSwitchMode('task')}>
          Vue Taches
        </button>
        <button type="button" className={mode === 'folder' ? 'active' : ''} onClick={() => onSwitchMode('folder')}>
          Vue Dossiers
        </button>
        <button type="button" onClick={onResetBackup}>Recharger backup</button>
        <button type="button" onClick={onResetEmpty}>Reset</button>
      </div>

      <PieChart data={pieData} />
    </header>
  );
}

