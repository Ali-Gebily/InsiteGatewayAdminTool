/*
 * Copyright (c) 2017, TopCoder, Inc. All rights reserved.
 */
using System;
using System.Diagnostics;
using System.Reflection;
using System.Text;
using log4net;
using Newtonsoft.Json;
using Barton.DAL.Exceptions;

namespace Barton.DAL
{
    /// <summary>
    /// <para>
    /// Defines helper methods used in this application.
    /// </para>
    /// </summary>
    ///
    /// <threadsafety>
    /// This class is immutable and thread-safe.
    /// </threadsafety>
    ///
    /// <author>TCSCODER</author>
    /// <version>1.0</version>
    /// <copyright>Copyright (c) 2017, TopCoder, Inc. All rights reserved.</copyright>
    public static class Helper
    {

        /// <summary>
        /// Represents the JSON serializer settings.
        /// </summary>
        internal static readonly JsonSerializerSettings SerializerSettings = new JsonSerializerSettings
        {
            ReferenceLoopHandling = ReferenceLoopHandling.Ignore,
            DateFormatString = "MM/dd/yyyy HH:mm:ss",
            DateTimeZoneHandling = DateTimeZoneHandling.Utc
        };

        /// <summary>
        /// <para>
        /// Checks whether the given object is null.
        /// </para>
        /// </summary>
        /// <param name="value">
        /// The object to check.
        /// </param>
        /// <param name="parameterName">
        /// The actual parameter name of the argument being checked.
        /// </param>
        /// <exception cref="ArgumentNullException">
        /// If object is null.
        /// </exception>
        public static void CheckNotNull(object value, string parameterName)
        {
            if (value == null)
            {
                throw new ArgumentNullException(
                    parameterName, $"The parameter '{parameterName}' can not be null.");
            }
        }

        /// <summary>
        /// <para>
        /// Gets the string representation of the given object.
        /// </para>
        /// </summary>
        /// <param name="obj">
        /// The object to describe.
        /// </param>
        /// <returns>
        /// The string representation of the object.
        /// </returns>
        public static string GetObjectDescription(object obj)
        {
            try
            {
                return JsonConvert.SerializeObject(obj, SerializerSettings);
            }
            catch
            {
                return "[Can't express this value]";
            }
        }

        /// <summary>
        /// <para>
        /// Checks whether the given value is configured correctly or not.
        /// </para>
        /// </summary>
        /// <param name="value">
        /// The value to check.
        /// </param>
        /// <param name="name">
        /// The actual property name.
        /// </param>
        /// <exception cref="ConfigurationException">
        /// If value is null or empty string, or not positive integer, or it is string
        /// list and the list contains null/empty item.
        /// </exception>
        public static void CheckConfiguration(object value, string name)
        {
            if (value == null)
            {
                throw new ConfigurationException($"Instance property '{name}' wasn't configured properly.");
            }
            if (value is string && ((string)value).Trim().Length == 0)
            {
                throw new ConfigurationException($"Instance property '{name}' wasn't configured properly.");
            }
        }

        /// <summary>
        /// Logs a method entry at DEBUG level.
        /// </summary>
        ///
        /// <param name="method">
        /// The method where the logging occurs.
        /// </param>
        /// <param name="logger">
        /// The logger instance to be used for logging.
        /// </param>
        /// <param name="parameters">
        /// The method parameters.
        /// </param>
        ///
        /// <returns>
        /// The method start date time.
        /// </returns>
        /// <remarks>The internal exception may be thrown directly.</remarks>
        private static DateTime LogMethodEntry(MethodBase method, ILog logger, params object[] parameters)
        {
            // Create a string format to display parameters
            var logFormat = new StringBuilder();
            var pis = method.GetParameters();
            var methodName = $"{method.DeclaringType}.{method.Name}";
            if (pis.Length != parameters.Length)
            {
                throw new ArgumentException($"The number of provided parameters for method '{methodName}' is wrong.",
                    nameof(parameters));
            }
            logFormat.AppendFormat("Entering method {0}", methodName).AppendLine();
            logFormat.AppendLine("Argument Values:");
            for (int i = 0; i < pis.Length; i++)
            {
                logFormat.Append("\t").Append(pis[i].Name).Append(": ");
                logFormat.AppendLine(GetObjectDescription(parameters[i]));
            }
            // Log
            LogDebug(logger, logFormat.ToString());

            // Return the current DateTime
            return DateTime.Now;
        }

        /// <summary>
        /// Logs a method exit at DEBUG level.
        /// </summary>
        ///
        /// <param name="method">
        /// The method where the logging occurs.
        /// </param>
        /// <param name="logger">
        /// The logger instance to be used for logging.
        /// </param>
        /// <param name="start">
        /// The method start date time.
        /// </param>
        private static void LogMethodExit(MethodBase method, ILog logger, DateTime start)
        {
            LogDebug(logger,
                $"Exiting method {method.DeclaringType}.{method.Name}. " +
                $"Execution time: {(DateTime.Now - start).TotalMilliseconds}ms");
        }

        /// <summary>
        /// Logs the return value and method exit on DEBUG level.
        /// </summary>
        ///
        /// <typeparam name="R">
        /// The method return type.
        /// </typeparam>
        ///
        /// <param name="method">
        /// The method where the logging occurs.
        /// </param>
        /// <param name="logger">
        /// The logger instance to be used for logging.
        /// </param>
        /// <param name="returnValue">
        /// The return value to log.
        /// </param>
        /// <param name="start">
        /// The method start date time.
        /// </param>
        private static R LogReturnValue<R>(MethodBase method, ILog logger, R returnValue, DateTime start)
        {
            LogDebug(logger,
                $"Exiting method {method.DeclaringType}.{method.Name}. " +
                $"Execution time: {(DateTime.Now - start).TotalMilliseconds}ms. " +
                $"Return value: {GetObjectDescription(returnValue)}");

            return returnValue;
        }

        /// <summary>
        /// Logs the given exception on ERROR level.
        /// </summary>
        ///
        /// <param name="method">
        /// The method where the logging occurs.
        /// </param>
        /// <param name="logger">
        /// The logger instance to be used for logging.
        /// </param>
        /// <param name="ex">
        /// The exception to be logged.
        /// </param>
        private static void LogException(MethodBase method, ILog logger, Exception ex)
        {
            // Write an ERROR log.
            LogError(logger, $"Error in method {method.DeclaringType}.{method.Name}.\n\nDetails:\n{ex}");
        }

        /// <summary>
        /// Logs the given message on DEBUG level.
        /// </summary>
        ///
        /// <param name="logger">
        /// The logger instance to be used for logging.
        /// </param>
        /// <param name="message">
        /// The message to log.
        /// </param>
        private static void LogDebug(ILog logger, string message)
        {
            if (logger == null)
            {
                return;
            }
            try
            {
                logger.Debug(message);
            }
            catch
            {
                // ignored
            }
        }

        /// <summary>
        /// Logs the given message on ERROR level.
        /// </summary>
        ///
        /// <param name="logger">
        /// The logger instance to be used for logging.
        /// </param>
        /// <param name="message">
        /// The message to log.
        /// </param>
        private static void LogError(ILog logger, string message)
        {
            if (logger == null)
            {
                return;
            }
            try
            {
                logger.Error(message);
            }
            catch
            {
                // ignored
            }
        }

        /// <summary>
        /// This is a helper method to provide logging wrapper.
        /// </summary>
        ///
        /// <remarks>
        /// Any exception will throw to caller directly.
        /// </remarks>
        ///
        /// <param name="call">
        /// The delegation to execute the business logic.
        /// </param>
        /// <param name="logger">
        /// The logger instance to be used for logging.
        /// </param>
        /// <param name="parameters">
        /// The parameters in the delegation method.
        /// </param>
        public static void LoggingWrapper(ILog logger, Action call, params object[] parameters)
        {
            // Log method entry
            var callingMethod = new StackTrace().GetFrame(1).GetMethod();

            var start = LogMethodEntry(callingMethod, logger, parameters);

            try
            {
                // Delegation
                call();
            }
            catch (Exception e)
            {
                LogException(callingMethod, logger, e);
                throw;
            }

            // Log method exit
            LogMethodExit(callingMethod, logger, start);
        }

        /// <summary>
        /// This is a helper method to provide logging wrapper.
        /// </summary>
        ///
        /// <typeparam name="T">
        /// The return type.
        /// </typeparam>
        ///
        /// <remarks>
        /// Any exception will throw to caller directly.
        /// </remarks>
        ///
        /// <param name="call">
        /// The delegation to execute the business logic.
        /// </param>
        /// <param name="logger">
        /// The logger instance to be used for logging.
        /// </param>
        /// <param name="parameters">
        /// The parameters in the delegation method.
        /// </param>
        ///
        /// <returns>
        /// The value returned by <paramref name="call"/>.
        /// </returns>
        internal static T LoggingWrapper<T>(ILog logger, Func<T> call, params object[] parameters)
        {
            // Log method entry
            var callingMethod = new StackTrace().GetFrame(1).GetMethod();

            var start = LogMethodEntry(callingMethod, logger, parameters);

            T ret;
            try
            {
                // Delegation
                ret = call();
            }
            catch (Exception e)
            {
                LogException(callingMethod, logger, e);
                throw;
            }

            // Log method exit with return value
            return LogReturnValue(callingMethod, logger, ret, start);
        }
    }
}