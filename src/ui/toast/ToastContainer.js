import React from 'react';

export default function ToastContainer({toasts}) {
  return (
    <div style={styles.container}>
      {toasts.map(t => (
        <div key={t.id} style={styles.toast}>
          {t.message}
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: {
    position: 'fixed',
    top: 20,
    right: 20,
    zIndex: 10000,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  toast: {
    background: '#d83f31',
    color: '#fff',
    padding: '12px 16px',
    borderRadius: 8,
    minWidth: 220,
    fontSize: 14,
    fontWeight: 500,
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  },
};
