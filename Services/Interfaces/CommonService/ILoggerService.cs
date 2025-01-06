﻿namespace Services.Interfaces.CommonService
{
    public interface ILoggerService
    {
        void Success(string msg);
        void Error(string msg);
        void Warn(string msg);
        void Info(string msg);
    }
}