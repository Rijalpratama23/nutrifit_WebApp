import { MessageCircleMore, User } from "lucide-react";

export default function CardKonsul() {
  return (
    <>
      {/* card */}
      <div className="flex flex-col sm:flex-row sm:justify-between gap-4 sm:gap-6 bg-white shadow-lg hover:shadow-xl transition-shadow duration-200 p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-8 items-start sm:items-center">
          <div className="bg-white hover:border-2 hover:border-blue-500 hover:cursor-pointer flex justify-center items-center p-3 sm:p-4 md:p-5 rounded-full border-2 border-gray-200 flex-shrink-0">
            <User size={32} className="sm:w-10 sm:h-10 md:w-12 md:h-12" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg sm:text-xl md:text-2xl">Dr.Sarah Anderson</h3>
            <p className="text-sm sm:text-base text-gray-600 mt-1">specialist Gizi</p>
            <div className="mt-4 sm:mt-5 w-full sm:w-auto">
              <button className="flex justify-center sm:justify-start items-center gap-2 bg-secondary text-white rounded-lg px-4 py-2 sm:px-3 sm:py-2 hover:bg-opacity-90 transition-all duration-200 hover:cursor-pointer text-sm sm:text-base font-medium w-full sm:w-auto">
                <MessageCircleMore size={18} className="sm:w-5 sm:h-5" />
                <span>Chat</span>
              </button>
            </div>
          </div>
        </div>
        <div className="flex sm:flex-col justify-end sm:justify-start items-start sm:items-end">
          <div className="activeOrNote bg-green-200 py-1 px-3 rounded-lg flex-shrink-0">
            <p className="text-secondary text-xs sm:text-sm font-semibold">Active</p>
          </div>
        </div>
      </div>
    </>
  );
}
