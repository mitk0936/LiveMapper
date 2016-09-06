'use strict';
this.Mapper = this.Mapper || {};

// should not be instatiated directly
Mapper.baseMapObject = Backbone.Model.extend({
	initialize: function () {
		if ( !(this.get("map") instanceof Mapper.Map) ) {
			throw "Every map object must receive a reference to the parent map";
		}
	},
	getLabel: function () {
		return {
			'label': this.get('label')
		}
	},
	setLabel: function (controlData) {
		var jsonStateBefore = this.toJSON(),
			self = this;

		this.set('label', controlData.label);

		Mapper.actions.addAction(new Mapper.changeItemStateAction({
			'target': self,
			'jsonStateBefore': jsonStateBefore,
			'jsonStateAfter': self.toJSON(),
			'refreshPosition': false
		}));
	}
});