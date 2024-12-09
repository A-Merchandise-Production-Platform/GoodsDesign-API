using BusinessObjects.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects
{
    public class FavoriteDesign : BaseEntity
    {
        public Guid UserId { get; set; }
        public Guid DesignId { get; set; }

        // Navigation properties
        public User User { get; set; }
        public ProductDesign ProductDesign { get; set; }
    }
}
