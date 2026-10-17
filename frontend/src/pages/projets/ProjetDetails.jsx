import { useEffect, useState } from "react";
import { ArrowLeft, Edit, MapPin } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import api from "../../services/api";

export default function ProjetDetails() {
  const { id } = useParams();

  const [projet, setProjet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProjet = async () => {
      try {
        const response = await api.get(`/projets/${id}`);

        const result = response.data;

        setProjet(result?.data || result);
      } catch (err) {
        console.error(err);

        setError(
          err.response?.data?.message ||
            "Impossible de charger le projet."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProjet();
  }, [id]);

  const statusLabel = {
    en_attente: "En attente",
    en_cours: "En cours",
    termine: "Terminé",
    annule: "Annulé",
  };

  if (loading) {
    return (
      <div className="flex min-h-60 items-center justify-center">
        Chargement...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl bg-red-50 p-4 text-red-700">
        {error}
      </div>
    );
  }

  if (!projet) {
    return null;
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/projets"
            className="rounded-xl border border-slate-200 bg-white p-2.5"
          >
            <ArrowLeft size={20} />
          </Link>

          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {projet.nom}
            </h1>

            <p className="text-sm text-slate-500">
              {projet.reference || "Sans référence"}
            </p>
          </div>
        </div>

        <Link
          to={`/projets/${id}/edit`}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
        >
          <Edit size={17} />
          Modifier
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <InfoCard title="Informations générales">
          <Info label="Nom" value={projet.nom} />

          <Info
            label="Client"
            value={
              projet.client?.nom ||
              projet.client?.name ||
              "-"
            }
          />

          <Info
            label="Type de mission"
            value={projet.type_mission}
          />

          <Info
            label="Statut"
            value={
              statusLabel[projet.statut] ||
              projet.statut
            }
          />

          <Info
            label="Montant"
            value={
              projet.montant
                ? `${Number(projet.montant).toLocaleString(
                    "fr-FR"
                  )} DH`
                : "-"
            }
          />
        </InfoCard>

        <InfoCard title="Planning">
          <Info
            label="Date de début"
            value={projet.date_debut || "-"}
          />

          <Info
            label="Date de fin"
            value={projet.date_fin || "-"}
          />
        </InfoCard>

        <InfoCard title="Localisation">
          <Info
            label="Adresse"
            value={projet.adresse || "-"}
          />

          <Info
            label="Ville"
            value={projet.ville || "-"}
          />

          <Info
            label="Latitude"
            value={projet.latitude || "-"}
          />

          <Info
            label="Longitude"
            value={projet.longitude || "-"}
          />

          {projet.latitude && projet.longitude && (
            <a
              href={`https://www.google.com/maps?q=${projet.latitude},${projet.longitude}`}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:underline"
            >
              <MapPin size={16} />
              Voir sur Google Maps
            </a>
          )}
        </InfoCard>

        <InfoCard title="Description">
          <p className="whitespace-pre-wrap text-sm leading-6 text-slate-600">
            {projet.description ||
              "Aucune description."}
          </p>
        </InfoCard>
      </div>
    </div>
  );
}

function InfoCard({ title, children }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-lg font-semibold text-slate-900">
        {title}
      </h2>

      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm text-slate-700">
        {value || "-"}
      </p>
    </div>
  );
}