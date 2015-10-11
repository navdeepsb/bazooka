// IMPORT ALL THE DEPENDENCIES
// =============================================================
var ObjectId = require( "mongoose" ).Types.ObjectId;


// Export the hash containing the utility functions:
module.exports = function( mModel ) {
	return {

		/**
		 * @desc Returns the model definition
		 *
		 * NOTE: Only those attrs are returned which have a
		 *       default value.
		 */
		getDefaultModel: function() {
			var model = new mModel();
			delete model._id;
			return model;
		},

		/**
		 * @desc Returns promise for finding a doc
		 */
		getOne: function( query, selectClause ) {
			return mModel.findOne( query ).select( selectClause ).exec();
		},

		/**
		 * @desc Returns promise for finding docs
		 */
		getAll: function( query, selectClause ) {
			return mModel.find( query ).select( selectClause ).exec();
		},

		/**
		 * @desc Returns promise for deleting a doc
		 */
		delete: function( query ) {
			return mModel.remove( query ).exec();
		},

		/**
		 * @desc Returns promise for upserting a doc
		 *
		 * NOTE: If `query` doesn't have an _id field then
		 *       this function will insert the `doc`.
		 */
		upsert: function( query, doc ) {
			var opts = {
				new    : true, // will return the updated doc in the cb
				upsert : true  // update if exists, else insert
			};

			// Assign an ObjectId if it doesn't exit:
			// This is safe because the newly generated id will not match
			// any existing ids and consequently, the object will get
			// inserted/created as expected.
			if( !query._id ) {
				query._id = ObjectId();
			}

			return mModel.findOneAndUpdate( query, doc, opts ).exec();
		}
	};
};