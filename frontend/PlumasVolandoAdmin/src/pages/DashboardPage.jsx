import React, { useEffect, useMemo, useState } from "react";
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
import api from "../services/api";

import "../styles/Dashboard.css";
import "../styles/Navbar.css";
import "../styles/NeumorphicCard.css";
import "../styles/StatCard.css";

const STATE_COLORS = [
  "#d28d65",
  "#f0b02f",
  "#e9282d",
  "#dd944c",
  "#b8744f",
  "#e6c84f",
];

const getArray = (response) => {
  const data = response?.data;

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.customers)) return data.customers;
  if (Array.isArray(data?.customer)) return data.customer;
  if (Array.isArray(data?.Customers)) return data.Customers;
  if (Array.isArray(data?.chickens)) return data.chickens;
  if (Array.isArray(data?.chicken)) return data.chicken;
  if (Array.isArray(data?.Chickens)) return data.Chickens;
  if (Array.isArray(data?.products)) return data.products;
  if (Array.isArray(data?.product)) return data.product;
  if (Array.isArray(data?.Products)) return data.Products;

  return [];
};

const formatDate = (date) => {
  if (!date) return "Sin fecha";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "Sin fecha";

  return parsedDate.toLocaleDateString("es-SV");
};

const getProductsResume = (products = []) => {
  if (!Array.isArray(products) || products.length === 0) {
    return "Sin producto";
  }

  const names = products.map((product) => {
    return product.name || product.nombre || "Producto sin nombre";
  });

  if (names.length <= 2) {
    return names.join(", ");
  }

  return `${names[0]}, ${names[1]} +${names.length - 2} más`;
};

const DashboardPage = () => {
  const [customers, setCustomers] = useState([]);
  const [chickens, setChickens] = useState([]);
  const [products, setProducts] = useState([]);
  const [ordersStates, setOrdersStates] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [monthlyProduction, setMonthlyProduction] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const safeGet = async (path) => {
    try {
      return await api.get(path);
    } catch (error) {
      console.log(`Error en ${path}:`, error.response?.data || error.message);
      return { data: [] };
    }
  };

  const getDashboardData = async () => {
    try {
      const [
        customersRes,
        chickensRes,
        productsRes,
        ordersStatesRes,
        recentOrdersRes,
        monthlyProductionRes,
        topProductsRes,
      ] = await Promise.all([
        safeGet("/customer"),
        safeGet("/chicken"),
        safeGet("/products"),
        safeGet("/orders/states"),
        safeGet("/orders/recent"),
        safeGet("/egg/monthly-production"),
        safeGet("/products/top-selling"),
      ]);

      setCustomers(getArray(customersRes));
      setChickens(getArray(chickensRes));
      setProducts(getArray(productsRes));

      setOrdersStates(
        Array.isArray(ordersStatesRes.data) ? ordersStatesRes.data : []
      );

      setRecentOrders(
        Array.isArray(recentOrdersRes.data) ? recentOrdersRes.data : []
      );

      setMonthlyProduction(
        Array.isArray(monthlyProductionRes.data)
          ? monthlyProductionRes.data
          : []
      );

      setTopProducts(
        Array.isArray(topProductsRes.data) ? topProductsRes.data : []
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDashboardData();

    const interval = setInterval(() => {
      getDashboardData();
    }, 5000);

    const refreshDashboard = () => {
      getDashboardData();
    };

    window.addEventListener("focus", refreshDashboard);
    window.addEventListener("plumas:orders-updated", refreshDashboard);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", refreshDashboard);
      window.removeEventListener("plumas:orders-updated", refreshDashboard);
    };
  }, []);

  const ordersCount = useMemo(() => {
    return ordersStates.reduce((total, item) => {
      return total + Number(item.total || 0);
    }, 0);
  }, [ordersStates]);

  const orderStateData = useMemo(() => {
    return ordersStates.map((item, index) => {
      const total = Number(item.total || 0);

      return {
        state: item.state || item.estado || "Sin estado",
        total,
        color: STATE_COLORS[index % STATE_COLORS.length],
        percent: ordersCount > 0 ? Math.round((total / ordersCount) * 100) : 0,
      };
    });
  }, [ordersStates, ordersCount]);

  const stateColorMap = useMemo(() => {
    const map = {};

    orderStateData.forEach((item) => {
      map[item.state] = item.color;
    });

    return map;
  }, [orderStateData]);

  const donutStyle = useMemo(() => {
    if (!orderStateData.length || ordersCount === 0) {
      return {
        background: "#e9dfd2",
      };
    }

    let current = 0;

    const segments = orderStateData.map((item) => {
      const start = current;
      const end = current + (item.total / ordersCount) * 100;

      current = end;

      return `${item.color} ${start}% ${end}%`;
    });

    return {
      background: `conic-gradient(${segments.join(", ")})`,
    };
  }, [orderStateData, ordersCount]);

  const monthlyBars = useMemo(() => {
    const max = Math.max(
      ...monthlyProduction.map((item) => Number(item.total || 0)),
      1
    );

    return monthlyProduction.map((item) => {
      const total = Number(item.total || 0);

      return {
        month: item.month || "Sin mes",
        shortMonth: item.shortMonth || String(item.month || "").slice(0, 3),
        total,
        value: total > 0 ? Math.max((total / max) * 100, 12) : 0,
      };
    });
  }, [monthlyProduction]);

  const formattedTopProducts = useMemo(() => {
    const max = Math.max(
      ...topProducts.map((product) => Number(product.quantitySold || 0)),
      1
    );

    return topProducts.map((product) => {
      const quantitySold = Number(product.quantitySold || 0);
      const totalSold = Number(product.totalSold || 0);

      return {
        idProduct: product.idProduct || product._id || product.name,
        name: product.name || "Producto sin nombre",
        quantitySold,
        totalSold,
        percent: Math.round((quantitySold / max) * 100),
      };
    });
  }, [topProducts]);

  const formattedRecentOrders = useMemo(() => {
    return recentOrders.map((order) => {
      const estado = order.state || order.estado || order.status || "Sin estado";

      return {
        fecha: formatDate(order.date || order.fecha || order.createdAt),
        empleado: order.employeeName || order.empleadoName || "No asignado",
        producto: getProductsResume(order.products || order.productos),
        ubicacion: order.location || order.ubicacion || "No registrada",
        cliente: order.clientName || order.customerName || "No registrado",
        estado,
      };
    });
  }, [recentOrders]);

  const stats = [
    {
      title: "Clientes",
      value: customers.length,
      subtitle: "Registrados en el sistema",
      icon: <Users size={20} />,
      trend: "up",
    },
    {
      title: "Gallinas",
      value: chickens.length,
      subtitle: "Gallinas registradas",
      icon: <Egg size={20} />,
      trend: "up",
    },
    {
      title: "Productos",
      value: products.length,
      subtitle: "Productos registrados",
      icon: <Package size={20} />,
      trend: "up",
    },
    {
      title: "Pedidos",
      value: ordersCount,
      subtitle: "Pedidos registrados",
      icon: <ShoppingCart size={20} />,
      trend: "up",
    },
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="dashboard-page-content">
          <h2>Cargando dashboard...</h2>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="dashboard-page-content">
        <div className="dashboard-stats-grid">
          {stats.map((item, index) => (
            <StatCard
              key={index}
              title={item.title}
              value={item.value}
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

            <div className="monthly-chart">
              {monthlyBars.length === 0 ? (
                <p>No hay producción registrada</p>
              ) : (
                monthlyBars.map((item, index) => (
                  <div
                    key={`${item.month}-${index}`}
                    className="monthly-bar-item"
                    title={`${item.month}: ${item.total} huevos producidos`}
                  >
                    <div className="monthly-tooltip">
                      <strong>{item.month}</strong>
                      <span>{item.total} huevos producidos</span>
                    </div>

                    <div className="monthly-track">
                      <div
                        className={`monthly-bar ${
                          index % 2 === 0 ? "yellow" : "orange"
                        }`}
                        style={{
                          height: `${item.value}%`,
                          minHeight: item.total > 0 ? "8px" : "0px",
                        }}
                      ></div>
                    </div>

                    <span className="monthly-label">{item.shortMonth}</span>
                  </div>
                ))
              )}
            </div>
          </NeumorphicCard>

          <NeumorphicCard className="dashboard-chart-small">
            <div className="dashboard-card-header center">
              <h3>Estado Pedidos</h3>
            </div>

            <div className="orders-donut-section">
              <div className="orders-donut" style={donutStyle}>
                <div className="orders-donut-center">
                  <strong>{ordersCount}</strong>
                  <span>Pedidos</span>
                </div>
              </div>

              <div className="orders-state-list">
                {orderStateData.length === 0 ? (
                  <p>No hay estados registrados</p>
                ) : (
                  orderStateData.map((item) => (
                    <div key={item.state} className="orders-state-item">
                      <div className="orders-state-left">
                        <span
                          className="orders-state-dot"
                          style={{ backgroundColor: item.color }}
                        ></span>
                        <p>{item.state}</p>
                      </div>

                      <strong>
                        {item.total} ({item.percent}%)
                      </strong>
                    </div>
                  ))
                )}
              </div>
            </div>
          </NeumorphicCard>
        </div>

        <div className="dashboard-bottom-grid">
          <div className="dashboard-left-column">
            <NeumorphicCard className="dashboard-products-card">
              <div className="dashboard-card-header">
                <h3>Más Vendidos</h3>
              </div>

              <div className="top-products-list">
                {formattedTopProducts.length === 0 ? (
                  <p>No hay productos vendidos registrados</p>
                ) : (
                  formattedTopProducts.map((product) => (
                    <div
                      key={product.idProduct}
                      className="top-product-item"
                    >
                      <div className="top-product-top">
                        <span>{product.name}</span>
                        <strong>
                          {product.quantitySold} vendidos ({product.percent}%)
                        </strong>
                      </div>

                      <div className="top-product-progress">
                        <div
                          className="top-product-progress-fill"
                          style={{ width: `${product.percent}%` }}
                        ></div>
                      </div>
                    </div>
                  ))
                )}
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
                    <th>UBICACIÓN</th>
                    <th>CLIENTE</th>
                    <th>ESTADO</th>
                  </tr>
                </thead>

                <tbody>
                  {formattedRecentOrders.length === 0 ? (
                    <tr>
                      <td colSpan="6">No hay pedidos registrados</td>
                    </tr>
                  ) : (
                    formattedRecentOrders.map((order, index) => (
                      <tr key={`${order.fecha}-${index}`}>
                        <td>{order.fecha}</td>
                        <td>{order.empleado}</td>
                        <td>{order.producto}</td>
                        <td>{order.ubicacion}</td>
                        <td>{order.cliente}</td>
                        <td>
                          <span
                            className="order-status"
                            style={{
                              backgroundColor: `${
                                stateColorMap[order.estado] || "#dd944c"
                              }22`,
                              color: stateColorMap[order.estado] || "#94602f",
                            }}
                          >
                            {order.estado}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
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