import React, { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  SquarePen,
  Trash2,
  Plus,
  X,
} from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import SearchBar from "../components/SearchBar";
import DateFilter from "../components/DateFilter";
import Table from "../components/Table";
import CustomAlert from "../components/CustomAlert";
import "../styles/Chicken.css";

// --- DATOS DE PRUEBA ---
const GALLINAS_DATA = [
  { id: 1, lote: "75", perdidas: "20", enfermas: "5", fechaInicio: "2024-06-30", fechaFin: "2026-06-30", semanasVida: "17" },
  { id: 2, lote: "52", perdidas: "38", enfermas: "3", fechaInicio: "2020-11-10", fechaFin: "2022-11-10", semanasVida: "23" },
  { id: 3, lote: "70", perdidas: "65", enfermas: "4", fechaInicio: "2021-10-23", fechaFin: "2023-10-23", semanasVida: "47" },
];

const HUEVOS_DATA = [
  { id: 1, total: "285", jumbo: "20", grande: "207", mediano: "53", pequeno: "1", perdidos: "0", fecha: "2026-02-23" },
  { id: 2, total: "372", jumbo: "20", grande: "304", mediano: "32", pequeno: "2", perdidos: "5", fecha: "2026-02-24" },
  { id: 3, total: "511", jumbo: "18", grande: "402", mediano: "63", pequeno: "3", perdidos: "2", fecha: "2026-02-26" },
];

const ChickenPage = () => {
  // --- ESTADOS GLOBALES ---
  const [gallinas, setGallinas] = useState(GALLINAS_DATA);
  const [huevos, setHuevos] = useState(HUEVOS_DATA);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateDesde, setDateDesde] = useState("");
  const [dateHasta, setDateHasta] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // --- ESTADOS DE MODALES ---
  const [isGallinaModalOpen, setIsGallinaModalOpen] = useState(false);
  const [isHuevoModalOpen, setIsHuevoModalOpen] = useState(false);

  // --- ESTADOS DE FORMULARIOS ---
  const [gallinaForm, setGallinaForm] = useState({
    id: "", lote: "", perdidas: "", enfermas: "", semanasVida: "", fechaInicio: "", fechaFin: ""
  });
  
  const [huevoForm, setHuevoForm] = useState({
    id: "", jumbo: "", grande: "", mediano: "", pequeno: "", total: "", perdidos: "", fecha: ""
  });

  // --- ALERTA ---
  const [alert, setAlert] = useState({
    isOpen: false, type: "success", title: "", message: "", showCancel: false,
    confirmText: "Aceptar", cancelText: "Cancelar", onConfirm: null, onCancel: null,
  });

  const closeAlert = () => setAlert((prev) => ({ ...prev, isOpen: false, onConfirm: null, onCancel: null }));

  const normalizeText = (value) => String(value).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // --- FILTROS ---
  const filteredGallinas = useMemo(() => {
    return gallinas.filter((g) => {
      const matchesSearch = searchTerm.trim() === "" || normalizeText(g.lote).includes(normalizeText(searchTerm));
      const matchesDate = (!dateDesde || g.fechaInicio >= dateDesde) && (!dateHasta || g.fechaInicio <= dateHasta);
      return matchesSearch && matchesDate;
    });
  }, [gallinas, searchTerm, dateDesde, dateHasta]);

  const filteredHuevos = useMemo(() => {
    return huevos.filter((h) => {
      const matchesSearch = searchTerm.trim() === "" || normalizeText(h.total).includes(normalizeText(searchTerm));
      const matchesDate = (!dateDesde || h.fecha >= dateDesde) && (!dateHasta || h.fecha <= dateHasta);
      return matchesSearch && matchesDate;
    });
  }, [huevos, searchTerm, dateDesde, dateHasta]);

  const paginatedGallinas = filteredGallinas.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const paginatedHuevos = filteredHuevos.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // ==========================================
  // LÓGICA DE GALLINAS
  // ==========================================
  const openGallinaModal = (gallina = null) => {
    setGallinaForm(gallina ? { ...gallina } : { id: "", lote: "", perdidas: "", enfermas: "", semanasVida: "", fechaInicio: "", fechaFin: "" });
    setIsGallinaModalOpen(true);
  };
  
  const closeGallinaModal = () => setIsGallinaModalOpen(false);

  const validateGallina = (form) => {
    if (!form.lote || !form.perdidas || !form.enfermas || !form.semanasVida || !form.fechaInicio || !form.fechaFin) {
      return "Por favor completa todos los campos del lote de gallinas.";
    }
    return "";
  };

  const handleGallinaSubmit = (e) => {
    e.preventDefault();
    const error = validateGallina(gallinaForm);
    if (error) {
      setAlert({ isOpen: true, type: "error", title: "Campos vacíos", message: error, showCancel: false, onConfirm: closeAlert });
      return;
    }

    setGallinas((prev) => gallinaForm.id ? prev.map(item => item.id === gallinaForm.id ? gallinaForm : item) : [{...gallinaForm, id: prev.length > 0 ? Math.max(...prev.map(i => i.id)) + 1 : 1}, ...prev]);
    closeGallinaModal();
    setAlert({ isOpen: true, type: "success", title: "Éxito", message: "Lote de gallinas guardado correctamente.", showCancel: false, onConfirm: closeAlert });
  };

  const handleDeleteGallina = (gallina) => {
    setAlert({
      isOpen: true, type: "warning", title: "Eliminar Registro", message: `¿Estás seguro de eliminar el lote #${gallina.lote}?`, showCancel: true, confirmText: "Eliminar", cancelText: "Cancelar",
      onConfirm: () => {
        setGallinas((prev) => prev.filter((item) => item.id !== gallina.id));
        setAlert({ isOpen: true, type: "success", title: "Eliminado", message: "El lote ha sido eliminado.", showCancel: false, onConfirm: closeAlert });
      },
      onCancel: closeAlert,
    });
  };

  // ==========================================
  // LÓGICA DE HUEVOS
  // ==========================================
  const openHuevoModal = (huevo = null) => {
    setHuevoForm(huevo ? { ...huevo } : { id: "", jumbo: "", grande: "", mediano: "", pequeno: "", total: "", perdidos: "", fecha: "" });
    setIsHuevoModalOpen(true);
  };
  
  const closeHuevoModal = () => setIsHuevoModalOpen(false);

  const validateHuevo = (form) => {
    if (!form.jumbo || !form.grande || !form.mediano || !form.pequeno || !form.total || !form.perdidos || !form.fecha) {
      return "Por favor completa todos los campos del registro de huevos.";
    }
    return "";
  };

  const handleHuevoSubmit = (e) => {
    e.preventDefault();
    const error = validateHuevo(huevoForm);
    if (error) {
      setAlert({ isOpen: true, type: "error", title: "Campos vacíos", message: error, showCancel: false, onConfirm: closeAlert });
      return;
    }

    setHuevos((prev) => huevoForm.id ? prev.map(item => item.id === huevoForm.id ? huevoForm : item) : [{...huevoForm, id: prev.length > 0 ? Math.max(...prev.map(i => i.id)) + 1 : 1}, ...prev]);
    closeHuevoModal();
    setAlert({ isOpen: true, type: "success", title: "Éxito", message: "Registro de huevos guardado correctamente.", showCancel: false, onConfirm: closeAlert });
  };

  const handleDeleteHuevo = (huevo) => {
    setAlert({
      isOpen: true, type: "warning", title: "Eliminar Registro", message: `¿Estás seguro de eliminar el registro del día ${huevo.fecha}?`, showCancel: true, confirmText: "Eliminar", cancelText: "Cancelar",
      onConfirm: () => {
        setHuevos((prev) => prev.filter((item) => item.id !== huevo.id));
        setAlert({ isOpen: true, type: "success", title: "Eliminado", message: "El registro ha sido eliminado.", showCancel: false, onConfirm: closeAlert });
      },
      onCancel: closeAlert,
    });
  };

  // ==========================================
  // COLUMNAS Y RENDERIZADO
  // ==========================================
  const gallinasColumns = [
    { key: "id", label: "ID" }, { key: "lote", label: "Lote de gallinas" }, { key: "perdidas", label: "Gallinas perdidas" },
    { key: "enfermas", label: "Gallinas enfermas" }, { key: "fechaInicio", label: "Fecha de Inicio" }, { key: "fechaFin", label: "Fecha Fin" },
    { key: "semanasVida", label: "Semanas de vida" }, { key: "acciones", label: "Acciones" },
  ];

  const huevosColumns = [
    { key: "id", label: "ID" }, { key: "total", label: "Huevos total" }, { key: "jumbo", label: "Jumbo" },
    { key: "grande", label: "Grande" }, { key: "mediano", label: "Mediano" }, { key: "pequeno", label: "Pequeño" },
    { key: "perdidos", label: "Huevos perdidos" }, { key: "fecha", label: "Fecha" }, { key: "acciones", label: "Acciones" },
  ];

  const tableDataGallinas = paginatedGallinas.map(g => ({
    ...g,
    acciones: (
      <div className="chicken-actions">
        <button type="button" className="chicken-icon-btn edit" onClick={() => openGallinaModal(g)}><SquarePen size={18} /></button>
        <button type="button" className="chicken-icon-btn delete" onClick={() => handleDeleteGallina(g)}><Trash2 size={18} /></button>
      </div>
    )
  }));

  const tableDataHuevos = paginatedHuevos.map(h => ({
    ...h,
    acciones: (
      <div className="chicken-actions">
        <button type="button" className="chicken-icon-btn edit" onClick={() => openHuevoModal(h)}><SquarePen size={18} /></button>
        <button type="button" className="chicken-icon-btn delete" onClick={() => handleDeleteHuevo(h)}><Trash2 size={18} /></button>
      </div>
    )
  }));

  return (
    <DashboardLayout>
      <div className="chicken-page">
        <div className="chicken-page-header">
          <h1>Control de Producción</h1>
          <p>Administra los lotes de gallinas y el registro diario de huevos.</p>
        </div>

        {/* TOOLBAR SUPERIOR */}
        <div className="chicken-toolbar">
          <div className="chicken-toolbar-search">
            <SearchBar value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Búsqueda general..." />
          </div>
          <div className="chicken-toolbar-date">
            <DateFilter label="Desde" value={dateDesde} onChange={(e) => setDateDesde(e.target.value)} />
          </div>
          <div className="chicken-toolbar-date">
            <DateFilter label="Hasta" value={dateHasta} onChange={(e) => setDateHasta(e.target.value)} />
          </div>
        </div>

        {/* CONTENEDOR DE TABLAS (APILADAS VERTICALMENTE) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          {/* TABLA 1: GALLINAS */}
          <div className="chicken-table-card">
            <div className="chicken-table-topbar">
              <div className="chicken-left-actions">
                <button type="button" className="chicken-add-btn" onClick={() => openGallinaModal()}>
                  <Plus size={18} /> Agregar Lote
                </button>
              </div>
              <div className="chicken-right-actions">
                 <span className="pagination-info">Lotes Activos</span>
              </div>
            </div>
            <div className="chicken-table-wrapper">
              <Table columns={gallinasColumns} data={tableDataGallinas} emptyMessage="No hay registros de gallinas." />
            </div>
            <div className="chicken-pagination">
              <div className="chicken-pagination-info">Mostrando {paginatedGallinas.length} de {filteredGallinas.length} registros</div>
              <button className="chicken-page-arrow" disabled><ChevronLeft size={18} /></button>
              <div className="chicken-page-numbers"><span className="active">1</span></div>
              <button className="chicken-page-arrow" disabled><ChevronRight size={18} /></button>
            </div>
          </div>

          {/* TABLA 2: HUEVOS */}
          <div className="chicken-table-card">
            <div className="chicken-table-topbar">
              <div className="chicken-left-actions">
                <button type="button" className="chicken-add-btn" onClick={() => openHuevoModal()}>
                  <Plus size={18} /> Agregar Huevos
                </button>
              </div>
              <div className="chicken-right-actions">
                <span className="pagination-info">Registro Diario</span>
              </div>
            </div>
            <div className="chicken-table-wrapper">
              <Table columns={huevosColumns} data={tableDataHuevos} emptyMessage="No hay registros de huevos." />
            </div>
            <div className="chicken-pagination">
              <div className="chicken-pagination-info">Mostrando {paginatedHuevos.length} de {filteredHuevos.length} registros</div>
              <button className="chicken-page-arrow" disabled><ChevronLeft size={18} /></button>
              <div className="chicken-page-numbers"><span className="active">1</span></div>
              <button className="chicken-page-arrow" disabled><ChevronRight size={18} /></button>
            </div>
          </div>

        </div>

        {/* ================= MODALES ================= */}
        
        {/* MODAL GALLINAS */}
        {isGallinaModalOpen && (
          <div className="chicken-modal-overlay" onClick={closeGallinaModal}>
            <div className="chicken-modal chicken-create-modal" onClick={(e) => e.stopPropagation()}>
              <button type="button" className="chicken-modal-close" onClick={closeGallinaModal}><X size={20} /></button>
              <div className="chicken-modal-header">
                <h2>INGRESAR GALLINAS</h2>
              </div>
              <form className="chicken-modal-form" onSubmit={handleGallinaSubmit}>
                <div className="chicken-modal-field"><label>Lote de gallinas</label><input name="lote" type="text" value={gallinaForm.lote} onChange={(e) => setGallinaForm({...gallinaForm, lote: e.target.value})} /></div>
                <div className="chicken-modal-field"><label>Gallinas perdidas</label><input name="perdidas" type="text" value={gallinaForm.perdidas} onChange={(e) => setGallinaForm({...gallinaForm, perdidas: e.target.value})} /></div>
                <div className="chicken-modal-field"><label>Gallinas enfermas</label><input name="enfermas" type="text" value={gallinaForm.enfermas} onChange={(e) => setGallinaForm({...gallinaForm, enfermas: e.target.value})} /></div>
                <div className="chicken-modal-field"><label>Semanas de vida</label><input name="semanasVida" type="text" value={gallinaForm.semanasVida} onChange={(e) => setGallinaForm({...gallinaForm, semanasVida: e.target.value})} /></div>
                <div className="chicken-modal-field"><label>Fecha inicio</label><input name="fechaInicio" type="date" value={gallinaForm.fechaInicio} onChange={(e) => setGallinaForm({...gallinaForm, fechaInicio: e.target.value})} /></div>
                <div className="chicken-modal-field"><label>Fecha fin</label><input name="fechaFin" type="date" value={gallinaForm.fechaFin} onChange={(e) => setGallinaForm({...gallinaForm, fechaFin: e.target.value})} /></div>
                <div className="chicken-modal-actions chicken-create-actions">
                  <button type="submit" className="chicken-modal-btn chicken-create-submit">Guardar</button>
                  <button type="button" className="chicken-modal-btn chicken-create-cancel" onClick={closeGallinaModal}>Cancelar</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL HUEVOS */}
        {isHuevoModalOpen && (
          <div className="chicken-modal-overlay" onClick={closeHuevoModal}>
            <div className="chicken-modal chicken-create-modal" onClick={(e) => e.stopPropagation()}>
              <button type="button" className="chicken-modal-close" onClick={closeHuevoModal}><X size={20} /></button>
              <div className="chicken-modal-header">
                <h2>INGRESAR HUEVOS</h2>
              </div>
              <form className="chicken-modal-form" onSubmit={handleHuevoSubmit}>
                <div className="chicken-modal-field"><label>Jumbo</label><input name="jumbo" type="number" value={huevoForm.jumbo} onChange={(e) => setHuevoForm({...huevoForm, jumbo: e.target.value})} /></div>
                <div className="chicken-modal-field"><label>Grande</label><input name="grande" type="number" value={huevoForm.grande} onChange={(e) => setHuevoForm({...huevoForm, grande: e.target.value})} /></div>
                <div className="chicken-modal-field"><label>Mediano</label><input name="mediano" type="number" value={huevoForm.mediano} onChange={(e) => setHuevoForm({...huevoForm, mediano: e.target.value})} /></div>
                <div className="chicken-modal-field"><label>Pequeño</label><input name="pequeno" type="number" value={huevoForm.pequeno} onChange={(e) => setHuevoForm({...huevoForm, pequeno: e.target.value})} /></div>
                <div className="chicken-modal-field"><label>Huevos Total</label><input name="total" type="number" value={huevoForm.total} onChange={(e) => setHuevoForm({...huevoForm, total: e.target.value})} /></div>
                <div className="chicken-modal-field"><label>Huevos Perdidos</label><input name="perdidos" type="number" value={huevoForm.perdidos} onChange={(e) => setHuevoForm({...huevoForm, perdidos: e.target.value})} /></div>
                <div className="chicken-modal-field"><label>Fecha</label><input name="fecha" type="date" value={huevoForm.fecha} onChange={(e) => setHuevoForm({...huevoForm, fecha: e.target.value})} /></div>
                <div className="chicken-modal-actions chicken-create-actions">
                  <button type="submit" className="chicken-modal-btn chicken-create-submit">Guardar</button>
                  <button type="button" className="chicken-modal-btn chicken-create-cancel" onClick={closeHuevoModal}>Cancelar</button>
                </div>
              </form>
            </div>
          </div>
        )}

        <CustomAlert
          isOpen={alert.isOpen} type={alert.type} title={alert.title} message={alert.message}
          showCancel={alert.showCancel} confirmText={alert.confirmText} cancelText={alert.cancelText}
          onConfirm={alert.onConfirm || closeAlert} onCancel={alert.onCancel || closeAlert}
        />
      </div>
    </DashboardLayout>
  );
};

export default ChickenPage;