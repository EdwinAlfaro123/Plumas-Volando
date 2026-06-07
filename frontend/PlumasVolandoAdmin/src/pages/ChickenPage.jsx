import React, { useMemo, useState, useEffect } from "react";
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
import api from "../services/api"

const ChickenPage = () => {
  const [gallinas, setGallinas] = useState([]);
  const [huevos, setHuevos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateDesde, setDateDesde] = useState("");
  const [dateHasta, setDateHasta] = useState("");

  const itemsPerPage = 5;

  const [isGallinaModalOpen, setIsGallinaModalOpen] = useState(false);
  const [isHuevoModalOpen, setIsHuevoModalOpen] = useState(false);
  
  const [isEditingGallina, setIsEditingGallina] = useState(false);
  const [isEditingHuevo, setIsEditingHuevo] = useState(false);
  
  const [currentPageGallinas, setCurrentPageGallinas] = useState(1);
  const [currentPageHuevos, setCurrentPageHuevos] = useState(1);

  const [gallinaForm, setGallinaForm] = useState({
    id: "", lote: "", perdidas: "", enfermas: "", semanasVida: "", fechaInicio: "", fechaFin: ""
  });
  
  const [huevoForm, setHuevoForm] = useState({
    id: "", jumbo: "", grande: "", mediano: "", pequeno: "", total: "", perdidos: "", fecha: ""
  });

  const [alert, setAlert] = useState({
    isOpen: false, type: "success", title: "", message: "", showCancel: false,
    confirmText: "Aceptar", cancelText: "Cancelar", onConfirm: null, onCancel: null,
  });

  useEffect(() => {
    const total =
      Number(huevoForm.jumbo || 0) +
      Number(huevoForm.grande || 0) +
      Number(huevoForm.mediano || 0) +
      Number(huevoForm.pequeno || 0);

    setHuevoForm((prev) => ({
      ...prev,
      total: total.toString(),
    }));
  }, [
    huevoForm.jumbo,
    huevoForm.grande,
    huevoForm.mediano,
    huevoForm.pequeno,
  ]);

  const closeAlert = () => setAlert((prev) => ({ ...prev, isOpen: false, onConfirm: null, onCancel: null }));

  const loadGallinas = async () => {
    try {
      const response = await api.get("/chicken");

      const formattedData = response.data.map((item) => ({
        id: item._id,
        lote: item.quantityChickens,
        perdidas: item.chickensLosts,
        enfermas: item.quantitySick,
        semanasVida: item.weeksLife,
        fechaInicio: item.startDate
          ? item.startDate.split("T")[0]
          : "",
        fechaFin: item.endDate
          ? item.endDate.split("T")[0]
          : "",
      }));

      setGallinas(formattedData);
    } catch (error) {
      console.error("Error cargando gallinas:", error);
    }
  };

  const handleCreateGallina = async (e) => {
    e.preventDefault();

    try {
      await api.post("/chicken", {
        quantityChickens: Number(gallinaForm.lote),
        chickensLosts: Number(gallinaForm.perdidas),
        quantitySick: Number(gallinaForm.enfermas),
        weeksLife: Number(gallinaForm.semanasVida),
        startDate: gallinaForm.fechaInicio,
        endDate: gallinaForm.fechaFin,
      });

      await loadGallinas();

      closeGallinaModal();

      setAlert({
        isOpen: true,
        type: "success",
        title: "Registro creado",
        message: "El lote de gallinas fue registrado correctamente.",
        showCancel: false,
        confirmText: "Aceptar",
        onConfirm: closeAlert,
      });
    } catch (error) {
      console.error(error);

      setAlert({
        isOpen: true,
        type: "error",
        title: "Error",
        message:
          error.response?.data?.message ||
          "No se pudo registrar el lote.",
        showCancel: false,
        confirmText: "Aceptar",
        onConfirm: closeAlert,
      });
    }
  };

  const normalizeText = (value) => String(value).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

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

  const paginatedGallinas = filteredGallinas.slice(
    (currentPageGallinas - 1) * itemsPerPage,
    currentPageGallinas * itemsPerPage
  );

  const paginatedHuevos = filteredHuevos.slice(
    (currentPageHuevos - 1) * itemsPerPage,
    currentPageHuevos * itemsPerPage
  );

  const openGallinaModal = (gallina = null) => {
    if (gallina) {
      setGallinaForm(gallina);
      setIsEditingGallina(true);
    } else {
      setGallinaForm({
        id: "",
        lote: "",
        perdidas: "",
        enfermas: "",
        semanasVida: "",
        fechaInicio: "",
        fechaFin: "",
      });

      setIsEditingGallina(false);
    }

    setIsGallinaModalOpen(true);
  };
  
  const closeGallinaModal = () => setIsGallinaModalOpen(false);

  const validateGallina = (form) => {
    if (!form.lote || !form.perdidas || !form.enfermas || !form.semanasVida || !form.fechaInicio || !form.fechaFin) {
      return "Por favor completa todos los campos del lote de gallinas.";
    }
    return "";
  };

  const handleGallinaSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.put(`/chicken/${gallinaForm.id}`, {
        quantityChickens: Number(gallinaForm.lote),
        chickensLosts: Number(gallinaForm.perdidas),
        quantitySick: Number(gallinaForm.enfermas),
        weeksLife: Number(gallinaForm.semanasVida),
        startDate: gallinaForm.fechaInicio,
        endDate: gallinaForm.fechaFin,
      });

      await loadGallinas();

      closeGallinaModal();

      setAlert({
        isOpen: true,
        type: "success",
        title: "Cambios guardados",
        message: "La información de las gallinas se actualizó correctamente.",
        showCancel: false,
        confirmText: "Aceptar",
        cancelText: "Cancelar",
        onConfirm: closeAlert,
        onCancel: null,
      });
    } catch (error) {
      console.error(error);

      setAlert({
        isOpen: true,
        type: "error",
        title: "Error",
        message:
          error.response?.data?.message ||
          "No se pudo actualizar el registro.",
        showCancel: false,
        confirmText: "Aceptar",
        cancelText: "Cancelar",
        onConfirm: closeAlert,
        onCancel: null,
      });
    }
  };

  const handleDeleteGallina = (gallina) => {
    setAlert({
      isOpen: true,
      type: "warning",
      title: "Eliminar registro",
      message: "¿Deseas eliminar este registro de gallinas?",
      showCancel: true,
      confirmText: "Eliminar",
      cancelText: "Cancelar",

      onConfirm: async () => {
        try {
          await api.delete(`/chicken/${gallina.id}`);

          await loadGallinas();

          setAlert({
            isOpen: true,
            type: "success",
            title: "Registro eliminado",
            message: "El registro fue eliminado correctamente.",
            showCancel: false,
            confirmText: "Aceptar",
            cancelText: "Cancelar",
            onConfirm: closeAlert,
            onCancel: null,
          });
        } catch (error) {
          console.error(error);

          setAlert({
            isOpen: true,
            type: "error",
            title: "Error",
            message:
              error.response?.data?.message ||
              "No se pudo eliminar el registro.",
            showCancel: false,
            confirmText: "Aceptar",
            cancelText: "Cancelar",
            onConfirm: closeAlert,
            onCancel: null,
          });
        }
      },

      onCancel: closeAlert,
    });
  };

  const loadHuevos = async () => {
    try {
      const response = await api.get("/egg");

      const formattedData = response.data.map((item) => ({
        id: item._id,

        fecha: item.date
          ? item.date.split("T")[0]
          : "",

        jumbo: item.eggsProduced?.[0]?.jumbo || 0,
        grande: item.eggsProduced?.[0]?.grande || 0,
        mediano: item.eggsProduced?.[0]?.mediano || 0,
        pequeno: item.eggsProduced?.[0]?.pequeno || 0,

        total: item.totalEggs,
        perdidos: item.eggsLosts,
      }));

      setHuevos(formattedData);
    } catch (error) {
      console.error("Error cargando huevos:", error);
    }
  };

  const handleCreateHuevo = async (e) => {
    e.preventDefault();

    try {
      await api.post("/egg", {
        eggsProduced: {
            jumbo: Number(huevoForm.jumbo),
            grande: Number(huevoForm.grande),
            mediano: Number(huevoForm.mediano),
            pequeno: Number(huevoForm.pequeno),
        },
        totalEggs: Number(huevoForm.total),
        eggsLosts: Number(huevoForm.perdidos),
        date: huevoForm.fecha,
      });

      await loadHuevos();

      closeHuevoModal();

      setAlert({
        isOpen: true,
        type: "success",
        title: "Registro creado",
        message: "La producción de huevos fue registrada correctamente.",
        showCancel: false,
        confirmText: "Aceptar",
        onConfirm: closeAlert,
      });
    } catch (error) {
      console.error(error);

      setAlert({
        isOpen: true,
        type: "error",
        title: "Error",
        message:
          error.response?.data?.message ||
          "No se pudo registrar la producción.",
        showCancel: false,
        confirmText: "Aceptar",
        onConfirm: closeAlert,
      });
    }
  };

  const openHuevoModal = (huevo = null) => {
    if (huevo) {
      setHuevoForm(huevo);
      setIsEditingHuevo(true);
    } else {
      setHuevoForm({
        id: "",
        jumbo: "",
        grande: "",
        mediano: "",
        pequeno: "",
        total: "",
        perdidos: "",
        fecha: "",
      });

      setIsEditingHuevo(false);
    }

    setIsHuevoModalOpen(true);
  };

  useEffect(() => {
    loadGallinas();
    loadHuevos();
  }, []);
  
  const closeHuevoModal = () => setIsHuevoModalOpen(false);

  const validateHuevo = (form) => {
    if (!form.jumbo || !form.grande || !form.mediano || !form.pequeno || !form.perdidos || !form.fecha) {
      return "Por favor completa todos los campos del registro de huevos.";
    }
    return "";
  };

  const handleHuevoSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.put(`/egg/${huevoForm.id}`, {
        eggsProduced: {
          jumbo: Number(huevoForm.jumbo),
          grande: Number(huevoForm.grande),
          mediano: Number(huevoForm.mediano),
          pequeno: Number(huevoForm.pequeno),
        },

        totalEggs: Number(huevoForm.total),
        eggsLosts: Number(huevoForm.perdidos),
        date: huevoForm.fecha,
      });

      await loadHuevos();

      closeHuevoModal();

      setAlert({
        isOpen: true,
        type: "success",
        title: "Cambios guardados",
        message: "La producción de huevos fue actualizada.",
        showCancel: false,
        confirmText: "Aceptar",
        cancelText: "Cancelar",
        onConfirm: closeAlert,
        onCancel: null,
      });
    } catch (error) {
      console.error(error);

      setAlert({
        isOpen: true,
        type: "error",
        title: "Error",
        message:
          error.response?.data?.message ||
          "No se pudo actualizar el registro.",
        showCancel: false,
        confirmText: "Aceptar",
        cancelText: "Cancelar",
        onConfirm: closeAlert,
        onCancel: null,
      });
    }
  };

  const handleDeleteHuevo = (huevo) => {
    setAlert({
      isOpen: true,
      type: "warning",
      title: "Eliminar registro",
      message: "¿Deseas eliminar este registro de producción?",
      showCancel: true,
      confirmText: "Eliminar",
      cancelText: "Cancelar",

      onConfirm: async () => {
        try {
          await api.delete(`/egg/${huevo.id}`);

          await loadHuevos();

          setAlert({
            isOpen: true,
            type: "success",
            title: "Registro eliminado",
            message: "El registro fue eliminado correctamente.",
            showCancel: false,
            confirmText: "Aceptar",
            cancelText: "Cancelar",
            onConfirm: closeAlert,
            onCancel: null,
          });
        } catch (error) {
          console.error(error);

          setAlert({
            isOpen: true,
            type: "error",
            title: "Error",
            message:
              error.response?.data?.message ||
              "No se pudo eliminar el registro.",
            showCancel: false,
            confirmText: "Aceptar",
            cancelText: "Cancelar",
            onConfirm: closeAlert,
            onCancel: null,
          });
        }
      },

      onCancel: closeAlert,
    });
  };

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

        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
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
              <button
                className="chicken-page-arrow"
                disabled={currentPageGallinas === 1}
                onClick={() =>
                  setCurrentPageGallinas((prev) => prev - 1)
                }
              >
                <ChevronLeft size={18} />
              </button>

              <div className="chicken-page-numbers">
                <span className="active">{currentPageGallinas}</span>
              </div>

              <button
                className="chicken-page-arrow"
                disabled={currentPageGallinas === paginatedGallinas}
                onClick={() =>
                  setCurrentPageGallinas((prev) => prev + 1)
                }
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

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
              <button
                className="chicken-page-arrow"
                disabled={currentPageHuevos === 1}
                onClick={() =>
                  setCurrentPageHuevos((prev) => prev - 1)
                }
              >
                <ChevronLeft size={18} />
              </button>

              <div className="chicken-page-numbers">
                <span className="active">{currentPageHuevos}</span>
              </div>

              <button
                className="chicken-page-arrow"
                disabled={currentPageHuevos === paginatedHuevos}
                onClick={() =>
                  setCurrentPageHuevos((prev) => prev + 1)
                }
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

        </div>

        
        {isGallinaModalOpen && (
          <div className="chicken-modal-overlay" onClick={closeGallinaModal}>
            <div className="chicken-modal chicken-create-modal" onClick={(e) => e.stopPropagation()}>
              <button type="button" className="chicken-modal-close" onClick={closeGallinaModal}><X size={20} /></button>
              <div className="chicken-modal-header">
                <h2>{isEditingGallina ? "EDITAR GALLINAS" : "INGRESAR GALLINAS"}</h2>
              </div>
              <form className="chicken-modal-form" onSubmit={isEditingGallina ? handleGallinaSubmit: handleCreateGallina}>
                <div className="chicken-modal-field"><label>Lote de gallinas</label><input name="lote" type="number" value={gallinaForm.lote} onChange={(e) => setGallinaForm({...gallinaForm, lote: e.target.value})} /></div>
                <div className="chicken-modal-field"><label>Gallinas perdidas</label><input name="perdidas" type="number" value={gallinaForm.perdidas} onChange={(e) => setGallinaForm({...gallinaForm, perdidas: e.target.value})} /></div>
                <div className="chicken-modal-field"><label>Gallinas enfermas</label><input name="enfermas" type="number" value={gallinaForm.enfermas} onChange={(e) => setGallinaForm({...gallinaForm, enfermas: e.target.value})} /></div>
                <div className="chicken-modal-field"><label>Semanas de vida</label><input name="semanasVida" type="number" value={gallinaForm.semanasVida} onChange={(e) => setGallinaForm({...gallinaForm, semanasVida: e.target.value})} /></div>
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

        {isHuevoModalOpen && (
          <div className="chicken-modal-overlay" onClick={closeHuevoModal}>
            <div className="chicken-modal chicken-create-modal" onClick={(e) => e.stopPropagation()}>
              <button type="button" className="chicken-modal-close" onClick={closeHuevoModal}><X size={20} /></button>
              <div className="chicken-modal-header">
                <h2>  {isEditingHuevo ? "EDITAR HUEVOS" : "INGRESAR HUEVOS"}</h2>
              </div>
              <form className="chicken-modal-form" onSubmit={isEditingHuevo ? handleHuevoSubmit: handleCreateHuevo}>
                <div className="chicken-modal-field"><label>Jumbo</label><input name="jumbo" type="number" value={huevoForm.jumbo} onChange={(e) => setHuevoForm({...huevoForm, jumbo: e.target.value})} /></div>
                <div className="chicken-modal-field"><label>Grande</label><input name="grande" type="number" value={huevoForm.grande} onChange={(e) => setHuevoForm({...huevoForm, grande: e.target.value})} /></div>
                <div className="chicken-modal-field"><label>Mediano</label><input name="mediano" type="number" value={huevoForm.mediano} onChange={(e) => setHuevoForm({...huevoForm, mediano: e.target.value})} /></div>
                <div className="chicken-modal-field"><label>Pequeño</label><input name="pequeno" type="number" value={huevoForm.pequeno} onChange={(e) => setHuevoForm({...huevoForm, pequeno: e.target.value})} /></div>
                <div className="chicken-modal-field"><label>Huevos Total</label><input name="total" type="number" value={huevoForm.total} readOnly/></div>
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