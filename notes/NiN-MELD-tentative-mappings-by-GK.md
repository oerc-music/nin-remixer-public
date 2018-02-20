# MELD elements possibly appearing in NiN remixer

Ref [Overall architecture](https://github.com/oerc-music/nin-remixer-public/blob/master/notes/Overall-Architecture.jpg)

1. For the interface between NiN and the remixer: LDP container (or SoLiD). This suggests that NiN might be modified to save its data to an LDP container; the container URI could be input to both the compatibility service and the remixer.  Possibly with LND "inbox" to signal changes.

2. For compatibility service outputs: an Annotation container, storing Annotations describing various fragment matches discovered.  This might be augmented with some kind of query function or specialized API or separate index store to allow simple discovery of compatible fragments according to various criteria.  Possibly with LDN "inbox" to signal new matches found.

3. Fragment working set: an LDP Container (or SoLiD).  This would be where the remixer accumulates the set of fragments available for use in a resulting composition.

4. Exported DMO: LDP Container (or SoLiD);  maybe presented as an archive package (cf. https://datatracker.ietf.org/doc/draft-soilandreyes-arcp/)

From https://github.com/oerc-music/nin-remixer-public/blob/master/notes/NiN-remixer-Arch.jpg (where not already covered)

5. Timeline (not "score"!), under construction: internal structure, possibly backed by a local file or triple store for state persistence.  Possibly an annotation container?

6. Cursor (current position in timeline): internal variable, possibly in the form of a special item in the Timeline.

7. Session history (incl provenance info): a MELD session?  (i.e. an annotation container with currently active ("joined") participant(s)

For the purposes of this mapping, [SoLiD](https://solid.mit.edu) can be considerered as LDP (linked Data Platform) with access control and optional notification inbox.
