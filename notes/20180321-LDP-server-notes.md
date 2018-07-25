# Summary of responses to quastion about LDP servers

## Fedora

(Summary: this looks promising.  The fact that Fedora/Duraspace are established and well-known in the HE/libraries domain seems advantageous to me.)

- awoods(at)duraspace.org

The Fedora Repository application is an LDP server, that supports all three
container types, installs as a drop-in war file or (for testing) as an
executable jar file, and is actively maintained.

- https://github.com/fcrepo4/fcrepo4/releases
- https://wiki.duraspace.org/display/FEDORA475/Quick+Start
- http://fedorarepository.org/features

Feel free to experiment with our demo server:
- http://demo.fcrepo.org:8080/fcrepo/ (fedoraAdmin:secret3)

Please reach out if you have any questions: fedora-tech(at)googlegroups.com


## ldnode/node-solid-server

(Summary: could be worth revisiting?  The implied solid connection might be useful in the future.)

- melvincarvalho(at)gmail.com

ldnode is now called node-solid-server -- it implements LDP and a few other
things :

- https://github.com/solid/node-solid-server

It's actively maintained.  Feel free to drop in to our chat room if you
have installation issues.

- https://gitter.im/solid/node-solid-server

It's also now possible to install via docker.


## Gold

(Summary: look for an alternative when time permits?)

- melvincarvalho(at)gmail.com

Gold isn't actively maintained but if someone with Go experience had time to
help out, that would be welcome!


## Mayktso (Dokieli)

(Summary: interesting option for experimentation, especially given some support for annotations, and Sarven's association with Solid.  But probably not an off-the-shelf choice for a production service.)

- info(at)csarven.ca

I've built mayktso (pronounced "make it so"):

- https://github.com/csarven/mayktso/

initially for the LDN test suite (sender, receiver, consumer). Then
extended to do more of LDP. I haven't run it through the LDP test suite
but it probably covers the essentials as far as I can see.

The current development is based around experimenting with LD related
functionality for dokieli:

- https://dokie.li/

and pretty much the minimal that I expect from a LD/Web server nowadays.

It understands bits of ActivityPub (Outbox) and Web Annotation Protocol.

An extremely basic shape checking towards:

- https://linkedresearch.org/cloud

I use it to offer a public endpoint for oa:annotationService for people
to test dokieli annotations who don't have their own pim:storage.

It currently doesn't do authentication/authorization but it can be
added. I didn't want to invest time into that because I wasn't planning
to turn into a project. Check out other projects like node-solid-server
or Virtuoso Universal Server if you want proper/planned coverage of that.

mayktso isn't built or maintained for other people to use necessarily,
but you're welcome to try it out. It can be extendable if you need other
things. Contributions welcome. I hack at it to quickly get what I need
to move dokieli forward.

There is quite a bit of overlap with the dokieli core code - initially
borrowed code from dokieli - so one of my todos is to realign them.
dokieli is modularised so, mayktso will probably follow along. I've
plans to implement the Fedora spec probably in the summer, so I can
check it against dokieli.

See also:

- https://linkedresearch.org/ldn/tests/summary#ldn-report-receiver

for other LDN Receiver implementations which also do LDP.


## Semantic forms

(Summary: work-in-progress, not an obvious choice for us)

- jeanmarc.vanel(at)gmail.com

If you're willing to use a work in progress, there is semantic_forms :
https://github.com/jmvanel/semantic_forms/blob/master/scala/forms_play/README.md#play-framework-implementations

I have not passed an official test suite (https://w3c.github.io/ldp-testsuite/) .

SF is a sparql database, which stores the LDP data (every LDP resource is a
named graph).

SF has other interesting features:
- Features (http://deductions.github.io/doas.owl.ttl#features) http://semantic-forms.cc:9112/display?displayuri=http%3A%2F%2Fsemantic-forms.cc%3A9112%2Fldp%2Fsemantic_forms#http-3A-2F-2Fdeductions.github.io-2Fdoas.owl.ttl-23features
- Graph database http://semantic-forms.cc:9112/display?displayuri=http%3A%2F%2Fdbpedia.org%2Fresource%2FGraph_database

(and later...)

I started passing the official test suite on my LDP server, semantic_forms,
and the result is currently:

    Total tests run: 90, Failures: 38, Skips: 27 - Passed 25

I'm willing to fix, but the correspondence between the failure messages and
the actual HTTP requests is not obvious, so I made an issue on the test
suite github:

    https://github.com/w3c/ldp-testsuite/issues/230

If anyone among the LDP server developers is willing to shed some light ...
That would be nice.

## Non-LDP servers

I git a couple of responses about non-LDP servers, which I shalln't include here.

But I did get this message dumpimng on the very idea of using LDP:

> LDP is a fundamentally flawed specification. If you had followed its development, it was more an attempt by IBM to get a W3C stamp over in-house Linked Data system, rather than a serious effort to make it a central part of the future Semantic Web architecture. It has no formal semantics.

> If your architecture stores RDF in a triplestore with SPARQL support, you can take a look at LDT -- an ontology-based read-write Linked Data spec our company has developed: https://atomgraph.github.io/Linked-Data-Templates/ Unlike LDP, it does have formal semantics.

I think the criticism may be about elements that go beyond LDP "basic containers", which I think is all we're planning to use.

# Other choices

## Apache Marmotta

I did  a little digging around, and concluded it wasn't quite as moribund as John suggested - there's more recent work on other repo branches - but no full release for 3 years still isn't encouraging.

## Virtuoso

Although Virtuoso has a bit of a repuation of being difficult to set up, the software seems to have performed well in use, and I was impressed by their page of examples of LDP support.

Also mentioned as a possibility by Sarven.

From what I've seen so far, my choice would be between Virtuoso and Fedora for a "production" service (though I'd still wantto consider Callimachus)

