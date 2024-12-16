"use server";

import jsPDF from "jspdf";
import { format, eachDayOfInterval, getDay } from "date-fns";
import { es } from "date-fns/locale";

export async function generateHabitTrackerPDF(habitData: {
  habitName: string;
  startDate: string;
  endDate: string;
  phrase: string;
  signature: string;
}) {
  const { habitName, startDate, endDate, phrase, signature } = habitData;

  // Crear el documento PDF
  const doc = new jsPDF();

  // Colores personalizados
  const orangeColor = "#FFA500";

  // Título principal: Habit Name
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text(habitName, 105, 30, { align: "center" });

  // Fechas: Start Date y End Date en la misma línea
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text(`Inicio: ${format(new Date(startDate), "dd/MM/yyyy", { locale: es })}`, 20, 50);
  doc.text(`Fin: ${format(new Date(endDate), "dd/MM/yyyy", { locale: es })}`, 140, 50);

  // Frase motivacional al centro en itálica
  doc.setFont("helvetica", "italic");
  doc.setFontSize(14);
  doc.text(`"${phrase}"`, 105, 70, { align: "center" });

  // Dibujar el calendario estilizado
  const days = eachDayOfInterval({
    start: new Date(startDate),
    end: new Date(endDate),
  });

  const cellWidth = 25;
  const cellHeight = 15;
  const calendarStartX = 20;
  const calendarStartY = 90;

  // Títulos de los días de la semana
  const weekDays = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);

  weekDays.forEach((day, index) => {
    const x = calendarStartX + index * cellWidth;
    doc.text(day, x + 5, calendarStartY - 5);
  });

  // Dibujar el calendario día por día
  days.forEach((day, index) => {
    const col = getDay(day); // Día de la semana
    const row = Math.floor(index / 7);

    const x = calendarStartX + col * cellWidth;
    const y = calendarStartY + row * cellHeight;

    // Estilo de las celdas
    doc.setDrawColor(0);
    doc.setLineWidth(0.1);
    doc.rect(x, y, cellWidth, cellHeight); // Borde de la celda
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(format(day, "dd", { locale: es }), x + 7, y + 7); // Número del día
  });

  // Firma: Línea con el nombre del usuario debajo
  const signatureLineY = calendarStartY + Math.ceil(days.length / 7) * cellHeight + 20;
  doc.setDrawColor(0);
  doc.setLineWidth(0.5);
  doc.line(20, signatureLineY, 100, signatureLineY); // Línea de la firma

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text(signature, 20, signatureLineY + 10);

  // Marca: "Habit Tracker by BlazeTrack" en la esquina inferior
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text("Made with ", 20, 280); // Texto base

  doc.setTextColor(orangeColor);
  doc.text("Blaze", 55, 280); // Texto en naranja
  doc.setTextColor(0, 0, 0);
  doc.text("Track", 70, 280); // Text

  // Exportar el PDF
  const pdfDataUri = doc.output("datauristring");

  return pdfDataUri; // Devolver el PDF para descarga en el cliente
}
