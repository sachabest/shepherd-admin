'use strict';

var sampleData = [
	// 1 item
	// all values are strings
	{
		complaint: {
			category:'some category',
			name: 'some name',
			diagnosis: 'name of diagnosis linked'
		},
		test: {
			category: 'some category',
			name: 'some name',
			price: 'some number'
		},
		diagnosis: {
			category: 'some category',
			name: 'some name',
			complaint: 'name of complaint linked '
		},
		prescription: {
			amount: 'some amount',
			unit: 'some unit',
			price: 'some price',
			treatment: 'name of treatment linked'
		},
		treatment: {
			category: 'some category',
			name: 'some name',
			price: 'some price',
			diagnosis: 'name of diagnosis linked',
		}
	}
];