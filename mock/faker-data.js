/**
 * Created by mamingjuan on 2018/1/2.
 */
module.exports = function () {
  var faker = require("faker");
  faker.locale = "zh_CN";
  var _ = require("lodash");
  return {
    people: _.times(100, function (n) {
      return {
        id: n,
        name: faker.name.findName(),
        avatar: faker.internet.avatar()
      }
    }),
    address: _.times(100, function (n) {
      return {
        id: faker.random.uuid(),
        city: faker.address.city(),
        county: faker.address.county(),
        finance: faker.address.streetName(),
        company: [faker.company.companyName(),faker.company.bsAdjective(),faker.image.imageUrl(),faker.commerce.color(),faker.database.engine(),faker.hacker.verb()]
      }
    })
  }
}
