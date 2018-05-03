# Notes about APIs for SOFA match services

These API notes are concerned with abstract operations that may be performed, without regard for whether the logic involved is client- or server-side.

The assumed starting point for implementation is a standard LDP server with support for basic containers.  Any additional logic and interfaces would be implemented within client system code, but some of which might usefully be moved to server-side implementations.  In  this way, an off-the-shelf LDP server can be used to bootstrap the implementation, while allowing that operational improvements might be achieved by selectively moving some of the logic to a server or middleware component.

A key goal is separation of concerns.  Match service agents embody knowledge of how specific match criteria are evaluated, while the remixer client embodies knowledge of how the matches may be used in composing some piece.

Working sets are defined to be finite and, for early developments, assumed to be quite small (e.g. it would be quite reasonable to hold all the fragment references for a working set in local memory, and to handle composition of fragment selection criteria in client memory)


## Creating match services

A match service for a particular match criterion is represented as a set of materialized matches in an LDP container.

The match service agent that creates this materialization for a working set needs to know:

Interfaces:

- LDP, using HTTP GET, POST, PUT, DELETE operations.
- Any mechanisms needed to access external information (e.g. from Wikidata)
- Read and write working sets

Representations:

- LDP basic containers
- Web annotations
- SOFA working sets and fragment references
- Match-specific knowledge and/or information representations (e.g. pitch ranges for instruments)
- SOFA-specific annotation structures (e.g. motivations)


## Accessing match services

The remixer client accesses match information as web annotations in LDP containers, with separate containers for different match criteria (created by different match service agents, and potentially stored at diverse locations).

Interfaces:

- LDP basic container access (using GET operations)
- Iterate over anotations in a container with a specified annotation target (URI).  The target may be another fragment (for fragment-to-fragment compatibility criteria), or some other information (e.g. an instrument for pitch-range selection, or a key designation for key-compatibility selection)
- Ordering of selection results (TBD)
- Iterate over unique target references in a collection of annotations (for populating selection criteria UI elements)
- Iterate over unique body references in a collection of annotatons
- Iterate over unique fragment references (in body or target) in a collection of annotations (needs to be able to distinguish anotation fragment references)
- Join (intersection) of multiple selection sets

Representations:

- LDP basic containers
- Web annotations
- SOFA working sets and fragment references
- SOFA-specific annotation structures (e.g. motivations); specifically:
    - recursive container references
    - symmetric vs asymmetric match relation types (i.e. multi-target or target -> body?)


## Others

There will surely be more abstract operations required, especially for the remixer, if it is to be able to self-configure itself to work with an arbitrary set of match services provided for a given working set.


