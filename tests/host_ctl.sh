#!/usr/bin/env bash
# start|stop the local Vercel-host stand-in on :8790 using a pidfile (never pattern-kills).
PIDF=/tmp/ix_vhost.pid
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
case "$1" in
  start)
    # IX_PICS_MOCK=1: bundle pictures from tests/pics_mock_server.js on :8799 (sandbox has no Wikimedia)
    if [ -n "$IX_PICS_MOCK" ]; then export PICS_WP=http://127.0.0.1:8799/w/api.php PICS_WREST=http://127.0.0.1:8799/rest/ PICS_COMMONS=http://127.0.0.1:8799/commons/w/api.php; fi
    (cd "$ROOT/deploy/vercel" && node build.mjs >/tmp/ix_build.log) || exit 1
    cd "$ROOT"
    nohup node tests/vercel_host_serve.js 8790 > /tmp/ix_vhost.log 2>&1 &
    echo $! > $PIDF; sleep 1; echo "started $(cat $PIDF)";;
  stop)
    [ -f $PIDF ] && kill "$(cat $PIDF)" 2>/dev/null; rm -f $PIDF; echo stopped;;
esac
