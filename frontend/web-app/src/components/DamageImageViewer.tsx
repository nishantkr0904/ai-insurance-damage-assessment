import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, ZoomIn, X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { ClaimImage, DamageRegion } from '../types';

interface Props {
  images: (ClaimImage | string)[];
  regions: DamageRegion[];
  /** Natural pixel size of the source images (default: 400×300) */
  naturalSize?: { width: number; height: number };
}

const SEVERITY_STYLE = {
  minor:    { border: '#34d399', bg: 'rgba(52,211,153,0.12)',  label: 'bg-green-500',  text: 'Minor' },
  moderate: { border: '#fbbf24', bg: 'rgba(251,191,36,0.12)', label: 'bg-yellow-500', text: 'Moderate' },
  severe:   { border: '#f87171', bg: 'rgba(248,113,113,0.12)', label: 'bg-red-500',   text: 'Severe' },
};

export function DamageImageViewer({ images, regions, naturalSize = { width: 400, height: 300 } }: Props) {
  const [showBoxes, setShowBoxes] = useState(true);
  const [activeIdx, setActiveIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const active = images[activeIdx];
  const getImageUrl = (img: ClaimImage | string): string => {
    return typeof img === 'string' ? img : img.url;
  };

  const toPercent = (box: DamageRegion['boundingBox']) => ({
    left:   `${(box.x / naturalSize.width) * 100}%`,
    top:    `${(box.y / naturalSize.height) * 100}%`,
    width:  `${(box.width / naturalSize.width) * 100}%`,
    height: `${(box.height / naturalSize.height) * 100}%`,
  });

  const prev = () => setActiveIdx((i) => Math.max(0, i - 1));
  const next = () => setActiveIdx((i) => Math.min(images.length - 1, i + 1));

  if (images.length === 0) {
    return (
      <div className="aspect-video bg-slate-800/50 rounded-xl flex items-center justify-center border border-dashed border-white/10">
        <p className="text-slate-500 text-sm">No images uploaded</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400">
          Image {activeIdx + 1} of {images.length}
          {regions.length > 0 && ` · ${regions.length} damage region${regions.length > 1 ? 's' : ''} detected`}
        </span>
        <div className="flex items-center gap-2">
          {regions.length > 0 && (
            <button
              onClick={() => setShowBoxes((v) => !v)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                showBoxes
                  ? 'gradient-brand text-white'
                  : 'glass text-slate-400 hover:text-slate-200'
              }`}
            >
              {showBoxes ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
              {showBoxes ? 'Boxes On' : 'Boxes Off'}
            </button>
          )}
          <button
            onClick={() => setLightboxOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium glass text-slate-400 hover:text-slate-200 transition-colors"
          >
            <ZoomIn className="w-3 h-3" /> Full view
          </button>
        </div>
      </div>

      {/* Main viewer */}
      <div className="relative rounded-xl overflow-hidden bg-slate-900 aspect-video select-none">
        <img
          src={getImageUrl(active)}
          alt={`Damage image ${activeIdx + 1}`}
          className="w-full h-full object-cover"
          draggable={false}
        />

        {/* Bounding boxes */}
        <AnimatePresence>
          {showBoxes && regions.map((region, i) => {
            const style = SEVERITY_STYLE[region.severity];
            const pos = toPercent(region.boundingBox);
            return (
              <motion.div
                key={region.id}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ delay: i * 0.12, duration: 0.3 }}
                className="absolute pointer-events-none"
                style={{
                  left: pos.left,
                  top: pos.top,
                  width: pos.width,
                  height: pos.height,
                  border: `2px solid ${style.border}`,
                  background: style.bg,
                  borderRadius: '6px',
                }}
              >
                {/* Corner accents */}
                {[
                  'top-[-2px] left-[-2px] border-t-2 border-l-2',
                  'top-[-2px] right-[-2px] border-t-2 border-r-2',
                  'bottom-[-2px] left-[-2px] border-b-2 border-l-2',
                  'bottom-[-2px] right-[-2px] border-b-2 border-r-2',
                ].map((cls, ci) => (
                  <span
                    key={ci}
                    className={`absolute w-3 h-3 ${cls}`}
                    style={{ borderColor: style.border }}
                  />
                ))}

                {/* Label */}
                <span
                  className={`absolute -top-6 left-0 px-2 py-0.5 rounded-t-md text-[10px] font-bold text-white ${style.label} whitespace-nowrap`}
                >
                  {region.type} · {(region.confidence * 100).toFixed(0)}%
                </span>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Nav arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              disabled={activeIdx === 0}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 glass rounded-full flex items-center justify-center text-slate-300 hover:text-white disabled:opacity-30 transition-opacity"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={next}
              disabled={activeIdx === images.length - 1}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 glass rounded-full flex items-center justify-center text-slate-300 hover:text-white disabled:opacity-30 transition-opacity"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Damage count badge */}
        {showBoxes && regions.length > 0 && (
          <div className="absolute top-2 right-2 px-2 py-1 glass rounded-lg text-xs font-semibold text-white">
            {regions.length} region{regions.length > 1 ? 's' : ''} detected
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2">
          {images.map((img, i) => {
            const thumbUrl = typeof img === 'string' ? img : (img.thumbnailUrl || img.url);
            return (
              <button
                key={typeof img === 'string' ? `img-${i}` : img.id}
                onClick={() => setActiveIdx(i)}
                className={`relative w-16 h-12 rounded-lg overflow-hidden flex-shrink-0 transition-all ${
                  i === activeIdx ? 'ring-2 ring-indigo-500' : 'opacity-50 hover:opacity-80'
                }`}
              >
                <img src={thumbUrl} alt="" className="w-full h-full object-cover" />
              </button>
            );
          })}
        </div>
      )}

      {/* Region legend */}
      {showBoxes && regions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-2"
        >
          {regions.map((region) => {
            const style = SEVERITY_STYLE[region.severity];
            return (
              <span
                key={region.id}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium glass"
                style={{ color: style.border }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: style.border }} />
                {region.type} · {style.text} · {(region.confidence * 100).toFixed(0)}%
              </span>
            );
          })}
        </motion.div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setLightboxOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setLightboxOpen(false)}
                className="absolute -top-10 right-0 w-8 h-8 glass rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-colors z-10"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="relative rounded-2xl overflow-hidden bg-slate-900">
                <img src={getImageUrl(active)} alt="Full view" className="w-full object-contain max-h-[80vh]" />
                {showBoxes && regions.map((region, i) => {
                  const style = SEVERITY_STYLE[region.severity];
                  const pos = toPercent(region.boundingBox);
                  return (
                    <motion.div
                      key={region.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className="absolute pointer-events-none"
                      style={{
                        left: pos.left, top: pos.top,
                        width: pos.width, height: pos.height,
                        border: `2px solid ${style.border}`,
                        background: style.bg,
                        borderRadius: '6px',
                      }}
                    >
                      <span className={`absolute -top-6 left-0 px-2 py-0.5 rounded-t-md text-[10px] font-bold text-white ${style.label} whitespace-nowrap`}>
                        {region.type} · {(region.confidence * 100).toFixed(0)}%
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
