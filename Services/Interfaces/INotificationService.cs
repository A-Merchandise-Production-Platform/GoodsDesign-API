using BusinessObjects.Entities;
using BusinessObjects.Enums;
using DataTransferObjects.NotificationDTOs;

namespace Services.Interfaces
{
    public interface INotificationService
    {
        Task<int> GetUnreadNotificationsCount(Guid userId);
        Task<Notification> ReadNotification(Guid notificationId);
        Task ReadAllNotifications(Guid userId);
        Task DeleteNotification(Guid notificationId);

        //Push notification
        Task<Notification> PushNotificationToAll(NotificationDTO notificationDTO);
        Task<Notification> PushNotificationToUser(Guid userId, NotificationDTO notificationDTO);
        Task<Notification> PushNotificationToRole(Roles role, NotificationDTO notificationDTO);
    }

}
