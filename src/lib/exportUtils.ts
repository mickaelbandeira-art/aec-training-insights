// Auto-size columns
const maxWidth = 50;
const colWidths = Object.keys(data[0] || {}).map((key) => {
  const maxLength = Math.max(
    key.length,
    ...data.map((row) => String(row[key as keyof typeof row]).length)
  );
  return { wch: Math.min(maxLength + 2, maxWidth) };
});
worksheet['!cols'] = colWidths;

// Generate and download file
XLSX.writeFile(workbook, filename);
}
