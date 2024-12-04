namespace Services.Utils
{
    public static class ExceptionUtils
    {
        /// <summary>
        /// Extracts the status code from an exception message or defaults to 500.
        /// </summary>
        /// <param name="exceptionMessage">The exception message.</param>
        /// <returns>An HTTP status code.</returns>
        public static int ExtractStatusCode(string exceptionMessage)
        {
            if (!string.IsNullOrWhiteSpace(exceptionMessage) && exceptionMessage.Length >= 3)
            {
                if (int.TryParse(exceptionMessage.Substring(0, 3), out int statusCode))
                {
                    return statusCode;
                }
            }

            return 500; // Default status code
        }

        /// <summary>
        /// Creates a standardized error response object.
        /// </summary>
        /// <param name="message">The error message.</param>
        /// <returns>An object containing the error response in a standard format.</returns>
        public static object CreateErrorResponse(string message)
        {
            return new
            {
                isSuccess = false,
                message = message,
                data = (object)null
            };
        }
    }

}
