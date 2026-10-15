import React, { useState } from 'react';
import { Folder, Image as ImageIcon, Upload, Trash2, Maximize2, Loader2, Pencil } from 'lucide-react';
import { Poster } from '../types';
import { POSTER_FOLDERS } from '../data/initialData';

interface PostersProps {
  posters: Poster[];
  isLoading: boolean;
  isAdmin: boolean;
  onSelectImage: (src: string, title: string) => void;
  onDeletePoster: (poster: Poster) => void;
  onEditPoster: (poster: Poster) => void;
  onOpenUploadPosterModal: () => void;
}

export const Posters: React.FC<PostersProps> = ({
  posters,
  isLoading,
  isAdmin,
  onSelectImage,
  onDeletePoster,
  onEditPoster,
  onOpenUploadPosterModal,
}) => {
  const [activeFolder, setActiveFolder] = useState<string>('all');

  const filteredPosters =
    activeFolder === 'all'
      ? posters
      : posters.filter((p) => p.folder.toLowerCase() === activeFolder.toLowerCase());

  return (
    <section className="py-24 px-4 sm:px-6 bg-white" id="publicaciones">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-100 text-teal-800 text-xs font-semibold uppercase tracking-wider">
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Material Gráfico & Posters</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-slate-900 leading-tight">
            Publicaciones por <span className="text-teal-600 italic">Destino</span>
          </h2>

          <p className="text-slate-600 text-base sm:text-lg">
            Explora nuestra galería gráfica con los mejores flyers, paquetes y folletos oficiales de cada región.
          </p>

        </div>

        {/* Poster Folders List */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-10">
          <button
            onClick={() => setActiveFolder('all')}
            className={`p-4 rounded-2xl border transition text-center cursor-pointer ${
              activeFolder === 'all'
                ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200/80'
            }`}
          >
            <Folder className="w-6 h-6 mx-auto mb-2 text-amber-400" />
            <div className="font-bold text-xs">Todos</div>
            <div className="text-[10px] opacity-75 mt-0.5">{posters.length} archivos</div>
          </button>

          {POSTER_FOLDERS.map((folder) => {
            const count = posters.filter((p) => p.folder.toLowerCase() === folder.name.toLowerCase()).length;
            const isSelected = activeFolder === folder.name;
            return (
              <button
                key={folder.name}
                onClick={() => setActiveFolder(folder.name)}
                className={`p-4 rounded-2xl border transition text-center cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200/80'
                }`}
              >
                <Folder className={`w-6 h-6 mx-auto mb-2 ${isSelected ? 'text-teal-300' : 'text-orange-500'}`} />
                <div className="font-bold text-xs truncate">{folder.label}</div>
                <div className="text-[10px] opacity-75 mt-0.5">{count} posters</div>
              </button>
            );
          })}
        </div>

        {/* Posters Loading / Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
            <span className="text-sm font-medium">Cargando publicaciones...</span>
          </div>
        ) : filteredPosters.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 rounded-3xl border border-slate-200/80 max-w-lg mx-auto">
            <p className="text-slate-500 font-medium text-sm">No hay publicaciones en esta carpeta todavía.</p>
            {isAdmin && (
              <button
                onClick={onOpenUploadPosterModal}
                className="mt-4 px-6 py-2.5 bg-teal-600 text-white font-semibold rounded-full text-sm inline-flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                <span>Subir Poster Aquí</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredPosters.map((poster) => (
              <div
                key={poster.id}
                onClick={() => onSelectImage(poster.image, poster.title)}
                className="group relative rounded-2xl overflow-hidden bg-slate-900 aspect-[3/4] cursor-pointer shadow-md hover:shadow-2xl transition duration-500 border border-slate-100"
              >
                <img
                  src={poster.image}
                  alt={poster.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent opacity-80 group-hover:opacity-95 transition" />

                {/* Folder Tag */}
                <div className="absolute top-3 left-3 px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-full text-[10px] font-semibold text-slate-200 uppercase tracking-wider">
                  {poster.folder}
                </div>

                {/* Maximize Icon */}
                {!isAdmin && (
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition transform group-hover:scale-110">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                )}

                {/* Caption */}
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h4 className="font-serif font-bold text-base line-clamp-1">{poster.title}</h4>
                  <p className="text-slate-300 text-xs mt-0.5">Haz clic para ampliar</p>
                </div>

                {/* Admin Actions */}
                {isAdmin && (
                  <div className="absolute top-3 right-3 flex gap-2 z-10">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditPoster(poster);
                      }}
                      className="w-9 h-9 rounded-full bg-white text-slate-800 flex items-center justify-center shadow-lg hover:bg-orange-50 transition"
                      title="Editar poster"
                      aria-label={`Editar ${poster.title}`}
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeletePoster(poster);
                      }}
                      className="w-9 h-9 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg hover:bg-red-700 transition"
                      title="Eliminar poster"
                      aria-label={`Eliminar ${poster.title}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Admin Upload Action - Only visible when Admin Mode is unlocked */}
        {isAdmin && (
          <div className="text-center mt-12">
            <button
              onClick={onOpenUploadPosterModal}
              className="px-8 py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm rounded-full shadow-lg inline-flex items-center gap-2 transition"
            >
              <Upload className="w-4 h-4" />
              <span>Subir Nuevo Poster (Administrador)</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
