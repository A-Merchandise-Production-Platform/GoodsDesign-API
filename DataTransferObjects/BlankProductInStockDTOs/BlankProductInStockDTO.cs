using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataTransferObjects.BlankProductInStockDTOs
{
    public class BlankProductInStockDTO
    {
        public Guid ProductVarianceId { get; set; }
        public Guid AreaId { get; set; }
        public int QuantityInStock { get; set; }
    }
}
