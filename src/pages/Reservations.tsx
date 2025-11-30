import { useMemo, useState, useCallback, useEffect } from "react";
import type { FormEvent } from "react";
import { motion } from "framer-motion";
import { PageTransition } from "../components/common/PageTransition";
import { SectionHeading } from "../components/common/SectionHeading";
import { Button } from "../components/ui/Button";
import type {
  ReservationInput,
  TableItem,
  AvailableTableSearch,
  Reservation,
  TableClass,
} from "../types";
import clsx from "clsx";
import { fetchTables,fetchUserReservations,updateReservation,cancelReservation } from "../services/reservationService";
import env from "../config/env";


// أيقونات بديلة
const TableIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const CalendarIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const ClockIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const UsersIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
  </svg>
);

const PencilIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
  </svg>
);

const TrashIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

// eslint-disable-next-line react-refresh/only-export-components
export const fetchAvailableTables = async (search: AvailableTableSearch): Promise<TableItem[]> => {
  const tables = await fetchTables();

  return tables.filter(table => {
    if (table.maxSeats < search.guests) return false;
    if (search.tableClass && table.category !== search.tableClass) return false;
    if (table.reserved) return false;

    // لو في API للحجوزات ممكن نعمل fetch عليها ونشيك التواقيت
    return true;
  });
};

// تأكيد حجز (لو الباك فيه endpoint للحجز)
// eslint-disable-next-line react-refresh/only-export-components
export const confirmReservation = async (tableId: string, reservationData: ReservationInput): Promise<void> => {
  const res = await fetch(`${env.apiUrl}/reservations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tableId, ...reservationData })
  });

  if (!res.ok) throw new Error('Failed to confirm reservation');
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
      <TableIcon className="w-6 h-6 mr-2 text-accent" />
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
  <p className="text-sm text-white/70">
    سعة: {table.maxSeats} أفراد
  </p>
  <p className={clsx("text-sm font-medium", !table.reserved ? "text-emerald-400" : "text-red-400")}>
    { !table.reserved ? "متاحة للحجز" : "غير متاحة"}
  </p>
</motion.div>

);

// Helper component for the User Reservation Card


interface UserReservationCardProps {
  reservation: Reservation;
  onEdit: (reservation: Reservation) => void;
  onCancel: (reservationId: string) => void;
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
        <TableIcon className="w-6 h-6 mr-2 text-accent" />
        حجز الطاولة {reservation.table.name}
      </h3>
      <span
        className={clsx(
          "px-3 py-1 text-xs font-medium rounded-full",
          reservation.status === "accepted" && "bg-emerald-500/20 text-emerald-400",
          reservation.status === "pending" && "bg-yellow-500/20 text-yellow-400",
          reservation.status === "refused" && "bg-red-500/20 text-red-400"
        )}
      >
        {reservation.status === "accepted" && "مؤكد"}
        {reservation.status === "pending" && "قيد الانتظار"}
        {reservation.status === "refused" && "ملغي"}
      </span>
    </div>

    {/* Details */}
    <div className="text-sm text-white/70 space-y-1">
      <p className="flex items-center">
        <CalendarIcon className="w-4 h-4 ml-2" />
        التاريخ: {new Date(reservation.timeStart).toLocaleDateString("ar-EG")}
      </p>
      <p className="flex items-center">
        <ClockIcon className="w-4 h-4 ml-2" />
        الوقت: {new Date(reservation.timeStart).toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" })} -{" "}
        {new Date(reservation.timeEnd).toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" })}
      </p>
      <p className="flex items-center">
        <UsersIcon className="w-4 h-4 ml-2" />
        عدد الأفراد: {reservation.peopleCount}
      </p>
      {reservation.message && (
        <p className="text-white/60 mt-2">
          ملاحظات: {reservation.message}
        </p>
      )}
    </div>

    {/* Actions */}
    <div className="flex space-x-2 rtl:space-x-reverse pt-2">
      <Button
        className="flex-1"
        onClick={() => onEdit(reservation)}
      >
        <PencilIcon className="w-4 h-4 ml-2" />
        تعديل
      </Button>

      {reservation.status !== "refused" && (
        <Button
          variant="outline"
          onClick={() => onCancel(reservation._id)}
          loading={cancelLoading}
          className="text-red-400 border-red-400 hover:bg-red-400/10"
        >
          <TrashIcon className="w-4 h-4 ml-2" />
          إلغاء
        </Button>
      )}
    </div>
  </motion.div>
);

export default UserReservationCard;

// Confirmation Modal for Cancellation
const CancelConfirmationModal = ({
  reservation,
  onConfirm,
  onCancel,
  loading,
}: {
  reservation: Reservation;
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
          <TrashIcon className="w-8 h-8 text-red-400" />
        </div>
        
        <h3 className="text-2xl font-bold text-white">
          تأكيد إلغاء الحجز
        </h3>
        
        <p className="text-white/70">
          هل أنت متأكد من أنك تريد إلغاء حجز الطاولة {reservation.table.name}؟
        </p>
        
        <div className="text-sm text-white/60 bg-white/5 rounded-xl p-4">
          <p>
            التاريخ: {new Date(reservation.timeStart).toLocaleDateString("ar-EG")}
          </p>
          <p>
            الوقت: {new Date(reservation.timeStart).toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" })} -{" "}
            {new Date(reservation.timeEnd).toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" })}
          </p>
          <p>
            عدد الأفراد: {reservation.peopleCount}
          </p>
        </div>
        
        <div className="flex space-x-3 rtl:space-x-reverse pt-4">
          <Button
            onClick={onConfirm}
            loading={loading}
            className="flex-1 bg-red-500 hover:bg-red-600 border-red-500"
          >
            <TrashIcon className="w-4 h-4 ml-2" />
            نعم، إلغاء الحجز
          </Button>
          
          <Button
            variant="outline"
            onClick={onCancel}
            className="flex-1"
          >
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

const initialReservationForm: ReservationInput = {
  name: "",
  email: "",
  phone: "",
  date: initialSearch.date,
  time: initialSearch.startTime,
  endTime: initialSearch.endTime,
  guests: initialSearch.guests,
  message: "",
  tableClass: initialSearch.tableClass,
};

export const ReservationsPage = () => {
  const [activeTab, setActiveTab] = useState<"new" | "my">("new");
  const [searchForm, setSearchForm] = useState<AvailableTableSearch>(initialSearch);
  const [availableTables, setAvailableTables] = useState<TableItem[]>([]);
  const [userReservations, setUserReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [selectedTable, setSelectedTable] = useState<TableItem | null>(null);
  const [reservationForm, setReservationForm] = useState<ReservationInput>(initialReservationForm);
  const [isConfirming, setIsConfirming] = useState(false);
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);
  const [cancellingReservation, setCancellingReservation] = useState<Reservation | null>(null);
  const [cancelLoading, setCancelLoading] = useState(false);

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

  const handleReservationFormChange = (
    field: keyof ReservationInput,
    value: string | number | TableClass | undefined
  ) => {
    setReservationForm((prev) => ({ ...prev, [field]: value }));
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
      setUserReservations(reservations);
    } catch (error) {
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
      endTime: searchForm.endTime,
      guests: searchForm.guests,
      tableClass: table.class,
    }));
    setIsConfirming(true);
  };

  const handleConfirmReservation = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedTable) return;

    setLoading(true);
    setFeedback(null);
    try {
      await confirmReservation(selectedTable._id, reservationForm);
      setFeedback({
        type: "success",
        message: "تم تأكيد الحجز بنجاح! ننتظرك.",
      });
      setIsConfirming(false);
      setSelectedTable(null);
      setReservationForm(initialReservationForm);
      fetchTables();
      fetchReservations();
    } catch (error) {
      setFeedback({
        type: "error",
        message: "حدث خطأ أثناء تأكيد الحجز.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditReservation = (reservation: Reservation) => {
    setEditingReservation(reservation);
    setReservationForm({
      name: reservation.name,
      email: reservation.email,
      phone: reservation.phone,
      date: reservation.date,
      time: reservation.time,
      endTime: reservation.endTime,
      guests: reservation.guests,
      message: reservation.message || "",
      tableClass: reservation.tableClass,
    });
  };

  const handleUpdateReservation = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingReservation) return;

    setLoading(true);
    setFeedback(null);
    try {
      await updateReservation(editingReservation.id, reservationForm);
      setFeedback({
        type: "success",
        message: "تم تعديل الحجز بنجاح.",
      });
      setEditingReservation(null);
      setReservationForm(initialReservationForm);
      fetchReservations();
    } catch (error) {
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
      await cancelReservation(reservationId);
      setFeedback({
        type: "success",
        message: "تم إلغاء الحجز بنجاح.",
      });
      setCancellingReservation(null);
      fetchReservations();
      fetchTables(); // تحديث الطاولات المتاحة
    } catch (error) {
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

      <label className="text-sm text-white/70">
        من وقت
        <select
          required
          value={searchForm.startTime}
          onChange={(event) =>
            handleSearchChange("startTime", event.target.value)
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

      <label className="space-y-2 text-sm text-white/70">
        إلى وقت
        <select
          required
          value={searchForm.endTime}
          onChange={(event) =>
            handleSearchChange("endTime", event.target.value)
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
        className="w-full rounded-full border border-white/10 bg-white/5 px-5 py-3 text-white focus:border-accent/60 focus:outline-none focus:ring-0 my-2"
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
      return <p className="text-center text-white/70">جاري البحث عن الطاولات...</p>;
    }

    if (feedback && feedback.type === "error") {
      return <p className="text-center text-red-400">{feedback.message}</p>;
    }

    if (availableTables.length === 0) {
      return <p className="text-center text-white/70">لا توجد طاولات متاحة حاليًا بالمعايير المحددة.</p>;
    }

    return (
      <div className="space-y-6">
        <h3 className="text-2xl font-semibold text-white">الطاولات المتاحة ({availableTables.length})</h3>
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
        align="left"
        eyebrow="تأكيد الحجز"
        title={`تأكيد حجز الطاولة ${selectedTable?.name}`}
        description="يرجى إدخال بياناتك لتأكيد الحجز."
      />
      <form onSubmit={handleConfirmReservation} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <label className="space-y-2 text-sm text-white/70">
            الاسم
            <input
              type="text"
              required
              value={reservationForm.name}
              onChange={(event) =>
                handleReservationFormChange("name", event.target.value)
              }
              className="w-full rounded-full border border-white/10 bg-white/5 px-5 py-3 text-white placeholder:text-white/40 focus:border-accent/60 focus:outline-none focus:ring-0"
            />
          </label>
          <label className="space-y-2 text-sm text-white/70">
            الايميل
            <input
              type="email"
              required
              value={reservationForm.email}
              onChange={(event) =>
                handleReservationFormChange("email", event.target.value)
              }
              className="w-full rounded-full border border-white/10 bg-white/5 px-5 py-3 text-white placeholder:text-white/40 focus:border-accent/60 focus:outline-none focus:ring-0"
            />
          </label>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <label className="space-y-2 text-sm text-white/70">
            رقم الهاتف
            <input
              type="tel"
              required
              value={reservationForm.phone}
              onChange={(event) =>
                handleReservationFormChange("phone", event.target.value)
              }
              className="w-full rounded-full border border-white/10 bg-white/5 px-5 py-3 text-white placeholder:text-white/40 focus:border-accent/60 focus:outline-none focus:ring-0"
            />
          </label>
          <label className="space-y-2 text-sm text-white/70">
            عدد الأفراد
            <input
              type="number"
              min={1}
              max={selectedTable?.maxSeats || 12}
              required
              value={reservationForm.guests}
              onChange={(event) =>
                handleReservationFormChange("guests", Number(event.target.value))
              }
              className="w-full rounded-full border border-white/10 bg-white/5 px-5 py-3 text-white placeholder:text-white/40 focus:border-accent/60 focus:outline-none focus:ring-0"
            />
          </label>
        </div>
        <label className="space-y-2 text-sm text-white/70">
          ملاحظات (اختياري)
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
            تأكيد الحجز
          </Button>
          <Button
            type="button"
            onClick={() => setIsConfirming(false)}
          >
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
      return <p className="text-center text-white/70">لم تقم بأي حجوزات بعد.</p>;
    }

    return (
      <div className="grid gap-6 md:grid-cols-2">
        {userReservations.map((reservation) => (
          <UserReservationCard
            key={reservation.id}
            reservation={reservation}
            onEdit={handleEditReservation}
            onCancel={showCancelConfirmation}
            cancelLoading={cancelLoading && cancellingReservation?.id === reservation.id}
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
        align="left"
        eyebrow="تعديل الحجز"
        title={`تعديل حجز الطاولة ${editingReservation?.tableId}`}
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
              max={editingReservation?.guests || 12}
              required
              value={reservationForm.guests}
              onChange={(event) =>
                handleReservationFormChange("guests", Number(event.target.value))
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
          <Button
            type="button"
            onClick={() => setEditingReservation(null)}
          >
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
              align="left"
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
                  {isConfirming && selectedTable
                    ? renderConfirmationForm()
                    : (
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
                align="left"
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
            onConfirm={() => handleCancelReservation(cancellingReservation.id)}
            onCancel={hideCancelConfirmation}
            loading={cancelLoading}
          />
        )}
      </section>
    </PageTransition>
  );
};