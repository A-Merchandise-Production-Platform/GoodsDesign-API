using BusinessObjects.Entities;
using BusinessObjects.Enums;
using DataTransferObjects.NotificationDTOs;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using Repositories.Interfaces;
using Services.Hubs;
using Services.Interfaces;
using Services.Interfaces.CommonService;

namespace Services.Services
{
    public class NotificationService : INotificationService
    {
        private readonly ILoggerService _logger;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHubContext<NotificationHub> _notificationHubContext;
        private readonly UserManager<User> _userManager;

        public NotificationService(
            ILoggerService logger,
            IUnitOfWork unitOfWork
        , IHubContext<NotificationHub> notificationHubContext,
            UserManager<User> userManager
            )
        {
            _logger = logger;
            _unitOfWork = unitOfWork;
            _notificationHubContext = notificationHubContext;
            _userManager = userManager;
        }

        // Xóa thông báo dựa trên notificationId
        public async Task DeleteNotification(Guid notificationId)
        {
            try
            {
                var notification = await _unitOfWork.NotificationRepository.GetByIdAsync(notificationId);
                if (notification == null)
                {
                    throw new KeyNotFoundException("Notification not found.");
                }

                await _unitOfWork.NotificationRepository.SoftRemove(notification);
                await _unitOfWork.SaveChangesAsync();
                _logger.Info($"Notification with ID {notificationId} deleted successfully.");
            }
            catch (Exception ex)
            {
                _logger.Error($"500 - Error during notification deletion: {ex.Message}");
                throw;
            }
        }

        // Đếm số thông báo chưa đọc của một người dùng
        public async Task<int> GetUnreadNotificationsCount(Guid userId)
        {
            try
            {
                var notifications = await _unitOfWork.NotificationRepository.GetAllAsync();
                return notifications.Count(n => n.UserId == userId && !n.IsRead);
            }
            catch (Exception ex)
            {
                _logger.Error($"500 - Error fetching unread notifications: {ex.Message}");
                throw;
            }
        }

        public async Task<Notification> PushNotificationToAll(NotificationDTO notificationDTO)
        {
            try
            {
                var notification = new Notification
                {
                    Title = notificationDTO.Title,
                    Content = notificationDTO.Content,
                    Url = notificationDTO.Url,
                    IsRead = false,
                    Type = NotificationType.AllUsers
                };

                await _unitOfWork.NotificationRepository.AddAsync(notification);
                await _unitOfWork.SaveChangesAsync();

                await _notificationHubContext.Clients.All.SendAsync("ReceiveMessage");

                _logger.Info($"Notification sent to all users: {notification.Title}");
                return notification;
            }
            catch (Exception ex)
            {
                _logger.Error($"Error pushing notification to all users: {ex.Message}");
                throw;
            }
        }

        // Push notification to a specific role
        public async Task<Notification> PushNotificationToRole(Roles role, NotificationDTO notificationDTO)
        {
            try
            {
                var notification = new Notification
                {
                    Title = notificationDTO.Title,
                    Content = notificationDTO.Content,
                    Url = notificationDTO.Url,
                    IsRead = false,
                    Role = role.ToString(),
                    Type = NotificationType.ByRole
                };

                await _unitOfWork.NotificationRepository.AddAsync(notification);
                await _unitOfWork.SaveChangesAsync();

                _logger.Info($"Notification sent to role {role}: {notification.Title}");

                await _notificationHubContext.Clients.Group(role.ToString()).SendAsync("ReceiveMessage");
                return notification;
            }
            catch (Exception ex)
            {
                _logger.Error($"Error pushing notification to role {role}: {ex.Message}");
                throw;
            }
        }

        // Push notification to a specific user
        public async Task<Notification> PushNotificationToUser(Guid userId, NotificationDTO notificationDTO)
        {
            try
            {
                User user = await _userManager.FindByIdAsync(userId.ToString());
                if (user == null)
                {
                    throw new KeyNotFoundException("User not found.");
                }
                var notification = new Notification
                {
                    Title = notificationDTO.Title,
                    Content = notificationDTO.Content,
                    Url = notificationDTO.Url,
                    IsRead = false,
                    UserId = userId,
                    User = user,
                    Type = NotificationType.ByUser
                };

                await _unitOfWork.NotificationRepository.AddAsync(notification);
                await _unitOfWork.SaveChangesAsync();

                _logger.Info($"Notification sent to user {userId}: {notification.Title}");

                await _notificationHubContext.Clients.User(userId.ToString()).SendAsync("ReceiveMessage");

                return notification;
            }
            catch (Exception ex)
            {
                _logger.Error($"Error pushing notification to user {userId}: {ex.Message}");
                throw;
            }
        }

        // Đánh dấu tất cả thông báo của một người dùng là đã đọc
        public async Task ReadAllNotifications(Guid userId)
        {
            try
            {
                var notifications = await _unitOfWork.NotificationRepository.GetAllAsync();
                var userNotifications = notifications.Where(n => n.UserId == userId && !n.IsRead).ToList();

                if (!userNotifications.Any())
                {
                    _logger.Info($"No unread notifications for user {userId}.");
                    return;
                }

                userNotifications.ForEach(n => n.IsRead = true);
                await _unitOfWork.NotificationRepository.AddRangeAsync(userNotifications);

                await _unitOfWork.SaveChangesAsync();
                _logger.Info($"All notifications for user {userId} marked as read.");
            }
            catch (Exception ex)
            {
                _logger.Error($"500 - Error marking notifications as read: {ex.Message}");
                throw;
            }
        }

        // Đọc một thông báo cụ thể
        public async Task<Notification> ReadNotification(Guid notificationId)
        {
            try
            {
                var notification = await _unitOfWork.NotificationRepository.GetByIdAsync(notificationId);
                if (notification == null)
                {
                    throw new KeyNotFoundException("Notification not found.");
                }

                if (!notification.IsRead)
                {
                    notification.IsRead = true;
                    await _unitOfWork.NotificationRepository.Update(notification);
                    await _unitOfWork.SaveChangesAsync();
                }

                _logger.Info($"Notification with ID {notificationId} marked as read.");
                return notification;
            }
            catch (Exception ex)
            {
                _logger.Error($"500 - Error reading notification: {ex.Message}");
                throw;
            }
        }


    }
}
