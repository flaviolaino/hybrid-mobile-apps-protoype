var App = {

	info: {},

	alert: window.alert.bind(),

	_init: function(){
		Date.prototype.getFullDate = function(){
			var yyyy = this.getFullYear().toString(),
				mm = (this.getMonth()+1).toString(),
				dd = this.getDate().toString(),
				hh = this.getHours().toString(),
				ii = this.getMinutes().toString(),
				ss = this.getSeconds().toString();

			return yyyy + '-' + (mm[1] ? mm : "0" + mm[0]) + '-' + (dd[1] ? dd : "0" + dd[0])
				+ ' ' + (hh[1] ? hh : "0" + hh[0]) + ':' + (ii[1] ? ii : "0" + ii[0]) + ':' + (ss[1] ? ss : "0" + ss[0]);
		};
		
		return this;
	},

	install: function(){},

	update: function(){},

	on: function(eventName, eventHandler, element){
		element = this._validElements(element);

		for(var i = 0; i < element.length; i++){
			element[i].addEventListener(eventName, eventHandler, false);
		}
	},

	_validElements: function(elemenet){
		element = element || {};

		if(!element.length){
			var element_ori = element,
				element = [];

			element.push(element_ori);
		}

		return element;
	}

	collection_to_array: function(collection){
		return Array.prototype.slice.call(collection);
	}

};

