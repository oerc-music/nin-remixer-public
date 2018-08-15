

export function extractNotesMEI(mei) {
  let parser = new DOMParser()
  let xml = parser.parseFromString(mei, "text/xml")

  //xml.evaluate()
  let meas = xml.getElementsByTagName("measure")
  for (let m of meas) {
    //console.log(m)
    let notes = m.getElementsByTagName("layer")[0].children
    //console.log(notes)
    for (let n of notes) {
      //console.log(n)
      if (n.nodeName === "note") {
        let a = n.attributes
        console.log("NOTE", a.pname, a.oct, a.dur)
      }
      if (n.nodeName === "rest") {
        let a = n.attributes
        console.log("REST", a.dur)
      }

    }
  }
}

