import Image from "next/image";

import { fromNow } from "@/helpers/dayjs";
import Avatar from "@/components/common/Avatar";

interface MessageProps {
  isSender: boolean;
  messageText?: string | null;
  messageImage?: string | null;
  receiverName: string;
  receiverImage: string;
  senderImage: string | null;
  time: Date;
}

const Message = ({
  isSender,
  messageText,
  messageImage,
  receiverImage,
  receiverName,
  senderImage,
  time,
}: MessageProps) => {
  return (
    <div
      className={`flex gap-3 w-full ${
        isSender ? "flex-row-reverse" : "flex-row"
      }`}
    >
      <div className="mt-2">
        <Avatar src={senderImage && isSender ? senderImage : receiverImage} />
      </div>
      <div
        className={`flex flex-col ${
          isSender ? "items-end" : "items-start"
        } justify-center`}
      >
        <div className="flex items-center gap-2 mb-2 text-sm">
          <span className="font-medium">{isSender ? "You" : receiverName}</span>
          <span className="text-xs text-gray-500 opacity-80">
            {fromNow(time)}
          </span>
        </div>

        {messageImage && (
          <div className="overflow-hidden rounded-md mx-[0.2rem] max-w-[80%]">
            <Image
              width={300}
              height={300}
              src={messageImage}
              alt="messageImage"
            />
          </div>
        )}

        {messageText && (
          <div
            className={`p-2 break-all text-white rounded-lg ${
              isSender
                ? "bg-[#0978f6] rounded-tr-none"
                : "bg-gray-400 rounded-tl-none"
            }`}
          >
            <p>{messageText}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;
