/*
 * Copyright (c) 2017, TopCoder, Inc. All rights reserved.
 */

using Barton.DAL;
using Barton.DAL.Exceptions;
using log4net;
using Microsoft.Practices.Unity;
using System;
using System.Net;
using System.Net.Http;
using System.Web.Http.Filters;

namespace Barton.API.Support
{
    /// <summary>
    /// <para>
    /// This filter translates exceptions to HTTP status codes.
    /// </para>
    /// </summary>
    /// <remarks>
    /// <para>
    /// This class is immutable (assuming dependencies are not injected more than once) and thread-safe.
    /// </para>
    /// </remarks>
    /// <author>TCSCODER</author>
    /// <version>1.0</version>
    /// <copyright>Copyright (c) 2017, TopCoder, Inc. All rights reserved.</copyright>
    public sealed class ExceptionFilter : ExceptionFilterAttribute
    {

        /// <summary>
        /// Initializes a new instance of the <see cref="ExceptionFilter"/> class.
        /// </summary>
        public ExceptionFilter()
        {
        }
        /// <summary>
        /// <para>
        /// Represents the ILog used to perform logging.
        /// </para>
        /// </summary>
        /// <value>
        /// The ILog used to perform logging. It's initialized by Unity through injection.
        /// It should not be null after initialization.
        /// </value>
        [Dependency]
        public ILog Logger
        {
            get;
            set;
        }

        /// <summary>
        /// <para>
        /// Checks whether this instance was properly configured.
        /// </para>
        /// </summary>
        ///
        /// <exception cref="ConfigurationException ">
        /// If there's any error in configuration.
        /// </exception>
        public void CheckConfiguration()
        {
            Helper.CheckConfiguration(Logger, nameof(Logger));
        }

        /// <summary>
        /// <para>
        /// Called when an exception is caught.
        /// </para>
        /// </summary>
        /// <param name="filterContext">The context.</param>
        public override void OnException(HttpActionExecutedContext filterContext)
        {
            Helper.LoggingWrapper(Logger, delegate ()
            {
                base.OnException(filterContext);
                if (filterContext.Exception is ArgumentException)
                {
                    filterContext.Response = new HttpResponseMessage(HttpStatusCode.BadRequest);
                }
                else if (filterContext.Exception is EntityNotFoundException)
                {
                    filterContext.Response = new HttpResponseMessage(HttpStatusCode.NotFound);
                }
                else
                {
                    filterContext.Response = new HttpResponseMessage(HttpStatusCode.InternalServerError);
                }
                filterContext.Response.Content = new StringContent(filterContext.Exception.Message);

            }, filterContext);
        }
    }
}
