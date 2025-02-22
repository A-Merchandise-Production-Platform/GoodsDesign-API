using Microsoft.AspNetCore.SignalR;

namespace Services.Hubs
{
    public class NotificationHub : Hub<INotificationHub>
    {
        public async Task SendToAllUser()
        {
            await Clients.All.ReceiveMessage("Admin", "Hello, everyone!");
        }
        public async Task SendMessageToCaller(string user, string message)
            => await Clients.Caller.ReceiveMessage(user, message);
        public async Task SendMessageToGroup(string user, string message)
            => await Clients.Group("SignalR Users").ReceiveMessage(user, message);
    }
}