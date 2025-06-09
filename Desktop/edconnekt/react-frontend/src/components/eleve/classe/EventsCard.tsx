import { Event } from "./Types";

interface EventsCardProps {
  events: Event[];
}

export function EventsCard({ events }: EventsCardProps) {
  return (
    <article className="flex flex-col px-4 py-6 mt-6 w-full bg-white rounded-xl">
      <h2 className="self-start text-xl font-semibold leading-snug text-sky-950">
        Evenement
      </h2>

      <div className="mt-3.5">
        <h3 className="text-sm font-semibold leading-none text-cyan-900">
          Aujourd'hui
        </h3>

        <div className="mt-2 w-full">
          {events.slice(0, 2).map((event, index) => (
            <div
              key={index}
              className="flex flex-col justify-center px-4 py-2.5 mt-3 first:mt-0 w-full bg-gray-50 rounded-md"
            >
              <div className="flex gap-10 justify-center items-center">
                <div className="self-stretch my-auto text-cyan-900 w-[133px]">
                  <h4 className="text-base font-semibold">{event.title}</h4>
                  <p className="text-sm leading-none">{event.time}</p>
                </div>

                <button className="flex gap-1 items-center self-stretch px-1 py-1 my-auto w-6 bg-cyan-900 rounded min-h-[21px]">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/e18cd6c4846fd29dbaf4028731b7f511edcf95c3?placeholderIfAbsent=true&apiKey=59d0a962469d4736a46bca5045c61062"
                    className="object-contain overflow-hidden self-stretch my-auto w-4 aspect-[1/1] fill-white fill-opacity-0"
                    alt="Event icon"
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3.5">
        <h3 className="text-sm font-semibold leading-none text-cyan-900">
          Aujourd'hui
        </h3>

        <div className="mt-2 w-full">
          {events.slice(2).map((event, index) => (
            <div
              key={index}
              className="flex flex-col justify-center px-4 py-2.5 w-full bg-gray-50 rounded-md"
            >
              <div className="flex gap-10 justify-center items-center">
                <div className="self-stretch my-auto text-cyan-900 w-[133px]">
                  <h4 className="text-base font-semibold">{event.title}</h4>
                  <p className="text-sm leading-none">{event.time}</p>
                </div>

                <button className="flex gap-1 items-center self-stretch px-1 py-1 my-auto w-6 bg-cyan-900 rounded min-h-[21px]">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/4ed39b88589be17ab7d12df802ba597a72b29317?placeholderIfAbsent=true&apiKey=59d0a962469d4736a46bca5045c61062"
                    className="object-contain overflow-hidden self-stretch my-auto w-4 aspect-[1/1] fill-white fill-opacity-0"
                    alt="Event icon"
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}
