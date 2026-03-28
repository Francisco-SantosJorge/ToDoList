export const TASK_STATES = ['Nouveau', 'En attente', 'En cours', 'Reussi', 'Abandonne'];
export const DONE_STATES = new Set(['Reussi', 'Abandonne']);
export const FOLDER_COLORS = ['orange', 'pink', 'bluesky', 'green', 'blue', 'purple', 'teal', 'red', 'yellow', 'gray'];
export const FOLDER_ICONS = ['', 'project', 'folder', 'star', 'rocket', 'target'];

export function normalizeBackup(source) {
  return {
    taches: Array.isArray(source?.taches)
      ? source.taches.map((task) => ({
          ...task,
          // Normalize old values to keep enum filtering consistent.
          etat: task.etat === 'Réussi' ? 'Reussi' : task.etat === 'Abandonné' ? 'Abandonne' : task.etat,
          equipiers: Array.isArray(task.equipiers) ? task.equipiers : []
        }))
      : [],
    dossiers: Array.isArray(source?.dossiers) ? source.dossiers : [],
    relations: Array.isArray(source?.relations) ? source.relations : []
  };
}

export function toIsoDate(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export function getNextId(list, fallbackStart) {
  return list.reduce((maxId, item) => Math.max(maxId, Number(item.id) || fallbackStart), fallbackStart) + 1;
}

export function buildRelationsByTask(relations) {
  const map = new Map();
  relations.forEach((relation) => {
    if (!map.has(relation.tache)) {
      map.set(relation.tache, []);
    }
    map.get(relation.tache).push(relation.dossier);
  });
  return map;
}

export function buildFoldersById(dossiers) {
  const map = new Map();
  dossiers.forEach((dossier) => map.set(dossier.id, dossier));
  return map;
}

export function getStateDistribution(tasks) {
  const initial = TASK_STATES.reduce((acc, state) => {
    acc[state] = 0;
    return acc;
  }, {});

  tasks.forEach((task) => {
    if (Object.prototype.hasOwnProperty.call(initial, task.etat)) {
      initial[task.etat] += 1;
    }
  });

  return initial;
}

export function isOlderThanOneWeek(isoDate) {
  if (!isoDate) {
    return false;
  }

  const dueDate = new Date(`${isoDate}T00:00:00`);
  const now = new Date();
  const diffDays = (now - dueDate) / (1000 * 60 * 60 * 24);
  return diffDays > 7;
}

export function sortTasks(tasks, sortBy) {
  const sorted = [...tasks];

  sorted.sort((a, b) => {
    if (sortBy === 'title') {
      return (a.title || '').localeCompare(b.title || '');
    }

    if (sortBy === 'date_creation') {
      return (a.date_creation || '').localeCompare(b.date_creation || '');
    }

    return (a.date_echeance || '').localeCompare(b.date_echeance || '');
  });

  return sorted;
}

