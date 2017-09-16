/*
*  Copyright (c) 2017, TopCoder, Inc. All rights reserved.
*/

using Barton.DAL;
using Barton.DAL.Entities;
using Barton.DAL.Services;
using Microsoft.Practices.Unity;
using System.Collections.Generic;
using System.Web.Http;

namespace Barton.API.Controllers
{
    /// <summary>
    /// <para>
    /// The controller to expose the operations related Tag.
    /// </para>
    /// </summary>
    /// 
    /// <remarks>
    /// <para>
    /// This class is immutable (assuming dependencies are not injected more than once) and thread-safe.
    /// </para>
    /// </remarks>
    /// 
    /// <author>TCSCODER</author>
    /// <version>1.0</version>
    /// <copyright>Copyright (c) 2017, TopCoder, Inc. All rights reserved.</copyright>
    [RoutePrefix("api/v1")]
    public class TagController : ApiController
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="TagController"/> class.
        /// </summary>
        public TagController()
        {
        }

        /// <summary>
        /// <para>
        /// Represents the <see cref="ITagService"/> used in this class.
        /// </para>
        /// </summary>
        /// <value>The <see cref="ITagService"/> instance. It should not be null.</value>
        [Dependency]
        public ITagService TagService
        {
            get;
            set;
        }

        /// <summary>
        /// Gets all countries.
        /// </summary>
        /// <param name="criteria">The search criteria.</param>
        /// <returns>All countries.</returns>
        /// <remarks>All exceptions from back-end services will be propagated.</remarks>
        [HttpGet]
        [Route("tags")]
        public IList<Tag> Search([FromUri]TagSearchCriteria criteria)
        {
            return TagService.Search(criteria);
        }

        /// <summary>
        /// Gets the tag by id.
        /// </summary>
        /// <param name="id">The tag id.</param>
        /// <returns>The tag.</returns>
        /// <remarks>All exceptions from back-end services will be propagated.</remarks>
        [HttpGet]
        [Route("tags/{id}")]
        public Tag Get(string id)
        {
            return TagService.Get(id);
        }

        /// <summary>
        /// Creates the specified tag.
        /// </summary>
        /// <param name="tag">The tag.</param>
        /// <returns>The new tag.</returns>
        /// <remarks>All exceptions from back-end services will be propagated.</remarks>
        [HttpPost]
        [Route("tags")]
        public Tag Create(Tag tag)
        {
            return TagService.Create(tag);
        }

        /// <summary>
        /// Updates the specified tag.
        /// </summary>
        /// <param name="tag">The tag.</param>
        /// <returns>The updated tag.</returns>
        /// <remarks>All exceptions from back-end services will be propagated.</remarks>
        [HttpPut]
        [Route("tags")]
        public Tag Update(Tag tag)
        {
            return TagService.Update(tag);
        }

        /// <summary>
        /// Deletes the specified tag.
        /// </summary>
        /// <param name="id">The tag id.</param>
        /// <remarks>All exceptions from back-end services will be propagated.</remarks>
        [HttpDelete]
        [Route("tags/{id}")]
        public void Delete(string id)
        {
            TagService.Delete(id);
        }

        /// <summary>
        /// <para>
        /// Checks whether this instance was properly configured.
        /// </para>
        /// </summary>
        ///
        /// <exception cref="ConfigurationException">
        /// If there's any error in configuration.
        /// </exception>
        public void CheckConfiguration()
        {
            Helper.CheckConfiguration(TagService, nameof(TagService));
        }
    }
}
