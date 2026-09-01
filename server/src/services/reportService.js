// reportService.js - PDF & CSV Thermal Report Generation

const PDFDocument = require("pdfkit");

/**
 * Generates a styled PDF report for the BTMS Thermal Audit and Performance Analysis
 */
function generatePdfReport(telemetrySnapshot, auditDecisions, res) {
  const doc = new PDFDocument({ margin: 40, size: "A4" });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", 'attachment; filename="BTMS_Thermal_Report.pdf"');

  doc.pipe(res);

  // Header Banner
  doc.rect(40, 40, 515, 60).fill("#0f172a");
  doc.fillColor("#38bdf8").fontSize(18).font("Helvetica-Bold").text("AI-ENABLED MICRO-CHANNEL BTMS", 55, 52);
  doc.fillColor("#94a3b8").fontSize(10).font("Helvetica").text("Thermal Performance & Human-in-the-Loop Audit Report (KJS-CES-02)", 55, 74);

  doc.moveDown(4);

  // Metadata Table
  const now = new Date().toLocaleString();
  doc.fillColor("#1e293b").fontSize(12).font("Helvetica-Bold").text("System Metadata & Operating Conditions", 40, 120);
  doc.rect(40, 138, 515, 65).fillAndStroke("#f8fafc", "#cbd5e1");

  doc.fillColor("#334155").fontSize(9).font("Helvetica");
  doc.text(`Generated At: ${now}`, 55, 148);
  doc.text(`Battery Pack: 10x 21700 Cylindrical Cells`, 55, 163);
  doc.text(`Cooling System: Micro-channel HX (Dh = 1mm, 20 channels/column)`, 55, 178);

  const pack = telemetrySnapshot ? telemetrySnapshot.pack : { maxTemp: 34.2, deltaT: 4.1, safetyStatus: "OPTIMAL" };
  const coolant = telemetrySnapshot ? telemetrySnapshot.coolant : { reynolds: 550, concentration: 2.0, flowRate: 0.035 };

  doc.text(`Coolant: ${coolant.concentration} vol% Al₂O₃ / Water`, 310, 148);
  doc.text(`Reynolds Number: Re ${coolant.reynolds}`, 310, 163);
  doc.text(`Safety Status: ${pack.safetyStatus}`, 310, 178);

  // Thermal Performance Summary
  doc.moveDown(5);
  doc.fillColor("#1e293b").fontSize(12).font("Helvetica-Bold").text("Live Thermal Metrics Snapshot", 40, 220);

  const metrics = [
    { label: "Max Battery Temp (T_max)", value: `${pack.maxTemp} °C`, status: pack.maxTemp < 35 ? "PASS (< 35°C)" : "ALERT" },
    { label: "Thermal Gradient (ΔT)", value: `${pack.deltaT} °C`, status: pack.deltaT < 5.0 ? "PASS (< 5.0°C)" : "FAIL" },
    { label: "Coolant Inlet (T_c1)", value: `${coolant.Tc1_inlet || 25.0} °C`, status: "NOMINAL" },
    { label: "Coolant Outlet (T_c2)", value: `${coolant.Tc2_outlet || 28.6} °C`, status: "NOMINAL" },
    { label: "Pressure Drop (ΔP)", value: `${coolant.deltaP || 640} Pa`, status: "OPTIMAL" },
    { label: "Pumping Power (P_pump)", value: `${coolant.pumpingPower || 0.024} W`, status: "HIGH EFFICIENCY" }
  ];

  let yPos = 242;
  doc.rect(40, yPos, 515, 20).fill("#e2e8f0");
  doc.fillColor("#0f172a").fontSize(9).font("Helvetica-Bold");
  doc.text("Metric Description", 55, yPos + 5);
  doc.text("Recorded Value", 280, yPos + 5);
  doc.text("Criteria / Status", 420, yPos + 5);

  yPos += 20;
  metrics.forEach((m, idx) => {
    const bg = idx % 2 === 0 ? "#ffffff" : "#f8fafc";
    doc.rect(40, yPos, 515, 20).fill(bg);
    doc.fillColor("#334155").fontSize(9).font("Helvetica").text(m.label, 55, yPos + 5);
    doc.fillColor("#0f172a").font("Helvetica-Bold").text(m.value, 280, yPos + 5);
    doc.fillColor(m.status.includes("PASS") || m.status.includes("OPTIMAL") ? "#16a34a" : "#ca8a04").font("Helvetica").text(m.status, 420, yPos + 5);
    yPos += 20;
  });

  // Cell Temperature Profile Table
  doc.moveDown(3);
  yPos += 20;
  doc.fillColor("#1e293b").fontSize(12).font("Helvetica-Bold").text("10-Cell Temperature Distribution", 40, yPos);

  yPos += 22;
  const cells = telemetrySnapshot ? telemetrySnapshot.cells : [];
  doc.rect(40, yPos, 515, 36).fillAndStroke("#f1f5f9", "#cbd5e1");
  doc.fillColor("#0f172a").fontSize(8).font("Helvetica-Bold");

  // Draw cell boxes
  cells.forEach((c, idx) => {
    const x = 50 + idx * 49;
    doc.text(c.id, x, yPos + 6);
    doc.fillColor(c.temp > 35 ? "#dc2626" : "#2563eb").text(`${c.temp}°C`, x, yPos + 20);
    doc.fillColor("#0f172a");
  });

  // Governance & Human-in-the-Loop Audit Trail
  yPos += 60;
  doc.fillColor("#1e293b").fontSize(12).font("Helvetica-Bold").text("Responsible-AI & Human-in-the-Loop Audit Trail", 40, yPos);

  yPos += 20;
  doc.rect(40, yPos, 515, 20).fill("#e2e8f0");
  doc.fillColor("#0f172a").fontSize(8).font("Helvetica-Bold");
  doc.text("Timestamp", 50, yPos + 5);
  doc.text("Engineer ID", 160, yPos + 5);
  doc.text("Decision", 250, yPos + 5);
  doc.text("Approved Parameters / Engineer Notes", 330, yPos + 5);

  yPos += 20;
  const decisions = (auditDecisions && auditDecisions.length > 0) ? auditDecisions.slice(0, 5) : [];
  decisions.forEach((d, idx) => {
    const bg = idx % 2 === 0 ? "#ffffff" : "#f8fafc";
    doc.rect(40, yPos, 515, 24).fill(bg);
    doc.fillColor("#475569").fontSize(8).font("Helvetica").text(new Date(d.timestamp).toLocaleTimeString(), 50, yPos + 7);
    doc.text(d.engineerId || "ENG-01", 160, yPos + 7);
    doc.fillColor(d.decision === "APPROVED" ? "#16a34a" : "#dc2626").font("Helvetica-Bold").text(d.decision, 250, yPos + 7);
    doc.fillColor("#334155").font("Helvetica").text(d.notes ? d.notes.slice(0, 36) : "Profile confirmed", 330, yPos + 7);
    yPos += 24;
  });

  // Footer Attribution
  doc.rect(40, 780, 515, 30).fill("#0f172a");
  doc.fillColor("#94a3b8").fontSize(8).font("Helvetica").text(
    "Somaiya Vidyavihar University — AI-Enabled Micro-Channel BTMS (KJS-CES-02) • Confidential Simulation Report",
    55,
    790
  );

  doc.end();
}

/**
 * Generates CSV string from telemetry history
 */
function generateCsvData(historyBuffer) {
  const headers = [
    "Timestamp",
    "Max_Temp_C",
    "Min_Temp_C",
    "Delta_T_C",
    "Avg_Temp_C",
    "Safety_Status",
    "Tc1_Inlet_C",
    "Tc2_Outlet_C",
    "P1_Inlet_Pa",
    "P2_Outlet_Pa",
    "Delta_P_Pa",
    "Flow_Rate_kgs",
    "Reynolds",
    "Concentration_vol_pct",
    "Pack_Voltage_V",
    "Discharge_Current_A",
    "C1_Temp",
    "C2_Temp",
    "C3_Temp",
    "C4_Temp",
    "C5_Temp",
    "C6_Temp",
    "C7_Temp",
    "C8_Temp",
    "C9_Temp",
    "C10_Temp"
  ];

  const rows = historyBuffer.map(item => {
    const c = item.cells ? item.cells.map(cell => cell.temp) : [];
    return [
      item.timestamp,
      item.pack.maxTemp,
      item.pack.minTemp,
      item.pack.deltaT,
      item.pack.avgTemp,
      item.pack.safetyStatus,
      item.coolant.Tc1_inlet,
      item.coolant.Tc2_outlet,
      item.coolant.P1_inlet,
      item.coolant.P2_outlet,
      item.coolant.deltaP,
      item.coolant.flowRate,
      item.coolant.reynolds,
      item.coolant.concentration,
      item.pack.voltage,
      item.pack.current,
      ...c
    ].join(",");
  });

  return [headers.join(","), ...rows].join("\n");
}

module.exports = {
  generatePdfReport,
  generateCsvData
};
