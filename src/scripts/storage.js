const STORAGE_KEY = '@mundo-pet:appointments_v1';

export const INITIAL_APPOINTMENTS = [
  {
    id: 'apt-1',
    date: '2024-01-10',
    time: '09:00',
    tutor: 'Fernanda Costa',
    pet: 'Thor',
    phone: '(11) 98765-4321',
    service: 'Vacinação',
    period: 'morning'
  },
  {
    id: 'apt-2',
    date: '2024-01-10',
    time: '13:00',
    tutor: 'João Souza',
    pet: 'Mel',
    phone: '(11) 97654-3210',
    service: 'Corte de Unhas',
    period: 'afternoon'
  },
  {
    id: 'apt-3',
    date: '2024-01-10',
    time: '14:00',
    tutor: 'Pedro Martins',
    pet: 'Bella',
    phone: '(11) 96543-2109',
    service: 'Aplicação de Anti-pulgas',
    period: 'afternoon'
  },
  {
    id: 'apt-4',
    date: '2024-01-10',
    time: '15:00',
    tutor: 'Juliana Rocha',
    pet: 'Simba',
    phone: '(11) 95432-1098',
    service: 'Tosa Higiênica',
    period: 'afternoon'
  },
  {
    id: 'apt-5',
    date: '2024-01-10',
    time: '20:00',
    tutor: 'Camila Santos',
    pet: 'Max',
    phone: '(11) 94321-0987',
    service: 'Limpeza de Dentes',
    period: 'night'
  }
];

export function getAppointments() {
  try {
    if (typeof localStorage === 'undefined') {
      return INITIAL_APPOINTMENTS;
    }
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Initialize with Figma mock data
      saveAppointments(INITIAL_APPOINTMENTS);
      return INITIAL_APPOINTMENTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_APPOINTMENTS;
  } catch (error) {
    console.error('Error reading appointments from localStorage:', error);
    return INITIAL_APPOINTMENTS;
  }
}

export function saveAppointments(appointments) {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
    }
  } catch (error) {
    console.error('Error saving appointments to localStorage:', error);
  }
}

export function addAppointment(newAppointment) {
  const list = getAppointments();
  const appointmentWithId = {
    ...newAppointment,
    id: newAppointment.id || `apt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
  };
  list.push(appointmentWithId);
  saveAppointments(list);
  return appointmentWithId;
}

export function removeAppointment(id) {
  const list = getAppointments();
  const updated = list.filter(item => item.id !== id);
  saveAppointments(updated);
  return updated;
}
