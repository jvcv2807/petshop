import { getAppointments, addAppointment, removeAppointment } from './storage.js';
import { validateAppointment, getSchedulePeriod } from './validation.js';
import { formatPhone, formatDateToBR, formatTime } from './formatters.js';
import { ScheduleModal } from './modal.js';
import { showToast } from './toast.js';

export class App {
  constructor() {
    // Default initial date: 2024-01-10 (exact date shown in Figma)
    this.currentDate = '2024-01-10';
    this.appointments = [];

    // DOM Elements
    this.dateInput = document.getElementById('agenda-date-input');
    this.dateDisplayText = document.getElementById('agenda-date-display');
    this.btnNewSchedule = document.getElementById('btn-new-schedule');

    this.morningList = document.getElementById('morning-appointments');
    this.afternoonList = document.getElementById('afternoon-appointments');
    this.nightList = document.getElementById('night-appointments');

    this.modalOverlay = document.getElementById('schedule-modal');
    this.modalForm = document.getElementById('schedule-form');
    this.tutorInput = document.getElementById('tutor-input');
    this.phoneInput = document.getElementById('phone-input');
    this.timeInput = document.getElementById('time-input');

    this.init();
  }

  init() {
    this.modal = new ScheduleModal({
      overlayElement: this.modalOverlay,
      formElement: this.modalForm,
      firstInputElement: this.tutorInput
    });

    this.setupEventListeners();
    this.loadAppointments();
    this.setDate(this.currentDate);
  }

  setupEventListeners() {
    // Open modal button
    this.btnNewSchedule.addEventListener('click', () => {
      this.modal.open(this.currentDate);
    });

    // Date picker trigger
    const datePickerButton = document.querySelector('.date-picker-button');
    if (datePickerButton) {
      datePickerButton.addEventListener('click', () => {
        if (typeof this.dateInput.showPicker === 'function') {
          try {
            this.dateInput.showPicker();
          } catch (_) {
            this.dateInput.focus();
          }
        }
      });
    }

    // Date picker input change
    this.dateInput.addEventListener('change', (e) => {
      if (e.target.value) {
        this.setDate(e.target.value);
      }
    });

    // Phone input mask
    this.phoneInput.addEventListener('input', (e) => {
      e.target.value = formatPhone(e.target.value);
    });

    // Modal form submission
    this.modalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleFormSubmit();
    });

    // Make input wrappers focus input when clicked
    const inputWrappers = this.modalForm.querySelectorAll('.input-wrapper');
    inputWrappers.forEach(wrapper => {
      wrapper.addEventListener('click', (e) => {
        const input = wrapper.querySelector('input, textarea');
        if (input && e.target !== input) {
          input.focus();
          if ((input.type === 'date' || input.type === 'time') && typeof input.showPicker === 'function') {
            try { input.showPicker(); } catch (_) {}
          }
        }
      });
    });

    // Clear field error on input
    const inputs = this.modalForm.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      input.addEventListener('input', () => {
        const group = input.closest('.form-group');
        if (group && group.classList.contains('has-error')) {
          group.classList.remove('has-error');
          const wrapper = group.querySelector('.input-wrapper');
          if (wrapper) wrapper.classList.remove('has-error');
          const errorMsg = group.querySelector('.form-error');
          if (errorMsg) errorMsg.textContent = '';
        }
      });
    });
  }

  setDate(newDate) {
    this.currentDate = newDate;
    this.dateInput.value = newDate;
    this.dateDisplayText.textContent = formatDateToBR(newDate);
    this.renderAgenda();
  }

  loadAppointments() {
    this.appointments = getAppointments();
  }

  renderAgenda() {
    this.loadAppointments();

    // Filter appointments for currently selected date
    const dayAppointments = this.appointments.filter(item => item.date === this.currentDate);

    // Group by period and sort by time
    const morning = dayAppointments
      .filter(item => (item.period === 'morning' || getSchedulePeriod(item.time) === 'morning'))
      .sort((a, b) => a.time.localeCompare(b.time));

    const afternoon = dayAppointments
      .filter(item => (item.period === 'afternoon' || getSchedulePeriod(item.time) === 'afternoon'))
      .sort((a, b) => a.time.localeCompare(b.time));

    const night = dayAppointments
      .filter(item => (item.period === 'night' || getSchedulePeriod(item.time) === 'night'))
      .sort((a, b) => a.time.localeCompare(b.time));

    this.renderSection(this.morningList, morning, 'Manhã');
    this.renderSection(this.afternoonList, afternoon, 'Tarde');
    this.renderSection(this.nightList, night, 'Noite');
  }

  renderSection(container, appointments, periodName) {
    container.innerHTML = '';

    if (appointments.length === 0) {
      container.innerHTML = `
        <div class="appointments-empty">
          <span>Nenhum agendamento para o período da ${periodName.toLowerCase()}.</span>
        </div>
      `;
      return;
    }

    appointments.forEach(apt => {
      const itemEl = document.createElement('div');
      itemEl.className = 'appointment-item';
      itemEl.setAttribute('data-id', apt.id);

      itemEl.innerHTML = `
        <span class="appointment-item__time">${formatTime(apt.time)}</span>
        <div class="appointment-item__client">
          <span class="appointment-item__pet">${this.escapeHtml(apt.pet)}</span>
          <span class="appointment-item__tutor">/ ${this.escapeHtml(apt.tutor)}</span>
        </div>
        <span class="appointment-item__service">${this.escapeHtml(apt.service)}</span>
        <button type="button" class="appointment-item__btn-remove" data-action="remove" data-id="${apt.id}">
          Remover agendamento
        </button>
      `;

      const removeBtn = itemEl.querySelector('[data-action="remove"]');
      removeBtn.addEventListener('click', () => {
        this.handleRemoveAppointment(apt.id, apt.pet);
      });

      container.appendChild(itemEl);
    });
  }

  handleRemoveAppointment(id, petName) {
    this.appointments = removeAppointment(id);
    this.renderAgenda();
    showToast(`Agendamento de "${petName}" removido com sucesso.`, 'info');
  }

  handleFormSubmit() {
    const formData = {
      tutor: this.modalForm.elements['tutor'].value,
      pet: this.modalForm.elements['pet'].value,
      phone: this.modalForm.elements['phone'].value,
      service: this.modalForm.elements['service'].value,
      date: this.modalForm.elements['date'].value,
      time: this.modalForm.elements['time'].value
    };

    const validation = validateAppointment(formData);

    if (!validation.isValid) {
      this.modal.displayErrors(validation.errors);
      return;
    }

    // Save appointment
    const newAppointment = addAppointment({
      ...formData,
      time: formatTime(formData.time),
      period: validation.period
    });

    this.modal.close();
    
    // If appointment is on another date, switch agenda to that date
    if (newAppointment.date !== this.currentDate) {
      this.setDate(newAppointment.date);
    } else {
      this.renderAgenda();
    }

    showToast(`Agendamento para "${newAppointment.pet}" realizado com sucesso!`, 'success');
  }

  escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}
