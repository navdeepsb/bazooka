module.exports = function( mModel ) {
	return {
		getDefaultModel: function() {
			var model = new mModel();
			delete model._id;
			return model;
		},

		getOne: function( query, selectClause ) {
			return mModel.findOne( query ).select( selectClause ).exec();
		},

		getAll: function( query, selectClause ) {
			return mModel.find( query ).select( selectClause ).exec();
		},

		delete: function( query ) {
			return mModel.remove( query ).exec();
		},

		upsert: function( query, doc ) {
			return mModel.findOneAndUpdate( query, doc, { upsert: true } ).exec();
		}
	};
};