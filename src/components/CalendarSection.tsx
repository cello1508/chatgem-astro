
import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, Plus, Trash2, RefreshCw } from 'lucide-react';
import GoogleCalendarButton from './GoogleCalendarButton';
import { useToast } from '@/hooks/use-toast';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  source?: 'local' | 'google';
}

const CalendarSection: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([
    { id: '1', title: 'Reunião de equipe', date: '2023-06-15', time: '14:00', source: 'local' },
    { id: '2', title: 'Entrega do projeto', date: '2023-06-20', time: '18:00', source: 'local' },
  ]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [newEvent, setNewEvent] = useState<Omit<Event, 'id' | 'source'>>({
    title: '',
    date: '',
    time: '',
  });
  const [isLoadingGoogleEvents, setIsLoadingGoogleEvents] = useState(false);
  const { toast } = useToast();

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title.trim() || !newEvent.date || !newEvent.time) return;

    const event: Event = {
      id: Date.now().toString(),
      source: 'local',
      ...newEvent,
    };

    setEvents([...events, event]);
    setNewEvent({ title: '', date: '', time: '' });
    setShowEventForm(false);
  };

  const deleteEvent = (id: string) => {
    setEvents(events.filter(event => event.id !== id));
  };

  const handleGoogleCalendarSuccess = (accessToken: string) => {
    fetchGoogleCalendarEvents(accessToken);
  };

  const fetchGoogleCalendarEvents = async (accessToken: string) => {
    setIsLoadingGoogleEvents(true);
    
    try {
      // Get events from Google Calendar API for the next 7 days
      const now = new Date();
      const oneWeekLater = new Date();
      oneWeekLater.setDate(now.getDate() + 7);
      
      const timeMin = now.toISOString();
      const timeMax = oneWeekLater.toISOString();
      
      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message || 'Erro ao buscar eventos');
      }
      
      // Filter out existing Google events (by source)
      const localEvents = events.filter(event => event.source !== 'google');
      
      // Process and add new Google events
      const googleEvents: Event[] = [];
      
      if (data.items && data.items.length > 0) {
        data.items.forEach((item: any) => {
          if (item.start && (item.start.dateTime || item.start.date)) {
            const startDateTime = item.start.dateTime || item.start.date;
            const date = new Date(startDateTime);
            
            const event: Event = {
              id: `google-${item.id}`,
              title: item.summary || 'Evento sem título',
              date: date.toISOString().split('T')[0],
              time: item.start.dateTime ? date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '00:00',
              source: 'google',
            };
            
            googleEvents.push(event);
          }
        });
      }
      
      // Update events list with both local and Google events
      setEvents([...localEvents, ...googleEvents]);
      
      toast({
        title: "Eventos sincronizados",
        description: `${googleEvents.length} eventos obtidos do Google Agenda.`,
      });
    } catch (error) {
      console.error('Erro ao buscar eventos do Google Calendar:', error);
      toast({
        title: "Erro ao sincronizar",
        description: "Não foi possível buscar os eventos do Google Agenda.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingGoogleEvents(false);
    }
  };

  const refreshGoogleEvents = () => {
    const token = sessionStorage.getItem('google_calendar_token');
    if (token) {
      fetchGoogleCalendarEvents(token);
    }
  };

  // Sort events by date and time
  const sortedEvents = [...events].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`);
    const dateB = new Date(`${b.date}T${b.time}`);
    return dateA.getTime() - dateB.getTime();
  });

  // Group events by date
  const eventsByDate: Record<string, Event[]> = sortedEvents.reduce((acc, event) => {
    const date = event.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(event);
    return acc;
  }, {} as Record<string, Event[]>);

  // Format date to display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Check if we have an access token on component mount
  useEffect(() => {
    const token = sessionStorage.getItem('google_calendar_token');
    if (token) {
      fetchGoogleCalendarEvents(token);
    }
  }, []);

  return (
    <div className="max-w-3xl mx-auto w-full h-full flex flex-col">
      <div className="p-6 flex-1 overflow-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold">Calendário</h1>
          
          <div className="flex flex-col md:flex-row gap-3">
            <GoogleCalendarButton onSuccess={handleGoogleCalendarSuccess} />
            
            {sessionStorage.getItem('google_calendar_token') && (
              <button
                onClick={refreshGoogleEvents}
                disabled={isLoadingGoogleEvents}
                className="flex items-center gap-2 rounded-lg px-4 py-2 bg-gray-700/50 hover:bg-gray-700/70 transition-all"
              >
                <RefreshCw size={18} className={isLoadingGoogleEvents ? 'animate-spin' : ''} />
                Atualizar
              </button>
            )}
            
            {!showEventForm && (
              <button 
                onClick={() => setShowEventForm(true)}
                className="bg-success/10 text-success rounded-lg p-2 flex items-center gap-1 hover:bg-success/20 transition-all"
              >
                <Plus size={18} />
                <span>Novo evento</span>
              </button>
            )}
          </div>
        </div>
        
        {/* Event form */}
        {showEventForm && (
          <form onSubmit={handleAddEvent} className="mb-6 glass p-4 rounded-xl">
            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-1">Título</label>
              <input
                type="text"
                value={newEvent.title}
                onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                placeholder="Título do evento"
                className="w-full glass-input rounded-lg px-3 py-2 text-gray-100 focus:outline-none placeholder:text-gray-500"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Data</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    <CalendarIcon size={16} />
                  </div>
                  <input
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                    className="w-full glass-input rounded-lg pl-10 pr-3 py-2 text-gray-100 focus:outline-none"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Hora</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    <Clock size={16} />
                  </div>
                  <input
                    type="time"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                    className="w-full glass-input rounded-lg pl-10 pr-3 py-2 text-gray-100 focus:outline-none"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowEventForm(false)}
                className="px-4 py-2 rounded-lg border border-gray-700 hover:bg-gray-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={!newEvent.title.trim() || !newEvent.date || !newEvent.time}
                className="px-4 py-2 rounded-lg bg-success hover:bg-success/90 text-black transition-colors"
              >
                Salvar
              </button>
            </div>
          </form>
        )}

        {/* Events list */}
        <div className="space-y-6">
          {Object.keys(eventsByDate).length > 0 ? (
            Object.entries(eventsByDate).map(([date, dateEvents]) => (
              <div key={date} className="glass p-4 rounded-xl">
                <h3 className="text-lg font-medium text-success mb-3">
                  {formatDate(date)}
                </h3>
                <div className="space-y-3">
                  {dateEvents.map(event => (
                    <div key={event.id} className="flex items-center gap-3 border-b border-gray-700/50 pb-3 last:border-0 last:pb-0">
                      <div className={`rounded-lg p-2 ${event.source === 'google' ? 'bg-blue-900/30' : 'bg-gray-800'}`}>
                        <Clock size={18} className={event.source === 'google' ? 'text-blue-400' : 'text-success'} />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{event.title}</p>
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-gray-400">{event.time}</p>
                          {event.source === 'google' && (
                            <span className="text-xs bg-blue-900/20 text-blue-400 px-2 py-0.5 rounded">Google</span>
                          )}
                        </div>
                      </div>
                      {event.source !== 'google' && (
                        <button 
                          onClick={() => deleteEvent(event.id)}
                          className="text-gray-500 hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <CalendarIcon size={48} className="mx-auto mb-3 opacity-50" />
              <p>Sem eventos programados</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarSection;
