// Preview + component: AbsenceSection with summer vacation message inside discipline section
import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ClipboardList,
  AlertTriangle,
  Info,
  Sparkles,
  Laptop,
  Sigma,
  Code,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Languages,
  Dumbbell,
  Database,
  BarChart3,
  Layers3,
  Wrench,
  CalendarDays,
  Sun,
  Smile,
} from "lucide-react";

// ---------- Data & helpers ----------

const semester1Subjects = [
  {
    name: "Ingineria calculatoarelor și produse program",
    professor: "Dr. Popescu Adrian",
    absences: ["12/10/2025"],
    totalClasses: 14,
    color: "text-blue-600",
  },
  {
    name: "Algebra liniară și geometria analitică",
    professor: "Prof. Ionescu Maria",
    absences: ["02/10/2025", "23/10/2025"],
    totalClasses: 12,
    color: "text-indigo-600",
  },
  {
    name: "Programarea calculatoarelor",
    professor: "Conf. Gheorghe Radu",
    absences: [],
    totalClasses: 14,
    color: "text-cyan-600",
  },
  {
    name: "Analiza matematică",
    professor: "Dr. Marin Elena",
    absences: ["05/09/2025", "19/09/2025", "03/10/2025"],
    totalClasses: 13,
    color: "text-green-600",
  },
  {
    name: "Limba engleză",
    professor: "Lect. Ana Petrescu",
    absences: ["10/09/2025"],
    totalClasses: 10,
    color: "text-purple-600",
  },
  {
    name: "Educație fizică",
    professor: "Prof. Mihai Dima",
    absences: ["17/09/2025"],
    totalClasses: 8,
    color: "text-orange-600",
  },
  {
    name: "Tehnici de programare aplicată",
    professor: "Asist. Ioana Munteanu",
    absences: [],
    totalClasses: 11,
    color: "text-pink-600",
  },
  {
    name: "Etica și securitate umană",
    professor: "Dr. Raluca Tudor",
    absences: ["06/10/2025"],
    totalClasses: 9,
    color: "text-yellow-600",
  },
];

const semester2Subjects = [
  {
    name: "Tehnologii WEB",
    professor: "Dr. Alexandru Vasile",
    absences: [],
    totalClasses: 14,
    color: "text-cyan-600",
  },
  {
    name: "Programarea procedurală",
    professor: "Prof. Ioana Marinescu",
    absences: ["15/03/2025"],
    totalClasses: 13,
    color: "text-blue-700",
  },
  {
    name: "Matematică Discretă",
    professor: "Conf. Daniel Pop",
    absences: ["22/02/2025"],
    totalClasses: 12,
    color: "text-indigo-600",
  },
  {
    name: "Probabilitate și statistică",
    professor: "Dr. Alina Dobre",
    absences: [],
    totalClasses: 11,
    color: "text-green-700",
  },
  {
    name: "Structuri de date şi algoritmi",
    professor: "Dr. Mihai Georgescu",
    absences: ["12/04/2025"],
    totalClasses: 12,
    color: "text-pink-700",
  },
  {
    name: "Baze de date",
    professor: "Conf. Elena Stoica",
    absences: [],
    totalClasses: 14,
    color: "text-yellow-700",
  },
  {
    name: "Limba engleză",
    professor: "Lect. Ana Petrescu",
    absences: ["05/03/2025"],
    totalClasses: 10,
    color: "text-purple-600",
  },
  {
    name: "Educație fizică",
    professor: "Prof. Mihai Dima",
    absences: [],
    totalClasses: 8,
    color: "text-orange-600",
  },
];

const icons: Record<string, React.ComponentType<any>> = {
  "Ingineria calculatoarelor și produse program": Laptop,
  "Algebra liniară și geometria analitică": Sigma,
  "Programarea calculatoarelor": Code,
  "Analiza matematică": BookOpen,
  "Limba engleză": Languages,
  "Educație fizică": Dumbbell,
  "Tehnici de programare aplicată": Wrench,
  "Etica și securitate umană": BarChart3,
  "Tehnologii WEB": Laptop,
  "Programarea procedurală": Code,
  "Matematică Discretă": Sigma,
  "Probabilitate și statistică": BarChart3,
  "Structuri de date şi algoritmi": Layers3,
  "Baze de date": Database,
};

const weekDays = ["Lun", "Mar", "Mie", "Joi", "Vin", "Sâm", "Dum"];
const months = [
  "Ianuarie",
  "Februarie",
  "Martie",
  "Aprilie",
  "Mai",
  "Iunie",
  "Iulie",
  "August",
  "Septembrie",
  "Octombrie",
  "Noiembrie",
  "Decembrie",
];

function generateMonthDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const jsDay = firstDay.getDay();
  const firstDayOffset = (jsDay + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: (number | null)[] = new Array(firstDayOffset).fill(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);
  return days;
}

function getSemester(month: number) {
  if (month >= 8 && month <= 11) return { name: "Semestrul 1", color: "bg-indigo-500", icon: CalendarDays };
  if (month >= 0 && month <= 4) return { name: "Semestrul 2", color: "bg-blue-500", icon: CalendarDays };
  return { name: "Vacanță de vară", color: "bg-green-500", icon: Sun };
}

// ---------- Main component ----------

function AbsenceSection() {
  const [showAbsences, setShowAbsences] = useState(false);
  const [currentYear, setCurrentYear] = useState(2025);
  const [currentMonth, setCurrentMonth] = useState(9); // 0-based, 9 = Octombrie
  const [isCompact, setIsCompact] = useState(false);
  const layoutRef = useRef<HTMLDivElement | null>(null);

  const semester = getSemester(currentMonth);
  const isVacation = semester.name === "Vacanță de vară";
  const subjects = semester.name === "Semestrul 1" ? semester1Subjects : semester2Subjects;
  const [selectedSubject, setSelectedSubject] = useState(subjects[0]);

  // Layout resize logic
  useEffect(() => {
    const BREAKPOINT = 960;
    const updateLayout = () => {
      const width = layoutRef.current?.getBoundingClientRect().width ?? window.innerWidth;
      setIsCompact(width < BREAKPOINT);
    };

    updateLayout();
    window.addEventListener("resize", updateLayout);
    return () => window.removeEventListener("resize", updateLayout);
  }, []);

  // Resetăm disciplina selectată când se schimbă semestrul (dar nu în vacanță)
  useEffect(() => {
    if (!isVacation) {
      setSelectedSubject(subjects[0]);
    }
  }, [semester.name]);

  const percentNumber = (selectedSubject.absences.length / selectedSubject.totalClasses) * 100;
  const percent = percentNumber.toFixed(1);
  const maxAbsences = Math.floor(selectedSubject.totalClasses * 0.3);
  const remaining = Math.max(0, maxAbsences - selectedSubject.absences.length);

  const percentColor =
    percentNumber >= 25
      ? "text-red-700 font-semibold"
      : percentNumber >= 15
      ? "text-yellow-600 font-semibold"
      : "text-green-700";

  const handlePrevMonth = () =>
    setCurrentMonth((prev) => (prev === 0 ? (setCurrentYear((y) => y - 1), 11) : prev - 1));

  const handleNextMonth = () =>
    setCurrentMonth((prev) => (prev === 11 ? (setCurrentYear((y) => y + 1), 0) : prev + 1));

  const getStatus = (day: number, wasAbsent: boolean, isFuture: boolean, isClassDay: boolean) => {
    if (wasAbsent) return { status: "Absent", color: "text-red-700", time: "08:00 - 09:30" };
    if (isFuture && isClassDay)
      return { status: "Urmează să participe", color: "text-blue-700", time: "08:00 - 09:30" };
    if (isClassDay) return { status: "Prezent", color: "text-green-700", time: "08:00 - 09:30" };
    return null;
  };

  const SemesterIcon = semester.icon;

  return (
    <div className="min-h-screen w-full text-blue-900 bg-cover bg-center p-0 m-0 relative overflow-hidden">
      <div className="flex justify-center py-10">
        <Button
          onClick={() => setShowAbsences(!showAbsences)}
          className="bg-gradient-to-r from-blue-700 via-indigo-500 to-cyan-400 text-white px-6 py-3 rounded-xl shadow-lg hover:opacity-90"
        >
          <ClipboardList className="mr-2 h-5 w-5" />
          {showAbsences ? "Ascunde absențele" : "Gestionează absențele"}
        </Button>
      </div>

      {showAbsences && (
        <section className="px-2 sm:px-6 pb-16">
          <Card className="bg-gradient-to-br from-white/90 via-blue-100/80 to-blue-200/70 border border-blue-500 shadow-xl text-blue-900 backdrop-blur-md">
            <CardContent
              ref={layoutRef}
              className={`p-4 sm:p-6 grid gap-6 divide-y sm:divide-y-0 sm:divide-x divide-blue-400 ${
                isCompact ? "grid-cols-1" : "grid-cols-3"
              }`}
            >
              {/* Discipline Section */}
              <div className="space-y-3 sm:pr-6">
                <h2 className="text-lg font-semibold mb-2 text-blue-900 flex items-center gap-2 border-b border-blue-400 pb-2">
                  <Sparkles className="text-cyan-500" /> Discipline
                </h2>
                {isVacation ? (
                  <div className="flex flex-col items-center justify-center text-center text-green-800 bg-gradient-to-br from-green-50 via-white to-yellow-100 p-6 rounded-xl border border-green-300">
                    <Sun className="w-10 h-10 text-yellow-500 mb-2 animate-bounce" />
                    <h3 className="text-xl font-bold mb-1">Vacanță plăcută!</h3>
                    <p className="text-sm max-w-xs">
                      Bucură-te de vară, relaxează-te și reîncarcă-ți energia pentru un nou semestru plin de realizări!
                    </p>
                    <Smile className="w-6 h-6 text-yellow-600 mt-3 animate-pulse" />
                  </div>
                ) : (
                  subjects.map((subject) => {
                    const Icon = icons[subject.name] || BookOpen;
                    const isSelected = selectedSubject.name === subject.name;
                    return (
                      <div
                        key={subject.name}
                        onClick={() => setSelectedSubject(subject)}
                        className={`cursor-pointer p-3 rounded-xl border-2 transition-all shadow-md flex items-center gap-3 relative overflow-hidden group ${
                          isSelected
                            ? "bg-gradient-to-r from-indigo-200 via-cyan-100 to-blue-50 border-cyan-400 text-blue-900"
                            : "border-blue-300 hover:bg-blue-100 text-blue-900 bg-white/60"
                        }`}
                      >
                        <Icon
                          className={`h-5 w-5 transition-all ${
                            isSelected ? "text-blue-800" : subject.color
                          }`}
                        />
                        <span className="relative z-10 font-medium leading-tight whitespace-nowrap overflow-hidden text-ellipsis">
                          {subject.name}
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-200/20 to-cyan-200/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                      </div>
                    );
                  })
                )}
              </div>

              {/* Calendar Section */}
              <div className="px-0 sm:px-6 bg-white/90 rounded-xl shadow-md p-4 border border-blue-200 overflow-hidden">
                <div className="flex flex-wrap sm:flex-nowrap sm:items-center sm:justify-between w-full gap-2 sm:gap-3 mb-2 border-b border-blue-400 pb-2 text-center sm:text-left">
                  <div className="flex items-center gap-2 shrink-0">
                    <Sparkles className="text-indigo-400" />
                    <span className="font-semibold text-lg text-blue-900">Calendar</span>
                  </div>
                  <div className="flex flex-wrap justify-center sm:justify-end items-center gap-2 text-sm w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={handlePrevMonth}
                      className="p-1 rounded-full hover:bg-blue-100 text-blue-800 z-10"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="font-medium text-blue-900 text-center min-w-[120px] max-w-[150px] truncate">
                      {months[currentMonth]} {currentYear}
                    </span>
                    <button
                      type="button"
                      onClick={handleNextMonth}
                      className="p-1 rounded-full hover:bg-blue-100 text-blue-800 z-10"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="flex justify-center mb-2">
                  <div
                    className={`flex items-center gap-2 px-3 py-1 rounded-full text-white text-sm font-medium shadow-md ${semester.color}`}
                  >
                    <SemesterIcon className="w-4 h-4 shrink-0" />
                    <span className="whitespace-nowrap">{semester.name}</span>
                  </div>
                </div>

                {!isVacation && (
                  <>
                    <div className="hidden sm:grid grid-cols-7 text-center text-blue-900 font-semibold mb-2">
                      {weekDays.map((day) => (
                        <div
                          key={day}
                          className="py-2 border-b border-blue-200 flex items-center justify-center w-full"
                        >
                          {day}
                        </div>
                      ))}
                    </div>

                    <div
                      className="grid grid-cols-7 border border-blue-200 rounded-lg overflow-visible text-center auto-rows-fr"
                      style={{ gridAutoRows: "minmax(40px, 1fr)" }}
                    >
                      {generateMonthDays(currentYear, currentMonth).map((day, i) => {
                        const monthStr = String(currentMonth + 1).padStart(2, "0");
                        const date = day
                          ? `${day.toString().padStart(2, "0")}/${monthStr}/${currentYear}`
                          : null;
                        const isClassDay = !!day && day % 2 === 0;
                        const isFuture = !!day && day > 20;
                        const wasAbsent = !!date && selectedSubject.absences.includes(date);
                        const statusInfo = day && getStatus(day, wasAbsent, isFuture, isClassDay || false);

                        let bg = "bg-transparent opacity-60";
                        if (isClassDay) bg = "bg-green-200 text-green-900";
                        if (wasAbsent) bg = "bg-red-200 text-red-900";
                        if (isFuture && isClassDay) bg = "bg-blue-200 text-blue-900";

                        return (
                          <div
                            key={`${currentYear}-${currentMonth}-${i}`}
                            className="relative border border-blue-100 flex items-center justify-center text-sm font-medium group w-full aspect-square"
                          >
                            {day && (
                              <>
                                <div
                                  className={`w-full h-full flex items-center justify-center ${bg} transition-transform hover:scale-105 rounded-md shadow-sm`}
                                >
                                  {day}
                                </div>
                                {statusInfo && (
                                  <div className="absolute z-50 bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-white/95 text-blue-900 text-xs px-3 py-1 rounded-lg shadow-lg border border-blue-200 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap min-w-max">
                                    <span className={`${statusInfo.color} font-semibold`}>
                                      {statusInfo.status}
                                    </span>
                                    <br />
                                    <span className="text-[11px] text-gray-600">{statusInfo.time}</span>
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-white border-l border-b border-blue-200 rotate-45" />
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>

              {/* Details Section */}
              <div className="pl-0 sm:pl-6 mt-6 sm:mt-0">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-blue-900 border-b border-blue-400 pb-2">
                  <Info className="h-5 w-5 text-blue-700" /> Detalii
                </h3>
                {!isVacation && (
                  <div className="space-y-2 bg-gradient-to-br from-white/80 via-blue-50/80 to-indigo-100/70 rounded-xl shadow-lg p-4 border-2 border-indigo-300">
                    <p className="text-sm">
                      <strong className="text-blue-900">Profesor:</strong>{" "}
                      <span className="text-blue-800">{selectedSubject.professor}</span>
                    </p>
                    <p className="text-sm">
                      <strong className="text-blue-900">Total absențe:</strong>{" "}
                      <span className="text-blue-800">{selectedSubject.absences.length}</span>
                    </p>
                    <p className="text-sm">
                      <strong className="text-blue-900">Procentaj:</strong>{" "}
                      <span className={percentColor}>{percent}%</span>
                    </p>
                    <p className="text-sm">
                      <strong className="text-blue-900">Mai poate lipsi:</strong>{" "}
                      <span
                        className={
                          remaining > 0 ? "text-green-700" : "text-red-700 font-semibold"
                        }
                      >
                        {remaining > 0 ? `${remaining} cursuri` : "Depășit!"}
                      </span>
                    </p>
                    {percentNumber >= 30 && (
                      <div className="flex items-center gap-2 text-red-700 mt-2 bg-red-100/60 p-2 rounded-md border border-red-300">
                        <AlertTriangle className="h-5 w-5" />
                        <span className="text-sm">Pragul de 30% a fost depășit!</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </section>
      )}
    </div>
  );
}

export default function PreviewAbsenceSection() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-7xl w-full shadow-2xl rounded-3xl overflow-hidden border border-blue-200">
        <AbsenceSection />
      </div>
    </div>
  );
}
