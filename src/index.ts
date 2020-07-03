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
  bikeRentalStation: IBikeRentalStation;
}

interface IBikeRentalStationsResponse {
  bikeRentalStations: IBikeRentalStation[];
}

export const graphqlApiUrl_set = (url: string) => (api = url);
export const graphqlApiUrl_get = (): string => api;

export async function fetchBikeRentalStations(): Promise<IBikeRentalStation[]>;
export async function fetchBikeRentalStations(stationId: string): Promise<IBikeRentalStation>;
export async function fetchBikeRentalStations(stationId?: string): Promise<IBikeRentalStation | IBikeRentalStation[]> {
  const query = `{ 
    bikeRentalStation${stationId ? `(id:"${stationId}")` : "s"} {
      stationId
      name
      bikesAvailable
      spacesAvailable
      lat
      lon
      allowDropoff
    }
  }`;

  let res = await request(api, query).catch(e => {
    return Promise.reject(e);
  });

  if (stationId) {
    res = (res as IBikeRentalStationResponse).bikeRentalStation;
  } else {
    res = (res as IBikeRentalStationsResponse).bikeRentalStations;
  }

  if (!res) {
    return Promise.reject("No bike rental stations found.");
  }

  return res;

  if (stationId) {
    return request(api, query)
      .then((data: IBikeRentalStationResponse) => {
        return data.bikeRentalStation;
      })
      .catch(e => Promise.reject(e));
  }

  return request(api, query)
    .then((data: IBikeRentalStationsResponse) => {
      return data.bikeRentalStations;
    })
    .catch(e => Promise.reject(e));
}
