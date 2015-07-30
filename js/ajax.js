var ajax = function(settings){
	var xmlhttp = new XMLHttpRequest(),
		settings = settings || {},
		url = settings.url || '',
		method = settings.method || '',
		method = method.toUpperCase(),
		method = (method != 'GET' && method != 'POST') ? 'GET' : method,
		data = settings.data || '',
		success = settings.success || function(){},
		fail = settings.fail || function(){};

	var urlify_data = function(data, prefix){
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

	xmlhttp.open(method, url, true);

	xmlhttp.onreadystatechange = function(){
		if(xmlhttp.readyState === 4){
			if(xmlhttp.status === 200){
				success(xmlhttp);
			}else{
				fail(xmlhttp);
			}
		}
	};

	xmlhttp.onerror = function(){
		fail(xmlhttp);
	};

	xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");

	xmlhttp.send(urlify_data(data));
};
