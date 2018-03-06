
# Notes on vocabulary choices

Going through the various parts of the [architecture diagram](https://github.com/oerc-music/nin-remixer-public/blob/master/notes/Architecture.svg):

The notion of a NiN working set should be developed and unified, incorporating fragment media, descriptions, provenance and assembly (where available).  This would mean that the interface between NiN and the remixer, the remixer work-in-progress, and the final output could all be supported by a common desgn and interface service.  It would also mean that remixer outputs, possibly combined with additional NiN activities, could be used as input to subsequent remixer sessions.

(@@add reference to definition/example when done).  


## Fragments from NiN:

- What is called a "DMO"
- Music Ontology to reference the score as MEI
- PROV for the "provenance metadata", as exported by NiN?
- Probably local vocab for the specifics of the metadata
    - (still need to map this)
    - just invent something for now, then review and see if it can be replaced by or related to any existing vocab

@@TODO: It could help to reference a diagram and/or example that shows how the vocab parts fit together.

Current plan is to provide NiN fragments to the remixer in the form of a common "working set"

(@@add reference to definition/example when done).  


## Working sets:

The plan is to use a common Working Set reoresentation (Probably in the form of an LDP container with a mixture of LD and other media resources) for input, working data, and output "DMO", to maximize re-use of design and code, and to hopefully allow greater flexibility in the re-use of data in new projects.

(@@add referebnce to definition/example when done)

- A set of fragments used in a Remixer session may include one or more previously defined sets
- LDP container with references to include the Fragment DMOs can we include by reference the previously defined containers (do these change over time?)

## Assembled score:

Propose to use the Segment ontology to map the use of fragments in the composition?

@@@ [Segment Ontology](https://www.linkedmusic.org/ontologies) not currently online.

Segment Ontology (SO) usage should generally follow the Jam session patterns (see [MELD paper ("Take it to the bridge")](https://ismir2017.smcnus.org/wp-content/uploads/2017/10/190_Paper.pdf)).

@@TODO:
We need a more complete view of how the bits fit together - a little more than SO will be needed)


## Matched Fragments:

- Represent matches as annotations
    - initially the "compatible key" match
    - there are concepts in the Chord Ontology (http://purl.org/ontology/chord/) which relate to the scales and could be useful
    - there is also a Keys Ontology refered to by Music Ontology (http://purl.org/NET/c4dm/keys.owl)

Further discussion in [Match Architecture](Match-Architecture.md).


## Output DMO
 
- Similar Provenance information to the input DMOs
    - human decisions in creating the composition
    - also capture the working sets under consideration
- Reference created MEI of the whole output
    - and also input fragments used
    - (the assembled score information)

((@@GK sugestion: do we agree?)):
The ouput DMO provenance will include provenance from the NiN inputs.  This would be augmented with provenance about the assembly process thyat is specific to the remixer, effectively being a record of what happened in what might be considered a MELD "session".  As such, I would expect the provenance in the output "DMO" to be provided via the remixer export.

@@TODO: It would help to reference a diagram and/or example that shows how the vocab parts fit together.  Add reference when available.
