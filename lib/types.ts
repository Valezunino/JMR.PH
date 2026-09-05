export type EventStatus = "draft" | "published" | "archived";

export type JmrEvent = {
  id: string;
  admin_id: string;
  title: string;
  slug: string;
  client_name: string;
  event_date: string | Date | null;
  location: string;
  description: string;
  access_code: string;
  status: EventStatus;
  downloads_enabled: boolean;
  created_at: string | Date;
  updated_at: string | Date;
  photo_count?: number;
};

export type JmrPhoto = {
  id: string;
  event_id: string;
  pathname: string;
  blob_url: string;
  filename: string;
  content_type: string;
  size_bytes: number;
  position: number;
  created_at: string | Date;
};
