'use client';

import { useSidebar } from "@/hooks/useSidebar";



export default  function ContainerTotalPengguna() {
    const { isCollapsed, isMobile } = useSidebar();

    return (
        <div className={`flex-1 min-w-0 min-h-screen  bg-[#EEE2F7] transition-all durations-300 ${isMobile ? 'ml-0 mt-14' : isCollapsed ? 'ml-[72px]' : 'ml-64'}`}>

        <div className="p-4 cm:p-6 lg:p-10">
            <h1>Page Total Konsultasi</h1>
        </div>

        </div>
    )
}