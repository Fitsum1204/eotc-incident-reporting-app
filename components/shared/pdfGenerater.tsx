"use client";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/* interface Incident {
  title: string;
  category: string;
  location: string;
  date: string;
  verification: string;
} */

export default function ExportPDFButton({ data }: { data: any }) {
  const exportPDF = () => {
    const doc = new jsPDF();
const dataArray = Array.isArray(data) ? data : [data];
    // 1. Add Title to PDF
    doc.setFontSize(18);
    doc.text("EOTC Incident Report Summary", 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);

    // 2. Add Generation Date
    doc.text(`Report Generated: ${new Date().toLocaleDateString()}`, 14, 30);

    // 3. Create the Table
    autoTable(doc, {
      startY: 35,
      head: [["Title", "Category", "Location", "Date", "Status"]],
      body:dataArray.map((item) => [
        item.title,
        item.category,
        item.location,
        item.date,
        item.verification.toUpperCase(),
      ]),
      headStyles: { fillColor: [31, 41, 55] }, // Dark slate header
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });

    // 4. Download the file
   doc.save(`incident-${dataArray[0]?._id || 'export'}.pdf`);
  };

  return (
    <button
      onClick={exportPDF}
      className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
    >
      <svg className="w-5 h-5 cursor-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      Export PDF
    </button>
  );
}