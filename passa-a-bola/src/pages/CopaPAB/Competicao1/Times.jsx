// src/pages/CopaPAB/Competicao1/Times.jsx
import { useEffect, useMemo, useRef, useState } from "react";

/* ----------------- Storage helpers ----------------- */
const FALLBACK_TEAMS = {
  A: ["Time 1", "Time 2", "Time 3", "Time 4"],
  B: ["Time 5", "Time 6", "Time 7", "Time 8"],
  C: ["Time 9", "Time 10", "Time 11", "Time 12"],
  D: ["Time 13", "Time 14", "Time 15", "Time 16"],
};
const FALLBACK_MATCHES = {
  A: [
    { id: 1, a: 0, b: 1, ga: "", gb: "" },
    { id: 2, a: 2, b: 3, ga: "", gb: "" },
    { id: 3, a: 0, b: 2, ga: "", gb: "" },
    { id: 4, a: 1, b: 3, ga: "", gb: "" },
    { id: 5, a: 0, b: 3, ga: "", gb: "" },
    { id: 6, a: 1, b: 2, ga: "", gb: "" },
  ],
  B: [
    { id: 1, a: 0, b: 1, ga: "", gb: "" },
    { id: 2, a: 2, b: 3, ga: "", gb: "" },
    { id: 3, a: 0, b: 2, ga: "", gb: "" },
    { id: 4, a: 1, b: 3, ga: "", gb: "" },
    { id: 5, a: 0, b: 3, ga: "", gb: "" },
    { id: 6, a: 1, b: 2, ga: "", gb: "" },
  ],
  C: [
    { id: 1, a: 0, b: 1, ga: "", gb: "" },
    { id: 2, a: 2, b: 3, ga: "", gb: "" },
    { id: 3, a: 0, b: 2, ga: "", gb: "" },
    { id: 4, a: 1, b: 3, ga: "", gb: "" },
    { id: 5, a: 0, b: 3, ga: "", gb: "" },
    { id: 6, a: 1, b: 2, ga: "", gb: "" },
  ],
  D: [
    { id: 1, a: 0, b: 1, ga: "", gb: "" },
    { id: 2, a: 2, b: 3, ga: "", gb: "" },
    { id: 3, a: 0, b: 2, ga: "", gb: "" },
    { id: 4, a: 1, b: 3, ga: "", gb: "" },
    { id: 5, a: 0, b: 3, ga: "", gb: "" },
    { id: 6, a: 1, b: 2, ga: "", gb: "" },
  ],
};
const FALLBACK_ROSTERS = {}; // { [teamName]: Player[] }
const FALLBACK_LOGOS = {};   // { [teamName]: logoUrl }

const load = (key, fb) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fb;
  } catch {
    return fb;
  }
};
const save = (key, val) => {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {}
};

/* ----------------- Stats a partir de partidas ----------------- */
function computeTeamStats(groupTeams, groupMatches, teamIdx) {
  const name = groupTeams[teamIdx];
  let pts = 0, v = 0, e = 0, d = 0, gp = 0, gc = 0;
  const games = [];

  for (const m of groupMatches) {
    const isA = m.a === teamIdx;
    const isB = m.b === teamIdx;
    if (!isA && !isB) continue;

    const ga = m.ga === "" ? null : Number(m.ga);
    const gb = m.gb === "" ? null : Number(m.gb);
    const finished = ga !== null && gb !== null;

    const selfGoals = isA ? ga : gb;
    const oppGoals  = isA ? gb : ga;
    const opponent  = isA ? groupTeams[m.b] : groupTeams[m.a];

    games.push({ id: m.id, opponent, self: selfGoals, opp: oppGoals, finished });

    if (!finished) continue;
    gp += selfGoals; gc += oppGoals;
    if (selfGoals > oppGoals) { v++; pts += 3; }
    else if (selfGoals < oppGoals) { d++; }
    else { e++; pts++; }
  }
  const sg = gp - gc;
  return { name, pts, v, e, d, gp, gc, sg, games };
}

/* ----------------- UI simples ----------------- */
function TeamBadge({ name, logo }) {
  if (logo) {
    return <img src={logo} alt={name} className="w-10 h-10 rounded-full object-cover bg-white" />;
  }
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("");
  return (
    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">
      {initials || "T"}
    </div>
  );
}

/* --- Modal compacto com scroll interno (85vh) --- */
function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-x-0 top-10 mx-auto max-w-5xl w-[95vw] bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="max-h-[85vh] flex flex-col">
          <div className="flex items-center justify-end p-2 border-b">
            <button
              onClick={onClose}
              className="px-3 py-1 rounded-md text-sm bg-gray-100 hover:bg-gray-200"
              aria-label="Fechar"
            >
              Fechar
            </button>
          </div>
          <div className="p-4 md:p-6 overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block text-sm">
      <span className="text-gray-700">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

/* ------- util: ler arquivo como dataURL ------- */
function readFileAsDataURL(file, cb) {
  const fr = new FileReader();
  fr.onload = () => cb(fr.result);
  fr.readAsDataURL(file);
}

/* ------- carrossel horizontal (drag + setas + snap) ------- */
function HScroller({ children, className = "" }) {
  const ref = useRef(null);

  const scroll = (dx) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dx, behavior: "smooth" });
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let isDown = false;
    let startX = 0;
    let startScroll = 0;

    const onDown = (e) => {
      isDown = true;
      startX = (e.touches ? e.touches[0].pageX : e.pageX);
      startScroll = el.scrollLeft;
      el.classList.add("cursor-grabbing");
    };
    const onMove = (e) => {
      if (!isDown) return;
      const x = (e.touches ? e.touches[0].pageX : e.pageX);
      const dx = x - startX;
      el.scrollLeft = startScroll - dx;
    };
    const onUp = () => {
      isDown = false;
      el.classList.remove("cursor-grabbing");
    };

    el.addEventListener("mousedown", onDown);
    el.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);

    el.addEventListener("touchstart", onDown, { passive: true });
    el.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("touchend", onUp);

    return () => {
      el.removeEventListener("mousedown", onDown);
      el.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      el.removeEventListener("touchstart", onDown);
      el.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };
  }, []);

  return (
    <div className={"relative " + className}>
      <button
        onClick={() => scroll(-380)}
        className="hidden md:flex absolute left-0 -translate-x-1 top-1/2 -translate-y-1/2 z-20 items-center justify-center w-9 h-9 rounded-full bg-black/60 text-white hover:bg-black"
        aria-label="Anterior"
      >
        ◀
      </button>
      <button
        onClick={() => scroll(380)}
        className="hidden md:flex absolute right-0 translate-x-1 top-1/2 -translate-y-1/2 z-20 items-center justify-center w-9 h-9 rounded-full bg-black/60 text-white hover:bg-black"
        aria-label="Próximo"
      >
        ▶
      </button>

      <div
        ref={ref}
        className="overflow-x-auto scroll-smooth snap-x snap-mandatory flex gap-4 pr-2 cursor-grab"
        style={{ scrollbarWidth: "auto" }}
      >
        {children}
      </div>
    </div>
  );
}

/* ----------------- Página ----------------- */
export default function TimesCompeticao1() {
  const [teams, setTeams]       = useState(() => load("c1-teams", FALLBACK_TEAMS));
  const [matches, setMatches]   = useState(() => load("c1-matches", FALLBACK_MATCHES));
  const [rosters, setRosters]   = useState(() => load("c1-rosters", FALLBACK_ROSTERS));
  const [logos, setLogos]       = useState(() => load("c1-logos",   FALLBACK_LOGOS));
  const [filter, setFilter]     = useState("ALL");
  const [q, setQ]               = useState("");
  const [openTeam, setOpenTeam] = useState(null); // {group, idx}
  const [error, setError]       = useState("");

  // lista plana
  const all = useMemo(() => {
    const out = [];
    ["A", "B", "C", "D"].forEach((g) => {
      (teams[g] || []).forEach((name, idx) => out.push({ group: g, idx, name, logo: logos[name] || "" }));
    });
    return out;
  }, [teams, logos]);

  const filtered = all.filter((t) => {
    const okGroup = filter === "ALL" || t.group === filter;
    const okText = (t.name || "").toLowerCase().includes(q.toLowerCase().trim());
    return okGroup && okText;
  });

  // abrir modal
  const openTeamModal = (t) => {
    setOpenTeam({ group: t.group, idx: t.idx });
  };

  // stats do selecionado
  const sel = openTeam
    ? {
        name: teams[openTeam.group][openTeam.idx],
        logo: logos[teams[openTeam.group][openTeam.idx]] || "",
        stats: computeTeamStats(teams[openTeam.group], matches[openTeam.group], openTeam.idx),
        roster: rosters[teams[openTeam.group][openTeam.idx]] || [],
      }
    : null;

  /* ---------- salvar LS quando mudar ---------- */
  useEffect(() => save("c1-teams", teams), [teams]);
  useEffect(() => save("c1-matches", matches), [matches]);
  useEffect(() => save("c1-rosters", rosters), [rosters]);
  useEffect(() => save("c1-logos", logos), [logos]);

  /* ---------- Cadastro de time ---------- */
  const [form, setForm] = useState({
    name: "",
    logo: "",
    group: "A",
  });

  const replaceIntoGroup = () => {
    setError("");
    const g = form.group;
    const names = [...teams[g]];
    // 1) placeholder "Time X" ou "—"
    let idx = names.findIndex((n) => /^time\s*\d+$/i.test(n) || n === "—");
    // 2) se nenhum placeholder e grupo já começou, bloqueia
    const groupMatches = matches[g];
    const groupStarted = groupMatches.some((m) => m.ga !== "" || m.gb !== "");
    if (idx === -1) {
      if (groupStarted) {
        setError("Este grupo já começou. Não é possível cadastrar automaticamente.");
        return;
      }
      idx = 0; // ainda não começou: substitui o primeiro
    }

    const newNames = [...teams[g]];
    newNames[idx] = form.name;

    const newTeams = { ...teams, [g]: newNames };
    const newLogos = { ...logos, [form.name]: form.logo };

    setTeams(newTeams);
    setLogos(newLogos);
    setRosters((prev) => ({ ...prev, [form.name]: prev[form.name] || [] }));

    setForm({ name: "", logo: "", group: form.group });
  };

  /* ---------- Remoção de time ---------- */
  const [removeForm, setRemoveForm] = useState({
    group: "A",
    teamName: "",
    alsoDelete: true
  });

  useEffect(() => {
    const names = teams[removeForm.group] || [];
    const firstValid = names.find((n) => n && n !== "—") || "";
    setRemoveForm((f) => ({ ...f, teamName: firstValid }));
  }, [removeForm.group, teams]);

  const removeTeam = () => {
    const g = removeForm.group;
    const name = removeForm.teamName;
    if (!name) return;

    const idx = (teams[g] || []).findIndex((n) => n === name);
    if (idx === -1) {
      setError("Não foi possível localizar o time selecionado.");
      return;
    }

    const newGroupArr = [...teams[g]];
    newGroupArr[idx] = "—";
    const newTeams = { ...teams, [g]: newGroupArr };

    let newRosters = rosters;
    let newLogos = logos;
    if (removeForm.alsoDelete) {
      const { [name]: _, ...restR } = newRosters;
      newRosters = restR;
      const { [name]: __, ...restL } = newLogos;
      newLogos = restL;
    }

    setTeams(newTeams);
    setRosters(newRosters);
    setLogos(newLogos);

    if (sel && sel.name === name) setOpenTeam(null);
  };

  /* ---------- Renomear time ---------- */
  const [renameForm, setRenameForm] = useState({
    group: "A",
    teamName: "",
    newName: "",
    moveLogo: true,
    moveRoster: true,
  });

  useEffect(() => {
    const names = teams[renameForm.group] || [];
    const firstValid = names.find((n) => n && n !== "—") || "";
    setRenameForm((f) => ({ ...f, teamName: firstValid }));
  }, [renameForm.group, teams]);

  const renameTeam = () => {
    const g = renameForm.group;
    const oldName = renameForm.teamName;
    const newName = renameForm.newName.trim();
    if (!oldName || !newName) {
      setError("Informe o time atual e o novo nome.");
      return;
    }
    if (newName === "—") {
      setError("Nome inválido.");
      return;
    }
    if ((teams[g] || []).some((n) => n === newName)) {
      setError("Já existe um time com esse nome neste grupo.");
      return;
    }

    const idx = teams[g].findIndex((n) => n === oldName);
    if (idx === -1) {
      setError("Time não encontrado no grupo selecionado.");
      return;
    }
    const newGroupArr = [...teams[g]];
    newGroupArr[idx] = newName;
    const newTeams = { ...teams, [g]: newGroupArr };

    let newRosters = { ...rosters };
    let newLogos = { ...logos };

    if (renameForm.moveRoster && rosters[oldName]) {
      newRosters[newName] = rosters[oldName];
      delete newRosters[oldName];
    }
    if (renameForm.moveLogo && logos[oldName] !== undefined) {
      newLogos[newName] = logos[oldName];
      delete newLogos[oldName];
    }

    setTeams(newTeams);
    setRosters(newRosters);
    setLogos(newLogos);

    if (openTeam && openTeam.group === g && teams[g][openTeam.idx] === oldName) {
      // continua no mesmo índice
    }

    setRenameForm((f) => ({ ...f, newName: "" }));
    setError("");
  };

  /* ---------- Trocar vagas (swap) ---------- */
  const [swapForm, setSwapForm] = useState({
    group: "A",
    i1: 0,
    i2: 1,
  });

  const swapPositions = () => {
    const g = swapForm.group;
    const arr = [...(teams[g] || [])];
    const n = arr.length;
    const { i1, i2 } = swapForm;

    if (i1 === i2) {
      setError("Selecione índices diferentes para trocar.");
      return;
    }
    if (i1 < 0 || i2 < 0 || i1 >= n || i2 >= n) {
      setError("Índices fora do intervalo.");
      return;
    }

    [arr[i1], arr[i2]] = [arr[i2], arr[i1]];
    setTeams((t) => ({ ...t, [g]: arr }));
    setError("");
  };

  /* ---------- Elenco (CRUD) ---------- */
  const addPlayer = () => {
    if (!sel) return;
    const key = sel.name;
    const p = {
      id: crypto.randomUUID(),
      nome: "",
      numero: "",
      posicao: "",
      foto: "",
      gols: 0,
      assistencias: 0,
      bio: "",
    };
    setRosters((r) => ({ ...r, [key]: [...(r[key] || []), p] }));
  };
  const updatePlayer = (pid, field, value) => {
    if (!sel) return;
    const key = sel.name;
    setRosters((r) => ({
      ...r,
      [key]: (r[key] || []).map((pl) =>
        pl.id === pid
          ? { ...pl, [field]: field === "gols" || field === "assistencias" ? Number(value || 0) : value }
          : pl
      ),
    }));
  };
  const removePlayer = (pid) => {
    if (!sel) return;
    const key = sel.name;
    setRosters((r) => ({
      ...r,
      [key]: (r[key] || []).filter((pl) => pl.id !== pid),
    }));
  };
  const uploadPlayerPhoto = (pid, file) => {
    if (!file || !sel) return;
    readFileAsDataURL(file, (dataUrl) => updatePlayer(pid, "foto", dataUrl));
  };

  // atalhos posição
  const POS_SHORTCUTS = ["GOL", "ZAG", "LAT", "VOL", "MEI", "PON", "ATA"];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-black mb-4">Times • Competição 1</h1>

      {/* Cadastro de time */}
      <div className="mb-6 rounded-2xl border bg-gray-50 p-4">
        <h2 className="font-semibold mb-3">Cadastrar novo time</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <Field label="Nome do time">
            <input
              className="w-full rounded-lg border px-3 py-2"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Ex.: Panteras FC"
            />
          </Field>
          <Field label="URL do logo (opcional)">
            <input
              className="w-full rounded-lg border px-3 py-2"
              value={form.logo}
              onChange={(e) => setForm((f) => ({ ...f, logo: e.target.value }))}
              placeholder="https://…"
            />
          </Field>
          <Field label="Grupo">
            <select
              className="w-full rounded-lg border px-3 py-2"
              value={form.group}
              onChange={(e) => setForm((f) => ({ ...f, group: e.target.value }))}
            >
              {["A", "B", "C", "D"].map((g) => (
                <option key={g} value={g}>
                  Grupo {g}
                </option>
              ))}
            </select>
          </Field>
          <div className="flex items-end">
            <button
              onClick={replaceIntoGroup}
              disabled={!form.name.trim()}
              className="w-full px-4 py-2 rounded-lg bg-black text-white disabled:opacity-50"
            >
              Cadastrar e ocupar vaga
            </button>
          </div>
        </div>
        {error && <p className="text-red-600 mt-2 text-sm">{error}</p>}
      </div>

      {/* Gerenciar / Remover / Renomear / Swap */}
      <div className="mb-6 rounded-2xl border bg-gray-50 p-4">
        <h2 className="font-semibold mb-4">Gerenciar times</h2>

        {/* linha 1: remover */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
          <Field label="Grupo (remover)">
            <select
              className="w-full rounded-lg border px-3 py-2"
              value={removeForm.group}
              onChange={(e) => setRemoveForm((f) => ({ ...f, group: e.target.value }))}
            >
              {["A", "B", "C", "D"].map((g) => (
                <option key={g} value={g}>Grupo {g}</option>
              ))}
            </select>
          </Field>

          <Field label="Time (remover)">
            <select
              className="w-full rounded-lg border px-3 py-2"
              value={removeForm.teamName}
              onChange={(e) => setRemoveForm((f) => ({ ...f, teamName: e.target.value }))}
            >
              {(teams[removeForm.group] || []).map((name, i) => (
                <option key={`${name}-${i}`} value={name} disabled={name === "—"}>
                  {name}
                </option>
              ))}
            </select>
          </Field>

          <Field label=" ">
            <label className="inline-flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                checked={removeForm.alsoDelete}
                onChange={(e) => setRemoveForm((f) => ({ ...f, alsoDelete: e.target.checked }))}
              />
              <span>Apagar elenco e logo</span>
            </label>
          </Field>

          <div className="flex items-end">
            <button
              onClick={removeTeam}
              disabled={!removeForm.teamName || removeForm.teamName === "—"}
              className="w-full px-4 py-2 rounded-lg bg-red-600 text-white disabled:opacity-50"
            >
              Remover selecionado
            </button>
          </div>
        </div>

        <hr className="my-4" />

        {/* linha 2: renomear */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
          <Field label="Grupo (renomear)">
            <select
              className="w-full rounded-lg border px-3 py-2"
              value={renameForm.group}
              onChange={(e) => setRenameForm((f) => ({ ...f, group: e.target.value }))}
            >
              {["A", "B", "C", "D"].map((g) => (
                <option key={g} value={g}>Grupo {g}</option>
              ))}
            </select>
          </Field>

          <Field label="Time atual">
            <select
              className="w-full rounded-lg border px-3 py-2"
              value={renameForm.teamName}
              onChange={(e) => setRenameForm((f) => ({ ...f, teamName: e.target.value }))}
            >
              {(teams[renameForm.group] || []).map((name, i) => (
                <option key={`${name}-${i}`} value={name} disabled={name === "—"}>
                  {name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Novo nome">
            <input
              className="w-full rounded-lg border px-3 py-2"
              value={renameForm.newName}
              onChange={(e) => setRenameForm((f) => ({ ...f, newName: e.target.value }))}
              placeholder="Ex.: Panteras FC"
            />
          </Field>

          <Field label="Mover dados">
            <div className="flex gap-3 mt-2">
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={renameForm.moveRoster}
                  onChange={(e) => setRenameForm((f) => ({ ...f, moveRoster: e.target.checked }))}
                />
                <span>Elenco</span>
              </label>
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={renameForm.moveLogo}
                  onChange={(e) => setRenameForm((f) => ({ ...f, moveLogo: e.target.checked }))}
                />
                <span>Logo</span>
              </label>
            </div>
          </Field>

          <div className="flex items-end">
            <button
              onClick={renameTeam}
              disabled={!renameForm.teamName || renameForm.teamName === "—" || !renameForm.newName.trim()}
              className="w-full px-4 py-2 rounded-lg bg-black text-white disabled:opacity-50"
            >
              Renomear
            </button>
          </div>
        </div>

        <hr className="my-4" />

        {/* linha 3: swap */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
          <Field label="Grupo (trocar vagas)">
            <select
              className="w-full rounded-lg border px-3 py-2"
              value={swapForm.group}
              onChange={(e) => setSwapForm((f) => ({ ...f, group: e.target.value }))}
            >
              {["A", "B", "C", "D"].map((g) => (
                <option key={g} value={g}>Grupo {g}</option>
              ))}
            </select>
          </Field>

          <Field label="Índice 1">
            <select
              className="w-full rounded-lg border px-3 py-2"
              value={swapForm.i1}
              onChange={(e) => setSwapForm((f) => ({ ...f, i1: Number(e.target.value) }))}
            >
              {(teams[swapForm.group] || []).map((name, i) => (
                <option key={`i1-${i}`} value={i}>{i} — {name}</option>
              ))}
            </select>
          </Field>

          <Field label="Índice 2">
            <select
              className="w-full rounded-lg border px-3 py-2"
              value={swapForm.i2}
              onChange={(e) => setSwapForm((f) => ({ ...f, i2: Number(e.target.value) }))}
            >
              {(teams[swapForm.group] || []).map((name, i) => (
                <option key={`i2-${i}`} value={i}>{i} — {name}</option>
              ))}
            </select>
          </Field>

          <div className="md:col-span-2 flex items-end">
            <button
              onClick={swapPositions}
              className="w-full px-4 py-2 rounded-lg bg-indigo-600 text-white"
            >
              Trocar posições
            </button>
          </div>
        </div>

        {error && <p className="text-red-600 mt-3 text-sm">{error}</p>}
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex gap-2">
          {["ALL", "A", "B", "C", "D"].map((g) => (
            <button
              key={g}
              onClick={() => setFilter(g)}
              className={`px-3 py-2 rounded-lg text-sm font-semibold border transition-colors ${
                filter === g
                  ? "bg-black text-white border-black"
                  : "bg-white text-black border-black hover:bg-black/10"
              }`}
            >
              {g === "ALL" ? "Todos" : `Grupo ${g}`}
            </button>
          ))}
        </div>

        <div className="relative ml-auto">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar time..."
            className="pl-10 pr-3 py-2 rounded-lg border w-72"
          />
          <svg
            className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z" />
          </svg>
        </div>
      </div>

      {/* Grade de times */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map((t) => (
          <button
            key={`${t.group}-${t.idx}`}
            onClick={() => openTeamModal(t)}
            className="text-left bg-gradient-to-b from-violet-600 to-purple-700 text-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-3 mb-3">
              <TeamBadge name={t.name} logo={t.logo} />
              <div className="flex-1">
                <div className="font-semibold text-lg leading-tight truncate">{t.name}</div>
                <div className="text-white/80 text-sm">Grupo {t.group}</div>
              </div>
            </div>

            {/* mini-resumo */}
            <MiniSummary
              stats={computeTeamStats(teams[t.group], matches[t.group], t.idx)}
            />
          </button>
        ))}
      </div>

      {/* Modal do time */}
      <Modal open={!!openTeam} onClose={() => setOpenTeam(null)}>
        {sel && (
          <div>
            {/* header */}
            <div className="flex items-center gap-4 mb-4">
              <TeamBadge name={sel.name} logo={sel.logo} />
              <div className="flex-1">
                <h2 className="text-xl font-semibold">{sel.name}</h2>
                <div className="text-sm text-gray-600">
                  Grupo {openTeam.group} • {sel.stats.v + sel.stats.e + sel.stats.d} jogos
                </div>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Logo (URL):</label>
                <input
                  className="rounded-lg border px-2 py-1 text-sm"
                  value={sel.logo}
                  onChange={(e) => {
                    const url = e.target.value;
                    setLogos((l) => {
                      const copy = { ...l };
                      copy[sel.name] = url;
                      return copy;
                    });
                  }}
                  placeholder="https://…"
                />
              </div>
            </div>

            {/* remover direto do modal */}
            <div className="mb-4">
              <button
                className="px-3 py-2 rounded-lg bg-red-600 text-white text-sm"
                onClick={() => {
                  setRemoveForm({
                    group: openTeam.group,
                    teamName: sel.name,
                    alsoDelete: true,
                  });
                  removeTeam();
                }}
              >
                Remover este time (apagar elenco e logo)
              </button>
            </div>

            {/* stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              <BigStat label="Pontos" value={sel.stats.pts} />
              <BigStat label="Vitórias" value={sel.stats.v} />
              <BigStat label="Empates" value={sel.stats.e} />
              <BigStat label="Derrotas" value={sel.stats.d} />
              <BigStat label="Gols Pró" value={sel.stats.gp} />
              <BigStat label="Gols Contra" value={sel.stats.gc} />
              <BigStat label="Saldo" value={sel.stats.sg} />
              <BigStat label="Jogos" value={sel.stats.v + sel.stats.e + sel.stats.d} />
            </div>

            {/* elenco */}
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold">Elenco</h3>
              <button
                className="px-3 py-2 rounded-lg bg-black text-white text-sm"
                onClick={addPlayer}
              >
                Adicionar jogadora
              </button>
            </div>

            {sel.roster.length === 0 && (
              <div className="text-sm text-gray-500 mb-4">
                Nenhuma jogadora cadastrada.
              </div>
            )}

            {/* Cartas em CARROSSEL */}
            <HScroller className="mb-2">
              {sel.roster.map((p) => (
                <div
                  key={p.id}
                  className="snap-start w-[360px] min-w-[360px] shrink-0 rounded-2xl border bg-gray-50 overflow-hidden"
                >
                  <div className="p-3 flex items-start gap-3">
                    {/* Foto mais compacta */}
                    <div className="relative shrink-0">
                      <img
                        src={p.foto || "https://via.placeholder.com/160x200"}
                        alt={p.nome || "Jogadora"}
                        className="w-[120px] h-[160px] rounded-xl object-cover bg-gray-100"
                      />
                      <label className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] rounded px-2 py-1 cursor-pointer">
                        Upload
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => uploadPlayerPhoto(p.id, e.target.files?.[0])}
                        />
                      </label>
                    </div>

                    {/* Infos principais compactas */}
                    <div className="flex-1 space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <Field label="Nome">
                          <input
                            className="w-full rounded-lg border px-2 py-1 text-sm"
                            value={p.nome}
                            onChange={(e) => updatePlayer(p.id, "nome", e.target.value)}
                          />
                        </Field>
                        <Field label="Número">
                          <input
                            className="w-full rounded-lg border px-2 py-1 text-sm"
                            value={p.numero}
                            onChange={(e) => updatePlayer(p.id, "numero", e.target.value)}
                          />
                        </Field>
                      </div>

                      <Field label="Posição">
                        <input
                          className="rounded-lg border px-2 py-1 w-full text-sm"
                          value={p.posicao}
                          onChange={(e) => updatePlayer(p.id, "posicao", e.target.value)}
                          placeholder="Ex.: MEI"
                        />
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {["GOL","ZAG","LAT","VOL","MEI","PON","ATA"].map((pos) => (
                            <button
                              key={pos}
                              onClick={() => updatePlayer(p.id, "posicao", pos)}
                              type="button"
                              className={`px-2 py-1 rounded-md text-[11px] font-semibold border ${
                                p.posicao === pos
                                  ? "bg-black text-white border-black"
                                  : "bg-white text-black border-black hover:bg-black/10"
                              }`}
                            >
                              {pos}
                            </button>
                          ))}
                        </div>
                      </Field>

                      <div className="grid grid-cols-2 gap-2">
                        <Field label="Gols">
                          <input
                            type="number"
                            className="w-full rounded-lg border px-2 py-1 text-sm"
                            value={p.gols ?? 0}
                            onChange={(e) => updatePlayer(p.id, "gols", e.target.value)}
                          />
                        </Field>
                        <Field label="Assist.">
                          <input
                            type="number"
                            className="w-full rounded-lg border px-2 py-1 text-sm"
                            value={p.assistencias ?? 0}
                            onChange={(e) => updatePlayer(p.id, "assistencias", e.target.value)}
                          />
                        </Field>
                      </div>

                      <Field label="Foto (URL)">
                        <input
                          className="w-full rounded-lg border px-2 py-1 text-sm"
                          value={p.foto}
                          onChange={(e) => updatePlayer(p.id, "foto", e.target.value)}
                          placeholder="https://…"
                        />
                      </Field>

                      <Field label="Bio">
                        <textarea
                          className="w-full rounded-lg border px-2 py-1 text-sm"
                          rows={2}
                          value={p.bio}
                          onChange={(e) => updatePlayer(p.id, "bio", e.target.value)}
                        />
                      </Field>

                      <div className="text-right">
                        <button
                          className="text-red-600 text-sm"
                          onClick={() => removePlayer(p.id)}
                        >
                          Remover jogadora
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </HScroller>
            <div className="text-xs text-gray-500 mt-1">
              Dica: arraste para o lado, use a barra de rolagem ou as setas (desktop).
            </div>

            {/* partidas do time no grupo */}
            <h3 className="font-semibold mt-6 mb-2">Partidas no grupo</h3>
            <div className="space-y-2">
              {sel.stats.games.map((g) => (
                <div key={g.id} className="rounded-lg border p-3 flex items-center justify-between">
                  <div className="text-sm">
                    <span className="font-medium">{sel.name}</span>
                    <span className="mx-2 text-gray-500">vs</span>
                    <span>{g.opponent}</span>
                  </div>
                  <div className="text-sm">
                    {g.finished ? (
                      <span className="font-semibold">
                        {g.self} x {g.opp}
                      </span>
                    ) : (
                      <span className="text-gray-500">—</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

/* ------ pequenos componentes ------ */
function MiniSummary({ stats }) {
  return (
    <div className="grid grid-cols-7 gap-2 text-xs text-white/90">
      <Stat label="Pts" val={stats.pts} />
      <Stat label="V" val={stats.v} />
      <Stat label="E" val={stats.e} />
      <Stat label="D" val={stats.d} />
      <Stat label="GP" val={stats.gp} />
      <Stat label="GC" val={stats.gc} />
      <Stat label="SG" val={stats.sg} />
    </div>
  );
}
function Stat({ label, val }) {
  return (
    <div className="text-center">
      <div className="text-[10px] uppercase tracking-wide text-white/80">{label}</div>
      <div className="font-semibold">{val}</div>
    </div>
  );
}
function BigStat({ label, value }) {
  return (
    <div className="rounded-xl bg-gray-50 border p-3">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-xl font-semibold">{value}</div>
    </div>
  );
}
