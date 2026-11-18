/**
 * Modal controller
 */
export class ScheduleModal {
  constructor({ overlayElement, formElement, firstInputElement, onClose }) {
    this.overlay = overlayElement;
    this.form = formElement;
    this.firstInput = firstInputElement;
    this.onClose = onClose;
    this.isOpen = false;
    this.lastFocusedElement = null;

    this.init();
  }

  init() {
    // Backdrop click
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) {
        this.close();
      }
    });

    // Close buttons (e.g. data-close-modal)
    const closeButtons = this.overlay.querySelectorAll('[data-close-modal]');
    closeButtons.forEach(btn => {
      btn.addEventListener('click', () => this.close());
    });

    // Keyboard handlers (ESC to close, Tab to trap focus)
    window.addEventListener('keydown', (e) => {
      if (!this.isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        this.close();
        return;
      }

      if (e.key === 'Tab') {
        this.trapFocus(e);
      }
    });
  }

  open(defaultDate = null) {
    this.lastFocusedElement = document.activeElement;
    this.isOpen = true;
    this.overlay.classList.add('active');
    document.body.classList.add('modal-open');
    this.overlay.setAttribute('aria-hidden', 'false');

    // Reset errors and fields
    this.clearErrors();

    if (defaultDate && this.form.elements['date']) {
      this.form.elements['date'].value = defaultDate;
    }

    // Initial focus on the first field (Nome do tutor) as required
    setTimeout(() => {
      if (this.firstInput) {
        this.firstInput.focus();
      }
    }, 50);
  }

  close() {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.overlay.classList.remove('active');
    document.body.classList.remove('modal-open');
    this.overlay.setAttribute('aria-hidden', 'true');

    this.clearErrors();
    this.form.reset();

    if (this.lastFocusedElement && typeof this.lastFocusedElement.focus === 'function') {
      this.lastFocusedElement.focus();
    }

    if (typeof this.onClose === 'function') {
      this.onClose();
    }
  }

  clearErrors() {
    const errorContainers = this.form.querySelectorAll('.form-group');
    errorContainers.forEach(group => {
      group.classList.remove('has-error');
      const inputWrapper = group.querySelector('.input-wrapper');
      if (inputWrapper) inputWrapper.classList.remove('has-error');
      const errorMsg = group.querySelector('.form-error');
      if (errorMsg) errorMsg.textContent = '';
    });
  }

  displayErrors(errors) {
    this.clearErrors();

    let firstErrorField = null;

    Object.entries(errors).forEach(([fieldName, message]) => {
      const field = this.form.elements[fieldName];
      if (!field) return;

      const group = field.closest('.form-group');
      if (group) {
        group.classList.add('has-error');
        const inputWrapper = group.querySelector('.input-wrapper');
        if (inputWrapper) inputWrapper.classList.add('has-error');
        const errorMsg = group.querySelector('.form-error');
        if (errorMsg) errorMsg.textContent = message;

        if (!firstErrorField) {
          firstErrorField = field;
        }
      }
    });

    if (firstErrorField) {
      firstErrorField.focus();
    }
  }

  trapFocus(e) {
    const focusableSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const focusableElements = Array.from(this.overlay.querySelectorAll(focusableSelectors))
      .filter(el => !el.disabled && el.offsetParent !== null);

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  }
}
