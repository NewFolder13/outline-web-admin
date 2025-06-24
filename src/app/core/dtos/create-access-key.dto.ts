export interface CreateAccessKeyDto {
  name?: string;
  method?: string;
  password?: string;
  port?: number;
  limit?: number | { bytes: number };
}
