#!/usr/bin/env bash
# start|stop the local Vercel-host stand-in on :8790 using a pidfile (never pattern-kills).
PIDF=/tmp/ix_vhost.pid
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
case "$1" in
  start)
    (cd "$ROOT/deploy/vercel" && node build.mjs >/dev/null) || exit 1
    cd "$ROOT"
    nohup node tests/vercel_host_serve.js 8790 > /tmp/ix_vhost.log 2>&1 &
    echo $! > $PIDF; sleep 1; echo "started $(cat $PIDF)";;
  stop)
    [ -f $PIDF ] && kill "$(cat $PIDF)" 2>/dev/null; rm -f $PIDF; echo stopped;;
esac
