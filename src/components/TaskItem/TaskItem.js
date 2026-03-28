import { useMemo, useState } from 'react';
import pencilIcon from '../../assets/pencil.svg';
import trashIcon from '../../assets/trash.svg';
import './TaskItem.css';

export default function TaskItem({
  task,
  folders,
  linkedFolderIds,
  onDelete,
  onSave,
  onAddFolder,
  onClickFolderFilter
}) {
  const [isComplete, setComplete] = useState(false);
  const [isEditing, setEditing] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: task.title,
    description: task.description || '',
    date_echeance: task.date_echeance || ''
  });

  const linkedFolders = useMemo(
    () => folders.filter((folder) => linkedFolderIds.includes(folder.id)),
    [folders, linkedFolderIds]
  );

  const visibleFolders = isComplete ? linkedFolders : linkedFolders.slice(0, 2);

  function handleSave() {
    const result = onSave(form);
    if (!result.ok) {
      setError(result.error || 'Erreur');
      return;
    }
    setError('');
    setEditing(false);
  }

  return (
    <li className="task-item">
      <div className="task-item-main">
        <button
          type="button"
          className="toggle-mode"
          onClick={() => setComplete((current) => !current)}
          aria-label="Basculer mode simple/complet"
        >
          {isComplete ? '▼' : '▶'}
        </button>

        {!isEditing ? (
          <>
            <strong>{task.title}</strong>
            <span>Echeance: {task.date_echeance || '-'}</span>
            <span>
              Dossiers:{' '}
              {visibleFolders.length > 0
                ? visibleFolders.map((folder) => (
                    <button
                      key={folder.id}
                      type="button"
                      className="folder-link"
                      onClick={() => onClickFolderFilter(folder.id)}
                    >
                      {folder.title}
                    </button>
                  ))
                : '-'}
            </span>
            {isComplete && <span>Description: {task.description || '-'}</span>}
            <span>Etat: {task.etat}</span>
          </>
        ) : (
          <div className="edit-grid">
            <input
              type="text"
              value={form.title}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
            />
            <textarea
              value={form.description}
              onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
            />
            <input
              type="date"
              value={form.date_echeance}
              onChange={(event) => setForm((prev) => ({ ...prev, date_echeance: event.target.value }))}
            />
            {error && <span className="error-line">{error}</span>}
          </div>
        )}
      </div>

      <div className="task-actions" id="actionBar">
        {isComplete && (
          <select defaultValue="" onChange={(event) => onAddFolder(event.target.value)}>
            <option value="">+ Dossier</option>
            {folders.map((folder) => (
              <option key={folder.id} value={folder.id}>
                {folder.title}
              </option>
            ))}
          </select>
        )}

        {isComplete && (
          <button
            type="button"
            onClick={() => (isEditing ? handleSave() : setEditing(true))}
            aria-label={isEditing ? 'Sauver' : 'Modifier'}
          >
            {isEditing ? 'Sauver' : <img className="action-icon" src={pencilIcon} alt="Modifier" />}
          </button>
        )}

        {isEditing && (
          <button
            type="button"
            onClick={() => {
              setEditing(false);
              setError('');
              setForm({
                title: task.title,
                description: task.description || '',
                date_echeance: task.date_echeance || ''
              });
            }}
          >
            Annuler
          </button>
        )}

        <button type="button" onClick={onDelete} aria-label="Supprimer">
          <img className="action-icon" src={trashIcon} alt="Supprimer" />
        </button>
      </div>
    </li>
  );
}

