'use strict';


exports = module.exports = function(params) {

    let mongoose = params.mongoose;

	let invitationSchema = new mongoose.Schema({
		email: { type: String, unique: true, required: true },
        emailToken: { type: String, unique: true, required: true },
		timeCreated: { type: Date, default: Date.now },
        department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', index: true },
        done: { type: Boolean, default: false }
	});



	invitationSchema.set('autoIndex', params.autoIndex);

	params.db.model('Invitation', invitationSchema);

};
