import { User, Mail, ShieldCheck, LogOut } from "lucide-react"
import Link from "next/link";


export default function SideBar() {
  return (
    <>
      <div className="w-full sm:w-60 lg:w-64 flex-shrink-0 md:mt-20">
        <div className="mt-6 bg-profile-gradient sm:mt-8 md:mt-10 w-full py-6 sm:py-7 px-4 sm:px-5 shadow-md sm:shadow-lg rounded-lg sm:rounded-xl h-auto bg-white">
          <div className="flex justify-center items-center p-3">
            <div className="p-3 rounded-full border w-16 sm:w-20 h-16 sm:h-20 flex items-center justify-center text-center">
              <User size={40} className="sm:w-12 sm:h-12" />
            </div>
          </div>
          {/* Profile Info */}
          <div className="space-y-3 sm:space-y-4">
            <h2 className="text-center font-semibold text-base sm:text-lg">namaUser</h2>
            <div className="flex gap-1 items-center justify-center text-xs sm:text-sm">
              <Mail size={14} />
              <p className="tracking-widest truncate">email.@gmail.com</p>
            </div>
            <div className="w-full sm:w-auto flex gap-1 items-center justify-center bg-green-200 text-secondary rounded-lg border border-green-600 py-2 sm:py-3">
              <ShieldCheck size={14} className="sm:w-4 sm:h-4" />
              <p className="text-xs sm:text-sm font-medium">Verified</p>
            </div>
            <div className="flex items-center justify-between gap-2 sm:gap-3">
              <p className="tracking-widest text-xs sm:text-sm font-medium">status user</p>
              <ul>
                <li className="text-secondary text-xs sm:text-sm">online</li>
              </ul>
            </div>
            <Link href="/login" className="flex justify-center items-center gap-2 bg-red-50 border border-red-500 px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg text-red-600 font-semibold text-sm sm:text-base hover:bg-red-100 transition-colors">
              <LogOut size={18} />
              <p>Keluar</p>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
