import { useState } from 'react';
import pencilIcon from '../../assets/pencil.svg';
import trashIcon from '../../assets/trash.svg';
import './FolderView.css';

function FolderForm({ onSubmit, colors, icons, initialValue, submitText }) {
  const [error, setError] = useState('');
  const [form, setForm] = useState(
    initialValue || {
      title: '',
      description: '',
      color: colors[0],
      icon: ''
    }
  );

  function handleSubmit(event) {
    event.preventDefault();
    const result = onSubmit(form);
    if (!result.ok) {
      setError(result.error || 'Erreur');
      return;
    }
    setError('');
    setForm({ title: '', description: '', color: colors[0], icon: '' });
  }

  return (
    <form className="folder-form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={form.title}
        placeholder="Titre"
        onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
      />
      <input
        type="text"
        value={form.description}
        placeholder="Description"
        onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
      />
      <select value={form.color} onChange={(event) => setForm((prev) => ({ ...prev, color: event.target.value }))}>
        {colors.map((color) => (
          <option key={color} value={color}>
            {color}
          </option>
        ))}
      </select>
      <select value={form.icon} onChange={(event) => setForm((prev) => ({ ...prev, icon: event.target.value }))}>
        {icons.map((icon) => (
          <option key={icon || 'none'} value={icon}>
            {icon || 'Aucun'}
          </option>
        ))}
      </select>
      {error && <span className="error-line">{error}</span>}
      <button type="submit">{submitText}</button>
    </form>
  );
}

export default function FolderView({ compact, folders, colors, icons, onCreate, onUpdate, onDelete }) {
  const [editingId, setEditingId] = useState(null);
  const [editDraft, setEditDraft] = useState(null);

  if (compact) {
    return <FolderForm onSubmit={onCreate} colors={colors} icons={icons} submitText="Creer dossier" />;
  }

  return (
    <section>
      <h2>Dossiers</h2>
      <FolderForm onSubmit={onCreate} colors={colors} icons={icons} submitText="Ajouter" />

      <ul className="folder-list">
        {folders.map((folder) => (
          <li key={folder.id}>
            {editingId === folder.id ? (
              <div className="folder-edit-row">
                <input
                  type="text"
                  value={editDraft.title}
                  onChange={(event) => setEditDraft((prev) => ({ ...prev, title: event.target.value }))}
                />
                <input
                  type="text"
                  value={editDraft.description}
                  onChange={(event) => setEditDraft((prev) => ({ ...prev, description: event.target.value }))}
                />
                <select
                  value={editDraft.color}
                  onChange={(event) => setEditDraft((prev) => ({ ...prev, color: event.target.value }))}
                >
                  {colors.map((color) => (
                    <option key={color} value={color}>
                      {color}
                    </option>
                  ))}
                </select>
                <select
                  value={editDraft.icon}
                  onChange={(event) => setEditDraft((prev) => ({ ...prev, icon: event.target.value }))}
                >
                  {icons.map((icon) => (
                    <option key={icon || 'none'} value={icon}>
                      {icon || 'Aucun'}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => {
                    const result = onUpdate(folder.id, editDraft);
                    if (result.ok) {
                      setEditingId(null);
                    }
                  }}
                >
                  Sauver
                </button>
                <button type="button" onClick={() => setEditingId(null)}>
                  Annuler
                </button>
              </div>
            ) : (
              <>
                <div>
                  <strong>{folder.title}</strong>
                  <span> | {folder.color}</span>
                  <span> | {folder.icon || '-'}</span>
                </div>
                <div className="folder-actions">
                  <button
                    type="button"
                    aria-label="Modifier"
                    onClick={() => {
                      setEditingId(folder.id);
                      setEditDraft({
                        title: folder.title,
                        description: folder.description || '',
                        color: folder.color,
                        icon: folder.icon || ''
                      });
                    }}
                  >
                    <img className="action-icon" src={pencilIcon} alt="Modifier" />
                  </button>
                  <button type="button" onClick={() => onDelete(folder.id)} aria-label="Supprimer">
                    <img className="action-icon" src={trashIcon} alt="Supprimer" />
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

