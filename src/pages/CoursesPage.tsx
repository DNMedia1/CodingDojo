import { CourseCard } from '../components/CourseCard';
import { Header } from '../components/Header';
import { courses } from '../data/courses';

export function CoursesPage() {
  return (
    <div>
      <Header title="Kurse" subtitle="Sechs praxisnahe Tracks mit Modulen, Lektionen, Quizfragen und Projekten." />
      <div className="grid grid-cols-1 gap-3">
        {courses.map((course) => <CourseCard key={course.id} course={course} />)}
      </div>
    </div>
  );
}
