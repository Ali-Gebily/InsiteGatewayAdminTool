/*
*  Copyright (c) 2017, TopCoder, Inc. All rights reserved.
*/

using Barton.DAL.Exceptions;
using System;
using System.Linq;
using MongoDB.Driver;
using Barton.DAL.Entities;
using MongoDB.Bson;
using System.Configuration;

namespace Barton.DAL.Services.Impl
{
    /// <summary>
    /// <para>
    /// This is the base class for all service implementations that access database persistence.
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
    public abstract class BasePersistenceService : BaseService
    {
        /// <summary>
        /// Gets the connection string.
        /// </summary>
        /// <value>
        /// The connection string.
        /// </value>
        public string ConnectionString
        {
            get
            {
                return ConfigurationManager.ConnectionStrings["barton"]?.ConnectionString;
            }
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="BasePersistenceService"/> class.
        /// </summary>
        protected BasePersistenceService()
        {
        }

        /// <summary>
        /// Creates the db context.
        /// </summary>
        protected IMongoDatabase GetDatabase()
        {
            var client = new MongoClient(ConnectionString);

            //take database name from connection string
            var dbName = MongoUrl.Create(ConnectionString).DatabaseName;

            return client.GetDatabase(dbName);
        }

        /// <summary>
        /// Executes the action providing the db context.
        /// </summary>
        /// <param name="action">The action to process.</param>
        /// <param name="methodDescription">The short description of what the source method does.</param>
        /// <exception cref="PersistenceException">If error occurred during access the database persistence.
        /// </exception>
        /// <exception cref="ServiceException">If any other error occurred during the operation.</exception>
        protected void Execute(Action<IMongoDatabase> action, string methodDescription)
        {
            try
            {
                action(GetDatabase());
            }
            catch (Exception ex)
            {
                throw (ex is ServiceException) ? ex : new PersistenceException(
                    $"An error occurred when {methodDescription}.", ex);
            }
        }

        /// <summary>
        /// Executes the action providing the db context.
        /// </summary>
        /// <typeparam name="T">The type of the function result.</typeparam>
        /// 
        /// <param name="function">The function to process.</param>
        /// <param name="methodDescription">The short description of what the source method does.</param>
        /// 
        /// <returns>The result of the function.</returns>
        /// 
        /// <exception cref="PersistenceException">If error occurred during access the database persistence.
        /// </exception>
        /// <exception cref="ServiceException">If any other error occurred during the operation.</exception>
        protected T Execute<T>(Func<IMongoDatabase, T> function, string methodDescription)
        {
            try
            {
                return function(GetDatabase());
            }
            catch (Exception ex)
            {
                throw (ex is ServiceException) ? ex : new PersistenceException(
                    $"An error occurred when {methodDescription}.", ex);
            }
        }

        /// <summary>
        /// Checks if entity exists with given id or not.
        /// </summary>
        /// <typeparam name="T">The entity type.</typeparam>
        /// <param name="id">The entity id.</param>
        /// <param name="db">The db context.</param>
        protected T CheckEntityExists<T>(ObjectId id, IMongoDatabase db) where T : IdentifiableEntity
        {
            var findResult = db.GetCollection<T>(typeof(T).Name.ToLower() + "s").Find(c => c.Id == id);
            var entity = findResult.FirstOrDefault();
            CheckEntityExists(entity, id);
            return entity;
        }

        /// <summary>
        /// Checks if entity is not null.
        /// </summary>
        /// <typeparam name="T">The type of the entity.</typeparam>
        /// <param name="entity">The entity instance.</param>
        /// <param name="id">The entity id.</param>
        /// 
        /// <exception cref="EntityNotFoundException">If <paramref name="entity"/> is null.</exception>
        private void CheckEntityExists<T>(T entity, ObjectId id)
            where T : IdentifiableEntity
        {
            if (entity == null)
            {
                throw new EntityNotFoundException($"{typeof(T).Name.ToLower()} with Id='{id}' was not found.");
            }
        }

        /// <summary>
        /// Gets the database set.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="db">The database.</param>
        /// <returns>The database set/collection.</returns>
        protected IMongoCollection<T> GetDbSet<T>(IMongoDatabase db)
        {
            return db.GetCollection<T>(typeof(T).Name.ToLower() + "s");
        }

        /// <summary>
        /// Checks whether this instance was properly configured.
        /// </summary>
        public override void CheckConfiguration()
        {
            base.CheckConfiguration();

            Helper.CheckConfiguration(ConnectionString, nameof(ConnectionString));
        }
    }
}
