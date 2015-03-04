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

		Storage.setDB('app');

		var app_info = Storage.select();

		//this['info'] = {};

		this['info']['is_installed'] = app_info['installed'] || 'no';
		this['info']['last_update'] = app_info['last_update'] || 'never';

		return this;
	},

	install: function(){
		return App.Prodotti.import().then(function(res_import){
			if(res_import.trovati > 0){
				App.alert(res_import.trovati + ' prodotti importati');
			}else{
				App.alert('Non ho trovato nessun prodotto');
			}

			Storage.setDB('app');

			Storage.insert({'installed': 'yes'});
			Storage.insert({'last_update': 'never'});

			return this;
		});
	},

	update: function(){
		return App.Prodotti.import().then(function(res_import){
			if(res_import.trovati > 0){
				App.alert(res_import.esistenti + ' prodotti aggiornati, ' + res_import.nuovi + ' prodotti nuovi');
			}else{
				App.alert('Non ho trovato nessun prodotto');
			}

			var d = new Date();

			Storage.setDB('app');

			Storage.setItem('last_update', d.getFullDate());

			return this;
		});
	},

	Prodotti: {
		add: function(data){
			Storage.setDB('prodotti');

			data.id = Date.now();

			Storage.insert(data.code, data);

			return this;
		},

		get: function(code){
			Storage.setDB('prodotti');

			return Storage.select({code: code}).found;
		},

		search: function(filters){
			Storage.setDB('prodotti');

			var found = {},
				filters = filters || {};

			return Storage.select(filters).found;
		},

		import: function(){
			var esistenti = 0,
				nuovi = 0;

			Storage.setDB('prodotti');

			return App.Prodotti.get_repository().then(function(prodotti){
				if(prodotti.length){
					prodotti_storage = Storage.select();

					for(var i in prodotti){
						if(prodotti_storage.hasOwnProperty('code') && prodotti_storage[code] == prodotti[i].code){
							esistenti++;
						}else{
							nuovi++;
						}

						Storage.insert(prodotti[i].code, prodotti[i]);
					}
				}else{
					prodotti = [];
				}

				return { 'trovati': prodotti.length, 'esistenti': esistenti, 'nuovi': nuovi };

				return this;
			});
		},

		get_repository: function(){
			var prodotti;

			return prodotti = new Promise(function(r){
				r([
					{'code':'ABC123', 'name':'Forza10', 'category': 'Cura degli ambienti', 'description':'potente detersivo', 'price':'15.00'}
				]);
			});


			/*return ajax('prodotti.php?do=getall').then(function(xmlhttp){
				if(xmlhttp.status == 200){
					prodotti = JSON.parse(xmlhttp.response);
				}else{
					App.alert('Impossibile connettersi con il server (status ' + status + ')');
				}

				console.log(prodotti);

				return prodotti;
			});*/
		},
	},

	Ordini: {
		add: function(data){
			Storage.setDB('ordini');

			data.id = Date.now();

			Storage.insert(data.id, data);

			ajax('ordini.php?do=add', 'POST', {ordine: data}).then(function(){
				return data.id;
			});
		},

		update: function(data){
			Storage.setDB('ordini');

			Storage.update(data.id, data);

			ajax('ordini.php?do=update', 'POST', {ordine: data});
		},

		get: function(id){
			Storage.setDB('ordini');

			return Storage.select({id: id}).found;
		},

		search: function(filters){
			Storage.setDB('ordini');

			var found = {},
				filters = filters || {};

			return Storage.select(filters).found;
		},
	},

	Punti: {
		get: function(){
			Storage.setDB('punti');

			return Storage.select().found.punteggio;
		},

		update: function(p){
			var punteggio = App.Punti.get(),
				somma = parseInt(punteggio) + parseInt(p);

			Storage.setDB('punti');

			Storage.update('punteggio', somma);

			ajax('punti.php?do=update', 'GET', 'punti=' + somma).then(function(){
				return somma;
			});
		},
	},

	on: function(eventName, eventHandler, element){
		element = this._validElements(element);

		for(var i = 0; i < element.length; i++){
			element[i].addEventListener(eventName, eventHandler, false);
		}
	},

	collection_to_array: function(collection){
		return Array.prototype.slice.call(collection);
	}

};

