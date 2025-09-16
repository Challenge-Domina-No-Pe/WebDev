import { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContexts";

// Ícones SVG
const ChevronDown = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronRight = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const MenuIcon = ({ size = 28 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width={size} height={size}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const XIcon = ({ size = 28 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width={size} height={size}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-house-icon lucide-house"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
  </svg>
);

const TrophyIcon = ({className = ""}) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0" />
</svg>

);

const ClipboardIcon = () => (
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clipboard-list-icon lucide-clipboard-list"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/></svg>);

const ListaJogos = ({className = ""}) => (
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clipboard-list-icon lucide-clipboard-list" className = {className}><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/></svg>);


const SoccerBallIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-globe-icon lucide-globe"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
);

const ChartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chart-column-increasing-icon lucide-chart-column-increasing"><path d="M13 17V9"/><path d="M18 17V5"/><path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="M8 17v-3"/></svg>
);

const CameraIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h2l2-3h10l2 3h2v13H3V7z" />
    <circle cx="12" cy="13" r="3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const NewsIcon = () => (
 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-newspaper-icon lucide-newspaper"><path d="M15 18h-5"/><path d="M18 14h-8"/><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-4 0v-9a2 2 0 0 1 2-2h2"/><rect width="8" height="4" x="10" y="6" rx="1"/></svg>
);

const PeneirasIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-footprints-icon lucide-footprints"><path d="M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5c0 3.11-2 5.66-2 8.68V16a2 2 0 1 1-4 0Z"/><path d="M20 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C14.63 6 14 7.8 14 9.5c0 3.11 2 5.66 2 8.68V20a2 2 0 1 0 4 0Z"/><path d="M16 17h4"/><path d="M4 13h4"/></svg>
);

const EscolinhasIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-open-icon lucide-book-open"><path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/></svg>
);

const AboutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-info-icon lucide-info"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
);

const ContactIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mail-icon lucide-mail"><path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"/><rect x="2" y="4" width="20" height="16" rx="2"/></svg>

);
const LogoutIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"> <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/> <path d="M16 17l5-5-5-5"/> <path d="M21 12H9"/> </svg> );

export default function Sidebar() {
  const { logout} = useAuth();
  const navigate = useNavigate();
  const [isCopaOpen, setIsCopaOpen] = useState(false);
  const [isPinned, setIsPinned] = useState(true);
  const [ setIsHovered] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [openCompetitions, setOpenCompetitions] = useState({}); // controla quais competições estão abertas
  const sidebarRef = useRef(null);

  const activeLinkStyle = { backgroundColor: "#5b21b6", fontWeight: "bold" };

  const handleLogout = async () => {
    try {
      await logout(); 
      navigate('/login'); 
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (isMobileOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsMobileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileOpen]);

  const toggleCompetition = (id) => {
    setOpenCompetitions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return ( 
<> 
{/* Mobile Header */} 
<div className="md:hidden flex items-center justify-between p-3 bg-[#7c3fb9] text-white"> {/* <h1 className="font-bold text-lg">Domina no Pé</h1> <button onClick={() => setIsMobileOpen(!isMobileOpen)}> {isMobileOpen ? <XIcon /> : <MenuIcon />} </button> */} </div> {isMobileOpen && <div className="fixed inset-0 bg-opacity-40 z-30 md:hidden"></div>}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
  onMouseEnter={() => setIsHovered(true)}
  onMouseLeave={() => setIsHovered(false)}
  className={`flex-shrink-0 bg-[#7c3fb9] text-white flex flex-col min-h-full z-40 transition-all duration-300
    ${isMobileOpen ? "absolute inset-0 w-64 top-0" : isPinned ? "w-60" : "w-16"}`}
>
  {/* Desktop Header */}
  <div className="hidden md:flex items-center justify-between p-3">
    <span className="font-bold"></span>
    <button className="text-white" onClick={() => setIsPinned(!isPinned)}>
      {isPinned ? <XIcon size={20} /> : <MenuIcon size={20} />}
    </button>
    </div>

        <div className="flex-1 p-3 overflow-y-auto">
          <style>{`div::-webkit-scrollbar { display: none; }`}</style>
          <nav className="flex flex-col gap-2">
            <NavLink to="/" style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
              className="flex items-center gap-3 p-3 rounded-md hover:bg-purple-800 transition-colors">
              <HomeIcon />
              {(isPinned || isMobileOpen) && <span>Home</span>}
            </NavLink>

            {/* Copa PAB */}
            <div>
              <div className="flex items-center cursor-pointer"
                onClick={() => setIsCopaOpen(!isCopaOpen)}>
                <div className="flex items-center gap-3 p-3 rounded-md hover:bg-purple-800 transition-colors flex-1">
                  <TrophyIcon className={`${isPinned || isMobileOpen ? "w-6 h-6" : "w-4 h-4"} transition-all duration-300`} />
                  {(isPinned || isMobileOpen) && <span>Copa PAB</span>}
                </div>
                {(isPinned || isMobileOpen) && (isCopaOpen ? <ChevronDown /> : <ChevronRight />)}
              </div>

              {isCopaOpen && (isPinned || isMobileOpen) && (
                <div className="ml-4 mt-2 flex flex-col gap-2">
                  {[
                    { id: 1, name: "Competição 1" },
                  ].map((comp) => (
                    <div key={comp.id}>
                      <div
                        className="flex items-center justify-between cursor-pointer p-2 rounded-md hover:bg-purple-700"
                        onClick={() => toggleCompetition(comp.id)}
                      >
                        <span className="font-semibold">{comp.name}</span>
                        {openCompetitions[comp.id] ? <ChevronDown /> : <ChevronRight />}
                      </div>

                      {openCompetitions[comp.id] && (
                        <div className="ml-4 flex flex-col gap-2 mt-1">
                          <NavLink to={`/copa-pab/competicao${comp.id}/tabela`} className="flex items-center gap-2 p-2 rounded-md hover:bg-purple-700 transition-colors">
                            <ClipboardIcon /> Tabela
                          </NavLink>
                          <NavLink to={`/copa-pab/competicao${comp.id}/times`} className="flex items-center gap-2 p-2 rounded-md hover:bg-purple-700 transition-colors">
                            <SoccerBallIcon /> Times
                          </NavLink>
                          <NavLink to={`/copa-pab/competicao${comp.id}/estatisticas`} className="flex items-center gap-2 p-2 rounded-md hover:bg-purple-700 transition-colors">
                            <ChartIcon /> Estatísticas
                          </NavLink>
                          <NavLink to={`/copa-pab/competicao${comp.id}/fotos`} className="flex items-center gap-2 p-2 rounded-md hover:bg-purple-700 transition-colors">
                            <CameraIcon /> Fotos
                          </NavLink>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Outros links */}
            <NavLink to="/noticias" style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
              className="flex items-center gap-3 p-3 rounded-md hover:bg-purple-800 transition-colors">
              <NewsIcon />
              {(isPinned || isMobileOpen) && <span>Notícias</span>}
            </NavLink>

            <NavLink to="/jogos" style={({ isActive }) => (isActive ? activeLinkStyle : undefined)} className="flex items-center gap-2 p-2 rounded-md hover:bg-purple-700 transition-colors">
              <ListaJogos className={`${isPinned || isMobileOpen ? "w-6 h-6" : "w-4 h-4"} transition-all duration-300`}/> 
              {(isPinned || isMobileOpen) && <span>Lista de Jogos</span>}
            </NavLink>

            <NavLink to="/peneiras" style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
              className="flex items-center gap-3 p-3 rounded-md hover:bg-purple-800 transition-colors">
              <PeneirasIcon />
              {(isPinned || isMobileOpen) && <span>Peneiras</span>}
            </NavLink>

            <NavLink to="/escolinhas" style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
              className="flex items-center gap-3 p-3 rounded-md hover:bg-purple-800 transition-colors">
              <EscolinhasIcon />
              {(isPinned || isMobileOpen) && <span>Escolinhas</span>}
            </NavLink>

            <NavLink to="/sobre-nos" style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
              className="flex items-center gap-3 p-3 rounded-md hover:bg-purple-800 transition-colors">
              <AboutIcon />
              {(isPinned || isMobileOpen) && <span>Sobre</span>}
            </NavLink>

            <NavLink to="/contato" style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
              className="flex items-center gap-3 p-3 rounded-md hover:bg-purple-800 transition-colors">
              <ContactIcon />
              {(isPinned || isMobileOpen) && <span>Contato</span>}
            </NavLink>

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 p-3 mt-auto rounded-md bg-red-700 transition-colors"
            >
              <LogoutIcon />
              {(isPinned || isMobileOpen) && <span>Sair</span>}
            </button>
          </nav>
        </div>
      </aside>
    </>
  );
}