using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace BusinessObjects.Entities
{
    [Owned]

    public class AddressModel
    {
        [JsonPropertyName("provinceID")]
        public int ProvinceID { get; set; }

        [JsonPropertyName("districtID")]
        public int DistrictID { get; set; }

        [JsonPropertyName("wardCode")]
        public string WardCode { get; set; }

        [JsonPropertyName("street")]
        public string Street { get; set; }
    }
}
