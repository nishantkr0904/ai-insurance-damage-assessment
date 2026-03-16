import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Image as ImageIcon, AlertCircle, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface UploadImageFormProps {
  onFilesChange: (files: File[]) => void;
  maxFiles?: number;
}

interface PreviewFile {
  file: File;
  preview: string;
}

export function UploadImageForm({ onFilesChange, maxFiles = 5 }: UploadImageFormProps) {
  const [files, setFiles] = useState<PreviewFile[]>([]);

  const onDrop = useCallback(
    (accepted: File[]) => {
      const remaining = maxFiles - files.length;
      if (remaining <= 0) {
        toast.error(`Maximum ${maxFiles} images allowed.`);
        return;
      }
      const newFiles = accepted.slice(0, remaining).map((f) => ({
        file: f,
        preview: URL.createObjectURL(f),
      }));
      const updated = [...files, ...newFiles];
      setFiles(updated);
      onFilesChange(updated.map((f) => f.file));
    },
    [files, maxFiles, onFilesChange]
  );

  const removeFile = (i: number) => {
    URL.revokeObjectURL(files[i].preview);
    const updated = files.filter((_, idx) => idx !== i);
    setFiles(updated);
    onFilesChange(updated.map((f) => f.file));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [] },
    maxSize: 10 * 1024 * 1024,
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-200 ${
          isDragActive
            ? 'border-indigo-500 bg-indigo-500/10'
            : 'border-white/10 hover:border-indigo-500/50 hover:bg-white/5'
        }`}
      >
        <input {...getInputProps()} />
        <motion.div animate={{ scale: isDragActive ? 1.06 : 1 }} transition={{ duration: 0.15 }}>
          <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <p className="font-medium text-slate-300">
            {isDragActive ? 'Drop images here…' : 'Drag & drop or click to upload'}
          </p>
          <p className="text-sm text-slate-500 mt-1">
            JPG, PNG · Max 10 MB · Up to {maxFiles} images
          </p>
        </motion.div>
      </div>

      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-3 sm:grid-cols-4 gap-3"
          >
            {files.map((f, i) => (
              <motion.div
                key={f.preview}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative rounded-xl overflow-hidden aspect-square group"
              >
                <img src={f.preview} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
                <div className="absolute bottom-1.5 left-1.5 bg-black/60 rounded px-1.5 py-0.5 text-[10px] text-slate-300 flex items-center gap-1">
                  <ImageIcon className="w-2.5 h-2.5" />
                  {(f.file.size / 1024 / 1024).toFixed(1)}MB
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {files.length > 0 && (
        <div className="flex items-center gap-2 text-xs text-green-400">
          <CheckCircle className="w-3.5 h-3.5" />
          {files.length} image{files.length > 1 ? 's' : ''} ready for upload
        </div>
      )}

      <div className="flex items-center gap-2 text-xs text-slate-500">
        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
        Include images from multiple angles for better AI analysis accuracy.
      </div>
    </div>
  );
}
