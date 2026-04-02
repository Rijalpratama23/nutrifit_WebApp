import CardKonsul from "../cardKonsul/page";

export default function ContainerCard() {
  return (
    <>
      <div className="border-1 rounded-xl p-5 md:p-2 space-y-4 sm:space-y-6 max-h-[320px] sm:max-h-[calc(100vh-300px)] md:max-h-[calc(100vh-250px)] overflow-y-auto pr-2 scrollbar-thumb-gray-600 scrollbar-track-gray-100 scrollbar scrollbar-w-2">
        {/* Additional cards can be added here with the same structure */}
            <CardKonsul />
      </div>
    </>
  );
}
