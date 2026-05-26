import React from "react";
import { AlertTriangle, CheckCircle2, XCircle, Info, X } from "lucide-react";
import "../styles/CustomAlert.css";

const CustomAlert = ({
  isOpen,
  type = "success",
  title = "",
  message = "",
  confirmText = "Aceptar",
  cancelText = "Cancelar",
  showCancel = false,
  onConfirm,
  onCancel,
  onClose,
}) => {
  if (!isOpen) return null;

  const iconMap = {
    success: <CheckCircle2 size={42} />,
    error: <XCircle size={42} />,
    warning: <AlertTriangle size={42} />,
    info: <Info size={42} />,
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
      return;
    }

    if (onClose) {
      onClose();
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
      return;
    }

    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="custom-alert-overlay">
      <div className={`custom-alert custom-alert-${type}`}>
        <button
          type="button"
          className="custom-alert-close"
          onClick={handleCancel}
          aria-label="Cerrar alerta"
        >
          <X size={18} />
        </button>

        <div className="custom-alert-icon">
          {iconMap[type] || iconMap.info}
        </div>

        <h2 className="custom-alert-title">{title}</h2>
        <p className="custom-alert-message">{message}</p>

        <div className={`custom-alert-actions ${showCancel ? "two-buttons" : ""}`}>
          {showCancel && (
            <button
              type="button"
              className="custom-alert-btn custom-alert-btn-cancel"
              onClick={handleCancel}
            >
              {cancelText}
            </button>
          )}

          <button
            type="button"
            className="custom-alert-btn custom-alert-btn-confirm"
            onClick={handleConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomAlert;