/*
 * Copyright (c) 2017, TopCoder, Inc. All rights reserved.
 */

using E = Barton.DAL.Entities;
using Barton.DAL.Exceptions;
using MongoDB.Bson;
using MongoDB.Driver;
using System.Collections.Generic;

namespace Barton.DAL.Services.Impl
{
    /// <summary>
    /// <para>
    /// The implementation of <see cref="ITagService"/>.
    /// </para>
    /// </summary>
    ///
    /// <threadsafety>
    /// <para>
    /// This class is immutable (assuming dependencies are not injected more than once) and thread-safe.
    /// </para>
    /// </threadsafety>
    /// 
    /// <author>TCSCODER</author>
    /// <version>1.0</version>
    /// <copyright>Copyright (c) 2017, TopCoder, Inc. All rights reserved.</copyright>
    public class TagService : BasePersistenceService, ITagService
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="TagService"/> class.
        /// </summary>
        public TagService()
        {
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
        public override void CheckConfiguration()
        {
            base.CheckConfiguration();
        }

        /// <summary>
        /// Creates an entity.
        /// </summary>
        /// <param name="entity">The entity to create.</param>
        /// <returns>The created entity.</returns>
        /// <exception cref="ArgumentNullException">If any argument is null.</exception>
        /// <exception cref="PersistenceException">If error occurred during access the database persistence.
        /// </exception>
        /// <exception cref="ServiceException">If any other error occurred during the operation.</exception>
        public E.Tag Create(E.Tag entity)
        {
            return Helper.LoggingWrapper(Logger, () =>
            {
                Helper.CheckNotNull(entity, nameof(entity));

                return Execute((db) =>
                {
                    GetDbSet<E.Tag>(db).InsertOne(entity);

                    return entity;

                }, "creating Tag");

            }, entity);
        }

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
        public E.Tag Update(E.Tag entity)
        {
            return Helper.LoggingWrapper(Logger, () =>
            {
                Helper.CheckNotNull(entity, nameof(entity));
                Helper.CheckNotNull(entity.Id, nameof(entity.Id));

                return Execute((db) =>
                {
                    var existing = CheckEntityExists<E.Tag>(entity.Id, db);

                    GetDbSet<E.Tag>(db).ReplaceOne(GetIdFilter(entity.Id), entity);

                    return GetTag(entity.Id, db);

                }, "updating Tag");

            }, entity);
        }

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
        public E.Tag Get(string id)
        {
            return Helper.LoggingWrapper(Logger, () =>
            {
                Helper.CheckNotNull(id, nameof(id));

                return Execute((db) =>
                {
                    var objectId = new ObjectId(id);
                    return GetTag(objectId, db);
                }, "getting Tag");

            }, id);
        }

        /// <summary>
        /// Searches entities.
        /// </summary>
        /// <param name="criteria">The search criteria.</param>
        /// <returns>The entities.</returns>
        /// <exception cref="PersistenceException">If error occurred during access the database persistence.
        /// </exception>
        /// <exception cref="ServiceException">If any other error occurred during the operation.</exception>
        public IList<E.Tag> Search(E.TagSearchCriteria criteria)
        {
            return Helper.LoggingWrapper(Logger, () =>
            {
                return Execute((db) =>
                {
                    var filter = Builders<E.Tag>.Filter
                                    .Regex("text", new BsonRegularExpression(criteria != null ? criteria.Text : "", "i"));

                    return GetDbSet<E.Tag>(db).Find(filter).ToList();
                }, "getting Tag");

            }, criteria);
        }

        /// <summary>
        /// Deletes an entity with the given Id.
        /// </summary>
        /// <param name="id">The entity id.</param>
        /// <exception cref="ArgumentException">If <paramref name="id"/> is not positive.</exception>
        /// <exception cref="EntityNotFoundException">If the entity to retrieve doesn't exist.</exception>
        /// <exception cref="PersistenceException">If error occurred during access the database persistence.
        /// </exception>
        /// <exception cref="ServiceException">If any other error occurred during the operation.</exception>
        public void Delete(string id)
        {
            Helper.LoggingWrapper(Logger, () =>
            {
                Helper.CheckNotNull(id, nameof(id));

                Execute((db) =>
                {
                    var objectId = new ObjectId(id);
                    var existing = CheckEntityExists<E.Tag>(objectId, db);
                    GetDbSet<E.Tag>(db).DeleteOne(GetIdFilter(objectId));
                }, "deleting Tag");

            }, id);
        }

        #region private methods

        /// <summary>
        /// Gets the Tag.
        /// </summary>
        /// <param name="id">The id.</param>
        /// <param name="db">The db context.</param>
        /// <returns>The Tag.</returns>
        private E.Tag GetTag(ObjectId id, IMongoDatabase db)
        {
            return CheckEntityExists<E.Tag>(id, db);
        }

        /// <summary>
        /// Gets the identifier filter.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <returns></returns>
        private FilterDefinition<E.Tag> GetIdFilter(ObjectId id)
        {
            return Builders<E.Tag>.Filter.Eq("_id", id);
        }

        #endregion
    }
}