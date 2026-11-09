import { listAudit } from "@/server/cms-service";
export default async function ActivityPage() {
  const activity = await listAudit();
  return (
    <>
      <div className="cms-page-heading">
        <div>
          <p className="eyebrow">TRAÇABILITÉ</p>
          <h1>Journal d’activité</h1>
          <p className="muted">
            Les 100 dernières opérations enregistrées en base.
          </p>
        </div>
      </div>
      <div className="cms-table-wrap">
        <table className="cms-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Opération</th>
              <th>Objet</th>
              <th>Auteur</th>
            </tr>
          </thead>
          <tbody>
            {activity.map((item) => (
              <tr key={item.id}>
                <td>
                  {item.createdAt.toLocaleString("fr-MA", {
                    timeZone: "Africa/Casablanca",
                  })}
                </td>
                <td>{item.action}</td>
                <td>{item.entityType}</td>
                <td>{item.actor?.name ?? "Système"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
