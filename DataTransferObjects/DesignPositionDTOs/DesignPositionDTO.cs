using BusinessObjects.Entities;
using DataTransferObjects.ProductDesignDTOs;
using DataTransferObjects.ProductPositionTypeDTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataTransferObjects.DesignPositionDTOs
{
    public class DesignPositionDTO
    {
        public Guid ProductDesignId { get; set; }
        public Guid ProductPositionTypeId { get; set; }
        public string DesignJSON { get; set; } = string.Empty;
        public ProductDesignDTO ProductDesign { get; set; }
        public ProductPositionTypeDTO ProductPositionType { get; set; }
    }
}
