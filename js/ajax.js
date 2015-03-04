var ajax = function(url, method, data){
	this.url = url;
	this.method = method ? method.toUpperCase() : '';
	this.data = data;

	urlify_data = function(data, prefix){
		var ret = '';

		if(typeof data == 'object'){
			var str = [];
			for(var p in data) {
				if (data.hasOwnProperty(p)) {
					var k = prefix ? prefix + "[" + p + "]" : p,
						v = data[p];
					str.push(typeof v == "object" ?
						urlify_data(v, k) :
						encodeURIComponent(k) + "=" + encodeURIComponent(v));
				}
			}
			return str.join("&").replace(/%20/g, '+');
		}else{
			ret = data;
		}

		return ret;
	};

	return new Promise(function(success, fail){
		var xmlhttp = new XMLHttpRequest(),
			method = (this.method != 'GET' && this.method != 'POST') ? 'GET' : this.method,
			data = (!this.data) ? '' : this.data;

		xmlhttp.open(method, this.url, true);

		xmlhttp.onreadystatechange = function(){
			if(xmlhttp.readyState === 4){
				success(xmlhttp);
			}else{
				fail(xmlhttp);
			}
		};

		xmlhttp.onerror = function(){
			fail(xmlhttp);
		};

		xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");

		xmlhttp.send(urlify_data(data));
	});
};
