
export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-10 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div>
        <h1 className="text-4xl h-[34px] font-bold text-center p-2">Lil Homies</h1>
        <p className="text-center h-[34px]">
          احنه نلعب فوز فن مو حق نستانس
        </p>
      </div>
      <div className="flex flex-col items-center space-y-4">
        <a href="/burns" className="h-full text-red-500 border-2 border-dashed px-4 py-2 rounded-md h-full flex items-center justify-center">
          التحريقات
        </a>
      </div>
      <div>
        <p className="text-center h-[34px]">
          --- الموقع الرسمي للهوميز الصغار ---
        </p>
      </div>
    </div>

  );
}
