/*
 * Copyright (c) 2017, TopCoder, Inc. All rights reserved.
 */
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;
using log4net;
using Microsoft.Practices.Unity;
using Barton.DAL;

namespace Barton.API.Support
{
    /// <summary>
    /// This filter provides logging for action entries, parameter information, action exits and return values.
    /// </summary>
    /// 
    /// <threadsafety>
    /// This class is mutable but effectively thread-safe.
    /// </threadsafety>
    ///
    /// <author>TCSCODER</author>
    /// <version>1.0</version>
    /// <copyright>Copyright (c) 2017, TopCoder, Inc. All rights reserved.</copyright>
    public sealed class LoggerActionFilter : ActionFilterAttribute
    {

        /// <summary>
        /// Initializes a new instance of the <see cref="LoggerActionFilter"/> class.
        /// </summary>
        public LoggerActionFilter()
        {
        }
        /// <summary>
        /// Gets or sets the logger used for logging in this class.
        /// </summary>
        ///
        /// <value>The logger. It's initialized by Unity through injection.
        /// It should not be null/empty after initialization.</value>
        [Dependency]
        public ILog Logger
        {
            get;
            set;
        }

        /// <summary>
        /// Checks that all configuration properties were properly initialized.
        /// </summary>
        ///
        /// <exception cref="ConfigurationException">
        /// If any of required injection fields are not injected or have invalid values.
        /// </exception>
        public void CheckConfiguration()
        {
            Helper.CheckNotNull(Logger, nameof(Logger));
        }

        /// <summary>
        /// Called when action ends execution.
        /// </summary>
        /// <param name="context">The action executed context.</param>
        public override void OnActionExecuted(HttpActionExecutedContext context)
        {
            var message = new StringBuilder();
            message.AppendFormat("Exiting action '{0}.{1}'.",
                context.ActionContext.ActionDescriptor.ControllerDescriptor.ControllerName + "Controller",
                context.ActionContext.ActionDescriptor.ActionName);

            var responseObject = context.Response?.Content as ObjectContent;
            if (responseObject != null)
            {
                var valueToLog = responseObject.Value;

                message.AppendLine().AppendFormat("Action Result: {0}",
                    Helper.GetObjectDescription(valueToLog)).AppendLine();
            }

            Logger.Debug(message.ToString());
        }

        /// <summary>
        /// Called when action starts executing.
        /// </summary>
        /// <param name="context">The action context.</param>
        public override void OnActionExecuting(HttpActionContext context)
        {
            // Log the action entry
            var message = new StringBuilder();
            message.AppendFormat($"Entering action '{GetFullActionName(context)}.");
            if (context.ActionArguments.Count > 0)
            {
                message.AppendLine().Append("Action parameters:");
                foreach (KeyValuePair<string, object> parameter in context.ActionArguments)
                {
                    var valueToLog = parameter.Value;

                    var argumentDescription = Helper.GetObjectDescription(valueToLog);
                    message.AppendLine().AppendFormat("\t {0}: {1}", parameter.Key, argumentDescription);
                }
            }

            Logger.Debug(message.ToString());
        }

        /// <summary>
        /// Gets the full name of the action.
        /// </summary>
        /// <param name="context">The action context.</param>
        /// <param name="includeController">Determines whether 'Controller' suffix should be included.</param>
        /// <returns>The full name of the action.</returns>
        private static string GetFullActionName(HttpActionContext context, bool includeController = true)
        {
            return context.ActionDescriptor.ControllerDescriptor.ControllerName +
                (includeController ? "Controller" : string.Empty) + "." +
                context.ActionDescriptor.ActionName;
        }
    }
}
