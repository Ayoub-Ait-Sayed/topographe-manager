import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  MapPin,
  Pencil,
  UserRound,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";

import api from "../../services/api";

const statutLabels = {
  planifiee: "Planifiée",
  en_cours: "En cours",
  terminee: "Terminée",
  annulee: "Annulée",
};

const statutClasses = {
  planifiee: "bg-blue-100 text-blue-700",
  en_cours: "bg-amber-100 text-amber-700",
  terminee: "bg-emerald-100 text-emerald-700",
  annulee: "bg-red-100 text-red-700",
};

export default function InterventionDetails() {
  const { id } = useParams();

  const [intervention, setIntervention] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadIntervention = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          `/interventions/${id}`
        );

        setIntervention(response.data.data);
      } catch (err) {
        console.error(err);

        setError(
          err.response?.data?.message ||
            "Impossible de récupérer l’intervention."
        );
      } finally {
        setLoading(false);
      }
    };

    loadIntervention();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center text-sm text-slate-500">
        Chargement...
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Link
          to="/interventions"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft size={17} />
          Retour aux interventions
        </Link>

        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      </div>
    );
  }

  if (!intervention) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/interventions"
            className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 transition hover:bg-slate-50"
          >
            <ArrowLeft size={18} />
          </Link>

          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Détails de l’intervention
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Intervention #{intervention.id}
            </p>
          </div>
        </div>

        <Link
          to={`/interventions/${intervention.id}/edit`}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          <Pencil size={17} />
          Modifier
        </Link>
      </div>

      {/* Main information */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Project */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-slate-900">
              Informations générales
            </h2>

            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                statutClasses[intervention.statut] ||
                "bg-slate-100 text-slate-700"
              }`}
            >
              {statutLabels[intervention.statut] ||
                intervention.statut}
            </span>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Projet
              </p>

              <p className="mt-1 font-semibold text-slate-900">
                {intervention.projet?.nom || "-"}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                {intervention.projet?.reference || "-"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Ville
              </p>

              <div className="mt-1 flex items-center gap-2 text-sm text-slate-700">
                <MapPin size={16} />
                {intervention.projet?.ville || "-"}
              </div>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Date
              </p>

              <div className="mt-1 flex items-center gap-2 text-sm text-slate-700">
                <CalendarDays size={16} />
                {intervention.date || "-"}
              </div>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Horaires
              </p>

              <div className="mt-1 flex items-center gap-2 text-sm text-slate-700">
                <Clock size={16} />

                {intervention.heure_debut || "--:--"} -{" "}
                {intervention.heure_fin || "--:--"}
              </div>
            </div>
          </div>
        </div>

        {/* Technicien */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Technicien
          </h2>

          <div className="mt-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
              <UserRound
                size={22}
                className="text-slate-500"
              />
            </div>

            <div>
              <p className="font-semibold text-slate-900">
                {intervention.technicien?.name || "-"}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {intervention.technicien?.email || "-"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Description
        </h2>

        <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-600">
          {intervention.description ||
            "Aucune description pour cette intervention."}
        </p>
      </div>
    </div>
  );
}