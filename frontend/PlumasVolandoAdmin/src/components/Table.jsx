import React from "react";
import "../styles/Table.css";

const Table = ({ columns = [], data = [], emptyMessage = "No hay datos disponibles." }) => {
  return (
    <div className="custom-table-wrapper">
      <table className="custom-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.label}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr key={row.id ?? rowIndex}>
                {columns.map((column) => (
                  <td key={`${row.id ?? rowIndex}-${column.key}`}>
                    {row[column.key]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="custom-table-empty">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;