using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataTransferObjects.ProductDesignDTOs
{
    public class ProductDesignCreateDTO
    {
        public Guid UserId { get; set; }
        public Guid BlankVarianceId { get; set; }
        public string Saved3DPreviewUrl { get; set; }
        public bool IsFinalized { get; set; } = false;
        public bool IsPublic { get; set; } = false;
        public bool IsTemplate { get; set; } = false;
    }
}
