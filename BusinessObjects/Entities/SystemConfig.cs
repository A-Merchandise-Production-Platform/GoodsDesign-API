using System.ComponentModel.DataAnnotations;

namespace BusinessObjects.Entities
{
    public class SystemConfig
    {
        [Key]
        public string Id { get; set; } // Enum: BANK, COLOR, SIZE

        public string? Value { get; set; }
        public string? Bank { get; set; }
        public string? Color { get; set; }

    }
}
