import { ContactMessage } from '../types';

export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const phoneRegex = /^(\+\d{1,3})?(\s|-)?\d{9,14}$/;

export function validateEmail(email: string): boolean {
  return emailRegex.test(email.trim().toLowerCase());
}

export function validatePhoneNumber(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 9 && cleaned.length <= 15;
}

export function validateContactForm(data: {
  name?: string;
  email?: string;
  destination?: string;
  message?: string;
}): {
  valid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  if (!data.name?.trim()) {
    errors.name = 'El nombre es requerido';
  } else if (data.name.trim().length < 3) {
    errors.name = 'El nombre debe tener al menos 3 caracteres';
  }

  if (!data.email?.trim()) {
    errors.email = 'El email es requerido';
  } else if (!validateEmail(data.email)) {
    errors.email = 'El email no es válido (ej: nombre@ejemplo.com)';
  }

  if (!data.message?.trim()) {
    errors.message = 'El mensaje es requerido';
  } else if (data.message.trim().length < 10) {
    errors.message = 'El mensaje debe tener al menos 10 caracteres';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function sanitizeHTML(html: string): string {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
}

export function validatePromotion(data: {
  title?: string;
  description?: string;
  price?: string;
  image?: string;
}): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (!data.title?.trim()) {
    errors.title = 'El título es requerido';
  } else if (data.title.trim().length < 5) {
    errors.title = 'El título debe tener al menos 5 caracteres';
  }

  if (!data.description?.trim()) {
    errors.description = 'La descripción es requerida';
  } else if (data.description.trim().length < 10) {
    errors.description = 'La descripción debe tener al menos 10 caracteres';
  }

  if (!data.price?.trim()) {
    errors.price = 'El precio es requerido';
  }

  if (!data.image?.trim()) {
    errors.image = 'La imagen es requerida';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
