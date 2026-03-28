import './Filters.css';

function ToggleChip({ active, onClick, children }) {
  return (
    <button type="button" className={`chip ${active ? 'active' : ''}`} onClick={onClick}>
      {children}
    </button>
  );
}

export default function Filters({
  sortBy,
  onChangeSort,
  stateFilters,
  onToggleState,
  folderFilters,
  onToggleFolder,
  openOnly,
  onToggleOpenOnly,
  hideOldDone,
  onToggleHideOldDone,
  folders,
  states
}) {
  return (
    <section className="filters-zone" aria-label="Tri et filtres">
      <div className="row">
        <label>
          Tri
          <select value={sortBy} onChange={(event) => onChangeSort(event.target.value)}>
            <option value="date_creation">Date creation</option>
            <option value="date_echeance">Date echeance</option>
            <option value="title">Nom</option>
          </select>
        </label>

        <ToggleChip active={openOnly} onClick={onToggleOpenOnly}>
          En cours (defaut)
        </ToggleChip>
        <ToggleChip active={hideOldDone} onClick={onToggleHideOldDone}>
          Cacher echues (+7j)
        </ToggleChip>
      </div>

      <div className="row">
        <span>Etats:</span>
        {states.map((state) => (
          <ToggleChip key={state} active={stateFilters.includes(state)} onClick={() => onToggleState(state)}>
            {state}
          </ToggleChip>
        ))}
      </div>

      <div className="row">
        <span>Dossiers:</span>
        {folders.map((folder) => (
          <ToggleChip
            key={folder.id}
            active={folderFilters.includes(folder.id)}
            onClick={() => onToggleFolder(folder.id)}
          >
            {folder.title}
          </ToggleChip>
        ))}
      </div>
    </section>
  );
}

