# Maintaining SOFA session state as a DMO accessible using LDP

At the time of writing, SOFA maintains its state internally, with no serialized copy to allow resumption or sharing.  These notes are based on discussions (initially on 2018-11-27) to update SOFA to maintain its state, and resulting musical composition, as a sharable DMO accessible using LDP.


## Terminology

**Working set**: A collection of annotated music fragments, such as those created by Numbers into Notes.

**Channel**: a musical part, or voice, that corresponds to the performance of a single instrument or voice though the duration of a composition.

**Session**: a series of user interactions involving one or more working sets, during which a composition is assembled from available fragments.

**Cursor**: a locatrion in the SOFA composition grid that is currently selected for editing (such as assigning a fragment).


## Architecture revisions

### Current behaviour

This is a conceptual description of how SOFA functions, not a definitive sequence of operations.  The intent is to expose the kinds of functionality that define or are supported by the sessiion state.

1. Load a working set.  Accesses the Working set at a user-specified (or configuration-defined default) URL.  The working set presents as an LDP container, with each fragment being an item within that container referencing some MEI, and maybe some other metadata.

2. Add/remove channels (voices).  Initial default is 3 channels, but the number may be increased or decreased by the user.

3. Select an instrument for each channel.  The instruments are enumerated by examining annotations of fragments in the current working set (which in turn are provided by a pitch range annotation agent).  Default values may be defined by system configuration (?).

4. Select match criteria to be applied when presenting fragments for selection.  The available criteria are enumerated by examining annotations of fragments in the current working set.  Some criteria are implicitly enabled, and hence are not available for selection or deselection

    @@NOTE: I think the greyed out selection checkboxes should also be ticked.

5. Position "cursor" in the grid under construction.  SOFA displays musical fragments that are available for selection based on selected match criteria.

6. Select a fragment from compatible offerings.  Fragment is inserted in the grid at the cursor position.

7. (repeat)

8. Other editing functions:  cell at cursor may be cleared (assigned fragment removed), replaced by a new fragment selection, column inserted, column removed, change instrument for channel.  Some of these may render existing selections incompatible, and these are highlighted.


Currently, the selection criteria are completely transient:  compatibility is based on whatever selection criteria happen to be active when a selection is offered.  Similarly, flagging of incompatible fragment is based on current selection criteria, which may differ from those in effect when a selection was made.  (For the purposes of a research demonstrator, we may live with this, but I feel it could lead to surprising behaviour in active use.)

(We also discussed whether instrument compatibility should be a selectable criteria.  I have seen performers play an instrument outside its normal range (e.g. by plucking a stringed instrument on the "wrong" side of the bridge).  Should we not allow for this kind of escape from normal playing?)


### Revised behaviour allowing for resumable/sharable session state

The main differences are:

1. Modified session state is saved (obviously!).  We considered (a) continuous automatic save, (b) periodic automatic save, (c) manually invoked save.  Option (a) was considered preferable and achievable, and our ensuing discussions focussed on that, but other options are not excluded.

2. Existing session state may be loaded, as an alternative to creating a new session.

3. The system needs to know where to load and/or save the session state.  

We envisage that SOFA offers two (additional) user options:

- a "New session" option, that initiates a new session with an empty grid.  As part of this, the user specifies the URL of an LDP container where the session state is to be stored, and a requested name for the new session.  An LDP server may use (and respond with) a URL incorporating a different name.

- an "Open session" option, that loads some existing session state.

In the case of creating a new session, we also need to have a means to associate a working set with a session.  This is accomplished using the existing "Load working set" option.  This could be generalized to allow multiple working sets in a session, but an initial deployment does not need to include this.  An alternative for research demonstration purposes is to use an external tool to create a merged working set from existing ones, and load that.

When opening an existing session, the previously accessed working set(s) are also accessed.

While working in a session, each change to the music grid, and certain other changes, are written to the session state.


## Session state representation (proposal)

A session state is represented as an LDP container.  Within the container are:

1. Exactly one "grid" item, which is referenced in the container metadata.

        <composition-grid-URI> a sofa:Grid ;
            sofa:workingSet <working-set-URI> ;
            sofa:matchService <match-service-URI> ;
             :
            (other composition-wide metadata)
             :
            sofa:num_rows ... ;
            sofa:rows 
              [ a rdf:Seq ;
                rdf:\_1 <row-1-URI> ;
                 :
              ] ;
            .


2. A number of "row" items, one for each channel of the composition.

        <composition-row-uri> a sofa:Row ;
            sofa:instrument <instrument-type-URI> ;
            sofa:pitch_range ... ;
             :
            (other composition-row metadata)
             :
            sofa:num_cols ... ;
            sofa:cols
              [ a rdf:Seq ;
                rdf:\_1 <cell-1-URI> ;
                 :
              ] ;
            .

3. A number of "cell" items, one for each column of each row in the composition grid.

        <composition-cell-URI> a sofa:Cell ;
            sofa:fragment <fragment-description-URI> ;
             :
            (other composition fragment metadata)
             :
            .

    If a fragment has not yet been assigned to a cell, the `sofa:fragment` statement is omitted.

    If a fragment has been assigned, a cell item may in future also contain references to a number of match annotations that were active for the selected cell.  This will allow SOFA to reinstate the active filter selection when the cell is selected after a session reload, or after the active filter selection has been changed.  It will also allow SOFA to re-evaluate fragment compatibility with respect to the selection filters that were active when the fragment was selected.  @@REVIEW THIS

The above items are represented as web resources contained by the session state container, each containing an RDF graph represented in some suitable format for which LDP support is mandatory (e.g, Turtle).

When grid metadata is updated, the state can be updated by a single PUT operation.

When row metadata is updated, the state can be updated by a single PUT operation.

When a fragment is selected, the state can be updated by a single PUT operation.

When a row is added or deleted, the state can be updated by a single POST or DELETE operation for the row description, plus a single PUT to update the grid description.

When a colums is added or deleted, the state can be updated by a POST or DELETE operation for each cell description, plus a PUT to update each row description.

@@There was some discussion about whether the selected filter criteria should be saved.  To some extent, that would be covered by saving active match annotations for each selected fragment.


## Sequence data access patterns

@@This is a prompt/placeholder from a meeting held 2018-12-04 (KP/DL/JP/GK), to hopefully seed continuing thoughts and discussions.@@

Can we crystalize data access and update patterns to sequence-oriented data that are applicable across different MELD applications?  And can such patterns be implemented in common MELD core library components?

SOFA pushes the MELD design by being update-intensive compared with other MELD applications (except maybe the Jam sesssion, where the nature of the updates was more linear - or additive?).

(MELD interactions with sequence: more common to "blus" between grid "columns" than between "rows".)

(GK: think about alternative grid designs in LDP - esp. grid-like thing - a _quilt_? - as single resource.)

