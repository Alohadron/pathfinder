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

// ---------------- Constante generale ----------------

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

// Intervalul anului universitar: 1 septembrie 2025 – 31 august 2026
const START_DATE = new Date(2025, 8, 1); // septembrie = 8
const END_DATE = new Date(2026, 7, 31);  // august = 7

// Azi: 11.11.2025, săptămână impară
const TODAY = new Date(2025, 10, 11); // month index 10 = noiembrie
const TODAY_WEEK_IS_ODD = true;
const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;

// ---------------- Orar semestrul 1 (săptămâni pare/impare) ----------------
// 1 = Luni ... 5 = Vineri

const oddWeekSchedule: Record<number, { subject: string; time: string }[]> = {
  1: [
    { subject: "Algebra liniară și geometria analitică", time: "13:30-15:00" },
    { subject: "Programarea calculatoarelor", time: "15:15-16:45" },
  ],
  2: [
    { subject: "Tehnici de programare aplicată", time: "11:30-13:00" },
    { subject: "Analiza matematică", time: "13:30-15:00" },
    { subject: "Tehnici de programare aplicată", time: "15:15-16:45" },
  ],
  3: [
    { subject: "Tehnici de programare aplicată", time: "11:30-13:00" },
    { subject: "Programarea calculatoarelor", time: "13:30-15:00" },
  ],
  4: [
    { subject: "Etica și securitate umană", time: "11:30-13:00" },
    { subject: "Limba engleză", time: "13:30-15:00" },
  ],
  5: [
    { subject: "Programarea calculatoarelor", time: "08:00-09:30" },
    { subject: "Ingineria calculatoarelor și produse program", time: "09:45-11:15" },
    { subject: "Etica și securitate umană", time: "11:30-13:00" },
    { subject: "Tehnici de programare aplicată", time: "13:30-15:00" },
  ],
};

const evenWeekSchedule: Record<number, { subject: string; time: string }[]> = {
  1: [
    { subject: "Ingineria calculatoarelor și produse program", time: "09:45-11:15" },
    { subject: "Algebra liniară și geometria analitică", time: "11:30-13:00" },
    { subject: "Algebra liniară și geometria analitică", time: "13:30-15:00" },
    { subject: "Programarea calculatoarelor", time: "15:15-16:45" },
  ],
  2: [
    { subject: "Tehnici de programare aplicată", time: "11:30-13:00" },
    { subject: "Analiza matematică", time: "13:30-15:00" },
    { subject: "Analiza matematică", time: "15:15-16:45" },
  ],
  3: [
    { subject: "Tehnici de programare aplicată", time: "11:30-13:00" },
    { subject: "Programarea calculatoarelor", time: "13:30-15:00" },
  ],
  4: [
    { subject: "Educație fizică", time: "09:45-11:15" },
    { subject: "Etica și securitate umană", time: "11:30-13:00" },
    { subject: "Limba engleză", time: "13:30-15:00" },
    { subject: "Analiza matematică", time: "15:15-16:45" },
  ],
  5: [
    { subject: "Ingineria calculatoarelor și produse program", time: "09:45-11:15" },
    { subject: "Etica și securitate umană", time: "11:30-13:00" },
    { subject: "Tehnici de programare aplicată", time: "13:30-15:00" },
  ],
};

// ---------------- Helpers calendar ----------------

function generateMonthDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const jsDay = firstDay.getDay(); // 0=Sun..6=Sat
  const firstDayOffset = (jsDay + 6) % 7; // mutăm Luni la index 0
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: (number | null)[] = new Array(firstDayOffset).fill(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);
  return days;
}

function getSemester(month: number) {
  if (month >= 8 && month <= 11)
    return { name: "Semestrul 1", color: "bg-indigo-500", icon: CalendarDays };
  if (month >= 0 && month <= 4)
    return { name: "Semestrul 2", color: "bg-blue-500", icon: CalendarDays };
  return { name: "Vacanță de vară", color: "bg-green-500", icon: Sun };
}

function startOfIsoWeek(d: Date) {
  const date = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const jsDay = date.getDay(); // 0=Sun..6=Sat
  const isoIndex = (jsDay + 6) % 7; // 0=Mon..6=Sun
  date.setDate(date.getDate() - isoIndex);
  date.setHours(0, 0, 0, 0);
  return date;
}

function isOddWeekForDate(d: Date) {
  const base = startOfIsoWeek(TODAY);
  const cell = startOfIsoWeek(d);
  const diffWeeks = Math.round((cell.getTime() - base.getTime()) / MS_PER_WEEK);
  return diffWeeks % 2 === 0 ? TODAY_WEEK_IS_ODD : !TODAY_WEEK_IS_ODD;
}

function subjectHasClassOnDate(subjectName: string, date: Date) {
  const jsDay = date.getDay();
  const isoWeekday = ((jsDay + 6) % 7) + 1; // 1=Mon..7=Sun
  if (isoWeekday < 1 || isoWeekday > 5) return null;

  const isOdd = isOddWeekForDate(date);
  const weekSchedule = isOdd ? oddWeekSchedule : evenWeekSchedule;
  const dayLessons = weekSchedule[isoWeekday] || [];
  const lesson = dayLessons.find((l) => l.subject === subjectName);
  return lesson || null;
}

// ---------------- Discipline ----------------

const semester1Subjects = [
  {
    name: "Ingineria calculatoarelor și produse program",
    absences: [] as string[],
    totalClasses: 14,
    color: "text-blue-600",
  },
  {
    name: "Algebra liniară și geometria analitică",
    absences: [] as string[],
    totalClasses: 12,
    color: "text-indigo-600",
  },
  {
    name: "Programarea calculatoarelor",
    absences: [] as string[],
    totalClasses: 14,
    color: "text-cyan-600",
  },
  {
    name: "Analiza matematică",
    absences: [] as string[],
    totalClasses: 13,
    color: "text-green-600",
  },
  {
    name: "Limba engleză",
    absences: [] as string[],
    totalClasses: 10,
    color: "text-purple-600",
  },
  {
    name: "Educație fizică",
    absences: [] as string[],
    totalClasses: 8,
    color: "text-orange-600",
  },
  {
    name: "Tehnici de programare aplicată",
    absences: [] as string[],
    totalClasses: 11,
    color: "text-pink-600",
  },
  {
    name: "Etica și securitate umană",
    absences: [] as string[],
    totalClasses: 9,
    color: "text-yellow-600",
  },
];

const semester2Subjects = [
  {
    name: "Tehnologii WEB",
    absences: [] as string[],
    totalClasses: 14,
    color: "text-cyan-600",
  },
  {
    name: "Programarea procedurală",
    absences: [] as string[],
    totalClasses: 13,
    color: "text-blue-700",
  },
  {
    name: "Matematică Discretă",
    absences: [] as string[],
    totalClasses: 12,
    color: "text-indigo-600",
  },
  {
    name: "Probabilitate și statistică",
    absences: [] as string[],
    totalClasses: 11,
    color: "text-green-700",
  },
  {
    name: "Structuri de date şi algoritmi",
    absences: [] as string[],
    totalClasses: 12,
    color: "text-pink-700",
  },
  {
    name: "Baze de date",
    absences: [] as string[],
    totalClasses: 14,
    color: "text-yellow-700",
  },
  {
    name: "Limba engleză",
    absences: [] as string[],
    totalClasses: 10,
    color: "text-purple-600",
  },
  {
    name: "Educație fizică",
    absences: [] as string[],
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

// ---------------- Componentă principală ----------------

function AbsenceSection() {
  const [showAbsences, setShowAbsences] = useState(false);
  const [currentYear, setCurrentYear] = useState(TODAY.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(TODAY.getMonth());
  const [isCompact, setIsCompact] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(semester1Subjects[0]);
  const [lastSelectedBySemester, setLastSelectedBySemester] = useState({
    sem1: semester1Subjects[0].name,
    sem2: semester2Subjects[0].name,
  });

  const layoutRef = useRef<HTMLDivElement | null>(null);

  const semester = getSemester(currentMonth);
  const isVacation = semester.name === "Vacanță de vară";
  const subjects = semester.name === "Semestrul 1" ? semester1Subjects : semester2Subjects;

  // layout responsive în funcție de lățimea cardului
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

  // păstrăm disciplina selectată pe semestru
  useEffect(() => {
    if (semester.name === "Semestrul 1") {
      const name = lastSelectedBySemester.sem1;
      const found = semester1Subjects.find((s) => s.name === name) ?? semester1Subjects[0];
      setSelectedSubject(found);
    } else if (semester.name === "Semestrul 2") {
      const name = lastSelectedBySemester.sem2;
      const found = semester2Subjects.find((s) => s.name === name) ?? semester2Subjects[0];
      setSelectedSubject(found);
    }
    // pentru vacanță nu schimbăm disciplina selectată
  }, [semester.name, lastSelectedBySemester]);

  const percentNumber =
    (selectedSubject.absences.length / Math.max(selectedSubject.totalClasses, 1)) * 100;
  const percent = percentNumber.toFixed(1);
  const maxAbsences = Math.floor(selectedSubject.totalClasses * 0.3);
  const remaining = Math.max(0, maxAbsences - selectedSubject.absences.length);

  const percentColor =
    percentNumber >= 25
      ? "text-red-700 font-semibold"
      : percentNumber >= 15
      ? "text-yellow-600 font-semibold"
      : "text-green-700";

  // Navigare lună, limitată la 1 septembrie 2025 – 31 august 2026
  const handlePrevMonth = () => {
    // Dacă suntem deja în septembrie 2025, nu mai mergem înapoi
    if (currentYear === 2025 && currentMonth === 8) return;

    setCurrentMonth((prev) =>
      prev === 0 ? (setCurrentYear((y) => y - 1), 11) : prev - 1
    );
  };

  const handleNextMonth = () => {
    // Dacă suntem deja în august 2026, nu mai mergem înainte
    if (currentYear === 2026 && currentMonth === 7) return;

    setCurrentMonth((prev) =>
      prev === 11 ? (setCurrentYear((y) => y + 1), 0) : prev + 1
    );
  };

  const getStatus = (isFuture: boolean, hasClass: boolean, time?: string | null) => {
    if (!hasClass) return null;
    if (isFuture)
      return { status: "Urmează să participe", color: "text-blue-700", time: time ?? "" };
    return { status: "Prezent", color: "text-green-700", time: time ?? "" };
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
              {/* Discipline */}
              <div className="space-y-3 sm:pr-6">
                <h2 className="text-lg font-semibold mb-2 text-blue-900 flex items-center gap-2 border-b border-blue-400 pb-2">
                  <Sparkles className="text-cyan-500" /> Discipline
                </h2>
                {isVacation ? (
                  <div className="flex flex-col items-center justify-center text-center text-green-800 bg-gradient-to-br from-green-50 via-white to-yellow-100 p-6 rounded-xl border border-green-300">
                    <Sun className="w-10 h-10 text-yellow-500 mb-2 animate-bounce" />
                    <h3 className="text-xl font-bold mb-1">Vacanță plăcută!</h3>
                    <p className="text-sm max-w-xs">
                      Bucură-te de vară, relaxează-te și reîncarcă-ți energia pentru un nou semestru!
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
                        onClick={() => {
                          setSelectedSubject(subject);
                          setLastSelectedBySemester((prev) =>
                            semester.name === "Semestrul 1"
                              ? { ...prev, sem1: subject.name }
                              : semester.name === "Semestrul 2"
                              ? { ...prev, sem2: subject.name }
                              : prev
                          );
                        }}
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

              {/* Calendar */}
              <div className="px-0 sm:px-6 bg-white/90 rounded-xl shadow-md p-4 border border-blue-200">
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

                {/* header zile săptămână */}
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

                {/* Grid calendar */}
                <div
                  className="grid grid-cols-7 border border-blue-200 rounded-lg overflow-visible text-center auto-rows-fr"
                  style={{ gridAutoRows: "minmax(40px, 1fr)" }}
                >
                  {generateMonthDays(currentYear, currentMonth).map((day, i) => {
                    const monthStr = String(currentMonth + 1).padStart(2, "0");
                    const dateString = day
                      ? `${day.toString().padStart(2, "0")}/${monthStr}/${currentYear}`
                      : null;

                    let lessonForSubject: { subject: string; time: string } | null = null;
                    let isClassDay = false;
                    let isFuture = false;
                    let isToday = false;

                    if (day) {
                      const cellDate = new Date(currentYear, currentMonth, day);

                      if (!isVacation) {
                        const lesson = subjectHasClassOnDate(
                          selectedSubject.name,
                          cellDate
                        );
                        lessonForSubject = lesson;
                        isClassDay = !!lesson;
                      }

                      const todayMid = new Date(
                        TODAY.getFullYear(),
                        TODAY.getMonth(),
                        TODAY.getDate()
                      );
                      const cellMid = new Date(
                        cellDate.getFullYear(),
                        cellDate.getMonth(),
                        cellDate.getDate()
                      );
                      isFuture = cellMid.getTime() > todayMid.getTime();
                      isToday = cellMid.getTime() === todayMid.getTime();
                    }

                    const statusInfo =
                      day && lessonForSubject
                        ? getStatus(isFuture, true, lessonForSubject.time)
                        : null;

                    let bg = "bg-transparent opacity-60";
                    if (isClassDay) bg = "bg-green-200 text-green-900";
                    if (isFuture && isClassDay) bg = "bg-blue-200 text-blue-900";
                    if (isToday) bg = "bg-yellow-200 text-yellow-900";

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
                              <div className="absolute z-50 bottom-full mb-2 left-1/2 -translate-x-1/2 bg-white/95 text-blue-900 text-xs px-3 py-2 rounded-lg shadow-lg border border-blue-200 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none max-w-[240px] whitespace-normal break-words text-center">
                                <span className={`${statusInfo.color} font-semibold block`}>
                                  {statusInfo.status}
                                </span>
                                {statusInfo.time && (
                                  <span className="text-[11px] text-gray-600 font-medium bg-gray-50 px-2 py-0.5 rounded-md inline-block mt-1 whitespace-nowrap">
                                    {statusInfo.time}
                                  </span>
                                )}
                                <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-white border-l border-b border-blue-200 rotate-45" />
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Detalii */}
              <div className="pl-0 sm:pl-6 mt-6 sm:mt-0">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-blue-900 border-b border-blue-400 pb-2">
                  <Info className="h-5 w-5 text-blue-700" /> Detalii
                </h3>
                {!isVacation && (
                  <div className="space-y-2 bg-gradient-to-br from-white/80 via-blue-50/80 to-indigo-100/70 rounded-xl shadow-lg p-4 border-2 border-indigo-300">
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
