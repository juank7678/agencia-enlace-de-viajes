import { supabase } from './supabase';
import { MEDIA_BUCKET } from '../config';

const MAX_DIMENSION = 1600;
const QUALITY = 0.82;
const MAX_INPUT_BYTES = 15 * 1024 * 1024;

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('No se pudo leer la imagen.'));
    };
    img.src = url;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, type, QUALITY));
}

// Redimensiona a un máximo de 1600px y recomprime (WebP si el navegador lo soporta, si no JPEG).
export async function compressImage(file: File): Promise<Blob> {
  if (!file.type.startsWith('image/')) throw new Error('El archivo debe ser una imagen.');
  if (file.size > MAX_INPUT_BYTES) throw new Error('La imagen supera 15 MB.');

  const img = await loadImage(file);
  const scale = Math.min(1, MAX_DIMENSION / Math.max(img.width, img.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(img.width * scale);
  canvas.height = Math.round(img.height * scale);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('El navegador no permite procesar imágenes.');
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  const webp = await canvasToBlob(canvas, 'image/webp');
  if (webp && webp.type === 'image/webp') return webp;
  const jpeg = await canvasToBlob(canvas, 'image/jpeg');
  if (!jpeg) throw new Error('No se pudo comprimir la imagen.');
  return jpeg;
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('No se pudo leer la imagen.'));
    reader.readAsDataURL(blob);
  });
}

export interface UploadedImage {
  url: string;
  storage: 'bucket' | 'inline';
}

/**
 * Sube la imagen comprimida al bucket público. Si el bucket aún no existe
 * (migración pendiente), devuelve la imagen comprimida embebida como respaldo.
 */
export async function uploadImage(file: File, folder: 'promotions' | 'posters'): Promise<UploadedImage> {
  const blob = await compressImage(file);
  const ext = blob.type === 'image/webp' ? 'webp' : 'jpg';
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from(MEDIA_BUCKET)
    .upload(path, blob, { contentType: blob.type, cacheControl: '31536000', upsert: false });

  if (!error) {
    const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path);
    return { url: data.publicUrl, storage: 'bucket' };
  }

  console.warn('Storage no disponible, se usará la imagen embebida:', error.message);
  return { url: await blobToDataUrl(blob), storage: 'inline' };
}
