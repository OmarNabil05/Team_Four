import { useMemo, useState, useCallback, useEffect } from "react";
import type { FormEvent } from "react";
import { motion } from "framer-motion";
import { PageTransition } from "../components/common/PageTransition";
import { SectionHeading } from "../components/common/SectionHeading";
import { Button } from "../components/ui/Button";
import { FaPen } from "react-icons/fa";
import { MdTableRestaurant } from "react-icons/md";
import { FaRegCalendarDays } from "react-icons/fa6";

import { FaClock ,FaUser ,FaTrash ,FaCheckCircle} from "react-icons/fa";

import type {
  TableItem,
  AvailableTableSearch,
  Reservation,
  TableClass,
} from "../types";
import clsx from "clsx";
import {
  fetchTables,
  fetchUserReservations,
  updateReservation,
  cancelReservation,
} from "../services/reservationService";
import env from "../config/env";


// eslint-disable-next-line react-refresh/only-export-components
export const fetchAvailableTables = async (
  search: AvailableTableSearch
): Promise<TableItem[]> => {
  const tables = await fetchTables();

  return tables.filter((table) => {
    if (table.maxSeats < search.guests) return false;
    if (search.tableClass && table.category !== search.tableClass) return false;
    if (table.reserved) return false;

    return true;
  });
};
type ReservationView = Reservation & {
  _id?: string;
  table?: { _id: string; name: string };
  timeEnd?: string;
  durationMinutes?: number;
  guests?: number;
  status: "pending" | "confirmed" | "cancelled" | "completed" | "accepted" | "refused";
};

// Helper component for the Table Card
const TableCard = ({
  table,
  onReserve,
  isReserved,
}: {
  table: TableItem;
  onReserve: (table: TableItem) => void;
  isReserved: boolean;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className={clsx(
      "glass-sheen rounded-xl p-6 space-y-3 cursor-pointer transition-all duration-300",
      isReserved
        ? "border-2 border-emerald-500 bg-emerald-900/30"
        : !table.reserved
        ? "hover:border-accent/60 border border-white/10"
        : "opacity-50 cursor-not-allowed border border-white/10"
    )}
    onClick={() => !table.reserved && !isReserved && onReserve(table)}
  >
    <div className="flex items-center justify-between">
      <h3 className="text-xl font-semibold text-white flex items-center">
        <MdTableRestaurant className="w-8 h-8 text-emerald-400" />
        {table.name}
      </h3>
      <span
        className={clsx(
          "px-3 py-1 text-xs font-medium rounded-full",
          table.category === "a" && "bg-red-500/20 text-red-400",
          table.category === "b" && "bg-yellow-500/20 text-yellow-400",
          table.category === "c" && "bg-blue-500/20 text-blue-400",
          table.category === "d" && "bg-purple-500/20 text-purple-400"
        )}
      >
        كلاس {table.category}
      </span>
    </div>
    <p className="text-sm text-white/70">سعة: {table.maxSeats} أفراد</p>
    <p
      className={clsx(
        "text-sm font-medium",
        !table.reserved ? "text-emerald-400" : "text-red-400"
      )}
    >
      {!table.reserved ? "متاحة للحجز" : "غير متاحة"}
    </p>
  </motion.div>
);

// Helper component for the User Reservation Card

interface UserReservationCardProps {
  reservation: ReservationView;
  onEdit: (reservation: ReservationView) => void;
  onCancel: (reservation: ReservationView) => void;
  cancelLoading?: boolean;
}

const UserReservationCard = ({
  reservation,
  onEdit,
  onCancel,
  cancelLoading,
}: UserReservationCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="glass-sheen rounded-xl p-6 space-y-3 border border-white/10"
  >
    {/* Header */}
    <div className="flex items-center justify-between">
      <h3 className="text-xl font-semibold text-white flex items-center">
        <MdTableRestaurant className="w-6 h-6 mr-2 text-accent" />
        حجز الطاولة {reservation.table?.name ?? reservation.tableId}
      </h3>
      <span
        className={clsx(
          "px-3 py-1 text-xs font-medium rounded-full",
          (reservation.status === "confirmed" || reservation.status === "accepted") &&
            "bg-emerald-500/20 text-emerald-400",
          reservation.status === "pending" &&
            "bg-yellow-500/20 text-yellow-400",
          (reservation.status === "cancelled" || reservation.status === "refused") && "bg-red-500/20 text-red-400"
        )}
      >
        {(reservation.status === "confirmed" || reservation.status === "accepted") && "مقبول"}
        {reservation.status === "pending" && "قيد الانتظار"}
        {(reservation.status === "cancelled" || reservation.status === "refused") && "ملغي"}
        {reservation.status === "completed" && "مكتمل"}
      </span>
    </div>

    {/* Details */}
    <div className="text-sm text-white/70 space-y-1">
      <p className="flex items-center">
        <FaRegCalendarDays className="w-4 h-4 ml-2" />
        التاريخ: {new Date(reservation.timeStart).toLocaleDateString("ar-EG")}
      </p>
      <p className="flex items-center">
        <FaClock className="w-4 h-4 ml-2" />
        الوقت:{" "}
        {new Date(reservation.timeStart).toLocaleTimeString("ar-EG", {
          hour: "2-digit",
          minute: "2-digit",
        })}{" "}
        -{" "}
        {new Date(
          reservation.timeEnd ?? reservation.timeStart
        ).toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" })}
      </p>
      <p className="flex items-center">
        <FaUser className="w-4 h-4 ml-2" />
        عدد الأفراد: {reservation.peopleCount}
      </p>
      {reservation.message && (
        <p className="text-white/60 mt-2">ملاحظات: {reservation.message}</p>
      )}
    </div>

    {/* Actions */}
    <div className="flex space-x-2 rtl:space-x-reverse pt-2">
      {reservation.status !== "cancelled" &&
        reservation.status !== "completed" &&
        reservation.status !== "refused"
 ? (
          <>
            <Button className="flex-1" onClick={() => onEdit(reservation)}>
              <FaPen />
              تعديل
            </Button>
            <Button
              variant="outline"
              onClick={() => onCancel(reservation)}
              loading={cancelLoading}
          className="text-red-400 border-red-400 hover:bg-red-400/10"
        >
          <FaTrash className="w-4 h-4 ml-2" />
          إلغاء
        </Button>
          </>
        ) : null}
    </div>
  </motion.div>
);

export default UserReservationCard;

// Success Modal for Reservation
const SuccessModal = ({
  tableName,
  date,
  timeStart,
  timeEnd,
  peopleCount,
  onClose,
}: {
  tableName: string;
  date: string;
  timeStart: string;
  timeEnd: string;
  peopleCount: number;
  onClose: () => void;
}) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-sheen rounded-3xl p-8 max-w-md w-full"
    >
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto bg-emerald-500/20 rounded-full flex items-center justify-center">
          <FaCheckCircle className="w-8 h-8 text-emerald-400" />
        </div>

        <h3 className="text-2xl font-bold text-white">تم تأكيد الحجز بنجاح!</h3>

        <p className="text-white/70">
          تم تأكيد حجز الطاولة {tableName} بنجاح. ننتظرك في الوقت المحدد!
        </p>

        <div className="text-sm text-white/60 bg-white/5 rounded-xl p-4 space-y-2">
          <p>
            <span className="text-white/80">الطاولة:</span> {tableName}
          </p>
          <p>
            <span className="text-white/80">التاريخ:</span>{" "}
            {new Date(date).toLocaleDateString("ar-EG")}
          </p>
          <p>
            <span className="text-white/80">الوقت:</span>{" "}
            {new Date(timeStart).toLocaleTimeString("ar-EG", {
              hour: "2-digit",
              minute: "2-digit",
            })}{" "}
            -{" "}
            {new Date(timeEnd).toLocaleTimeString("ar-EG", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
          <p>
            <span className="text-white/80">عدد الأفراد:</span> {peopleCount}
          </p>
        </div>

        <div className="pt-4">
          <Button
            onClick={onClose}
            className="w-full bg-emerald-500 hover:bg-emerald-600 border-emerald-500"
          >
            <FaCheckCircle className="w-4 h-4 ml-2" />
            تم
          </Button>
        </div>
      </div>
    </motion.div>
  </div>
);

// Confirmation Modal for Cancellation
const CancelConfirmationModal = ({
  reservation,
  onConfirm,
  onCancel,
  loading,
}: {
  reservation: ReservationView;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-sheen rounded-3xl p-8 max-w-md w-full"
    >
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto bg-red-500/20 rounded-full flex items-center justify-center">
          <FaTrash className="w-8 h-8 text-red-400" />
        </div>

        <h3 className="text-2xl font-bold text-white">تأكيد إلغاء الحجز</h3>

        <p className="text-white/70">
          هل أنت متأكد من أنك تريد إلغاء حجز الطاولة{" "}
          {reservation.table?.name ?? reservation.tableId}؟
        </p>

        <div className="text-sm text-white/60 bg-white/5 rounded-xl p-4">
          <p>
            التاريخ:{" "}
            {new Date(reservation.timeStart).toLocaleDateString("ar-EG")}
          </p>
          <p>
            الوقت:{" "}
            {new Date(reservation.timeStart).toLocaleTimeString("ar-EG", {
              hour: "2-digit",
              minute: "2-digit",
            })}{" "}
            -{" "}
            {new Date(
              reservation.timeEnd ?? reservation.timeStart
            ).toLocaleTimeString("ar-EG", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
          <p>عدد الأفراد: {reservation.peopleCount}</p>
        </div>

        <div className="flex space-x-3 rtl:space-x-reverse pt-4">
          <Button
            onClick={onConfirm}
            loading={loading}
            className="flex-1 bg-red-500 hover:bg-red-600 border-red-500"
          >
            <FaTrash className="w-4 h-4 ml-2" />
            نعم، إلغاء الحجز
          </Button>

          <Button variant="outline" onClick={onCancel} className="flex-1">
            إلغاء
          </Button>
        </div>
      </div>
    </motion.div>
  </div>
);

const initialSearch: AvailableTableSearch = {
  date: new Date().toISOString().split("T")[0],
  startTime: "07:00 PM",
  endTime: "09:00 PM",
  guests: 2,
  tableClass: undefined,
};

type ReservationFormData = {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  timeStart: string;
  endTime: string;
  timeEnd: string;
  guests: number;
  message: string;
  tableClass?: TableClass;
};


const getReservationId = (reservation: ReservationView) =>
  reservation.id ?? reservation._id ?? "";

const initialReservationForm: ReservationFormData = {
  name: "",
  email: "",
  phone: "",
  date: initialSearch.date,
  time: initialSearch.startTime,
  timeStart: initialSearch.startTime,
  endTime: initialSearch.endTime,
  timeEnd: initialSearch.endTime,
  guests: initialSearch.guests,
  message: "",
  tableClass: initialSearch.tableClass,
};

export const ReservationsPage = () => {
  const [activeTab, setActiveTab] = useState<"new" | "my">("new");
  const [searchForm, setSearchForm] =
    useState<AvailableTableSearch>(initialSearch);
  const [availableTables, setAvailableTables] = useState<TableItem[]>([]);
  const [userReservations, setUserReservations] = useState<ReservationView[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [selectedTable, setSelectedTable] = useState<TableItem | null>(null);
  const [reservationForm, setReservationForm] = useState<ReservationFormData>(
    initialReservationForm
  );
  const [isConfirming, setIsConfirming] = useState(false);
  const [editingReservation, setEditingReservation] =
    useState<ReservationView | null>(null);
  const [cancellingReservation, setCancellingReservation] =
    useState<ReservationView | null>(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [successReservation, setSuccessReservation] = useState<{
    tableName: string;
    date: string;
    timeStart: string;
    timeEnd: string;
    peopleCount: number;
  } | null>(null);

  const timeSlots = useMemo(
    () => [
      "05:30 PM",
      "06:00 PM",
      "06:30 PM",
      "07:00 PM",
      "07:30 PM",
      "08:00 PM",
      "08:30 PM",
      "09:00 PM",
      "09:30 PM",
      "10:00 PM",
    ],
    []
  );

  const tableClasses: TableClass[] = ["a", "b", "c", "d"];

  const minDate = useMemo(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  }, []);

  const handleSearchChange = (
    field: keyof AvailableTableSearch,
    value: string | number | TableClass | undefined
  ) => {
    setSearchForm((prev) => ({ ...prev, [field]: value }));
  };

  // Helper function to convert time string to minutes for comparison
  const timeToMinutes = (timeStr: string): number => {
    const [time, period] = timeStr.split(" ");
    const [hours, minutes] = time.split(":");
    let hour24 = parseInt(hours);
    if (period === "PM" && hour24 !== 12) hour24 += 12;
    if (period === "AM" && hour24 === 12) hour24 = 0;
    return hour24 * 60 + parseInt(minutes);
  };

  const handleReservationFormChange = (
    field: keyof ReservationFormData,
    value: string | number | TableClass | undefined
  ) => {
    setReservationForm((prev: ReservationFormData) => {
      const updated = { ...prev, [field]: value };

      // If start time changes and end time is now invalid, reset end time
      if (
        field === "timeStart" &&
        typeof value === "string" &&
        updated.timeEnd
      ) {
        const startMinutes = timeToMinutes(value);
        const endMinutes = timeToMinutes(updated.timeEnd);
        if (endMinutes <= startMinutes) {
          // Find the next available time slot after start time
          const startIndex = timeSlots.findIndex((slot) => slot === value);
          if (startIndex >= 0 && startIndex < timeSlots.length - 1) {
            updated.timeEnd = timeSlots[startIndex + 1];
          } else {
            updated.timeEnd = "";
          }
        }
      }

      return updated;
    });
  };

  const fetchTables = useCallback(async () => {
    setLoading(true);
    setFeedback(null);
    setSelectedTable(null);
    try {
      const tables = await fetchAvailableTables(searchForm);
      setAvailableTables(tables);
      if (tables.length === 0) {
        setFeedback({
          type: "error",
          message: "لا توجد طاولات متاحة بالمعايير المحددة.",
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setFeedback({
        type: "error",
        message: "حدث خطأ أثناء جلب الطاولات المتاحة.",
      });
    } finally {
      setLoading(false);
    }
  }, [searchForm]);

  const fetchReservations = useCallback(async () => {
    setLoading(true);
    try {
      const reservations = await fetchUserReservations("dummy_user_id");
      setUserReservations(
        reservations.map((res: ReservationView) => ({
          ...res,
        }))
      );
    } catch {
      setFeedback({
        type: "error",
        message: "حدث خطأ أثناء جلب حجوزاتك.",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "new") {
      fetchTables();
    } else if (activeTab === "my") {
      fetchReservations();
    }
  }, [activeTab, fetchTables, fetchReservations]);

  const handleTableSelect = (table: TableItem) => {
    setSelectedTable(table);
    setReservationForm((prev) => ({
      ...prev,
      date: searchForm.date,
      time: searchForm.startTime,
      timeStart: searchForm.startTime,
      endTime: searchForm.endTime,
      timeEnd: searchForm.endTime,
      guests: searchForm.guests,
      tableClass: table.category as TableClass | undefined,
    }));
    setIsConfirming(true);
  };

  const handleConfirmReservation = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    if (!selectedTable) return;

    setLoading(true);
    setFeedback(null);

    try {
      if (!reservationForm.timeStart) {
        setFeedback({
          type: "error",
          message: "الرجاء تحديد وقت البداية للحجز.",
        });
        setLoading(false);
        return;
      }

      // Convert time strings to 24-hour format for ISO date
      const convertTimeTo24Hour = (timeStr: string): string => {
        const [time, period] = timeStr.split(" ");
        const [hours, minutes] = time.split(":");
        let hour24 = parseInt(hours);
        if (period === "PM" && hour24 !== 12) hour24 += 12;
        if (period === "AM" && hour24 === 12) hour24 = 0;
        return `${hour24.toString().padStart(2, "0")}:${minutes}`;
      };

      // Calculate duration in minutes
      const calculateDuration = (start: string, end: string): number => {
        const start24 = convertTimeTo24Hour(start);
        const end24 = convertTimeTo24Hour(end);
        const [startHour, startMin] = start24.split(":").map(Number);
        const [endHour, endMin] = end24.split(":").map(Number);
        const startMinutes = startHour * 60 + startMin;
        const endMinutes = endHour * 60 + endMin;
        return endMinutes - startMinutes;
      };

      // Validate that end time is after start time
      if (reservationForm.timeEnd) {
        const startMinutes = timeToMinutes(reservationForm.timeStart);
        const endMinutes = timeToMinutes(reservationForm.timeEnd);
        if (endMinutes <= startMinutes) {
          setFeedback({
            type: "error",
            message: "وقت النهاية يجب أن يكون بعد وقت البداية.",
          });
          setLoading(false);
          return;
        }
      }

      const timeStart24 = convertTimeTo24Hour(reservationForm.timeStart);
      const timeStartIso = new Date(
        `${reservationForm.date}T${timeStart24}:00`
      ).toISOString();
      const durationMinutes = reservationForm.timeEnd
        ? calculateDuration(reservationForm.timeStart, reservationForm.timeEnd)
        : 120; // Default 2 hours

      // حضر payload للباك حسب الشكل المطلوب
      const payload = {
        customerName: reservationForm.name,
        tableId: selectedTable._id,
        timeStart: timeStartIso,
        durationMinutes: durationMinutes,
        peopleCount: Number(reservationForm.guests),
      };

      // استدعاء الدالة اللي بتعمل POST للباك
      const res = await fetch(`${env.apiUrl}/reservations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to confirm reservation: ${errorText}`);
      }

      // Calculate timeEnd from timeStart and duration
      const timeEndDate = new Date(timeStartIso);
      timeEndDate.setMinutes(timeEndDate.getMinutes() + durationMinutes);
      const timeEndIso = timeEndDate.toISOString();

      // Show success modal with reservation details
      setSuccessReservation({
        tableName: selectedTable.name,
        date: reservationForm.date,
        timeStart: timeStartIso,
        timeEnd: timeEndIso,
        peopleCount: Number(reservationForm.guests),
      });

      setIsConfirming(false);
      setSelectedTable(null);
      setReservationForm(initialReservationForm);

      fetchTables();
      fetchReservations();
    } catch (error) {
      console.error("Reservation error:", error);
      setFeedback({
        type: "error",
        message:
          error instanceof Error ? error.message : "حدث خطأ أثناء تأكيد الحجز.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditReservation = (reservation: ReservationView) => {
    setEditingReservation(reservation);
    const timeStartDate = reservation.timeStart
      ? new Date(reservation.timeStart)
      : null;
    const timeEndDate = reservation.timeEnd
      ? new Date(reservation.timeEnd)
      : null;

    // Convert 24-hour time to 12-hour format with AM/PM
    const formatTime12Hour = (date: Date): string => {
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const period = hours >= 12 ? "PM" : "AM";
      const hour12 = hours % 12 || 12;
      return `${hour12}:${minutes.toString().padStart(2, "0")} ${period}`;
    };

    setReservationForm({
      name: reservation.customerName,
      email: reservation.email || "",
      phone: reservation.phone || "",
      date: timeStartDate ? timeStartDate.toISOString().split("T")[0] : "",
      time: timeStartDate ? formatTime12Hour(timeStartDate) : "",
      timeStart: timeStartDate ? formatTime12Hour(timeStartDate) : "",
      timeEnd: timeEndDate ? formatTime12Hour(timeEndDate) : "",
      endTime: timeEndDate ? formatTime12Hour(timeEndDate) : "",
      guests: reservation.peopleCount,
      message: reservation.message || "",
    });
  };

  const handleUpdateReservation = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingReservation) return;

    setLoading(true);
    setFeedback(null);

    try {
      // Convert time strings to 24-hour format for ISO date
      const convertTimeTo24Hour = (timeStr: string): string => {
        const [time, period] = timeStr.split(" ");
        const [hours, minutes] = time.split(":");
        let hour24 = parseInt(hours);
        if (period === "PM" && hour24 !== 12) hour24 += 12;
        if (period === "AM" && hour24 === 12) hour24 = 0;
        return `${hour24.toString().padStart(2, "0")}:${minutes}`;
      };

      // Calculate duration in minutes
      const calculateDuration = (start: string, end: string): number => {
        const start24 = convertTimeTo24Hour(start);
        const end24 = convertTimeTo24Hour(end);
        const [startHour, startMin] = start24.split(":").map(Number);
        const [endHour, endMin] = end24.split(":").map(Number);
        const startMinutes = startHour * 60 + startMin;
        const endMinutes = endHour * 60 + endMin;
        return endMinutes - startMinutes;
      };

      const timeStartValue =
        reservationForm.timeStart || reservationForm.time || "";
      if (!timeStartValue) {
        setFeedback({
          type: "error",
          message: "الرجاء تحديد وقت البداية للحجز.",
        });
        setLoading(false);
        return;
      }

      // Validate that end time is after start time
      if (reservationForm.timeEnd) {
        const startMinutes = timeToMinutes(timeStartValue);
        const endMinutes = timeToMinutes(reservationForm.timeEnd);
        if (endMinutes <= startMinutes) {
          setFeedback({
            type: "error",
            message: "وقت النهاية يجب أن يكون بعد وقت البداية.",
          });
          setLoading(false);
          return;
        }
      }

      const timeStart24 = convertTimeTo24Hour(timeStartValue);
      const timeStartIso = new Date(
        `${reservationForm.date}T${timeStart24}:00`
      ).toISOString();
      const durationMinutes = reservationForm.timeEnd
        ? calculateDuration(timeStartValue, reservationForm.timeEnd)
        : editingReservation.durationMinutes || 120;

      // حضر payload بالشكل المطلوب
      const payload = {
        customerName: reservationForm.name,
        tableId: editingReservation.tableId,
        timeStart: timeStartIso,
        durationMinutes: durationMinutes,
        peopleCount: Number(reservationForm.guests),
        message: reservationForm.message || "",
      };

      // استدعاء الدالة لتحديث الحجز
      await updateReservation(getReservationId(editingReservation), payload);

      setFeedback({
        type: "success",
        message: "تم تعديل الحجز بنجاح.",
      });

      setEditingReservation(null);
      setReservationForm(initialReservationForm);
      fetchReservations();
    } catch (error) {
      console.error("Update reservation error:", error);
      setFeedback({
        type: "error",
        message: "حدث خطأ أثناء تعديل الحجز.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelReservation = async (reservationId: string) => {
    setCancelLoading(true);
    setFeedback(null);

    try {
      // استدعاء API لإلغاء الحجز
      await cancelReservation(reservationId);

      // إعطاء رسالة نجاح
      setFeedback({
        type: "success",
        message: "تم إلغاء الحجز بنجاح.",
      });

      // إعادة ضبط الـ modal أو أي حالة خاصة بالإلغاء
      setCancellingReservation(null);

      // تحديث الحجوزات والطاولات بعد الإلغاء
      await fetchReservations();
      await fetchTables();
    } catch (error) {
      console.error("Cancel reservation error:", error); // سجل الخطأ
      setFeedback({
        type: "error",
        message: "حدث خطأ أثناء إلغاء الحجز.",
      });
    } finally {
      setCancelLoading(false);
    }
  };

  const showCancelConfirmation = (reservation: Reservation) => {
    setCancellingReservation(reservation);
  };

  const hideCancelConfirmation = () => {
    setCancellingReservation(null);
  };

  const renderSearchForm = () => (
    <div className="space-y-4">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <label className="text-sm text-white/70">
          التاريخ
          <input
            type="date"
            min={minDate}
            required
            value={searchForm.date}
            onChange={(event) => handleSearchChange("date", event.target.value)}
            className="w-full my-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-white placeholder:text-white/40 focus:border-accent/60 focus:outline-none focus:ring-0"
          />
        </label>

        <label className="text-sm text-white/70">
          عدد الأفراد
          <input
            type="number"
            min={1}
            max={12}
            required
            value={searchForm.guests}
            onChange={(event) =>
              handleSearchChange("guests", Number(event.target.value))
            }
            className="w-full my-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-white placeholder:text-white/40 focus:border-accent/60 focus:outline-none focus:ring-0"
          />
        </label>
      </div>

      <label className="text-sm text-white/70">
        نوع الطاولة (اختياري)
        <select
          value={searchForm.tableClass || ""}
          onChange={(event) =>
            handleSearchChange(
              "tableClass",
              event.target.value as TableClass | undefined
            )
          }
          className="w-full  rounded-full border border-white/10 bg-white/5 px-5 py-3 text-white focus:border-accent/60 focus:outline-none focus:ring-0 my-2"
        >
          <option value="">كل الأنواع</option>
          {tableClasses.map((cls) => (
            <option key={cls} value={cls} className="bg-night">
              كلاس {cls}
            </option>
          ))}
        </select>
      </label>

      <Button
        onClick={() => fetchAvailableTables(searchForm)} // هنا بتمرير searchForm للباك
        loading={loading}
        className="w-full"
      >
        بحث عن طاولات متاحة
      </Button>
    </div>
  );

  const renderAvailableTables = () => {
    if (loading) {
      return (
        <p className="text-center text-white/70">جاري البحث عن الطاولات...</p>
      );
    }

    if (feedback && feedback.type === "error") {
      return <p className="text-center text-red-400">{feedback.message}</p>;
    }

    if (availableTables.length === 0) {
      return (
        <p className="text-center text-white/70">
          لا توجد طاولات متاحة حاليًا بالمعايير المحددة.
        </p>
      );
    }

    return (
      <div className="space-y-6">
        <h3 className="text-2xl font-semibold text-white">
          الطاولات المتاحة ({availableTables.length})
        </h3>
        <div className="grid gap-6 md:grid-cols-2">
          {availableTables.map((table) => (
            <TableCard
              key={table._id}
              table={table}
              onReserve={handleTableSelect}
              isReserved={selectedTable?._id === table._id}
            />
          ))}
        </div>
      </div>
    );
  };

  const renderConfirmationForm = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-sheen rounded-3xl p-10 space-y-6"
    >
      <SectionHeading
        align="right"
        eyebrow="تأكيد الحجز"
        title={`تأكيد حجز الطاولة ${selectedTable?.name}`}
        description="يرجى إدخال بياناتك لتأكيد الحجز."
      />

      <form onSubmit={handleConfirmReservation} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* الاسم */}
          <label className="space-y-2 text-sm text-white/70">
            الاسم
            <input
              type="text"
              required
              value={reservationForm.name}
              onChange={(e) =>
                handleReservationFormChange("name", e.target.value)
              }
              className="w-full rounded-full border border-white/10 bg-white/5 px-5 py-3 text-white placeholder:text-white/40 focus:border-accent/60 focus:outline-none focus:ring-0"
            />
          </label>

          {/* الايميل */}
          <label className="space-y-2 text-sm text-white/70">
            الايميل
            <input
              type="email"
              required
              value={reservationForm.email}
              onChange={(e) =>
                handleReservationFormChange("email", e.target.value)
              }
              className="w-full rounded-full border border-white/10 bg-white/5 px-5 py-3 text-white placeholder:text-white/40 focus:border-accent/60 focus:outline-none focus:ring-0"
            />
          </label>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* رقم الهاتف */}
          <label className="space-y-2 text-sm text-white/70">
            رقم الهاتف
            <input
              type="tel"
              required
              value={reservationForm.phone}
              onChange={(e) =>
                handleReservationFormChange("phone", e.target.value)
              }
              className="w-full rounded-full border border-white/10 bg-white/5 px-5 py-3 text-white placeholder:text-white/40 focus:border-accent/60 focus:outline-none focus:ring-0"
            />
          </label>

          {/* عدد الأفراد */}
          <label className="space-y-2 text-sm text-white/70">
            عدد الأفراد
            <input
              type="number"
              min={1}
              max={selectedTable?.maxSeats || 12}
              required
              value={reservationForm.guests}
              onChange={(e) =>
                handleReservationFormChange("guests", Number(e.target.value))
              }
              className="w-full rounded-full border border-white/10 bg-white/5 px-5 py-3 text-white placeholder:text-white/40 focus:border-accent/60 focus:outline-none focus:ring-0"
            />
          </label>
        </div>

        {/* اختيار الوقت */}
        <div className="grid gap-6 md:grid-cols-2">
          <label className="text-sm text-white/70">
            من وقت
            <select
              required
              value={reservationForm.timeStart}
              onChange={(e) =>
                handleReservationFormChange("timeStart", e.target.value)
              }
              className="w-full my-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-white focus:border-accent/60 focus:outline-none focus:ring-0"
            >
              {timeSlots.map((slot) => (
                <option key={slot} value={slot} className="bg-night">
                  {slot}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm text-white/70">
            إلى وقت
            <select
              required
              value={reservationForm.timeEnd}
              onChange={(e) =>
                handleReservationFormChange("timeEnd", e.target.value)
              }
              className="w-full my-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-white focus:border-accent/60 focus:outline-none focus:ring-0"
            >
              {timeSlots
                .filter((slot) => {
                  if (!reservationForm.timeStart) return true;
                  const startMinutes = timeToMinutes(reservationForm.timeStart);
                  const slotMinutes = timeToMinutes(slot);
                  return slotMinutes > startMinutes;
                })
                .map((slot) => (
                  <option key={slot} value={slot} className="bg-night">
                    {slot}
                  </option>
                ))}
            </select>
          </label>
        </div>

        {/* ملاحظات */}
        <label className="space-y-2 text-sm text-white/70">
          ملاحظات (اختياري)
          <textarea
            rows={3}
            value={reservationForm.message}
            onChange={(e) =>
              handleReservationFormChange("message", e.target.value)
            }
            className="w-full rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-white placeholder:text-white/40 focus:border-accent/60 focus:outline-none focus:ring-0"
            placeholder="احكي لنا عن أي احتياجات أكل، مناسبات، أو أي طلبات خاصة عندك."
          />
        </label>

        {/* رسالة الفيدباك */}
        {feedback && (
          <p
            className={clsx(
              "text-sm",
              feedback.type === "success" ? "text-emerald-400" : "text-red-400"
            )}
          >
            {feedback.message}
          </p>
        )}

        {/* أزرار */}
        <div className="flex space-x-4 rtl:space-x-reverse">
          <Button type="submit" loading={loading} className="flex-1">
            تأكيد الحجز
          </Button>
          <Button type="button" onClick={() => setIsConfirming(false)}>
            إلغاء
          </Button>
        </div>
      </form>
    </motion.div>
  );

  const renderMyReservations = () => {
    if (loading) {
      return <p className="text-center text-white/70">جاري جلب حجوزاتك...</p>;
    }

    if (userReservations.length === 0) {
      return (
        <p className="text-center text-white/70">لم تقم بأي حجوزات بعد.</p>
      );
    }

    return (
      <div className="grid gap-6 md:grid-cols-2">
        {userReservations.map((reservation) => (
          <UserReservationCard
            key={getReservationId(reservation)}
            reservation={reservation}
            onEdit={handleEditReservation}
            onCancel={showCancelConfirmation}
            cancelLoading={
              !!(
                cancelLoading &&
                cancellingReservation &&
                getReservationId(cancellingReservation) ===
                  getReservationId(reservation)
              )
            }
          />
        ))}
      </div>
    );
  };

  const renderEditForm = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-sheen rounded-3xl p-10 space-y-6"
    >
      <SectionHeading
        align="right"
        eyebrow="تعديل الحجز"
        title={`تعديل حجز الطاولة `}
        description="يمكنك تعديل عدد الأفراد أو الملاحظات."
      />
      <form onSubmit={handleUpdateReservation} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <label className="space-y-2 text-sm text-white/70">
            التاريخ الحالي
            <input
              type="date"
              disabled
              value={reservationForm.date}
              className="w-full rounded-full border border-white/10 bg-white/5 px-5 py-3 text-white placeholder:text-white/40 focus:border-accent/60 focus:outline-none focus:ring-0 opacity-50"
            />
          </label>
          <label className="space-y-2 text-sm text-white/70">
            عدد الأفراد
            <input
              type="number"
              min={1}
              max={editingReservation?.peopleCount || 12}
              required
              value={reservationForm.guests}
              onChange={(event) =>
                handleReservationFormChange(
                  "guests",
                  Number(event.target.value)
                )
              }
              className="w-full rounded-full border border-white/10 bg-white/5 px-5 py-3 text-white placeholder:text-white/40 focus:border-accent/60 focus:outline-none focus:ring-0"
            />
          </label>
        </div>
        <label className="space-y-2 text-sm text-white/70">
          ملاحظات
          <textarea
            rows={3}
            value={reservationForm.message}
            onChange={(event) =>
              handleReservationFormChange("message", event.target.value)
            }
            className="w-full rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-white placeholder:text-white/40 focus:border-accent/60 focus:outline-none focus:ring-0"
            placeholder="احكي لنا عن أي احتياجات أكل، مناسبات، أو أي طلبات خاصة عندك."
          />
        </label>
        {feedback && (
          <p
            className={clsx(
              "text-sm",
              feedback.type === "success" ? "text-emerald-400" : "text-red-400"
            )}
          >
            {feedback.message}
          </p>
        )}
        <div className="flex space-x-4 rtl:space-x-reverse">
          <Button type="submit" loading={loading} className="flex-1">
            حفظ التعديلات
          </Button>
          <Button type="button" onClick={() => setEditingReservation(null)}>
            إلغاء
          </Button>
        </div>
      </form>
    </motion.div>
  );

  return (
    <PageTransition>
      <section className="mx-auto max-w-6xl px-6 py-16 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="glass-sheen rounded-3xl p-10"
          >
            <SectionHeading
              align="right"
              eyebrow="الحجوزات"
              title="احجز أمسياتك"
              description="ابحث عن طاولتك المفضلة أو راجع حجوزاتك الحالية."
            />

            <div className="mt-10">
              <div className="flex border-b border-white/10 mb-6">
                <button
                  className={clsx(
                    "px-4 py-2 text-lg font-medium transition-colors",
                    activeTab === "new"
                      ? "text-accent border-b-2 border-accent"
                      : "text-white/70 hover:text-white"
                  )}
                  onClick={() => {
                    setActiveTab("new");
                    setEditingReservation(null);
                    setIsConfirming(false);
                  }}
                >
                  حجز جديد
                </button>
                <button
                  className={clsx(
                    "px-4 py-2 text-lg font-medium transition-colors",
                    activeTab === "my"
                      ? "text-accent border-b-2 border-accent"
                      : "text-white/70 hover:text-white"
                  )}
                  onClick={() => {
                    setActiveTab("my");
                    setEditingReservation(null);
                    setIsConfirming(false);
                  }}
                >
                  حجوزاتي
                </button>
              </div>

              {activeTab === "new" && (
                <motion.div
                  key="new-reservation"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  {isConfirming && selectedTable ? (
                    renderConfirmationForm()
                  ) : (
                    <>
                      {renderSearchForm()}
                      <div className="pt-4 border-t border-white/10">
                        {renderAvailableTables()}
                      </div>
                    </>
                  )}
                </motion.div>
              )}

              {activeTab === "my" && (
                <motion.div
                  key="my-reservations"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  {editingReservation
                    ? renderEditForm()
                    : renderMyReservations()}
                </motion.div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="glass-sheen rounded-3xl p-10">
              <SectionHeading
                align="right"
                eyebrow="الكونسيرج"
                title="بنجهزلك أمسيات على حسب ذوقك"
              />
              <p className="mt-7 text-sm text-white/70">
                تحب تتكلم مع حد من فريقنا؟ اتصل على
                <a
                  href="https://wa.me/201234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-accent transition hover:text-accent/70"
                  style={{ direction: "ltr", textAlign: "right" }}
                >
                  +20 123 456 7890
                </a>
              </p>
              <p className="text-sm text-white/70">
                لو عندك استفسار عن العزومات الخاصة، ابعتلنا إيميل على
                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=yassminebassem991@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-accent transition hover:text-accent/70"
                >
                  reservations@spot-eg.com
                </a>
              </p>
            </div>

            <div className="overflow-hidden rounded-3xl border border-white/10">
              <iframe
                title="Spot على خرائط جوجل"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3453.4515683240297!2d31.242308799999996!3d30.052588099999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14584095707d8ae5%3A0x10132076f04d5553!2zMjYg2YrZiNmE2YrZiNiMINmF2K3Yp9mB2LjYqSDYp9mE2YLYp9mH2LHYqeKArA!5e0!3m2!1sar!2seg!4v1763230570624!5m2!1sar!2seg"
                width="100%"
                height="420"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </motion.div>
        </div>

        {/* Modal تأكيد الإلغاء */}
        {cancellingReservation && (
          <CancelConfirmationModal
            reservation={cancellingReservation}
            onConfirm={() =>
              handleCancelReservation(getReservationId(cancellingReservation))
            }
            onCancel={hideCancelConfirmation}
            loading={cancelLoading}
          />
        )}

        {/* Modal نجاح الحجز */}
        {successReservation && (
          <SuccessModal
            tableName={successReservation.tableName}
            date={successReservation.date}
            timeStart={successReservation.timeStart}
            timeEnd={successReservation.timeEnd}
            peopleCount={successReservation.peopleCount}
            onClose={() => setSuccessReservation(null)}
          />
        )}
      </section>
    </PageTransition>
  );
};