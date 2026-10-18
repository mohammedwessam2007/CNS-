# Prompt to turn on cloud sync (for an AI agent with browser access, e.g. ChatGPT agent)

Copy everything in the box below into the agent. It needs to be signed in to Vercel as the owner (you will log in yourself when it asks; never paste a password or token into the chat).

```
Task: connect a Vercel Blob store to my Vercel project so my study app's cloud sync turns on.
Do not change any code, files, domains, environment variables other than the one Vercel adds
automatically, billing, or team settings. Do not delete anything. Stop and ask me before any step
that is not listed here.

1. Open https://vercel.com/dashboard and, when asked, let me sign in myself. Do not type or store
   any password, token or secret for me.
2. Open the project named "intellectuality-cns".
3. Go to the project's "Storage" tab. Choose "Create Database" (or "Create"), then "Blob".
4. Name the store: intellectuality-progress
   Access: Private
   Region: Frankfurt (fra1) if offered; otherwise the default.
   Click Create.
5. When Vercel asks which project and environments to connect, choose "intellectuality-cns"
   and tick Production and Preview (Development is optional). Confirm.
   Vercel then adds the environment variable BLOB_READ_WRITE_TOKEN by itself.
   Do not copy, show, print or send the value of that variable anywhere.
6. Redeploy: go to the project's "Deployments" tab, open the most recent Production
   deployment, click the "..." menu, choose "Redeploy", keep the defaults, confirm.
7. Wait until that deployment shows "Ready".
8. Check it worked: open https://intellectuality-cns.vercel.app/api/state in a new tab.
   - Success looks like this short reply: {"error":"sync_code_required"}
     (that is correct: the page was opened without my private sync code).
   - If it still says "cloud_not_configured", tell me exactly what the page says and
     which step you are on, and stop.
9. Report back in plain words: the store name, that it is connected to Production, the
   deployment that was redeployed, and what /api/state now says. Never include any token.
```

## After the agent is done (you, on your phone)

1. Open https://intellectuality-cns.vercel.app and let it load fully.
2. Tap the cloud button (☁). It should now read **SYNCED** with a time, not "SAVED ON THIS DEVICE".
3. To use a second device: open the sync page from that button, and follow its "link another device" step. Your progress stays on this phone as well.

If anything looks wrong, open **Share my progress**, download the file, and send it to Claude. Your progress is safe on the phone either way.
