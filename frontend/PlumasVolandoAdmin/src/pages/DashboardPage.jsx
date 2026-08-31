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

const ORDER_STATES = [
  { key: "entregado", label: "Entregado", color: "#d28d65" },
  { key: "pendiente", label: "Pendiente", color: "#f0b02f" },
  { key: "cancelado", label: "Cancelado", color: "#e9282d" },
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
  if (Array.isArray(data?.orders)) return data.orders;
  if (Array.isArray(data?.order)) return data.order;
  if (Array.isArray(data?.Orders)) return data.Orders;

  return [];
};

const normalizeText = (value = "") => {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
};

const normalizeOrderState = (state) => {
  const value = normalizeText(state);

  if (
    value.includes("entregado") ||
    value.includes("entregada") ||
    value.includes("completado") ||
    value.includes("completada") ||
    value.includes("finalizado") ||
    value.includes("finalizada")
  ) {
    return "entregado";
  }

  if (
    value.includes("cancelado") ||
    value.includes("cancelada") ||
    value.includes("rechazado") ||
    value.includes("rechazada")
  ) {
    return "cancelado";
  }

  return "pendiente";
};

const getOrderStatus = (order) => {
  return (
    order.estado ||
    order.state ||
    order.status ||
    order.orderStatus ||
    order.estadoPedido ||
    "Pendiente"
  );
};

const formatDate = (date) => {
  if (!date) return "Sin fecha";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "Sin fecha";

  return parsedDate.toLocaleDateString("es-SV");
};

const normalizeId = (value) => {
  if (!value) return "";

  if (typeof value === "object") {
    return String(
      value._id ||
        value.id ||
        value.idProduct ||
        value.idProducto ||
        value.productId ||
        ""
    );
  }

  return String(value);
};

const getProductName = (item, productIndex) => {
  const product =
    item.productId ||
    item.idProduct ||
    item.idProducto ||
    item.product ||
    item.producto ||
    item.Products ||
    item.Product;

  const productId = normalizeId(product || item.productId || item.idProduct);

  return (
    item.name ||
    item.nombre ||
    item.productName ||
    item.nombreProducto ||
    product?.name ||
    product?.nombre ||
    productIndex.get(productId) ||
    "Producto sin nombre"
  );
};

const getQuantity = (item) => {
  const quantity = Number(
    item.quantity ??
      item.cantidad ??
      item.Quantity ??
      item.qty ??
      item.unidades ??
      1
  );

  return quantity > 0 ? quantity : 1;
};

const getOrderItems = (order) => {
  const items =
    order.products ||
    order.productos ||
    order.items ||
    order.detalle ||
    order.details ||
    order.orderProducts ||
    [];

  if (Array.isArray(items)) return items;

  if (items && typeof items === "object") return [items];

  if (order.productId || order.idProduct || order.idProducto) {
    return [
      {
        productId: order.productId || order.idProduct || order.idProducto,
        quantity: order.quantity || order.cantidad || 1,
        name: order.productName || order.nombreProducto,
      },
    ];
  }

  return [];
};

const getProductsResume = (order, productIndex) => {
  const items = getOrderItems(order);

  if (!items.length) return "Sin producto";

  const names = items.map((item) => getProductName(item, productIndex));

  if (names.length <= 2) return names.join(", ");

  return `${names[0]}, ${names[1]} +${names.length - 2} más`;
};

const getPersonName = (...values) => {
  for (const value of values) {
    if (!value) continue;

    if (typeof value === "string") return value;

    const fullName = `${value.name || value.nombre || ""} ${
      value.lastName || value.apellido || ""
    }`.trim();

    if (fullName) return fullName;
  }

  return "";
};

const DashboardPage = () => {
  const [customers, setCustomers] = useState([]);
  const [chickens, setChickens] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [monthlyProduction, setMonthlyProduction] = useState([]);
  const [loading, setLoading] = useState(true);

  const safeGet = async (path) => {
    try {
      return await api.get(path);
    } catch (error) {
      console.log(`Error en ${path}:`, error.response?.data || error.message);
      return null;
    }
  };

  const safeGetFirst = async (paths) => {
    for (const path of paths) {
      const response = await safeGet(path);

      if (response) return response;
    }

    return { data: [] };
  };

  const getDashboardData = async () => {
    try {
      const [
        customersRes,
        chickensRes,
        productsRes,
        ordersRes,
        monthlyProductionRes,
      ] = await Promise.all([
        safeGetFirst(["/customer", "/customers"]),
        safeGetFirst(["/chicken", "/chickens"]),
        safeGetFirst(["/products", "/product"]),
        safeGetFirst(["/orders", "/order"]),
        safeGetFirst(["/egg/monthly-production"]),
      ]);

      setCustomers(getArray(customersRes));
      setChickens(getArray(chickensRes));
      setProducts(getArray(productsRes));
      setOrders(getArray(ordersRes));
      setMonthlyProduction(getArray(monthlyProductionRes));
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
    window.addEventListener("plumas:products-updated", refreshDashboard);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", refreshDashboard);
      window.removeEventListener("plumas:orders-updated", refreshDashboard);
      window.removeEventListener("plumas:products-updated", refreshDashboard);
    };
  }, []);

  const productIndex = useMemo(() => {
    const map = new Map();

    products.forEach((product) => {
      const id = normalizeId(product);

      if (id) {
        map.set(id, product.name || product.nombre || "Producto sin nombre");
      }
    });

    return map;
  }, [products]);

  const orderStateCounts = useMemo(() => {
    const counts = {
      entregado: 0,
      pendiente: 0,
      cancelado: 0,
    };

    orders.forEach((order) => {
      const stateKey = normalizeOrderState(getOrderStatus(order));
      counts[stateKey] += 1;
    });

    return counts;
  }, [orders]);

  const ordersCount = useMemo(() => {
    return Object.values(orderStateCounts).reduce((total, value) => {
      return total + Number(value || 0);
    }, 0);
  }, [orderStateCounts]);

  const orderStateData = useMemo(() => {
    return ORDER_STATES.map((state) => {
      const total = Number(orderStateCounts[state.key] || 0);

      return {
        ...state,
        total,
        percent: ordersCount > 0 ? Math.round((total / ordersCount) * 100) : 0,
      };
    });
  }, [orderStateCounts, ordersCount]);

  const stateColorMap = useMemo(() => {
    const map = {};

    ORDER_STATES.forEach((state) => {
      map[state.key] = state.color;
      map[state.label] = state.color;
    });

    return map;
  }, []);

  const donutStyle = useMemo(() => {
    if (ordersCount === 0) {
      return {
        background: "#e9dfd2",
      };
    }

    let current = 0;

    const segments = orderStateData
      .filter((item) => item.total > 0)
      .map((item) => {
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
    const soldProducts = new Map();

    orders
      .filter((order) => normalizeOrderState(getOrderStatus(order)) === "entregado")
      .forEach((order) => {
        getOrderItems(order).forEach((item) => {
          const product =
            item.productId ||
            item.idProduct ||
            item.idProducto ||
            item.product ||
            item.producto;

          const id =
            normalizeId(product) ||
            normalizeId(item.productId) ||
            normalizeId(item.idProduct) ||
            getProductName(item, productIndex);

          const name = getProductName(item, productIndex);
          const quantity = getQuantity(item);

          if (!soldProducts.has(id)) {
            soldProducts.set(id, {
              idProduct: id,
              name,
              quantitySold: 0,
            });
          }

          soldProducts.get(id).quantitySold += quantity;
        });
      });

    const result = Array.from(soldProducts.values()).sort((a, b) => {
      return b.quantitySold - a.quantitySold;
    });

    const totalSold = result.reduce((total, product) => {
      return total + Number(product.quantitySold || 0);
    }, 0);

    const maxSold = Math.max(
      ...result.map((product) => Number(product.quantitySold || 0)),
      1
    );

    return result.slice(0, 5).map((product) => {
      const quantitySold = Number(product.quantitySold || 0);

      return {
        ...product,
        percent:
          totalSold > 0 ? Math.round((quantitySold / totalSold) * 100) : 0,
        barPercent: quantitySold > 0 ? (quantitySold / maxSold) * 100 : 0,
      };
    });
  }, [orders, productIndex]);

  const formattedRecentOrders = useMemo(() => {
    return [...orders]
      .sort((a, b) => {
        const dateA = new Date(a.createdAt || a.date || a.fecha || 0);
        const dateB = new Date(b.createdAt || b.date || b.fecha || 0);

        return dateB - dateA;
      })
      .slice(0, 6)
      .map((order) => {
        const stateKey = normalizeOrderState(getOrderStatus(order));
        const stateLabel =
          ORDER_STATES.find((state) => state.key === stateKey)?.label ||
          "Pendiente";

        return {
          fecha: formatDate(order.date || order.fecha || order.createdAt),
          empleado:
            getPersonName(
              order.employeeName,
              order.empleadoName,
              order.employee,
              order.empleado,
              order.idEmpleado
            ) || "No asignado",
          producto: getProductsResume(order, productIndex),
          ubicacion:
            order.location ||
            order.ubicacion ||
            order.address ||
            order.direccion ||
            "No registrada",
          cliente:
            getPersonName(
              order.clientName,
              order.customerName,
              order.clienteName,
              order.customer,
              order.cliente,
              order.idCliente,
              order.customerId
            ) || "No registrado",
          estado: stateLabel,
          estadoKey: stateKey,
        };
      });
  }, [orders, productIndex]);

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
                {orderStateData.map((item) => (
                  <div key={item.key} className="orders-state-item">
                    <div className="orders-state-left">
                      <span
                        className="orders-state-dot"
                        style={{ backgroundColor: item.color }}
                      ></span>
                      <p>{item.label}</p>
                    </div>

                    <strong>
                      {item.total} ({item.percent}%)
                    </strong>
                  </div>
                ))}
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
                  <p>No hay productos entregados registrados</p>
                ) : (
                  formattedTopProducts.map((product) => (
                    <div key={product.idProduct} className="top-product-item">
                      <div className="top-product-top">
                        <span>{product.name}</span>
                        <strong>
                          {product.quantitySold} vendidos ({product.percent}%)
                        </strong>
                      </div>

                      <div className="top-product-progress">
                        <div
                          className="top-product-progress-fill"
                          style={{ width: `${product.barPercent}%` }}
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
                                stateColorMap[order.estadoKey] || "#dd944c"
                              }22`,
                              color:
                                stateColorMap[order.estadoKey] || "#94602f",
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