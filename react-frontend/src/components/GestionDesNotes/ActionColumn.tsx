import React from "react";

interface ActionColumnProps {
  onAction: (action: string, studentId: number) => void;
}

const ActionColumn: React.FC<ActionColumnProps> = ({ onAction }) => {
  // First student has a different action image
  const actionImages = [
    { id: 1, src: "https://cdn.builder.io/api/v1/image/assets/TEMP/f9213d716c918323e6b95c6a6d26488fc16041c0?placeholderIfAbsent=true&apiKey=59d0a962469d4736a46bca5045c61062" },
    { id: 2, src: "https://cdn.builder.io/api/v1/image/assets/TEMP/9b3d11287f83513310aee34aab823ec26c93621b?placeholderIfAbsent=true&apiKey=59d0a962469d4736a46bca5045c61062" },
    { id: 3, src: "https://cdn.builder.io/api/v1/image/assets/TEMP/9b3d11287f83513310aee34aab823ec26c93621b?placeholderIfAbsent=true&apiKey=59d0a962469d4736a46bca5045c61062" },
    // { id: 4, src: "https://cdn.builder.io/api/v1/image/assets/TEMP/9b3d11287f83513310aee34aab823ec26c93621b?placeholderIfAbsent=true&apiKey=59d0a962469d4736a46bca5045c61062" },
    // { id: 5, src: "https://cdn.builder.io/api/v1/image/assets/TEMP/9b3d11287f83513310aee34aab823ec26c93621b?placeholderIfAbsent=true&apiKey=59d0a962469d4736a46bca5045c61062" },
    // { id: 6, src: "https://cdn.builder.io/api/v1/image/assets/TEMP/9b3d11287f83513310aee34aab823ec26c93621b?placeholderIfAbsent=true&apiKey=59d0a962469d4736a46bca5045c61062" },
    // { id: 7, src: "https://cdn.builder.io/api/v1/image/assets/TEMP/9b3d11287f83513310aee34aab823ec26c93621b?placeholderIfAbsent=true&apiKey=59d0a962469d4736a46bca5045c61062" },
    // { id: 8, src: "https://cdn.builder.io/api/v1/image/assets/TEMP/9b3d11287f83513310aee34aab823ec26c93621b?placeholderIfAbsent=true&apiKey=59d0a962469d4736a46bca5045c61062" },
    // { id: 9, src: "https://cdn.builder.io/api/v1/image/assets/TEMP/9b3d11287f83513310aee34aab823ec26c93621b?placeholderIfAbsent=true&apiKey=59d0a962469d4736a46bca5045c61062" },
    // { id: 10, src: "https://cdn.builder.io/api/v1/image/assets/TEMP/9b3d11287f83513310aee34aab823ec26c93621b?placeholderIfAbsent=true&apiKey=59d0a962469d4736a46bca5045c61062" },
  ];

  // Different aspect ratios for different rows
const getAspectRatio = (index: number): string => {
    switch (index) {
        case 1:
            return "aspect-[1.86]";
        case 2:
            return "aspect-[1.86]";
        case 3:
          return "aspect-[1.13]";
        case 4:
            return "aspect-[1.13]";
        case 5:
            return "aspect-[2.5]";
        case 6:
            return "aspect-[2.56]";
        case 8:
          return "aspect-[3.03]";
        case 9:
            return "aspect-[3.03]";
        default:
            return "aspect-[3.33]";
    }
};

  return (
    <div className="w-[101px]">
      <div className="gap-2.5 self-stretch p-2.5 w-full text-sm font-medium leading-none text-gray-800 whitespace-nowrap bg-gray-50 border-t border-b border-solid border-b-[color:var(--Foundation-Green-G50,#E8EDF0)] border-t-[color:var(--Foundation-Green-G50,#E8EDF0)]">
        Action
      </div>

      {actionImages.map((action, index) => (
        <div
          key={action.id}
          className="flex gap-2.5 items-center px-2.5 py-1.5 mt-2 w-full"
        >
          <img
            src={action.src}
            className={`object-contain overflow-hidden flex-1 shrink self-stretch my-auto rounded-none ${getAspectRatio(index)} basis-0 w-[81px]`}
            alt="Action buttons"
            onClick={() => onAction("view", action.id)}
          />
        </div>
      ))}
    </div>
  );
};

export default ActionColumn;
