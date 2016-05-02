describe("Test point model", function () {
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

		sinon.spy(callbacks, 'changeIconCallback');

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

		sinon.spy(p, 'setIcon');

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
			sinon.spy(points[key], 'setIcon');
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

			sinon.spy(Mapper.mapController, 'selectCurrent');
			
			p.onClicked();

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
			sinon.spy(p, 'destroy');
			window.confirm = confirmYes;
			p.onClicked();

			expect(p.destroy).to.be.called.once;

			// Case 2, when confirm is canceled
			sinon.spy(p2, 'destroy');
			window.confirm = confirmNo;
			p2.onClicked();

			expect(p2.destroy).to.be.not.called;
			window.confirm = windowConfirm;
		});
	});
});