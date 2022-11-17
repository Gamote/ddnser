# DDNSer

`DDNSer` a simple way to update DNS records with your current public IP address.

Supports the following DNS providers:
- Cloudflare
- More to come...

## TL;DR

Clone the repo and run the following command:

```console
helm upgrade --install ddnser \
  --namespace ddnser --create-namespace \
  --set cloudflare.apiToken="${YOUR_CLOUDFLARE_API_TOKEN}" \
  --set cloudflare.dnsZoneName="${YOUR_CLOUDFLARE_ZONE_NAME}" \
  --set cloudflare.dnsRecordNames="${YOUR_CLOUDFLARE_DNS_RECORDS_NAMES}" \
  ./helm/ddnser
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
  ./helm/ddnser
```

## Uninstalling the Chart

```bash
helm uninstall ddnser --namespace ddnser
```

## Parameters

| Name                        | Description                                                                                                                                                                                            | Value           |
|-----------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------|
| `image.repository`          | DDNSer image repository                                                                                                                                                                                | `gamote/kafka`  |
| `image.tag`                 | DDNSer image tag (immutable tags are recommended)                                                                                                                                                      | `"0.0.2"`       |
| `schedule`                  | A unix-cron string format that indicates when the job should be executed                                                                                                                               | `"*/5 * * * *"` |
| `cloudflare.apiToken`       | The Cloudflare API token                                                                                                                                                                               | `""`            |
| `cloudflare.dnsZoneName`    | The Cloudflare DNS zone name (e.g. `example.com`)                                                                                                                                                      | `""`            |
| `cloudflare.dnsRecordNames` | The Cloudflare DNS record names (e.g. `example.com\,*.example.com`). The value is a comma-separated list of DNS records to update. You will also need to escape the commas with a backslash (`&#92;`). | `""`            |

## Building the Docker image

```bash
# Build & push the image
docker build --platform linux/amd64 -t ${YOUR_REGISTRY}/ddnser:${YOUR_CURRENT_VERSION} .
docker image push ${YOUR_REGISTRY}/ddnser:${YOUR_CURRENT_VERSION}

# Example:
# docker build --platform linux/arm64/v8 -t gamote/ddnser:0.0.1 .
# docker image push gamote/ddnser:0.0.1
```

## ✨Roadmap

- [ ] Add support for more DNS and Public IP providers
- [ ] Add more documentation on how to use it and how to interact with providers
- [ ] Provide recommendations, best practices for using this tool and mention limitations (e.g. possible rate limits, downtime, etc.)
- [ ] Add more configuration options for the consumers
- [ ] Build multi-arch Docker images
- [ ] Add tests
- [ ] Make the core a npm package and use it in the Helm chart
- [ ] Improve versioning and release process
- [ ] Mention that the secrets can also be provided via a `.env` file
