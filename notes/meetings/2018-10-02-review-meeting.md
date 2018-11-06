These are rough notes from a review meeting held shortly before the industry day.

# FAST project meeting 2018-10-02

KP, MW, JP, GK

# SOFA TODO

(Numbers in brackets cross-ref to SOFA status notes below)

## Needed by SAAM demo (2018-10-09)

- public demo site on Thalassa (new)
- github up-to-date and public (ongoing)
- functional UI for SAAM demo (6, 7)  (may be rough)
- MIDI multi-track playback (1) (will try some parallel effort)

## Need by industry day (2018-10-24)

- repeatable installation (2)
- UI polishing (new)
- session save (5)


# SOFA status

Based on plan from https://github.com/oerc-music/nin-remixer-public/blob/master/notes/meetings/2018-09-07-meeting.md


Expect to hand over for test installation by 2018-09-18 (i.e. by FAST meeting with both MW and JP).
--- didn't happen

Expect instrument UI by end of same week (2018-09-21)
--- didn't happen

1. Complete work on audio generation integration
    - Multi-voice MIDI stream assembly for playback
    - Estimating 1-2d + time to pick up.
--- still no multi-voice
--- individual fragment playback using midi notes in @pnum is working (sort-of - skips 2nd note)

2. Finish setup scripts and notes for demo system (1d)
    - Finishing up of details, tie in to SOFA-Docker (see TODO below)
--- have most in place; docker stuff updated
--- needs new test data (with @pnum) (Regeneration of demo NiN data to include @pnum attrubutes.  Will need to re-run the numbers-into-notes music generation process.)

3. Implement key-signature-correct MIDI note numbers for playback.  Apply and test patch to NiN. (0.5d)
    - Add @pnum to NiN MEI output; test (esp Verovio rendering)
    - If problem (a) maybe ask DDeR for review; (b) revert to note mapping solution.
--- done and works

4. In SOFA: pull note number data for MIDI playback from MEI (0.5d)
--- done and works

5. MUST HAVE: session save logic (1d)

    Save current state of composition, and session setup (e.g. number of channels, instruments selected, etc.)

--- not done (see UI above)

6. MUST HAVE: gather instrument list from instrument pitch range match service

--- uncertain - should be a repeat of existing logic for other services (see UI above)

7. MUST HAVE: UI for instrument selection on each channel (this was a previously unscheduled requirement)

Total effort remaining for the above 2 items (6, 7) is estimated at 1d

--- not done yet


# SOFA display board

- nail design ideas by end this week (2018-10-05)
    -
- draw up ideas (following week?)
- final go/no-go  (2018-10-16)
- print


# Other

GK move to FAST room?
Agree place in room; choose a date
Request move IP/telephone (IT services @ ...), let Judy know when move happens.
Keyfob update?


