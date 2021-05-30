import { fetchBikeRentalStations, graphqlApiUrl_set, graphqlApiUrl_get, fetchNearestBikeRentalStations } from "./../index";

const expectStation = expect.objectContaining({
  stationId: expect.any(String),
  name: expect.any(String),
  bikesAvailable: expect.any(Number),
  spacesAvailable: expect.any(Number),
  lat: expect.any(Number),
  lon: expect.any(Number),
  allowDropoff: expect.any(Boolean),
});

const expectNode = expect.objectContaining({
  distance: expect.any(Number),
  place: expect.any(Object),
});

test("fetchBikeRentalStations all", async () => {
  const res = await fetchBikeRentalStations();

  expect(res).toBeInstanceOf(Array);
  expect(res[0]).toEqual(expectStation);
});

test("fetchBikeRentalStations one", async () => {
  const res = await fetchBikeRentalStations("547");

  expect(res).toEqual(expectStation);
  expect(res.stationId).toEqual("547");
});

test("fetchBikeRentalStations none", async () => {
  await expect(fetchBikeRentalStations("not a valid id")).rejects.toMatch("No bike rental stations found.");
});

test("graphqlApiUrl_set", async () => {
  const url = graphqlApiUrl_get();
  expect(url).toEqual("https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql");

  graphqlApiUrl_set("invalid url");
  expect(graphqlApiUrl_get()).toEqual("invalid url");

  const s = await fetchBikeRentalStations()
    .then(() => {
      return "not error";
    })
    .catch((e) => {
      return "error";
    });
  expect(s).toEqual("error");

  graphqlApiUrl_set(url);
  expect(graphqlApiUrl_get()).toEqual(url);
});

test("fetchNearestBikeRentalStations", async () => {
  const res = await fetchNearestBikeRentalStations(60.19414, 25.02965);

  expect(res).toBeInstanceOf(Array);
  expect(res.length > 10).toEqual(true);
  expect(res[0]).toEqual(expectNode);
});

test("fetchNearestBikeRentalStations amount=5", async () => {
  const res = await fetchNearestBikeRentalStations(60.19414, 25.02965, 5);

  expect(res).toBeInstanceOf(Array);
  expect(res).toHaveLength(5);
  expect(res[0]).toEqual(expectNode);
});

test("fetchNearestBikeRentalStations radius=500", async () => {
  const res = await fetchNearestBikeRentalStations(60.19414, 25.02965, undefined, 500);

  expect(res).toBeInstanceOf(Array);
  expect(res[0]).toEqual(expectNode);
  res.forEach((n) => expect(n.distance <= 500).toEqual(true));
});

test("fetchNearestBikeRentalStations amount=1 radius=500", async () => {
  const res = await fetchNearestBikeRentalStations(60.19414, 25.02965, 1, 500);

  expect(res).toBeInstanceOf(Array);
  expect(res).toHaveLength(1);
  expect(res[0]).toEqual(expectNode);
  expect(res[0].distance <= 500).toEqual(true);
});
