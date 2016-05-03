describe("Test poly model", function () {
	it('should properly initialize the points collection from json object', function () {
		var pointsCollection = stubCreatePointsCollection(5),
			initialPointsCollectionJSON = pointsCollection.toJSON(),
			poly = new Mapper.poly(),
			callbacks = {
				collectionOnAdd: function () {}
			};

		sinon.spy(callbacks, 'collectionOnAdd');
		sinon.spy(poly, 'setStartEndPoints');

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

			sinon.spy(poly1, 'refreshPointsCollection');

			poly1.set({
				pointsCollectionJSON: updatedCollectionJSON
			});

			poly1.trigger('refresh');

			expect(poly1.refreshPointsCollection).to.be.called.once;

			expect(poly1.toJSON().pointsCollectionJSON).to.deep.equal(updatedCollectionJSON);
			expect(updatedCollectionJSON).to.not.deep.equal(initialPointsCollection.toJSON());
		});
	});
});