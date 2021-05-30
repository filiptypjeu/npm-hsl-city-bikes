global.fetch = require("node-fetch");
import { request } from "graphql-request";

let api = "https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql";

export interface IBikeRentalStation {
  stationId: string;
  name: string;
  bikesAvailable: number;
  spacesAvailable: number;
  lat: number;
  lon: number;
  allowDropoff: boolean;
}

interface IBikeRentalStationResponse {
  bikeRentalStation: IBikeRentalStation | null;
}

interface IBikeRentalStationsResponse {
  bikeRentalStations: IBikeRentalStation[];
}

interface IBikeRentalStationNode {
  place: IBikeRentalStation;
  distance: number;
}

interface IBikeRentalStationEdge {
  node: IBikeRentalStationNode;
}

interface IBikeRentalStationEdges {
  edges: IBikeRentalStationEdge[];
}

interface INearestBikeRentalStationsResponse {
  nearest: IBikeRentalStationEdges;
}

/**
 * Change the GraphQL API URL from the default one.
 *
 * @param {string} url The new API URL.
 */
export const graphqlApiUrl_set = (url: string) => (api = url);

/**
 * Get the current API URL that is being used by the package.
 */
export const graphqlApiUrl_get = (): string => api;

/**
 * Fetch information about all HSL bike rental stations.
 *
 * @returns A Promise for an Array of bike rental stations.
 */
export async function fetchBikeRentalStations(): Promise<IBikeRentalStation[]>;
/**
 * Fetch information about all HSL bike rental stations.
 *
 * @param {string} stationId The station number as a string. Note that stations with number below 100 has a leading 0 in their ids.
 *
 * @returns A Promise for a bike rental station. Resolves if a station is found, rejects otherwise.
 */
export async function fetchBikeRentalStations(stationId: string): Promise<IBikeRentalStation>;
export async function fetchBikeRentalStations(stationId?: string): Promise<IBikeRentalStation | IBikeRentalStation[]> {
  if (stationId) {
    const q1 = `{
      bikeRentalStation(id:"${stationId}") {
        stationId
        name
        bikesAvailable
        spacesAvailable
        lat
        lon
        allowDropoff
      }
    }`;

    return request(api, q1)
      .then((res: IBikeRentalStationResponse) => res.bikeRentalStation || Promise.reject("No bike rental stations found."))
      .catch((e) => Promise.reject(e));
  }

  const q2 = `{
    bikeRentalStations {
      stationId
      name
      bikesAvailable
      spacesAvailable
      lat
      lon
      allowDropoff
    }
  }`;

  return request(api, q2)
    .then((res: IBikeRentalStationsResponse) => res.bikeRentalStations)
    .catch((e) => Promise.reject(e));
}

/**
 * Fetch the nearest bike rental stations.
 *
 * @param {number} latitude The latitudal position from where to measure the distance.
 * @param {number} longitude The longitudal position from where to measure the distance.
 * @param {number | undefined} maxResults The maximum amount of result to get. Note that this is only a maximum, and that the API usually do not give more than around 15 results.
 * @param {number | undefined} maxDistance Serach for stations within a certain radius. The distance unit is meters.
 *
 * @returns An Array of nodes. A node contains a bike rental station and its distances to the specified location. The nodes are ordered according to the distance, with the closest being the first element.
 */
export async function fetchNearestBikeRentalStations(
  lat: number,
  lon: number,
  maxResults?: number,
  maxDistance?: number
): Promise<IBikeRentalStationNode[]> {
  const query = `{
    nearest(lat: ${lat}, lon: ${lon}, ${maxResults === undefined ? "" : `maxResults: ${maxResults}, `}${
    maxDistance === undefined ? "" : `maxDistance: ${maxDistance}, `
  }filterByPlaceTypes: [BICYCLE_RENT]) {
      edges {
        node {
          place {
            lat
            lon
            ...on BikeRentalStation {
              name
              stationId
              spacesAvailable
              bikesAvailable
              allowDropoff
            }
          }
          distance
        }
      }
    }
  }`;

  return request(api, query)
    .then((res: INearestBikeRentalStationsResponse) => res.nearest.edges.map((e) => e.node))
    .catch((e) => Promise.reject(e));
}
