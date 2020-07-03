import { fetchBikeRentalStations, graphqlApiUrl_set, graphqlApiUrl_get } from "./../index";

const expectObject = expect.objectContaining({
  stationId: expect.any(String),
  name: expect.any(String),
  bikesAvailable: expect.any(Number),
  spacesAvailable: expect.any(Number),
  lat: expect.any(Number),
  lon: expect.any(Number),
  allowDropoff: expect.any(Boolean),
});

test("fetchBikeRentalStations all", async () => {
  const res = await fetchBikeRentalStations();

  expect(res).toBeInstanceOf(Array);
  expect(res[0]).toEqual(expectObject);
});
test("fetchBikeRentalStations one", async () => {
  const res = await fetchBikeRentalStations("547");

  expect(res).toEqual(expectObject);
  expect(res.stationId).toEqual("547");
});

test("fetchBikeRentalStations none", async () => {
  await expect(fetchBikeRentalStations("not a valid id")).rejects.toMatch("No bike rental stations found.");
});

test("graphqlApiUrl_set", async () => {
  expect(graphqlApiUrl_get()).toEqual("https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql");

  graphqlApiUrl_set("invalid url");
  expect(graphqlApiUrl_get()).toEqual("invalid url");

  const s = await fetchBikeRentalStations().then(() => { return "not error"; }).catch(e => { return "error" } );
  expect(s).toEqual("error");
});
