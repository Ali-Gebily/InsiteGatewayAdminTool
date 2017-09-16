/*
*  Copyright (c) 2017, TopCoder, Inc. All rights reserved.
*/

using log4net;
using Microsoft.Practices.Unity;
using Barton.DAL.Exceptions;

namespace Barton.DAL.Services.Impl
{
    /// <summary>
    /// This is the base class for all service implementations.
    /// </summary>
    ///
    /// <threadsafety>
    /// This class is immutable (assuming dependencies are not injected more than once) and thread-safe.
    /// </threadsafety>
    ///
    /// <author>TCSCODER</author>
    /// <version>1.0</version>
    /// <copyright>Copyright (c) 2017, TopCoder, Inc. All rights reserved.</copyright>
    public abstract class BaseService
    {
        /// <summary>
        /// <para>
        /// Represents the ILog used by sub-classes to perform logging.
        /// </para>
        /// </summary>
        /// <value>The ILog used in this class. It should not be null.</value>
        [Dependency]
        public ILog Logger
        {
            get;
            set;
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="BaseService"/> class.
        /// </summary>
        protected BaseService()
        {
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
        public virtual void CheckConfiguration()
        {
            Helper.CheckConfiguration(Logger, nameof(Logger));
        }
    }
}
