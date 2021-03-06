export type Group = {
  id: string
  pub_id: string
  name: string
  emails?: string[]
  link_facebook: string
  location_name: string
  location_coord: { lat: number; lng: number }
}
