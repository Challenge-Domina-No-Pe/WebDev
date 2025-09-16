// src/pages/CopaPAB/Competicao1/Estatisticas.jsx
import { useEffect, useMemo, useState } from "react";

const load = (key, fb) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fb;
  } catch {
    return fb;
  }
};

function Tabs({ tab, setTab }) {
  const base = "px-4 py-2 rounded-lg text-sm font-semibold border transition-colors";
  const active = "bg-black text-white border-black";
  const off = "bg-white text-black border-black hover:bg-black/10";
  return (
    <div className="flex gap-2 mb-6 flex-wrap">
      <button className={`${base} ${tab === "gols" ? active : off}`} onClick={() => setTab("gols")}>
        Artilharia (Gols)
      </button>
      <button className={`${base} ${tab === "assist" ? active : off}`} onClick={() => setTab("assist")}>
        Assistências
      </button>
      <button className={`${base} ${tab === "ga" ? active : off}`} onClick={() => setTab("ga")}>
        Participações (G+A)
      </button>
    </div>
  );
}

function TeamBadge({ name, logo }) {
  if (logo) return <img src={logo} alt={name} className="w-8 h-8 rounded-full object-cover bg-white" />;
  const initials = (name || "T")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("");
  return (
    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold">
      {initials || "T"}
    </div>
  );
}

export default function EstatisticasCompeticao1() {
  const [teams, setTeams] = useState(() => load("c1-teams", { A: [], B: [], C: [], D: [] }));
  const [rosters, setRosters] = useState(() => load("c1-rosters", {}));
  const [logos, setLogos] = useState(() => load("c1-logos", {}));

  const [tab, setTab] = useState("gols");
  const [group, setGroup] = useState("ALL");
  const [q, setQ] = useState("");
  const [limit, setLimit] = useState(20);

  const reload = () => {
    setTeams(load("c1-teams", { A: [], B: [], C: [], D: [] }));
    setRosters(load("c1-rosters", {}));
    setLogos(load("c1-logos", {}));
  };

  const teamToGroup = useMemo(() => {
    const map = {};
    ["A", "B", "C", "D"].forEach((g) => {
      (teams[g] || []).forEach((t) => (map[t] = g));
    });
    return map;
  }, [teams]);

  const allPlayers = useMemo(() => {
    const out = [];
    Object.entries(rosters).forEach(([teamName, players]) => {
      const g = teamToGroup[teamName];
      if (!g) return;
      (players || []).forEach((p) => {
        const gols = Number(p.gols || 0);
        const assist = Number(p.assistencias || 0);
        out.push({
          id: p.id || `${teamName}-${p.nome || ""}`,
          nome: p.nome || "(Sem nome)",
          numero: p.numero || "",
          posicao: p.posicao || "",
          foto: p.foto || "",
          gols,
          assist,
          ga: gols + assist,
          team: teamName,
          group: g,
          teamLogo: logos[teamName] || "",
        });
      });
    });
    return out;
  }, [rosters, teamToGroup, logos]);

  const filtered = allPlayers.filter((pl) => {
    const okGroup = group === "ALL" || pl.group === group;
    const text = (pl.nome + " " + pl.team).toLowerCase();
    return okGroup && text.includes(q.toLowerCase().trim());
  });

  const ranked = useMemo(() => {
    const arr = [...filtered];
    if (tab === "gols") arr.sort((a, b) => b.gols - a.gols || b.assist - a.assist || a.nome.localeCompare(b.nome));
    else if (tab === "assist") arr.sort((a, b) => b.assist - a.assist || b.gols - a.gols || a.nome.localeCompare(b.nome));
    else arr.sort((a, b) => b.ga - a.ga || b.gols - a.gols || b.assist - a.assist || a.nome.localeCompare(b.nome));
    return arr;
  }, [filtered, tab]);

  const visible = ranked.slice(0, limit);

  useEffect(() => {
    const onStorage = (e) => {
      if (["c1-teams", "c1-rosters", "c1-logos"].includes(e.key)) reload();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return (
    <div className="p-6">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
        <h1 className="text-2xl font-bold text-black">Estatísticas • Competição 1</h1>
        <button onClick={reload} className="ml-auto px-3 py-2 rounded-lg bg-black text-white text-sm">
          Recarregar
        </button>
      </div>

      {/* Abas */}
      <Tabs tab={tab} setTab={setTab} />

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-3 mb-6">
        <div className="flex flex-wrap gap-2">
          {["ALL", "A", "B", "C", "D"].map((g) => (
            <button
              key={g}
              onClick={() => setGroup(g)}
              className={`px-3 py-2 rounded-lg text-sm font-semibold border transition-colors ${
                group === g ? "bg-black text-white border-black" : "bg-white text-black border-black hover:bg-black/10"
              }`}
            >
              {g === "ALL" ? "Todos" : `Grupo ${g}`}
            </button>
          ))}
        </div>
        <div className="relative sm:ml-auto w-full sm:w-auto">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar jogadora/time..."
            className="pl-10 pr-3 py-2 rounded-lg border w-full sm:w-72"
          />
          <svg
            className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-4.35-4.35M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z"
            />
          </svg>
        </div>
      </div>

      {/* ======= TABELA DESKTOP ======= */}
      <div className="hidden sm:block overflow-x-auto rounded-2xl border">
        <table className="min-w-[800px] w-full">
          <thead className="bg-black text-white text-sm">
            <tr>
              <th className="text-left px-4 py-3 w-16">#</th>
              <th className="text-left px-4 py-3">Jogadora</th>
              <th className="text-left px-4 py-3">Time</th>
              <th className="text-center px-4 py-3">G</th>
              <th className="text-center px-4 py-3">A</th>
              <th className="text-center px-4 py-3">G+A</th>
              <th className="text-center px-4 py-3">Grupo</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {visible.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                  Nenhum dado para exibir. Cadastre jogadoras e preencha gols/assistências na página de Times.
                </td>
              </tr>
            )}

            {visible.map((p, idx) => (
              <tr key={p.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 font-semibold">{idx + 1}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={p.foto || "https://via.placeholder.com/64"}
                      alt={p.nome}
                      className="w-10 h-10 rounded-lg object-cover bg-gray-100"
                      loading="lazy"
                    />
                    <div>
                      <div className="font-medium">{p.nome}</div>
                      <div className="text-xs text-gray-500">
                        {p.posicao ? `${p.posicao}` : ""} {p.numero ? `• #${p.numero}` : ""}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <TeamBadge name={p.team} logo={p.teamLogo} />
                    <span className="truncate">{p.team}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center font-semibold">{p.gols}</td>
                <td className="px-4 py-3 text-center font-semibold">{p.assist}</td>
                <td className="px-4 py-3 text-center font-semibold">{p.ga}</td>
                <td className="px-4 py-3 text-center">{p.group}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ======= CARDS MOBILE ======= */}
      <div className="sm:hidden flex flex-col gap-4">
        {visible.length === 0 && (
          <div className="p-4 text-center text-gray-500 bg-white rounded-lg border">
            Nenhum dado para exibir. Cadastre jogadoras e preencha gols/assistências na página de Times.
          </div>
        )}
        {visible.map((p, idx) => (
          <div key={p.id} className="p-4 bg-white rounded-lg border shadow-sm flex flex-col gap-3 w-full">
            <div className="flex items-center gap-3">
              <div className="font-semibold">{idx + 1}.</div>
              <img src={p.foto || "https://via.placeholder.com/64"} alt={p.nome} className="w-16 h-16 rounded-lg object-cover bg-gray-100" />
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{p.nome}</div>
                <div className="text-xs text-gray-500 truncate">
                  {p.posicao ? `${p.posicao}` : ""} {p.numero ? `• #${p.numero}` : ""}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <TeamBadge name={p.team} logo={p.teamLogo} />
              <span className="truncate">{p.team}</span>
            </div>
            <div className="grid grid-cols-3 text-center text-sm font-semibold mt-2">
              <span>G: {p.gols}</span>
              <span>A: {p.assist}</span>
              <span>G+A: {p.ga}</span>
            </div>
            <div className="text-right text-xs text-gray-500">Grupo: {p.group}</div>
          </div>
        ))}
      </div>

      {/* Paginação */}
      {ranked.length > limit && (
        <div className="flex justify-center mt-4">
          <button onClick={() => setLimit((n) => n + 20)} className="px-4 py-2 rounded-lg bg-black text-white">
            Carregar mais
          </button>
        </div>
      )}
    </div>
  );
}
