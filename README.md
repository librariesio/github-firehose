# Github Firehose

ServerSentEvents (also known as SSE or Eventsource) firehose of [GitHub public timeline](https://developer.github.com/v3/activity/events/#list-public-events)

See an example use of the stream here: https://libraries.io/github/timeline

## Setup

Clone the repository

    git clone https://github.com/librariesio/github-firehose.git

Generate a new GitHub personal access token here: https://github.com/settings/tokens/new

Start the server:

    ACCESS_TOKEN=your_personal_access_token node app.js

Receive events here: http://localhost:5001/events

Payloads mirror the event types from the GitHub Firehose, documented here: https://developer.github.com/v3/activity/events/types/

## Contributing

1. Fork it ( https://github.com/librariesio/github-firehose/fork )
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create a new Pull Request

## Copyright

Copyright (c) 2015 Andrew Nesbitt. See [LICENSE](https://github.com/librariesio/github-firehose/blob/master/LICENSE) for details.
