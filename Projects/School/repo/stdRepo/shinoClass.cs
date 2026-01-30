using School.Models;

namespace School.repo.stdRepo
{
    public class shinoClass : shinoNotClass
    {
        private readonly Context _context;
        public shinoClass(Context context)
        {
            _context = context;
        }
        public void Add(Student student)
        {
            _context.Students.Add(student);
            _context.SaveChanges();
        }

        public void Delete(int id)
        {
            var fares = GetById(id);
            _context.Students.Remove(fares);
            _context.SaveChanges();
        }

        public Student GetById(int id)
        {
            return _context.Students.Find(id);
        }

        public IEnumerable<Student> getAll()
        {
            return _context.Students.ToList();
        }

        public void Update(Student student)
        {
            _context.Students.Update(student);
            _context.SaveChanges();
        }
    }
}
