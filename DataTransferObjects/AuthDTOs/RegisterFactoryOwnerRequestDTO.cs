using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataTransferObjects.AuthDTOs
{
    public class RegisterFactoryOwnerRequestDTO
    {
        public string Email { get; set; } = "default@gmail.com";
        public string Password { get; set; } = "123456";
        public string UserName { get; set; } = "default name";
        public string? PhoneNumber { get; set; } = "0909090909";
        public bool? Gender { get; set; } = true;
        public DateTime? DateOfBirth { get; set; } = DateTime.UtcNow.AddYears(-18);
        public string? ImageUrl { get; set; } = "https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671142.jpg";
        // FACTORY
        public string FactoryName { get; set; } // ten nha may
        public string FactoryContactPerson { get; set; } //chu nha may
        public string FactoryContactPhone { get; set; } // sdt
        public string FacetoryAddress { get; set; } //dia chi
        public string ContractName { get; set; }
        public string ContractPaperUrl { get; set; }

        public List<SelectedProductDTO> SelectedProducts {  get; set; }
    }

    public class SelectedProductDTO
    {
        public Guid ProductId { get; set; }
        public int? ProductionCapacity { get; set; }
        public int? EstimatedProductionTimwe { get; set; }
    }

}