import { useState, useEffect, useRef } from "react"
import moment from "moment"

const useSetup = () => {
  navigator.serviceWorker.getRegistration().then((reg) => {
    // get permissions
    Promise.all([
      Notification.requestPermission().then(
        (status) => `notification-${status}`
      ),
      navigator.permissions
        .query({
          name: "periodic-background-sync",
        })
        .then((status) => `periodicsync-${status.state}`),
    ])
      // setup
      .then((status) => {
        console.log(status)
        if (status.includes("periodicsync-granted")) {
          reg.periodicSync
            .getTags()
            .then((tags) => tags.includes("askBusy"))
            .then((exists) => {
              if (!exists)
                reg.periodicSync.register("askBusy", { minInterval: 60 * 1000 })
            })
        }
      })
  })
}

export default useSetup
