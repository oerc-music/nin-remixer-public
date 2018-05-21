#!/usr/bin/python
# -*- coding: utf-8 -*-

import os, os.path
import json
import xml.etree.ElementTree as ET

# <Instrument id="db-piccolo">
#       <longName>D♭ Piccolo</longName>
#       <shortName>D♭ Picc.</shortName>
#       <description>Piccolo Flute in Db</description>
#       <musicXMLid>wind.flutes.flute.piccolo</musicXMLid>
#       <transposingClef>G</transposingClef>
#       <concertClef>G8va</concertClef>
#       <barlineSpan>1</barlineSpan>
#       <aPitchRange>75-106</aPitchRange>
#       <pPitchRange>75-109</pPitchRange>
#       <transposeDiatonic>8</transposeDiatonic>
#       <transposeChromatic>13</transposeChromatic>
#       <Channel>
#             <program value="72"/>
#       </Channel>
# </Instrument>


# {
#   "@id": "Instrument/clarinet",
#   "@type": [
#     "micat:Instrument",
#     "annal:EntityData"
#   ],
#   "annal:id": "clarinet",
#   "annal:type": "micat:Instrument",
#   "annal:type_id": "Instrument",
#   "annal:uri": "http://annalist.net:8000/annalist/c/MusicalInstruments/d/Instrument/clarinet/",
#   "micat:InstrumentTypeId": "http://id.loc.gov/authorities/performanceMediums/mp2013015354",
#   "micat:instrument_type": "wind",
#   "rdfs:comment": "An approximately tubular instrument with a mouthpiece, ...",
#   "rdfs:label": "Clarinet"
# }

def get_instrument_data(instrument):
    i_data    = None
    shortname = instrument.find("shortName")
    longname  = instrument.find("longName")
    if (shortname is not None) and (longname is not None):
        i_id   = instrument.attrib['id'].replace("-", "_")
        i_data = (
            { "@id": "Instrument/%s"%(i_id,)
            , "@type":
                [
                "micat:Instrument",
                "annal:EntityData"
                ]
            })
        i_data["rdfs:label"]   = longname.text
        description = instrument.find("description")
        if description is not None:
            description_text = description.text
        else:
            description_text = ""
        i_data["rdfs:comment"] = (
            """## %s\n\n%s"""%(
                longname.text,
                description_text
                )
            )
        i_data["annal:id"]      = i_id
        i_data["annal:type"]    = "micat:Instrument"
        i_data["annal:type_id"] = "Instrument"
        musicXMLid_elem = instrument.find("musicXMLid")
        if musicXMLid_elem is not None:
            i_data["micat:InstrumentTypeId"] = (
                 "micat:musicXMLid/%s"%(musicXMLid_elem.text,)
                 )
        else:
            i_data["micat:InstrumentTypeId"] = ""
        noterange_elem = instrument.find("aPitchRange")
        if noterange_elem is not None:
            noterange = noterange_elem.text
            lonote, hinote = noterange.split("-")
        else:
            lonote, hinote = "", ""
        i_data["sofa:minNote"]  = lonote
        i_data["sofa:maxNote"]  = hinote
        i_data["sofa:minPitch"] = ""
        i_data["sofa:maxPitch"] = ""
    return i_data

def save_instrument_entity(i_data):
    i_text  = json.dumps(i_data, indent=4, sort_keys=True)
    dirname = i_data["@id"]
    try:
        os.makedirs(dirname)
    except OSError, e:
        if e.errno != errno.EEXIST:
            raise
    filename = os.path.join(dirname, "entity_data.jsonld")
    with open(filename, "w") as f:
        f.write(i_text)
    return

def main():
    tree = ET.parse('musescore-instruments.xml')
    root = tree.getroot()
    count = 0
    for instrument in root.iter("Instrument"):
        print("##### %s"%(instrument.attrib['id'],))
        i_data = get_instrument_data(instrument)
        if i_data:
            # i_text = json.dumps(i_data, indent=4, sort_keys=True)
            save_instrument_entity(i_data)
            # print (i_text)
            count += 1
    print("Number of instruments: %d"%(count,))


if __name__ == "__main__":
    main()

