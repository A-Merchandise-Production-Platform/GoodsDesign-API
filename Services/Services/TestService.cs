using Services.Interfaces;

namespace Services.Services
{
    public class TestService : ITestService
    {
        public async Task<int> Add(int a, int b)
        {
            return a + b;
        }
    }
}
