﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.Entities
{
    public class FavoriteDesign : BaseEntity
    {
        public Guid UserId { get; set; }
        public Guid ProductDesignId { get; set; }

        // Navigation properties
        public User User { get; set; }
        public ProductDesign ProductDesign { get; set; }
    }
}
