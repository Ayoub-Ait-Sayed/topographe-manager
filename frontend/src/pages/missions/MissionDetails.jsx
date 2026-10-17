import { useEffect, useState } from "react";
import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  Pencil,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import api from "../../services/api";

const statusLabels = {
  en_attente: "En attente",
  en_cours: "En cours",
  termine: "Terminée",
  annule: "Annulée",
};

export default function MissionDetails() {
  const { id } = useParams();

  const [mission, setMission] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMission = async () => {
      try {
        const response = await api.get(`/missions/${id}`);

        setMission(response.data.data);
      } catch (error) {
        console.error(error);
        alert("Impossible de récupérer la mission.");
      } finally {
        setLoading(false);
      }
    };

    loadMission();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-slate-500">
          Chargement...
        </p>
      </div>
    );
  }

  if (!mission) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
        Mission introuvable.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <Link
            to="/missions"
            className="rounded-xl border border-slate-200 bg-white p-2.5 hover:bg-slate-50"
          >
            <ArrowLeft size={20} />
          </Link>

          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {mission.titre}
            </h1>

            <p className="text-sm text-slate-500">
              Mission #{mission.id}
            </p>
          </div>
        </div>

        <Link
          to={`/missions/${mission.id}/edit`}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800"
        >
          <Pencil size={18} />
          Modifier
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-slate-100 p-3">
              <BriefcaseBusiness size={22} />
            </div>

            <div>
              <h2 className="font-bold text-slate-900">
                Informations de la mission
              </h2>

              <p className="text-sm text-slate-500">
                Détails principaux
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase text-slate-400">
                Projet
              </p>

              <p className="mt-1 font-semibold text-slate-900">
                {mission.projet?.nom || "—"}
              </p>

              <p className="text-sm text-slate-500">
                {mission.projet?.reference || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase text-slate-400">
                Statut
              </p>

              <p className="mt-1 font-semibold text-slate-900">
                {statusLabels[mission.statut] || mission.statut}
              </p>
            </div>
          </div>

          <div className="mt-8">
            <p className="text-xs font-semibold uppercase text-slate-400">
              Description
            </p>

            <p className="mt-2 whitespace-pre-line text-slate-700">
              {mission.description || "Aucune description."}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-xl bg-slate-100 p-3">
              <CalendarDays size={22} />
            </div>

            <h2 className="font-bold text-slate-900">
              Planning
            </h2>
          </div>

          <div className="space-y-5">
            <div>
              <p className="text-xs font-semibold uppercase text-slate-400">
                Date de début
              </p>

              <p className="mt-1 font-semibold text-slate-900">
                {mission.date_debut || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase text-slate-400">
                Date de fin
              </p>

              <p className="mt-1 font-semibold text-slate-900">
                {mission.date_fin || "—"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

