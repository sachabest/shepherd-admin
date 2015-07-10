$(document).ready(function() {

	console.log('docready');

	var rows = [$('#row0')];

	var splitString = function(input) {
		var arr = input.replace(/^\s+|\s+$/g,"").split(/\s*,\s*/);
		if (arr.length > 0) {
			return arr;
		}
		else return [input];
	};
	// TODO : finish
	var submitFunc = function() {
		// Vincent look here
		var fullObjects = [];
		for (var i = 0; i < rows.length; i++) {
			if (rows[i] == null) {
				continue;
			} else {
				var finalObject = {};
				var typeIdentifier = rows[i].find('#dataInputType' + String(i)).val();
				var firstObj = rows[i].find('#first' + String(i)).val();
				var secondObj = rows[i].find('#second' + String(i)).val();
				var thirdObj = rows[i].find('#third' + String(i)).val();
				var fourthObj = rows[i].find('#fourth' + String(i)).val();
				if (typeIdentifier === 'Complaint') {
					var diagnosisArr = splitString(thirdObj);
					for (var i = 0; i < diagnosisArr.length; i++) {
						var object = {};
						object.complaint = {category: firstObj, name: secondObj, diagnosis: diagnosisArr[i]};
						fullObjects.push(object);
					}
					// finalObject.complaint = {category: firstObj, name: secondObj, diagnosis: diagnosisArr};
				} else if (typeIdentifier === 'Treatment') {
					var pills = splitString(fourthObj);
					for (var i = 0; i < pills.length; i++) {
						var object = {};
						object.treatment = {category: firstObj, name: secondObj, diagnosis: thirdObj, prescription: pills[i]};
						fullObjects.push(object);
					}
					// finalObject.treatment = {category: firstObj, name: secondObj, diagnosis: thirdObj, prescription: pills};
				} else if (typeIdentifier === 'Diagnosis') {
					finalObject.diagnosis = {category: firstObj, name: secondObj, complaint: thirdObj};
				} else if (typeIdentifier === 'Test') {
					finalObject.test = {category: firstObj, name: secondObj, complaint: thirdObj, price: fourthObj};
				} else if (typeIdentifier === 'Prescription') {
					finalObject.prescription = {amount: firstObj, price: secondObj, unit: thirdObj, treatment: fourthObj};
				}
				if (!$.isEmptyObject(finalObject)) {
					fullObjects.push(finalObject);
				}
			}
		}
		// console.log(fullObjects);
		$.post('/manualUpload', {fullObjects}).done(function(data){
			// console.log(data);
			window.location.href='/confirmScreen';
		});
		// now fullObjects is done
	};

	$('#submit-button').click(function() {
		console.log('submitting');
		submitFunc();
	});

	var minusButton = function(index) {
		var rowDiv = $('#minus' + index).parent().parent().closest('div');
		rowDiv.remove();
		rows[Number(index)] = null;
	};

	var changeFunction = function(index) {
		var rowSelf = rows[index].find('select');
		var first = $("label[for='" + 'first' + index + "']");
		var firstInput = $('input[id="first' + index + '"]');
		var secondInput = $('input[id="second' + index + '"]');
		var thirdInput = $('input[id="third' + index + '"]');
		var fourthInput = $('input[id="fourth' + index + '"]');
		var second = $("label[for='" + 'second' + index + "']");
		var third = $("label[for='" + 'third' + index + "']");
		var fourth = $("label[for='" + 'fourth' + index + "']");
		first.show();
		second.show();
		third.show();
		fourth.show();
		firstInput.show();
		secondInput.show();
		thirdInput.show();
		fourthInput.show();
		if (rowSelf.val() === 'Complaint') {
			first.text('Category');
			second.text('Name');
			third.text('Diagnoses ("," split)');
			fourth.hide();
			fourthInput.hide();
		} else if (rowSelf.val() === 'Diagnosis') {
			first.text('Category');
			second.text('Name');
			third.text('Complaint');
			fourth.hide();
			fourthInput.hide();
		} else if (rowSelf.val() === 'Treatment') {
			first.text('Category');
			second.text('Name');
			third.text('Diagnosis');
			fourth.text('Dosages');
		} else if (rowSelf.val() === 'Prescription') {
			first.text('Amount');
			second.text('Price');
			third.text('Unit')
			fourth.text('Treatment')
		} else if (rowSelf.val() === 'Test') {
			first.text('Category');
			second.text('Name');
			third.text('Complaint');
			fourth.text('Price');
		}
	};

	$('.plus-button').click(function() {
		var rowDiv = rows[0];
		var newDiv = rowDiv.clone();
		newDiv.attr('id', 'row' + rows.length);
		var strIndex = String(rows.length);
		var prevStrIndex = String(0);
		var switchObj = newDiv.find('#dataInputType' + prevStrIndex);
		switchObj.attr('id', 'dataInputType' + strIndex);
		newDiv.find('#first' + prevStrIndex).attr('id', 'first' + strIndex);
		newDiv.find('#second' + prevStrIndex).attr('id', 'second' + strIndex);
		newDiv.find('#third' + prevStrIndex).attr('id', 'third' + strIndex);
		newDiv.find('#fourth' + prevStrIndex).attr('id', 'fourth' + strIndex);
		newDiv.find("label[for='" + 'first' + prevStrIndex + "']").attr('for', 'first' + strIndex);
		newDiv.find("label[for='" + 'second' + prevStrIndex + "']").attr('for', 'second' + strIndex);
		newDiv.find("label[for='" + 'third' + prevStrIndex + "']").attr('for', 'third' + strIndex);
		newDiv.find("label[for='" + 'fourth' + prevStrIndex + "']").attr('for', 'fourth' + strIndex);
		newDiv.find('#minus' + prevStrIndex).attr('id', 'minus' + strIndex);
		newDiv.find('#minus' + strIndex).click(function() {
			minusButton(strIndex);
		});
		switchObj.change(function() {
			changeFunction(strIndex);
		});
		rowDiv.parent().append(newDiv);
		rows.push(newDiv);
	});

	$('#dataInputType0').change(function() {
		changeFunction('0');
	});
	
	$('#dataInputType0').val('Complaint');
	$('#dataInputType0').change();
});