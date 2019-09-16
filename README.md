# SDG-Links text extraction API
An API for extracting text from different file types (PDF, DOC, HTML, etc.) (part of the SDG-Links app)

### Running 

> python app.py

### Example requests & responses

#### /api
Request:
```
POST /api HTTP/1.1
Host: localhost:5001
Content-Type: multipart/form-data
Accept: */*

Content-Disposition: form-data; name="file"; filename="/C:/Users/szymo/Downloads/2_Why-it-Matters_ZeroHunger_2p.pdf
```

Response
```
{
    "text": "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nWhat’s the goal here?\nTo end hunger, achieve \n\nfood security and improved \n\nnutrition and promote \n\nsustainable agriculture\n\nWhy?\nExtreme hunger and mal-\n\nnutrition remains a barrier \n\nto sustainable develop-\n\nment and creates a trap \n\nfrom which [.....]",
    "lang": "en",
    "size": true
}
```

#### /apiURL
Request:
```
POST /apiURLcashed HTTP/1.1
Host: localhost:5001
Content-Type: application/x-www-form-urlencoded
```

Body:
```
http://www.transforming-tourism.org/goal-14-life-below-water.html
```

Response:
```
{
    "text": "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nGoal 14: Life Below Water | The Agenda 2030 and Tourism\n\n\n\n\n\n\t\n\t\t\n\t\t\tx\n\t\t\n\n\t\t\n\n\t\n\n\n\tZu den Inhalten springen\n\n\t\n\n\t\t\n\t\t\t. \n\tAbout the Project. \n\tContact. \n\tDownload complete publication. \n\n\n\n\n\n\n\tAbout\n\tCompendium on Tourism in the 2030 Agenda\n\n\n\nTransforming Tourism\n\n\n\n\n\nHerzlich willkommen bei Transforming [.....]",
    "lang": "en",
    "size": true
}
```



#### /apiURLcashed

Request:
```
POST /apiURLcashed HTTP/1.1
Host: localhost:5001
Content-Type: application/x-www-form-urlencoded
```

Body:
```
examples/1/data.json
```

Response:
```
{
  "spacy": {...},
  "query": {...}
}
```
