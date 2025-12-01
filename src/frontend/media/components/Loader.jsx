"use client";

import { PulseLoader } from "react-spinners";

export default function Loader({ loading, color = "#36d7b7", size = 15 }) {
  if (!loading) return null;

  return (
    <div className="flex justify-center items-center h-[50vh]">
      <PulseLoader color={color} loading={loading} size={size} />
    </div>
  );
}
