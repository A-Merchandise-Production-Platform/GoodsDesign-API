using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.Entities
{
    public class PlaceHistory : BaseEntity
    {
        public Guid AreaId { get; set; }
        public string Note { get; set; }

        // Navigation property

        public Area Area { get; set; }
    }
}
