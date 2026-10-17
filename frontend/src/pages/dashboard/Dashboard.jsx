
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  FolderKanban,
  ClipboardList,
  FileText,
  RefreshCw,
  Wallet,
  TrendingUp,
  TrendingDown,
  AlertCircle,
} from "lucide-react";

import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

/* ================= FORMATTERS ================= */

const formatNumber = (value) =>
  new Intl.NumberFormat("fr-FR").format(Number(value) || 0);

const formatMoney = (value) =>
  new Intl.NumberFormat("fr-MA", {
    style: "currency",
    currency: "MAD",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

const formatDate = (value) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getArray = (...values) =>
  values.find(Array.isArray) || [];

const getStatus = (value) =>
  String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\s-]+/g, "_");

const getStatusStyle = (status) => {
  const value = getStatus(status);

  if (
    [
      "terminee",
      "termine",
      "accepte",
      "acceptee",
      "payee",
      "paye",
      "valide",
      "validee",
    ].includes(value)
  ) {
    return "bg-emerald-50 text-emerald-700 ring-emerald-600/20";
  }

  if (
    [
      "en_cours",
      "envoye",
      "envoyee",
      "partiellement_payee",
      "planifiee",
    ].includes(value)
  ) {
    return "bg-blue-50 text-blue-700 ring-blue-600/20";
  }

  if (
    [
      "annulee",
      "annule",
      "refuse",
      "refusee",
      "impayee",
      "expire",
      "expiree",
    ].includes(value)
  ) {
    return "bg-red-50 text-red-700 ring-red-600/20";
  }

  return "bg-amber-50 text-amber-700 ring-amber-600/20";
};

const getStatusLabel = (status) => {
  const labels = {
    en_cours: "En cours",
    planifiee: "Planifiée",
    terminee: "Terminée",
    annulee: "Annulée",
    brouillon: "Brouillon",
    envoye: "Envoyé",
    envoyee: "Envoyée",
    accepte: "Accepté",
    acceptee: "Acceptée",
    refuse: "Refusé",
    refusee: "Refusée",
    payee: "Payée",
    impayee: "Impayée",
    partiellement_payee: "Partiellement payée",
    expiree: "Expirée",
    valide: "Validé",
    validee: "Validée",
  };

  const value = getStatus(status);

  return labels[value] || status || "Non défini";
};

/* ================= CHART HELPERS ================= */

const MONTH_NAMES = [
  "Jan",
  "Fév",
  "Mar",
  "Avr",
  "Mai",
  "Juin",
  "Juil",
  "Août",
  "Sep",
  "Oct",
  "Nov",
  "Déc",
];

const shortMonth = (label) => {
  const value = String(label ?? "");
  return value.length > 3 ? value.substring(0, 3) : value;
};

const getNiceMax = (values, divisions = 4) => {
  const max = Math.max(
    0,
    ...values.map((value) => Number(value) || 0)
  );

  if (max === 0) return 4;

  const roughStep = max / divisions;
  const magnitude = Math.pow(
    10,
    Math.floor(Math.log10(roughStep))
  );

  const normalized = roughStep / magnitude;

  const niceStep =
    normalized <= 1
      ? 1
      : normalized <= 2
        ? 2
        : normalized <= 5
          ? 5
          : 10;

  return niceStep * magnitude * divisions;
};

/* ================= SPARKLINE ================= */

function Sparkline({ data = [], color = "#2563eb", id }) {
  const width = 220;
  const height = 48;
  const padding = 4;

  const values = data.map((value) => Number(value) || 0);
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;

  const points = values.map((value, index) => {
    const x =
      values.length > 1
        ? padding +
          (index * (width - padding * 2)) / (values.length - 1)
        : width / 2;

    const y =
      height -
      padding -
      ((value - min) / range) * (height - padding * 2);

    return [x, y];
  });

  const line = points
    .map(([x, y], index) =>
      index === 0 ? `M ${x} ${y}` : `L ${x} ${y}`
    )
    .join(" ");

  const area = points.length
    ? `${line} L ${points[points.length - 1][0]} ${height} L ${points[0][0]} ${height} Z`
    : "";

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-12 w-full"
      preserveAspectRatio="none"
    >
      {points.length > 1 ? (
        <>
          <defs>
            <linearGradient
              id={`spark-${id}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="0%"
                stopColor={color}
                stopOpacity="0.22"
              />
              <stop
                offset="100%"
                stopColor={color}
                stopOpacity="0"
              />
            </linearGradient>
          </defs>

          <path d={area} fill={`url(#spark-${id})`} />

          <path
            d={line}
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      ) : (
        <line
          x1="0"
          y1={height / 2}
          x2={width}
          y2={height / 2}
          stroke="#e2e8f0"
          strokeWidth="2"
          strokeDasharray="4 4"
        />
      )}
    </svg>
  );
}

/* ================= LINE CHART ================= */

function LineChart({ labels = [], datasets = [] }) {
  const width = 640;
  const height = 260;
  const padLeft = 48;
  const padRight = 18;
  const padTop = 20;
  const padBottom = 30;
  const gridLines = 4;

  const validDatasets = datasets.filter(
    (dataset) => Array.isArray(dataset.data)
  );

  const values = validDatasets.flatMap((dataset) =>
    dataset.data.map((value) => Number(value) || 0)
  );

  const maxValue = getNiceMax(values, gridLines);
  const chartWidth = width - padLeft - padRight;
  const chartHeight = height - padTop - padBottom;

  const getX = (index) =>
    padLeft +
    (labels.length > 1
      ? (index * chartWidth) / (labels.length - 1)
      : chartWidth / 2);

  const getY = (value) =>
    padTop +
    chartHeight -
    ((Number(value) || 0) / maxValue) * chartHeight;

  return (
    <div className="w-full min-w-0">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full overflow-visible"
        role="img"
        aria-label="Évolution mensuelle des devis et factures"
      >
        {Array.from({ length: gridLines + 1 }).map((_, index) => {
          const y = padTop + (chartHeight / gridLines) * index;
          const value =
            maxValue - (maxValue / gridLines) * index;

          return (
            <g key={index}>
              <line
                x1={padLeft}
                y1={y}
                x2={width - padRight}
                y2={y}
                stroke="#f1f5f9"
                strokeWidth="1"
              />

              <text
                x={padLeft - 8}
                y={y + 4}
                textAnchor="end"
                fontSize="10"
                fill="#94a3b8"
              >
                {formatNumber(value)}
              </text>
            </g>
          );
        })}

        {labels.map((label, index) => (
          <text
            key={`${label}-${index}`}
            x={getX(index)}
            y={height - 7}
            textAnchor="middle"
            fontSize="10"
            fill="#94a3b8"
          >
            {shortMonth(label)}
          </text>
        ))}

        {validDatasets.map((dataset, datasetIndex) => {
          const points = labels.map((_, index) => ({
            x: getX(index),
            y: getY(dataset.data[index] ?? 0),
          }));

          const path = points
            .map((point, index) =>
              index === 0
                ? `M ${point.x} ${point.y}`
                : `L ${point.x} ${point.y}`
            )
            .join(" ");

          const area = points.length
            ? `${path} L ${points[points.length - 1].x} ${padTop + chartHeight} L ${points[0].x} ${padTop + chartHeight} Z`
            : "";

          return (
            <g key={dataset.label || datasetIndex}>
              <path
                d={area}
                fill={dataset.color}
                fillOpacity="0.07"
              />

              <path
                d={path}
                fill="none"
                stroke={dataset.color}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {points.map((point, index) => (
                <circle
                  key={index}
                  cx={point.x}
                  cy={point.y}
                  r={points.length <= 12 ? 3 : 0}
                  fill={dataset.color}
                  stroke="#ffffff"
                  strokeWidth="2"
                >
                  <title>
                    {dataset.label}: {formatNumber(
                      dataset.data[index] ?? 0
                    )}
                  </title>
                </circle>
              ))}
            </g>
          );
        })}
      </svg>

      {validDatasets.length > 0 && (
        <div className="mt-3 flex flex-wrap justify-center gap-x-5 gap-y-2">
          {validDatasets.map((dataset) => (
            <span
              key={dataset.label}
              className="flex items-center gap-2 text-xs text-slate-500"
            >
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: dataset.color }}
              />
              {dataset.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/* ================= BAR CHART ================= */

function BarChart({
  labels = [],
  data = [],
  color = "#2563eb",
}) {
  const width = 360;
  const height = 260;
  const padLeft = 40;
  const padRight = 12;
  const padTop = 20;
  const padBottom = 30;
  const gridLines = 4;

  const values = labels.map(
    (_, index) => Number(data[index]) || 0
  );

  const maxValue = getNiceMax(values, gridLines);
  const chartWidth = width - padLeft - padRight;
  const chartHeight = height - padTop - padBottom;
  const stepX = labels.length ? chartWidth / labels.length : 0;
  const barWidth = Math.min(stepX * 0.58, 34);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full"
      role="img"
      aria-label="Nouveaux clients par mois"
    >
      {Array.from({ length: gridLines + 1 }).map((_, index) => {
        const y = padTop + (chartHeight / gridLines) * index;
        const value =
          maxValue - (maxValue / gridLines) * index;

        return (
          <g key={index}>
            <line
              x1={padLeft}
              y1={y}
              x2={width - padRight}
              y2={y}
              stroke="#f1f5f9"
            />

            <text
              x={padLeft - 7}
              y={y + 4}
              textAnchor="end"
              fontSize="10"
              fill="#94a3b8"
            >
              {formatNumber(value)}
            </text>
          </g>
        );
      })}

      {labels.map((label, index) => {
        const value = values[index] || 0;
        const barHeight = (value / maxValue) * chartHeight;
        const x =
          padLeft + stepX * index + (stepX - barWidth) / 2;
        const y = padTop + chartHeight - barHeight;

        return (
          <g key={`${label}-${index}`}>
            <rect
              x={x}
              y={y}
              width={barWidth}
              height={value > 0 ? Math.max(barHeight, 2) : 0}
              rx="4"
              fill={color}
              opacity="0.9"
            >
              <title>
                {label}: {formatNumber(value)} clients
              </title>
            </rect>

            <text
              x={x + barWidth / 2}
              y={height - 7}
              textAnchor="middle"
              fontSize="10"
              fill="#94a3b8"
            >
              {shortMonth(label)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* ================= UI COMPONENTS ================= */

function TrendBadge({ trend }) {
  if (trend === undefined || trend === null || trend === "") {
    return null;
  }

  const value = Number(trend);

  if (!Number.isFinite(value)) return null;

  const isUp = value >= 0;
  const Icon = isUp ? TrendingUp : TrendingDown;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${
        isUp
          ? "bg-emerald-50 text-emerald-600"
          : "bg-red-50 text-red-600"
      }`}
    >
      <Icon size={14} strokeWidth={2.5} />
      {isUp ? "+" : ""}
      {value.toFixed(1)}%
    </span>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  spark,
  color = "blue",
}) {
  const colors = {
    blue: {
      icon: "bg-blue-50 text-blue-600",
      spark: "#2563eb",
    },
    violet: {
      icon: "bg-violet-50 text-violet-600",
      spark: "#7c3aed",
    },
    emerald: {
      icon: "bg-emerald-50 text-emerald-600",
      spark: "#059669",
    },
    amber: {
      icon: "bg-amber-50 text-amber-600",
      spark: "#d97706",
    },
  };

  const currentColor = colors[color] || colors.blue;

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <p className="text-2xl font-bold tracking-tight text-slate-900">
              {formatNumber(value)}
            </p>
            <TrendBadge trend={trend} />
          </div>
        </div>

        <div className={`rounded-xl p-2.5 ${currentColor.icon}`}>
          <Icon size={20} />
        </div>
      </div>

      <div className="mt-3">
        <Sparkline
          data={spark}
          color={currentColor.spark}
          id={color}
        />
      </div>
    </div>
  );
}

function ChartCard({ title, subtitle, action, children }) {
  return (
    <div className="h-full min-w-0 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-bold text-slate-900">{title}</h3>
          {subtitle && (
            <p className="mt-1 text-xs text-slate-400">
              {subtitle}
            </p>
          )}
        </div>

        {action && <div className="shrink-0">{action}</div>}
      </div>

      <div className="min-w-0">{children}</div>
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 px-4 py-8 text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-slate-400">
        <FileText size={22} />
      </div>
      <p className="text-sm font-medium text-slate-600">
        {message}
      </p>
    </div>
  );
}

/* ================= DASHBOARD PAGE ================= */

export default function Dashboard() {
  const { user } = useAuth();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [revenueFilter, setRevenueFilter] = useState("6");

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/dashboard");
      const payload = response.data?.data ?? response.data ?? {};
      setDashboard(payload);
    } catch (err) {
      console.error("Dashboard error:", err);
      setError(
        "Impossible de charger les données du tableau de bord."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const statistiques = dashboard?.statistiques || {};
  const finances = dashboard?.finances || {};
  const charts = dashboard?.charts || {};

  const chartLabels = getArray(charts.labels);

  /* Mini-graphiques des statistiques */

  const sparkFor = useMemo(() => {
    const pick = (values) =>
      Array.isArray(values) ? values.slice(-4) : [];

    return {
      clients: pick(charts.clients),
      projets: pick(charts.projets),
      interventions: pick(charts.interventions),
      rapports: pick(charts.rapports),
    };
  }, [charts]);

  const stats = [
    {
      title: "Clients",
      value: statistiques.clients,
      icon: Users,
      trend: statistiques.clients_evolution,
      spark: sparkFor.clients,
      color: "blue",
    },
    {
      title: "Projets",
      value: statistiques.projets,
      icon: FolderKanban,
      trend: statistiques.projets_evolution,
      spark: sparkFor.projets,
      color: "violet",
    },
    {
      title: "Interventions",
      value: statistiques.interventions,
      icon: ClipboardList,
      trend: statistiques.interventions_evolution,
      spark: sparkFor.interventions,
      color: "emerald",
    },
    {
      title: "Rapports",
      value: statistiques.rapports,
      icon: FileText,
      trend: statistiques.rapports_evolution,
      spark: sparkFor.rapports,
      color: "amber",
    },
  ];

  /* Revenue Performance : 1, 6 ou 12 mois */

  const revenueLabels = useMemo(() => {
    const numberOfMonths = Number(revenueFilter);

    return chartLabels
      .slice(-numberOfMonths)
      .map(shortMonth);
  }, [chartLabels, revenueFilter]);

  const revenueDatasets = useMemo(() => {
    const numberOfMonths = Number(revenueFilter);

    const sliceValues = (values) => {
      if (!Array.isArray(values)) return [];

      return values
        .slice(-numberOfMonths)
        .map((value) => Number(value) || 0);
    };

    return [
      {
        label: "Factures",
        color: "#2563eb",
        data: sliceValues(charts.factures),
      },
      {
        label: "Devis",
        color: "#d97706",
        data: sliceValues(charts.devis),
      },
    ].filter((dataset) => dataset.data.length > 0);
  }, [charts, revenueFilter]);

  /* User Growth : colonnes bleues */

  const growthLabels = chartLabels.map(shortMonth);

  const growthData = getArray(charts.clients).map(
    (value) => Number(value) || 0
  );

  /* Transactions récentes */

  const facturesRecentes = getArray(
    dashboard?.facturesRecentes,
    dashboard?.factures_recentes,
    dashboard?.recent_factures
  );

  const devisRecents = getArray(
    dashboard?.devisRecents,
    dashboard?.devis_recents,
    dashboard?.recent_devis
  );

  const transactions = useMemo(() => {
    const list = [];

    facturesRecentes.slice(0, 5).forEach((facture) => {
      list.push({
        id: facture.numero || `FAC-${facture.id}`,
        date: facture.date || facture.created_at,
        client:
          facture.client?.nom ||
          facture.client?.entreprise ||
          "Client",
        projet: facture.projet?.nom || "-",
        montant: facture.montant_ttc,
        statut: facture.statut,
        type: "Facture",
      });
    });

    devisRecents.slice(0, 5).forEach((devis) => {
      list.push({
        id: devis.numero || `DEV-${devis.id}`,
        date: devis.date || devis.created_at,
        client:
          devis.client?.nom ||
          devis.client?.entreprise ||
          "Client",
        projet: devis.projet?.nom || "-",
        montant: devis.montant_ttc,
        statut: devis.statut,
        type: "Devis",
      });
    });

    return list
      .sort(
        (a, b) =>
          new Date(b.date || 0) - new Date(a.date || 0)
      )
      .slice(0, 6);
  }, [facturesRecentes, devisRecents]);

  const firstName = (user?.name || user?.nom || "Admin")
    .trim()
    .split(/\s+/)[0];

  const dateDuJour = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-slate-50/70 px-4 py-6 sm:px-6 lg:px-8">
      {/* HEADER */}

      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Welcome back, {firstName}!
          </h1>

          <p className="mt-1 text-sm capitalize text-slate-500">
            {dateDuJour}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Wallet size={18} />
            </div>

            <div>
              <p className="text-[11px] text-slate-400">
                Total factures
              </p>
              <p className="text-sm font-bold text-slate-900">
                {formatMoney(
                  finances.montant_total_factures ?? 0
                )}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={loadDashboard}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin" : ""}
            />
            Actualiser
          </button>
        </div>
      </div>

      {/* ERREUR */}

      {error && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle size={20} className="shrink-0" />
          <p className="flex-1">{error}</p>

          <button
            type="button"
            onClick={loadDashboard}
            className="font-semibold underline"
          >
            Réessayer
          </button>
        </div>
      )}

      {/* LOADING */}

      {loading && !dashboard ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-44 animate-pulse rounded-2xl bg-white"
            />
          ))}
        </div>
      ) : (
        <>
          {/* STATISTIQUES */}

          <section className="mb-6">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => (
                <StatCard key={stat.title} {...stat} />
              ))}
            </div>
          </section>

          {/* GRAPHIQUES */}

          <section className="mb-6 grid grid-cols-1 gap-5 xl:grid-cols-3">
            {/* REVENUE PERFORMANCE */}

            <div className="min-w-0 xl:col-span-2">
              <ChartCard
                title="Revenue Performance"
                subtitle="Devis vs factures par mois"
                action={
                  <div className="flex flex-wrap rounded-lg border border-slate-200 p-0.5 text-xs font-medium">
                    {[
                      { v: "1", label: "1 mois" },
                      { v: "6", label: "6 mois" },
                      { v: "12", label: "12 mois" },
                    ].map((option) => (
                      <button
                        key={option.v}
                        type="button"
                        aria-pressed={
                          revenueFilter === option.v
                        }
                        onClick={() =>
                          setRevenueFilter(option.v)
                        }
                        className={`rounded-md px-3 py-1.5 transition ${
                          revenueFilter === option.v
                            ? "bg-slate-900 text-white"
                            : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                }
              >
                {revenueLabels.length > 0 &&
                revenueDatasets.some((dataset) =>
                  dataset.data.length > 0
                ) ? (
                  <LineChart
                    labels={revenueLabels}
                    datasets={revenueDatasets}
                  />
                ) : (
                  <EmptyState message="Données mensuelles non disponibles." />
                )}
              </ChartCard>
            </div>

            {/* USER GROWTH */}

            <div className="min-w-0">
              <ChartCard
                title="User Growth"
                subtitle="Nouveaux clients par mois"
                action={
                  <Link
                    to="/clients"
                    className="text-xs font-semibold text-blue-600 hover:underline"
                  >
                    Tout voir
                  </Link>
                }
              >
                {growthLabels.length > 0 &&
                growthData.length > 0 ? (
                  <BarChart
                    labels={growthLabels}
                    data={growthData}
                    color="#2563eb"
                  />
                ) : (
                  <EmptyState message="Données clients non disponibles." />
                )}
              </ChartCard>
            </div>
          </section>

          {/* TRANSACTIONS */}

          <section>
            <ChartCard
              title="Transactions récentes"
              subtitle="Derniers devis et factures"
              action={
                <div className="flex gap-4 text-xs font-semibold">
                  <Link
                    to="/devis"
                    className="text-blue-600 hover:underline"
                  >
                    Devis
                  </Link>

                  <Link
                    to="/factures"
                    className="text-blue-600 hover:underline"
                  >
                    Factures
                  </Link>
                </div>
              }
            >
              {transactions.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[720px] text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 text-xs uppercase text-slate-400">
                        <th className="py-3 pr-4 font-medium">ID</th>
                        <th className="py-3 pr-4 font-medium">Type</th>
                        <th className="py-3 pr-4 font-medium">Date</th>
                        <th className="py-3 pr-4 font-medium">Client</th>
                        <th className="py-3 pr-4 font-medium">Projet</th>
                        <th className="py-3 pr-4 font-medium">Montant</th>
                        <th className="py-3 font-medium">Statut</th>
                      </tr>
                    </thead>

                    <tbody>
                      {transactions.map((transaction) => (
                        <tr
                          key={`${transaction.type}-${transaction.id}`}
                          className="border-b border-slate-50 last:border-0"
                        >
                          <td className="whitespace-nowrap py-3.5 pr-4 font-semibold text-slate-900">
                            {transaction.id}
                          </td>

                          <td className="py-3.5 pr-4">
                            <span
                              className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
                                transaction.type === "Facture"
                                  ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20"
                                  : "bg-blue-50 text-blue-700 ring-blue-600/20"
                              }`}
                            >
                              {transaction.type}
                            </span>
                          </td>

                          <td className="whitespace-nowrap py-3.5 pr-4 text-slate-500">
                            {formatDate(transaction.date)}
                          </td>

                          <td className="py-3.5 pr-4 text-slate-700">
                            {transaction.client}
                          </td>

                          <td className="py-3.5 pr-4 text-slate-500">
                            {transaction.projet}
                          </td>

                          <td className="whitespace-nowrap py-3.5 pr-4 font-bold text-slate-900">
                            {formatMoney(transaction.montant)}
                          </td>

                          <td className="py-3.5">
                            <span
                              className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${getStatusStyle(
                                transaction.statut
                              )}`}
                            >
                              {getStatusLabel(transaction.statut)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <EmptyState message="Aucune transaction récente." />
              )}
            </ChartCard>
          </section>
        </>
      )}
    </div>
  );
}