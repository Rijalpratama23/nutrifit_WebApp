export default function Thead() {
  return (
    <table className="w-full text-[13.5px] table-fixed">
      <thead>
        <tr>
          <th className={`text-left text-gray-500 font-semibold ${COL.user}`}>User</th>
          <th className={`text-left text-gray-500 font-semibold ${COL.tujuan}`}>Tujuan</th>
          {/* Waktu disembunyikan di tablet kecil, muncul di lg */}
          <th className={`hidden lg:table-cell text-left text-gray-500 font-semibold ${COL.waktu}`}>Waktu</th>
          <th className={`text-center text-gray-500 font-semibold ${COL.aksi}`}>Aksi</th>
        </tr>
      </thead>
    </table>
  );
}
