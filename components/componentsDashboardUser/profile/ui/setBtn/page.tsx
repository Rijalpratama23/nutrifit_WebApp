import { Settings } from "lucide-react";

export default function BtnSet() {
  return (
    <div>
      {/* setting button */}
      <button className="cursor-pointer w-auto">
        <div className="flex gap-2 border border-gray-800 rounded-lg md:text-center items-center sm:rounded-xl py-2 sm:py-2.5 px-4 sm:px-5 hover:bg-gray-50 transition-colors">
          <Settings size={18} className="sm:block" />
          <p className="text-sm sm:text-base">Edit Profile</p>
        </div>
      </button>
    </div>
  );
}
