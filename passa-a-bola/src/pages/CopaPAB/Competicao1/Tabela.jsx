// src/pages/CopaPAB/Competicao1/Tabela.jsx
import { useEffect, useMemo, useRef, useState, forwardRef } from "react";

function Tabs({ tab, setTab }) {
  const base =
    "px-4 py-2 rounded-lg text-sm font-semibold border transition-colors";
  const active = "bg-black text-white border-black";
  const off = "bg-white text-black border-black hover:bg-black/10";
  return (
    <div className="flex gap-2 mb-6">
      <button className={`${base} ${tab === "grupos" ? active : off}`} onClick={() => setTab("grupos")}>
        Grupos
      </button>
      <button className={`${base} ${tab === "chave" ? active : off}`} onClick={() => setTab("chave")}>
        Chaveamento
      </button>
    </div>
  );
}

function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-x-0 top-10 mx-auto max-w-xl bg-white rounded-2xl shadow-xl p-6">
        {children}
      </div>
    </div>
  );
}

const MatchCard = forwardRef(function MatchCard(
  { value, onChange, disabled, onOpenPens },
  ref
) {
  const set = (k, v) => onChange({ ...value, [k]: v === "" ? "" : Number(v) });
  const done = value.golsA !== "" && value.golsB !== "";
  const tie = done && Number(value.golsA) === Number(value.golsB);

  const sum = (arr) =>
    Array.isArray(arr) ? arr.reduce((s, x) => s + (x ? 1 : 0), 0) : null;
  const pA = sum(value.pA);
  const pB = sum(value.pB);
  const hasPens = pA !== null && pB !== null;

  const winA =
    (done && Number(value.golsA) > Number(value.golsB)) ||
    (tie && hasPens && pA > pB);
  const winB =
    (done && Number(value.golsB) > Number(value.golsA)) ||
    (tie && hasPens && pB > pA);

  const inputCls =
    "w-14 rounded-md text-center " +
    (disabled ? "bg-white/70 text-black/60" : "text-black");

  return (
    <div
      ref={ref}
      className="w-64 bg-gradient-to-b from-violet-600 to-purple-700 text-white rounded-2xl shadow-md p-4"
    >
      <div className="flex items-center justify-between gap-3">
        <span className={`truncate ${winA ? "font-bold" : ""}`}>{value.timeA}</span>
        <input
          type="number"
          value={value.golsA}
          readOnly={disabled}
          onChange={(e) => set("golsA", e.target.value)}
          className={inputCls}
        />
      </div>
      <div className="flex items-center justify-between gap-3 mt-3">
        <span className={`truncate ${winB ? "font-bold" : ""}`}>{value.timeB}</span>
        <input
          type="number"
          value={value.golsB}
          readOnly={disabled}
          onChange={(e) => set("golsB", e.target.value)}
          className={inputCls}
        />
      </div>

      <div className="mt-3 text-xs">
        {tie ? (
          <div className="flex items-center justify-between">
            {hasPens ? (
              <span className="font-semibold">Pênaltis: {pA}–{pB}</span>
            ) : (
              <span className="opacity-90">Empate — definir pênaltis</span>
            )}
            {!disabled && (
              <button
                onClick={onOpenPens}
                className="px-2 py-1 rounded bg-black/20 hover:bg-black/30"
              >
                Definir pênaltis
              </button>
            )}
          </div>
        ) : hasPens ? (
          <span className="font-semibold">Pênaltis: {pA}–{pB}</span>
        ) : null}
      </div>
    </div>
  );
});

function emptyTeamRow(name) {
  return { time: name, pts: 0, v: 0, e: 0, d: 0, gp: 0, gc: 0, sg: 0 };
}
function calcTable(teams, matches) {
  const rows = teams.map((n) => emptyTeamRow(n));
  for (const m of matches) {
    if (m.ga === "" || m.gb === "") continue;
    const ga = Number(m.ga), gb = Number(m.gb);
    const A = rows[m.a], B = rows[m.b];
    A.gp += ga; A.gc += gb; A.sg = A.gp - A.gc;
    B.gp += gb; B.gc += ga; B.sg = B.gp - B.gc;
    if (ga > gb) { A.v++; A.pts += 3; B.d++; }
    else if (gb > ga) { B.v++; B.pts += 3; A.d++; }
    else { A.e++; B.e++; A.pts++; B.pts++; }
  }
  return rows;
}
function rank(rows) {
  return [...rows].sort((a, b) => {
    if (b.pts !== a.pts) return b.pts - a.pts;
    if (b.v !== a.v) return b.v - a.v;
    if (b.sg !== a.sg) return b.sg - a.sg;
    return a.time.localeCompare(b.time);
  });
}
function fixtures4() {
  return [
    { id: 1, a: 0, b: 1, ga: "", gb: "" },
    { id: 2, a: 2, b: 3, ga: "", gb: "" },
    { id: 3, a: 0, b: 2, ga: "", gb: "" },
    { id: 4, a: 1, b: 3, ga: "", gb: "" },
    { id: 5, a: 0, b: 3, ga: "", gb: "" },
    { id: 6, a: 1, b: 2, ga: "", gb: "" },
  ];
}

export default function TabelaCompeticao1() {
  const [tab, setTab] = useState("grupos");
  const [isEdit, setIsEdit] = useState(false);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(max-width: 768px)").matches : false
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 768px)");
    const h = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  const teamsInit = useMemo(
    () => ({
      A: ["Time 1", "Time 2", "Time 3", "Time 4"],
      B: ["Time 5", "Time 6", "Time 7", "Time 8"],
      C: ["Time 9", "Time 10", "Time 11", "Time 12"],
      D: ["Time 13", "Time 14", "Time 15", "Time 16"],
    }),
    []
  );

  const load = (k, def) => {
    try {
      return JSON.parse(localStorage.getItem(k)) ?? def;
    } catch {
      return def;
    }
  };
  const [teams, setTeams] = useState(() => load("c1-teams", teamsInit));
  const [matches, setMatches] = useState(() =>
    load("c1-matches", {
      A: fixtures4(),
      B: fixtures4(),
      C: fixtures4(),
      D: fixtures4(),
    })
  );

  const [draftTeams, setDraftTeams] = useState(teams);
  const [draftMatches, setDraftMatches] = useState(matches);

  useEffect(() => {
    setDraftTeams(teams);
    setDraftMatches(matches);
  }, [teams, matches]);

  const saveAll = () => {
    setTeams(draftTeams);
    setMatches(draftMatches);
    localStorage.setItem("c1-teams", JSON.stringify(draftTeams));
    localStorage.setItem("c1-matches", JSON.stringify(draftMatches));
    setIsEdit(false);
  };
  const cancelAll = () => {
    setDraftTeams(teams);
    setDraftMatches(matches);
    setIsEdit(false);
  };

  const effTeams = isEdit ? draftTeams : teams;
  const effMatches = isEdit ? draftMatches : matches;

  const tables = useMemo(
    () => ({
      A: calcTable(effTeams.A, effMatches.A),
      B: calcTable(effTeams.B, effMatches.B),
      C: calcTable(effTeams.C, effMatches.C),
      D: calcTable(effTeams.D, effMatches.D),
    }),
    [effTeams, effMatches]
  );

  const ranked = useMemo(
    () => ({
      A: rank(tables.A),
      B: rank(tables.B),
      C: rank(tables.C),
      D: rank(tables.D),
    }),
    [tables]
  );

  const emptyKO = { golsA: "", golsB: "", pA: null, pB: null };
  const [quartasLeft, setQuartasLeft] = useState([
    { id: 1, timeA: "—", timeB: "—", ...emptyKO },
    { id: 2, timeA: "—", timeB: "—", ...emptyKO },
  ]);
  const [quartasRight, setQuartasRight] = useState([
    { id: 3, timeA: "—", timeB: "—", ...emptyKO },
    { id: 4, timeA: "—", timeB: "—", ...emptyKO },
  ]);
  const [semiLeft, setSemiLeft] = useState([{ id: 5, timeA: "—", timeB: "—", ...emptyKO }]);
  const [semiRight, setSemiRight] = useState([{ id: 6, timeA: "—", timeB: "—", ...emptyKO }]);
  const [finale, setFinale] = useState([{ id: 7, timeA: "—", timeB: "—", ...emptyKO }]);

  useEffect(() => {
    const a1 = ranked.A[0]?.time ?? "—", a2 = ranked.A[1]?.time ?? "—";
    const b1 = ranked.B[0]?.time ?? "—", b2 = ranked.B[1]?.time ?? "—";
    const c1 = ranked.C[0]?.time ?? "—", c2 = ranked.C[1]?.time ?? "—";
    const d1 = ranked.D[0]?.time ?? "—", d2 = ranked.D[1]?.time ?? "—";
    setQuartasLeft((p) => [
      { ...p[0], timeA: a1, timeB: b2 },
      { ...p[1], timeA: b1, timeB: a2 },
    ]);
    setQuartasRight((p) => [
      { ...p[0], timeA: c1, timeB: d2 },
      { ...p[1], timeA: d1, timeB: c2 },
    ]);
  }, [ranked]);

  const pensSum = (arr) =>
    Array.isArray(arr) ? arr.reduce((s, x) => s + (x ? 1 : 0), 0) : null;
  const allFilled = (arr) => Array.isArray(arr) && arr.every((v) => v !== null);
  const validShootout = (m) =>
    Array.isArray(m.pA) &&
    Array.isArray(m.pB) &&
    m.pA.length === m.pB.length &&
    m.pA.length >= 5 &&
    allFilled(m.pA) &&
    allFilled(m.pB) &&
    pensSum(m.pA) !== pensSum(m.pB);

  const winnerOf = (m) => {
    const done = m.golsA !== "" && m.golsB !== "";
    if (!done) return "—";
    if (m.golsA > m.golsB) return m.timeA;
    if (m.golsB > m.golsA) return m.timeB;
    if (validShootout(m)) {
      return pensSum(m.pA) > pensSum(m.pB) ? m.timeA : m.timeB;
    }
    return "—";
  };

  useEffect(() => {
    const wTop = winnerOf(quartasLeft[0]);
    const wBot = winnerOf(quartasLeft[1]);
    setSemiLeft((prev) => prev.map((s) => ({ ...s, timeA: wTop, timeB: wBot })));
  }, [quartasLeft]);
  useEffect(() => {
    const wTop = winnerOf(quartasRight[0]);
    const wBot = winnerOf(quartasRight[1]);
    setSemiRight((prev) => prev.map((s) => ({ ...s, timeA: wTop, timeB: wBot })));
  }, [quartasRight]);
  useEffect(() => {
    const wl = winnerOf(semiLeft[0]);
    const wr = winnerOf(semiRight[0]);
    setFinale((prev) => prev.map((f) => ({ ...f, timeA: wl, timeB: wr })));
  }, [semiLeft, semiRight]);

  const containerRef = useRef(null);
  const qlRefs = [useRef(null), useRef(null)];
  const slRef = useRef(null);
  const finalRef = useRef(null);
  const srRef = useRef(null);
  const qrRefs = [useRef(null), useRef(null)];

  const getCenterRight = (ref) => {
    const c = containerRef.current;
    if (!c || !ref?.current) return null;
    const r = ref.current.getBoundingClientRect();
    const rc = c.getBoundingClientRect();
    return { x: r.right - rc.left, y: r.top + r.height / 2 - rc.top };
  };
  const getCenterLeft = (ref) => {
    const c = containerRef.current;
    if (!c || !ref?.current) return null;
    const r = ref.current.getBoundingClientRect();
    const rc = c.getBoundingClientRect();
    return { x: r.left - rc.left, y: r.top + r.height / 2 - rc.top };
  };
  const makePath = (p1, p2) => {
    if (!p1 || !p2) return "";
    const mid = (p1.x + p2.x) / 2;
    return `M ${p1.x},${p1.y} H ${mid} V ${p2.y} H ${p2.x}`;
  };

  const [tick, force] = useState(0);
  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(() => force((t) => t + 1));
    ro.observe(containerRef.current);
    const onScroll = () => force((t) => t + 1);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    requestAnimationFrame(() => force((t) => t + 1));
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  useEffect(() => {
    if (tab !== "chave") return;
    requestAnimationFrame(() => force((t) => t + 1));
    setTimeout(() => force((t) => t + 1), 0);
  }, [tab, quartasLeft, quartasRight, semiLeft, semiRight, finale, isMobile]);

  const setTeamName = (g, idx, name) =>
    setDraftTeams((t) => ({ ...t, [g]: t[g].map((n, i) => (i === idx ? name : n)) }));
  const setMatchScore = (g, id, side, value) =>
    setDraftMatches((mm) => ({
      ...mm,
      [g]: mm[g].map((m) =>
        m.id === id ? { ...m, [side]: value === "" ? "" : Number(value) } : m
      ),
    }));

  const updateKO = (id, updater) => {
    const apply = (arr) => arr.map((m) => (m.id === id ? updater(m) : m));
    if ([1, 2].includes(id)) setQuartasLeft((arr) => apply(arr));
    else if ([3, 4].includes(id)) setQuartasRight((arr) => apply(arr));
    else if (id === 5) setSemiLeft((arr) => apply(arr));
    else if (id === 6) setSemiRight((arr) => apply(arr));
    else if (id === 7) setFinale((arr) => apply(arr));
  };

  const [penModal, setPenModal] = useState({ open: false, match: null });

  const ensureLen = (arr, n) => {
    const out = Array.isArray(arr) ? [...arr] : [];
    while (out.length < n) out.push(null);
    return out;
  };
  const openPensFor = (m) => {
    if (!isEdit) return;
    setPenModal({
      open: true,
      match: {
        ...m,
        pA: ensureLen(m.pA, 5),
        pB: ensureLen(m.pB, 5),
      },
    });
  };
  const toggleKick = (team, i) => {
    setPenModal((pm) => {
      const next = { ...pm.match };
      const key = team === "A" ? "pA" : "pB";
      const cur = [...next[key]];
      const v = cur[i];
      cur[i] = v === null ? true : v === true ? false : null;
      next[key] = cur;
      return { ...pm, match: next };
    });
  };
  const addSudden = () => {
    setPenModal((pm) => {
      const n = Math.max(pm.match.pA.length, pm.match.pB.length) + 1;
      return {
        ...pm,
        match: {
          ...pm.match,
          pA: ensureLen(pm.match.pA, n),
          pB: ensureLen(pm.match.pB, n),
        },
      };
    });
  };
  const removeSudden = () => {
    setPenModal((pm) => {
      const len = pm.match.pA.length;
      if (len <= 5) return pm;
      const trim = (arr) => arr.slice(0, len - 1);
      return { ...pm, match: { ...pm.match, pA: trim(pm.match.pA), pB: trim(pm.match.pB) } };
    });
  };
  const clearPens = () => {
    setPenModal((pm) => ({
      ...pm,
      match: { ...pm.match, pA: ensureLen([], 5), pB: ensureLen([], 5) },
    }));
  };
  const canSavePens = () => {
    const m = penModal.match;
    if (!m) return false;
    const sA = pensSum(m.pA);
    const sB = pensSum(m.pB);
    return (
      m.pA.length === m.pB.length &&
      m.pA.length >= 5 &&
      allFilled(m.pA) &&
      allFilled(m.pB) &&
      sA !== sB
    );
  };
  const savePens = () => {
    if (!canSavePens()) return;
    const m = penModal.match;
    updateKO(m.id, (old) => ({ ...old, pA: m.pA, pB: m.pB }));
    setPenModal({ open: false, match: null });
  };

  const PenRow = ({ label, arr, onClick }) => (
    <div>
      <div className="text-sm font-medium mb-2">{label}</div>
      <div className="flex flex-wrap gap-2">
        {arr.map((v, i) => (
          <button
            key={i}
            onClick={() => onClick(i)}
            className={`w-10 h-10 rounded-full border flex items-center justify-center text-lg ${
              v === null ? "bg-white" : v ? "bg-green-600 text-white" : "bg-red-600 text-white"
            }`}
            title={v === null ? "não cobrado" : v ? "acertou" : "errou"}
          >
            {v === null ? "•" : v ? "✓" : "✕"}
          </button>
        ))}
      </div>
    </div>
  );

  // --- MOBILE FUNIL (igual ao mock) ---
  const VerticalBracket = () => {
    const vContainerRef = useRef(null);

    const qTopLRef = useRef(null);
    const qTopRRef = useRef(null);
    const sTopRef  = useRef(null);
    const finalRefV = useRef(null);
    const sBotRef  = useRef(null);
    const qBotLRef = useRef(null);
    const qBotRRef = useRef(null);

    const getBottomCenter = (ref) => {
      const c = vContainerRef.current;
      if (!c || !ref?.current) return null;
      const r = ref.current.getBoundingClientRect();
      const rc = c.getBoundingClientRect();
      return { x: r.left + r.width / 2 - rc.left, y: r.bottom - rc.top };
    };
    const getTopCenter = (ref) => {
      const c = vContainerRef.current;
      if (!c || !ref?.current) return null;
      const r = ref.current.getBoundingClientRect();
      const rc = c.getBoundingClientRect();
      return { x: r.left + r.width / 2 - rc.left, y: r.top - rc.top };
    };
    const makeVPath = (p1, p2) => {
      if (!p1 || !p2) return "";
      const mid = (p1.y + p2.y) / 2;
      return `M ${p1.x},${p1.y} V ${mid} H ${p2.x} V ${p2.y}`;
    };

    const semiTopValue = {
      ...semiLeft[0],
      timeA: winnerOf(quartasLeft[0]),
      timeB: winnerOf(quartasRight[0]),
    };
    const semiBotValue = {
      ...semiRight[0],
      timeA: winnerOf(quartasLeft[1]),
      timeB: winnerOf(quartasRight[1]),
    };

    const [vtick, vforce] = useState(0);
    useEffect(() => {
      if (!vContainerRef.current) return;
      const ro = new ResizeObserver(() => vforce((t) => t + 1));
      ro.observe(vContainerRef.current);
      const onScroll = () => vforce((t) => t + 1);
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
      requestAnimationFrame(() => vforce((t) => t + 1));
      return () => {
        ro.disconnect();
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
      };
    }, [quartasLeft, quartasRight, semiLeft, semiRight, finale]);

    return (
      <div ref={vContainerRef} className="relative w-full px-2">
        <div className="grid grid-cols-2 gap-y-8 gap-x-6 max-w-md mx-auto">
          <div className="col-span-2 text-xs font-semibold text-black uppercase tracking-wide">Quartas</div>

          <div className="flex justify-start">
            <MatchCard
              ref={qTopLRef}
              value={quartasLeft[0]}
              onChange={(v) => setQuartasLeft((arr) => arr.map((x) => (x.id === quartasLeft[0].id ? v : x)))}
              disabled={!isEdit}
              onOpenPens={() => openPensFor(quartasLeft[0])}
            />
          </div>
          <div className="flex justify-end">
            <MatchCard
              ref={qTopRRef}
              value={quartasRight[0]}
              onChange={(v) => setQuartasRight((arr) => arr.map((x) => (x.id === quartasRight[0].id ? v : x)))}
              disabled={!isEdit}
              onOpenPens={() => openPensFor(quartasRight[0])}
            />
          </div>

          <div className="col-span-2 mt-2 text-xs font-semibold text-black uppercase tracking-wide">Semi-Final</div>
          <div className="col-span-2 flex justify-center">
            <MatchCard
              ref={sTopRef}
              value={semiTopValue}
              onChange={(v) => setSemiLeft((arr) => arr.map((x) => (x.id === semiLeft[0].id ? v : x)))}
              disabled={!isEdit}
              onOpenPens={() => openPensFor({ ...semiTopValue })}
            />
          </div>

          <div className="col-span-2 mt-2 text-xs font-semibold text-black uppercase tracking-wide">Final</div>
          <div className="col-span-2 flex justify-center">
            <MatchCard
              ref={finalRefV}
              value={finale[0]}
              onChange={(v) => setFinale((arr) => arr.map((x) => (x.id === finale[0].id ? v : x)))}
              disabled={!isEdit}
              onOpenPens={() => openPensFor(finale[0])}
            />
          </div>

          <div className="col-span-2 mt-2 text-xs font-semibold text-black uppercase tracking-wide">Semi-Final</div>
          <div className="col-span-2 flex justify-center">
            <MatchCard
              ref={sBotRef}
              value={semiBotValue}
              onChange={(v) => setSemiRight((arr) => arr.map((x) => (x.id === semiRight[0].id ? v : x)))}
              disabled={!isEdit}
              onOpenPens={() => openPensFor({ ...semiBotValue })}
            />
          </div>

          <div className="col-span-2 mt-2 text-xs font-semibold text-black uppercase tracking-wide">Quartas</div>
          <div className="flex justify-start">
            <MatchCard
              ref={qBotLRef}
              value={quartasLeft[1]}
              onChange={(v) => setQuartasLeft((arr) => arr.map((x) => (x.id === quartasLeft[1].id ? v : x)))}
              disabled={!isEdit}
              onOpenPens={() => openPensFor(quartasLeft[1])}
            />
          </div>
          <div className="flex justify-end">
            <MatchCard
              ref={qBotRRef}
              value={quartasRight[1]}
              onChange={(v) => setQuartasRight((arr) => arr.map((x) => (x.id === quartasRight[1].id ? v : x)))}
              disabled={!isEdit}
              onOpenPens={() => openPensFor(quartasRight[1])}
            />
          </div>
        </div>

        {/* SVG – conexões do funil; “T” explícito no último ramal */}
        <svg
          key={vtick}
          className="pointer-events-none absolute inset-0"
          width={vContainerRef.current?.scrollWidth ?? 420}
          height={vContainerRef.current?.scrollHeight ?? 1400}
        >
          {/* Quartas topo → Semi topo */}
          <path d={makeVPath(getBottomCenter(qTopLRef), getTopCenter(sTopRef))} stroke="#111827" strokeWidth="4" fill="none" />
          <path d={makeVPath(getBottomCenter(qTopRRef), getTopCenter(sTopRef))} stroke="#111827" strokeWidth="4" fill="none" />

          {/* Semi topo → Final */}
          <path d={makeVPath(getBottomCenter(sTopRef),  getTopCenter(finalRefV))} stroke="#111827" strokeWidth="4" fill="none" />

          {/* Final → Semi baixo */}
          <path d={makeVPath(getBottomCenter(finalRefV), getTopCenter(sBotRef))} stroke="#111827" strokeWidth="4" fill="none" />

          {/* Semi baixo → Quartas baixo (T explícito) */}
          {(() => {
            const p1 = getBottomCenter(sBotRef);
            const tL = getTopCenter(qBotLRef);
            const tR = getTopCenter(qBotRRef);
            if (!p1 || !tL || !tR) return null;

            const yJ  = p1.y + 24;  // altura onde fica o T
            const bar = 0;         // meia-largura da barra do T

            // desce da semi até o Y do T
            const down  = `M ${p1.x},${p1.y} V ${yJ}`;
            // barra horizontal do T
            const tee   = `M ${p1.x - bar},${yJ} H ${p1.x + bar}`;
            // cotovelos para as quartas
            const left  = `M ${p1.x - bar},${yJ} H ${tL.x} V ${tL.y}`;
            const right = `M ${p1.x + bar},${yJ} H ${tR.x} V ${tR.y}`;

            return (
              <>
                <path d={down}  stroke="#111827" strokeWidth="4" fill="none" />
                <path d={tee}   stroke="#111827" strokeWidth="4" fill="none" />
                <path d={left}  stroke="#111827" strokeWidth="4" fill="none" />
                <path d={right} stroke="#111827" strokeWidth="4" fill="none" />
              </>
            );
          })()}
        </svg>
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-black">Competição 1 • Tabela</h1>

        {!isEdit ? (
          <button
            onClick={() => setIsEdit(true)}
            className="px-4 py-2 rounded-lg bg-black text-white"
          >
            Editar
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={saveAll}
              className="px-4 py-2 rounded-lg bg-green-600 text-white"
            >
              Salvar
            </button>
            <button
              onClick={cancelAll}
              className="px-4 py-2 rounded-lg bg-gray-300 text-black"
            >
              Cancelar
            </button>
          </div>
        )}
      </div>

      <Tabs tab={tab} setTab={setTab} />

      {tab === "grupos" && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {["A", "B", "C", "D"].map((g) => (
            <div key={g} className="bg-purple-700 rounded-xl p-4 shadow-lg text-white">
              <h2 className="text-xl font-semibold mb-3">Grupo {g}</h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                {(isEdit ? draftTeams : teams)[g].map((n, i) => (
                  <input
                    key={i}
                    className={
                      "rounded px-2 py-1 " +
                      (isEdit ? "text-black" : "bg-white/70 text-black/70")
                    }
                    readOnly={!isEdit}
                    value={n}
                    onChange={(e) => setTeamName(g, i, e.target.value)}
                  />
                ))}
              </div>

              <div className="overflow-x-auto rounded-lg">
                <table className="w-full text-sm">
                  <thead className="text-left">
                    <tr>
                      <th className="py-2">Time</th>
                      <th className="py-2 text-center">Pts</th>
                      <th className="py-2 text-center">V</th>
                      <th className="py-2 text-center">E</th>
                      <th className="py-2 text-center">D</th>
                      <th className="py-2 text-center">GP</th>
                      <th className="py-2 text-center">GC</th>
                      <th className="py-2 text-center">SG</th>
                    </tr>
                  </thead>
                  <tbody className="[&_tr]:bg-purple-900/60 [&_tr]:rounded-lg">
                    {rank(tables[g]).map((row, i) => (
                      <tr key={row.time + i} className="rounded-lg">
                        <td className="p-2">{row.time}</td>
                        <td className="p-2 text-center">{row.pts}</td>
                        <td className="p-2 text-center">{row.v}</td>
                        <td className="p-2 text-center">{row.e}</td>
                        <td className="p-2 text-center">{row.d}</td>
                        <td className="p-2 text-center">{row.gp}</td>
                        <td className="p-2 text-center">{row.gc}</td>
                        <td className="p-2 text-center">{row.sg}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                {(isEdit ? draftMatches : matches)[g].map((m) => (
                  <div key={m.id} className="bg-purple-800/70 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <span className="flex-1 truncate">
                        {(isEdit ? draftTeams : teams)[g][m.a]}
                      </span>
                      <input
                        type="number"
                        className={
                          "w-12 text-center rounded " +
                          (isEdit ? "text-black" : "bg-white/70 text-black/60")
                        }
                        readOnly={!isEdit}
                        value={m.ga}
                        onChange={(e) =>
                          setMatchScore(g, m.id, "ga", e.target.value)
                        }
                      />
                      <span className="mx-1 text-white/80">x</span>
                      <input
                        type="number"
                        className={
                          "w-12 text-center rounded " +
                          (isEdit ? "text-black" : "bg-white/70 text-black/60")
                        }
                        readOnly={!isEdit}
                        value={m.gb}
                        onChange={(e) =>
                          setMatchScore(g, m.id, "gb", e.target.value)
                        }
                      />
                      <span className="flex-1 text-right truncate">
                        {(isEdit ? draftTeams : teams)[g][m.b]}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "chave" && (
        <>
          {/* Desktop/tablet: horizontal */}
          {!isMobile && (
            <div className="min-h-[70vh] flex items-center mt-2">
              <div
                ref={containerRef}
                className="relative w-full overflow-x-auto px-6 md:px-12"
              >
                <div className="mx-auto flex items-center justify-center gap-16 md:gap-24 min-w-[1000px]">
                  {/* Quartas - ESQ */}
                  <div className="flex flex-col gap-24 pl-2 md:pl-6">
                    <div className="text-xs md:text-sm font-semibold text-black uppercase tracking-wide mb-1">
                      Quartas
                    </div>
                    {quartasLeft.map((m, i) => (
                      <MatchCard
                        key={m.id}
                        ref={qlRefs[i]}
                        value={m}
                        onChange={(v) =>
                          setQuartasLeft((arr) =>
                            arr.map((x) => (x.id === m.id ? v : x))
                          )
                        }
                        disabled={!isEdit}
                        onOpenPens={() => openPensFor(m)}
                      />
                    ))}
                  </div>

                  {/* Semi ESQ */}
                  <div className="flex flex-col gap-24">
                    <div className="text-xs md:text-sm font-semibold text-black uppercase tracking-wide mb-1">
                      Semi-Final
                    </div>
                    {semiLeft.map((m) => (
                      <MatchCard
                        key={m.id}
                        ref={slRef}
                        value={m}
                        onChange={(v) =>
                          setSemiLeft((arr) =>
                            arr.map((x) => (x.id === m.id ? v : x))
                          )
                        }
                        disabled={!isEdit}
                        onOpenPens={() => openPensFor(m)}
                      />
                    ))}
                  </div>

                  {/* Final */}
                  <div className="flex flex-col gap-24">
                    <div className="text-xs md:text-sm font-semibold text-black uppercase tracking-wide mb-1">
                      Final
                    </div>
                    {finale.map((m) => (
                      <MatchCard
                        key={m.id}
                        ref={finalRef}
                        value={m}
                        onChange={(v) =>
                          setFinale((arr) => arr.map((x) => (x.id === m.id ? v : x)))
                        }
                        disabled={!isEdit}
                        onOpenPens={() => openPensFor(m)}
                      />
                    ))}
                  </div>

                  {/* Semi DIR */}
                  <div className="flex flex-col gap-24">
                    <div className="text-xs md:text-sm font-semibold text-black uppercase tracking-wide mb-1">
                      Semi-Final
                    </div>
                    {semiRight.map((m) => (
                      <MatchCard
                        key={m.id}
                        ref={srRef}
                        value={m}
                        onChange={(v) =>
                          setSemiRight((arr) =>
                            arr.map((x) => (x.id === m.id ? v : x))
                          )
                        }
                        disabled={!isEdit}
                        onOpenPens={() => openPensFor(m)}
                      />
                    ))}
                  </div>

                  {/* Quartas - DIR */}
                  <div className="flex flex-col gap-24 pr-2 md:pr-6">
                    <div className="text-xs md:text-sm font-semibold text-black uppercase tracking-wide mb-1 text-right">
                      Quartas
                    </div>
                    {quartasRight.map((m, i) => (
                      <MatchCard
                        key={m.id}
                        ref={qrRefs[i]}
                        value={m}
                        onChange={(v) =>
                          setQuartasRight((arr) =>
                            arr.map((x) => (x.id === m.id ? v : x))
                          )
                        }
                        disabled={!isEdit}
                        onOpenPens={() => openPensFor(m)}
                      />
                    ))}
                  </div>
                </div>

                {/* Linhas horizontais */}
                <svg
                  key={tick}
                  className="pointer-events-none absolute inset-0"
                  width={containerRef.current?.scrollWidth ?? 1200}
                  height={containerRef.current?.scrollHeight ?? 500}
                >
                  <path
                    d={makePath(getCenterRight(qlRefs[0]), getCenterLeft(slRef))}
                    stroke="#111827" strokeWidth="4" fill="none"
                  />
                  <path
                    d={makePath(getCenterRight(qlRefs[1]), getCenterLeft(slRef))}
                    stroke="#111827" strokeWidth="4" fill="none"
                  />
                  <path
                    d={makePath(getCenterRight(slRef), getCenterLeft(finalRef))}
                    stroke="#111827" strokeWidth="4" fill="none"
                  />
                  <path
                    d={makePath(getCenterRight(finalRef), getCenterLeft(srRef))}
                    stroke="#111827" strokeWidth="4" fill="none"
                  />
                  <path
                    d={makePath(getCenterRight(srRef), getCenterLeft(qrRefs[0]))}
                    stroke="#111827" strokeWidth="4" fill="none"
                  />
                  <path
                    d={makePath(getCenterRight(srRef), getCenterLeft(qrRefs[1]))}
                    stroke="#111827" strokeWidth="4" fill="none"
                  />
                </svg>
              </div>
            </div>
          )}

          {/* Mobile: funil */}
          {isMobile && <VerticalBracket />}
        </>
      )}

      {/* Modal de Pênaltis */}
      <Modal
        open={penModal.open}
        onClose={() => setPenModal({ open: false, match: null })}
      >
        {penModal.match && (
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Pênaltis — Jogo #{penModal.match.id}
            </h3>
            <div className="space-y-4">
              <PenRow
                label={penModal.match.timeA}
                arr={penModal.match.pA}
                onClick={(i) => toggleKick("A", i)}
              />
              <PenRow
                label={penModal.match.timeB}
                arr={penModal.match.pB}
                onClick={(i) => toggleKick("B", i)}
              />
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2 justify-between">
              <div className="flex gap-2">
                <button
                  onClick={clearPens}
                  className="px-3 py-2 rounded-lg bg-gray-200 text-black"
                >
                  Limpar (volta p/ 5)
                </button>
                <button
                  onClick={removeSudden}
                  className="px-3 py-2 rounded-lg bg-gray-200 text-black"
                >
                  Remover última rodada
                </button>
              </div>

              <div className="text-sm text-gray-700">
                {(() => {
                  const m = penModal.match;
                  const sA = pensSum(m.pA);
                  const sB = pensSum(m.pB);
                  const filled = allFilled(m.pA) && allFilled(m.pB);
                  if (!filled) return "Marque todas as cobranças desta série.";
                  if (m.pA.length < 5) return "São necessárias pelo menos 5 cobranças.";
                  if (sA === sB)
                    return (
                      <>
                        Empate {sA}×{sB} — adicione <strong>morte súbita</strong>.
                      </>
                    );
                  return sA > sB
                    ? `Vencedor: ${m.timeA} (${sA}×${sB})`
                    : `Vencedor: ${m.timeB} (${sB}×${sA})`;
                })()}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={addSudden}
                  className="px-3 py-2 rounded-lg bg-black text-white"
                >
                  Adicionar morte súbita
                </button>
                <button
                  onClick={savePens}
                  disabled={!canSavePens()}
                  className="px-4 py-2 rounded-lg bg-violet-600 text-white disabled:opacity-50"
                >
                  Salvar pênaltis
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
