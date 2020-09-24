SOFA-architecture-notes.md


## Towards a generic architecture for fragment assembly

The SOFA architecture, which builds upon the MELD framework, is a generic design for assembling elements, or "fragments", into a composed whole.

The original applicaton for SOFA was an interactive tool for guiding the assembly of musical fragments produced by [Numbers into Notes](@@@) into musical compositions, while respecting musical conventions such as musical scale compatibility (using notes from a common musical key) or instrument pitch range (using notes that are playable by a selected instrument).

A second applicaton considered was a re-working of rCalma, in which the individual elements were musical analyses (provided by Sonic Annotator) of multiple performances of a given song.  This application was never completed, but early experiments were performed that demonstrated that some of the 

The presentation and interaction styles of these applications are very different, but they share a common theme of presenting elements from some available population, selected on the basis of some initial (application-dependent) criteria.  In the first instance, selection criteria may be quite broad (e.g. the instruments for which a composition is targeted, or a performer whose songs are to be analyzed).  Subsequent selections may depend on previous selections (e.g., key compatibility of fragments in a composition, or songs by a selected band for which there are sufficient available performances to analyze).

The form of the final assembly is application-dependent.  E.g., a musical composition is modeled as a 2-dimensional array of fragments, in which each row corresponds to an instrument, and each column corresponds to a passage within the overall composition; m each fregment is presented as a secion of musical score.  For the rCalma presentation, the output is modeled as a 1-dimensional array of analyses, each of which is presented as a small graph with summary labels and numbers (the visual presentation is wrapped over multiple rows, but is logically a one dimensional array of elements).

A common theme in both of these applications is that at any point in the assembly process, only a subset of the available elements is compatible for incorporation at a given place in the output.

### Status

The SOFA implementation was a first attempt to use the ideas outlined here.  As such, the the original design and implementation does not fully meet the goals as described.  This document descfribes an idealized architecture, and some of the lessons and design changes that were thrown up by the initial implementation.


## Architecture goals

A leading goal of the SOFA architecture has been separation of concerns:

- separate the framework for compatibility analysis from the framework for presentation of elements

- separation of subsystems used for storage, analysis, presentation and interaction

An associated goal was to permit the use of existing, off-the-shelf server software so that SOFA applications could potentially be deployed against existing cloud-based storage services.  Following MELD, the storage access protocol used is LDP, and our experimentation and testing used a [Solid](https://solidproject.org/) implementation, specifically the [Node Solid Server](https://solidproject.org/for-developers/pod-server).

Separation of presentation from compatibility analysis means that an application front end must be able to discover the analyses that are available for for use with a supplied working set.  The design also allows for new data and new analyses to be added dynamically to a working set, and active displays to be refreshed to show the latest available data.


## SOFA architecture overview

The SOFA architecture builds upon MELD, which in turn builds on the [Linked Data Platform (LDP)](https://www.w3.org/TR/ldp/).  (In particular, it uses only the features of [LDP Basic containers], and does not require support for LDP Direct Containers or LDP Indirect Containers.)


### LDP basics

A **_Resource_** is (typically) a document or data file on the Web that is identified by a URI, and whose content can be retrieved using common Web operations.

An **_RDF Source_** is a _resource_ whose content is available as RDF.

A **_container_** or **_LDP Basic Container_** is a Web resource (identified by a Web URI) that contains a number of other resources.  Using the URI of a container, it is possible to use the Web gain access to metadata about the container, and a list of the resources it contains.  A container is also an _RDF Source_.

See also:

* [Linked Data Platform (LDP)](https://www.w3.org/TR/ldp/).


### Web Annotation basics

(This is a very simplified summary of WebAnnotations as used by MELD - consult the specification for a more complete description.)

A **_Web Annotation_** is an _RDF Resource_ whose content is structured as an [Annotation](https://www.w3.org/TR/annotation-model/#annotations), according to the [Web Annotation](https://www.w3.org/TR/annotation-model/) specification.  A Web annotation minimaly indicates a _target_ resource and (usually) a _body_.

The **_target_** of a Web annotation is, roughly, some resource that the annotation is about.

The **_body_** of a Web annotation is, roughly, something that is claimed about the target resource.

An **_Annotation container_** is just an LDP Container whose contents are _Web annotations_.


### SOFA Concepts

Central to operation of the SOFA Ontological Fragment Assembler (SOFA) is a **_working set_**, or **_workset_**.  These present as an LDP _container_ containing _fragment descriptors_.  Each **_fragment descriptor_** contains a link to the musical fragment data _(expressed as MIDI?)_, and some basic associated metadata such as fragment length, key signature, etc.  This structure is created by Numbers into Notes, any other source of musical fragments may be used that generates this structure.

SOFA accepts a collection of musical fragments, which typically have been generated using the [Numbers into Notes](http://www.semanticaudio.ac.uk/demonstrators/18-ada-lovelace-numbers-into-notes/) application, via a reference to a _compatibility service_ (see [Data model for NiN remixer compatibility service](./diagrams/20180328-nin-match-service-data-model.svg)).

Thus, the starting input to SOFA consists of a reference to a **_compatibility service_**, which is an LDP container containing (references to) the following _annotation containers_ (see compatibility service diagram for more details):

* A **_working set index_**, which collects one or more working sets each asscociated with a _Working set service_.
* One or more **_Working set services_**, each of which references a _working set_, and enumerates _match services_ associated with it, along with associated match service descriptions used to drive elements of the UI (e.g. service label, etc.)
* Several **_match services_**, which correspond to a possible fragment match criteria.  Each of these is materialized as an annotation container that associates compatible fragments (according to the match type represented by the service) with an indicated selected fragment.  The intent is that the SOFA UI can use this to find all candidate matches for a selected target fragment and matct criteria.  Behind the scenes, annotation agents perform analyses of the musical fragment and populate the match service containers.  This structure allows new analyses by new agents to be added in a uniform, way that the SOFA UI can discover and present without having any specific knowledge of the analysis performed.

This design is intended to use hypermedia-based discovery (aka "follow your nose") to allow the generic SOFA UI to discover and present:

* available compatibility criteria (e.g. fragment length, key compatibility, instrument compatibility, etc.)
* for any selected fragment, other available fragments that are compatible under some compatibility criterion.
* labelling and orther information that can be used to drive the UI, and avoid the SOFA application needing detailed knowledge of any specific criterion.

Two areas in which the current design as described falls short of the original separatiopn-of-concern goals are:

* Some compatibility criteria are not fragment-to-fragment indications.  E.g. consider instrument range compatibility, in which fragments are compatible if the use notes in the range of a specified instrument.  In this case, the match entry needs to target a specified instrument rather than another fragment.  This in turn has implications for how the UI would present these criteria.  In the example of the instrument compatibility, this would be applied per-row in the composition matrix, rarther thamn per-cell. Similarly, fragment length comnpatibility would apply per-column.

* The current design assumes that each _working set entry_ associates with a given _working set service_.  This turned out to require duplication of data when looking at the rCalma application for SOFA.  I now think a better aproach would be to allow the _)working set index_ and _working set entries_ to stand independently of any match services.  The match services would still need to be materialized with reference to a specific working set.  The data model design for this aspect needs further thought, but I imagine the _working set service_ (or services) would be treated as distinguished elements in the compatibility service, and hypermedia-based fragment discovery would route via these elements.


### Working together

The separate elements that comprise a SOFA application work toigether via what might be described as a multi-agent [blackboard system](https://en.wikipedia.org/wiki/Blackboard_system).  The "blackboard" in this system is a set of LDP containers: worksets are populated by musical fragment generators (umbers into Notes); match services are populated by compatibility analysis agents that embody specific musical knowledge (e.g., key compatibility)

These elements are tied together by the _working set index_ and _working set service_, which effectively configure the combination of fragments and compatibility criteria that will be employed.

A user-facing SOFA application embodies display organization and element rendering logic that is apppropriate to the assembled composition (e.g. a musical score managed as a 2-dimensional array of score segments, or a linear array of analysis summaries for rCALMA.)


### Compatibility analysis agents

Each compatibility analysis agent typically has deep specialized knowledge of a single aspect of fragment content.  This separation of concerns minimizes constraints on how the agent is implemented - e.g. as a background web service on a server farm for musical analyses requiring intensive computation, or a local "microservice" for analyses based on simple metadata filtering.  In each case, the results of the compatibility analysis are materialized as a container of web annotations.

LDP provides a uniform interface for the SOFA application to access compatibility analysis results independently of how they were obtained, and metadata associated with the results can be used to inform the application how the results may be handled (e.g. per-row, per-colukn, per-cell, etc.; this aspect of SOFA needs more work).


### Follow-your-nose 

"Follow-your-nose" is an informal [Web application pattern](https://patterns.dataincubator.org/book/follow-your-nose.html).  It refers to use of hypermedia (linked data) to contain pointers to what steps are available for an application to follow.  In this way, application logic may be embodied in the data rather than in the application code, and as such may be updated without having to re-write the application.

As an example of the power of this approach, consider the various applications that can be supported by a single common application: the web browser.  There is no knowledge about shopping, banking, insurance, travel, geography, science, education or any number of other topics that is embodied in a web browser.  Yet a web browser can be used to access applications in all of these areas, and much more.  All the relevant application logic and domain knowledge is conveyed in data that the Web browser knows how to navigate in response to user interactions.  (NOTE: this is true even for Web applications that don't use Javascript.)

Hypermedia is used here as a way to compose a limited number of predefined hard coded operations using follow-ypur-nose principles.  The design of SOFA uses a limited number of underlying structural patterns for selecting and combining fragments; for musical compositions these include:  sequencing of fragments within a row (voice), selection of row-compatible fragments based on instrument pitch range, same-length fragments in a column, etc.  Each of these would at some level be coded into a SOFA application.  (It may be that structurally similar criteria could apply across different applications.)  The choice of compatibility criteria is open-ended.  The hypermedia-driven follow-your-nose design allows the composition patterns to be applied in accordance with compatibility criteria, where each criterion would associate with a given composition pattern.

A recurring pattern in the SOFA design is the use of an annoitation container as a lookup table (i.e. a map, or function, in the mathematical sense).  The data design is intended to use a common access pattern in anotaton containers:  given a given resource (URI), find all annotations in the container that target that resource.  The use of an Annotation container as a map, accessible via the uniform interface of LDP, togetherwith a little knowledge of Web Annotations, turns out to be a very powerful construct, where details of the functions thus presented are known only to the agents that create the compatibility data. (But see also the section below about performance.)

See also:

* https://www.w3.org/TR/webarch/#hypertext
    * (It's about follow-your-nose without actually using that phrase)
    * https://www.w3.org/DesignIssues/HTML-XML
        * (Discusses "follow-your-nose" principle)
* https://roy.gbiv.com/untangled/2008/rest-apis-must-be-hypertext-driven
    * https://roy.gbiv.com/untangled/2008/rest-apis-must-be-hypertext-driven#comment-730
* https://classes.cs.uoregon.edu/04W/cis607dsl/papers/bentley-LittleLanguages.pdf
    * (I'm considering hypermedia here as a kind of "little language")


## Implementation challenges and lessons

This section ams to higlight some of the lessons, and things to be done, or done differently, based on the experience so far with SOFA.


### Performance of annotation lookup by target

A big performance bottleneck is the searching an annotation container to find annotations that target a given resource.  This was anticipated, with the expectation that once annotationm container access patterns had been worked out, a middleware layer could be used to provide faster access by maintaining an index.  This would represent an extension to the LDP protocol, but one which could be implemented on top of any existing LDP server.  This middleware has not yet been implemented.


### Separate working set dependency on match service

The design which requires a working set to reference a corresponding match service turned out to be limiting when we looked at using SOFA ideas to re-implement rCALMA.

With the benefit of experience, I would aim for the working set to stand aone, where it could potentally be accessed using a number of different match services.  

This change would allow agents that are used to assemble a working set can operate without requiring the match service to be available at the time (e.g. when rCALMA assembles a working set of songs by an artist for which more thasn 100 performances exist in the live music archive).

I anticipate the following changes to the data model:

* The _working set index_ would no longer reference a _working set service_

* The _working set service_ would be remain as-is, but probably renamed as something like _working set match service_ for clarity.  This service would exist without reference to a working set, only selected members of some working set.

* Responsibility for associating a _working set match service_ with a _working set_ (via _working set index_) would lie with the _Compatibility dservice_ container).

A consequence of these changes would be that spoftware elements that operate on a _working set_ and a _working set match service_ would need to be supplied with references to both, rather than being able to discover the _match services_ by following links from the _working set index_.


### Allow for diverse compatibility patterns

The original design allows only for fragment-to-fragment compatibility discovery.  But in practice, other forms of discovery were required - e.g. discovery of fragments playable on a specified musical instrument.

Some work is required to extend the model to recognize such requirements in a way that remains generic.

My starting point for such work would be to consider the structural natiure of the composition being assembled by the SOFA application.  For example, the musiocal fragment assembler generates a grid in which each row is associated with an instrument, and each column with a subsequence of the overall compositoon, where all fragments in that column would be played at the same time.  This raises the following compatibility options to be considered:

* row/fragment compatibility (e.g. fragments playable on an instrument)

* fragment/fragment compatibility withn column (e.g. fragments of same length)

* fragment/fragment compatibility within row (e.g. using a consistent set of chords?)

* fragment/fragment compatibility overall (e.g. using consistent key signature)


### Agent triggering

The use of independent agents for maerializing match service containers presumes that the agents can know (or be told) when they need to be run.  The original intent was that addition of new fragments to a working set would be a trigger to activate relevant agents, but this was never implemented.  This would be less easy to realize under the suggested separation of match services and working sets (see above), so some additional thought will be needed to decide when to activate an agent.

The original design also assumed (implicitly) that agents would be able to easily determined what new analyses were required in response to a working set update.

All this suggests a new application-sepcific component (not implemented) that might be described as a _compatibility service watcher_, which would be associated with a single _compatibility service_, and would be responsible to activate analysis agents in response to working set updates, or other events (e.g. discovery of new entries in an external archive, or a deployment of a new version of an analysis algorithm)


### Synchronization issues

The multi-agent approach has assumed that LDP conainer updates are atomic, so do not of themselves present any synchronizaton concerns.

But there is a theoretical possibilities that multiple container contents need to be maintained in synchrony in order to provide consistent results overall.  No example of this requirement has been noticed to date, but if one were to arise, then some additional mechanisms would be needed to ensure multiple container updates could be applied atomically, or with some form of eventually-consistent semantics.



