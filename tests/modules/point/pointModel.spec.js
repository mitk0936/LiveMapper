describe("Test point model", function () {
	var sandbox;

	beforeEach(function () {
	    sandbox = sinon.sandbox.create();
	});

	afterEach(function () {
	    sandbox.restore();
	});

	it("should create new point. with default values", function () {
		var p = new Mapper.point();

		expect(p.get('lat')).to.be.defined;
		expect(p.get('lng')).to.be.defined;
		expect(p.get('latLng')).to.not.equal(null);
	});

	it('should set icon properly', function () {
		var newIcons = Utils.configStyles.icons['selectedIcon'],
			p = new Mapper.point(),
			callbacks = {
				changeIconCallback: function () {}
			};

		sandbox.spy(callbacks, 'changeIconCallback');

		p.on('change:icon', function (ev) {
			callbacks.changeIconCallback(ev);
		});

		p.setIcon(newIcons);
		expect(p.get('icon')).to.equal(newIcons);

		expect(callbacks.changeIconCallback).to.be.called.once;
	});

	it('should properly refresh point type and icon of start/end points', function () {
		var p = new Mapper.point();
		// Case 1
		p.set({
			isStartPoint: false,
			isEndPoint: false,
			isHelper: true
		});

		p.refreshPointType();
		// not start/end point can be a helper point
		expect(p.get('isHelper')).to.equal(true);

		// Case 2
		p.set({
			isStartPoint: true,
			isEndPoint: false,
			isHelper: true
		});

		sandbox.spy(p, 'setIcon');

		p.refreshPointType();

		expect(p.setIcon).to.be.called.once; // isHelper should be set silentlys
		// end point cannot be a helper point
		expect(p.get('isHelper')).to.equal(false);
	});

	it('should set proper icon, depending on the point type', function () {
		var points = {
			'startPoint': new Mapper.point({
				isStartPoint: true,
				isEndPoint: true,
				isHelper: false,
				isSelected: false,
				single: false
			}),
			'endPoint': new Mapper.point({
				isStartPoint: false,
				isEndPoint: true,
				isHelper: true,
				isSelected: false,
				single: false
			}),
			'helperPoint': new Mapper.point({
				isStartPoint: false,
				isEndPoint: false,
				isHelper: true,
				isSelected: false,
				single: false
			}),
			'selectedPoint': new Mapper.point({
				isStartPoint: false,
				isEndPoint: false,
				isHelper: false,
				isSelected: true,
				single: true
			}),
			'normalPoint': new Mapper.point({
				isStartPoint: false,
				isEndPoint: false,
				isHelper: false,
				isSelected: false,
				single: false
			})
		};

		for (var key in points) {
			sandbox.spy(points[key], 'setIcon');
			points[key].refreshPointType();
			expect(points[key].setIcon).to.be.called.once;
		}

		expect(points['startPoint'].get('icon')).to.equal(Utils.configStyles.icons['startIcon']);
		expect(points['endPoint'].get('icon')).to.equal(Utils.configStyles.icons['endIcon']);
		expect(points['helperPoint'].get('icon')).to.equal(Utils.configStyles.icons['helperIcon']);
		expect(points['selectedPoint'].get('icon')).to.equal(Utils.configStyles.icons['selectedIcon']);
		expect(points['normalPoint'].get('icon')).to.equal(Utils.configStyles.icons['defaultIcon']);
	});

	describe('testing the user interaction with points', function () {
		it('should select single point when clicked', function () {
			var p = new Mapper.point({
				single: true,
				isSelected: false
			});

			sandbox.spy(Mapper.mapController, 'selectCurrent');
			
			p.select();

			expect(Mapper.mapController.selectCurrent.withArgs(p)).to.be.called.once;
		});

		it('should delete poly-point on confirmation', function () {
			var windowConfirm = confirm,
				confirmYes = function () {
					return true;
				},
				confirmNo = function () {
					return false;
				},
				p = new Mapper.point({
					single: false,
					isSelected: false
				}),
				p2 = new Mapper.point({
					single: false,
					isSelected: false
				});

			// Case 1, deletion is confirmed
			sandbox.spy(p, 'destroy');
			window.confirm = confirmYes;
			p.select();

			expect(p.destroy).to.be.called.once;

			// Case 2, when confirm is canceled
			sandbox.spy(p2, 'destroy');
			window.confirm = confirmNo;
			p2.select();

			expect(p2.destroy).to.be.not.called;
			window.confirm = windowConfirm;
		});
	});

	describe('testing the drag functionality, actions, triggering parent collection events', function () {
		it('should save jsonState on start dragging single point', function () {
			var p = new Mapper.point({
				single: true
			});

			sandbox.spy(p, 'set');
			p.startDragging();

			expect(p.set.withArgs('jsonStateBefore', p.toJSON())).to.be.called.once;
		});

		it('should trigger events to parent collection on startDragging, if point is not single', function () {
			var poly = new Mapper.poly(),
				p = new Mapper.point();

			poly.addPoint(p);

			expect(poly.get('pointsCollection').first()).to.equal(p);
			expect(p.get('single')).to.equal(false);

			sandbox.spy(poly, 'set');
			sandbox.spy(p, 'triggerParentPointDragStart');
			sandbox.spy(p, 'triggerEventParent');

			p.startDragging();

			expect(p.triggerParentPointDragStart).to.be.called.once;
			
			expect(p.triggerEventParent.withArgs("pointDragStart", {
				model: p,
    			changed: true
			})).to.be.called.once;

			expect(poly.set.withArgs('polyJSONBefore', poly.toJSON())).to.be.called.once;
		});

		it('it should create action on point stopDragging, if it is a single point', function () {
			var p = new Mapper.point(),
				layer = new Mapper.pointsLayer();

			layer.add(p); // single point

			sandbox.spy(Mapper.actions, 'addAction');
			sandbox.spy(p, 'toJSON');
			sandbox.spy(p, 'get');

			p.startDragging();

			var finalLatLng = stubSimulateDragging(p);

			p.stopDragging(finalLatLng);

			expect(Mapper.actions.addAction).to.be.called.once;
			expect(p.get.withArgs('jsonStateBefore')).to.be.called.once;
			expect(p.toJSON).to.be.called.once;
		});

		it('should properly trigger events to parent collection on stopDragging, if point is not single', function () {
			var poly = new Mapper.poly(),
				p = new Mapper.point();

			poly.addPoint(p);
			p.set({
				isHelper: true
			});

			sandbox.spy(p, 'triggerParentPointDragFinish');
			sandbox.spy(p, 'triggerEventParent');

			p.startDragging();

			var finalLatLng = stubSimulateDragging(p);

			p.stopDragging(finalLatLng);

			expect(p.triggerParentPointDragFinish).to.be.called.once;
			
			expect(p.triggerEventParent.withArgs("pointDragStop", {
				model: p,
    			changed: true
			})).to.be.called.once;
		});
	});
	
	describe('Testing point.toJSON method', function () {
		it('should store the right values in the toJSON object', function () {
			var p = new Mapper.point(),
				pointTestObject = {
					type: Utils.CONFIG.pointType,
					lat: 42.1235355,
					lng: 23.12342834,
					single: true,
					isHelper: false,
					label: 'test point',
					unknownProp: 'Should not be included in the toJSON object'
				};

			p.set(pointTestObject);

			var jsonResult = p.toJSON();

			expect(jsonResult.unknownProp).to.equal(undefined);
			expect(jsonResult.isHelper).to.equal(pointTestObject.isHelper);
			expect(jsonResult.single).to.equal(pointTestObject.single);
			expect(jsonResult.lng).to.equal(pointTestObject.lng);
			expect(jsonResult.lat).to.equal(pointTestObject.lat);
			expect(jsonResult.type).to.equal(pointTestObject.type);

			p.set('lng', 23.00000000);
			jsonResult = p.toJSON();
			expect(jsonResult.lng).to.equal(23.00000000);
		});
	});

	describe('should properly get and set label of the point', function () {
		it('should test use the getter and setter for label of the object', function () {
			var p = new Mapper.point(),
				testLabel = 'Random text here',
				controlDataObject = {
					'label': testLabel
				};

			// getter and setter are inherited properly
			expect(p.getLabel).to.not.equal(undefined);
			expect(p.setLabel).to.not.equal(undefined);

			sandbox.spy(Mapper.actions, 'addAction');
			sandbox.spy(p, 'set');

			p.setLabel(controlDataObject);

			expect(Mapper.actions.addAction).to.be.called.once;
			expect(p.set.withArgs('label', testLabel)).to.be.called.once;

			expect(p.get('label')).to.equal(testLabel);
		});
	});
});