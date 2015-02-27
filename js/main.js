(function () {
	"use strict";

	var requiredFields = [
		'endpoint',
		'oauth_consumer_key',
		'secret',
		'resource_link_id',
		'resource_link_title',
		'resource_link_description',
		'user_id',
		'roles',
		'lis_person_name_full',
		'lis_person_name_family',
		'lis_person_name_given',
		'lis_person_contact_email_primary',
		'lis_person_sourcedid',
		'context_id',
		'context_title',
		'context_label'
	];

	
	var sidebar = document.getElementById("sidebar");
	document.getElementById("handle").addEventListener("click", function (ev) {
  		var isOpen = sidebar.classList.contains("open");
		if (isOpen) {
			sidebar.classList.remove("open");
		}
		else {
			sidebar.classList.add("open");
		}
	});


	var template = $("#form-field-template").html();
	var fieldHtml = requiredFields.map(function (f) { // uses native array map.  Won't work in new browsers
		return Mustache.render(template, {field: f });
	}).join('');


	$("body").on("blur", "input", function (ev) {
		var input = $(ev.currentTarget);
		var name = input.attr("name");
		var val = input.val();
		localStorage.setItem(name, val);
	});

	$("#ls-load").on('click', function (ev) {
		ev.preventDefault();
		Object.keys(localStorage).forEach(function (k) {
			$("form input[name='" + k +"']").val(localStorage.getItem(k));
		});
	});


	var form  = $("#form");
	form.prepend(fieldHtml);
	form.on('submit', function (ev) {
		ev.preventDefault();
		var formValues = $(this).serializeObject();
		var key = {
			consumerSecret: formValues['secret']
		};
		var message = {
			method: 'POST',
			action: formValues['endpoint']
		};

		delete formValues['secret'];
		delete formValues['endpoint'];
		var formString = Object.keys(formValues).map(function(k) { return k + '=' + formValues[k]; }).join('&');
		log("Foliotek's: " + formString);
		log("Foliotek's: ", message);
		message.parameters = OAuth.decodeForm(formString);

		OAuth.SignatureMethod.sign(message, key);
		log("normalizedParameters", OAuth.SignatureMethod.normalizeParameters(message.parameters));
		log("signatureBaseString" , OAuth.SignatureMethod.getBaseString(message));
		log("signature"           , OAuth.getParameter(message.parameters, "oauth_signature"));
		log("authorizationHeader" , OAuth.getAuthorizationHeader("", message.parameters));
	});
})();



// function sign(form) {
//     var accessor = { consumerSecret: form.consumerSecret.value
//                    , tokenSecret   : form.tokenSecret.value};
//     var message = { method: form.httpMethod.value
//                   , action: form.URL.value
//                   , parameters: OAuth.decodeForm(form.parameters.value)
//                   };
//     for (var e = 0; e < form.elements.length; ++e) {
//         var input = form.elements[e];
//         if (input.name != null && input.name.substring(0, 6) == "oauth_"
//             && input.value != null && input.value != ""
//             && (!(input.type == "checkbox" || input.type == "radio") || input.checked))
//         {
//             message.parameters.push([input.name, input.value]);
//         }
//     }
//     OAuth.SignatureMethod.sign(message, accessor);
//     showText("normalizedParameters", OAuth.SignatureMethod.normalizeParameters(message.parameters));
//     showText("signatureBaseString" , OAuth.SignatureMethod.getBaseString(message));
//     showText("signature"           , OAuth.getParameter(message.parameters, "oauth_signature"));
//     showText("authorizationHeader" , OAuth.getAuthorizationHeader("", message.parameters));
//     return false;
// }
// function showText(elementId, text) {
//     var child = document.createTextNode(text);
//     var element = document.getElementById(elementId);
//     if (element.hasChildNodes()) {
//         element.replaceChild(child, element.firstChild);
//     } else {
//         element.appendChild(child);
//     }
// }
// function freshTimestamp() {
//     document.request.oauth_timestamp.value = OAuth.timestamp();
// }
// function freshNonce() {
//     document.request.oauth_nonce.value = OAuth.nonce(11);
// }
