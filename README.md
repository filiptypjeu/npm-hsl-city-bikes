# hsl-city-bikes
With this package you can easily fetch data about HSL city bike stations in Helsinki.

## Usage
```ts
fetchBikeRentalStations(): Promise<IBikeRentalStation[]>;
fetchBikeRentalStations(stationId: string): Promise<IBikeRentalStation>;
```
