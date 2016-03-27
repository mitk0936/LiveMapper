describe("Test point model", function () {
	it("should create new point. with default values", function () {
		var p = new Mapper.point();

		expect(p.get('lat')).to.be.defined;
		expect(p.get('lng')).to.be.defined;
		expect(p.get('latLng')).to.not.equal(null);

	});
});