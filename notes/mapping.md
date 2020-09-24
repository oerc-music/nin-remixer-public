
# Mapping between architecture and technology choices (WiP)

Fragment "DMOs":
  * Reposibilty of NiN to store/serve
  * GK suggestion: record in LDP container(s)/potentially SoLiD

Fragment matching:
  * Annotation container/LDP container (GK: maybe LDN "inbox"?)
  * Multiple containers for different "axis" of compatibility
  * Do we need a SPARQL endpoint to support query over a potentially large set of matches

Working Set(s):
  * potentially "MELD" style annotations in an LDP container/s

Cursor Position:
  * Held within front end

Export DMO:
  * ???

Current score/Audio:
  * Created as MEI in browser, and rendered to audio via MIDI


## GK's suggestions from email:

1. For the interface between NiN and the remixer: LDP container (or SoLiD). This suggests that NiN might be modified to save its data to an LDP container; the container URI could be input to both the compatibility service and the remixer.  Possibly with LND "inbox" to signal changes.

2. For compatibility service outputs: an Annotation container, storing Annotations describing various fragment matches discovered.  This might be augmented with some kind of query function or specialized API or separate index store to allow simple discovery of compatible fragments according to various criteria.  Possibly with LDN "inbox" to signal new matches found.

3. Fragment working set: an LDP Container (or SoLiD).  This would be where the remixer accumulates the set of fragments available for use in a resulting composition.

4. Exported DMO: LDP Container (or SoLiD);  maybe presented as an archive package (cf. https://datatracker.ietf.org/doc/draft-soilandreyes-arcp/)

From https://github.com/oerc-music/nin-remixer-public/blob/master/notes/NiN-remixer-Arch.jpg (where not already covered)

5. Timeline (not "score"!), under construction: internal structure, possibly backed by a local file or triple store for state persistence.  Possibly an annotation container?

6. Cursor (current position in timeline): internal variable, possibly in the form of a special item in the Timeline.

7. Session history (incl provenance info): a MELD session?  (i.e. an annotation container with currently active ("joined") participant(s)


