import React, { useState, useEffect, useMemo } from 'react';
import {
  Scissors, Calendar as CalendarIcon, Clock, User, Users, CheckCircle2,
  X, Plus, Trash2, Edit3, Send, Settings, Sparkles, Phone, Mail,
  MapPin, ChevronLeft, ChevronRight, Lock, LogOut, MessageSquare,
  AlertCircle, Check, Filter, Search, ShieldCheck, Key, ExternalLink,
  RefreshCw, CalendarDays, LayoutGrid, List, DollarSign, Award
} from 'lucide-react';

// --- DATI INIZIALI DI DEFAULT (SEED) ---
const INITIAL_SERVICES = [
  { id: 's1', name: 'Taglio Donna & Piega Signature', category: 'Taglio & Styling', duration: 60, price: 48, description: 'Consulenza morfologica, lavaggio con massaggio shiatsu, taglio sartoriale e piega.' },
  { id: 's2', name: 'Taglio Uomo Sartoriale', category: 'Barba & Uomo', duration: 30, price: 28, description: 'Taglio forbice e macchinetta, detersione energizzante e styling finale.' },
  { id: 's3', name: 'Balayage Illuminante & Gloss', category: 'Colore & Balayage', duration: 150, price: 135, description: 'Schiariture a mano libera effetto naturale con tonalizzante acido lucidante.' },
  { id: 's4', name: 'Colore Organico Senza Ammoniaca', category: 'Colore & Balayage', duration: 90, price: 65, description: 'Copertura totale o riflessatura delicata con oli essenziali botanici.' },
  { id: 's5', name: 'Rituale Keratina & Ricostruzione', category: 'Trattamenti Ristrutturanti', duration: 60, price: 55, description: 'Trattamento profondo rimpolpante alla cheratina idrolizzata e acido ialuronico.' },
  { id: 's6', name: 'Piega Glamour / Onde Morbide', category: 'Taglio & Styling', duration: 45, price: 30, description: 'Styling voluminoso o waves naturali a lunga tenuta con termoprotettore.' },
  { id: 's7', name: 'Rituale Barba Calda & Rasatura', category: 'Barba & Uomo', duration: 30, price: 22, description: 'Panni caldi all’eucalipto, definizione contorni e olio emolliente.' }
];

const INITIAL_STAFF = [
  {
    id: 'st1',
    name: 'Elena Moretti',
    role: 'Art Director & Color Specialist',
    bio: '14 anni di esperienza a Milano e Parigi. Specializzata in balayage tridimensionali e tagli editoriali.',
    color: '#c28b59',
    avatar: 'EM',
    daysOff: [0, 1], // Domenica e Lunedì
    serviceIds: ['s1', 's3', 's4', 's5', 's6']
  },
  {
    id: 'st2',
    name: 'Marco Bellini',
    role: 'Master Stylist & Barber',
    bio: 'Precisione geometrica, tagli uomo sartoriali e rituali barba tradizionali.',
    color: '#4a6b5d',
    avatar: 'MB',
    daysOff: [0, 1],
    serviceIds: ['s1', 's2', 's6', 's7']
  },
  {
    id: 'st3',
    name: 'Sofia Conti',
    role: 'Hair Therapist & Stylist',
    bio: 'Esperta in tricologia, trattamenti ricostituenti e pieghe glamour.',
    color: '#8c6278',
    avatar: 'SC',
    daysOff: [0, 3], // Domenica e Mercoledì
    serviceIds: ['s1', 's4', 's5', 's6']
  }
];

const INITIAL_SCHEDULE = {
  slotInterval: 30, // minuti
  days: {
    0: { open: false, start: '09:00', end: '18:00', breakStart: '13:00', breakEnd: '14:00', hasBreak: false }, // Dom
    1: { open: false, start: '09:00', end: '18:00', breakStart: '13:00', breakEnd: '14:00', hasBreak: false }, // Lun
    2: { open: true, start: '09:00', end: '19:00', breakStart: '13:00', breakEnd: '14:00', hasBreak: false },  // Mar
    3: { open: true, start: '09:00', end: '19:00', breakStart: '13:00', breakEnd: '14:00', hasBreak: false },  // Mer
    4: { open: true, start: '10:00', end: '20:30', breakStart: '13:30', breakEnd: '14:30', hasBreak: false },  // Gio
    5: { open: true, start: '09:00', end: '19:30', breakStart: '13:00', breakEnd: '14:00', hasBreak: false },  // Ven
    6: { open: true, start: '08:30', end: '18:00', breakStart: '13:00', breakEnd: '13:30', hasBreak: false }   // Sab
  },
  closedDates: [] // Array di stringhe YYYY-MM-DD
};

const getTodayStr = (offsetDays = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  if (offsetDays === 0 && (d.getDay() === 0 || d.getDay() === 1)) {
    d.setDate(d.getDate() + (d.getDay() === 0 ? 2 : 1));
  }
  return d.toISOString().split('T')[0];
};

const INITIAL_APPOINTMENTS = [
  {
    id: 'app-101',
    clientName: 'Giulia Ferretti',
    clientPhone: '+39 347 8923412',
    clientNotes: 'Vorrei schiarire leggermente le punte mantenendo la radice naturale.',
    staffId: 'st1',
    serviceIds: ['s3'],
    date: getTodayStr(0),
    time: '10:00',
    totalDuration: 150,
    totalPrice: 135,
    status: 'confirmed',
    whatsappSent: true,
    whatsappLastSentAt: 'Oggi, 08:30'
  },
  {
    id: 'app-102',
    clientName: 'Lorenzo De Luca',
    clientPhone: '+39 339 1122334',
    clientNotes: '',
    staffId: 'st2',
    serviceIds: ['s2', 's7'],
    date: getTodayStr(0),
    time: '11:00',
    totalDuration: 60,
    totalPrice: 50,
    status: 'confirmed',
    whatsappSent: false,
    whatsappLastSentAt: null
  },
  {
    id: 'app-103',
    clientName: 'Chiara Marchetti',
    clientPhone: '+39 340 9988776',
    clientNotes: 'Capelli molto secchi dopo il mare.',
    staffId: 'st3',
    serviceIds: ['s1', 's5'],
    date: getTodayStr(0),
    time: '15:00',
    totalDuration: 120,
    totalPrice: 103,
    status: 'pending',
    whatsappSent: false,
    whatsappLastSentAt: null
  }
];

const INITIAL_META_CONFIG = {
  mode: 'simulation', // 'simulation' | 'live'
  phoneNumberId: '',
  accessToken: '',
  templateName: 'conferma_appuntamento_salone',
  languageCode: 'it',
  salonName: 'Atelier Capelli & Stile'
};

// --- FUNZIONI DI UTILITÀ ORARI ---
const timeToMinutes = (timeStr) => {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
};

const minutesToTime = (mins) => {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
};

const formatDateIt = (dateStr) => {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  const dateObj = new Date(y, m - 1, d);
  return dateObj.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
};

const DAY_NAMES = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];

// --- COMPONENTE PRINCIPALE ---
export default function App() {
  const [viewMode, setViewMode] = useState('client');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  const [services, setServices] = useState(() => {
    const saved = localStorage.getItem('atelier_services');
    return saved ? JSON.parse(saved) : INITIAL_SERVICES;
  });

  const [staff, setStaff] = useState(() => {
    const saved = localStorage.getItem('atelier_staff');
    return saved ? JSON.parse(saved) : INITIAL_STAFF;
  });

  const [schedule, setSchedule] = useState(() => {
    const saved = localStorage.getItem('atelier_schedule');
    return saved ? JSON.parse(saved) : INITIAL_SCHEDULE;
  });

  const [appointments, setAppointments] = useState(() => {
    const saved = localStorage.getItem('atelier_appointments');
    return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
  });

  const [metaConfig, setMetaConfig] = useState(() => {
    const saved = localStorage.getItem('atelier_meta_config');
    return saved ? JSON.parse(saved) : INITIAL_META_CONFIG;
  });

  const [whatsappLogs, setWhatsappLogs] = useState(() => {
    const saved = localStorage.getItem('atelier_wa_logs');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => localStorage.setItem('atelier_services', JSON.stringify(services)), [services]);
  useEffect(() => localStorage.setItem('atelier_staff', JSON.stringify(staff)), [staff]);
  useEffect(() => localStorage.setItem('atelier_schedule', JSON.stringify(schedule)), [schedule]);
  useEffect(() => localStorage.setItem('atelier_appointments', JSON.stringify(appointments)), [appointments]);
  useEffect(() => localStorage.setItem('atelier_meta_config', JSON.stringify(metaConfig)), [metaConfig]);
  useEffect(() => localStorage.setItem('atelier_wa_logs', JSON.stringify(whatsappLogs)), [whatsappLogs]);

  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [preselectedServiceId, setPreselectedServiceId] = useState(null);

  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4500);
  };

  // --- MOTORE CALCOLO SLOT DISPONIBILI ---
  const getAvailableSlots = (dateStr, selectedStaffId, durationMinutes) => {
    if (!dateStr || durationMinutes <= 0) return [];
    if (schedule.closedDates.includes(dateStr)) return [];

    const [y, m, d] = dateStr.split('-').map(Number);
    const dayOfWeek = new Date(y, m - 1, d).getDay();
    const dayConfig = schedule.days[dayOfWeek];

    if (!dayConfig || !dayConfig.open) return [];

    const salonStart = timeToMinutes(dayConfig.start);
    const salonEnd = timeToMinutes(dayConfig.end);
    const breakStart = dayConfig.hasBreak ? timeToMinutes(dayConfig.breakStart) : null;
    const breakEnd = dayConfig.hasBreak ? timeToMinutes(dayConfig.breakEnd) : null;
    const step = schedule.slotInterval || 30;

    const candidateStaff = selectedStaffId === 'any'
      ? staff.filter(s => !s.daysOff.includes(dayOfWeek))
      : staff.filter(s => s.id === selectedStaffId && !s.daysOff.includes(dayOfWeek));

    if (candidateStaff.length === 0) return [];

    const validSlots = [];

    for (let current = salonStart; current + durationMinutes <= salonEnd; current += step) {
      const slotEnd = current + durationMinutes;

      if (breakStart !== null && breakEnd !== null) {
        if (current < breakEnd && slotEnd > breakStart) {
          continue;
        }
      }

      const availableStaffForSlot = candidateStaff.filter(member => {
        const memberApps = appointments.filter(
          a => a.date === dateStr && a.staffId === member.id && a.status !== 'cancelled'
        );
        const hasOverlap = memberApps.some(app => {
          const appStart = timeToMinutes(app.time);
          const appEnd = appStart + app.totalDuration;
          return current < appEnd && slotEnd > appStart;
        });
        return !hasOverlap;
      });

      if (availableStaffForSlot.length > 0) {
        validSlots.push({
          time: minutesToTime(current),
          availableStaffIds: availableStaffForSlot.map(s => s.id)
        });
      }
    }

    return validSlots;
  };

  // --- FUNZIONE INVIO WHATSAPP TRAMITE META GRAPH API ---
  const sendWhatsAppNotification = async (appointment, messageType = 'confirmation') => {
    const member = staff.find(s => s.id === appointment.staffId);
    const appServices = services.filter(s => appointment.serviceIds.includes(s.id));
    const serviceNames = appServices.map(s => s.name).join(', ');
    const cleanPhone = appointment.clientPhone.replace(/[^0-9]/g, '');

    const previewText = messageType === 'reminder'
      ? `Ciao ${appointment.clientName}! Ti ricordiamo il tuo appuntamento presso ${metaConfig.salonName} per ${formatDateIt(appointment.date)} alle ore ${appointment.time} con ${member?.name || 'il nostro team'} (${serviceNames}). A presto!`
      : `Ciao ${appointment.clientName}, la tua prenotazione presso ${metaConfig.salonName} è CONFERMATA! 📅 Data: ${formatDateIt(appointment.date)} ⏰ Ora: ${appointment.time} 💇‍♀️ Trattamento: ${serviceNames} con ${member?.name || 'il nostro team'}.`;

    const payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: cleanPhone,
      type: 'template',
      template: {
        name: metaConfig.templateName || 'conferma_appuntamento_salone',
        language: { code: metaConfig.languageCode || 'it' },
        components: [
          {
            type: 'body',
            parameters: [
              { type: 'text', text: appointment.clientName },
              { type: 'text', text: formatDateIt(appointment.date) },
              { type: 'text', text: appointment.time },
              { type: 'text', text: serviceNames },
              { type: 'text', text: member?.name || 'Stylist' }
            ]
          }
        ]
      }
    };

    if (metaConfig.mode === 'live' && metaConfig.phoneNumberId && metaConfig.accessToken) {
      try {
        const response = await fetch(
          `https://graph.facebook.com/v21.0/${metaConfig.phoneNumberId}/messages`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${metaConfig.accessToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
          }
        );

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error?.message || 'Errore API Meta WhatsApp');
        }

        const logEntry = {
          id: `wa-${Date.now()}`,
          timestamp: new Date().toLocaleString('it-IT'),
          clientName: appointment.clientName,
          phone: appointment.clientPhone,
          mode: 'LIVE META API',
          status: 'delivered',
          messageId: data.messages?.[0]?.id || 'wamid.live',
          previewText,
          payload
        };

        setWhatsappLogs(prev => [logEntry, ...prev]);
        setAppointments(prev => prev.map(a => a.id === appointment.id ? {
          ...a,
          whatsappSent: true,
          whatsappLastSentAt: new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })
        } : a));

        return { success: true, log: logEntry };
      } catch (err) {
        const errorLog = {
          id: `wa-err-${Date.now()}`,
          timestamp: new Date().toLocaleString('it-IT'),
          clientName: appointment.clientName,
          phone: appointment.clientPhone,
          mode: 'LIVE META API (ERRORE)',
          status: 'failed',
          error: err.message,
          previewText,
          payload
        };
        setWhatsappLogs(prev => [errorLog, ...prev]);
        return { success: false, error: err.message, log: errorLog };
      }
    } else {
      await new Promise(r => setTimeout(r, 650));
      const logEntry = {
        id: `wa-sim-${Date.now()}`,
        timestamp: new Date().toLocaleString('it-IT'),
        clientName: appointment.clientName,
        phone: appointment.clientPhone,
        mode: 'SANDBOX SIMULATO',
        status: 'simulated_ok',
        messageId: `wamid.HBgLMz${Math.floor(100000000 + Math.random() * 900000000)}`,
        previewText,
        payload
      };

      setWhatsappLogs(prev => [logEntry, ...prev]);
      setAppointments(prev => prev.map(a => a.id === appointment.id ? {
        ...a,
        whatsappSent: true,
        whatsappLastSentAt: new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })
      } : a));

      return { success: true, log: logEntry };
    }
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (pinInput === '1234') {
      setIsAdminAuthenticated(true);
      setPinError('');
      setPinInput('');
    } else {
      setPinError('PIN non valido. Usa 1234 per la demo.');
    }
  };

  const openBookingWithService = (serviceId = null) => {
    setPreselectedServiceId(serviceId);
    setIsBookingOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C1917] font-sans selection:bg-[#C28B59]/20">
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl border bg-[#1C1917] text-white border-stone-700 animate-fade-in">
          {toast.type === 'error' ? (
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          )}
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div
            onClick={() => setViewMode('client')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-full bg-[#1C1917] text-[#FAF8F5] flex items-center justify-center group-hover:bg-[#C28B59] transition-colors">
              <Scissors className="w-5 h-5" />
            </div>
            <div>
              <span className="font-serif text-xl tracking-tight font-semibold block leading-none">
                {metaConfig.salonName}
              </span>
              <span className="text-[11px] uppercase tracking-[0.2em] text-stone-500">
                Haute Coiffure & Spa
              </span>
            </div>
          </div>

          {viewMode === 'client' ? (
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600">
              <a href="#servizi" className="hover:text-[#1C1917] transition-colors">Trattamenti</a>
              <a href="#team" className="hover:text-[#1C1917] transition-colors">Il Team</a>
              <a href="#orari" className="hover:text-[#1C1917] transition-colors">Orari & Contatti</a>
            </nav>
          ) : (
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/80 text-amber-900 text-xs font-semibold border border-amber-200">
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              Modalità Gestionale Titolare
            </div>
          )}

          <div className="flex items-center gap-3">
            {viewMode === 'client' ? (
              <>
                <button
                  onClick={() => setViewMode('admin')}
                  className="px-3.5 py-2 rounded-full text-xs font-semibold border border-stone-300 text-stone-700 hover:bg-stone-100 transition-colors flex items-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5" />
                  Area Titolare
                </button>
                <button
                  onClick={() => openBookingWithService(null)}
                  className="px-5 py-2.5 rounded-full text-sm font-semibold bg-[#1C1917] text-white hover:bg-[#C28B59] transition-all shadow-sm flex items-center gap-2"
                >
                  <CalendarIcon className="w-4 h-4" />
                  Prenota Ora
                </button>
              </>
            ) : (
              <button
                onClick={() => setViewMode('client')}
                className="px-4 py-2 rounded-full text-xs font-semibold bg-stone-200/80 text-stone-800 hover:bg-stone-300 transition-colors flex items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Torna al Sito Cliente
              </button>
            )}
          </div>
        </div>
      </header>

      {viewMode === 'client' ? (
        <ClientWebsite
          services={services}
          staff={staff}
          schedule={schedule}
          salonName={metaConfig.salonName}
          onBookService={openBookingWithService}
        />
      ) : !isAdminAuthenticated ? (
        <div className="max-w-md mx-auto my-20 px-4">
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-stone-200/80 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#1C1917] text-[#C28B59] flex items-center justify-center mx-auto mb-5">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="font-serif text-2xl font-semibold mb-2">Accesso Gestionale Salone</h2>
            <p className="text-sm text-stone-500 mb-6">
              Inserisci il PIN amministratore per gestire calendario, slot, servizi, personale e notifiche WhatsApp Meta API.
            </p>
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <input
                type="password"
                maxLength={6}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Inserisci PIN (Demo: 1234)"
                className="w-full text-center text-2xl tracking-[0.4em] font-semibold px-4 py-3.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#C28B59]"
              />
              {pinError && <p className="text-xs text-red-600 font-medium">{pinError}</p>}
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#1C1917] text-white font-semibold hover:bg-[#C28B59] transition-colors"
              >
                Accedi alla Dashboard
              </button>
            </form>
            <button
              onClick={() => setIsAdminAuthenticated(true)}
              className="mt-4 text-xs text-stone-400 hover:text-stone-700 underline"
            >
              Accesso rapido Demo senza PIN
            </button>
          </div>
        </div>
      ) : (
        <AdminDashboard
          services={services}
          setServices={setServices}
          staff={staff}
          setStaff={setStaff}
          schedule={schedule}
          setSchedule={setSchedule}
          appointments={appointments}
          setAppointments={setAppointments}
          metaConfig={metaConfig}
          setMetaConfig={setMetaConfig}
          whatsappLogs={whatsappLogs}
          sendWhatsAppNotification={sendWhatsAppNotification}
          getAvailableSlots={getAvailableSlots}
          showToast={showToast}
          onLogout={() => setIsAdminAuthenticated(false)}
        />
      )}

      {isBookingOpen && (
        <BookingModal
          isOpen={isBookingOpen}
          onClose={() => setIsBookingOpen(false)}
          services={services}
          staff={staff}
          schedule={schedule}
          preselectedServiceId={preselectedServiceId}
          getAvailableSlots={getAvailableSlots}
          onConfirmBooking={async (newApp) => {
            setAppointments(prev => [...prev, newApp]);
            await sendWhatsAppNotification(newApp, 'confirmation');
            showToast('Prenotazione confermata! Riceverai un messaggio WhatsApp.');
          }}
        />
      )}
    </div>
  );
}

// ============================================================================
// SEZIONE 1: SITO VETRINA LATO CLIENTE
// ============================================================================
function ClientWebsite({ services, staff, schedule, salonName, onBookService }) {
  const [selectedCategory, setSelectedCategory] = useState('Tutti');

  const categories = useMemo(() => {
    const cats = Array.from(new Set(services.map(s => s.category)));
    return ['Tutti', ...cats];
  }, [services]);

  const filteredServices = selectedCategory === 'Tutti'
    ? services
    : services.filter(s => s.category === selectedCategory);

  return (
    <div>
      <section className="relative overflow-hidden py-20 lg:py-28 px-4 sm:px-6 lg:px-8 border-b border-stone-200/70">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C28B59]/15 text-[#9A683A] text-xs font-semibold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              Prenotazione Online Istantanea 24/7
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-[#1C1917] leading-[1.1]">
              L’arte del taglio sartoriale e del colore su misura.
            </h1>
            <p className="text-lg text-stone-600 max-w-2xl leading-relaxed">
              Scegli il tuo trattamento, seleziona il tuo stylist preferito e prenota in pochi secondi nella fascia oraria più comoda per te, con conferma immediata su WhatsApp.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => onBookService(null)}
                className="px-8 py-4 rounded-full bg-[#1C1917] text-white font-semibold hover:bg-[#C28B59] transition-all shadow-lg shadow-stone-900/10 flex items-center gap-2.5 text-base"
              >
                <CalendarIcon className="w-5 h-5" />
                Prenota il tuo Appuntamento
              </button>
              <a
                href="#servizi"
                className="px-7 py-4 rounded-full border border-stone-300 text-stone-800 font-semibold hover:bg-white transition-colors text-base"
              >
                Esplora il Listino
              </a>
            </div>
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-stone-200/80 max-w-lg">
              <div>
                <p className="font-serif text-2xl font-bold text-[#1C1917]">100%</p>
                <p className="text-xs text-stone-500 mt-0.5">Prodotti Organici & Cruelty-Free</p>
              </div>
              <div>
                <p className="font-serif text-2xl font-bold text-[#1C1917]">4.9 ★</p>
                <p className="text-xs text-stone-500 mt-0.5">Recensioni Verificate Clienti</p>
              </div>
              <div>
                <p className="font-serif text-2xl font-bold text-[#1C1917]">WhatsApp</p>
                <p className="text-xs text-stone-500 mt-0.5">Conferma e Promemoria Diretti</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative rounded-3xl overflow-hidden bg-[#1C1917] text-[#FAF8F5] p-8 sm:p-10 shadow-2xl">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#C28B59]/20 rounded-full blur-3xl -mr-16 -mt-16" />
              <span className="text-xs uppercase tracking-[0.25em] text-[#C28B59] font-semibold">
                Esperienza in Salone
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl mt-3 mb-6 leading-snug">
                Consulenza personalizzata inclusa in ogni visita.
              </h3>
              <ul className="space-y-4 text-sm text-stone-300">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#C28B59] shrink-0 mt-0.5" />
                  <span>Analisi della struttura del capello e armocromia prima di ogni servizio colore.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#C28B59] shrink-0 mt-0.5" />
                  <span>Postazione lavaggio spa con massaggio rilassante e tisane biologiche.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#C28B59] shrink-0 mt-0.5" />
                  <span>Zero attese grazie alla gestione intelligente degli slot orari.</span>
                </li>
              </ul>
              <div className="mt-8 pt-6 border-t border-stone-800 flex items-center justify-between">
                <div>
                  <p className="text-xs text-stone-400">Prossima disponibilità</p>
                  <p className="text-sm font-semibold text-white">Oggi / Domani online</p>
                </div>
                <button
                  onClick={() => onBookService(null)}
                  className="px-4 py-2 rounded-full bg-[#C28B59] text-white text-xs font-semibold hover:bg-[#b07a49] transition-colors"
                >
                  Verifica Orari →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="servizi" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-[#C28B59] font-semibold">
              Menu Trattamenti
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold mt-1">
              I Nostri Servizi
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#1C1917] text-white shadow-sm'
                    : 'bg-white text-stone-600 border border-stone-200 hover:border-stone-400'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {filteredServices.map(service => (
            <div
              key={service.id}
              className="group bg-white rounded-2xl p-6 border border-stone-200/80 hover:border-[#C28B59] transition-all flex flex-col justify-between shadow-sm hover:shadow-md"
            >
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#C28B59]">
                      {service.category}
                    </span>
                    <h3 className="font-serif text-xl font-semibold text-[#1C1917] mt-0.5">
                      {service.name}
                    </h3>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xl font-bold text-[#1C1917]">€{service.price}</span>
                    <span className="flex items-center justify-end gap-1 text-xs text-stone-400 mt-0.5">
                      <Clock className="w-3 h-3" /> {service.duration} min
                    </span>
                  </div>
                </div>
                <p className="text-sm text-stone-500 mt-3 leading-relaxed">
                  {service.description}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between">
                <span className="text-xs text-stone-400">
                  Disponibile con {staff.filter(st => st.serviceIds.includes(service.id)).length} stylist
                </span>
                <button
                  onClick={() => onBookService(service.id)}
                  className="text-xs font-semibold text-[#1C1917] group-hover:text-[#C28B59] flex items-center gap-1 transition-colors"
                >
                  Prenota questo servizio →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="team" className="py-20 bg-white border-y border-stone-200/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs uppercase tracking-[0.2em] text-[#C28B59] font-semibold">
              I Nostri Artisti
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold mt-1">
              Il Team di {salonName}
            </h2>
            <p className="text-sm text-stone-500 mt-3">
              Scegli il professionista più adatto alle tue esigenze durante la prenotazione oppure affidati al primo stylist disponibile.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {staff.map(member => (
              <div key={member.id} className="rounded-2xl bg-[#FAF8F5] p-7 border border-stone-200/70">
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-serif text-xl font-bold shadow-sm"
                    style={{ backgroundColor: member.color }}
                  >
                    {member.avatar}
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-semibold">{member.name}</h3>
                    <p className="text-xs font-medium text-[#C28B59]">{member.role}</p>
                  </div>
                </div>
                <p className="text-sm text-stone-600 leading-relaxed mb-5">
                  {member.bio}
                </p>
                <div className="text-xs text-stone-500 pt-4 border-t border-stone-200/70 flex items-center justify-between">
                  <span>Riposo: {member.daysOff.length ? member.daysOff.map(d => DAY_NAMES[d].slice(0, 3)).join(', ') : 'Nessuno'}</span>
                  <button
                    onClick={() => onBookService(null)}
                    className="font-semibold text-[#1C1917] hover:text-[#C28B59]"
                  >
                    Prenota con {member.name.split(' ')[0]} →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer id="orari" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <Scissors className="w-5 h-5 text-[#C28B59]" />
              <span className="font-serif text-xl font-semibold">{salonName}</span>
            </div>
            <p className="text-sm text-stone-500 leading-relaxed">
              Un rifugio dedicato alla bellezza autentica dei tuoi capelli. Prenota online in qualsiasi momento e gestisci i tuoi appuntamenti via WhatsApp.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4">Orari di Apertura</h4>
            <ul className="space-y-2 text-sm text-stone-600">
              {[1, 2, 3, 4, 5, 6, 0].map(dayIdx => {
                const d = schedule.days[dayIdx];
                return (
                  <li key={dayIdx} className="flex justify-between border-b border-stone-200/60 pb-1.5">
                    <span>{DAY_NAMES[dayIdx]}</span>
                    <span className="font-medium text-[#1C1917]">
                      {d?.open ? `${d.start} – ${d.end}` : 'Chiuso'}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4">Dove Siamo</h4>
            <div className="space-y-3 text-sm text-stone-600">
              <p className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-[#C28B59]" />
                Via della Spiga 24, 20121 Milano (MI)
              </p>
              <p className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#C28B59]" />
                +39 02 5550 1928
              </p>
              <p className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4 text-[#C28B59]" />
                WhatsApp Business Attivo
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ============================================================================
// SEZIONE 2: WIZARD PRENOTAZIONE CLIENTE (MODALE)
// ============================================================================
function BookingModal({ isOpen, onClose, services, staff, schedule, preselectedServiceId, getAvailableSlots, onConfirmBooking }) {
  const [step, setStep] = useState(1);
  const [selectedServiceIds, setSelectedServiceIds] = useState(preselectedServiceId ? [preselectedServiceId] : []);
  const [selectedStaffId, setSelectedStaffId] = useState('any');
  const [selectedDate, setSelectedDate] = useState(getTodayStr(0));
  const [selectedTime, setSelectedTime] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientNotes, setClientNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedApp, setConfirmedApp] = useState(null);

  useEffect(() => {
    if (preselectedServiceId) {
      setSelectedServiceIds([preselectedServiceId]);
    }
  }, [preselectedServiceId]);

  const selectedServices = services.filter(s => selectedServiceIds.includes(s.id));
  const totalDuration = selectedServices.reduce((acc, s) => acc + s.duration, 0);
  const totalPrice = selectedServices.reduce((acc, s) => acc + s.price, 0);

  const eligibleStaff = useMemo(() => {
    if (selectedServiceIds.length === 0) return staff;
    return staff.filter(member =>
      selectedServiceIds.every(sId => member.serviceIds.includes(sId))
    );
  }, [staff, selectedServiceIds]);

  const availableSlots = useMemo(() => {
    return getAvailableSlots(selectedDate, selectedStaffId, totalDuration);
  }, [selectedDate, selectedStaffId, totalDuration, getAvailableSlots]);

  const toggleService = (id) => {
    setSelectedServiceIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
    setSelectedTime('');
  };

  const handleComplete = async (e) => {
    e.preventDefault();
    if (!selectedTime || !clientName || !clientPhone) return;

    setIsSubmitting(true);

    let assignedStaffId = selectedStaffId;
    if (assignedStaffId === 'any') {
      const slotObj = availableSlots.find(s => s.time === selectedTime);
      assignedStaffId = slotObj?.availableStaffIds[0] || eligibleStaff[0]?.id || staff[0]?.id;
    }

    const newApp = {
      id: `app-${Date.now()}`,
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim(),
      clientNotes: clientNotes.trim(),
      staffId: assignedStaffId,
      serviceIds: selectedServiceIds,
      date: selectedDate,
      time: selectedTime,
      totalDuration,
      totalPrice,
      status: 'confirmed',
      whatsappSent: false,
      whatsappLastSentAt: null
    };

    await onConfirmBooking(newApp);
    setConfirmedApp(newApp);
    setIsSubmitting(false);
    setStep(5);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-[#FAF8F5] w-full max-w-2xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-8">
        <div className="bg-[#1C1917] text-white px-6 py-5 flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#C28B59] font-semibold">
              Prenotazione Online
            </span>
            <h3 className="font-serif text-xl font-semibold">
              {step === 5 ? 'Appuntamento Confermato!' : 'Prenota il tuo Trattamento'}
            </h3>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {step < 5 && (
          <div className="px-6 py-3 bg-white border-b border-stone-200 flex items-center justify-between text-xs font-semibold">
            {[
              { num: 1, label: '1. Trattamenti' },
              { num: 2, label: '2. Stylist' },
              { num: 3, label: '3. Data & Ora' },
              { num: 4, label: '4. I tuoi Dati' }
            ].map(s => (
              <div
                key={s.num}
                className={`flex items-center gap-1.5 ${
                  step === s.num ? 'text-[#C28B59]' : step > s.num ? 'text-emerald-700' : 'text-stone-400'
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${
                  step === s.num ? 'bg-[#C28B59] text-white' : step > s.num ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100'
                }`}>
                  {step > s.num ? '✓' : s.num}
                </span>
                <span className="hidden sm:inline">{s.label}</span>
              </div>
            ))}
          </div>
        )}

        <div className="p-6 max-h-[68vh] overflow-y-auto">
          {step === 1 && (
            <div className="space-y-3">
              <p className="text-sm text-stone-600 mb-3">Seleziona uno o più servizi desiderati:</p>
              {services.map(service => {
                const isSelected = selectedServiceIds.includes(service.id);
                return (
                  <div
                    key={service.id}
                    onClick={() => toggleService(service.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#1C1917] text-white border-[#1C1917] shadow-md'
                        : 'bg-white border-stone-200 hover:border-[#C28B59]'
                    }`}
                  >
                    <div>
                      <span className={`text-[10px] uppercase tracking-wider font-semibold ${isSelected ? 'text-[#C28B59]' : 'text-stone-400'}`}>
                        {service.category}
                      </span>
                      <h4 className="font-semibold text-base">{service.name}</h4>
                      <p className={`text-xs mt-0.5 ${isSelected ? 'text-stone-300' : 'text-stone-500'}`}>
                        Durata: {service.duration} min
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-lg">€{service.price}</span>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                        isSelected ? 'bg-[#C28B59] border-[#C28B59] text-white' : 'border-stone-300'
                      }`}>
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              <p className="text-sm text-stone-600 mb-3">Scegli lo stylist per i trattamenti selezionati:</p>

              <div
                onClick={() => { setSelectedStaffId('any'); setSelectedTime(''); }}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                  selectedStaffId === 'any'
                    ? 'bg-[#1C1917] text-white border-[#1C1917]'
                    : 'bg-white border-stone-200 hover:border-[#C28B59]'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-[#C28B59] text-white flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Qualsiasi Stylist Disponibile</h4>
                    <p className={`text-xs ${selectedStaffId === 'any' ? 'text-stone-300' : 'text-stone-500'}`}>
                      Massima flessibilità di orari
                    </p>
                  </div>
                </div>
                {selectedStaffId === 'any' && <CheckCircle2 className="w-5 h-5 text-[#C28B59]" />}
              </div>

              {eligibleStaff.map(member => (
                <div
                  key={member.id}
                  onClick={() => { setSelectedStaffId(member.id); setSelectedTime(''); }}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    selectedStaffId === member.id
                      ? 'bg-[#1C1917] text-white border-[#1C1917]'
                      : 'bg-white border-stone-200 hover:border-[#C28B59]'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: member.color }}
                    >
                      {member.avatar}
                    </div>
                    <div>
                      <h4 className="font-semibold">{member.name}</h4>
                      <p className={`text-xs ${selectedStaffId === member.id ? 'text-stone-300' : 'text-stone-500'}`}>
                        {member.role}
                      </p>
                    </div>
                  </div>
                  {selectedStaffId === member.id && <CheckCircle2 className="w-5 h-5 text-[#C28B59]" />}
                </div>
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">
                  Seleziona la Data
                </label>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={selectedDate}
                  onChange={(e) => { setSelectedDate(e.target.value); setSelectedTime(''); }}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-stone-300 font-medium focus:outline-none focus:border-[#C28B59]"
                />
                <p className="text-xs text-stone-500 mt-1.5 capitalize">
                  {formatDateIt(selectedDate)}
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">
                  Orari Disponibili (Durata richiesta: {totalDuration} min)
                </label>
                {availableSlots.length === 0 ? (
                  <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 text-center">
                    <p className="text-sm font-semibold text-amber-900">
                      Nessuno slot disponibile in questa data.
                    </p>
                    <p className="text-xs text-amber-700 mt-1">
                      Il salone o lo stylist selezionato potrebbero essere chiusi o al completo. Prova un altro giorno!
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                    {availableSlots.map(slot => (
                      <button
                        key={slot.time}
                        type="button"
                        onClick={() => setSelectedTime(slot.time)}
                        className={`py-2.5 px-3 rounded-xl text-sm font-semibold border transition-all ${
                          selectedTime === slot.time
                            ? 'bg-[#C28B59] text-white border-[#C28B59] shadow-sm'
                            : 'bg-white text-[#1C1917] border-stone-200 hover:border-[#C28B59]'
                        }`}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 4 && (
            <form id="booking-form" onSubmit={handleComplete} className="space-y-4">
              <div className="p-4 rounded-2xl bg-white border border-stone-200 space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-stone-500">Data e Ora:</span>
                  <span className="font-semibold capitalize">{formatDateIt(selectedDate)} alle {selectedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Trattamenti:</span>
                  <span className="font-semibold text-right">{selectedServices.map(s => s.name).join(', ')}</span>
                </div>
                <div className="flex justify-between pt-1.5 border-t border-stone-100">
                  <span className="text-stone-500">Totale Stimato ({totalDuration} min):</span>
                  <span className="font-bold text-[#C28B59]">€{totalPrice}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                  Nome e Cognome *
                </label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Es. Martina Rossi"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-stone-300 focus:outline-none focus:border-[#C28B59]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                  Numero WhatsApp (con prefisso) *
                </label>
                <input
                  type="tel"
                  required
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="Es. +39 340 1234567"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-stone-300 focus:outline-none focus:border-[#C28B59]"
                />
                <p className="text-[11px] text-stone-500 mt-1 flex items-center gap-1">
                  <MessageSquare className="w-3 h-3 text-emerald-600" />
                  Riceverai la conferma istantanea e il promemoria su WhatsApp.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                  Note per lo Stylist (opzionale)
                </label>
                <textarea
                  rows={2}
                  value={clientNotes}
                  onChange={(e) => setClientNotes(e.target.value)}
                  placeholder="Es. Allergie, lunghezza capelli, richieste particolari..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-stone-300 focus:outline-none focus:border-[#C28B59]"
                />
              </div>
            </form>
          )}

          {step === 5 && confirmedApp && (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h4 className="font-serif text-2xl font-semibold">Grazie, {confirmedApp.clientName}!</h4>
              <p className="text-sm text-stone-600 max-w-md mx-auto">
                Il tuo appuntamento per <strong>{formatDateIt(confirmedApp.date)}</strong> alle ore <strong>{confirmedApp.time}</strong> è stato registrato in agenda.
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
                <MessageSquare className="w-4 h-4" />
                Notifica WhatsApp inviata al {confirmedApp.clientPhone}
              </div>
              <div className="pt-4">
                <button
                  onClick={onClose}
                  className="px-8 py-3 rounded-full bg-[#1C1917] text-white text-sm font-semibold hover:bg-[#C28B59] transition-colors"
                >
                  Torna al Sito
                </button>
              </div>
            </div>
          )}
        </div>

        {step < 5 && (
          <div className="px-6 py-4 bg-white border-t border-stone-200 flex items-center justify-between">
            <div>
              {selectedServiceIds.length > 0 && (
                <div className="text-xs">
                  <span className="text-stone-500">{selectedServiceIds.length} servizi • {totalDuration} min</span>
                  <span className="font-bold text-base text-[#1C1917] block">Totale: €{totalPrice}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-4 py-2.5 rounded-xl border border-stone-300 text-sm font-semibold text-stone-700 hover:bg-stone-100"
                >
                  Indietro
                </button>
              )}

              {step < 4 ? (
                <button
                  type="button"
                  disabled={
                    (step === 1 && selectedServiceIds.length === 0) ||
                    (step === 3 && !selectedTime)
                  }
                  onClick={() => setStep(step + 1)}
                  className="px-6 py-2.5 rounded-xl bg-[#1C1917] text-white text-sm font-semibold hover:bg-[#C28B59] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Continua →
                </button>
              ) : (
                <button
                  type="submit"
                  form="booking-form"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-[#C28B59] text-white text-sm font-semibold hover:bg-[#b07a49] disabled:opacity-50 transition-colors flex items-center gap-2"
                >
                  {isSubmitting ? 'Conferma in corso...' : 'Conferma Prenotazione'}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// SEZIONE 3: DASHBOARD GESTIONALE TITOLARE SALONE
// ============================================================================
function AdminDashboard({
  services, setServices,
  staff, setStaff,
  schedule, setSchedule,
  appointments, setAppointments,
  metaConfig, setMetaConfig,
  whatsappLogs,
  sendWhatsAppNotification,
  getAvailableSlots,
  showToast,
  onLogout
}) {
  const [activeTab, setActiveTab] = useState('appointments');

  const [filterDate, setFilterDate] = useState(getTodayStr(0));
  const [showAllDates, setShowAllDates] = useState(false);
  const [filterStaff, setFilterStaff] = useState('all');
  const [sendingWaId, setSendingWaId] = useState(null);
  const [isNewAppModalOpen, setIsNewAppModalOpen] = useState(false);

  const [editingService, setEditingService] = useState(null);
  const [serviceForm, setServiceForm] = useState({ name: '', category: 'Taglio & Styling', duration: 45, price: 35, description: '' });

  const [editingStaff, setEditingStaff] = useState(null);
  const [staffForm, setStaffForm] = useState({ name: '', role: '', bio: '', color: '#c28b59', daysOff: [0, 1], serviceIds: [] });

  const [newClosedDate, setNewClosedDate] = useState('');

  const handleSendWa = async (app, type = 'confirmation') => {
    setSendingWaId(app.id);
    const res = await sendWhatsAppNotification(app, type);
    setSendingWaId(null);
    if (res.success) {
      showToast(`Messaggio WhatsApp (${type === 'reminder' ? 'Promemoria' : 'Conferma'}) inviato a ${app.clientName}!`);
    } else {
      showToast(`Errore invio Meta API: ${res.error}`, 'error');
    }
  };

  const handleSaveService = (e) => {
    e.preventDefault();
    if (editingService) {
      setServices(prev => prev.map(s => s.id === editingService.id ? { ...serviceForm, id: s.id, duration: Number(serviceForm.duration), price: Number(serviceForm.price) } : s));
      showToast('Servizio aggiornato con successo.');
    } else {
      const newS = {
        ...serviceForm,
        id: `s-${Date.now()}`,
        duration: Number(serviceForm.duration),
        price: Number(serviceForm.price)
      };
      setServices(prev => [...prev, newS]);
      showToast('Nuovo servizio aggiunto al listino.');
    }
    setEditingService(null);
    setServiceForm({ name: '', category: 'Taglio & Styling', duration: 45, price: 35, description: '' });
  };

  const handleDeleteService = (id) => {
    setServices(prev => prev.filter(s => s.id !== id));
    showToast('Servizio rimosso.');
  };

  const handleSaveStaff = (e) => {
    e.preventDefault();
    const initials = staffForm.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    if (editingStaff) {
      setStaff(prev => prev.map(st => st.id === editingStaff.id ? { ...staffForm, id: st.id, avatar: initials } : st));
      showToast('Profilo operatore aggiornato.');
    } else {
      setStaff(prev => [...prev, { ...staffForm, id: `st-${Date.now()}`, avatar: initials }]);
      showToast('Nuovo membro aggiunto al team.');
    }
    setEditingStaff(null);
    setStaffForm({ name: '', role: '', bio: '', color: '#c28b59', daysOff: [0, 1], serviceIds: services.map(s => s.id) });
  };

  const filteredAppointments = useMemo(() => {
    return appointments
      .filter(a => (showAllDates ? true : a.date === filterDate))
      .filter(a => (filterStaff === 'all' ? true : a.staffId === filterStaff))
      .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
  }, [appointments, filterDate, showAllDates, filterStaff]);

  const todayStats = useMemo(() => {
    const dayApps = appointments.filter(a => a.date === filterDate && a.status !== 'cancelled');
    return {
      count: dayApps.length,
      revenue: dayApps.reduce((sum, a) => sum + a.totalPrice, 0),
      waSent: dayApps.filter(a => a.whatsappSent).length
    };
  }, [appointments, filterDate]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-[#1C1917]">Dashboard Salone</h1>
          <p className="text-sm text-stone-500">
            Gestisci agenda, disponibilità slot, servizi, team e comunicazioni WhatsApp Business.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsNewAppModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-[#1C1917] text-white text-sm font-semibold hover:bg-[#C28B59] transition-colors flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Nuovo Appuntamento
          </button>
          <button
            onClick={onLogout}
            className="p-2.5 rounded-xl border border-stone-300 text-stone-600 hover:bg-stone-100"
            title="Esci dall'area titolare"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex overflow-x-auto gap-2 pb-2 mb-6 border-b border-stone-200">
        {[
          { id: 'appointments', label: 'Appuntamenti & Agenda', icon: CalendarIcon },
          { id: 'slots', label: 'Slot & Orari Salone', icon: Clock },
          { id: 'services', label: 'Servizi & Listino', icon: Scissors },
          { id: 'staff', label: 'Personale & Turni', icon: Users },
          { id: 'whatsapp', label: 'Meta WhatsApp API', icon: MessageSquare }
        ].map(tab => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
                active
                  ? 'bg-[#1C1917] text-white shadow-sm'
                  : 'bg-white text-stone-600 border border-stone-200/80 hover:border-stone-400'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === 'appointments' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-stone-200/80 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">Appuntamenti Data</p>
                <p className="text-2xl font-bold mt-1">{todayStats.count}</p>
              </div>
              <div className="w-11 h-11 rounded-xl bg-amber-50 text-[#C28B59] flex items-center justify-center">
                <CalendarDays className="w-5 h-5" />
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-stone-200/80 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">Incasso Previsto</p>
                <p className="text-2xl font-bold mt-1">€{todayStats.revenue}</p>
              </div>
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-stone-200/80 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">Conferme WhatsApp</p>
                <p className="text-2xl font-bold mt-1">{todayStats.waSent} / {todayStats.count}</p>
              </div>
              <div className="w-11 h-11 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-stone-200/80 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <input
                type="date"
                disabled={showAllDates}
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="px-3.5 py-2 rounded-xl border border-stone-300 text-sm font-medium disabled:opacity-40"
              />
              <label className="flex items-center gap-2 text-xs font-semibold text-stone-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showAllDates}
                  onChange={(e) => setShowAllDates(e.target.checked)}
                  className="rounded text-[#C28B59]"
                />
                Mostra tutte le date
              </label>
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-stone-400" />
              <select
                value={filterStaff}
                onChange={(e) => setFilterStaff(e.target.value)}
                className="px-3.5 py-2 rounded-xl border border-stone-300 text-sm font-medium bg-white"
              >
                <option value="all">Tutti gli Stylist</option>
                {staff.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-3">
            {filteredAppointments.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-stone-200/80">
                <CalendarIcon className="w-10 h-10 text-stone-300 mx-auto mb-3" />
                <p className="font-serif text-lg font-semibold text-stone-700">Nessun appuntamento trovato</p>
                <p className="text-xs text-stone-500 mt-1">Seleziona un’altra data oppure crea una nuova prenotazione manuale.</p>
              </div>
            ) : (
              filteredAppointments.map(app => {
                const member = staff.find(s => s.id === app.staffId);
                const appServices = services.filter(s => app.serviceIds.includes(s.id));
                const endTime = minutesToTime(timeToMinutes(app.time) + app.totalDuration);

                return (
                  <div
                    key={app.id}
                    className={`bg-white rounded-2xl p-5 border transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
                      app.status === 'cancelled' ? 'opacity-55 border-stone-200 bg-stone-50' : 'border-stone-200/90 shadow-sm'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-stone-200 text-center min-w-[92px]">
                        <span className="text-base font-bold text-[#1C1917] block">{app.time}</span>
                        <span className="text-[11px] text-stone-400">fino {endTime}</span>
                        {showAllDates && (
                          <span className="text-[10px] font-semibold text-[#C28B59] block mt-1">{app.date}</span>
                        )}
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-semibold text-base text-[#1C1917]">{app.clientName}</h4>
                          <span className="text-xs text-stone-500 flex items-center gap-1">
                            <Phone className="w-3 h-3" /> {app.clientPhone}
                          </span>
                          <span
                            className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-white"
                            style={{ backgroundColor: member?.color || '#555' }}
                          >
                            {member?.name || 'Stylist'}
                          </span>
                        </div>

                        <p className="text-sm font-medium text-stone-700 mt-1">
                          {appServices.map(s => s.name).join(' + ')}
                          <span className="text-stone-400 font-normal"> • €{app.totalPrice} ({app.totalDuration} min)</span>
                        </p>

                        {app.clientNotes && (
                          <p className="text-xs text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg mt-2 inline-block">
                            Note: {app.clientNotes}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 pt-3 lg:pt-0 border-t lg:border-t-0 border-stone-100">
                      <select
                        value={app.status}
                        onChange={(e) => {
                          const val = e.target.value;
                          setAppointments(prev => prev.map(a => a.id === app.id ? { ...a, status: val } : a));
                          showToast('Stato appuntamento aggiornato.');
                        }}
                        className={`px-3 py-2 rounded-xl text-xs font-semibold border ${
                          app.status === 'confirmed'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : app.status === 'cancelled'
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        <option value="confirmed">Confermato</option>
                        <option value="pending">In Attesa</option>
                        <option value="cancelled">Annullato</option>
                      </select>

                      <button
                        disabled={sendingWaId === app.id || app.status === 'cancelled'}
                        onClick={() => handleSendWa(app, app.whatsappSent ? 'reminder' : 'confirmation')}
                        className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                          app.whatsappSent
                            ? 'bg-[#25D366]/15 text-[#128C7E] border border-[#25D366]/40 hover:bg-[#25D366]/25'
                            : 'bg-[#25D366] text-white hover:bg-[#1ebe5d] shadow-sm'
                        } disabled:opacity-40`}
                      >
                        <Send className="w-3.5 h-3.5" />
                        {sendingWaId === app.id
                          ? 'Invio...'
                          : app.whatsappSent
                          ? `Invia Promemoria (${app.whatsappLastSentAt})`
                          : 'Invia WhatsApp'}
                      </button>

                      <button
                        onClick={() => {
                          setAppointments(prev => prev.filter(a => a.id !== app.id));
                          showToast('Appuntamento eliminato.');
                        }}
                        className="p-2 rounded-xl text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Elimina appuntamento"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {activeTab === 'slots' && (
        <div className="grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-stone-200/80 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-100 pb-4">
              <div>
                <h3 className="font-serif text-xl font-semibold">Orari Settimanali & Granularità Slot</h3>
                <p className="text-xs text-stone-500">Configura gli orari di apertura e l'intervallo di prenotazione.</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-stone-600">Intervallo Slot:</span>
                <select
                  value={schedule.slotInterval}
                  onChange={(e) => setSchedule(prev => ({ ...prev, slotInterval: Number(e.target.value) }))}
                  className="px-3 py-1.5 rounded-xl border border-stone-300 text-xs font-semibold"
                >
                  <option value={15}>Ogni 15 minuti</option>
                  <option value={30}>Ogni 30 minuti</option>
                  <option value={60}>Ogni 60 minuti</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              {[1, 2, 3, 4, 5, 6, 0].map(dayIdx => {
                const day = schedule.days[dayIdx];
                return (
                  <div key={dayIdx} className="p-3.5 rounded-xl bg-[#FAF8F5] border border-stone-200/70 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-[140px]">
                      <input
                        type="checkbox"
                        checked={day.open}
                        onChange={(e) => {
                          setSchedule(prev => ({
                            ...prev,
                            days: { ...prev.days, [dayIdx]: { ...day, open: e.target.checked } }
                          }));
                        }}
                        className="w-4 h-4 rounded text-[#C28B59]"
                      />
                      <span className={`font-semibold text-sm ${day.open ? 'text-[#1C1917]' : 'text-stone-400'}`}>
                        {DAY_NAMES[dayIdx]}
                      </span>
                    </div>

                    {day.open ? (
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <input
                          type="time"
                          value={day.start}
                          onChange={(e) => setSchedule(prev => ({
                            ...prev,
                            days: { ...prev.days, [dayIdx]: { ...day, start: e.target.value } }
                          }))}
                          className="px-2.5 py-1.5 rounded-lg bg-white border border-stone-300 font-medium"
                        />
                        <span>–</span>
                        <input
                          type="time"
                          value={day.end}
                          onChange={(e) => setSchedule(prev => ({
                            ...prev,
                            days: { ...prev.days, [dayIdx]: { ...day, end: e.target.value } }
                          }))}
                          className="px-2.5 py-1.5 rounded-lg bg-white border border-stone-300 font-medium"
                        />

                        <label className="flex items-center gap-1.5 ml-3 text-stone-600 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={day.hasBreak}
                            onChange={(e) => setSchedule(prev => ({
                              ...prev,
                              days: { ...prev.days, [dayIdx]: { ...day, hasBreak: e.target.checked } }
                            }))}
                          />
                          Pausa
                        </label>

                        {day.hasBreak && (
                          <>
                            <input
                              type="time"
                              value={day.breakStart}
                              onChange={(e) => setSchedule(prev => ({
                                ...prev,
                                days: { ...prev.days, [dayIdx]: { ...day, breakStart: e.target.value } }
                              }))}
                              className="px-2 py-1 rounded-lg bg-white border border-stone-300"
                            />
                            <span>-</span>
                            <input
                              type="time"
                              value={day.breakEnd}
                              onChange={(e) => setSchedule(prev => ({
                                ...prev,
                                days: { ...prev.days, [dayIdx]: { ...day, breakEnd: e.target.value } }
                              }))}
                              className="px-2 py-1 rounded-lg bg-white border border-stone-300"
                            />
                          </>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Chiuso</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-stone-200/80 space-y-4 h-fit">
            <h3 className="font-serif text-xl font-semibold">Chiusure Straordinarie</h3>
            <p className="text-xs text-stone-500">
              Blocca singole giornate (festività, ferie, corsi di aggiornamento) per impedire prenotazioni online.
            </p>
            <div className="flex gap-2">
              <input
                type="date"
                value={newClosedDate}
                onChange={(e) => setNewClosedDate(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl border border-stone-300 text-sm"
              />
              <button
                type="button"
                onClick={() => {
                  if (newClosedDate && !schedule.closedDates.includes(newClosedDate)) {
                    setSchedule(prev => ({ ...prev, closedDates: [...prev.closedDates, newClosedDate].sort() }));
                    setNewClosedDate('');
                    showToast('Data di chiusura aggiunta.');
                  }
                }}
                className="px-4 py-2 rounded-xl bg-[#1C1917] text-white text-xs font-semibold hover:bg-[#C28B59]"
              >
                Blocca
              </button>
            </div>

            <div className="space-y-2 pt-2">
              {schedule.closedDates.length === 0 ? (
                <p className="text-xs text-stone-400 italic">Nessuna chiusura straordinaria impostata.</p>
              ) : (
                schedule.closedDates.map(d => (
                  <div key={d} className="flex items-center justify-between px-3 py-2 rounded-xl bg-red-50 text-red-900 text-xs font-semibold">
                    <span>{formatDateIt(d)}</span>
                    <button
                      onClick={() => setSchedule(prev => ({ ...prev, closedDates: prev.closedDates.filter(item => item !== d) }))}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'services' && (
        <div className="grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-stone-200/80 h-fit">
            <h3 className="font-serif text-xl font-semibold mb-4">
              {editingService ? 'Modifica Servizio' : 'Aggiungi Nuovo Servizio'}
            </h3>
            <form onSubmit={handleSaveService} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">Nome Trattamento *</label>
                <input
                  type="text"
                  required
                  value={serviceForm.name}
                  onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                  placeholder="Es. Gloss Riflessante"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">Categoria</label>
                <select
                  value={serviceForm.category}
                  onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm bg-white"
                >
                  <option>Taglio & Styling</option>
                  <option>Colore & Balayage</option>
                  <option>Trattamenti Ristrutturanti</option>
                  <option>Barba & Uomo</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">Durata (minuti) *</label>
                  <input
                    type="number"
                    step={15}
                    min={15}
                    required
                    value={serviceForm.duration}
                    onChange={(e) => setServiceForm({ ...serviceForm, duration: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">Prezzo (€) *</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={serviceForm.price}
                    onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">Descrizione</label>
                <textarea
                  rows={2}
                  value={serviceForm.description}
                  onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#1C1917] text-white text-sm font-semibold hover:bg-[#C28B59] transition-colors"
                >
                  {editingService ? 'Salva Modifiche' : 'Aggiungi Servizio'}
                </button>
                {editingService && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingService(null);
                      setServiceForm({ name: '', category: 'Taglio & Styling', duration: 45, price: 35, description: '' });
                    }}
                    className="px-4 py-2.5 rounded-xl border border-stone-300 text-sm font-semibold"
                  >
                    Annulla
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="lg:col-span-7 space-y-3">
            {services.map(s => (
              <div key={s.id} className="bg-white rounded-2xl p-4 border border-stone-200/80 flex items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#C28B59]">{s.category}</span>
                  <h4 className="font-semibold text-base">{s.name}</h4>
                  <p className="text-xs text-stone-500 mt-0.5">{s.description}</p>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <span className="font-bold text-base block">€{s.price}</span>
                    <span className="text-xs text-stone-400">{s.duration} min</span>
                  </div>
                  <button
                    onClick={() => {
                      setEditingService(s);
                      setServiceForm(s);
                    }}
                    className="p-2 rounded-xl hover:bg-stone-100 text-stone-600"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteService(s.id)}
                    className="p-2 rounded-xl hover:bg-red-50 text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'staff' && (
        <div className="grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-stone-200/80 h-fit">
            <h3 className="font-serif text-xl font-semibold mb-4">
              {editingStaff ? 'Modifica Operatore' : 'Nuovo Membro del Team'}
            </h3>
            <form onSubmit={handleSaveStaff} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">Nome e Cognome *</label>
                <input
                  type="text"
                  required
                  value={staffForm.name}
                  onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })}
                  placeholder="Es. Davide Rinaldi"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-stone-600 mb-1">Qualifica / Ruolo *</label>
                  <input
                    type="text"
                    required
                    value={staffForm.role}
                    onChange={(e) => setStaffForm({ ...staffForm, role: e.target.value })}
                    placeholder="Es. Senior Colorist"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">Colore Agenda</label>
                  <input
                    type="color"
                    value={staffForm.color}
                    onChange={(e) => setStaffForm({ ...staffForm, color: e.target.value })}
                    className="w-full h-10 rounded-xl border border-stone-300 cursor-pointer"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">Biografia Breve</label>
                <textarea
                  rows={2}
                  value={staffForm.bio}
                  onChange={(e) => setStaffForm({ ...staffForm, bio: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1.5">Giorni di Riposo Settimanale</label>
                <div className="flex flex-wrap gap-1.5">
                  {[1, 2, 3, 4, 5, 6, 0].map(d => {
                    const isOff = staffForm.daysOff.includes(d);
                    return (
                      <button
                        key={d}
                        type="button"
                        onClick={() => {
                          setStaffForm(prev => ({
                            ...prev,
                            daysOff: isOff ? prev.daysOff.filter(x => x !== d) : [...prev.daysOff, d]
                          }));
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                          isOff ? 'bg-red-100 text-red-800 border-red-300' : 'bg-stone-50 text-stone-600 border-stone-200'
                        }`}
                      >
                        {DAY_NAMES[d].slice(0, 3)}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1.5">Servizi Abilitati</label>
                <div className="max-h-36 overflow-y-auto space-y-1.5 p-2.5 rounded-xl bg-stone-50 border border-stone-200">
                  {services.map(s => (
                    <label key={s.id} className="flex items-center gap-2 text-xs cursor-pointer">
                      <input
                        type="checkbox"
                        checked={staffForm.serviceIds.includes(s.id)}
                        onChange={(e) => {
                          setStaffForm(prev => ({
                            ...prev,
                            serviceIds: e.target.checked
                              ? [...prev.serviceIds, s.id]
                              : prev.serviceIds.filter(id => id !== s.id)
                          }));
                        }}
                      />
                      <span>{s.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#1C1917] text-white text-sm font-semibold hover:bg-[#C28B59]"
                >
                  {editingStaff ? 'Aggiorna Stylist' : 'Aggiungi al Team'}
                </button>
                {editingStaff && (
                  <button
                    type="button"
                    onClick={() => setEditingStaff(null)}
                    className="px-4 py-2.5 rounded-xl border border-stone-300 text-sm font-semibold"
                  >
                    Annulla
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="lg:col-span-7 space-y-3">
            {staff.map(member => (
              <div key={member.id} className="bg-white rounded-2xl p-5 border border-stone-200/80 flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold shrink-0"
                    style={{ backgroundColor: member.color }}
                  >
                    {member.avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold text-base">{member.name}</h4>
                    <p className="text-xs font-medium text-[#C28B59]">{member.role}</p>
                    <p className="text-xs text-stone-500 mt-1">{member.bio}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      <span className="text-[11px] px-2 py-0.5 rounded bg-stone-100 text-stone-600">
                        Riposo: {member.daysOff.map(d => DAY_NAMES[d].slice(0, 3)).join(', ') || 'Nessuno'}
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-amber-50 text-amber-800">
                        {member.serviceIds.length} servizi abilitati
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setEditingStaff(member);
                      setStaffForm(member);
                    }}
                    className="p-2 rounded-xl hover:bg-stone-100 text-stone-600"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setStaff(prev => prev.filter(s => s.id !== member.id));
                      showToast('Operatore rimosso.');
                    }}
                    className="p-2 rounded-xl hover:bg-red-50 text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'whatsapp' && (
        <div className="grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-stone-200/80 space-y-4 h-fit">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#25D366]/15 text-[#128C7E] flex items-center justify-center">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-semibold">Meta WhatsApp Cloud API</h3>
                  <p className="text-xs text-stone-500">Graph API v21.0 • Invio Template Ufficiali</p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                Modalità Operativa
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setMetaConfig({ ...metaConfig, mode: 'simulation' })}
                  className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all ${
                    metaConfig.mode === 'simulation'
                      ? 'bg-[#1C1917] text-white border-[#1C1917]'
                      : 'bg-stone-50 text-stone-600 border-stone-200'
                  }`}
                >
                  Sandbox Simulazione (Demo)
                </button>
                <button
                  type="button"
                  onClick={() => setMetaConfig({ ...metaConfig, mode: 'live' })}
                  className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all ${
                    metaConfig.mode === 'live'
                      ? 'bg-[#25D366] text-white border-[#25D366]'
                      : 'bg-stone-50 text-stone-600 border-stone-200'
                  }`}
                >
                  Produzione Live Meta API
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1">Nome Salone nei Messaggi</label>
              <input
                type="text"
                value={metaConfig.salonName}
                onChange={(e) => setMetaConfig({ ...metaConfig, salonName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1">
                Phone Number ID (Meta Developer Portal)
              </label>
              <input
                type="text"
                value={metaConfig.phoneNumberId}
                onChange={(e) => setMetaConfig({ ...metaConfig, phoneNumberId: e.target.value })}
                placeholder="Es. 109283746519283"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1">
                Permanent Access Token (System User Token)
              </label>
              <input
                type="password"
                value={metaConfig.accessToken}
                onChange={(e) => setMetaConfig({ ...metaConfig, accessToken: e.target.value })}
                placeholder="EAABsbCS1iHgBO..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">Nome Template Approvato</label>
                <input
                  type="text"
                  value={metaConfig.templateName}
                  onChange={(e) => setMetaConfig({ ...metaConfig, templateName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">Codice Lingua</label>
                <input
                  type="text"
                  value={metaConfig.languageCode}
                  onChange={(e) => setMetaConfig({ ...metaConfig, languageCode: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-mono"
                />
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed">
              <strong>Nota Tecnica:</strong> In modalità <em>Produzione Live</em>, la webapp invia una richiesta <code>POST</code> a <code>https://graph.facebook.com/v21.0/{'{PHONE_NUMBER_ID}'}/messages</code> con i parametri dinamici del cliente (Nome, Data, Ora, Servizio, Stylist).
            </div>

            <button
              type="button"
              onClick={() => showToast('Configurazione Meta WhatsApp API salvata!')}
              className="w-full py-3 rounded-xl bg-[#1C1917] text-white text-sm font-semibold hover:bg-[#C28B59] transition-colors"
            >
              Salva Configurazione API
            </button>
          </div>

          <div className="lg:col-span-6 space-y-4">
            <div className="bg-white rounded-2xl p-6 border border-stone-200/80">
              <h3 className="font-serif text-xl font-semibold mb-1">Registro Invii WhatsApp</h3>
              <p className="text-xs text-stone-500 mb-4">
                Anteprima dei messaggi inviati ai clienti e payload JSON inviati alle API di Meta.
              </p>

              {whatsappLogs.length === 0 ? (
                <div className="p-8 rounded-2xl bg-stone-50 text-center text-xs text-stone-400">
                  Nessun messaggio inviato finora. Vai su "Appuntamenti & Agenda" e clicca su "Invia WhatsApp".
                </div>
              ) : (
                <div className="space-y-4 max-h-[540px] overflow-y-auto pr-1">
                  {whatsappLogs.map(log => (
                    <div key={log.id} className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200 space-y-2.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-[#1C1917]">{log.clientName} ({log.phone})</span>
                        <span className={`px-2 py-0.5 rounded-full font-semibold text-[10px] ${
                          log.status === 'failed' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {log.mode}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-[#DCF8C6] text-[#111B21] text-xs leading-relaxed shadow-sm">
                        {log.previewText}
                        <span className="block text-[10px] text-right text-stone-500 mt-1">{log.timestamp} ✓✓</span>
                      </div>

                      {log.error && (
                        <p className="text-xs text-red-600 font-medium">Errore: {log.error}</p>
                      )}

                      <details className="text-[11px] text-stone-500">
                        <summary className="cursor-pointer font-semibold hover:text-stone-800">
                          Visualizza Payload JSON Meta Graph API
                        </summary>
                        <pre className="mt-2 p-2.5 rounded-lg bg-[#1C1917] text-emerald-300 overflow-x-auto text-[10px]">
                          {JSON.stringify(log.payload, null, 2)}
                        </pre>
                      </details>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {isNewAppModalOpen && (
        <BookingModal
          isOpen={isNewAppModalOpen}
          onClose={() => setIsNewAppModalOpen(false)}
          services={services}
          staff={staff}
          schedule={schedule}
          preselectedServiceId={null}
          getAvailableSlots={getAvailableSlots}
          onConfirmBooking={async (newApp) => {
            setAppointments(prev => [...prev, newApp]);
            await sendWhatsAppNotification(newApp, 'confirmation');
            showToast('Appuntamento inserito in agenda!');
          }}
        />
      )}
    </div>
  );
}
