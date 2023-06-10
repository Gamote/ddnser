# DDNSer

`DDNSer` a simple way to update DNS records with your current public IP address.

Supports the following DNS providers:
- Cloudflare
- More to come...

## Prerequisites

- Node
- Yarn

## Environment variables

| Name                          | Description                                                                                                                                                                                            | Value                                  |
|-------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------|
| `DDNSER_CRON_SCHEDULE`        | If this is specified then the script will run according with the CRON specified (e.g. `*/5 * * * *` for every 5 minutes)                                                                               | `""` _(optional)_                      |
| `CLOUDFLARE_API_BASE_URL`     | Cloudflare API url                                                                                                                                                                                     | `https://api.cloudflare.com/client/v4` |
| `CLOUDFLARE_API_TOKEN`        | The Cloudflare API token                                                                                                                                                                               | `""`                                   |
| `CLOUDFLARE_DNS_ZONE_NAME`    | The Cloudflare DNS zone name (e.g. `example.com`)                                                                                                                                                      | `""`                                   |
| `CLOUDFLARE_DNS_RECORD_NAMES` | The Cloudflare DNS record names (e.g. `example.com\,*.example.com`). The value is a comma-separated list of DNS records to update. You will also need to escape the commas with a backslash (`&#92;`). | `""`                                   |

## Building the Docker image

```bash
# Build & push the image
docker build --platform linux/amd64 -t ${YOUR_REGISTRY}/ddnser:${YOUR_CURRENT_VERSION} .
docker image push ${YOUR_REGISTRY}/ddnser:${YOUR_CURRENT_VERSION}

# Example:
# docker build --platform linux/arm64/v8 -t gamote/ddnser:0.0.4 .
# docker image push gamote/ddnser:0.0.4
```

To build for multiple platforms, you need to enable experimental features in Docker.
```bash
docker buildx create --use

# Build & push the image
docker buildx build --platform linux/amd64,linux/arm64 --push -t ${YOUR_REGISTRY}/ddnser:${YOUR_CURRENT_VERSION} .

# Example:
docker buildx build --platform linux/amd64,linux/arm64 --push -t gamote/ddnser:0.0.4 .
```

## Running the Docker image

```bash
sudo docker run -d \
  --restart=unless-stopped \
  -e DDNSER_CRON_SCHEDULE="*/5 * * * *" \
  -e CLOUDFLARE_API_TOKEN="YOUR_KEY" \
  -e CLOUDFLARE_DNS_ZONE_NAME="domain.com" \
  -e CLOUDFLARE_DNS_RECORD_NAMES="domain.com" \
  --name=gamote_ddnser_cloudflare \
  gamote/ddnser:0.0.4
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
