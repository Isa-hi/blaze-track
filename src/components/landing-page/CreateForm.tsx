"use client"

import { useState, useEffect } from "react";
import { Flame, RefreshCcw, CalendarIcon } from "lucide-react";
import { differenceInDays, format, isBefore } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

export default function CreateForm() {
    const [habitName, setHabitName] = useState("");
    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
    const [endDate, setEndDate] = useState<Date | undefined>(undefined);
    const [useCustomPhrase, setUseCustomPhrase] = useState(false);
    const [customPhrase, setCustomPhrase] = useState("");
    const [includeSignature, setIncludeSignature] = useState(true); // Update 1: Changed initial state
    const [signature, setSignature] = useState("");
    const [totalDays, setTotalDays] = useState<number | null>(null);
    const [startDateOpen, setStartDateOpen] = useState(false);
    const [endDateOpen, setEndDateOpen] = useState(false);

    const today = new Date();

    useEffect(() => {
        if (startDate && endDate) {
          const days = differenceInDays(endDate, startDate);
          setTotalDays(days > 0 ? days : null);
        } else {
          setTotalDays(null);
        }
      }, [startDate, endDate]);
    
      const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would generate the PDF
        console.log("Generating habit tracker PDF...", {
          habitName,
          startDate,
          endDate,
          phrase: useCustomPhrase
            ? customPhrase
            : "La disciplina es el puente entre metas y logros",
          signature: includeSignature ? signature : "",
        });
      };

  return (
      <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="habit-name" className="text-white">
                Nombre del hábito
              </Label>
              <Input
                id="habit-name"
                value={habitName}
                onChange={(e) => setHabitName(e.target.value)}
                className="bg-white border-zinc-700"
                placeholder="Ej: Hacer ejercicio diariamente"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="start-date" className="text-white">
                Fecha de inicio
              </Label>
              <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal ${
                      !startDate && "text-muted-foreground"
                    }`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? (
                      format(startDate, "PPP")
                    ) : (
                      <span>Selecciona una fecha</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => {
                      setStartDate(date);
                      setStartDateOpen(false);
                    }}
                    initialFocus
                    disabled={(date) => isBefore(date, today)}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="end-date" className="text-white">
                Fecha fin
              </Label>
              <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal ${
                      !endDate && "text-muted-foreground"
                    }`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? (
                      format(endDate, "PPP")
                    ) : (
                      <span>Selecciona una fecha</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={(date) => {
                      setEndDate(date);
                      setEndDateOpen(false);
                    }}
                    initialFocus
                    disabled={(date) => isBefore(date, today)}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {totalDays !== null && (
              <div className="bg-amber-100 p-4 rounded-lg border-2 border-orange-500">
                <p className="text-center flex items-center justify-center gap-2">
                  ¡Crearás este hábito en{" "}
                  <span className="font-bold">{totalDays}</span> días!
                  <Flame className="text-orange-500 animate-pulse" />
                </p>
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="custom-phrase"
                  checked={useCustomPhrase}
                  onCheckedChange={(checked) =>
                    setUseCustomPhrase(checked as boolean)
                  }
                />
                <Label htmlFor="custom-phrase" className="text-white">
                  Usar frase personalizada
                </Label>
              </div>

              {!useCustomPhrase && (
                <div className="flex items-center gap-2 text-zinc-400 italic">
                  "La disciplina es el puente entre metas y logros"
                  <RefreshCcw className="h-4 w-4 cursor-pointer hover:text-orange-500 transition-colors" />
                </div>
              )}

              {useCustomPhrase && (
                <Input
                  value={customPhrase}
                  onChange={(e) => setCustomPhrase(e.target.value)}
                  placeholder="Escribe tu frase personalizada"
                  className="bg-white border-zinc-700"
                />
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox // Update 2: Added defaultChecked prop
                  id="include-signature"
                  defaultChecked
                  checked={includeSignature}
                  onCheckedChange={(checked) =>
                    setIncludeSignature(checked as boolean)
                  }
                />
                <Label htmlFor="include-signature" className="text-white">
                  Nombre y firma de compromiso
                  <span className="text-zinc-400 text-sm ml-2">
                    (Recomendado)
                  </span>
                </Label>
              </div>

              {includeSignature && (
                <Input
                  value={signature}
                  onChange={(e) => setSignature(e.target.value)}
                  placeholder="Tu nombre completo"
                  className="bg-white border-zinc-700"
                />
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white"
            >
              Generar Habit Tracker
            </Button>
          </form>
  );
}