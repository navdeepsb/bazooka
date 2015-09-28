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

		getAll: function( selectClause ) {
			return mModel.find( {} ).select( selectClause ).exec();
		}
	};
};