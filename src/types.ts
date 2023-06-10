export type DDNodeConfig = {
  schedule?: string;
  cloudflare: {
    apiBaseUrl?: string;
    apiToken: string;
    dnsZoneName: string;
    dnsRecordNames: string[];
  }
}

type CloudflareZone = {
  id: string;
  name: string;
}

export type CloudflareRecord = {
  id: string;
  name: string;
  type: "A";
  content: string;
}

export type CloudflareZoneResult = {
  result: CloudflareZone[];
}

export type CloudflareRecordsResult = {
  result: CloudflareRecord[];
}
