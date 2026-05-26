import React from "react";
import {
  Users,
  Egg,
  Package,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";

import DashboardLayout from "../components/DashboardLayout";
import StatCard from "../components/StatCard";
import NeumorphicCard from "../components/NeumorphisCard";

import "../styles/Dashboard.css";
import "../styles/Navbar.css";
import "../styles/NeumorphicCard.css";
import "../styles/StatCard.css";

const DashboardPage = () => {
  const stats = [
    {
      title: "Clientes",
      value: "56",
      percentage: "10.0%",
      subtitle: "En comparación al mes anterior",
      icon: <Users size={20} />,
      trend: "up",
    },
    {
      title: "Gallinas",
      value: "30",
      percentage: "2.0%",
      subtitle: "En comparación al mes anterior",
      icon: <Egg size={20} />,
      trend: "down",
    },
    {
      title: "Productos",
      value: "50",
      percentage: "10.0%",
      subtitle: "En comparación al mes anterior",
      icon: <Package size={20} />,
      trend: "up",
    },
    {
      title: "Pedidos",
      value: "35",
      percentage: "10.0%",
      subtitle: "En comparación al mes anterior",
      icon: <ShoppingCart size={20} />,
      trend: "down",
    },
  ];

  const monthlyBars = [
    { month: "Enero", value: 42 },
    { month: "Febrero", value: 50 },
    { month: "Marzo", value: 68 },
    { month: "Abril", value: 54 },
    { month: "Mayo", value: 60 },
    { month: "Junio", value: 78 },
    { month: "Julio", value: 28 },
    { month: "Agosto", value: 40 },
    { month: "Septiembre", value: 47 },
    { month: "Octubre", value: 64 },
    { month: "Noviembre", value: 52 },
    { month: "Diciembre", value: 50 },
  ];

  const topProducts = [
    {
      name: "Huevos Jumbo",
      amount: "$ 1,000",
      percent: 50,
    },
    {
      name: "Pollos",
      amount: "$ 250",
      percent: 25,
    },
  ];

  const recentOrders = [
    {
      fecha: "24/02/2026",
      empleado: "Daniel",
      producto: "Huevos Medianos",
      ubicacion: "Apopa",
      cliente: "Joshua",
      estado: "Entregado",
    },
    {
      fecha: "25/02/2026",
      empleado: "Edwin",
      producto: "Huevos Jumbo",
      ubicacion: "Marseille",
      cliente: "Daniel",
      estado: "En progreso",
    },
    {
      fecha: "26/02/2026",
      empleado: "Diego",
      producto: "Bebedero",
      ubicacion: "Miramonte",
      cliente: "Edwin",
      estado: "Cancelado",
    },
  ];

  return (
    <DashboardLayout>
      <div className="dashboard-page-content">
        <div className="dashboard-stats-grid">
          {stats.map((item, index) => (
            <StatCard
              key={index}
              title={item.title}
              value={item.value}
              percentage={item.percentage}
              subtitle={item.subtitle}
              icon={item.icon}
              trend={item.trend}
            />
          ))}
        </div>

        <div className="dashboard-middle-grid">
          <NeumorphicCard className="dashboard-chart-large">
            <div className="dashboard-card-header">
              <h3>Huevos producidos/Mensualmente</h3>

              <button className="dashboard-filter-btn" type="button">
                <TrendingUp size={16} />
              </button>
            </div>

            <div className="fake-bar-chart">
              {monthlyBars.map((item, index) => (
                <div key={index} className="fake-bar-item">
                  <div
                    className={`fake-bar-fill ${
                      index % 2 === 0 ? "light" : "dark"
                    }`}
                    style={{ height: `${item.value}%` }}
                  ></div>
                  <span>{item.month}</span>
                </div>
              ))}
            </div>
          </NeumorphicCard>

          <NeumorphicCard className="dashboard-chart-small">
            <div className="dashboard-card-header center">
              <h3>Estado Pedidos</h3>
            </div>

            <div className="fake-donut-wrapper">
              <div className="fake-donut"></div>

              <div className="fake-donut-legend horizontal">
                <div className="legend-item">
                  <span className="legend-dot delivered"></span>
                  <p>Entregados</p>
                </div>

                <div className="legend-item">
                  <span className="legend-dot progress"></span>
                  <p>En progreso</p>
                </div>

                <div className="legend-item">
                  <span className="legend-dot cancelled"></span>
                  <p>Cancelado</p>
                </div>
              </div>
            </div>
          </NeumorphicCard>
        </div>

        <div className="dashboard-bottom-grid">
          <div className="dashboard-left-column">
            <NeumorphicCard className="dashboard-products-card">
              <div className="dashboard-card-header">
                <h3>Mas Vendidos</h3>
              </div>

              <div className="top-products-list">
                {topProducts.map((product, index) => (
                  <div key={index} className="top-product-item">
                    <div className="top-product-top">
                      <span>{product.name}</span>
                      <strong>
                        {product.amount}({product.percent}%)
                      </strong>
                    </div>

                    <div className="top-product-progress">
                      <div
                        className="top-product-progress-fill"
                        style={{ width: `${product.percent}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </NeumorphicCard>
          </div>

          <NeumorphicCard className="dashboard-table-card">
            <div className="dashboard-card-header">
              <h3>Pedidos recientes</h3>
            </div>

            <div className="dashboard-table-wrapper">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>FECHA</th>
                    <th>EMPLEADO</th>
                    <th>PRODUCTO</th>
                    <th>UBICACION</th>
                    <th>CLIENTE</th>
                    <th>ESTADO</th>
                  </tr>
                </thead>

                <tbody>
                  {recentOrders.map((order, index) => (
                    <tr key={index}>
                      <td>{order.fecha}</td>
                      <td>{order.empleado}</td>
                      <td>{order.producto}</td>
                      <td>{order.ubicacion}</td>
                      <td>{order.cliente}</td>
                      <td>
                        <span
                          className={`order-status ${
                            order.estado === "Entregado"
                              ? "completed"
                              : order.estado === "En progreso"
                              ? "pending"
                              : "cancelled"
                          }`}
                        >
                          {order.estado}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </NeumorphicCard>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;