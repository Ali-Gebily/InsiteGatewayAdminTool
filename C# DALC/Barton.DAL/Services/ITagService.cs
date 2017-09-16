/*
*  Copyright (c) 2017, TopCoder, Inc. All rights reserved.
*/

using Barton.DAL.Entities;
using Barton.DAL.Exceptions;
using MongoDB.Bson;
using System;
using System.Collections.Generic;

namespace Barton.DAL.Services
{
    /// <summary>
    /// This service interface defines methods related to manage companies.
    /// </summary>
    ///
    /// <threadsafety>
    /// Implementations of this interface should be effectively thread safe.
    /// </threadsafety>
    /// 
    /// <author>TCSCODER</author>
    /// <version>1.0</version>
    /// <copyright>Copyright (c) 2017, TopCoder, Inc. All rights reserved.</copyright>
    public interface ITagService
    {
        /// <summary>
        /// Creates an entity.
        /// </summary>
        /// <param name="entity">The entity to create.</param>
        /// <returns>The created entity.</returns>
        /// <exception cref="ArgumentNullException">If any argument is null.</exception>
        /// <exception cref="PersistenceException">If error occurred during access the database persistence.
        /// </exception>
        /// <exception cref="ServiceException">If any other error occurred during the operation.</exception>
        Tag Create(Tag entity);

        /// <summary>
        /// Updates an entity.
        /// </summary>
        /// <param name="entity">The entity to update.</param>
        /// <returns>The updated entity.</returns>
        /// <exception cref="ArgumentNullException">If any argument is null.</exception>
        /// <exception cref="ArgumentException">If entity.Id is not positive.</exception>
        /// <exception cref="EntityNotFoundException">If the entity to update doesn't exist.</exception>
        /// <exception cref="PersistenceException">If error occurred during access the database persistence.
        /// </exception>
        /// <exception cref="ServiceException">If any other error occurred during the operation.</exception>
        Tag Update(Tag entity);

        /// <summary>
        /// Gets an entity with the given Id.
        /// </summary>
        /// <param name="id">The entity id.</param>
        /// <returns>The entity.</returns>
        /// <exception cref="ArgumentException">If <paramref name="id"/> is not positive.</exception>
        /// <exception cref="EntityNotFoundException">If the entity to retrieve doesn't exist.</exception>
        /// <exception cref="PersistenceException">If error occurred during access the database persistence.
        /// </exception>
        /// <exception cref="ServiceException">If any other error occurred during the operation.</exception>
        Tag Get(string id);

        /// <summary>
        /// Searches entities.
        /// </summary>
        /// <param name="criteria">The search criteria.</param>
        /// <returns>The entities.</returns>
        /// <exception cref="PersistenceException">If error occurred during access the database persistence.
        /// </exception>
        /// <exception cref="ServiceException">If any other error occurred during the operation.</exception>
        IList<Tag> Search(TagSearchCriteria criteria);

        /// <summary>
        /// Deletes an entity with the given Id.
        /// </summary>
        /// <param name="id">The entity id.</param>
        /// <exception cref="ArgumentException">If <paramref name="id"/> is not positive.</exception>
        /// <exception cref="EntityNotFoundException">If the entity to retrieve doesn't exist.</exception>
        /// <exception cref="PersistenceException">If error occurred during access the database persistence.
        /// </exception>
        /// <exception cref="ServiceException">If any other error occurred during the operation.</exception>
        void Delete(string id);
    }
}