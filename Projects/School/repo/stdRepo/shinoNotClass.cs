using School.Models;

namespace School.repo.stdRepo
{
    public interface shinoNotClass
    {
        public IEnumerable<Student> getAll();
        Student GetById(int id);
        void Delete(int id);
        void Update(Student student);
        void Add(Student student);
    }
}
