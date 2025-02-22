public interface INotificationHub
{
    Task ReceiveMessage(string user, string message);
}
