# Notes from review of NiN remixer working sets

(WORK IN PROGRESS)

Generally, this all looks sensible.  I'm making some random comments here as they occur to me. 

1. Suggest changing MEI references (per `mo:published_as`) to thalassa (http://beta.numbersintonotes.net), (and copy over the MEI files if necessary).

2. To align more explicitly with current MELD work, I'd suggest adding additional types to working set fragments, e.g. per https://github.com/gklyne/MELD_Climb_performance/blob/master/20171122-MELD-modelling-climb.svg.  Additional types suggested there are `mo:MusicalExpression` and `frbr:Expression`.  This isn't a big deal, but I find it helps to keep track of how things relate.

3. For discussion:  namespace URIs (`http://numbersintonotes.net/terms#` and `http://remix.numbersintonotes.net/vocab#`).  The URI allocation is a bit inconsistent here.  More importantly, how confident are we that we can maintain persistence of these URIs.  I'd be tempted to suggest something like PURLs (or the current favoured form), or use the domain (say) `id.numbersintonotes.net` with paths `/nin#` and `/ninre#` respectively - this would need to be coordinated and agreed with Dave.  Or, alternatively, maybe look to [vocab.ox.ac.uk](http://vocab.ox.ac.uk/index).

4. per discussion, will you be changing `ninre:FragmentLink` to `ninre:FragmentRef` (or similar)?  Or even just `ninre:Fragment`?

5. Property `ninre:fragment` might be `mo:published_as`?



