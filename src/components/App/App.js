import { useMemo, useState } from 'react';
import dataBackup from '../../data/tasks.json';
import Header from '../Header/Header.js';
import Footer from '../Footer/Footer.js';
import Filters from '../Filters/Filters.js';
import TaskList from '../TaskList/TaskList.js';
import FolderView from '../FolderView/FolderView.js';
import Modal from '../Modal/Modal.js';
import TaskForm from '../TaskForm/TaskForm.js';
import './App.css';
import {
  buildFoldersById,
  buildRelationsByTask,
  DONE_STATES,
  FOLDER_COLORS,
  FOLDER_ICONS,
  getNextId,
  getStateDistribution,
  isOlderThanOneWeek,
  normalizeBackup,
  sortTasks,
  TASK_STATES,
  toIsoDate
} from './todoUtils';

const backup = normalizeBackup(dataBackup);

function toggleSelection(list, value) {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

export default function App() {
  const [data, setData] = useState(() => backup);
  const [mode, setMode] = useState('task');
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('task');
  const [sortBy, setSortBy] = useState('date_echeance');
  const [stateFilters, setStateFilters] = useState([]);
  const [folderFilters, setFolderFilters] = useState([]);
  const [activeOpenFilter, setActiveOpenFilter] = useState(true);
  const [hideOldDone, setHideOldDone] = useState(false);

  const folderById = useMemo(() => buildFoldersById(data.dossiers), [data.dossiers]);
  const taskRelations = useMemo(() => buildRelationsByTask(data.relations), [data.relations]);

  const counts = useMemo(() => {
    const total = data.taches.length;
    const open = data.taches.filter((task) => !DONE_STATES.has(task.etat)).length;
    return { total, open };
  }, [data.taches]);

  const pieData = useMemo(() => getStateDistribution(data.taches), [data.taches]);

  const filteredTasks = useMemo(() => {
    let base = [...data.taches];

    if (activeOpenFilter) {
      base = base.filter((task) => !DONE_STATES.has(task.etat));
    }

    if (hideOldDone) {
      base = base.filter((task) => !isOlderThanOneWeek(task.date_echeance));
    }

    if (stateFilters.length > 0) {
      base = base.filter((task) => stateFilters.includes(task.etat));
    }

    if (folderFilters.length > 0) {
      base = base.filter((task) => {
        const linked = taskRelations.get(task.id) || [];
        return folderFilters.every((folderId) => linked.includes(folderId));
      });
    }

    return sortTasks(base, sortBy);
  }, [data.taches, activeOpenFilter, hideOldDone, stateFilters, folderFilters, taskRelations, sortBy]);

  function resetFromBackup() {
    setData(normalizeBackup(dataBackup));
    setMode('task');
    setSortBy('date_echeance');
    setStateFilters([]);
    setFolderFilters([]);
    setActiveOpenFilter(true);
    setHideOldDone(false);
  }

  function resetToEmpty() {
    if (window.confirm('Etes-vous sur de repartir de zero ?')) {
      setData({ taches: [], dossiers: [], relations: [] });
    }
  }

  function createTask(payload) {
    const title = payload.title.trim();
    if (title.length < 5) {
      return { ok: false, error: 'Titre tache min 5 caracteres.' };
    }
    if (!payload.date_echeance) {
      return { ok: false, error: 'Date echeance obligatoire.' };
    }
    if (!TASK_STATES.includes(payload.etat)) {
      return { ok: false, error: 'Etat invalide.' };
    }

    setData((previous) => {
      const taskId = getNextId(previous.taches, 100);
      const equipiers = payload.equipiers
        .split(',')
        .map((name) => name.trim())
        .filter(Boolean)
        .map((name) => ({ name }));

      const nextTask = {
        id: taskId,
        title,
        description: payload.description,
        date_creation: toIsoDate(),
        date_echeance: payload.date_echeance,
        etat: payload.etat,
        equipiers
      };

      const relationAdditions = payload.dossierIds
        .map((value) => Number(value))
        .filter((value) => folderById.has(value))
        .map((dossierId) => ({ tache: taskId, dossier: dossierId }));

      return {
        ...previous,
        taches: [...previous.taches, nextTask],
        relations: [...previous.relations, ...relationAdditions]
      };
    });

    return { ok: true };
  }

  function updateTask(taskId, payload) {
    const title = payload.title.trim();
    if (title.length < 5) {
      return { ok: false, error: 'Titre tache min 5 caracteres.' };
    }
    if (!payload.date_echeance) {
      return { ok: false, error: 'Date echeance obligatoire.' };
    }

    setData((previous) => ({
      ...previous,
      taches: previous.taches.map((task) =>
        task.id === taskId
          ? {
              ...task,
              title,
              description: payload.description,
              date_echeance: payload.date_echeance
            }
          : task
      )
    }));

    return { ok: true };
  }

  function deleteTask(taskId) {
    setData((previous) => ({
      ...previous,
      taches: previous.taches.filter((task) => task.id !== taskId),
      relations: previous.relations.filter((relation) => relation.tache !== taskId)
    }));
  }

  function addFolderToTask(taskId, folderId) {
    const numericFolderId = Number(folderId);
    if (!folderById.has(numericFolderId)) {
      return;
    }

    setData((previous) => {
      const exists = previous.relations.some(
        (relation) => relation.tache === taskId && relation.dossier === numericFolderId
      );
      if (exists) {
        return previous;
      }
      return {
        ...previous,
        relations: [...previous.relations, { tache: taskId, dossier: numericFolderId }]
      };
    });
  }

  function createFolder(payload) {
    const title = payload.title.trim();
    if (title.length < 3) {
      return { ok: false, error: 'Titre dossier min 3 caracteres.' };
    }
    if (!FOLDER_COLORS.includes(payload.color)) {
      return { ok: false, error: 'Couleur invalide.' };
    }
    if (payload.icon && !FOLDER_ICONS.includes(payload.icon)) {
      return { ok: false, error: 'Icone invalide.' };
    }

    setData((previous) => ({
      ...previous,
      dossiers: [
        ...previous.dossiers,
        {
          id: getNextId(previous.dossiers, 200),
          title,
          description: payload.description,
          color: payload.color,
          icon: payload.icon
        }
      ]
    }));

    return { ok: true };
  }

  function updateFolder(folderId, payload) {
    const title = payload.title.trim();
    if (title.length < 3) {
      return { ok: false, error: 'Titre dossier min 3 caracteres.' };
    }

    setData((previous) => ({
      ...previous,
      dossiers: previous.dossiers.map((folder) =>
        folder.id === folderId
          ? {
              ...folder,
              title,
              description: payload.description,
              color: payload.color,
              icon: payload.icon
            }
          : folder
      )
    }));

    return { ok: true };
  }

  function deleteFolder(folderId) {
    setData((previous) => ({
      ...previous,
      dossiers: previous.dossiers.filter((folder) => folder.id !== folderId),
      relations: previous.relations.filter((relation) => relation.dossier !== folderId)
    }));
  }

  return (
    <div className="app-shell">
      <Header
        totalCount={counts.total}
        openCount={counts.open}
        pieData={pieData}
        mode={mode}
        onSwitchMode={setMode}
        onResetBackup={resetFromBackup}
        onResetEmpty={resetToEmpty}
      />

      <main className="app-main">
        {mode === 'task' && (
          <>
            <Filters
              sortBy={sortBy}
              onChangeSort={setSortBy}
              stateFilters={stateFilters}
              onToggleState={(value) => setStateFilters((current) => toggleSelection(current, value))}
              folderFilters={folderFilters}
              onToggleFolder={(value) => setFolderFilters((current) => toggleSelection(current, value))}
              openOnly={activeOpenFilter}
              onToggleOpenOnly={() => setActiveOpenFilter((current) => !current)}
              hideOldDone={hideOldDone}
              onToggleHideOldDone={() => setHideOldDone((current) => !current)}
              folders={data.dossiers}
              states={TASK_STATES}
            />

            <TaskList
              tasks={filteredTasks}
              folders={data.dossiers}
              taskRelations={taskRelations}
              onDeleteTask={deleteTask}
              onSaveTask={updateTask}
              onAddFolderToTask={addFolderToTask}
              onToggleFolderFilter={(folderId) =>
                setFolderFilters((current) => toggleSelection(current, folderId))
              }
            />
          </>
        )}

        {mode === 'folder' && (
          <FolderView
            folders={data.dossiers}
            colors={FOLDER_COLORS}
            icons={FOLDER_ICONS}
            onCreate={createFolder}
            onUpdate={updateFolder}
            onDelete={deleteFolder}
          />
        )}
      </main>

      <Footer
        onAddTask={() => {
          setModalType('task');
          setModalOpen(true);
        }}
        onAddFolder={() => {
          setModalType('folder');
          setModalOpen(true);
        }}
      />

      <Modal
        isOpen={isModalOpen}
        title={modalType === 'task' ? 'Nouvelle tache' : 'Nouveau dossier'}
        onClose={() => setModalOpen(false)}
      >
        {modalType === 'task' ? (
          <TaskForm
            onSubmit={(payload) => {
              const result = createTask(payload);
              if (result.ok) {
                setModalOpen(false);
              }
              return result;
            }}
            states={TASK_STATES}
            folders={data.dossiers}
          />
        ) : (
          <FolderView
            compact
            folders={[]}
            colors={FOLDER_COLORS}
            icons={FOLDER_ICONS}
            onCreate={(payload) => {
              const result = createFolder(payload);
              if (result.ok) {
                setModalOpen(false);
              }
              return result;
            }}
            onUpdate={updateFolder}
            onDelete={deleteFolder}
          />
        )}
      </Modal>
    </div>
  );
}

