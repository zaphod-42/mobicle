(function($) {
	$(document).ready(function() {
		console.log("document ready")
		var accessToken = getUrlParameter('access_token');
		var requestURL = 'https://api.particle.io/v1/devices?access_token=' + accessToken;
		var listView = $('<ul data-role="listview" id="deviceListView"></ul>').appendTo('body');
		$.get(requestURL, function(e) {
		}).done(function(devices) {
			$.each(devices, function() {
				var device = this;
				var name = device.name == null ? "Unnamed Device" : device.name;
				var li = $("<li></li>");
				li.appendTo("#deviceListView").attr("id", device.id);
				if (device.connected == true) {
					var hrefLink = '<a href= device.html?deviceid=' + device.id + '&access_token=' + accessToken + '>' + name + '</a>';
					li.append(hrefLink);
				} else {
					//Device not connected
					li.text(name);
				}
				listView.listview().listview('refresh');
			});
			window.setInterval(function() {
				reloadDevices(requestURL, accessToken);
			}, 2000);
		});
		listView.listview().listview('refresh');
	});
})(jQuery);

function reloadDevices(url, accessToken) {
	$.get(url, function() {
	}).done(function(devices) {
		$('#statusLabel').text("Device List Loaded");
		//For Each loop to load each device's information
		$.each(devices, function() {
			var device = this;
			if (device.connected == true) {
				if($('#' + device.id + ' a').length){
					$('#' + device.id + ' a').attr('href', 'device.html?deviceid=' + device.id + '&access_token=' + accessToken);
				}
				else{
					var listItem = $('#' + device.id);
					var hrefLink = $('<a href= device.html?deviceid=' + device.id + '&access_token=' + accessToken + '>'+'</a>');
					listItem.text(device.name);
					listItem.append(hrefLink);
				}
			} else {
				//Device not connected so we really dont need to do anything but display it to the user.
				$('#' + device.id).empty();
				$('#' + device.id).text(device.name);
			}
			$('#deviceListView').listview().listview('refresh');

		});
	}).fail(function() {
		$('#statusLabel').text("Error loading Device List");
	});
	$.get(url, function(data) {

	});
}

var getUrlParameter = function getUrlParameter(sParam) {
	var sPageURL = decodeURIComponent(window.location.search.substring(1)),
	    sURLVariables = sPageURL.split('&'),
	    sParameterName,
	    i;

	for ( i = 0; i < sURLVariables.length; i++) {
		sParameterName = sURLVariables[i].split('=');

		if (sParameterName[0] === sParam) {
			return sParameterName[1] === undefined ? true : sParameterName[1];
		}
	}
};
