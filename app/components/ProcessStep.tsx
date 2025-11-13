import { ReactNode } from "react";

interface ProcessStepProps {
  icon: ReactNode;
  title: string;
  description: string;
  showLine?: boolean;
}

export default function ProcessStep({
  icon, title, description, showLine = false,
}: ProcessStepProps) {
  return (
    <div className="relative flex flex-col items-center text-center w-full md:w-1/4">
      <div className="mb-4 sm:mb-5 flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-gray-300 bg-gray-50">
        <span className="text-[#2E7D32]">{icon}</span>
      </div>
      <h4 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900">{title}</h4>
      <p className="mt-2 sm:mt-3 text-sm sm:text-base text-gray-600 leading-relaxed max-w-[320px]">{description}</p>

      {showLine && (
        <div className="hidden md:block absolute top-[28px] right-[-7rem] w-24 sm:w-28 md:w-32 h-px bg-gray-200" />
      )}
    </div>
  );
}
