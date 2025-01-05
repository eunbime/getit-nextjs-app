import { RotatingLines } from "react-loader-spinner";

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen -mt-12 w-full flex flex-col gap-2 items-center justify-center">
      <RotatingLines
        strokeColor="grey"
        strokeWidth="5"
        animationDuration="0.75"
        width="30"
        visible={true}
      />
      <p>채팅을 불러오는 중입니다</p>
    </div>
  );
};

export default LoadingSpinner;
