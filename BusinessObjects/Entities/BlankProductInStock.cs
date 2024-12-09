using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.Entities
{
    public class BlankProductInStock : BaseEntity
    {
        public Guid ProductVarianceId { get; set; }
        public Guid PlaceId { get; set; }
        public int QuantityInStock { get; set; }

        // Navigation properties
        public ProductVariance ProductVariance { get; set; }
        [ForeignKey(nameof(PlaceId))] // Chỉ định PlaceId là khóa ngoại
        public Area Area { get; set; }
    }
}
