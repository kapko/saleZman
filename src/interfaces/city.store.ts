export interface city {
  $key: string,
  name: string,
}

export interface storeName {
  $key: string,
  name: string,
  _name: string,
  city: string,
  url: string,
}
