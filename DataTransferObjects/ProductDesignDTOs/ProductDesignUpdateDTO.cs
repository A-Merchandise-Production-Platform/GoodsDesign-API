using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace DataTransferObjects.ProductDesignDTOs
{
    public class ProductDesignUpdateDTO
    {
        //[JsonIgnore]
        //public Guid Id { get; set; }
        public Guid? UserId { get; set; }           // ref > Users.id
        public Guid? BlankVarianceId { get; set; }  // ref > BlankVariances.id
        public string? Saved3DPreviewUrl { get; set; }
        public bool? IsFinalized { get; set; }       // (Có thể bật/tắt cập nhật)
        public DateTime? CreatedAt { get; set; }     // Tùy chọn có cho phép update?
        public bool? IsPublic { get; set; }
        public bool? IsTemplate { get; set; }
    }
}
