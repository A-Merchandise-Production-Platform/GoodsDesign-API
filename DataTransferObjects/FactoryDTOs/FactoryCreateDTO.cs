using DataTransferObjects.AuthDTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataTransferObjects.FactoryDTOs
{
    public class FactoryCreateDTO
    {
        public Guid? FactoryOwnerId { get; set; }

        //factory
        //information
        public string FactoryName { get; set; } // ten nha may
        public string FactoryContactPerson { get; set; } //chu nha may
        public string FactoryContactPhone { get; set; } // sdt
        public string FacetoryAddress { get; set; } //dia chi
        // contract
        public string ContractName { get; set; }
        public string ContractPaperUrl { get; set; }

        public List<SelectedProductDTO> SelectedProducts { get; set; }

    }


}
