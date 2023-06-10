import dotenv from "dotenv";
import axios, {AxiosInstance} from "axios";
import {CloudflareRecord, CloudflareRecordsResult, CloudflareZoneResult, DDNodeConfig} from "./types";
import {CronJob} from "cron";

/**
 * Parse the .env file
 */
dotenv.config();

/**
 * Method to assert that the config is valid
 * by extracting the config from the environment
 */
const assertConfig = (): DDNodeConfig => {
  const config: DDNodeConfig = {
    schedule: process.env.DDNSER_CRON_SCHEDULE,
    cloudflare: {
      apiBaseUrl: process.env.CLOUDFLARE_API_BASE_URL ?? "https://api.cloudflare.com/client/v4",
      apiToken: process.env.CLOUDFLARE_API_TOKEN as string,
      dnsZoneName: process.env.CLOUDFLARE_DNS_ZONE_NAME as string,
      dnsRecordNames: process.env.CLOUDFLARE_DNS_RECORD_NAMES?.split(",").map(name => name.trim()) ?? [],
    }
  }

  if (!config.cloudflare.apiToken) {
    throw new Error("Missing CLOUDFLARE_API_TOKEN");
  }

  if (!config.cloudflare.dnsZoneName) {
    throw new Error("Missing CLOUDFLARE_DNS_ZONE_NAME");
  }

  if (!config.cloudflare.dnsRecordNames.length) {
    throw new Error("Missing CLOUDFLARE_DNS_RECORD_NAMES");
  }

  return config;
}

const config = assertConfig();

/**
 * Get the Cloudflare zone id based on the zone name
 *
 * @param client
 * @param zoneName
 */
const getCloudflareZoneId = async (client: AxiosInstance, zoneName: string): Promise<string | null> => {
  try {
    const response = await client.get<CloudflareZoneResult>("/zones");

    return response?.data?.result?.find((zone) => zone.name === zoneName)?.id ?? null;
  } catch (error) {
    console.error("Couldn't get the zone id for the zone name", error);
    return null;
  }
}

/**
 * Get the Cloudflare zone records based on the zone id
 *
 * @param client
 * @param zoneId
 */
const getCloudflareZoneRecords = async (client: AxiosInstance, zoneId: string): Promise<CloudflareRecordsResult["result"]> => {
  try {
    const response = await client.get<CloudflareRecordsResult>(`/zones/${zoneId}/dns_records`);

    return response?.data?.result ?? [];
  } catch (error) {
    console.error("Couldn't get the records for the zone id", error);
    return [];
  }
}

/**
 * Get the schedule job if needed
 */
const getScheduleJob = async (): Promise<CronJob | null> => {
  if (!config.schedule) {
    return null;
  }

  return new CronJob(
    config.schedule,
    async () => {
      console.log('DDNSer is running on schedule');
      await main();
    },
    null,
    true,
    'America/Los_Angeles'
  );
}

/**
 * Main method
 */
const main = async () => {
  const client = axios.create({
    baseURL: config.cloudflare.apiBaseUrl,
    headers: {
      Authorization: `Bearer ${config.cloudflare.apiToken}`,
    },
  });

  console.log("Getting zone id based on zone name");
  const zoneId = await getCloudflareZoneId(client, config.cloudflare.dnsZoneName);

  if (!zoneId) {
    console.error("Couldn't find the zone id");
    return;
  }

  console.log("Getting zone records based on zone id");
  const zoneRecords = await getCloudflareZoneRecords(client, zoneId);

  // Get the A records that we want to update
  console.log(`Filtering zone records based on record names (Record names: ${config.cloudflare.dnsRecordNames.join(", ")})`);
  const matchedRecords = zoneRecords.reduce<CloudflareRecord[]>((matches, record) => {
    if (record.type === "A" && config.cloudflare.dnsRecordNames.includes(record.name)) {
      matches.push(record);
    }

    return matches;
  }, []);

  // Check if we found all the requested records
  if (matchedRecords.length !== config.cloudflare.dnsRecordNames.length) {
    console.error("Couldn't find all the record ids");
    return;
  }

  // Get the current IP address
  console.log("Getting the current IP address");
  const currentIp = await axios.get("https://api.ipify.org?format=json").then((response) => response.data.ip);

  const promises = matchedRecords.reduce<Promise<void>[]>((acc, record) => {
    if (record.content === currentIp) {
      console.log(`Record "${record.name}" is already up to date`);
      return acc;
    }

    acc.push(
      client.patch(`/zones/${zoneId}/dns_records/${record.id}`, {
        content: currentIp,
      }).then(() => {
        console.log(`Updated record "${record.name}" to "${currentIp}"`);
      })
    );

    return acc;
  }, []);

  await Promise.all(promises);
}

/**
 * Run the main method and start the schedule if needed
 */
void main().then(async () => {
  const job = await getScheduleJob()

  if (job) {
    job.start();
    console.log(`Run scheduled ("${config.schedule}")`);
  }
});