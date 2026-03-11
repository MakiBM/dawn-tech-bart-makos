import React, { useState, useEffect, useCallback } from 'react';

const customStyles = {
  root: {
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    WebkitFontSmoothing: 'antialiased',
  },
  sectionMetrics: {
    backgroundColor: '#2C3125',
    color: '#D9E2B6',
    padding: '24px 48px 96px',
    display: 'flex',
    flexDirection: 'column',
    gap: '48px',
  },
  sectionData: {
    backgroundColor: '#F4F3ED',
    color: '#1E1E1E',
    padding: '48px 48px 96px',
    flexGrow: 1,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '12px',
    borderTop: '1px solid #D9E2B6',
  },
  logo: {
    fontWeight: 800,
    fontSize: '14px',
    letterSpacing: '0.02em',
  },
  tMono: {
    fontFamily: "'Courier New', Courier, monospace",
    fontSize: '11px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  tDisplay: {
    fontSize: 'clamp(2.5rem, 5vw, 4rem)',
    fontWeight: 500,
    letterSpacing: '-0.04em',
    lineHeight: 1.1,
  },
  tTitle: {
    fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
    fontWeight: 500,
    letterSpacing: '-0.03em',
    lineHeight: 1.1,
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '48px',
  },
  metricCard: {
    borderTop: '1px solid rgba(217, 226, 182, 0.3)',
    paddingTop: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    position: 'relative',
  },
  metricValueWrapper: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  metricCardBottom: {
    marginTop: 'auto',
    borderTop: '1px solid rgba(217, 226, 182, 0.3)',
    paddingTop: '12px',
    display: 'flex',
    justifyContent: 'space-between',
  },
  shapeCluster: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 12px)',
    gridTemplateRows: 'repeat(2, 12px)',
    gap: '4px',
    opacity: 0.8,
  },
  dataHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: '48px',
    borderTop: '1px solid #1E1E1E',
    paddingTop: '12px',
  },
  navLink: {
    color: '#1E1E1E',
    textDecoration: 'none',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
  },
  controls: {
    display: 'flex',
    gap: '24px',
  },
  tableContainer: {
    width: '100%',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
  },
  th: {
    padding: '12px 0',
    borderBottom: '1px solid rgba(30, 30, 30, 0.2)',
    color: 'rgba(30, 30, 30, 0.5)',
    fontWeight: 'normal',
    fontFamily: "'Courier New', Courier, monospace",
    fontSize: '11px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  td: {
    padding: '24px 0',
    borderBottom: '1px solid rgba(30, 30, 30, 0.2)',
    fontSize: '1.1rem',
    letterSpacing: '-0.01em',
  },
  tdMono: {
    padding: '24px 0',
    borderBottom: '1px solid rgba(30, 30, 30, 0.2)',
    fontFamily: "'Courier New', Courier, monospace",
    fontSize: '12px',
    letterSpacing: 0,
  },
  emptyState: {
    padding: '96px 0',
    textAlign: 'left',
    borderBottom: '1px solid rgba(30, 30, 30, 0.2)',
  },
  statusBadge: {
    display: 'inline-block',
    padding: '2px 8px',
    border: '1px solid rgba(30, 30, 30, 0.2)',
    fontSize: '11px',
    textTransform: 'uppercase',
    fontFamily: "'Courier New', Courier, monospace",
  },
};

const ShapeCluster = () => (
  <div style={customStyles.shapeCluster}>
    <div style={{
      backgroundColor: '#D9E2B6',
      borderRadius: '999px',
      width: '100%',
      height: '100%',
      gridColumn: 2,
      gridRow: 1,
      transform: 'rotate(45deg)',
    }} />
    <div style={{
      backgroundColor: '#D9E2B6',
      borderRadius: '999px',
      width: '100%',
      height: '100%',
      gridColumn: 1,
      gridRow: 2,
      transform: 'rotate(-45deg)',
    }} />
    <div style={{
      backgroundColor: '#D9E2B6',
      borderRadius: '999px',
      width: '100%',
      height: '100%',
      gridColumn: 2,
      gridRow: 2,
    }} />
    <div style={{
      backgroundColor: '#D9E2B6',
      borderRadius: '999px',
      width: '100%',
      height: '100%',
      gridColumn: 3,
      gridRow: 2,
      transform: 'rotate(45deg)',
    }} />
  </div>
);

const MetricCard = ({ title, value, updating, bottomLeft, bottomRight, showShape }) => (
  <div style={customStyles.metricCard}>
    <div style={customStyles.tTitle} dangerouslySetInnerHTML={{ __html: title }} />
    <div style={customStyles.metricValueWrapper}>
      <div style={{
        ...customStyles.tDisplay,
        fontVariantNumeric: 'tabular-nums',
        transition: 'opacity 0.3s ease',
        opacity: updating ? 0.5 : 1,
      }}>
        {value}
      </div>
      {showShape && <ShapeCluster />}
    </div>
    <div style={{
      ...customStyles.metricCardBottom,
      ...customStyles.tMono,
      color: 'rgba(217, 226, 182, 0.6)',
    }}>
      <span>{bottomLeft}</span>
      <span>{bottomRight}</span>
    </div>
  </div>
);

const ActionButton = ({ onClick, children }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'none',
        border: 'none',
        color: '#1E1E1E',
        cursor: 'pointer',
        padding: '4px 0',
        borderBottom: hovered ? '1px solid #1E1E1E' : '1px solid transparent',
        transition: 'border-color 0.2s',
        fontFamily: "'Courier New', Courier, monospace",
        fontSize: '11px',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
      }}
    >
      {children}
    </button>
  );
};

const initialOrders = [
  { id: 'ORD-8472', date: '2023-10-24', country: 'Japan', status: 'Fulfilled', amount: 1250.00 },
  { id: 'ORD-3921', date: '2023-10-24', country: 'Germany', status: 'Processing', amount: 840.50 },
  { id: 'ORD-9102', date: '2023-10-23', country: 'United States', status: 'Fulfilled', amount: 3200.75 },
];

const currencyFmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

const App = () => {
  const [orders, setOrders] = useState(initialOrders);
  const [updating, setUpdating] = useState(false);
  const [displayedMetrics, setDisplayedMetrics] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    uniqueCountries: 0,
  });
  const [navLinkHovered, setNavLinkHovered] = useState(false);

  const calculateMetrics = useCallback((orderList) => {
    const totalOrders = orderList.length;
    const totalRevenue = orderList.reduce((sum, order) => sum + order.amount, 0);
    const uniqueCountries = new Set(orderList.map(o => o.country)).size;
    return { totalOrders, totalRevenue, uniqueCountries };
  }, []);

  useEffect(() => {
    setUpdating(true);
    const timer = setTimeout(() => {
      const metrics = calculateMetrics(orders);
      setDisplayedMetrics(metrics);
      setUpdating(false);
    }, 150);
    return () => clearTimeout(timer);
  }, [orders, calculateMetrics]);

  const addRandomOrder = () => {
    const countries = ['United Kingdom', 'Canada', 'Australia', 'France', 'Brazil', 'Japan', 'Germany', 'United States'];
    const statuses = ['Processing', 'Fulfilled', 'Pending'];
    const newOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0],
      country: countries[Math.floor(Math.random() * countries.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      amount: Math.floor(Math.random() * 5000) + (Math.random() * 100),
    };
    setOrders(prev => [...prev, newOrder]);
  };

  const clearOrders = () => {
    setOrders([]);
  };

  const visibleOrders = [...orders].reverse().slice(0, 10);
  const hasOrders = orders.length > 0;

  return (
    <div style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", WebkitFontSmoothing: 'antialiased', display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#F4F3ED' }}>
      {/* Dark Metrics Section */}
      <section style={customStyles.sectionMetrics}>
        <header style={customStyles.header}>
          <div style={customStyles.logo}>ORD.SYS</div>
          <div style={{ ...customStyles.tMono, color: 'rgba(217, 226, 182, 0.6)' }}>System Dashboard</div>
        </header>

        <h1 style={{ ...customStyles.tDisplay, color: '#D9E2B6' }}>
          Order<br />Management
        </h1>

        <div style={customStyles.metricsGrid}>
          <MetricCard
            title="Total<br>Revenue"
            value={currencyFmt.format(displayedMetrics.totalRevenue)}
            updating={updating}
            bottomLeft="Sum of all completed orders"
            bottomRight="USD"
            showShape={true}
          />
          <MetricCard
            title="Total<br>Orders"
            value={displayedMetrics.totalOrders}
            updating={updating}
            bottomLeft="Active database count"
            bottomRight={displayedMetrics.totalOrders > 0 ? '100.00%' : '0.00%'}
            showShape={false}
          />
          <MetricCard
            title="Global<br>Reach"
            value={displayedMetrics.uniqueCountries}
            updating={updating}
            bottomLeft="Unique destination countries"
            bottomRight="GEO"
            showShape={false}
          />
        </div>
      </section>

      {/* Light Data Section */}
      <section style={customStyles.sectionData}>
        <div style={customStyles.dataHeader}>
          <a
            href="#"
            style={{
              ...customStyles.navLink,
              ...customStyles.tTitle,
              opacity: navLinkHovered ? 0.5 : 1,
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={() => setNavLinkHovered(true)}
            onMouseLeave={() => setNavLinkHovered(false)}
            onClick={e => e.preventDefault()}
          >
            Order Overview{' '}
            <span style={{ fontFamily: "'Courier New', Courier, monospace", fontSize: '1rem' }}>→</span>
          </a>
          <div style={customStyles.controls}>
            <ActionButton onClick={addRandomOrder}>+ Simulate Order</ActionButton>
            <ActionButton onClick={clearOrders}>× Clear Dataset</ActionButton>
          </div>
        </div>

        {hasOrders ? (
          <table style={customStyles.table}>
            <thead>
              <tr>
                <th style={customStyles.th}>Order ID</th>
                <th style={customStyles.th}>Date</th>
                <th style={customStyles.th}>Country</th>
                <th style={customStyles.th}>Status</th>
                <th style={{ ...customStyles.th, textAlign: 'right' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {visibleOrders.map((order, index) => (
                <tr key={`${order.id}-${index}`}>
                  <td style={customStyles.tdMono}>{order.id}</td>
                  <td style={{ ...customStyles.tdMono, color: 'rgba(30, 30, 30, 0.5)' }}>{order.date}</td>
                  <td style={customStyles.td}>{order.country}</td>
                  <td style={customStyles.td}>
                    <span style={customStyles.statusBadge}>{order.status}</span>
                  </td>
                  <td style={{ ...customStyles.tdMono, textAlign: 'right' }}>{currencyFmt.format(order.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={customStyles.emptyState}>
            <div style={{ ...customStyles.tTitle, color: 'rgba(30, 30, 30, 0.5)' }}>System idling.</div>
            <div style={{ ...customStyles.tMono, marginTop: '12px', color: 'rgba(30, 30, 30, 0.5)' }}>Dataset contains 0 records.</div>
          </div>
        )}
      </section>
    </div>
  );
};

export default App;