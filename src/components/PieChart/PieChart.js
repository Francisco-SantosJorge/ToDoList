import './PieChart.css';

const COLORS = {
  Nouveau: '#8ecae6',
  'En attente': '#ffb703',
  'En cours': '#219ebc',
  Reussi: '#2a9d8f',
  Abandonne: '#e76f51'
};

export default function PieChart({ data }) {
  const entries = Object.entries(data);
  const total = entries.reduce((sum, [, value]) => sum + value, 0);

  if (total === 0) {
    return <div className="pie-empty">Aucune tache</div>;
  }

  let offset = 0;
  const gradient = entries
    .map(([state, value]) => {
      const ratio = value / total;
      const start = Math.round(offset * 360);
      offset += ratio;
      const end = Math.round(offset * 360);
      return `${COLORS[state]} ${start}deg ${end}deg`;
    })
    .join(', ');

  return (
    <div className="pie-wrapper">
      <div className="pie-chart" style={{ background: `conic-gradient(${gradient})` }} aria-label="Repartition par etat" />
      <ul className="pie-legend">
        {entries.map(([state, value]) => (
          <li key={state}>
            <span className="color-dot" style={{ backgroundColor: COLORS[state] }} />
            {state}: {value}
          </li>
        ))}
      </ul>
    </div>
  );
}

