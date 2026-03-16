import { Loader2 } from 'lucide-react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullscreen?: boolean;
}

export function Loader({ size = 'md', text, fullscreen }: LoaderProps) {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };

  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      <Loader2 className={`${sizes[size]} animate-spin text-indigo-400`} />
      {text && <p className="text-sm text-slate-400">{text}</p>}
    </div>
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return content;
}
