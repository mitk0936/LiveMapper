describe('Test points layer', function () {
	it('should set single to every point added to the pointsLayer', function () {
		var p = new Mapper.point(),
			layer = new Mapper.pointsLayer();

		p.set('single', false);
		layer.add(p);
		expect(p.get('single')).to.equal(true);
	})
});