// src/pages/CopaPAB/Competicao1/Fotos.jsx
import { useEffect, useMemo, useRef, useState } from "react";

/* ----------------- Helpers de storage ----------------- */
const FALLBACK_TEAMS = {
  A: ["Time 1", "Time 2", "Time 3", "Time 4"],
  B: ["Time 5", "Time 6", "Time 7", "Time 8"],
  C: ["Time 9", "Time 10", "Time 11", "Time 12"],
  D: ["Time 13", "Time 14", "Time 15", "Time 16"],
};
// { [teamName]: Array<{id, url, caption, uploadedAt, cover?:boolean}> }
const FALLBACK_PHOTOS = {};

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

/* ----------------- UI básicos ----------------- */
function Field({ label, children, hint }) {
  return (
    <label className="block text-sm">
      <span className="text-gray-700">{label}</span>
      <div className="mt-1">{children}</div>
      {hint && <div className="text-xs text-gray-500 mt-1">{hint}</div>}
    </label>
  );
}
function TeamBadge({ name }) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("");
  return (
    <div className="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center text-sm font-bold">
      {initials || "T"}
    </div>
  );
}
function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="absolute inset-x-0 top-6 mx-auto max-w-5xl bg-white rounded-2xl shadow-xl p-4 md:p-6">
        {children}
      </div>
    </div>
  );
}

/* ----------------- Página ----------------- */
export default function FotosCompeticao1() {
  // Carrega times da tabela (se já existirem) ou fallback
  const [teams, setTeams] = useState(() => load("c1-teams", FALLBACK_TEAMS));
  // Álbuns por time
  const [photos, setPhotos] = useState(() => load("c1-photos", FALLBACK_PHOTOS));

  const [groupFilter, setGroupFilter] = useState("ALL"); // ALL | A | B | C | D
  const [q, setQ] = useState(""); // busca por nome do time
  const [selectedTeam, setSelectedTeam] = useState(null); // string (nome do time)
  const [urlToAdd, setUrlToAdd] = useState(""); // adicionar via URL
  const dropRef = useRef(null);

  // Salva mudanças no storage
  useEffect(() => save("c1-photos", photos), [photos]);

  // Reage à mudança externa dos times (caso você cadastre via outra página)
  useEffect(() => save("c1-teams", teams), [teams]);

  // Lista plana de times (com grupo)
  const teamList = useMemo(() => {
    const out = [];
    ["A", "B", "C", "D"].forEach((g) => {
      (teams[g] || []).forEach((name) => out.push({ group: g, name }));
    });
    return out;
  }, [teams]);

  const filtered = teamList.filter((t) => {
    const okGroup = groupFilter === "ALL" || t.group === groupFilter;
    const okText = t.name.toLowerCase().includes(q.trim().toLowerCase());
    return okGroup && okText;
  });

  const selectedAlbum = selectedTeam ? photos[selectedTeam] || [] : [];

  /* ----------------- Upload: arquivos locais → DataURL ----------------- */
  const handleFiles = async (fileList) => {
    if (!selectedTeam || !fileList?.length) return;
    const items = await Promise.all(
      [...fileList].map(
        (file) =>
          new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () =>
              resolve({
                id: crypto.randomUUID(),
                url: reader.result,
                caption: "",
                uploadedAt: new Date().toISOString(),
              });
            reader.readAsDataURL(file);
          })
      )
    );
    setPhotos((prev) => ({
      ...prev,
      [selectedTeam]: [...(prev[selectedTeam] || []), ...items],
    }));
  };

  // Drag & drop
  useEffect(() => {
    const el = dropRef.current;
    if (!el) return;
    const prevent = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };
    const onDrop = (e) => {
      prevent(e);
      if (e.dataTransfer.files && e.dataTransfer.files.length) {
        handleFiles(e.dataTransfer.files);
      }
    };
    ["dragenter", "dragover", "dragleave", "drop"].forEach((ev) =>
      el.addEventListener(ev, prevent)
    );
    el.addEventListener("drop", onDrop);

    return () => {
      ["dragenter", "dragover", "dragleave", "drop"].forEach((ev) =>
        el.removeEventListener(ev, prevent)
      );
      el.removeEventListener("drop", onDrop);
    };
  }, [selectedTeam]);

  /* ----------------- Adicionar por URL ----------------- */
  const addUrl = () => {
    if (!selectedTeam || !urlToAdd.trim()) return;
    const urls = urlToAdd
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    if (urls.length === 0) return;

    const items = urls.map((u) => ({
      id: crypto.randomUUID(),
      url: u,
      caption: "",
      uploadedAt: new Date().toISOString(),
    }));
    setPhotos((prev) => ({
      ...prev,
      [selectedTeam]: [...(prev[selectedTeam] || []), ...items],
    }));
    setUrlToAdd("");
  };

  /* ----------------- Editar/remover ----------------- */
  const setCaption = (id, caption) => {
    if (!selectedTeam) return;
    setPhotos((prev) => ({
      ...prev,
      [selectedTeam]: (prev[selectedTeam] || []).map((p) =>
        p.id === id ? { ...p, caption } : p
      ),
    }));
  };
  const removePhoto = (id) => {
    if (!selectedTeam) return;
    setPhotos((prev) => ({
      ...prev,
      [selectedTeam]: (prev[selectedTeam] || []).filter((p) => p.id !== id),
    }));
  };
  const setCover = (id) => {
    if (!selectedTeam) return;
    setPhotos((prev) => ({
      ...prev,
      [selectedTeam]: (prev[selectedTeam] || []).map((p) => ({
        ...p,
        cover: p.id === id,
      })),
    }));
  };

  /* ----------------- Lightbox ----------------- */
  const [lightbox, setLightbox] = useState(null); // {idx}
  const openLightbox = (idx) => setLightbox({ idx });
  const closeLightbox = () => setLightbox(null);
  const goPrev = () =>
    setLightbox((l) =>
      l ? { idx: Math.max(0, l.idx - 1) } : null
    );
  const goNext = () =>
    setLightbox((l) =>
      l ? { idx: Math.min(selectedAlbum.length - 1, l.idx + 1) } : null
    );

  /* ----------------- UI ----------------- */
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-black mb-4">Fotos • Competição 1</h1>

      {/* filtros topo */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex gap-2">
          {["ALL", "A", "B", "C", "D"].map((g) => (
            <button
              key={g}
              onClick={() => setGroupFilter(g)}
              className={`px-3 py-2 rounded-lg text-sm font-semibold border transition-colors ${
                groupFilter === g
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
            <path
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-4.35-4.35M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z"
            />
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar times */}
        <aside className="lg:col-span-4 xl:col-span-3 bg-gradient-to-b from-violet-600 to-purple-700 rounded-2xl p-4 text-white">
          <h2 className="font-semibold mb-3">Times</h2>
          <div className="space-y-2 max-h-[60vh] overflow-auto pr-1">
            {filtered.map((t) => (
              <button
                key={`${t.group}-${t.name}`}
                onClick={() => setSelectedTeam(t.name)}
                className={`w-full flex items-center gap-3 rounded-xl px-3 py-2 transition-colors ${
                  selectedTeam === t.name
                    ? "bg-white text-purple-800"
                    : "hover:bg-white/10"
                }`}
              >
                <TeamBadge name={t.name} />
                <div className="flex-1 text-left">
                  <div className="font-medium truncate">{t.name}</div>
                  <div
                    className={`text-xs ${
                      selectedTeam === t.name ? "text-purple-700" : "text-white/80"
                    }`}
                  >
                    Grupo {t.group} • {(photos[t.name] || []).length} fotos
                  </div>
                </div>
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="text-white/80 text-sm">Nenhum time encontrado.</div>
            )}
          </div>
        </aside>

        {/* Conteúdo do álbum */}
        <section className="lg:col-span-8 xl:col-span-9">
          {!selectedTeam ? (
            <div className="rounded-2xl border border-dashed p-10 text-center text-gray-600">
              Selecione um <span className="font-semibold">time</span> ao lado para
              gerenciar as fotos do álbum.
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <TeamBadge name={selectedTeam} />
                  <div>
                    <h2 className="text-xl font-semibold">{selectedTeam}</h2>
                    <div className="text-sm text-gray-500">
                      {(photos[selectedTeam] || []).length} foto(s) no álbum
                    </div>
                  </div>
                </div>
              </div>

              {/* Área de upload */}
              <div
                ref={dropRef}
                className="rounded-2xl border-2 border-dashed border-gray-300 p-4 md:p-6 mb-4"
              >
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <Field
                      label="Enviar arquivos (arraste e solte ou escolha do dispositivo)"
                      hint="Formatos comuns de imagem. Os arquivos ficam salvos localmente (localStorage) apenas para testes."
                    >
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleFiles(e.target.files)}
                        className="block w-full rounded-lg border px-3 py-2"
                      />
                    </Field>
                  </div>
                  <div className="flex-1">
                    <Field
                      label="Adicionar por URL (uma por linha)"
                      hint="Cole links de imagens hospedadas (ex.: CDN, Google Photos compartilhado, etc.)"
                    >
                      <textarea
                        rows={3}
                        className="w-full rounded-lg border px-3 py-2"
                        value={urlToAdd}
                        onChange={(e) => setUrlToAdd(e.target.value)}
                        placeholder="https://exemplo.com/foto1.jpg
https://exemplo.com/foto2.png"
                      />
                    </Field>
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={addUrl}
                        className="px-4 py-2 rounded-lg bg-black text-white"
                      >
                        Adicionar URLs
                      </button>
                      <button
                        onClick={() => setUrlToAdd("")}
                        className="px-4 py-2 rounded-lg bg-gray-200 text-black"
                      >
                        Limpar
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Grid de fotos */}
              {selectedAlbum.length === 0 ? (
                <div className="rounded-xl border p-8 text-center text-gray-500">
                  Nenhuma foto neste álbum ainda.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {selectedAlbum.map((p, idx) => (
                    <div
                      key={p.id}
                      className="group relative rounded-xl overflow-hidden bg-gray-100 border"
                    >
                      <button
                        className="block w-full aspect-[4/3] overflow-hidden"
                        onClick={() => openLightbox(idx)}
                        title="Clique para ampliar"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={p.url}
                          alt={p.caption || "Foto"}
                          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform"
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://via.placeholder.com/400x300?text=Imagem+indisponível";
                          }}
                        />
                      </button>

                      <div className="absolute left-2 top-2">
                        {p.cover && (
                          <span className="px-2 py-1 text-[10px] font-semibold uppercase bg-black text-white rounded">
                            Capa
                          </span>
                        )}
                      </div>

                      <div className="p-2 bg-white">
                        <input
                          className="w-full text-sm rounded border px-2 py-1"
                          placeholder="Legenda (opcional)"
                          value={p.caption}
                          onChange={(e) => setCaption(p.id, e.target.value)}
                        />
                        <div className="flex items-center justify-between mt-2">
                          <button
                            onClick={() => setCover(p.id)}
                            className="text-xs px-2 py-1 rounded bg-black text-white"
                          >
                            Definir como capa
                          </button>
                          <button
                            onClick={() => removePhoto(p.id)}
                            className="text-xs px-2 py-1 rounded bg-red-600 text-white"
                          >
                            Remover
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </section>
      </div>

      {/* Lightbox */}
      <Modal open={!!lightbox && selectedAlbum.length > 0} onClose={closeLightbox}>
        {lightbox && selectedAlbum[lightbox.idx] && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="font-semibold">
                {selectedTeam} • {lightbox.idx + 1}/{selectedAlbum.length}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={goPrev}
                  className="px-3 py-1 rounded bg-gray-200 text-sm"
                >
                  ◀ Anterior
                </button>
                <button
                  onClick={goNext}
                  className="px-3 py-1 rounded bg-gray-200 text-sm"
                >
                  Próxima ▶
                </button>
                <button onClick={closeLightbox} className="px-3 py-1 rounded bg-black text-white text-sm">
                  Fechar
                </button>
              </div>
            </div>
            <div className="w-full overflow-hidden rounded-xl bg-gray-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedAlbum[lightbox.idx].url}
                alt={selectedAlbum[lightbox.idx].caption || "Foto"}
                className="w-full h-auto max-h-[70vh] object-contain"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://via.placeholder.com/800x600?text=Imagem+indisponível";
                }}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Legenda:</span>
              <input
                className="flex-1 rounded border px-2 py-1"
                value={selectedAlbum[lightbox.idx].caption}
                onChange={(e) =>
                  setCaption(selectedAlbum[lightbox.idx].id, e.target.value)
                }
                placeholder="Adicione uma legenda…"
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
