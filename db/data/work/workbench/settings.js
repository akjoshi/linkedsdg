{
  "users" : {
    "admin" : {
      "username" : "admin",
      "password" : "{bcrypt}$2a$10$yyo2HZcxW5DJGlbhQOPoZOjvhx/Uds2FmZ8YBPY8om8yeRLhTT9uK",
      "grantedAuthorities" : [ "ROLE_ADMIN" ],
      "appSettings" : {
        "DEFAULT_INFERENCE" : true,
        "DEFAULT_SAMEAS" : true,
        "IGNORE_SHARED_QUERIES" : false,
        "EXECUTE_COUNT" : true
      },
      "dateCreated" : 1568993040404
    }
  },
  "import.local" : {
    "sdgs-data;;sdg-repo-export.zip" : {
      "name" : "sdg-repo-export.zip",
      "status" : "DONE",
      "message" : "Imported successfully in 2m 11s.",
      "context" : "",
      "replaceGraphs" : [ ],
      "baseURI" : "file:/uploaded/generated/sdg-repo-export.zip",
      "forceSerial" : false,
      "type" : "file",
      "format" : null,
      "data" : "dd660345-4bcd-41f0-b00e-901218db46b8",
      "timestamp" : 1568993141183,
      "parserSettings" : {
        "preserveBNodeIds" : false,
        "failOnUnknownDataTypes" : false,
        "verifyDataTypeValues" : false,
        "normalizeDataTypeValues" : false,
        "failOnUnknownLanguageTags" : false,
        "verifyLanguageTags" : true,
        "normalizeLanguageTags" : false,
        "verifyURISyntax" : true,
        "verifyRelativeURIs" : true,
        "stopOnError" : true
      },
      "xrequestIdHeaders" : null
    },
    "sdgs-data;;sdg-proper-repo-export.zip" : {
      "name" : "sdg-proper-repo-export.zip",
      "status" : "DONE",
      "message" : "Imported successfully in 2m 30s.",
      "context" : "",
      "replaceGraphs" : [ ],
      "baseURI" : "file:/uploaded/generated/sdg-proper-repo-export.zip",
      "forceSerial" : false,
      "type" : "file",
      "format" : null,
      "data" : "9af98ee8-2361-4443-b164-ca6d44759291",
      "timestamp" : 1568994071149,
      "parserSettings" : {
        "preserveBNodeIds" : false,
        "failOnUnknownDataTypes" : false,
        "verifyDataTypeValues" : false,
        "normalizeDataTypeValues" : false,
        "failOnUnknownLanguageTags" : false,
        "verifyLanguageTags" : true,
        "normalizeLanguageTags" : false,
        "verifyURISyntax" : true,
        "verifyRelativeURIs" : true,
        "stopOnError" : true
      },
      "xrequestIdHeaders" : null
    }
  },
  "import.server" : { },
  "properties" : {
    "current.location" : ""
  },
  "user_queries" : {
    "admin" : {
      "SPARQL Select template" : {
        "name" : "SPARQL Select template",
        "body" : "SELECT ?s ?p ?o\nWHERE {\n\t?s ?p ?o .\n} LIMIT 100",
        "shared" : false
      },
      "Clear graph" : {
        "name" : "Clear graph",
        "body" : "CLEAR GRAPH <http://example>",
        "shared" : false
      },
      "Add statements" : {
        "name" : "Add statements",
        "body" : "PREFIX dc: <http://purl.org/dc/elements/1.1/>\nINSERT DATA\n      {\n      GRAPH <http://example> {\n          <http://example/book1> dc:title \"A new book\" ;\n                                 dc:creator \"A.N.Other\" .\n          }\n      }",
        "shared" : false
      },
      "Remove statements" : {
        "name" : "Remove statements",
        "body" : "PREFIX dc: <http://purl.org/dc/elements/1.1/>\nDELETE DATA\n{\nGRAPH <http://example> {\n    <http://example/book1> dc:title \"A new book\" ;\n                           dc:creator \"A.N.Other\" .\n    }\n}",
        "shared" : false
      }
    }
  }
}