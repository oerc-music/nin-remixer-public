
# Matched Fragments

- Represent matches as annotations
- Some kinds of match can be recorded by relating two fragments to a shared concept
    - the "compatible key" match is probably included
    - there are concepts in the Chord Ontology (http://purl.org/ontology/chord/) which relate to the scales and could be useful
    - there is also a Keys Ontology refered to by Music Ontology (http://purl.org/NET/c4dm/keys.owl)
- Other kinds of match may need need to be a pairwise 
    - in which case only make sense within a "working set" (a consideration for the Architecture)

((GK: I think this should be developed separately as a match architecture document, and then come back and add vocabulary details.  I'll add some thoughts below in this document, but suggest that anything adopted should be moved to a separate doc.))

The NiN remixer needs to be able to access fragment match candidates based on a number of criteria:

- match criteria (e.g. deduced key signature(s), rhythmic style, etc.)
- the current state of the work being assembled 
- selected position ("cursor") or elements in the work under construction
- the role of the offered candidates (e.g. following item befiore cursor, preceding item after cursor, fitting between predecessor and successor at cursor, etc)
- the extent of the insert required; e.g. single fragment, multiple fragment, etc.

Not all of these criteria are necessarily resolved by the compatibility service itself.  I would initially propose an interface that indicates that uses:

1. a desgnated fragment
2. a compatibility model
3. a match-before or match-after indicator

I would imagine the remixer itself would be able to use this to assemble longer sequences and/ior satisfy multiple criteria.

A (partial?) REST-style interface for this could look something like:

- a URI that embodies compatibility model and target fragment used to retrieve a list of candiate fragments (@@detail TBD, but I'm thinking of an LDP container per compatibility model (possibly simplified as GET-only))
- candidate fragments returned as Web Annotation(s) that
    - target the indicated fragment
    - have a body that describes a candidate match (@@details TBD), including a reference to the matching fragment and any qualifying information (e.g. match before, match after, etc.)
    - a motivation that indicates the annotation designates a match
    - provenance about how the match was determined (personal annotaton, algorithm id, service reference, etc.)

Staying with the REST/LDP theme, the available compatibility model containers could themselves be enumerated in an LDP container linked from the compatibility service "API home" URI.  Or maybe this container is the primary representation of the service?

I've considered here the response to a match being one match-per-annotation, which means the set of candidates would itself be a collection of some kind (an annoation container?).  An alternaive might be multipk,e matches per anotation, but I feel it would be harder to leverage existing standards (e.g,. LDP, OA) for that.

This interface does not constrain how the service is implemented: your suggestion of linking fragments througn a shared concept could be an implementation and storage strategy, with the service retrieving appropriate stored responses for any given request.  I do think it's important to have a uniform access interface for the remixer to access the compatibility service so that new models can be introduced without having to update the remixer code.

((GK: These are just my initial thoughts; if you have different ideas, or see proiblems, please express them so I can respond - I think we need to converge on some implementable ideas very quickly.))

((GK: as you indicate, I think we also need to consider the context within which the compatibility service operates, and in particular how it knows about fragments to be considered.  The current architecture diagram suggests to me that a working set is built from the outputs of a single NiN instance.  But I think it would be a small step to have possibly more than one instance of NiN contributing, or a single instance feeding multiple working sets.  Then, per the current archiutecture duagram, there are two kinds of working set: one generated by NiN outputs, and another constructed using the remixer.  As these are just(?) collections iof fragments, maybe these can be unified?))

