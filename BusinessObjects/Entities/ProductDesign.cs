using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.Entities
{
    public class ProductDesign : BaseEntity
    {
        public Guid UserId { get; set; }
        public Guid ProductVarianceId { get; set; }
        public string Saved3DPreviewUrl { get; set; }
        public bool IsFinalized { get; set; }
        public bool IsPublic { get; set; }
        public bool IsTemplate { get; set; }

        // Navigation properties
        public User User { get; set; }
        public BlankVariance BlankVariance { get; set; }
    }
}
