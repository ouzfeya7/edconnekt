
const Breadcrumbs = () => {
  return (
    <nav className="flex overflow-hidden gap-2.5 items-center py-3.5 text-xs font-medium leading-snug text-center text-gray-500 bg-white min-h-10">
      <div className="flex gap-2 items-center self-stretch my-auto">
        <span className="gap-0.5 self-stretch my-auto whitespace-nowrap rounded-xl">
          Evalution
        </span>
        <span className="gap-0.5 self-stretch my-auto whitespace-nowrap rounded-xl text-stone-300">
          /
        </span>
        <span className="gap-0.5 self-stretch my-auto rounded-xl">
          Gestion des notes
        </span>
      </div>
    </nav>
  );
};

export default Breadcrumbs;
