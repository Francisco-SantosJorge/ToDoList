import trashIcon from './trash.svg';

export default function ListOfTask({ tasks = [], onDelete, getCategories }) {
    if (tasks.length === 0) {
        return <li>Aucune tache.</li>;
    }

    const cleanTitle = (title = '') => title.replace(/^\d+\.\s*/, '');

    return tasks.map((task) => {
        const categories = getCategories?.(task.id) || [];

        return (
            <li key={task.id}>
                <div className="task-main">
                    <strong>{cleanTitle(task.title)}</strong>
                    <span>Echeance: {task.date_echeance || '-'}</span>
                    <span>Etat: {task.etat || '-'}</span>
                    <span>Categories: {categories.length > 0 ? categories.join(', ') : '-'}</span>
                    <span>
                        Equipiers:{' '}
                        {Array.isArray(task.equipiers) && task.equipiers.length > 0
                            ? task.equipiers.map((member) => member.name).join(', ')
                            : '-'}
                    </span>
                </div>
                <div id="actionBar">
                    <button
                        type="button"
                        className="icon-button"
                        onClick={() => onDelete && onDelete(task.id)}
                        aria-label={`Supprimer ${task.title}`}
                    >
                        <img className="icon" src={trashIcon} alt="Supprimer" />
                    </button>
                </div>
            </li>
        );
    });
}
