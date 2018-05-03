# Project-meeting 01 May 2018

This document: [2018-05-01](./2018-05-01-meeting.md)

Present: KP, DW, DDeR, JP, GK

Actually, two meetings: 

- first without DDeR, which focused on reviewing progress to date
- the second was focused on preparing a SAAM paper

## Agenda

- [ ] Confirm date for next meeting
    - 2018-05-15 (?)
- [ ] Review actions; note any issues or blockers
- [ ] Review software progress
- [ ] Planning for SAAM paper
- [ ] Review and revise timeline

### Resolutions

### Previous actions carried forward

- [ ] 20180322.4  JP Add notes about proposal for NiN export triggers to GitHub
      - this isn't so urgent, may be allowed to drift
- [ ] 20180322.8  JP Multiple/additional working set import and basic display
- [ ] 20180328.6  JP Fragment assembly / internal score generation (UI and logic)
- [ ] 20180328.7  JP MEI document generation from internal score
- [ ] 20180328.8  JP Audio generation from MEI score (0.5d)
    - looked at previous working code; con luded that it should port OK.
    - blocked on MEI document generation (20180328.7)
- [ ] 20180413.3  JP authenticated access to LDP
    - not an immediate requirement, but should be addressed before allowing external access to remixer.  Will probably be provided via HTTP server proxy.

### New actions

Most actions were not formally recorded.  Those that were include:

- [x] 20180501.1  GK propose interface for auto-generated containers
    - Rough sketch scanned and emailed 2018-05-01
- [x] 20180501.2  GK Circulate terminology proposal
    - Emailed 2018-05-02

- [ ] 20180501.?  ?? ???


### Next meeting

Next meeting: 2018-05-15 (time TBD)

Draft agenda next meeting:

@@TBD@@

- [ ] Set date for next meeting
- [ ] Review agenda
- [ ] Review actions; note any issues or blockers
- [ ] Review development activities
- [ ] Review paper preparation activities
- [ ] ???
- [ ] ???
- [ ] Review and revise timeline


## Review actions

Previous meeting: [2018-04-23](./2018-04-23-meeting.md)

### Previous actions carried forward

- [ ] 20180322.4   JP: Add notes about proposal for NiN export triggers to GitHub
      - this isn't so urgent, may be allowed to drift
- [ ] 20180322.8   JP: Multiple/additional working set import and basic display
      - No activity, ongoing, not a vast amount of work to complete, but not urgent
      - deferred until after demo rehearsal
- [ ] 20180328.6   JP Fragment assembly / internal score generation (UI and logic) (1.5d)
    - Basic logic is done, but UI still needs work
- [ ] 20180328.7   JP MEI document generation from internal score
    - Not complete
- [ ] 20180328.8   JP Audio generation from MEI score (0.5d)
    - Not started
- [ ] 20180413.3   JP authenticated access to LDP
    - not an immediate requirement, but should be addressed before allowing external access to remixer.  Will probably be provided via HTTP server proxy.

### Actions from last meeting

- [x] 20180423.1  GK post meeting notes
- [ ] 20180423.2  JP complete UI for remixer and fregment assembly (0.5d)
    - UI still needs completing
- [ ] 20180423.3  JP complete check MEI output and functionality (0.5d)
    - Incomplete
- [ ] 20180423.4  JP complete and test audio generation from MEI (0.5d)
    - No progress
- [ ] 20180423.7  JP (arising from SAAM meeting) add simple new match services to demo system.
    - Not started

Progress on these items was impeded by VM storage problems, and some tasks (esp. audio playback interactions) proving trickier than expected.

## Review software progress and blockers

Integration still coming together; also time needed to sort server after VM storage failure.

UI for remixer and fregment assembly:
- Outstanding: UI layout improvements
- score cursor (insert point) problems 
- no audio playback yet.

MEI output and functionality:
- Testing and checking still to do.

Audio generation from MEI:
- Outstanding: playback of snippets (problems with audio playback interactions)
- Outstanding: playback of whole thing (from MEI)

Not started on new match services.


## Review requirements for SAAM paper


Front-end:
- Don't currently have UI to select working set container
    - Canned working set isn't enough
    - e.g. provide URI entry box, and more
- Needs tio be clear from display what we're looking at
    - working set?
    - candidate fragments for selection?
    - etc.
- Need to get CSS working for columnar display of selection/options
- Show fragment-related metadata (to underscore semantics)


Back end:
- LDP containers holding anotations
- Separate service to generate compatible keys container
    - code to create annotations works
    - is still manually triggered, which is OK for now

Terminology (to clarify and be consistent with narrative):

Need to generate real data for cmpeling narrative


### Selection of additional match criteria

what are we trying to get over as contribution of paper?
- use of end-to-end semantics
- need to play up this aspect; e.g.
    - semantics from NiN
    - key, mode pulled out from thios and used in assembly process


Two issues
- multi-part (multi-voice)
- quantified constraints (NOT NEEDED FOR NOW)

NEED (for multi-part)
- length match (i.e. same-length)

WANT
- key selection (lockable across time and/or parts)

EASY
- scale mapping (trivally similar to key)
- algorithm mapping (trivally similar to key)

Also to consider:
- external description of ensemble; map to instruments (parts)
- Instrument selection (fixed for part over duration of composition)

ACTION: GK think about discovery of interface for auto-generated containers within match service.

ACTION: GK send email with proposal for naming components


## Additional notes for paper

Separation of concerns; process structure and data specifics (e.g. FP combinators).
Uniform API / REST.  HO fns for quantified matching?

Using linked data instead of new services (uniform interface + representation)


## Planning for SAAM paper

Excerpts from Kevin's email:

This is project SOFA (SOFA Ontological Fragment Assembler) (?)

- Graham is away next week. It is best to assume his contributions will be writing up of the architecture/figures rather than implementation. If there are any questions to him on the architecture or implementation, the sooner the better this week (seeAlso body vs. target discussion).
- John will continue with implementation. We've cleared some of David's other project commitments until after the SAAM deadline so he can help with implementation.
- By default David's implementation assistance would seem best applied to UI elements manipulating the MEI/SVG, and those parts of the services which are likely to be adopted into MELD-web-services in the future (and identifying which those parts are).
- An immediate action for John and David is, therefore, to work out the division of implementation subtasks.
- We should target the end of next week (11th) for wrapping up the additional implementation. This clears the final week for writing.
- KP will write up an outline paper structure based on our discussions and circulate.
- Graham and David are meeting Thursday (2018-05-03) to discuss arch issues.


## Next steps and timeline

Finish off essential parts of remixer demo.

Impement new features for SAAM paper.

SAAM paper writing.

JP time over next 3 weeks - no breaks planned, so 12 days to next meeting.

(See also notes above from KP email)

### Next week timeline

????

### Overall rough timeline

- 2018-05-01 to 2018-05-11

    Basic functionality for SAAM paper

- 2018-05-01 to 2018-05-18

    SAAM paper writing

- 2018-05-01 to ???

    Complete core UI for remixer
    - finish fragment assembly / score generation
    Complete MEI document generation ("score")
    Complete audio playback

- Deferred to later

    DMO Export logic and UI
    - may drop this unless there a clear requirement arises

    Multiple working set import and basic display (0.5d)









<!--

==== very rough notes below ====

Integration stillcoming together; also time needed to sort server after VM storage failure.

- [x] 20180423.1  GK post meeting notes
- [ ] 20180423.2  JP complete UI for remixer and fregment assembly (0.5d)

Basic logic is done, but UI still needs work

Outstanding: layout improvements - score cursor (insert point) problems - no audio playback yet.



- [ ] 20180423.3  JP complete check MEI output and functionality (0.5d)

Testing and checking still to do.

- [ ] 20180423.4  JP complete and test audio generation from MEI (0.5d)

Outstanding: playback of snippets (problems with audio playback interactions)
Outstanding: playback of whole thing (from MEI)

- [x] 20180423.5  JP demo setup preparation and testing (0.5d)
- [x] 20180423.6  JP industry day demo trial run on 2018-04-26
- [ ] 20180423.7  JP (arising from SAAM meeting) add simple new match services to demo system.
    - For this week, to be progressed as and when time permits.



Front-end:


Don't currently have UI to select container;  Canned working set isn't enough.  (URI entry box, and more)

Be clear what we're looking at.

Need to get CSS working for coluimnar display of selection/options

Show related metadata (to underscore semantics)

Terminology (to clarify and be consistent with narrative):
- 



Need to generate real data



JP: time over next 3 weeks - no breaks planned, so 12 days to next meeting.



Back end:

- LDP container holding anotations

- one service to generate compatible keys container (code to create annotations is running)  Still naualy triggered

- 

??? what are we trying to get over as contribution 
- use of end-to-end semantics
- need to play up this aspect; e.g.
    - semantics from NiN
    - key, mode pulled out

-

- Choose 


@@two issues:
- multi-voice
- quantified constraints

- NEED (for multi-part)
    - length match (i.e. same-length) (quantified match)
- WANT
    - key (lockable across time and/or voices)
- EASY
    - scale mapping (trivally similar to key)
    - algorithm mapping (trivally similar to key)

- Also to consider: external description of ensemble; map to instrument
- Instrument selection (lock over time)

ACTION: GK think about discovery of interface for auto-generated containers within match service. PROPOSED.

ACTION: GK send email with proposal for naming components


NOTES for paper

Separation of concerns; process structure and data specifics (e.g. FP combinators).
Uniform API / REST.  HO fns for quantified matching?

@@@ linked data instead of new services (uniform interface)

@@@

-->

