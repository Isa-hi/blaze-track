"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar, Quote, Flame, GoalIcon, Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useSearchParams } from "next/navigation";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";

export default function Preview() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PreviewContent />
    </Suspense>
  );
}

function PreviewContent() {
  // Get the habit name, start date, end date, phrase, and signature from the query
  const searchQueryParams = useSearchParams();
  const habitName = searchQueryParams.get("habitName") || "";
  const startDate = searchQueryParams.get("startDate") || "";
  const endDate = searchQueryParams.get("endDate") || "";
  const phrase = searchQueryParams.get("phrase") || "";
  const signature = searchQueryParams.get("signature") || "";

  const parseDate = (dateString: string) => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? new Date() : date;
  };

  // Parse the dates
  const start = parseDate(startDate);
  const end = parseDate(endDate);

  // Check if the dates are valid
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return <div>Error: Invalid date values provided.</div>;
  }

  // Generate calendar data
  const generateCalendarDays = () => {
    const days = [];
    const currentDate = new Date(start);

    while (currentDate <= end) {
      days.push({
        date: new Date(currentDate),
        dayOfWeek: format(currentDate, "EEE", { locale: es }),
        dayOfMonth: format(currentDate, "dd"),
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  const downloadPDF = async () => {
    const element = document.getElementById("pdf-content");
    if (!element) return;

    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [canvas.width, canvas.height],
    });

    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save("habit-tracker.pdf");
  };

  return (
    <>
      <div className="w-full text-center">
        <Button
          onClick={downloadPDF}
          className="mt-4 bg-orange-500 hover:bg-orange-600 text-white"
        >
          <Download className="w-4 h-4 mr-2" />
          Download PDF
        </Button>
      </div>
      <div
        className="w-full max-w-3xl mx-auto p-8 bg-white text-black"
        id="pdf-content"
      >
        {/* Header */}
        <div className="text-center space-y-6 mb-8">
          <div className="flex items-center justify-center gap-3">
            <GoalIcon className="w-8 h-8 text-orange-500" />
            <h1 className="text-4xl font-bold">{habitName}</h1>
          </div>

          <div className="flex items-center justify-center gap-6 text-zinc-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>Inicio: {format(start, "dd/MM/yyyy")}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>Fin: {format(end, "dd/MM/yyyy")}</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-zinc-600 italic">
            <Quote className="w-5 h-5 text-orange-500" />
            <p className="text-lg">&quot;{phrase}&quot;</p>
          </div>
        </div>

        {/* Calendar Grid */}
        <Card className="p-6 shadow-lg mb-8">
          <div className="grid grid-cols-7 gap-4">
            {/* Days of week headers */}
            {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
              <div
                key={day}
                className="text-center font-semibold text-zinc-600 pb-2"
              >
                {day}
              </div>
            ))}

            {/* Calendar boxes */}
            {calendarDays.map((day, index) => (
              <div
                key={index}
                className="aspect-square border-2 border-zinc-200 rounded-lg p-2 hover:border-orange-500 transition-colors duration-200 flex items-center justify-center"
              >
                <span className="text-lg font-medium">{day.dayOfMonth}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Signature */}
        <div className="flex flex-col items-center gap-2 pt-14">
          <div className="w-48 border-t-2 border-zinc-300 pt-2">
            <p className="text-center text-zinc-600">{signature}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 flex items-center justify-center gap-2 text-zinc-400">
          <span>Made with</span>
          <Flame className="w-4 h-4 text-orange-500" />
          <p className="font-bold text-orange-500">
            Blaze<span className="text-black">Track</span>
          </p>
        </div>
      </div>
    </>
  );
}
