using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataTransferObjects.ProductDTOs
{
    public class ProductDTO 
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public Guid? CategoryId { get; set; }
        public string ImageUrl { get; set; }
        public string Model3DUrl { get; set; }
    }
}
