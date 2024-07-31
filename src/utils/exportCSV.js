// src/utils/exportCSV.js
export const exportToCSV = (data, filename = 'data.csv') => {
    const csvData = data.map(row => Object.values(row).join(',')).join('\n');
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };