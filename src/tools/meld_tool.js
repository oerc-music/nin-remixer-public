#!/usr/bin/env node

'use strict';

/**
 *  Try this command:
 *      meld-tool --help
 */

/**
 *  Module dependencies.
 */

var program = require('commander');
var axios   = require('axios');
var rdf     = require('rdflib');

/*
 *  @@how to access environmental values; esp current user?
 */

var AUTHOR  = "author name";
var DATA    = "current date";
var BASEURL = "default LDP server";

/*
 *  Data
 */

var ldp_request = axios.create(
    { baseURL: BASEURL
    , timeout: 2000
    , headers:
        { "Content-Type": "text/turtle"
        , "Accept":       "text/turtle"
        } 
    })

var prefixes = `
    @prefix ldp: <http://www.w3.org/ns/ldp#> .
    @prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
    @prefix mo: <http://purl.org/ontology/mo/> .
    @prefix frbr: <http://purl.org/vocab/frbr/core#> .
    @prefix dc: <http://purl.org/dc/elements/> .
    @prefix dct: <http://purl.org/dc/terms/> .
    @prefix nin: <http://numbersintonotes.net/terms#> .
    @prefix ninre: <http://remix.numbersintonotes.net/vocab#> .
    `;

var ws_template = `
    <> a ldp:BasicContainer, ldp:Container , ninre:WorkSet ;
        dc:author "@AUTHOR" ;
        dct:created "@CREATED" .
    `;

/*
 *  Command parsers
 */

program.version('0.1.0')
    .usage("[options] <sub-command> [args]")
    // .option('-f, --foo', 'Foo')
    // .option('-b, --bar', 'Bar')
    // .option('-z, --baz [val]', 'baz [def]', 'def')
    ;

program.command("help [cmd]")
    .action(do_help)
    ;

program.command("show-container <container-uri>")
    .alias("sh")
    .description("Write container content to stdout.")
    .action(do_show_container)
    ;

program.command("create-workset <ldpuri> <wsname>")
    .alias("crws")
    .description("Create working set and write URI to stdout.")
    .action(do_create_workset)
    ;

program.command("add-fragment <ldpuri> <wsname>")
    .alias("adfr")
    .description("Add fragment to working set and write fragment URI to stdout.")
    .action(do_add_fragment)
    ;

//@@TODO:
// delete-fragment
// delete-workset
// ...

// error on unknown commands
program.on('command:*', function () {
    console.error(
        'Invalid command: %s\nSee --help for a list of available commands.', 
        program.args.join(' ')
        );
    process.exit(1);
});

/*
 *  Supporting (non-async) functions
 */

function show_container_data(response_data) {
    console.log(response_data);
}

function report_error(error) {
    console.error(error);
}

// program.command("*")
//     .action( (cmd, ...args) => {
//             console.log("Unrecognized command %s", cmd);
//             console.log("Args %s", args);
//         })
//     ;

// console.log('program %s', program);
// if (program.foo) console.log('  --foo');
// if (program.bar) console.log('  --bar');
// console.log('  --baz %s', program.baz);

// program.args.forEach(
//     (val, index) => {
//         console.log(`${index}: ${val}`);
//         }
//     );

function do_help(cmd) {
    helptext = [
        "meld-tool create-workset  <ldpuri> <wsname>",
        "meld-tool add-fragment <wsuri> <fruri>",
        // "",
        // "",
    ];
    helptext.forEach(
        (txt) => { console.log(txt); }
        );
}

function do_show_container(container_uri) {
    ldp_request.get(container_uri)
        .then(response => show_container_data(response.data))
        .catch(error => report_error(error))
}

function do_create_workset(ldpuri, wsname) {
    // OUT=`curl -i -X POST -H "Content-Type: text/turtle" -H "Slug: ${SLUG}" -H 'Link: <http://www.w3.org/ns/ldp#BasicContainer>; rel="type"' $BASEURI --data "@container-filled.ttl"`
    // CONTAINERURI=`echo "$OUT" | tr -d '\r' | grep '^Location: \W*' | cut -d" " -f2`

    /*  Assemble workset container data */

    /*  Post to supplied LDP service URI to create container */

    let p = ldp_request.post(ldpuri, container_data, header_data)
        .then(response => check_status(response.status)
        .then(response => extract_header(response, "location")))

    /*  Check response */

    /*  Extract workset URI from response */

    //   var containerTemplate = prefixes + `<> a ldp:BasicContainer, <${type}> . `
    //   var headers = {
    //       'Link': '<http://www.w3.org/ns/ldp#BasicContainer>; rel="type"',
    //       'Content-Type': 'text/turtle' }
    //   if (slug) headers['Slug'] = slug
    //   var p = axios.post(baseuri, containerTemplate, {
    //     headers: headers
    //   }).then(response => {
    //     console.log(response.status, response.headers.location)
    //     return Promise.resolve(response.headers.location)
    //   })

    // return p

    console.log('  create workset %s in container %s', wsname, ldpuri);
}

function do_add_fragment(ldpuri, wsname) {
    console.log('  add fragment %s in workset %s', fruri, wsuri);
}

function runmain(argv) {
    program.parse(argv);
}



runmain(process.argv)

