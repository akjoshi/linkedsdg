# SDG-Links concept extraction API
A simple REST API for extracting dedicated SKOS taxonomy concepts from text (part of SDG-Links app). 

### Running
> python app.py

### Example request & response

Request:
```
POST /api HTTP/1.1
Host: localhost:5000
Content-Type: application/json
```

Body:
```
{
    "lang": "en",
    "text": "Pesticides and insecticides used in Eastern Europe."
}
```

Response: 
```
{
    "matches": [
        {
            "url": "http://data.un.org/concepts/sdg/cd7de5296a84b9dfb827f4d78b68307c",
            "label": "pesticide",
            "start": 0,
            "end": 1,
            "contextl": "[...] ",
            "phrase": "pesticides",
            "contextr": "and insecticides used in eastern [...]"
        },
        {
            "url": "http://data.un.org/concepts/sdg/cd7de5296a84b9dfb827f4d78b68307c",
            "label": "insecticides",
            "start": 2,
            "end": 3,
            "contextl": "[...] pesticides and",
            "phrase": "insecticides",
            "contextr": "used in eastern europe [...]"
        }
    ],
    "concepts_show_data": [
        {
            "id": "concepts/sdg/cd7de5296a84b9dfb827f4d78b68307c",
            "label": "PESTICIDE",
            "match": [
                {
                    "uri": "http://eurovoc.europa.eu/2357",
                    "source": "EuroVoc"
                },
                {
                    "uri": "http://metadata.un.org/thesaurus/1004839",
                    "source": "UNBIS"
                }
            ],
            "weight": 2,
            "contexts": [
                {
                    "matched_phrase": "pesticides",
                    "quote": " pesticides and insecticides used in eastern"
                },
                {
                    "matched_phrase": "insecticides",
                    "quote": "pesticides and insecticides used in eastern europe"
                }
            ]
        }
    ],
    "concepts": [
        {
            "uri": "http://data.un.org/concepts/sdg/cd7de5296a84b9dfb827f4d78b68307c",
            "label": "PESTICIDE",
            "weight": 2,
            "sources": [
                {
                    "uri": "http://eurovoc.europa.eu/2357",
                    "source": "EuroVoc"
                },
                {
                    "uri": "http://metadata.un.org/thesaurus/1004839",
                    "source": "UNBIS"
                }
            ]
        }
    ],
    "countries": {
        "total": {
            "http://data.un.org/codes/sdg/geoArea/151": {
                "label": "Eastern Europe",
                "source": "geo-all",
                "weight": 1,
                "url": "http://data.un.org/codes/sdg/geoArea/151",
                "name": "Eastern Europe",
                "contexts": [
                    {
                        "matched_phrase": "eastern europe",
                        "quote": "pesticides and insecticides used in eastern europe "
                    }
                ],
                "contexts_list": [
                    "pesticides and insecticides used in eastern europe "
                ]
            }
        },
        "top_regions": [
            "http://data.un.org/codes/sdg/geoArea/151"
        ],
        "show_data": [
            {
                "id": "codes/sdg/geoArea/151",
                "label": "Eastern Europe",
                "weight": 1,
                "type": "region",
                "contexts": [
                    {
                        "matched_phrase": "eastern europe",
                        "quote": "pesticides and insecticides used in eastern europe "
                    }
                ]
            }
        ],
        "matches": [
            {
                "url": "http://data.un.org/codes/sdg/geoArea/151",
                "label": "eastern europe",
                "start": 5,
                "end": 7,
                "contextl": "[...] pesticides and insecticides used in",
                "phrase": "eastern europe",
                "contextr": " [...]"
            }
        ],
        "top_region": "http://data.un.org/codes/sdg/geoArea/151"
    }
}
```
