namespace DataTransferObjects.UserDTOs
{
    public class UserCreateDTO
    {
        public string Email { get; set; } = "";
        public string? Password { get; set; } = "";
        public string? UserName { get; set; } = "";
        public string? PhoneNumber { get; set; } = "";
        public bool? Gender { get; set; } = true;
        public DateTime? DateOfBirth { get; set; } = DateTime.UtcNow.AddYears(-18);
        public string? ImageUrl { get; set; } = "";
    }
}
