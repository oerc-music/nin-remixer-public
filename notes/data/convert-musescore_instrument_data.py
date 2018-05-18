import xml.etree.ElementTree as ET




def main():
    tree = ET.parse('musescore-instruments.xml')
    root = tree.getroot()
