import { useState } from 'react';
import './TaskForm.css';

export default function TaskForm({ onSubmit, states, folders }) {
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '',
    description: '',
    date_echeance: '',
    etat: states[0] || 'Nouveau',
    equipiers: '',
    dossierIds: []
  });

  function toggleFolder(id) {
    setForm((previous) => ({
      ...previous,
      dossierIds: previous.dossierIds.includes(id)
        ? previous.dossierIds.filter((value) => value !== id)
        : [...previous.dossierIds, id]
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const result = onSubmit(form);
    if (!result.ok) {
      setError(result.error || 'Erreur de validation');
      return;
    }

    setError('');
    setForm({
      title: '',
      description: '',
      date_echeance: '',
      etat: states[0] || 'Nouveau',
      equipiers: '',
      dossierIds: []
    });
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <label>
        Intitule
        <input
          type="text"
          value={form.title}
          onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
          required
        />
      </label>

      <label>
        Description
        <textarea
          value={form.description}
          onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
        />
      </label>

      <label>
        Date echeance
        <input
          type="date"
          value={form.date_echeance}
          onChange={(event) => setForm((prev) => ({ ...prev, date_echeance: event.target.value }))}
          required
        />
      </label>

      <label>
        Statut
        <select value={form.etat} onChange={(event) => setForm((prev) => ({ ...prev, etat: event.target.value }))}>
          {states.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
      </label>

      <label>
        Equipiers (virgules)
        <input
          type="text"
          value={form.equipiers}
          onChange={(event) => setForm((prev) => ({ ...prev, equipiers: event.target.value }))}
        />
      </label>

      <fieldset>
        <legend>Dossiers</legend>
        <div className="folder-picks">
          {folders.map((folder) => (
            <label key={folder.id}>
              <input
                type="checkbox"
                checked={form.dossierIds.includes(folder.id)}
                onChange={() => toggleFolder(folder.id)}
              />
              {folder.title}
            </label>
          ))}
        </div>
      </fieldset>

      {error && <p className="error-line">{error}</p>}

      <button type="submit">Creer tache</button>
    </form>
  );
}

