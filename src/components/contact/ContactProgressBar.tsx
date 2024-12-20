import { Progress } from "@/components/ui/progress";

interface ContactProgressBarProps {
  progress: number;
}

export const ContactProgressBar = ({ progress }: ContactProgressBarProps) => {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-2">
      <Progress 
        value={progress} 
        className="rounded-none"
        style={{
          backgroundColor: '#f3f4f6',
          '--progress-background': '#ef4444',
          opacity: `${progress}%`
        } as any}
      />
    </div>
  );
};