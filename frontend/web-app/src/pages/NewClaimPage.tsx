import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import {
  Upload, Car, CheckCircle, ChevronRight, ChevronLeft,
  X, Image as ImageIcon, AlertCircle,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { InputField } from '../components/ui/InputField';
import toast from 'react-hot-toast';

const STEPS = ['Vehicle Info', 'Upload Images', 'Review & Submit'];

interface VehicleForm {
  make: string;
  model: string;
  year: string;
  licensePlate: string;
}

interface PreviewFile {
  file: File;
  preview: string;
}

export default function NewClaimPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [vehicle, setVehicle] = useState<VehicleForm>({ make: '', model: '', year: '', licensePlate: '' });
  const [files, setFiles] = useState<PreviewFile[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  /* ── Dropzone ── */
  const onDrop = useCallback((accepted: File[]) => {
    const newFiles = accepted.slice(0, 5 - files.length).map((f) => ({
      file: f,
      preview: URL.createObjectURL(f),
    }));
    setFiles((prev) => [...prev, ...newFiles]);
  }, [files.length]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [] },
    maxSize: 10 * 1024 * 1024,
    maxFiles: 5,
  });

  const removeFile = (i: number) => {
    URL.revokeObjectURL(files[i].preview);
    setFiles((prev) => prev.filter((_, idx) => idx !== i));
  };

  /* ── Validation ── */
  const validateStep0 = () => {
    const e: Record<string, string> = {};
    if (!vehicle.make.trim()) e.make = 'Required';
    if (!vehicle.model.trim()) e.model = 'Required';
    const year = parseInt(vehicle.year);
    if (!vehicle.year || isNaN(year) || year < 1990 || year > 2027) e.year = 'Enter a valid year';
    if (!vehicle.licensePlate.trim()) e.licensePlate = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep1 = () => {
    if (files.length === 0) { toast.error('Please upload at least one image.'); return false; }
    return true;
  };

  const handleNext = () => {
    if (step === 0 && !validateStep0()) return;
    if (step === 1 && !validateStep1()) return;
    setStep((s) => s + 1);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1800)); // Simulate API
    toast.success('Claim submitted! AI analysis in progress.');
    navigate('/claims/CLM-003');
  };

  const vf = (key: keyof VehicleForm) => ({
    value: vehicle[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      setVehicle((v) => ({ ...v, [key]: e.target.value })),
    error: errors[key],
  });

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-black mb-1">New Claim</h1>
        <p className="text-slate-400">Submit your vehicle damage for AI-powered assessment.</p>
      </motion.div>

      {/* Stepper */}
      <div className="flex items-center gap-0 mb-8">
        {STEPS.map((label, i) => (
          <div key={i} className="flex items-center flex-1 last:flex-none">
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ scale: step === i ? 1.1 : 1 }}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  i < step ? 'gradient-brand text-white' :
                  i === step ? 'gradient-brand text-white glow-sm' :
                  'glass text-slate-500'
                }`}
              >
                {i < step ? <CheckCircle className="w-4 h-4" /> : i + 1}
              </motion.div>
              <span className={`text-sm font-medium hidden sm:block transition-colors ${i <= step ? 'text-slate-200' : 'text-slate-500'}`}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className="flex-1 h-px mx-3 bg-white/10">
                <motion.div
                  className="h-full gradient-brand"
                  animate={{ width: i < step ? '100%' : '0%' }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="step0" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
            <Card>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 gradient-brand rounded-xl flex items-center justify-center">
                  <Car className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-lg">Vehicle Information</h2>
                  <p className="text-sm text-slate-400">Tell us about the damaged vehicle.</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Make" placeholder="Toyota" {...vf('make')} />
                <InputField label="Model" placeholder="Camry" {...vf('model')} />
                <InputField label="Year" type="number" placeholder="2022" {...vf('year')} />
                <InputField label="License Plate" placeholder="ABC-1234" {...vf('licensePlate')} />
              </div>
            </Card>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
            <Card>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 gradient-brand rounded-xl flex items-center justify-center">
                  <Upload className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-lg">Upload Damage Images</h2>
                  <p className="text-sm text-slate-400">Upload up to 5 JPG/PNG images (max 10MB each).</p>
                </div>
              </div>

              {/* Dropzone */}
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-200 ${
                  isDragActive ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/10 hover:border-indigo-500/50 hover:bg-white/5'
                }`}
              >
                <input {...getInputProps()} />
                <motion.div animate={{ scale: isDragActive ? 1.05 : 1 }}>
                  <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                  <p className="font-medium text-slate-300">
                    {isDragActive ? 'Drop images here' : 'Drag & drop or click to upload'}
                  </p>
                  <p className="text-sm text-slate-500 mt-1">JPG, PNG · Max 10MB · Up to 5 images</p>
                </motion.div>
              </div>

              {/* Previews */}
              {files.length > 0 && (
                <div className="grid grid-cols-3 gap-3 mt-4">
                  {files.map((f, i) => (
                    <motion.div
                      key={f.preview}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative rounded-xl overflow-hidden aspect-square group"
                    >
                      <img src={f.preview} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          onClick={() => removeFile(i)}
                          className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center"
                        >
                          <X className="w-4 h-4 text-white" />
                        </button>
                      </div>
                      <div className="absolute bottom-1.5 right-1.5 bg-black/60 rounded-md px-1.5 py-0.5 text-[10px] text-slate-300">
                        <ImageIcon className="w-3 h-3 inline mr-0.5" />
                        {(f.file.size / 1024 / 1024).toFixed(1)}MB
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                <AlertCircle className="w-3.5 h-3.5" />
                Include images from multiple angles for better AI analysis accuracy.
              </div>
            </Card>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
            <Card>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 gradient-brand rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-lg">Review & Submit</h2>
                  <p className="text-sm text-slate-400">Confirm your claim details before submission.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="glass rounded-xl p-4">
                  <p className="text-xs text-slate-500 mb-3 uppercase tracking-wider">Vehicle Details</p>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {[
                      ['Make', vehicle.make], ['Model', vehicle.model],
                      ['Year', vehicle.year], ['License Plate', vehicle.licensePlate],
                    ].map(([k, v]) => (
                      <div key={k}>
                        <span className="text-slate-500">{k}</span>
                        <p className="font-medium text-slate-100">{v}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass rounded-xl p-4">
                  <p className="text-xs text-slate-500 mb-3 uppercase tracking-wider">
                    Images ({files.length})
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {files.map((f) => (
                      <img key={f.preview} src={f.preview} alt="" className="w-16 h-16 rounded-lg object-cover" />
                    ))}
                  </div>
                </div>

                <div className="glass rounded-xl p-4 border border-indigo-500/20">
                  <div className="flex items-center gap-2 text-sm text-indigo-300">
                    <CheckCircle className="w-4 h-4" />
                    AI pipeline will analyze damage, estimate costs, and screen for fraud automatically.
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6">
        <Button
          variant="ghost"
          icon={<ChevronLeft className="w-4 h-4" />}
          onClick={() => setStep((s) => s - 1)}
          className={step === 0 ? 'invisible' : ''}
        >
          Back
        </Button>

        {step < STEPS.length - 1 ? (
          <Button icon={<ChevronRight className="w-4 h-4" />} onClick={handleNext}>
            Continue
          </Button>
        ) : (
          <Button loading={submitting} onClick={handleSubmit}>
            Submit Claim
          </Button>
        )}
      </div>
    </div>
  );
}
