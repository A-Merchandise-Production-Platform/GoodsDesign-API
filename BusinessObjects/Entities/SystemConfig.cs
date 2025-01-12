using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.Entities
{
    public class SystemConfig 
    {
        [Key]
        public string Id { get; set; } // Enum: BANK, COLOR, SIZE

        public string? Bank { get; set; } // JSONB equivalent

        public string? Color { get; set; } // JSONB equivalent

        public string? Size { get; set; }
    }
}
