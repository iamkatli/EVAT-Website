import React from 'react';

function ReliabilityToggle({ active, onToggle }) {
  return (
    <button
      onClick={onToggle}
      aria-pressed={active}
      style={{
        position: 'absolute',
        top: 12,
        right: 12,
        zIndex: 1000,
        padding: '10px 14px',
        backgroundColor: active ? '#28a745' : '#333',
        color: '#fff',
        border: 'none',
        borderRadius: 6,
        cursor: 'pointer'
      }}
    >
      {active ? 'Hide Reliability Layer' : 'Show Reliability Layer'}
    </button>
  );
}

export default ReliabilityToggle;
