namespace Services.Utils
{
    public class ApiResult<T>
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; }
        public T Data { get; set; }

        /// <summary>
        /// Creates a success response.
        /// </summary>
        /// <param name="data">The response data.</param>
        /// <param name="message">Optional success message.</param>
        /// <returns>An ApiResult representing success.</returns>
        public static ApiResult<T> Success(T data, string message = "Operation successful.")
        {
            return new ApiResult<T>
            {
                IsSuccess = true,
                Message = message,
                Data = data
            };
        }

        /// <summary>
        /// Creates an error response.
        /// </summary>
        /// <param name="message">The error message.</param>
        /// <returns>An ApiResult representing failure.</returns>
        public static ApiResult<T> Error(string message)
        {
            return new ApiResult<T>
            {
                IsSuccess = false,
                Message = message,
                Data = default
            };
        }
    }
}
