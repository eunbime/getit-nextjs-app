import { IoArrowBack, IoArrowForward } from "react-icons/io5";
import { useSwiper } from "swiper/react";

const NavigationButton = ({ direction }: { direction: "prev" | "next" }) => {
  const swiper = useSwiper();

  return (
    <button
      onClick={() =>
        direction === "prev" ? swiper.slidePrev() : swiper.slideNext()
      }
      className={`
        absolute top-1/2 -translate-y-1/2 z-10
        ${direction === "prev" ? "left-2" : "right-2"}
        bg-white/80 hover:bg-white
        rounded-full p-2 shadow-md
        transition-all duration-200
        group
      `}
    >
      {direction === "prev" ? (
        <IoArrowBack className="text-2xl text-gray-800 group-hover:text-gray-600" />
      ) : (
        <IoArrowForward className="text-2xl text-gray-800 group-hover:text-gray-600" />
      )}
    </button>
  );
};

export default NavigationButton;
