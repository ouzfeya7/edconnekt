
const PeriodSelector = () => {
  return (
    <>
      <div className="flex gap-9 items-center self-stretch px-5 py-5 my-auto text-cyan-900 bg-gray-50 rounded-lg">
        <div className="self-stretch my-auto w-[108px]">
          <h3 className="self-stretch w-full text-sm font-medium leading-none whitespace-nowrap">
            Trimeste
          </h3>
          <p className="mt-3 text-xl font-semibold leading-snug">Trimestre 1</p>
        </div>
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/0c68bafd7f4871af7a21788f89407adf1284cef1?placeholderIfAbsent=true&apiKey=59d0a962469d4736a46bca5045c61062"
          className="object-contain overflow-hidden shrink-0 self-stretch my-auto aspect-square fill-cyan-900 w-[13px]"
          alt="Dropdown icon"
        />
      </div>
      <div className="flex gap-9 items-center self-stretch px-5 py-5 my-auto text-cyan-900 bg-gray-50 rounded-lg">
        <div className="self-stretch my-auto w-[135px]">
          <h3 className="self-stretch w-full text-sm font-medium leading-none">
            Période d'évaluation
          </h3>
          <p className="mt-3 text-xl font-semibold leading-snug">
            24 Mars 2025
          </p>
        </div>
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/80d7996d9cc4569b48b238229ca682d0fb1bc64d?placeholderIfAbsent=true&apiKey=59d0a962469d4736a46bca5045c61062"
          className="object-contain overflow-hidden shrink-0 self-stretch my-auto aspect-square fill-cyan-900 w-[13px]"
          alt="Dropdown icon"
        />
      </div>
    </>
  );
};

export default PeriodSelector;
