import TaskItem from '../TaskItem/TaskItem.js';
import './TaskList.css';

export default function TaskList({
  tasks,
  folders,
  taskRelations,
  onDeleteTask,
  onSaveTask,
  onAddFolderToTask,
  onToggleFolderFilter
}) {
  return (
    <section>
      <h2>Liste des taches</h2>
      {tasks.length === 0 && <p>Aucune tache.</p>}

      <ul className="task-list">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            folders={folders}
            linkedFolderIds={taskRelations.get(task.id) || []}
            onDelete={() => onDeleteTask(task.id)}
            onSave={(payload) => onSaveTask(task.id, payload)}
            onAddFolder={(folderId) => onAddFolderToTask(task.id, folderId)}
            onClickFolderFilter={onToggleFolderFilter}
          />
        ))}
      </ul>
    </section>
  );
}

