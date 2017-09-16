/*
*  Copyright (c) 2017, TopCoder, Inc. All rights reserved.
*/

using MongoDB.Bson.Serialization.Attributes;

namespace Barton.DAL.Entities
{
    /// <summary>
    /// An entity class that represents the tag.
    /// </summary>
    ///
    /// <remarks>
    /// <para>
    /// </para>
    /// </remarks>
    /// 
    /// <author>TCSCODER</author>
    /// <version>1.0</version>
    /// <copyright>Copyright (c) 2017, TopCoder, Inc. All rights reserved.</copyright>
    [BsonIgnoreExtraElements]
    public class Tag: IdentifiableEntity
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="Tag"/> class.
        /// </summary>
        public Tag()
        {

        }

        /// <summary>
        /// Gets or sets the text.
        /// </summary>
        [BsonElement("text")]
        public string Text { get; set; }
    }
}