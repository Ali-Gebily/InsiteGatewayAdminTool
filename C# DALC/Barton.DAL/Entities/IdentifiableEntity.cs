/*
*  Copyright (c) 2017, TopCoder, Inc. All rights reserved.
*/

using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;

namespace Barton.DAL.Entities
{
    /// <summary>
    /// An entity class that represents the identifiable entity.
    /// </summary>
    ///
    /// <author>TCSCODER</author>
    /// <version>1.0</version>
    /// <copyright>Copyright (c) 2017, TopCoder, Inc. All rights reserved.</copyright>
    public abstract class IdentifiableEntity
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="IdentifiableEntity"/> class.
        /// </summary>
        protected IdentifiableEntity()
        {

        }

        /// <summary>
        /// Gets or sets the ID.
        /// </summary>
        [BsonElement("_id")]
        [JsonConverter(typeof(ObjectIdConverter))]
        public ObjectId Id { get; set; }
    }
}

