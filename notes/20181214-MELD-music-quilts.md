# Quilts: a family of representation for MELD scores

> NOTE:  My original approach started looking to be not-very-tractable, so I'm taking a slightly new tack.  Rather than trying to design a uniform interface, I'm planning to articulate some use cases and define interfaces for these, with the goal of recognizing sharable elements.  My original notes are currently retained at the end of the document: look for "Original notes".

## Background

All MELD applications, at some level, deal with a structural representation of some music.  What these notes attempt is a chaacterization of some properties that should be exhibited by these representations.

A typical form of representation might reflect the structure of a musical score, which presents as a two-dimentsional structure with successive bars or measures arrayed horizaontally, and different "voices" or instruments arrayed vertically.

A simplistic appoach might be to present the structure as a grid, but discussions have suggested there are enough exceptions to make this could be rather limiting. So, to frame the discussion, a more general 2-dimansional arraying of the data is being considered, which we call a "quilt" (think of a patchwork quilt of random rectangular elements), and constraints on this general structure that reflect music representation requirements of MELD applications.


## Definitions

@@ Set out some terms and structural elements used to discuss the issues.

A ***fragment*** is a piece of music that may be part of some musical work.

A ***sequence*** is an ordered list of fragments that may part of some musical work.  The fragments within a sequence are not necessarily dense (i.e. congiguous with respect to the complete musical work) - elements of the music may be omited from a sequence if they are not relevant to some particular purpose.   Within a sequence, *index* values (see below) may be used to identify particular fragments.  Where the fragments within a sequence are complete with respect to the duration of some musical work, the sequence is ***dense***;' otherwise, it is ***sparse***.

A ***quilt*** is a collection of *fragments* that are arrayed over two dimensions.  There is no assumed alignment of fragments in either dimension.

A ***@@cosequence*** is a *quilt* in which *fragments* all lie in distinct rows (sequences), but which are not necessarily column-aligned.

A ***grid*** is a *quilt* (and also a *cosequence*) in which *fragments* all lie in diutinct rows and columns. 

An ***index*** is a value that may be used singly to identify a fragment within a sequence, or pair-wise to identify a fragment within a quilt.

@@types of indexes: continuous, discrete positional, discrete ordered, discrete unordered...


## Use cases

Score

Muzicode

Single-voice midi

Multi-moice midi

...















# Original notes

## Structural options

Define:

- fragment
- index: a set of "scalar" values; may be continuous (e.g. real), ordered discrete (e.g. integers), or unordered discrete (e.g. instruments)
- index space: 2 (or more?) indexes
- arrangement: set of fragments and index space such that there is at most one fragment corresponding to each combination of index values in the index space (1 value from each index)

Fragments are non-overlapping.  Each point (index value) is covered by no more than 1 fragment.

"Temporal" refers to left-to-right arrangement of fragments.  I single sequence of left-ro-right fragments is called a "row".

"Channels" or "voices" refer to different groups of fragmends that occupy the same range of left-to-right 

- sequence: a sequence of musical fragments (without gaps)
- grid: multiple sequences of musical fragments (e.g. instruments), where all fragments covering a partiocular point in tiume have the same start and end times.  Thus, for any fragment there is a unique predecessor and successor, and also a unique cotemporaneous fragment in every other sequence.
- co-sequences: multiple sequences of musical fragments, where each fragment in a sequence may have start and end times different from fragments in other sequences.  Thus, for any fragment there is a unique predecessor and successor, but maybe multiple cotemporaneous fragments in other sequences.
- quilt: multiple fragments that don't group into distinct sequences: a fragment at one point in time may overlap multiple distinct fragments at different points in time.

Additionally, there may be ordered and unordered relationships.  Typically, fragments in a row are ordered (e.g., temporally), and fragments in different channels are unordered.

There may also be sparse variants of the above options (i.e. positions in the overall sequence/grid/quilt for which there is no fragment.)


## Fragment access patterns

In practice, we don't see any use of fully generalized quilts, but (at least some of) the index patterns should make it theoretically possible to access fragments in a quilt.

In the following, let:
- I1, I2 be indexes, and i1 in I1, i2 in I2, etc.
- F be a collection of fragments, and f in F
- Q be a quilt
- C be a co-sequence structure
- G be a grid structure
- S be a sequence structure
- Err be anb error description


### Direct access

    direct_fragment: (Q -> I1 -> I2) -> Maybe F
    fragment_index:  (Q -> F) -> I1 * I2 
        - for f in F, any i1, i2 s.t. (direct_fragment q i1 i2) == Just f
        - for continuous indexes, this is under-specified.  Implemantation may return any satisfying value, and should do so consistently (i.e,. repeatably for same fragment)

    direct_row:  (Q -> I1) -> Maybe S
    row_index:   (Q -> S) -> I1


### Relative/sequential access

    row_seq_next: (C -> F) -> F
    row_seq_prev: (C -> F) -> F

    col_seq_next: (G -> F) -> F
    col_seq_prev: (G -> F) -> F

Invariants:

    row_seq_next . row_seq_prev == row_seq_prev . row_seq_next == id
    col_seq_next . col_seq_prev == col_seq_prev . col_seq_next == id
    row_seq_next . col_seq_next . row_seq_prev . col_seq_prev == id
     :
    (etc.)


### Direct replacement updates

    grid_cell_replace:     (G -> I1 -> I2 -> F) -> Either G Err

?? row replace ?
?? col replace ?


### Other direct updates

Deletion in grid is relatively easy:

    grid_row_delete:       (G -> I1) -> Either G Err
    grid_col_delete:       (G -> I1) -> Either G Err

For insertion, if we specify the new index value to be inserted, we could assume existing ordered values are pushed up.

    grid_row_insert_range: (G -> (I1 x I1) -> Either G Err

    grid_col_insert_index: (G -> I2)       -> Either G Err

Assuming, for now:

I1 is metric index: higher values are bumped up
I2 is discrete index: new value, existing values unchanged (ordering optional)

?? How to handle co-sequences?


### Relative updates

No new API?  Use access/insert/delete APIs + direct replacement

