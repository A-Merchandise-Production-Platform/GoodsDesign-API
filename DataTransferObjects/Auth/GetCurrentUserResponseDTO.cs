namespace DataTransferObjects.Auth
{
    public class GetCurrentUserResponseDTO
    {
        public Guid? Id { get; set; }
        public string? Email { get; set; }
        public string? UserName { get; set; }
        public string? PhoneNumber { get; set; }
        public bool? Gender { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string? ImageUrl { get; set; }
        public string? Role { get; set; }
    }
}
