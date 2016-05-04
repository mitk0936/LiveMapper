describe("Test poly model", function () {
	beforeEach(function () {
	    sandbox = sinon.sandbox.create();
	});

	afterEach(function () {
	    sandbox.restore();
	});

	it('should properly initialize the points collection from json object', function () {
		var pointsCollection = stubCreatePointsCollection(5),
			initialPointsCollectionJSON = pointsCollection.toJSON(),
			poly = new Mapper.poly(),
			callbacks = {
				collectionOnAdd: function () {}
			};

		sandbox.spy(callbacks, 'collectionOnAdd');
		sandbox.spy(poly, 'setStartEndPoints');

		poly.get("pointsCollection").on('add', function () {
			callbacks.collectionOnAdd();
		});

		poly.set({
			pointsCollectionJSON: initialPointsCollectionJSON
		});

		poly.initiallyCreatePointsCollection();

		expect(poly.toJSON().pointsCollectionJSON).to.deep.equal(initialPointsCollectionJSON);
		expect(callbacks.collectionOnAdd).to.be.called.once;
		expect(poly.setStartEndPoints).to.be.called.once;

		expect(poly.get('pointsCollection').first().get('isStartPoint')).to.equal(true);
		expect(poly.get('pointsCollection').first().get('isEndPoint')).to.equal(false);
		expect(poly.get('pointsCollection').last().get('isEndPoint')).to.equal(true);
	});

	describe('Test cases for changed points collection', function () {
		var initialPointsCollection,
			poly1,
			poly2,
			updatedCollectionJSON,
			initialPointsCount = 10;

		beforeEach(function () {
			/*	Initially: create points collection
				create poly1
				create another poly with same points collection - poly2 */
			initialPointsCollection = stubCreatePointsCollection(initialPointsCount),
			poly1 = new Mapper.poly({
				pointsCollectionJSON: initialPointsCollection.toJSON()
			}),
			poly2 = new Mapper.poly({
				pointsCollectionJSON: initialPointsCollection.toJSON()
			});
		});

		it('should properly refresh points collection - case with point dragged and a few points added', function () {
			/*	Case 1:
				drag 1 point from poly2 and add some points to it */

			// dragging point at position 4
				var draggedPoint = poly2.get('pointsCollection').at(4);
				draggedPoint.startDragging();
				var finalLatLng = stubSimulateDragging(draggedPoint);
				draggedPoint.stopDragging(finalLatLng);

			// 2 helper points should be added
			expect(poly2.get('pointsCollection').length).equal(initialPointsCount + 2); 

			// adding 2 points
			poly2.addPoint(stubCreatePoint());
			poly2.addPoint(stubCreatePoint());

			updatedCollectionJSON = poly2.toJSON().pointsCollectionJSON;
		});

		it('should properly refresh points collection - case with 2 helper points dragged (same amount of points)', function () {
			/*	Case 2:
				drag 2 points from poly2 */

			// dragging helper point at position 4
				var draggedPoint = poly2.get('pointsCollection').at(4);
				draggedPoint.set({
					isHelper: true
				});
				draggedPoint.startDragging();
				var finalLatLng = stubSimulateDragging(draggedPoint);
				draggedPoint.stopDragging(finalLatLng);

			// dragging helper point at position 7
				draggedPoint = poly2.get('pointsCollection').at(7);
				draggedPoint.set({
					isHelper: true
				});
				draggedPoint.startDragging();
				var finalLatLng = stubSimulateDragging(draggedPoint);
				draggedPoint.stopDragging(finalLatLng);

			// should not be added any helper points
			expect(poly2.get('pointsCollection').length).equal(initialPointsCount);
			updatedCollectionJSON = poly2.toJSON().pointsCollectionJSON;
		});

		it('should properly refresh points collection - case with 2 helper points dragged (same amount of points)', function () {
			/*	Case 3:
				remove 2 points from poly2 */
			poly2.get('pointsCollection').at(4).destroy();
			poly2.get('pointsCollection').at(2).destroy();

			// 2 points should be deleted
			expect(poly2.get('pointsCollection').length).equal(initialPointsCount - 2);
			updatedCollectionJSON = poly2.toJSON().pointsCollectionJSON;
		});

		afterEach(function () {
			/*	get poly2 pointsCollectionJSON and set it to poly1
				trigger refresh to poly1
				expect both poly's to have same pointsCollectionJSON after toJSON() */

			sandbox.spy(poly1, 'refreshPointsCollection');

			poly1.set({
				pointsCollectionJSON: updatedCollectionJSON
			});

			poly1.trigger('refresh');

			expect(poly1.refreshPointsCollection).to.be.called.once;

			expect(poly1.toJSON().pointsCollectionJSON).to.deep.equal(updatedCollectionJSON);
			expect(updatedCollectionJSON).to.not.deep.equal(initialPointsCollection.toJSON());
		});
	});

	describe('Testing functionality for adding points in a poly', function () {
		var initialPointsCollection,
			poly,
			initialPointsCount = 10;

		beforeEach(function () {
			// initally create a poly from generated collection
			initialPointsCollection = stubCreatePointsCollection(initialPointsCount),
			poly = new Mapper.poly({
				pointsCollectionJSON: initialPointsCollection.toJSON()
			});
		});

		it('case1: should add a point without passed index, as last point in the collection', function () {
			var p = stubCreatePoint();

			p.set({
				isHelper: false
			});

			sandbox.spy(Mapper.actions, 'addAction');
			sandbox.spy(poly, 'toJSON');

			poly.addPoint(p);

			expect(poly.get('pointsCollection').indexOf(p)).to.equal(initialPointsCount);
			expect(poly.get('pointsCollection').last()).to.equal(p);

			// the point is not a helper point, so it is expected to be added a new action
			expect(Mapper.actions.addAction).to.be.called.once;
			expect(poly.toJSON).to.be.called.once;
		});

		it('case2: should not be added an action for a helper point ', function () {
			var p = stubCreatePoint(),
				positionToAdd = initialPointsCount - 5;

			p.set({
				isHelper: true
			});

			sandbox.spy(Mapper.actions, 'addAction');
			sandbox.spy(poly, 'toJSON');

			poly.addPoint(p, positionToAdd);

			expect(poly.get('pointsCollection').indexOf(p)).to.equal(positionToAdd);
			expect(poly.get('pointsCollection').at(positionToAdd)).to.equal(p);

			// expect no action for a helper point
			expect(Mapper.actions.addAction).to.not.be.called;
			expect(poly.toJSON).to.be.not.called;
		});
	});

	describe('Test setting start-end points', function () {
		it('should set only 1 start and end point', function () {
			var initialPointsCollection = stubCreatePointsCollection(10);

			_.each(initialPointsCollection.models, function (model) {
				model.set({
					'isStartPoint': true,
					'isEndPoint': true
				});
			});

			poly = new Mapper.poly();

			sinon.spy(poly, 'setStartEndPoints');

			poly.set({
				pointsCollectionJSON: initialPointsCollection.toJSON()
			});

			poly.trigger('refresh');

			expect(poly.setStartEndPoints).to.be.called.once;

			var startPoint = poly.get('pointsCollection').first(),
				endPoint = poly.get('pointsCollection').last(),
				startPoints = poly.get('pointsCollection').where({"isStartPoint": true}),
				endPoints = poly.get('pointsCollection').where({"isEndPoint": true});

			expect(startPoints.length).to.equal(1);
			expect(startPoints[0]).to.equal(startPoint);
			expect(endPoints.length).to.equal(1);
			expect(endPoints[0]).to.equal(endPoint);
		});
	});

	describe('Test adding helper points on dragstop', function () {
		var initialPointsCount,
			initialPointsCollection,
			poly;

		beforeEach(function () {
			initialPointsCount = 6;
			initialPointsCollection = stubCreatePointsCollection(initialPointsCount);
			poly = new Mapper.poly({
				pointsCollectionJSON: initialPointsCollection.toJSON()
			});

			sinon.spy(poly, 'insertHelperPoints');
			sinon.spy(poly, 'createHelperPoint');
		});

		it('should add 2 helper points of stop dragging middle point', function () {
			var pointDraggedPosition = parseInt(initialPointsCount/2),
				prevPointBeforeDragging = poly.get('pointsCollection').at(pointDraggedPosition - 1),
				nextPointBeforeDragging = poly.get('pointsCollection').at(pointDraggedPosition + 1),
				pointDragged = poly.get('pointsCollection').at(pointDraggedPosition);

			pointDragged.startDragging();
			var lastLatLng = stubSimulateDragging(pointDragged);
			pointDragged.stopDragging(lastLatLng);

			expect(poly.insertHelperPoints.withArgs(pointDragged)).to.be.called.once;

			var middlePointBefore = Utils.calcMiddlePoint(
											prevPointBeforeDragging.get("latLng").lat(),
											prevPointBeforeDragging.get("latLng").lng(),
											pointDragged.get('latLng').lat(),
											pointDragged.get('latLng').lng() ),
				positionPointBefore = new google.maps.LatLng(middlePointBefore.lat, middlePointBefore.lng),
				middlePointAfter = Utils.calcMiddlePoint(
										pointDragged.get('latLng').lat(),
										pointDragged.get('latLng').lng(),
										nextPointBeforeDragging.get("latLng").lat(),
										nextPointBeforeDragging.get("latLng").lng() ),
				positionPointAfter = new google.maps.LatLng(middlePointAfter.lat, middlePointAfter.lng),
				addedPointBefore = poly.get('pointsCollection').at(pointDraggedPosition),
				addedPointAfter = poly.get('pointsCollection').at(pointDraggedPosition + 2);

			expect(poly.createHelperPoint.withArgs(middlePointBefore, pointDraggedPosition)).to.be.called.once;
			expect(poly.createHelperPoint.withArgs(middlePointAfter, pointDraggedPosition + 2)).to.be.called.once;

			expect(positionPointBefore.lat()).to.equal(addedPointBefore.get('latLng').lat());
			expect(positionPointBefore.lng()).to.equal(addedPointBefore.get('latLng').lng());

			expect(poly.get('pointsCollection').indexOf(pointDragged)).to.equal(pointDraggedPosition + 1);

			expect(poly.get('pointsCollection').length).to.equal(initialPointsCount + 2)
			expect(positionPointAfter.lat()).to.equal(addedPointAfter.get('latLng').lat());
			expect(positionPointAfter.lng()).to.equal(addedPointAfter.get('latLng').lng());
		});

		it('should add helper only after the point if the point is first in the poly', function () {
			var pointDraggedPosition = 0,
				pointDragged = poly.get('pointsCollection').at(pointDraggedPosition),
				nextPointBeforeDragging = poly.get('pointsCollection').at(pointDraggedPosition + 1);
			
			pointDragged.startDragging();
			var lastLatLng = stubSimulateDragging(pointDragged);
			pointDragged.stopDragging(lastLatLng);

			var middlePointAfter = Utils.calcMiddlePoint(
										pointDragged.get('latLng').lat(),
										pointDragged.get('latLng').lng(),
										nextPointBeforeDragging.get("latLng").lat(),
										nextPointBeforeDragging.get("latLng").lng() ),
				addedPointAfter = poly.get('pointsCollection').at(pointDraggedPosition + 1),
				positionPointAfter = new google.maps.LatLng(middlePointAfter.lat, middlePointAfter.lng);

			expect(poly.createHelperPoint).to.be.called.once;
			expect(poly.createHelperPoint.withArgs(middlePointAfter, pointDraggedPosition + 1)).to.be.called.once;

			expect(poly.get('pointsCollection').indexOf(pointDragged)).to.equal(pointDraggedPosition);

			expect(poly.get('pointsCollection').length).to.equal(initialPointsCount + 1)
			expect(positionPointAfter.lat()).to.equal(addedPointAfter.get('latLng').lat());
			expect(positionPointAfter.lng()).to.equal(addedPointAfter.get('latLng').lng());
		});

		it('should add helper only before the point if the point is last in the poly', function () {
			var pointDraggedPosition = initialPointsCount - 1,
				pointDragged = poly.get('pointsCollection').at(pointDraggedPosition),
				prevPointBeforeDragging = poly.get('pointsCollection').at(pointDraggedPosition - 1);
			
			pointDragged.startDragging();
			var lastLatLng = stubSimulateDragging(pointDragged);
			pointDragged.stopDragging(lastLatLng);

			var middlePointBefore = Utils.calcMiddlePoint(
											prevPointBeforeDragging.get("latLng").lat(),
											prevPointBeforeDragging.get("latLng").lng(),
											pointDragged.get('latLng').lat(),
											pointDragged.get('latLng').lng() ),
				positionPointBefore = new google.maps.LatLng(middlePointBefore.lat, middlePointBefore.lng),
				addedPointBefore = poly.get('pointsCollection').at(pointDraggedPosition);

			expect(poly.createHelperPoint).to.be.called.once;
			expect(poly.createHelperPoint.withArgs(middlePointBefore, pointDraggedPosition)).to.be.called.once;

			expect(poly.get('pointsCollection').indexOf(pointDragged)).to.equal(pointDraggedPosition + 1);

			expect(poly.get('pointsCollection').length).to.equal(initialPointsCount + 1);
			expect(positionPointBefore.lat()).to.equal(addedPointBefore.get('latLng').lat());
			expect(positionPointBefore.lng()).to.equal(addedPointBefore.get('latLng').lng());
		});

		it('should not add points if poly contains only 1 point', function () {
			var initialPointsCount = 1,
				initialPointsCollection = stubCreatePointsCollection(initialPointsCount),
				poly = new Mapper.poly({
					pointsCollectionJSON: initialPointsCollection.toJSON()
				});

			sinon.spy(poly, 'insertHelperPoints');
			sinon.spy(poly, 'createHelperPoint');

			var pointDragged = poly.get('pointsCollection').at(0);
			pointDragged.startDragging();
			var lastLatLng = stubSimulateDragging(pointDragged);
			pointDragged.stopDragging(lastLatLng);

			expect(poly.insertHelperPoints).to.be.called.once;
			expect(poly.createHelperPoint).to.not.be.called;
			expect(poly.get('pointsCollection').length).to.equal(1);
		});
	});
});