using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataTransferObjects.ProductDesignDTOs
{
    public class UpdateProductDesignDTO
    {
        public Guid UserId { get; set; }
        public Guid BlankVarianceId { get; set; }
        public string? Saved3DPreviewUrl { get; set; }
        public bool? IsFinalized { get; set; }   // trong mô tả bạn ghi "Không có", nhưng nếu bạn cần update thì thêm
        public bool? IsPublic { get; set; }
        public bool? IsTemplate { get; set; }
    }
}
