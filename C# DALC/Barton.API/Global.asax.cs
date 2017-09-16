/*
*  Copyright (c) 2017, TopCoder, Inc. All rights reserved.
*/

using Barton.API.Support;
using log4net;
using log4net.Config;
using Microsoft.Practices.Unity;
using Microsoft.Practices.Unity.Configuration;
using Newtonsoft.Json.Serialization;
using System;
using System.Configuration;
using System.Web.Http;
using Unity.WebApi;

namespace Barton.API
{
    /// <summary>
    /// The entry point of the web api application.
    /// </summary>
    /// <seealso cref="System.Web.HttpApplication" />
    public class WebApiApplication : System.Web.HttpApplication
    {
        /// <summary>
        /// Applications the start.
        /// </summary>
        protected void Application_Start()
        {
            GlobalConfiguration.Configure(Register);
        }

        /// <summary>
        /// Registers the global routes, filter, dependency resolver which uses Microsoft Unity framework, etc.
        /// </summary>
        ///
        /// <param name="config">
        /// The HttpConfiguration.
        /// </param>
        /// <remarks>Any exception should be simply propagated to caller.</remarks>
        private static void Register(HttpConfiguration config)
        {
            // configure logger
            XmlConfigurator.Configure();
            var logger = LogManager.GetLogger("barton");

            try
            {
                var unitySection = (UnityConfigurationSection)ConfigurationManager.GetSection("unity");
                var unityContainer = new UnityContainer().LoadConfiguration(unitySection)
                    .RegisterInstance(typeof(ILog), logger);

                GlobalConfiguration.Configuration.DependencyResolver = new UnityDependencyResolver(unityContainer);
                GlobalConfiguration.Configuration.Formatters.XmlFormatter.SupportedMediaTypes.Clear();

                config.MapHttpAttributeRoutes();

                // set unity dependency resolver
                config.DependencyResolver = new UnityDependencyResolver(unityContainer);


                config.Filters.Add(unityContainer.Resolve<ExceptionFilter>());
                config.Filters.Add(unityContainer.Resolve<LoggerActionFilter>());

                var serializer = GlobalConfiguration.Configuration.Formatters.JsonFormatter.SerializerSettings;
                serializer.ContractResolver = new CamelCasePropertyNamesContractResolver();
            }
            catch (Exception ex)
            {
                logger.Error("Error while starting the application.", ex);
                throw;
            }
        }
    }
}
