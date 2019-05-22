# spacy-concept-extraction-api
A simple REST API for extracting dedicated SKOS taxonomy concepts from text

## labels.csv vs sample-labels.csv 

Note that the initial upload of all concepts is a time-consuming task. For testing replace the reference to `labels.csv` with `sample-labels.csv` in the code. 

## Example request & response:

```
curl -X POST \
  http://localhost:5000/api \
  -H 'Content-Type: application/json' \
  -H 'Postman-Token: a63466c2-ae02-46f3-98b3-c09076692f10' \
  -H 'cache-control: no-cache' \
  -d '{
	"text": "According to the Miriam-Webster dictionary, immunology is the science of how organisms defend themselves against diseases or other illnesses"
}'
```

```
{
    "matches": [
        {
            "url": "http://metadata.un.org/thesaurus#1003063",
            "label": "immunology",
            "start": 6,
            "end": 7,
            "context": "[...] to the miriam webster dictionary immunology is the science of how [...]"
        },
        {
            "url": "http://metadata.un.org/thesaurus#1001705",
            "label": "diseases",
            "start": 16,
            "end": 17,
            "context": "[...] how organisms defend themselves against diseases or other illnesses [...]"
        }
    ],
    "clean_text": "according to the miriam webster dictionary immunology is the science of how organisms defend themselves against diseases or other illnesses"
}
```