"use client";
/**
 * Code exported from Paper
 * https://app.paper.design/file/01K7E8RETQDYJRA8H36FVW561E?node=01K7E8S8T7M9VD3Z4RZ9HVZAC5
 * on Oct 13, 2025 at 1:25 PM.
 */

import React, { FormEvent } from "react";
export const TextBox = ({
  handler,
}: {
  handler: (e: FormEvent<HTMLFormElement>) => void;
}) => {
  return (
    <div className="flex items-center justify-between bg-white rounded-full shadow-[0_1px_4px_rgba(0,0,0,0.2)] py-[5px] px-[6px] gap-[18px] w-[300px]">
      <form onSubmit={handler} className="flex-1">
        <input
          type="text"
          placeholder="Type a message..."
          className="w-full bg-transparent border-none outline-none"
        />
      </form>
      <div className="flex shrink-0 items-center justify-center bg-[#313FFF] rounded-full h-[32px] w-[32px] p-[15px]">
        <div className="h-[13px] w-[13px] bg-[url(https://workers.paper.design/file-assets/01K7E8RETQDYJRA8H36FVW561E/01K7E8XPFYMQB8SWWWKD82XR9E.svg)] bg-center bg-no-repeat bg-cover" />
      </div>
    </div>
  );
};
