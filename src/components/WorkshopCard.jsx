import React from "react";
const WorkshopCard = ({
  image,
  workshopName,
  duration,
  time,
  date,
  instructor,
  className = "",
}) => (
  <div
    className={`bg-[#ebe5db] border border-[#26442C]/20 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 font-[glancyr] ${className}`}
  >
    <div className="aspect-[4/3] bg-[#26442C]/5 overflow-hidden rounded-t-xl">
      <img
        src={image}
        alt={workshopName}
        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        loading="lazy"
      />
    </div>
    <div className="px-4 py-5">
      <h3 className="text-lg font-semibold text-[#26442C] mb-3 line-clamp-2">
        {workshopName}
      </h3>
      <div className="space-y-2 text-sm text-[#26442C]">
        <div className="flex justify-between">
          <span className="opacity-75">Duration</span>
          <span>{duration}</span>
        </div>
        <div className="flex justify-between">
          <span className="opacity-75">Time</span>
          <span>{time}</span>
        </div>
        <div className="flex justify-between">
          <span className="opacity-75">Date</span>
          <span className="text-[#D16539]">{date}</span>
        </div>
        <div className="flex justify-between">
          <span className="opacity-75">Instructor</span>
          <span className="font-semibold">{instructor}</span>
        </div>
      </div>
    </div>
  </div>
);

export default WorkshopCard;
