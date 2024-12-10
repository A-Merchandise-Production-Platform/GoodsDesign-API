namespace BusinessObjects.Entities
{
    public class Category : BaseEntity
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string ImageUrl { get; set; }
        // Navigation property
        public ICollection<Product> Products { get; set; }
    }
}
