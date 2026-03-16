import React, { useState } from "react";
import EmojiPicker from "emoji-picker-react";
import { LuImage, LuX } from "react-icons/lu";

const EmojiPickerPopup = ({ icon, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-6 flex flex-col items-start gap-5 md:flex-row">
      <div
        className="flex items-center gap-4 cursor-pointer"
        onClick={() => setIsOpen(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            setIsOpen(true);
          }
        }}
      >
        <div className="h-12 w-12 rounded-lg bg-purple-50 flex items-center justify-center text-2xl overflow-hidden">
          {icon ? (
            <img src={icon} alt="Selected icon" className="h-8 w-8" />
          ) : (
            <LuImage className="text-primary" />
          )}
        </div>

        <p className="text-sm font-medium text-gray-700">
          {icon ? "Change Icon" : "Pick Icon"}
        </p>
      </div>

      {isOpen && (
        <div className="relative z-20">
          <button
            className="absolute -right-2 -top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-white cursor-pointer"
            onClick={() => setIsOpen(false)}
            type="button"
            aria-label="Close emoji picker"
          >
            <LuX />
          </button>

          <EmojiPicker
            open={isOpen}
            onEmojiClick={(emojiData) => {
              onSelect(emojiData?.imageUrl || "");
              setIsOpen(false);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default EmojiPickerPopup;
