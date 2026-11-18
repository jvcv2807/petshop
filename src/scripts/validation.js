import { getAppointments } from './storage.js';

/**
 * Determines which section an hour belongs to, or null if outside valid windows.
 * Valid windows:
 * - Manhã: 09:00 - 12:00
 * - Tarde: 13:00 - 18:00
 * - Noite: 19:00 - 21:00
 */
export function getSchedulePeriod(timeString) {
  if (!timeString) return null;
  const match = timeString.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return null;

  const hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);

  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    return null;
  }

  const totalMinutes = hours * 60 + minutes;

  // Morning: 09:00 (540m) to 12:00 (720m)
  if (totalMinutes >= 540 && totalMinutes <= 720) {
    return 'morning';
  }

  // Afternoon: 13:00 (780m) to 18:00 (1080m)
  if (totalMinutes >= 780 && totalMinutes <= 1080) {
    return 'afternoon';
  }

  // Night: 19:00 (1140m) to 21:00 (1260m)
  if (totalMinutes >= 1140 && totalMinutes <= 1260) {
    return 'night';
  }

  return null;
}

/**
 * Validates the new appointment data against all business rules.
 * Returns { isValid: boolean, errors: Record<string, string>, period: string | null }
 */
export function validateAppointment(formData, excludeId = null) {
  const errors = {};

  // 1. Tutor validation
  if (!formData.tutor || !formData.tutor.trim()) {
    errors.tutor = 'Informe o nome do tutor.';
  } else if (formData.tutor.trim().length < 2) {
    errors.tutor = 'O nome do tutor deve ter pelo menos 2 caracteres.';
  }

  // 2. Pet validation
  if (!formData.pet || !formData.pet.trim()) {
    errors.pet = 'Informe o nome do pet.';
  } else if (formData.pet.trim().length < 2) {
    errors.pet = 'O nome do pet deve ter pelo menos 2 caracteres.';
  }

  // 3. Phone validation
  const phoneDigits = (formData.phone || '').replace(/\D/g, '');
  if (!formData.phone || !formData.phone.trim()) {
    errors.phone = 'Informe o telefone de contato.';
  } else if (phoneDigits.length < 10) {
    errors.phone = 'Informe um telefone válido com DDD (ex: (11) 98765-4321).';
  }

  // 4. Service validation
  if (!formData.service || !formData.service.trim()) {
    errors.service = 'Informe a descrição do serviço.';
  }

  // 5. Date validation
  if (!formData.date || !formData.date.trim()) {
    errors.date = 'Selecione a data do agendamento.';
  } else if (!/^\d{4}-\d{2}-\d{2}$/.test(formData.date.trim())) {
    errors.date = 'Formato de data inválido (utilize AAAA-MM-DD).';
  }

  // 6. Time & Period validation
  let period = null;
  if (!formData.time || !formData.time.trim()) {
    errors.time = 'Informe o horário do atendimento.';
  } else {
    period = getSchedulePeriod(formData.time.trim());
    if (!period) {
      errors.time = 'Horário fora das faixas permitidas (09h-12h, 13h-18h ou 19h-21h).';
    }
  }

  // 7. Conflict prevention (no two appointments for the same date & time)
  if (!errors.date && !errors.time) {
    const existing = getAppointments();
    const hasConflict = existing.some(item => {
      if (excludeId && item.id === excludeId) return false;
      return item.date === formData.date.trim() && item.time === formData.time.trim();
    });

    if (hasConflict) {
      errors.time = `Já existe um agendamento para ${formData.time.trim()} no dia selecionado.`;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    period
  };
}
