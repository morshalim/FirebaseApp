var PropertySearchController = function(config) {
	
	this.config = {
		debug: false,

		container: 'propertySearchWidgetCntr',
		propertyNameId: 'propName',
		countryId: 'propertyCountry',
		countryDataSource: propertySearchHost+'/properties/search/distinct/Addresses.Address.Country',
		countrySorting: 'asc',
		countryDefault: 'US', // default to US
		stateId: 'state',
		stateDataSource: propertySearchHost+'/properties/search/distinct/Addresses.Address.State',
		stateSorting: 'asc',
		stateDefault: null,
		meetingSpaceId: 'space',
		meetingSpaceDataSource: [ { label: 'All', value: '' }, { label: 'Yes', value: '1' }, { label: 'No', value: '' } ],
		meetingSpaceSorting: null,
		minimumRoomsId: 'minRooms',
		brandId: 'brand',
		brandDataSource: propertySearchHost+'/properties/search/distinct/Brand',
		brandSorting: 'asc',
		brandDefault: null,
		regionId: 'region',
		regionDataSource: propertySearchHost+'/properties/search/distinct/Division',
		regionSorting: 'asc',
		regionDefault: 'NAD', // default to North America
		maximumSpaceId: 'maxSpace',
		cartPreoperty : [],
		cartItems : [],
		searchResults: propertySearchHost+'/properties/search?viewName=basic',
		propertySearchResults:'propertySearchResults',
		cartResult:'cartResult',
		searchResultsDiv :'searchResultsDiv',
		cartResultsDiv : 'cartResultsDiv',
		lang: {
			desc: 'Enter the name of a property to start searching.',
			btnSearch: 'Search',
			resultsCount: '{count} Search Results Found',
			propertyName: 'Property',
			propertyNamePlaceHolder: 'Enter Property Search Criteria',
			country: 'Country',
			state: 'State/Province',
			meetingSpace: 'Meeting Space',
			minimumRooms: 'Minimum Guest Rooms',
			minimumRoomsPlaceHolder: 'No. of Rooms Required',
			brand: 'Brand',
			region: 'Region',
			maximumSpace: 'Largest Space',
			maximumSpacePlaceHolder: 'Number of People',
			srtProperty: 'Property',
			srtBrand: 'Brand',
			srtCountry: 'Country',
			srtGuestRooms: 'Guest Rooms',
			srtMeetingRooms: 'Meeting Rooms',
			srtLargestSpace: 'Largest Space',
			srtLargestSpaceFormat: '{sqft} sq ft ({sqm} sq.m)'
		}
	};
	
	this.init = function() {

		$.extend(true, this.config, config);

		this.searchWidget = new SearchController({
			propertySearchWidget: this,
			container: this.config,
			params: {
				criterias: [
					{
						type: 'text', id: this.config.propertyNameId, label: this.config.lang.propertyName, placeHolder: this.config.lang.propertyNamePlaceHolder, classNames: 'col-sm-12 col-xs-12'
					},
					{
						type: 'select', id: this.config.countryId, label: this.config.lang.country, classNames: 'col-md-3 col-sm-6 col-xs-12', sorting: this.config.countrySorting, datasource: this.config.countryDataSource,
						postProcessDS: function(ctx) {

							var processedData = [];

							for(var i=0; i<ctx.data.length; i++) {

								var option = ctx.data[i]
																		
								processedData.push({ value: option.Code, label: option.Name });
							}

							return processedData;
						},
						postRenderDS: function(ctx) {

							if(ctx.self.config.propertySearchWidget.config.countryDefault != null)
								$('#'+ctx.self.config.propertySearchWidget.config.countryId).val(ctx.self.config.propertySearchWidget.config.countryDefault);
						}
					},
					{
						type: 'select', id: this.config.stateId, label: this.config.lang.state, classNames: 'col-md-3 col-sm-6 col-xs-12', sorting: this.config.stateSorting, datasource: this.config.stateDataSource,
						postProcessDS: function(ctx) {

							var processedData = [];

							for(var i=0; i<ctx.data.length; i++) {

								var option = ctx.data[i]
																		
								processedData.push({ value: option.Code, label: option.Name });
							}

							return processedData;
						},
						postRenderDS: function(ctx) {

							if(ctx.self.config.propertySearchWidget.config.stateDefault != null)
								$('#'+ctx.self.config.propertySearchWidget.config.stateId).val(ctx.self.config.propertySearchWidget.config.stateDefault);
						}
					},
					{
						type: 'select', id: this.config.meetingSpaceId, label: this.config.lang.meetingSpace, classNames: 'col-md-3 col-sm-6 col-xs-12', sorting: this.config.meetingSpaceSorting, options: this.config.meetingSpaceDataSource
					},
					{
						type: 'text', id: this.config.minimumRoomsId, label: this.config.lang.minimumRooms, placeHolder: this.config.lang.minimumRoomsPlaceHolder, classNames: 'col-md-3 col-sm-6 col-xs-12'
					},
					{
						type: 'select', id: this.config.brandId, label: this.config.lang.brand, classNames: 'col-md-3 col-sm-6 col-xs-12', sorting: this.config.brandSorting, datasource: this.config.brandDataSource,
						postProcessDS: function(ctx) {

							var processedData = [];

							for(var i=0; i<ctx.data.length; i++) {

								var option = ctx.data[i]
																		
								processedData.push({ value: option.Code, label: option.Name });
							}

							return processedData;
						},
						postRenderDS: function(ctx) {

							if(ctx.self.config.propertySearchWidget.config.brandDefault != null)
								$('#'+ctx.self.config.propertySearchWidget.config.brandId).val(ctx.self.config.propertySearchWidget.config.brandDefault);
						}
					},
					{
						type: 'select', id: this.config.regionId, label: this.config.lang.region, classNames: 'col-md-3 col-sm-6 col-xs-12', sorting: this.config.regionSorting, datasource: this.config.regionDataSource,
						postProcessDS: function(ctx) {

							var processedData = [];

							for(var i=0; i<ctx.data.length; i++) {

								var option = ctx.data[i]
								
								if(option.DivisionCode != null)									
									processedData.push({ value: option.DivisionCode, label: option.DivisionName });
							}

							return processedData;
						},
						postRenderDS: function(ctx) {

							if(ctx.self.config.propertySearchWidget.config.regionDefault != null)
								$('#'+ctx.self.config.propertySearchWidget.config.regionId).val(ctx.self.config.propertySearchWidget.config.regionDefault);
						}
					},
					{
						type: 'text', id: this.config.maximumSpaceId, label: this.config.lang.maximumSpace, placeHolder: this.config.lang.maximumSpacePlaceHolder, classNames: 'col-md-3 col-sm-6 col-xs-12'
					}
				],
				labelAlignment: 'top'
			},
			lang: {
				desc: this.config.lang.desc,
				btnSearch: this.config.lang.btnSearch,
				resultsCount: this.config.lang.resultsCount
			},
			searchResults: this.config.searchResults,
			searchResultsColumns: [
				{ title: '', targets: 0, render: function(obj, type, row, meta) {

						return '<label class="position-relative center"><input type="checkbox" rel="propSearchCB" propId="' + obj + '" propName="' + row[1] + '" class="ace" /><span class="lbl"></span></label>';
					}
				},
				{ title: this.config.lang.srtProperty, targets: 1 },
				{ title: this.config.lang.srtBrand, targets: 2 },
				{ title: this.config.lang.srtCountry, targets: 3 },
				{ title: this.config.lang.srtGuestRooms, targets: 4 },
				{ title: this.config.lang.srtMeetingRooms, targets: 5 },
				{ title: this.config.lang.srtLargestSpace, targets: 6, self: this, render: function(obj, type, row, meta) {
						
						var self = meta.settings.oInit.aoColumnDefs[meta.col].self;
						var sqft = '';
						
						if(obj != null && obj != '')
							sqft = parseInt(obj / 0.09290304);

						return ((obj != null && obj != '') ? self.config.lang.srtLargestSpaceFormat.replace('{sqft}', sqft).replace('{sqm}', obj) : '');
					}
				}
			],
			transformCriteria: function(ctx) {

				if(ctx.self.config.debug) console.log(ctx);
				
				var propertyName = $('#'+ctx.self.config.propertySearchWidget.config.propertyNameId);
				var country = $('#'+ctx.self.config.propertySearchWidget.config.countryId);
				var state = $('#'+ctx.self.config.propertySearchWidget.config.stateId);
				var meetingSpace = $('#'+ctx.self.config.propertySearchWidget.config.meetingSpaceId);
				var minimumRooms = $('#'+ctx.self.config.propertySearchWidget.config.minimumRoomsId);
				var brand = $('#'+ctx.self.config.propertySearchWidget.config.brandId);
				var region = $('#'+ctx.self.config.propertySearchWidget.config.regionId);
				var maximumSpace = $('#'+ctx.self.config.propertySearchWidget.config.maximumSpaceId);

				var andParams = [{ key: 'PropertySummary.Name', value: propertyName.val(), operator: 'LIKE' }];
				if(country.is(':visible') && country.val() != '')
					andParams.push( { key: 'Addresses.Address.Country.Code', value: country.val(), operator: 'EQ' });
				if(region.is(':visible') && region.val() != '')
					andParams.push( { key: 'Division.DivisionCode', value: region.val(), operator: 'EQ' });
				if(brand.is(':visible') && brand.val() != '')
					andParams.push({ key: 'Brand.Code', value: brand.val(), operator: 'EQ' });
				if(state.is(':visible') && state.val() != '' && state.val()!='All')
					andParams.push({ key: 'Addresses.Address.Country.State', value: state.val(), operator: 'EQ' });
				
				if(meetingSpace.val() != '')
					andParams.push({ key: 'PropertySummary.TotalNumberOfMeetingSpaces', value: meetingSpace.val(), operator: 'GTE' });

				if(minimumRooms.val() != '')
					andParams.push({ key: 'PropertySummary.NumRooms', value: minimumRooms.val(), operator: 'GTE' });

				if(maximumSpace.val() != '')
					andParams.push({ key: 'PropertySummary.LargestMeetingSpaceCapacity', value: maximumSpace.val(), operator: 'GTE' });

				return {
					andParams: andParams,
					orParams: []
				};
			},
			transformSearchResults: function(ctx) {

				var data = [];

				if(ctx.data != null && ctx.data.content != null) {

					for(var i=0; i<ctx.data.content.length; i++) {

						var elem = ctx.data.content[i];

						if(elem != null) {

							var record = [];
							var id = '';
							var property = '';
							var brand = '';
							var country = '';
							var guestRooms = '';
							var meetingRooms = '';
							var largestSpace = '';

							if(elem.id != null) id = elem.id;
							if(elem.propertySummary != null && elem.propertySummary.name != null) property = elem.propertySummary.name;
							if(elem.brand != null && elem.brand.name != null) brand = elem.brand.name;
							if(elem.addresses != null && elem.addresses.address && elem.addresses.address[0] != null && elem.addresses.address[0].country != null) country = elem.addresses.address[0].country.name;
							if(elem.propertySummary != null && elem.propertySummary.numRooms != null) guestRooms = elem.propertySummary.numRooms;
							if(elem.propertySummary != null && elem.propertySummary.totalNumberOfMeetingSpaces != null) meetingRooms = elem.propertySummary.totalNumberOfMeetingSpaces;
							if(elem.propertySummary != null && elem.propertySummary.largestMeetingSpaceCapacity != null) largestSpace = elem.propertySummary.largestMeetingSpaceCapacity;

							record.push(id);
							record.push(property);
							record.push(brand);
							record.push(country);
							record.push(guestRooms);
							record.push(meetingRooms);
							record.push(largestSpace);

							data.push(record);
						}
					}
				}

				return data;
			}
		}).init();
		
		return this;
	};
	
	this.render = function() {
		
		this.searchWidget.render();
		
		return this;
	};	

	/*
	 * HELPERS
	 */	
	this.getSelectedResults = function() {

		return this.searchWidget.getSelectedResults();
	};
};