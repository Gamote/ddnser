# DDNSer Chart

## TL;DR

Clone the repo and run the following command:

```console
helm upgrade --install ddnser \
  --namespace ddnser --create-namespace \
  --set cloudflare.apiToken="${YOUR_CLOUDFLARE_API_TOKEN}" \
  --set cloudflare.dnsZoneName="${YOUR_CLOUDFLARE_ZONE_NAME}" \
  --set cloudflare.dnsRecordNames="${YOUR_CLOUDFLARE_DNS_RECORDS_NAMES}" \
  ./ddnser
```

> INFO: The `cloudflare.dnsRecordNames` is a comma-separated list of DNS records to update. You will also need to escape the commas with a backslash (`&#92;`).

## Prerequisites

- Kubernetes 1.19+
- Helm 3.2.0+

## Installing the Chart

```bash
helm upgrade --install ddnser \
  --namespace ddnser --create-namespace \
  --set cloudflare.apiToken="${YOUR_CLOUDFLARE_API_TOKEN}" \
  --set cloudflare.dnsZoneName="${YOUR_CLOUDFLARE_ZONE_NAME}" \
  --set cloudflare.dnsRecordNames="${YOUR_CLOUDFLARE_DNS_RECORDS_NAMES}" \
  ./ddnser
```

## Uninstalling the Chart

```bash
helm uninstall ddnser --namespace ddnser
```

## Parameters

| Name                        | Description                                                                                                                                                                                            | Value           |
|-----------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------|
| `image.repository`          | DDNSer image repository                                                                                                                                                                                | `gamote/ddnser`  |
| `image.tag`                 | DDNSer image tag (immutable tags are recommended)                                                                                                                                                      | `"0.0.2"`       |
| `schedule`                  | A unix-cron string format that indicates when the job should be executed                                                                                                                               | `"*/5 * * * *"` |
| `cloudflare.apiToken`       | The Cloudflare API token                                                                                                                                                                               | `""`            |
| `cloudflare.dnsZoneName`    | The Cloudflare DNS zone name (e.g. `example.com`)                                                                                                                                                      | `""`            |
| `cloudflare.dnsRecordNames` | The Cloudflare DNS record names (e.g. `example.com\,*.example.com`). The value is a comma-separated list of DNS records to update. You will also need to escape the commas with a backslash (`&#92;`). | `""`            |
