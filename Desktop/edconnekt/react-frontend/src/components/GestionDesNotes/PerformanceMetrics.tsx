
const PerformanceMetrics = () => {
  return (
    <div className="flex flex-col justify-center self-stretch p-3 my-auto bg-gray-50 rounded-lg min-w-60 w-[555px] max-md:max-w-full">
      <div className="flex flex-wrap gap-7 items-center w-full max-md:max-w-full">
        <div className="grow shrink self-stretch my-auto w-[116px]">
          <h3 className="pl-2 w-full text-sm font-medium leading-none text-gray-500">
            Taux de reussite
          </h3>
          <p className="gap-1 self-stretch w-full text-2xl font-semibold leading-none whitespace-nowrap text-sky-950">
            60%
          </p>
        </div>
        <div className="flex grow shrink self-stretch my-auto w-px bg-gray-200 rounded-sm h-[46px]" />
        <div className="grow shrink self-stretch my-auto w-[116px]">
          <h3 className="px-2 w-full text-sm font-medium leading-none text-gray-500">
            Taux d'echec
          </h3>
          <p className="gap-1 self-stretch w-full text-2xl font-semibold leading-none whitespace-nowrap text-sky-950">
            60%
          </p>
        </div>
        <div className="flex grow shrink self-stretch my-auto w-px bg-gray-200 rounded-sm h-[46px]" />
        <div className="grow shrink self-stretch my-auto w-16 whitespace-nowrap min-h-[79px]">
          <h3 className="text-sm font-medium leading-none text-gray-500">
            Accuracy
          </h3>
          <p className="gap-1 self-stretch pt-4 w-full text-base font-semibold text-black">
            20
          </p>
        </div>
        <div className="flex grow shrink self-stretch my-auto w-px bg-gray-200 rounded-sm h-[46px]" />
        <div className="grow shrink self-stretch my-auto w-16 whitespace-nowrap min-h-[79px]">
          <h3 className="text-sm font-medium leading-none text-gray-500">
            Accuracy
          </h3>
          <p className="gap-1 self-stretch pt-4 w-full text-base font-semibold text-black">
            20
          </p>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMetrics;
