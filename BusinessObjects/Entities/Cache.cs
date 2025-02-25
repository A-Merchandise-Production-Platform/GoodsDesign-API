using System.ComponentModel.DataAnnotations;

namespace BusinessObjects.Entities
{
    public class Cache
    {
        [Key]
        public string Id { get; set; }

        public string? Value { get; set; }

    }
}
