import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  UserRound,
  Building2,
  Phone,
  Mail,
  MapPin,
  FolderKanban,
  ClipboardList,
  Wrench,
  FileText,
  Image as ImageIcon,
  StickyNote,
  Receipt,
  CreditCard,
  CalendarDays,
  Download,
  Eye,
  Pencil,
  Info,
} from "lucide-react";
import api from "../../services/api";

const API_URL = "http://127.0.0.1:8000";

function dateFormat(value) {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "-"
    : date.toLocaleDateString("fr-FR");
}

function moneyFormat(value) {
  return `${Number(value || 0).toLocaleString("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} DH`;
}

function statusLabel(value) {
  const labels = {
    en_attente: "En attente",
    en_cours: "En cours",
    termine: "Terminé",
    terminee: "Terminée",
    annule: "Annulé",
    annulee: "Annulée",
    planifiee: "Planifiée",
    brouillon: "Brouillon",
    "envoyé": "Envoyé",
    "accepté": "Accepté",
    "refusé": "Refusé",
    "expiré": "Expiré",
    payee: "Payée",
    impayee: "Impayée",
    partiellement_payee: "Partiellement payée",
  };

  return labels[value] || value || "Non défini";
}

function statusClass(value) {
  if (["termine", "terminee", "payee", "accepté"].includes(value)) {
    return "bg-green-50 text-green-700";
  }

  if (["en_cours"].includes(value)) {
    return "bg-blue-50 text-blue-700";
  }

  if (["annule", "annulee", "impayee", "refusé"].includes(value)) {
    return "bg-red-50 text-red-700";
  }

  return "bg-gray-100 text-gray-700";
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100">
        <Icon size={19} />
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="mt-1 text-sm text-gray-500">{label}</p>
    </div>
  );
}

function Section({ id, icon: Icon, title, count, action, children }) {
  return (
    <section id={id} className="scroll-mt-6 rounded-2xl border border-gray-200 bg-white p-5">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <Icon size={19} />
          </span>
          {title}
          {count !== undefined && (
            <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600">
              {count}
            </span>
          )}
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function Empty({ children }) {
  return (
    <div className="py-8 text-center text-sm text-gray-400">{children}</div>
  );
}

function DataTable({ columns, rows, emptyText }) {
  if (!rows.length) return <Empty>{emptyText}</Empty>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-gray-500">
            {columns.map((column) => (
              <th key={column.label} className="whitespace-nowrap px-3 py-3 font-medium">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row.id ?? index} className="border-b border-gray-100 last:border-0">
              {columns.map((column) => (
                <td key={column.label} className="whitespace-nowrap px-3 py-3 text-gray-700">
                  {column.render ? column.render(row) : row[column.key] || "-"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const projetNom = (row, projets) =>
  row.projet?.nom ||
  projets.find((p) => Number(p.id) === Number(row.projet_id))?.nom ||
  "-";

export default function ClientDetails() {
  const { id } = useParams();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadClient() {
      setLoading(true);
      setError("");

      try {
        const response = await api.get(`/clients/${id}`);
        const payload = response.data?.data ?? response.data;

        if (active) setClient(payload);
      } catch (err) {
        console.error("Erreur chargement client :", err);
        if (active) {
          setError(
            err.response?.data?.message ||
              "Impossible de charger les informations du client."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadClient();

    return () => {
      active = false;
    };
  }, [id]);

  const projets = client?.projets || [];
  const devis = client?.devis || [];
  const factures = client?.factures || [];

  const missions = useMemo(
    () => projets.flatMap((p) => p.missions || []),
    [projets]
  );

  const interventions = useMemo(
    () => projets.flatMap((p) => p.interventions || []),
    [projets]
  );

  const rapports = useMemo(
    () => projets.flatMap((p) => p.rapports || []),
    [projets]
  );

  const documents = useMemo(
    () => projets.flatMap((p) => p.documents || []),
    [projets]
  );

  const photos = useMemo(
    () => projets.flatMap((p) => p.photos || []),
    [projets]
  );

  const notes = useMemo(
    () => projets.flatMap((p) => p.notes || []),
    [projets]
  );

  const goTo = (sectionId) => {
    document
      .getElementById(sectionId)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (loading) {
    return (
      <div className="flex min-h-80 items-center justify-center text-gray-500">
        Chargement du client...
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="p-6">
        <Link to="/clients" className="mb-5 inline-flex items-center gap-2 text-gray-600">
          <ArrowLeft size={18} /> Retour aux clients
        </Link>
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          {error || "Client introuvable."}
        </div>
      </div>
    );
  }

  const initials = (client.nom || "C")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  const tabs = [
    { id: "informations", label: "Informations", icon: Info, count: null },
    { id: "section-projets", label: "Projets", icon: FolderKanban, count: projets.length },
    { id: "section-missions", label: "Missions", icon: ClipboardList, count: missions.length },
    { id: "section-interventions", label: "Interventions", icon: Wrench, count: interventions.length },
    { id: "section-rapports", label: "Rapports", icon: FileText, count: rapports.length },
    { id: "section-devis", label: "Devis", icon: Receipt, count: devis.length },
    { id: "section-factures", label: "Factures", icon: CreditCard, count: factures.length },
    { id: "section-documents", label: "Documents", icon: FileText, count: documents.length },
    { id: "section-photos", label: "Photos", icon: ImageIcon, count: photos.length },
    { id: "section-notes", label: "Notes", icon: StickyNote, count: notes.length },
  ];

  const summaryStats = [
    { icon: FolderKanban, label: "Projets", value: projets.length },
    { icon: ClipboardList, label: "Missions", value: missions.length },
    { icon: Wrench, label: "Interventions", value: interventions.length },
    { icon: FileText, label: "Rapports", value: rapports.length },
    { icon: Receipt, label: "Devis", value: devis.length },
    { icon: CreditCard, label: "Factures", value: factures.length },
  ];

  const contactCards = [
    { icon: Phone, label: "Téléphone", value: client.telephone },
    { icon: Mail, label: "Email", value: client.email },
    { icon: MapPin, label: "Ville", value: client.ville },
    { icon: MapPin, label: "Adresse", value: client.adresse },
  ];

  const photosApercu = photos.slice(0, 7);
  const photosRestantes = photos.length - photosApercu.length;

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Fil d'Ariane + Titre */}
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div>
          <p className="mb-1 text-sm text-gray-400">
            <Link to="/clients" className="hover:text-gray-600">Clients</Link>
            <span className="mx-1">›</span>
            <span className="text-gray-600">Détails du client</span>
          </p>
          <h1 className="text-2xl font-bold text-gray-900">Détails du client</h1>
        </div>

        <Link
          to="/clients"
          className="inline-flex items-center gap-2 self-start rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 md:self-auto"
        >
          <ArrowLeft size={16} /> Retour aux clients
        </Link>
      </div>

    

      {/* Onglets (navigation par ancres) */}
      <div className="sticky top-0 z-10 -mx-4 border-b border-gray-200 bg-gray-50/95 px-4 backdrop-blur md:-mx-6 md:px-6">
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map(({ id, label, icon: Icon, count }) => (
            <button
              key={id}
              onClick={() => goTo(id)}
              className="flex items-center gap-1.5 whitespace-nowrap border-b-2 border-transparent px-4 py-3 text-sm font-medium text-gray-500 transition hover:border-blue-600 hover:text-blue-600"
            >
              <Icon size={15} />
              {label}
              {count !== null && (
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                  {count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Informations + Résumé */}
      <div id="informations" className="scroll-mt-24">
        <Section
          icon={UserRound}
          title="Informations du client"
          action={
            <Link
              to={`/clients/${client.id}/edit`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              <Pencil size={14} /> Modifier
            </Link>
          }
        >
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              {[
                ["Nom complet", client.nom],
                ["Entreprise", client.entreprise],
                ["Téléphone", client.telephone],
                ["Email", client.email],
                ["Ville", client.ville],
                ["Adresse", client.adresse],
                ["Créé le", dateFormat(client.created_at)],
                ["Dernière modification", dateFormat(client.updated_at)],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4 border-b border-gray-100 pb-2 text-sm">
                  <span className="text-gray-400">{label}</span>
                  <span className="text-right font-medium text-gray-800">{value || "-"}</span>
                </div>
              ))}
            </div>

            {/* Carte résumé */}
            <div className="h-fit rounded-2xl border border-gray-200 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-900 text-base font-bold text-white">
                  {initials}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{client.nom}</p>
                  <p className="text-xs text-gray-400">{client.entreprise || "Particulier"}</p>
                </div>
              </div>

              <div className="mt-5 space-y-3 border-t border-gray-100 pt-4">
                {summaryStats.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-gray-500">
                      <Icon size={15} className="text-gray-400" /> {label}
                    </span>
                    <span className="font-semibold text-gray-900">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>
      </div>

      {/* Projets */}
      <Section
        id="section-projets"
        icon={FolderKanban}
        title="Projets du client"
        count={projets.length}
        action={
          <Link to="/projets" className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50">
            Voir tous les projets
          </Link>
        }
      >
        {!projets.length ? (
          <Empty>Aucun projet associé à ce client.</Empty>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projets.map((projet) => (
              <div key={projet.id} className="overflow-hidden rounded-2xl border border-gray-200 transition hover:shadow-md">
                {/* Image du projet */}
                {projet.image || projet.photo ? (
                  <img
                    src={`${API_URL}/storage/${projet.image || projet.photo}`}
                    alt={projet.nom}
                    className="h-40 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-40 w-full items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300">
                    <FolderKanban size={36} className="text-slate-400" />
                  </div>
                )}

                <div className="p-4">
                  <p className="text-xs text-gray-400">Réf : {projet.reference || `PRJ-${projet.id}`}</p>
                  <h3 className="mt-1 font-semibold text-gray-900">{projet.nom}</h3>

                  <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                    <MapPin size={12} /> {projet.ville || "-"}
                  </p>

                  <div className="mt-2">
                    <span className={`rounded-full px-2.5 py-1 text-xs ${statusClass(projet.statut)}`}>
                      {statusLabel(projet.statut)}
                    </span>
                  </div>

                  <p className="mt-3 flex items-center gap-1.5 text-xs text-gray-500">
                    <CalendarDays size={13} />
                    {dateFormat(projet.date_debut)} - {dateFormat(projet.date_fin)}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-3 border-t border-gray-100 pt-3 text-xs text-gray-500">
                    <span>{(projet.missions || []).length} missions</span>
                    <span>{(projet.rapports || []).length} rapports</span>
                    <span>{(projet.documents || []).length} documents</span>
                  </div>

                  <Link
                    to={`/projets/${projet.id}`}
                    className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                  >
                    Voir le projet <ArrowLeft size={14} className="rotate-180" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* Missions + Interventions */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Section
          id="section-missions"
          icon={ClipboardList}
          title="Missions"
          count={missions.length}
          action={
            <Link to="/missions" className="text-xs font-medium text-gray-500 hover:text-gray-900">
              Voir toutes
            </Link>
          }
        >
          <DataTable
            rows={missions}
            emptyText="Aucune mission trouvée."
            columns={[
              { label: "Titre", render: (row) => row.titre || row.type_mission || "-" },
              { label: "Projet", render: (row) => projetNom(row, projets) },
              { label: "Début", render: (row) => dateFormat(row.date_debut) },
              { label: "Fin", render: (row) => dateFormat(row.date_fin) },
              {
                label: "Statut",
                render: (row) => (
                  <span className={`rounded-full px-2.5 py-1 text-xs ${statusClass(row.statut)}`}>
                    {statusLabel(row.statut)}
                  </span>
                ),
              },
            ]}
          />
        </Section>

        <Section
          id="section-interventions"
          icon={Wrench}
          title="Interventions"
          count={interventions.length}
          action={
            <Link to="/interventions" className="text-xs font-medium text-gray-500 hover:text-gray-900">
              Voir toutes
            </Link>
          }
        >
          <DataTable
            rows={interventions}
            emptyText="Aucune intervention trouvée."
            columns={[
              { label: "Titre", render: (row) => row.titre || row.nom || `Intervention #${row.id}` },
              { label: "Projet", render: (row) => projetNom(row, projets) },
              { label: "Date", render: (row) => dateFormat(row.date || row.date_debut) },
              {
                label: "Statut",
                render: (row) => (
                  <span className={`rounded-full px-2.5 py-1 text-xs ${statusClass(row.statut)}`}>
                    {statusLabel(row.statut)}
                  </span>
                ),
              },
            ]}
          />
        </Section>
      </div>

      {/* Rapports + Documents */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Section
          id="section-rapports"
          icon={FileText}
          title="Rapports"
          count={rapports.length}
          action={
            <Link to="/rapports" className="text-xs font-medium text-gray-500 hover:text-gray-900">
              Voir tous
            </Link>
          }
        >
          {!rapports.length ? (
            <Empty>Aucun rapport associé aux projets de ce client.</Empty>
          ) : (
            <div className="space-y-3">
              {rapports.map((rapport) => (
                <div key={rapport.id} className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 p-3.5">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-gray-900">
                      {rapport.titre || `Rapport #${rapport.id}`}
                    </p>
                    <p className="mt-0.5 text-xs text-gray-400">
                      {dateFormat(rapport.date)} · {projetNom(rapport, projets)}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-1.5">
                    <Link
                      to={`/rapports/${rapport.id}`}
                      className="rounded-lg border border-gray-200 p-2 text-gray-500 hover:bg-gray-50"
                      title="Voir"
                    >
                      <Eye size={15} />
                    </Link>
                    <a
                      href={`${API_URL}/api/rapports/${rapport.id}/download`}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-lg border border-gray-200 p-2 text-gray-500 hover:bg-gray-50"
                      title="Télécharger"
                    >
                      <Download size={15} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Section>

        <Section
          id="section-documents"
          icon={FileText}
          title="Documents"
          count={documents.length}
          action={
            <Link to="/documents" className="text-xs font-medium text-gray-500 hover:text-gray-900">
              Voir tous
            </Link>
          }
        >
          {!documents.length ? (
            <Empty>Aucun document associé aux projets de ce client.</Empty>
          ) : (
            <div className="space-y-3">
              {documents.map((document) => (
                <div key={document.id} className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 p-3.5">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-gray-900">{document.nom}</p>
                    <p className="mt-0.5 text-xs text-gray-400">
                      {document.type || "Document"} · {projetNom(document, projets)}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-1.5">
                    <button className="rounded-lg border border-gray-200 p-2 text-gray-500 hover:bg-gray-50" title="Voir">
                      <Eye size={15} />
                    </button>
                    <a
                      href={`${API_URL}/api/documents/${document.id}/download`}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-lg border border-gray-200 p-2 text-gray-500 hover:bg-gray-50"
                      title="Télécharger"
                    >
                      <Download size={15} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Section>
      </div>

      {/* Photos + Notes */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Section
          id="section-photos"
          icon={ImageIcon}
          title="Photos"
          count={photos.length}
          action={
            <button className="text-xs font-medium text-gray-500 hover:text-gray-900">
              Voir toutes
            </button>
          }
        >
          {!photos.length ? (
            <Empty>Aucune photo associée aux projets de ce client.</Empty>
          ) : (
            <div className="grid grid-cols-3 gap-3 md:grid-cols-4">
              {photosApercu.map((photo) =>
                photo.chemin ? (
                  <img
                    key={photo.id}
                    src={`${API_URL}/storage/${photo.chemin}`}
                    alt={photo.nom || "Photo"}
                    className="h-24 w-full rounded-xl border border-gray-200 object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div key={photo.id} className="flex h-24 items-center justify-center rounded-xl border border-gray-200 bg-gray-50">
                    <ImageIcon size={20} className="text-gray-400" />
                  </div>
                )
              )}
              {photosRestantes > 0 && (
                <div className="flex h-24 flex-col items-center justify-center rounded-xl bg-gray-900 text-white">
                  <span className="text-xl font-bold">+{photosRestantes}</span>
                  <span className="text-[10px] text-gray-400">photos</span>
                </div>
              )}
            </div>
          )}
        </Section>

        <Section
          id="section-notes"
          icon={StickyNote}
          title="Notes"
          count={notes.length}
          action={
            <button className="text-xs font-medium text-gray-500 hover:text-gray-900">
              Voir toutes
            </button>
          }
        >
          {!notes.length ? (
            <Empty>Aucune note associée aux projets de ce client.</Empty>
          ) : (
            <div className="space-y-3">
              {notes.slice(0, 4).map((note) => (
                <div key={note.id} className="rounded-xl border border-gray-200 p-3.5">
                  <p className="line-clamp-2 text-sm text-gray-700">
                    {note.contenu || note.note || "-"}
                  </p>
                  <p className="mt-2 text-xs text-gray-400">{dateFormat(note.created_at)}</p>
                </div>
              ))}
              {notes.length > 4 && (
                <p className="text-center text-xs text-gray-400">
                  + {notes.length - 4} autres notes
                </p>
              )}
            </div>
          )}
        </Section>
      </div>

      {/* Devis + Factures */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Section
          id="section-devis"
          icon={Receipt}
          title="Devis"
          count={devis.length}
          action={
            <Link to="/devis" className="text-xs font-medium text-gray-500 hover:text-gray-900">
              Voir tous
            </Link>
          }
        >
          <DataTable
            rows={devis}
            emptyText="Aucun devis pour ce client."
            columns={[
              {
                label: "Numéro",
                render: (row) => (
                  <Link to={`/devis/${row.id}`} className="font-medium text-blue-600 hover:underline">
                    {row.numero}
                  </Link>
                ),
              },
              { label: "Projet", render: (row) => projetNom(row, projets) },
              { label: "Montant TTC", render: (row) => moneyFormat(row.montant_ttc) },
              {
                label: "Statut",
                render: (row) => (
                  <span className={`rounded-full px-2.5 py-1 text-xs ${statusClass(row.statut)}`}>
                    {statusLabel(row.statut)}
                  </span>
                ),
              },
            ]}
          />
        </Section>

        <Section
          id="section-factures"
          icon={CreditCard}
          title="Factures"
          count={factures.length}
          action={
            <Link to="/factures" className="text-xs font-medium text-gray-500 hover:text-gray-900">
              Voir toutes
            </Link>
          }
        >
          <DataTable
            rows={factures}
            emptyText="Aucune facture pour ce client."
            columns={[
              { label: "Numéro", key: "numero" },
              { label: "Projet", render: (row) => projetNom(row, projets) },
              { label: "Montant TTC", render: (row) => moneyFormat(row.montant_ttc) },
              {
                label: "Statut",
                render: (row) => (
                  <span className={`rounded-full px-2.5 py-1 text-xs ${statusClass(row.statut)}`}>
                    {statusLabel(row.statut)}
                  </span>
                ),
              },
            ]}
          />
        </Section>
      </div>
    </div>
  );
}