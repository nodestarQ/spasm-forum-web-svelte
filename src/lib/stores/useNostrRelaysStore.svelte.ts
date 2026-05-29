import { Relay } from "nostr-tools-v2";
import { useAppConfigStore } from '$lib/stores/useAppConfigStore.svelte'
import { config } from '$lib/config'
import { useUtils } from '$lib/utils/useUtils'
import {
  SubscribeToNostrRelayConfig,
  CustomSubscribeToNostrRelayConfig,
} from '$lib/types/interfaces';

const {
  isArrayOfStrings,
  sanitizeObjectValuesWithDompurify,
  isValidUrl,
  mergeSubscribeToNostrRelayConfigs,
  parseEnvBool
} = useUtils()

export interface NostrRelayStoreState {
  enableNostrNetwork: boolean,
  allRelays: Relay[],
  allErroredRelayUrls: ErroredRelayUrl[]
}

export interface ErroredRelayUrl {
  url: string,
  attempts: number,
  lastAttemptTimestamp: number
}

class NostrRelaysStore {
  state: NostrRelayStoreState = $state({
    // Environment settings:
    // enableNostrNetwork: config.enableNostrNetwork,
    enableNostrNetwork:
      parseEnvBool(config.enableNostrNetwork, true),
    allRelays: [],
    allErroredRelayUrls: []
  })

  get getAllRelays(): Relay[] {
      return this.state.allRelays
    }

    // Checking whether URL is good to prevent multiple
    // connection attempts to invalid or inactive relay URLs
  get isGoodUrl() {
      return (url: string): boolean => {
        if (!url) return false
        if (!isValidUrl(url)) return false

        const erroredUrlObject = this.state.allErroredRelayUrls.find(
          urlObject => {
            if (
              urlObject && typeof(urlObject) === "object" &&
              'url' in urlObject && urlObject.url &&
              typeof(urlObject.url) === "string" && (
                urlObject.url === url ||
                urlObject.url + '/' === url ||
                urlObject.url === url + '/'
              )
            ) { return true }
          }
        )

        if (!erroredUrlObject) return true

        // return false if relay URL errored at least twice
        // in the last thirty minutes
        if (
          'attempts' in erroredUrlObject &&
          typeof(erroredUrlObject.attempts) === "number" &&
          erroredUrlObject.attempts >= 2
        ) {
          if (
            'lastAttemptTimestamp' in erroredUrlObject &&
            erroredUrlObject.lastAttemptTimestamp
          ) {
            const lastAttempt = erroredUrlObject
              .lastAttemptTimestamp
            const thirtyMinutesAgo = Date.now() - (30 * 60 * 1000)
            if (
              typeof(lastAttempt) === "number" &&
              lastAttempt > thirtyMinutesAgo
            ) {
              return false
            }
          }
        }
        return true
      }
    }

  get getNostrRelayObjectByUrl() {
      return (url: string): Relay | null => {
        const relay: Relay | undefined = this.state.allRelays.find(
          (relay: Relay) => {
            if (
              relay && 'url' in relay && relay.url &&
              typeof(relay.url) === "string" &&
              url && typeof(url) === "string" && (
                relay.url === url ||
                relay.url === url + '/' ||
                relay.url + '/' === url
              )
            ) { return true }
          }
        )
        return relay || null
      }
    }

  get getConnectedNostrRelayObjectByUrl() {
      return async (url: string): Promise<Relay | null> => {
        try {
          let relayIndex: number = -1
          const relay: Relay | undefined = this.state.allRelays.find(
            (relay: Relay, index: number) => {
              if (
                relay && 'url' in relay && relay.url &&
                typeof(relay.url) === "string" &&
                url && typeof(url) === "string" && (
                  relay.url === url ||
                  relay.url === url + '/' ||
                  relay.url + '/' === url
                )
                // relay.url === url ||
                // relay.url === url + '/' ||
                // relay.url + '/' === url
              ) {
                relayIndex = index
                return true
              }
            }
          )

          const isGoodUrl = this.isGoodUrl(url)

          // Option 1. Relay not in the list
          if (
            (!relay || typeof(relay) !== "object") && isGoodUrl
          ) {
            try {
              let newRelay = await Relay.connect(url)
              this.state.allRelays.push(newRelay)
              return this.state.allRelays[this.state.allRelays.length - 1]
            } catch (err) {
              this.addToErroredRelayUrls(url)
              // console.error(err);
              return null
            }
          }

          // Option 2. Relay in the list and connected
          if (
            relay && 'connected' in relay &&
            relay.connected === true
          ) {
            return relay
          }

          // Option 3. Relay in the list, but not connected
          if (
            relay && isGoodUrl && (
              !('connected' in relay) || !relay.connected
            )
          ) {
            try {
              if (relayIndex > -1) {
                this.state.allRelays[relayIndex] =
                  await Relay.connect(url)
                return this.state.allRelays[relayIndex]
              }
            } catch (err) {
              this.addToErroredRelayUrls(url)
              // console.error(err);
              return null
            }
          }
          return null
        } catch (err) {
          console.error(err);
          return null
        }
      }
    }

  updateStateAppConfig(): string {
      try {
        const appConfig = useAppConfigStore()?.getAppConfig
        // TODO add enableNostrNetwork to appConfig admin page
        // this.state.enableNostrNetwork = appConfig?.enableNostrNetwork
        return "SUCCESS: appConfig state in useNostrRelaysStore updated"
      } catch (err) {
        console.error(err);
        return "ERROR: appConfig state in useNostrRelaysStore not update"
      }
    }

    addToErroredRelayUrls(url: string): void {
      if (!url) return
      if (!isValidUrl(url)) return

      const erroredUrlObject: ErroredRelayUrl | undefined =
        this.state.allErroredRelayUrls.find(
        (urlObject: ErroredRelayUrl) => {
          if (
            urlObject && typeof(urlObject) === "object" &&
            'url' in urlObject && urlObject.url &&
            typeof(urlObject.url) === "string" && (
              urlObject.url === url ||
              urlObject.url + '/' === url ||
              urlObject.url === url + '/'
            )
          ) { return true }
        }
      )

      if (!erroredUrlObject) {
        this.state.allErroredRelayUrls.push(
          {
            url: url,
            attempts: 1,
            lastAttemptTimestamp: Date.now()
          }
        )
      } else if (
        erroredUrlObject &&
        typeof(erroredUrlObject) === "object"
      ) {
        if (
          'attempts' in erroredUrlObject &&
          typeof(erroredUrlObject.attempts) === "number"
        ) {
          erroredUrlObject.attempts += 1
          erroredUrlObject.lastAttemptTimestamp = Date.now()
        } else {
          erroredUrlObject.attempts = 1
          erroredUrlObject.lastAttemptTimestamp = Date.now()
        }
      }

    }

    async subscribeToNostrRelaysByFilters(
      relayUrlOrUrls: string | string[],
      customConfig: CustomSubscribeToNostrRelayConfig,
      method: 'concurrently' | 'sequentially' = 'sequentially'
    ): Promise<string | null> {
      try {
        if (!relayUrlOrUrls) { return null }
        let relayUrls: string[] = []
        if (typeof(relayUrlOrUrls) === "string") {
          relayUrls = [relayUrlOrUrls]
        } else if (Array.isArray(relayUrlOrUrls)) {
          relayUrls = relayUrlOrUrls
        }
        if (!isArrayOfStrings(relayUrls)) { return null }

        if (method === 'concurrently') {
          // 'Promise.all' executes concurrently
          await Promise.all(relayUrls.map((relayUrl) => {
            return useNostrRelaysStore()
              .subscribeToNostrRelayByFilters(
                relayUrl, customConfig
              )
          }))
        // } else if (method = 'sequentially') {
        // Execute sequentially by default (e.g., if typo)
        } else {
          // 'For of' executes sequentially one by one
          for (const relayUrl of relayUrls) {
            await useNostrRelaysStore()
              .subscribeToNostrRelayByFilters(
                relayUrl, customConfig
              )
          }
        }

        return "SUCCESS: in subscribeToNostrRelaysByFilters"
      } catch (err) {
        console.error(err);
        return "ERROR: error in subscribeToNostrRelaysByFilters"
      }
    }

    async subscribeToNostrRelayByFilters(
      relayUrl: string,
      customConfig: CustomSubscribeToNostrRelayConfig
    ): Promise<string | null> {
      try {
        if (!this.state.enableNostrNetwork) return null
        const defaultConfig = new SubscribeToNostrRelayConfig()
        const config = mergeSubscribeToNostrRelayConfigs(
          defaultConfig, customConfig || {}
        ) 
        const {
          filters,
          onEventFunction, onEoseFunction,
          ifCloseSubOnEvent, ifCloseRelayOnEvent,
          ifCloseSubOnEose, ifCloseRelayOnEose,
          closeSubAfterTime, closeRelayAfterTime,
          ifAwaitUntilEose, awaitUntilEoseTimeout
        } = config
        if (!filters || !Array.isArray(filters)) {
          return "ERROR: no filters in subscribeToNostrRelayByFilters"
        }

        if (!relayUrl) return null
        if (typeof(relayUrl) !== "string") return null
        let relay =
          await useNostrRelaysStore()
            .getConnectedNostrRelayObjectByUrl(relayUrl)
        if (!relay || typeof(relay) !== "object") return null

        let ifEose: boolean = false
        let ifAnyEventFound: boolean = false
        let totalEventsFound: number = 0
        const foundEvents: any[] = []

        const sub = await relay.subscribe(
          // [ { kinds: [1], since: Math.floor(Date.now() / 1000) } ],
          // [ { kinds: [1], since: 1738694351 } ],
          filters as any,
          {
            async onevent(event) {
              ifAnyEventFound = true
              totalEventsFound += 1
              try {
                sanitizeObjectValuesWithDompurify(event)
                if (event) {
                  foundEvents.push(event)
                  if (
                    onEventFunction &&
                    typeof(onEventFunction) === "function"
                  ) { onEventFunction(event, relayUrl, ifEose) }
                }
                if (ifCloseSubOnEvent) {
                  await sub.close()
                }
                if (ifCloseRelayOnEvent) {
                  await sub.close()
                  await relay.close()
                }
              } catch (err) {
                console.error(err);
              }
            },
            async oneose() {
              if (
                onEoseFunction &&
                typeof(onEoseFunction) === "function"
              ) {
                onEoseFunction(
                  relayUrl, totalEventsFound, foundEvents
                )
              }
              if (ifCloseSubOnEose) {
                await sub.close()
              }
              if (ifCloseRelayOnEose) {
                await sub.close()
                await relay.close()
              }
              ifEose = true
            }
          }
        )

        let ifClosedSubByTimeout: boolean = false
        if (
          typeof(closeSubAfterTime) === "number" &&
          closeSubAfterTime > 0
        ) {
          setTimeout(async () => {
            await sub.close()
            ifClosedSubByTimeout = true
          }, closeSubAfterTime)
        }

        if (
          typeof(closeRelayAfterTime) === "number" &&
          closeRelayAfterTime > 0
        ) {
          setTimeout(async () => {
            await sub.close()
            await relay.close()
          }, closeRelayAfterTime)
        }

        let ifResolvedByTimeout = false
        const awaitUntilEose = async(timeout: number) => {
          if (typeof(timeout) !== "number") { timeout = 5000 }
          const maxAttempts = Math.ceil(timeout/200)
          for (let i = 0; i < maxAttempts; i++) {
            if (ifEose) { return true }
            if (ifClosedSubByTimeout) { return true }
            await new Promise(resolve => setTimeout(resolve, 200))
          }
          ifResolvedByTimeout = true
          return false
        }

        if (ifAwaitUntilEose) {
          await awaitUntilEose(awaitUntilEoseTimeout)
        }

        // console.log(`SUCCESS: subscribed to: ${relayUrl}, ifEose: ${ifEose}, ifAnyEventFound: ${ifAnyEventFound}, totalEventsFound: ${totalEventsFound}, ifResolvedByTimeout: ${ifResolvedByTimeout}, ifClosedSubByTimeout: ${ifClosedSubByTimeout}, filters: ${JSON.stringify(filters)}`)
        // console.log("SUCCESS: subscribed to:", relayUrl, "ifEose:", ifEose, "ifAnyEventFound:", ifAnyEventFound, "totalEventsFound:", totalEventsFound, "ifResolvedByTimeout:", ifResolvedByTimeout, "ifClosedSubByTimeout", ifClosedSubByTimeout, "filters:", filters)
        return "SUCCESS: in subscribeToNostrRelayByFilters"
      } catch (err) {
        console.error(err);
        return "ERROR: error in subscribeToNostrRelayByFilters"
      }
    }

    async connectToNostrRelayByUrl(
      relayUrl: string
    ): Promise<string | null> {
      try {
        if (!relayUrl) return null
        if (typeof(relayUrl) !== "string") return null
        const isGoodUrl =
          this.isGoodUrl(relayUrl)
        if (isGoodUrl) {
          let relay = await Relay.connect(relayUrl)
          this.state.allRelays.push(relay)
          return "SUCCESS: in connectToNostrRelayByUrl"
        } else {
          return "ERROR: bad URL in connectToNostrRelayByUrl"
        }
      } catch (err) {
        this.addToErroredRelayUrls(relayUrl)
        // console.error(err);
        return "ERROR: error in connectToNostrRelayByUrl"
      }
    }

    async disconnectFromNostrRelayByUrl(
      relayUrl: string
    ): Promise<string | null> {
      try {
        if (!relayUrl) return null
        if (typeof(relayUrl) !== "string") return null

        // Not using getConnectedNostrRelayObjectByUrl() getter
        // because there might be multiple connected relays with
        // the same URL due to some error.
        // Thus, it's better to check all relays in the array.
        await Promise.all(
          this.state.allRelays.map(
            (relay: Relay) => {
              if (
                relay && typeof(relay) === "object" &&
                'url' in relay && relay.url &&
                typeof(relay.url) === "string" &&
                (
                  relay.url === relayUrl ||
                  relay.url === relayUrl + '/' ||
                  relay.url + '/' === relayUrl
                )
              ) {
                return this.
                  disconnectNostrRelayObject(relay)
              }
          })
        )

        this.removeAllDisconnectedNostrRelays()

        return "SUCCESS: in disconnectFromNostrRelayByUrl"
      } catch (err) {
        console.error(err);
        return "ERROR: error in disconnectFromNostrRelayByUrl"
      }
    }

    removeAllDisconnectedNostrRelays(): void {
      this.state.allRelays = 
        this.state.allRelays
          .filter((relay: Relay) => relay.connected);
    }

    async disconnectAllNostrRelays(): Promise<void> {
      try {
        if (!Array.isArray(this.state.allRelays)) {
          return
        }
        await Promise.all(
          this.state.allRelays.map((relay: Relay) => {
            return useNostrRelaysStore()
              .disconnectNostrRelayObject(relay)
          })
        )
        this.removeAllDisconnectedNostrRelays()
      } catch (err) {
        console.error(err);
      }
    }

    async disconnectNostrRelayObject(
      relay: Relay
    ): Promise<string> {
      try {
        // Clear all subs to avoid errors after closing
        if (
          relay && typeof(relay) === "object" &&
          'openSubs' in relay && relay.openSubs
        ) {
          if (
            relay.openSubs instanceof Map &&
            'clear' in relay.openSubs &&
            typeof(relay.openSubs.clear) === "function"
          ) {
            relay.openSubs.clear()
          } else if (
            'target' in relay.openSubs &&
            relay.openSubs.target &&
            'clear' in (relay.openSubs.target as any) &&
            typeof((relay.openSubs.target as any).clear) === "function"
          ) { (relay.openSubs.target as any).clear() }
        }

        // Close relay connection
        if (
          relay && typeof(relay) === "object" &&
          'close' in relay &&
          typeof(relay.close) === 'function'
        ) { await relay.close() }
        return "SUCCESS: in disconnectNostrRelayObject"
      } catch (err) {
        console.error(err);
        return "ERROR: error in disconnectNostrRelayObject"
      }
    }
}

export const nostrRelaysStore = new NostrRelaysStore()
export const useNostrRelaysStore = () => nostrRelaysStore
