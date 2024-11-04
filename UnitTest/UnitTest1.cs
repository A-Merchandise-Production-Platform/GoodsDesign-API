namespace UnitTest
{
    public class UnitTest1
    {
        [Fact]
        public void Add_ReturnsCorrectSum()
        {
            Assert.Equal(7 + 8, 15);
        }
    }
}