$(document).ready(function() {

	console.log('docready');

	var rows = [$('#row0')];

	// TODO : finish
	var submit = function() {
		// Vincent look here
		var fullObjects = [];
		for (var i = 0; i < rows.length; i++) {
			if (rows[i] == null) {
				continue;
			} else {
				var typeIdentifier = rows[i].find('#dataInputType' + String(index)).val();
				var firstObj = rows[i].find('#first' + String(index)).text();
				var secondObj = rows[i].find('#second' + String(index)).text();
				var thirdObj = rows[i].find('#third' + String(index)).text();
				var fourthObj = rows[i].find('#fourth' + String(index)).text();
				if (typeIdentifier === 'Complaint') {
					// do something here
				} else if (typeIdentifier === 'Treatment') {
					//
				} else if (typeIdentifier === 'Diagnosis') {
					// 
				} else if (typeIdentifier === 'Test') {

				} else if (typeIdentifier === 'Prescription') {
					//
				}
			}
		}
	};

	var minusButton = function(index) {
		var rowDiv = $('#minus' + index).parent().parent().closest('div');
		rowDiv.remove();
		rows[Number(index)] = null;
	};

	var changeFunction = function(index) {
		console.log('changing' + index);
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
			third.text('Diagnosis');
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
			third.text('Complaint');
			fourth.text('Price');
		} else if (rowSelf.val() === 'Prescription') {
			first.text('Amount');
			second.text('Price');
			third.text('Unit')
			fourth.hide();
			fourthInput.hide();
		} else if (rowSelf.val() === 'Test') {
			first.text('Amount');
			second.hide();
			secondInput.hide();
			third.hide();
			thirdInput.hide();
			fourth.hide();
			fourthInput.hide();
		}
	};

	$('.plus-button').click(function() {
		var rowDiv = rows[rows.length - 1];
		console.log(rowDiv);
		var newDiv = rowDiv.clone();
		newDiv.attr('id', 'row' + rows.length);
		var strIndex = String(rows.length);
		var prevStrIndex = String(Number(strIndex) - 1);
		var switchObj = newDiv.find('#dataInputType' + prevStrIndex);
		switchObj.attr('id', 'dataInputType' + strIndex);
		console.log(newDiv.find('#first' + strIndex));
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
		console.log(rows);
	});

	$('#dataInputType0').change(function() {
		changeFunction('0');
	});
	
	$('#dataInputType0').val('Complaint');
	$('#dataInputType0').change();
});