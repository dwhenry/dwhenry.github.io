---
title: "Drugs are bad.."
summary: "Removing the Pusher dependency from my test suite by running an open source clone on CI, with the RSpec helper and bash script to manage it."
date: 2014-09-20
---

So why am I a [Pusher](http://pusher.com)?

And by pusher I am referring to a developer who is using the third party messaging service.

My main concern, as with any external dependency is testing. My unit tests can and should be stubbing the service. I still need some higher level integration tests that allow me to test the system interdependencies, it is here that I have an issue. I don’t want my tests to rely on an external service - I would be extremely critical of this sort of testing dependency - and stubbing the service would mean the tests are brittle to changes.

So my testing options:

  * Connect to the external service during testing.
  * Stub out the external requests - and hope they never change.
  * Using a web mocking gem - web mock.

Pusher uses http connection for receiving data, but then has a WebSocket connection for forwarding events, This means stubbing requests and mocking gems are unlikely to meet our requirements out of the box, and we already stated that using the service was unacceptable.

So I can either build a fake server to emulate the pusher service, it would need to handle incoming http calls and then forward the events as messages across a websocket connection. Or I can [be lazy](http://blog.decoybecoy.com/post/97921403963/is-being-lazy-bad-for-you) and look at what is available on google.

The solution is to use an open source version of the pusher service, this allows me to effective run the service on the CI machine and have it be a runtime dependency of the test suite.

My [colleague](https://github.com/lukaszkorecki) recommending starting the server before running the test suite instead of starting and stopping it for individual tests. This simplifies the code as I just need to check the service is running in the required tests and the inform the user how to start it if it was missing.

```ruby
# usage:
#   it "runs a test requiring slanger", slanger: true do # perferred
#     ...
#   end
# or
#   it "runs a test requiring slanger" do
#     ...
#     with_slanger { ... }
#     ...
#   end
module SlangerHelper
  class SlangerServerNotRunning < StandardError; end

  def with_slanger(&block)
    check_for_slanger
    block.call
  end

  def check_for_slanger
    Notifier.test_message(OpenStruct.new(created_at: Time.now))
  rescue => e
    if e.respond_to?(:original_error) && e.original_error.is_a?(Errno::ECONNREFUSED)
      raise SlangerServerNotRunning, %{
  Please ensure you start Slanger server before running tests
  You can do this using:

    bin/slanger_test_runner
      }
    else
      raise
    end
  end
end

RSpec.configure do |config|
  config.include SlangerHelper, type: :feature

  config.around(:example, slanger: true) do |example|
    with_slanger do
      example.run
    end
  end
end
```

As I wanted the service to run in the background and be easy to start, stop and restarting, I wrote - with significant help from my [colleague](https://github.com/lukaszkorecki) \- a bash script to perform these tasks:

```bash
#!/bin/bash

ENV_FILE=${2:-.env.test}

readEnvVar() {
  local varName="$1"
  if [[ -e $ENV_FILE ]]; then
    grep $varName $ENV_FILE | cut -d= -f2
  else
    env | grep $varName | cut -d= -f2
  fi
}

PidFile="tmp/slanger_test_runner.pid"
PUSHER_API_KEY="$(readEnvVar "PUSHER_API_KEY")"
PUSHER_SECRET="$(readEnvVar "PUSHER_SECRET")"
PUSHER_WRITE_PORT="$(readEnvVar "PUSHER_WRITE_PORT")"
PUSHER_READ_PORT="$(readEnvVar "PUSHER_READ_PORT")"

log() {
    echo "SLANGER: $*"
}

start() {
  if [[ -e $PidFile ]]; then
    if kill -0 $(cat $PidFile) ; then
      log "Slanger is running!"
      exit 0
    else
      rm $PidFile
    fi

  fi

  BUNDLE_GEMFILE=Gemfile.slanger bundle exec slanger --app_key $PUSHER_API_KEY --secret $PUSHER_SECRET -a 0.0.0.0:$PUSHER_WRITE_PORT -w 0.0.0.0:$PUSHER_READ_PORT -v 2>&1  > log/slanger_test.log &
  stat=$?
  echo $! > $PidFile

  if [[ ! "$stat" = "0" ]] ; then
    log "Slanger failed to start. Exit code $stat"
    exit $stat
  fi

  log "Slanger started at $(cat $PidFile)"

}

stop() {
  if [[ -e $PidFile ]]; then
    kill $(cat $PidFile)
    rm $PidFile
    log "Slanger stopped"
  fi
}

CMD="$1"

if [[ "start" = $CMD ]]; then
  start
elif [[ "stop" = $CMD ]]; then
  stop
elif [[ "restart" = $CMD ]]; then
  stop
  start
else
  echo 'Usage: slanger_test_runner start|stop|restart'
fi
```

With all of this in place I can rest easy knowing I have one less dependency in my test suite.
