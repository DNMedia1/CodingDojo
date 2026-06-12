import { useState } from 'react';
import type { Course } from '../models/learning';

export function CourseArt({ course, className = '' }: { course: Course; className?: string }) {
  const [imageAvailable, setImageAvailable] = useState(true);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${course.gradient} opacity-70`} />
      <div className="absolute -right-6 -top-10 h-32 w-32 rounded-full bg-white/30 blur-3xl" />
      <span aria-hidden className="absolute bottom-2 right-4 select-none text-5xl font-black text-ink/25">
        {course.icon}
      </span>
      {imageAvailable ? (
        <img
          src={`/course-art/${course.id}.jpg`}
          alt=""
          loading="lazy"
          onError={() => setImageAvailable(false)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f14]/55 via-transparent to-transparent" />
    </div>
  );
}
