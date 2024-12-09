using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.Entities
{
    public class DesignComponentPosition : BaseEntity
    {
        public Guid DesignPositionId { get; set; }
        public float X { get; set; }
        public float Y { get; set; }
        public string ImageUrl { get; set; }
        public string Text { get; set; }
        public int ZIndex { get; set; }

        // Navigation property
        public DesignPosition DesignPosition { get; set; }
    }
}
