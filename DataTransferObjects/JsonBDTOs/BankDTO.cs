namespace DataTransferObjects.JsonBDTOs
{
    public class BankDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        public string Bin { get; set; } // Bank Identification Number
        public string ShortName { get; set; }
        public string Logo { get; set; }
        public bool TransferSupported { get; set; } // 1: true, 0: false
        public bool LookupSupported { get; set; } // 1: true, 0: false
        public string Short_Name { get; set; } // Duplicated field but kept for compatibility
        public int Support { get; set; }
        public bool IsTransfer { get; set; } // 1: true, 0: false
        public string SwiftCode { get; set; }
    }
}
