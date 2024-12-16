using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataTransferObjects.ProductPositionTypeDTOs
{
    public class ProductPositionTypeDTO
    {
        public Guid ProductId { get; set; }
        public string PositionName { get; set; }
        public decimal BasePrice { get; set; }
    }
}
