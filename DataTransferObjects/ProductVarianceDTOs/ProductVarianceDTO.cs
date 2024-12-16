using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataTransferObjects.ProductVarianceDTOs
{
    public class ProductVarianceDTO
    {
        public Guid ProductId { get; set; } // Id của Product
        public string Information { get; set; } // JSONB equivalent
        public string BlankPrice { get; set; }
    }
}
