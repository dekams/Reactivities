using System;

namespace Domain
{
    public abstract class EntityBase<T>
    {
        public Guid Id { get; set; }

        public abstract void CopyFrom(T entity);
    }
}
