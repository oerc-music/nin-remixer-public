
# Session SAVE UI design

## Features

* The user can specify a location to store the session, or let the system suggest a default.

* Alternatively, the user can enter the URI for a previous session and have it reloaded.

## Implementation

* Change current Fragment load textbox to:

  Session location: [textbox with default output LDP container(1)]  [*] Load session/create new session    (2)

  Fragments: [textbox - preloaded with default frgament set URI]

                  [GO]         (3)

  (1) = If user changes URI then changes default to load session rather than create new (the fragments textbox greys out as the
fragment location will be found from the session
  (1) = checkboxes to specify loading a session or creating new on (default to create)
  (3) = button to initiate session (creating/loading containers as necessary)

* After the user has hit [GO] the display will change to just show the two used URIs (Fragments and Session) at the very top of the session.

