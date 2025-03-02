﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.Entities
{
    public class CustomerOrder : BaseEntity
    {
        public Guid CustomerId { get; set; }
        public string Status { get; set; } // Enum: Pending, Accepted, In Production, etc.
        public decimal TotalProductPrice { get; set; }
        public decimal? TotalShippingPrice { get; set; }
        public decimal TotalPrice { get; set; }
        public decimal DepositPaid { get; set; }
        public DateTime OrderDate { get; set; }
        public string? Note { get; set; } = "";

        // Navigation property
        public User Customer { get; set; }

        public ICollection<CustomerOrderDetail> CustomerOrderDetails { get; set; }
        public ICollection<Payment> Payments { get; set; }

    }
}
