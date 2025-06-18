interface InfoCardProps {
  title: string;
  content: string;
  hasIcon?: boolean;
  iconSrc?: string;
  className?: string;
}

const InfoCard = ({
  title,
  content,
  hasIcon = false,
  iconSrc,
  className,
}: InfoCardProps) => {
  const defaultClassName =
    "flex gap-9 items-center self-stretch px-5 py-7 my-auto font-semibold text-cyan-900 bg-white rounded-xl";

  return (
    <article className={className || defaultClassName}>
      <div className="self-stretch my-auto w-auto">
        <h3 className="self-stretch w-full text-base whitespace-nowrap">
          {title}
        </h3>
        <p className="mt-3 text-xl leading-snug">{content}</p>
      </div>

      {hasIcon && iconSrc && (
        <img
          src={iconSrc}
          className="object-contain shrink-0 self-stretch my-auto aspect-[1.63] fill-cyan-900 w-[13px]"
          alt=""
        />
      )}
    </article>
  );
};

export default InfoCard; 