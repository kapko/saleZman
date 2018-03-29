export interface NotificationType {
  type: string;
}

export enum RequestType {
  distributor = 'distributorRequest',
}

export interface NotificationInterface {
  key: string;
  distId: string;
  type: string;
  created: string;
}
