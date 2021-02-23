# SDG-Links graph query API
API for querying complex paths between different types of SDG-related content (part of SDG-Links app)

### Running

First you need to unzip `cubes.zip`. Then:

> python app.py

### Example requests & responses

#### /api

Request:
```
POST /api HTTP/1.1
Host: localhost:5002
Content-Type: application/json
```

Body: 
```
[
    {
            "uri": "http://data.un.org/concepts/sdg/74d130db422190af7ee03a21b5ac9c70",
            "label": "GREENHOUSE GAS",
            "weight": 1,
            "sources": [
                {
                    "uri": "http://eurovoc.europa.eu/5650",
                    "source": "EuroVoc"
                }
            ]
        },
        {
            "uri": "http://data.un.org/concepts/sdg/505273a0a2bba0111a40f6cccbc55d69",
            "label": "GAS",
            "weight": 1,
            "sources": [
                {
                    "uri": "http://eurovoc.europa.eu/1139",
                    "source": "EuroVoc"
                }
            ]
        },
        {
            "uri": "http://data.un.org/concepts/sdg/9901cc4765b68b08225ec16c01628fa2",
            "label": "NATURAL GAS",
            "weight": 1,
            "sources": [
                {
                    "uri": "http://eurovoc.europa.eu/1141",
                    "source": "EuroVoc"
                },
                {
                    "uri": "http://metadata.un.org/thesaurus/1004336",
                    "source": "UNBIS"
                }
            ]
        },
        {
            "uri": "http://data.un.org/concepts/sdg/7644573ba2d0f018da56179ec035815b",
            "label": "MARINE POLLUTION",
            "weight": 2,
            "sources": [
                {
                    "uri": "http://eurovoc.europa.eu/2535",
                    "source": "EuroVoc"
                },
                {
                    "uri": "http://metadata.un.org/thesaurus/1003920",
                    "source": "UNBIS"
                }
            ]
        },
        {
            "uri": "http://data.un.org/concepts/sdg/644228de21be373bc844b785f6bb9574",
            "label": "FUEL",
            "weight": 4,
            "sources": [
                {
                    "uri": "http://eurovoc.europa.eu/6043",
                    "source": "EuroVoc"
                },
                {
                    "uri": "http://metadata.un.org/thesaurus/1002561",
                    "source": "UNBIS"
                }
            ]
        },
        {
            "uri": "http://data.un.org/concepts/sdg/c6b85e1d12ccb506feb7d143e2fa933c",
            "label": "PARTICULATE MATTER",
            "weight": 1,
            "sources": [
                {
                    "uri": "http://metadata.un.org/thesaurus/1004747",
                    "source": "UNBIS"
                }
            ]
        },
        {
            "uri": "http://data.un.org/concepts/sdg/aaae37cd9d0b5e5be8ed75f0a7a93667",
            "label": "SEWAGE",
            "weight": 4,
            "sources": [
                {
                    "uri": "http://metadata.un.org/thesaurus/1005837",
                    "source": "UNBIS"
                }
            ]
        },
        {
            "uri": "http://data.un.org/concepts/sdg/092ecfa39bf7d7450c63f4096368c57f",
            "label": "MANPOWER",
            "weight": 1,
            "sources": [
                {
                    "uri": "http://metadata.un.org/thesaurus/1003884",
                    "source": "UNBIS"
                }
            ]
        },
        {
            "uri": "http://data.un.org/concepts/sdg/f60b7240f2d9cc961b3d7b84ddf6d380",
            "label": "PRIMARY PRODUCT",
            "weight": 1,
            "sources": [
                {
                    "uri": "http://eurovoc.europa.eu/2748",
                    "source": "EuroVoc"
                }
            ]
        },
        {
            "uri": "http://data.un.org/concepts/sdg/479a809c0b6eaaefd3b1df16f976df06",
            "label": "LAND",
            "weight": 16,
            "sources": [
                {
                    "uri": "http://metadata.un.org/thesaurus/1003580",
                    "source": "UNBIS"
                }
            ]
        }
]
```

Response:
```
{
    "name": "Sustainable Development Goals",
    "children": [
        {
            "id": "http://data.un.org/kos/sdg/12",
            "label": "Goal 12",
            "code": "12",
            "name": "Ensure sustainable consumption and production patterns",
            "children": [
                {
                    "id": "http://data.un.org/kos/sdg/12.2",
                    "label": "Target 12.2",
                    "code": "12.2",
                    "name": "By 2030, achieve the sustainable management and efficient use of natural resources",
                    "children": [
                        {
                            "id": "http://data.un.org/kos/sdg/C200203",
                            "label": "Indicator 12.2.2 / 8.4.2",
                            "code": "12.2.2",
                            "name": "Domestic material consumption, domestic material consumption per capita, and domestic material consumption per GDP",
                            "children": [
                                {
                                    "id": "http://data.un.org/kos/sdg/EN_MAT_DOMCMPC",
                                    "label": "Series EN_MAT_DOMCMPC",
                                    "name": "Domestic material consumption per capita, by type of raw material (tonnes)",
                                    "code": "EN_MAT_DOMCMPC",
                                    "value": 5.2,
                                    "type": "Series",
                                    "keywords": {
                                        "http://data.un.org/concepts/sdg/68c65ef937619abc5a861584b1aa2a25": {
                                            "value": 12,
                                            "label": "NATURAL RESOURCES",
                                            "uri": "http://data.un.org/concepts/sdg/68c65ef937619abc5a861584b1aa2a25",
                                            "sources": [
                                                {
                                                    "uri": "http://eurovoc.europa.eu/3549",
                                                    "source": "EuroVoc"
                                                },
                                                {
                                                    "uri": "http://metadata.un.org/thesaurus/1004343",
                                                    "source": "UNBIS"
                                                }
                                            ],
                                            "concepts": {
                                                "http://data.un.org/concepts/sdg/505273a0a2bba0111a40f6cccbc55d69": {
                                                    "uri": "http://data.un.org/concepts/sdg/505273a0a2bba0111a40f6cccbc55d69",
                                                    "label": "GAS",
                                                    "sources": [
                                                        {
                                                            "uri": "http://eurovoc.europa.eu/1139",
                                                            "source": "EuroVoc"
                                                        }
                                                    ]
                                                },
                                                "http://data.un.org/concepts/sdg/9901cc4765b68b08225ec16c01628fa2": {
                                                    "uri": "http://data.un.org/concepts/sdg/9901cc4765b68b08225ec16c01628fa2",
                                                    "label": "NATURAL GAS",
                                                    "sources": [
                                                        {
                                                            "uri": "http://eurovoc.europa.eu/1141",
                                                            "source": "EuroVoc"
                                                        },
                                                        {
                                                            "uri": "http://metadata.un.org/thesaurus/1004336",
                                                            "source": "UNBIS"
                                                        }
                                                    ]
                                                },
                                                "http://data.un.org/concepts/sdg/644228de21be373bc844b785f6bb9574": {
                                                    "uri": "http://data.un.org/concepts/sdg/644228de21be373bc844b785f6bb9574",
                                                    "label": "FUEL",
                                                    "sources": [
                                                        {
                                                            "uri": "http://eurovoc.europa.eu/6043",
                                                            "source": "EuroVoc"
                                                        },
                                                        {
                                                            "uri": "http://metadata.un.org/thesaurus/1002561",
                                                            "source": "UNBIS"
                                                        }
                                                    ]
                                                }
                                            }
                                        }
...
```

#### /stats

Request:
```
POST /stats HTTP/1.1
Host: localhost:5002
Content-Type: application/json
Accept: application/json
```

Body:
```
{
  "stat": "http://data.un.org/kos/sdg/SI_POV_DAY1",
	"countries": ["http://data.un.org/codes/sdg/geoArea/032"]
}
```

Response:
```
{
    "@context": {
        "Observation": "http://purl.org/linked-data/cube#Observation",
        "measureType": {
            "@id": "http://purl.org/linked-data/cube#measureType",
            "@type": "@id"
        },
        "unitMeasure": {
            "@id": "http://purl.org/linked-data/sdmx/2009/attribute#unitMeasure",
            "@type": "@id"
        },
        ...
    },
    "more_data": true,
    "@graph": [
        {
            "@id": "http://data.un.org/kos/sdg/SI_POV_DAY1/10/1991",
            "@type": "Observation",
            "geoAreaCode": "http://data.un.org/codes/sdg/geoArea/032",
            "yearCode": "1991",
            "http://data.un.org/kos/sdg/SI_POV_DAY1": "1.1",
            "measureType": "http://data.un.org/kos/sdg/SI_POV_DAY1",
            "unitMeasure": "http://data.un.org/codes/sdg/units/PERCENT"
        },
        {
            "@id": "http://data.un.org/kos/sdg/SI_POV_DAY1/10/1992",
            "@type": "Observation",
            "geoAreaCode": "http://data.un.org/codes/sdg/geoArea/032",
            "yearCode": "1992",
            "http://data.un.org/kos/sdg/SI_POV_DAY1": "2.1",
            "measureType": "http://data.un.org/kos/sdg/SI_POV_DAY1",
            "unitMeasure": "http://data.un.org/codes/sdg/units/PERCENT"
        },
        {
            "@id": "http://data.un.org/kos/sdg/SI_POV_DAY1/10/1993",
            "@type": "Observation",
            "geoAreaCode": "http://data.un.org/codes/sdg/geoArea/032",
            "yearCode": "1993",
            "http://data.un.org/kos/sdg/SI_POV_DAY1": "2.4",
            "measureType": "http://data.un.org/kos/sdg/SI_POV_DAY1",
            "unitMeasure": "http://data.un.org/codes/sdg/units/PERCENT"
        }
        ...
    ]
}
```
