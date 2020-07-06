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

export const graphqlApiUrl_set = (url: string) => (api = url);
export const graphqlApiUrl_get = (): string => api;

export async function fetchBikeRentalStations(): Promise<IBikeRentalStation[]>;
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
      .catch(e => Promise.reject(e));
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
    .catch(e => Promise.reject(e));
}
