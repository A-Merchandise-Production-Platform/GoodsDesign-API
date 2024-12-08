namespace BusinessObjects.Entities
{
    public class Area : BaseEntity
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = "";
        public string Position { get; set; } = "";
        public string Code { get; set; } = "";
    }
}
