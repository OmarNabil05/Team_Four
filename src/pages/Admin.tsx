import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { PageTransition } from '../components/common/PageTransition';
import { SectionHeading } from '../components/common/SectionHeading';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import {
  createMenuItem,
  deleteMenuItem,
  fetchMenuAdmin,
  updateMenuItem,
} from '../services/menuService';
import {
  deleteReservation,
  fetchReservations,
  updateReservationStatus,
} from '../services/reservationService';
import type { MenuItem, MenuItemInput, Reservation, ReservationStatus } from '../types';
import { deleteMessage, fetchMessages, type ContactMessage } from '../services/contactService';

const menuTemplate: MenuItemInput = {
  title: '',
  description: '',
  price: 0,
  category: 'Appetizers',
  imageUrl: '',
  isFeatured: false,
  isAvailable: true,
};

export const AdminPage = () => {
  const { isAuthenticated, login, logout, loading, user } = useAuth();
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [authError, setAuthError] = useState<string | null>(null);

  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [messages, setMessagesState] = useState<ContactMessage[]>([]);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [dashboardError, setDashboardError] = useState<string | null>(null);
  const [menuForm, setMenuForm] = useState(menuTemplate);
  const [menuSubmitting, setMenuSubmitting] = useState(false);

  const loadDashboard = useMemo(
    () => async () => {
      try {
        setDashboardLoading(true);
        setDashboardError(null);
        const [menuData, reservationData, contactData] = await Promise.all([
          fetchMenuAdmin(),
          fetchReservations(),
          fetchMessages(),
        ]);
        setMenu(menuData);
        setReservations(reservationData);
        setMessagesState(contactData);
      } catch (error) {
        setDashboardError(error instanceof Error ? error.message : 'Unable to load dashboard');
      } finally {
        setDashboardLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    if (isAuthenticated) {
      void loadDashboard();
    }
  }, [isAuthenticated, loadDashboard]);

  const handleLogin = async () => {
    try {
      setAuthError(null);
      await login(credentials.email, credentials.password);
      setCredentials({ email: '', password: '' });
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Unable to sign in');
    }
  };

  const handleCreateMenuItem = async () => {
    try {
      setMenuSubmitting(true);
      const created = await createMenuItem(menuForm);
      setMenu((prev) => [created, ...prev]);
      setMenuForm(menuTemplate);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to create menu item';
      setDashboardError(message);
    } finally {
      setMenuSubmitting(false);
    }
  };

  const handleToggleAvailability = async (item: MenuItem) => {
    try {
      const updated = await updateMenuItem(item._id, { isAvailable: !item.isAvailable });
      setMenu((prev) => prev.map((entry) => (entry._id === item._id ? updated : entry)));
    } catch (error) {
      setDashboardError(error instanceof Error ? error.message : 'Unable to update availability');
    }
  };

  const handleDeleteMenuItem = async (id: string) => {
    try {
      await deleteMenuItem(id);
      setMenu((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      setDashboardError(error instanceof Error ? error.message : 'Unable to delete menu item');
    }
  };

  const handleReservationStatus = async (reservation: Reservation, status: ReservationStatus) => {
    try {
      const updated = await updateReservationStatus(reservation._id, status);
      setReservations((prev) => prev.map((entry) => (entry._id === reservation._id ? updated : entry)));
    } catch (error) {
      setDashboardError(error instanceof Error ? error.message : 'Unable to update reservation');
    }
  };

  const handleDeleteReservation = async (id: string) => {
    try {
      await deleteReservation(id);
      setReservations((prev) => prev.filter((reservation) => reservation._id !== id));
    } catch (error) {
      setDashboardError(error instanceof Error ? error.message : 'Unable to delete reservation');
    }
  };

  const handleDeleteMessage = async (id: string) => {
    try {
      await deleteMessage(id);
      setMessagesState((prev) => prev.filter((message) => message._id !== id));
    } catch (error) {
      setDashboardError(error instanceof Error ? error.message : 'Unable to remove message');
    }
  };

  if (!isAuthenticated) {
    return (
      <PageTransition>
        <section className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-16">
          <SectionHeading
            eyebrow="Admin Access"
            title="Spot Service Portal"
            description="Secure login for Spot team members to manage reservations and the culinary repertoire."
            align="left"
          />

          <div className="glass-sheen mt-8 space-y-5 rounded-3xl p-8">
            <label className="space-y-2 text-sm text-white/70">
              Email
              <input
                type="email"
                value={credentials.email}
                onChange={(event) => setCredentials((prev) => ({ ...prev, email: event.target.value }))}
                className="w-full rounded-full border border-white/10 bg-white/5 px-5 py-3 text-white placeholder:text-white/40 focus:border-accent/60 focus:outline-none focus:ring-0"
              />
            </label>
            <label className="space-y-2 text-sm text-white/70">
              Password
              <input
                type="password"
                value={credentials.password}
                onChange={(event) => setCredentials((prev) => ({ ...prev, password: event.target.value }))}
                className="w-full rounded-full border border-white/10 bg-white/5 px-5 py-3 text-white placeholder:text-white/40 focus:border-accent/60 focus:outline-none focus:ring-0"
              />
            </label>
            {authError && <p className="text-sm text-red-400">{authError}</p>}
            <Button onClick={handleLogin} loading={loading} className="w-full">
              Sign In
            </Button>
          </div>
        </section>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <SectionHeading
            align="left"
            eyebrow="Dashboard"
            title="Spot Concierge Console"
            description={`Welcome back, ${user?.name ?? 'team'}. Manage tonight's guests and repertoire.`}
          />
          <Button variant="ghost" onClick={logout}>
            Log Out
          </Button>
        </div>

        {dashboardError && (
          <p className="mt-6 text-sm text-red-400">{dashboardError}</p>
        )}

        {dashboardLoading ? (
          <p className="mt-10 text-sm text-white/70">Loading dashboard…</p>
        ) : (
          <div className="mt-12 space-y-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="grid gap-6 md:grid-cols-3"
            >
              <div className="glass-sheen rounded-3xl p-6">
                <p className="text-xs uppercase tracking-[0.3em] text-accent/80">Menu Items</p>
                <p className="mt-2 text-3xl font-semibold text-white">{menu.length}</p>
                <p className="text-sm text-white/60">Curated selections live on the menu</p>
              </div>
              <div className="glass-sheen rounded-3xl p-6">
                <p className="text-xs uppercase tracking-[0.3em] text-accent/80">Reservations</p>
                <p className="mt-2 text-3xl font-semibold text-white">{reservations.length}</p>
                <p className="text-sm text-white/60">Awaiting or confirmed for service</p>
              </div>
              <div className="glass-sheen rounded-3xl p-6">
                <p className="text-xs uppercase tracking-[0.3em] text-accent/80">Messages</p>
                <p className="mt-2 text-3xl font-semibold text-white">{messages.length}</p>
                <p className="text-sm text-white/60">Concierge inquiries from guests</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="glass-sheen rounded-3xl p-8"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <h3 className="font-display text-2xl text-white">Add New Menu Item</h3>
                <Button onClick={handleCreateMenuItem} loading={menuSubmitting}>
                  Save Dish
                </Button>
              </div>
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <label className="space-y-2 text-sm text-white/70">
                  Title
                  <input
                    value={menuForm.title}
                    onChange={(event) => setMenuForm((prev) => ({ ...prev, title: event.target.value }))}
                    className="w-full rounded-full border border-white/10 bg-white/5 px-5 py-3 text-white placeholder:text-white/40 focus:border-accent/60 focus:outline-none focus:ring-0"
                  />
                </label>
                <label className="space-y-2 text-sm text-white/70">
                  Category
                  <select
                    value={menuForm.category}
                    onChange={(event) =>
                      setMenuForm((prev) => ({ ...prev, category: event.target.value as MenuItemInput['category'] }))
                    }
                    className="w-full rounded-full border border-white/10 bg-white/5 px-5 py-3 text-white focus:border-accent/60 focus:outline-none focus:ring-0"
                  >
                    <option value="Appetizers">Appetizers</option>
                    <option value="Main Courses">Main Courses</option>
                    <option value="Desserts">Desserts</option>
                    <option value="Drinks">Drinks</option>
                  </select>
                </label>
                <label className="space-y-2 text-sm text-white/70">
                  Price
                  <input
                    type="number"
                    min={0}
                    value={menuForm.price}
                    onChange={(event) => setMenuForm((prev) => ({ ...prev, price: Number(event.target.value) }))}
                    className="w-full rounded-full border border-white/10 bg-white/5 px-5 py-3 text-white placeholder:text-white/40 focus:border-accent/60 focus:outline-none focus:ring-0"
                  />
                </label>
                <label className="space-y-2 text-sm text-white/70">
                  Image URL
                  <input
                    value={menuForm.imageUrl}
                    onChange={(event) => setMenuForm((prev) => ({ ...prev, imageUrl: event.target.value }))}
                    className="w-full rounded-full border border-white/10 bg-white/5 px-5 py-3 text-white placeholder:text-white/40 focus:border-accent/60 focus:outline-none focus:ring-0"
                  />
                </label>
              </div>
              <label className="mt-6 block space-y-2 text-sm text-white/70">
                Description
                <textarea
                  rows={3}
                  value={menuForm.description}
                  onChange={(event) => setMenuForm((prev) => ({ ...prev, description: event.target.value }))}
                  className="w-full rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-white placeholder:text-white/40 focus:border-accent/60 focus:outline-none focus:ring-0"
                />
              </label>
              <div className="mt-4 flex gap-4 text-sm text-white/70">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={menuForm.isFeatured}
                    onChange={(event) =>
                      setMenuForm((prev) => ({ ...prev, isFeatured: event.target.checked }))
                    }
                    className="h-4 w-4 rounded border-white/20 bg-white/10 text-accent focus:ring-accent"
                  />
                  Featured selection
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={menuForm.isAvailable}
                    onChange={(event) =>
                      setMenuForm((prev) => ({ ...prev, isAvailable: event.target.checked }))
                    }
                    className="h-4 w-4 rounded border-white/20 bg-white/10 text-accent focus:ring-accent"
                  />
                  Currently available
                </label>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <h3 className="font-display text-2xl text-white">Menu Library</h3>
              <div className="grid gap-6 md:grid-cols-2">
                {menu.map((item) => (
                  <div key={item._id} className="glass-sheen flex gap-4 rounded-3xl p-6">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="h-24 w-24 rounded-2xl object-cover"
                      loading="lazy"
                    />
                    <div className="flex flex-1 flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs uppercase tracking-[0.3em] text-accent/70">{item.category}</p>
                          <h4 className="font-display text-xl text-white">{item.title}</h4>
                        </div>
                        <p className="font-semibold text-accent">${item.price.toFixed(2)}</p>
                      </div>
                      <p className="max-h-20 overflow-hidden text-sm text-white/65">{item.description}</p>
                      <div className="flex flex-wrap gap-3">
                        <Button variant="outline" onClick={() => handleToggleAvailability(item)}>
                          {item.isAvailable ? 'Mark Unavailable' : 'Mark Available'}
                        </Button>
                        <Button variant="ghost" onClick={() => handleDeleteMenuItem(item._id)}>
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <h3 className="font-display text-2xl text-white">Reservations</h3>
              <div className="space-y-4">
                {reservations.map((reservation) => (
                  <div key={reservation._id} className="glass-sheen flex flex-wrap items-center gap-4 rounded-3xl p-6">
                    <div className="flex-1 space-y-1">
                      <p className="text-sm uppercase tracking-[0.3em] text-accent/80">{reservation.status}</p>
                      <h4 className="font-display text-xl text-white">{reservation.name}</h4>
                      <p className="text-sm text-white/70">
                        {reservation.date} · {reservation.time} · {reservation.guests} guests
                      </p>
                      <p className="text-sm text-white/60">{reservation.message}</p>
                      <p className="text-xs text-white/50">
                        {reservation.email} · {reservation.phone}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {(['pending', 'confirmed', 'cancelled'] as const).map((status) => (
                        <Button
                          key={status}
                          variant={reservation.status === status ? 'primary' : 'outline'}
                          onClick={() => handleReservationStatus(reservation, status)}
                        >
                          {status}
                        </Button>
                      ))}
                      <Button variant="ghost" onClick={() => handleDeleteReservation(reservation._id)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <h3 className="font-display text-2xl text-white">Guest Messages</h3>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message._id} className="glass-sheen rounded-3xl p-6">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-accent/70">{message.subject}</p>
                        <h4 className="font-display text-xl text-white">{message.name}</h4>
                        <p className="text-sm text-white/60">{message.email} · {message.phone}</p>
                      </div>
                      <Button variant="ghost" onClick={() => handleDeleteMessage(message._id)}>
                        Archive
                      </Button>
                    </div>
                    <p className="mt-3 text-sm text-white/70">{message.message}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </section>
    </PageTransition>
  );
};
